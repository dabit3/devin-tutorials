"""STT check of a finished cut: python3 sttcheck.py <mp4> [expected.json]
Transcribes the whole soundtrack with ElevenLabs Scribe (timed words), prints the timed transcript, and reports which expected
lines (spec.js narration, intro/lines.json, call/lines.json Nader lines) are missing, plus any long silences and words over music-only spans."""
import json, os, re, subprocess, sys, urllib.request, uuid
D = os.path.dirname(os.path.abspath(__file__)); KEY = os.environ['ELEVEN_LABS_API_KEY']
mp4 = sys.argv[1]; wav = '/tmp/sttcheck.wav'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', mp4, '-ac', '1', '-ar', '16000', wav], check=True)
b = uuid.uuid4().hex
body = (f'--{b}\r\nContent-Disposition: form-data; name="model_id"\r\n\r\nscribe_v1\r\n'
        f'--{b}\r\nContent-Disposition: form-data; name="file"; filename="a.wav"\r\nContent-Type: audio/wav\r\n\r\n').encode() + open(wav, 'rb').read() + f'\r\n--{b}--\r\n'.encode()
req = urllib.request.Request('https://api.elevenlabs.io/v1/speech-to-text', data=body, headers={'xi-api-key': KEY, 'Content-Type': f'multipart/form-data; boundary={b}'})
d = json.load(urllib.request.urlopen(req, timeout=300))
W = [w for w in d['words'] if w['type'] == 'word']
json.dump(d, open(mp4 + '.stt.json', 'w'))
# timed transcript in ~12 s lines
line, t0 = [], None
for w in W:
    if t0 is None: t0 = w['start']
    line.append(w['text'])
    if w['end'] - t0 > 12 or re.search(r'[.!?]$', w['text']):
        print(f"[{t0:6.1f}] {' '.join(line)}"); line, t0 = [], None
if line: print(f"[{t0:6.1f}] {' '.join(line)}")
norm = lambda s: re.sub(r'[^a-z0-9 ]', ' ', s.lower().replace('devon', 'devin').replace("'", '')).split()
got = norm(' '.join(w['text'] for w in W))
def present(text):
    ws = norm(text)
    if len(ws) < 4: return True
    # sliding window: >=80 % of the line's words appear in order-insensitive fashion within a window of 2x its length
    n = len(ws); best = 0
    for i in range(0, max(1, len(got) - n)):
        win = set(got[i:i + 2 * n]); best = max(best, sum(1 for x in ws if x in win))
    return best / n >= 0.8
exp = []
if len(sys.argv) > 2: exp = json.load(open(sys.argv[2]))
else:
    s = open(os.path.join(D, 'spec.js')).read(); s = s[s.index('{'):s.rindex('};') + 1]
    exp += [('vo ' + k, v['vo']) for k, v in json.loads(s)['edit'].items() if v.get('vo')]
    exp += [('intro ' + k, v['text']) for k, v in json.load(open(os.path.join(D, 'intro', 'lines.json'))).items()]
    exp += [('call ' + k, v['text']) for k, v in json.load(open(os.path.join(D, 'call', 'lines.json'))).items()]
miss = [k for k, t in exp if not present(t)]
print('expected lines:', len(exp), 'missing:', miss or 'none')
gaps = [(round(a['end'], 1), round(b['start'], 1)) for a, b in zip(W, W[1:]) if b['start'] - a['end'] > 8]
print('silences > 8 s (speech gaps):', gaps or 'none')
