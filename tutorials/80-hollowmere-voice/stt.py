"""ElevenLabs Scribe transcript with word timings for a media file (used to time the cold-open caption pills and to check final cuts).
usage: ELEVEN_LABS_API_KEY=... python3 stt.py <media> [out.json]   -> prints words with start times"""
import json, os, subprocess, sys, urllib.request, uuid
KEY = os.environ['ELEVEN_LABS_API_KEY']; src = sys.argv[1]
wav = '/tmp/stt-' + uuid.uuid4().hex[:6] + '.wav'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-ac', '1', '-ar', '16000', wav], check=True)
b = uuid.uuid4().hex
body = (f'--{b}\r\nContent-Disposition: form-data; name="model_id"\r\n\r\nscribe_v1\r\n'
        f'--{b}\r\nContent-Disposition: form-data; name="diarize"\r\n\r\ntrue\r\n'
        f'--{b}\r\nContent-Disposition: form-data; name="file"; filename="a.wav"\r\nContent-Type: audio/wav\r\n\r\n').encode() + open(wav, 'rb').read() + f'\r\n--{b}--\r\n'.encode()
req = urllib.request.Request('https://api.elevenlabs.io/v1/speech-to-text', data=body, headers={'xi-api-key': KEY, 'Content-Type': f'multipart/form-data; boundary={b}'})
d = json.load(urllib.request.urlopen(req, timeout=300)); os.remove(wav)
words = [w for w in d['words'] if w['type'] == 'word']
if len(sys.argv) > 2: json.dump(d, open(sys.argv[2], 'w'), indent=1)
line, t0, spk = [], None, None
for w in words:
    if t0 is None: t0 = w['start']; spk = w.get('speaker_id')
    line.append(w['text'])
    if w['text'][-1:] in '.!?' or w['end'] - t0 > 6 or w.get('speaker_id') != spk:
        print(f"{t0:6.1f}-{w['end']:5.1f} {spk or ''}: {' '.join(line)}"); line, t0 = [], None
if line: print(f"{t0:6.1f}-{words[-1]['end']:5.1f} {spk or ''}: {' '.join(line)}")
