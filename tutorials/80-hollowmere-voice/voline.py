"""Re-voice one intro line with the narration's ElevenLabs settings (eleven_multilingual_v2, stability .5 / similarity .75 / style 0, speaker boost).
usage: ELEVEN_LABS_API_KEY=... python3 voline.py <key e.g. i1> "<text>"   -> intro/<key>.png.wav (48 kHz mono) + intro/lines.json updated"""
import json, os, subprocess, sys, urllib.request, wave
D = os.path.dirname(os.path.abspath(__file__)); key, text = sys.argv[1], sys.argv[2]
VOICE = 'T8iHhGIWPm2GVYpQD1Am'
req = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE}?output_format=pcm_48000',
    data=json.dumps({'text': text, 'model_id': 'eleven_multilingual_v2', 'voice_settings': {'stability': 0.5, 'similarity_boost': 0.75, 'style': 0, 'use_speaker_boost': True}}).encode(),
    headers={'xi-api-key': os.environ['ELEVEN_LABS_API_KEY'], 'Content-Type': 'application/json'})
pcm = urllib.request.urlopen(req, timeout=120).read()
out = os.path.join(D, 'intro', key + '.png.wav')
if os.path.exists(out): os.replace(out, os.path.join(D, 'build', key + '-old.wav'))
with wave.open(out, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(48000); w.writeframes(pcm)
dur = len(pcm) / 2 / 48000
L = json.load(open(os.path.join(D, 'intro', 'lines.json'))); e = L[key + '.png']
e.update({'text': text, 'dur': round(dur, 3), 'end': round(e.get('at', 0) + dur, 3), 'chunks': [{'t0': 0, 't1': round(dur, 3), 'text': text}]})
json.dump(L, open(os.path.join(D, 'intro', 'lines.json'), 'w'), indent=1); print(key, round(dur, 2), 's')
