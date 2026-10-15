"""vo_onetake.py gives a voSay line one subtitle chunk for the whole line. Re-split it the usual way with STT word timings.
usage: ELEVEN_LABS_API_KEY=... python3 say_chunks.py <voice-id> <img>...  (run after vo_onetake.py, before build.sh)"""
import json, os, subprocess, sys, urllib.request, uuid
D = os.path.dirname(os.path.abspath(__file__)); V = sys.argv[1]; P = os.path.join(D, 'vo', V, 'lines.json')
L = json.load(open(P))

def stt(wav):
    b = uuid.uuid4().hex
    body = (f'--{b}\r\nContent-Disposition: form-data; name="model_id"\r\n\r\nscribe_v1\r\n'
            f'--{b}\r\nContent-Disposition: form-data; name="file"; filename="a.wav"\r\nContent-Type: audio/wav\r\n\r\n').encode() + open(wav, 'rb').read() + f'\r\n--{b}--\r\n'.encode()
    req = urllib.request.Request('https://api.elevenlabs.io/v1/speech-to-text', data=body, headers={'xi-api-key': os.environ['ELEVEN_LABS_API_KEY'], 'Content-Type': f'multipart/form-data; boundary={b}'})
    return [w for w in json.load(urllib.request.urlopen(req, timeout=600))['words'] if w['type'] == 'word']

for img in sys.argv[2:]:
    e = L[img]; words = e['text'].split()
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(D, 'vo', V, img + '.wav'), '-ac', '1', '-ar', '16000', '/tmp/say_chunks.wav'], check=True)
    heard = stt('/tmp/say_chunks.wav')
    if len(heard) != len(words): sys.exit(f'{img}: heard {len(heard)} words, text has {len(words)}')
    ws = [{'text': t, 't0': h['start'], 't1': h['end']} for t, h in zip(words, heard)]
    gs, g = [], []
    for w in ws:
        g.append(w)
        if len(g) >= 8 or (len(g) >= 3 and w['text'][-1] in ',.:;?!' and w is not ws[-1]): gs.append(g); g = []
    if g:
        if gs and len(g) < 3 and len(gs[-1]) + len(g) <= 10: gs[-1] += g
        else: gs.append(g)
    e['chunks'] = [{'t0': round(max(0, g[0]['t0'] - 0.05), 3), 't1': round(min(g[-1]['t1'], e['dur']), 3), 'text': ' '.join(w['text'] for w in g)} for g in gs]
    for c in e['chunks']: print(img, c)
json.dump(L, open(P, 'w'), indent=1)
