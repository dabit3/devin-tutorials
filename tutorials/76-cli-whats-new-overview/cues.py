"""Writes cues.json: STT word start times (s) for each scene line's narration clip, used by make_spec.py to sync row reveals.
usage: ELEVEN_LABS_API_KEY=... python3 cues.py"""
import json, os, re, urllib.request, uuid
D = os.path.dirname(os.path.abspath(__file__)); VO = f'{D}/vo/T8iHhGIWPm2GVYpQD1Am'
IMGS = ['0000.png', '0219.png', '0223.png', '0224.png', '0253.png', '0268.png', '0269.png']
def stt(wav):
    b = uuid.uuid4().hex
    body = (f'--{b}\r\nContent-Disposition: form-data; name="model_id"\r\n\r\nscribe_v1\r\n'
            f'--{b}\r\nContent-Disposition: form-data; name="file"; filename="a.wav"\r\nContent-Type: audio/wav\r\n\r\n').encode() + open(wav, 'rb').read() + f'\r\n--{b}--\r\n'.encode()
    req = urllib.request.Request('https://api.elevenlabs.io/v1/speech-to-text', data=body,
                                 headers={'xi-api-key': os.environ['ELEVEN_LABS_API_KEY'], 'Content-Type': f'multipart/form-data; boundary={b}'})
    return [w for w in json.load(urllib.request.urlopen(req, timeout=120))['words'] if w['type'] == 'word']
out = {img: [{'w': re.sub(r'[^a-z0-9]', '', w['text'].lower()), 't': round(w['start'], 3)} for w in stt(f'{VO}/{img}.wav')] for img in IMGS}
json.dump(out, open(f'{D}/cues.json', 'w'), indent=1)
for img, ws in out.items(): print(img, ' '.join(f"{w['w']}@{w['t']}" for w in ws))
