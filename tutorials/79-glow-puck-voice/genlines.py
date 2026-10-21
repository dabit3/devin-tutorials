"""Nader's spoken lines (ElevenLabs eleven_multilingual_v2, voice T8iHhGIWPm2GVYpQD1Am) fed into the apps' mic during the takes.
usage: ELEVEN_LABS_API_KEY=... python3 genlines.py <set>   (set: cold | call)  -> call/<name>.wav 48 kHz mono + call/<set>-lines.json"""
import json, os, subprocess, sys, urllib.request
D = os.path.dirname(os.path.abspath(__file__)); VOICE = 'T8iHhGIWPm2GVYpQD1Am'; MODEL = 'eleven_multilingual_v2'
KEY = os.environ['ELEVEN_LABS_API_KEY']; SET = sys.argv[1]
LINES = {
  'cold': {
    'k1': "Hey ref, change this match to best of seven.",
    'k2': "Give blue a fireball.",
    'k3': "Wait, wait. Switch to hype mode.",
    'k4': "What's the score?",
  },
  'call': json.load(open(os.path.join(D, 'call', 'call-text.json'))) if os.path.exists(os.path.join(D, 'call', 'call-text.json')) else {},
}[SET]
out = {}
for name, text in LINES.items():
    req = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE}?output_format=pcm_48000',
        data=json.dumps({'text': text, 'model_id': MODEL}).encode(), headers={'xi-api-key': KEY, 'Content-Type': 'application/json'})
    pcm = urllib.request.urlopen(req, timeout=120).read()
    wav = os.path.join(D, 'call', name + '.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', '48000', '-ac', '1', '-i', '-', '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,apad=pad_dur=0.15', wav], input=pcm, check=True)
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', wav], capture_output=True, text=True).stdout)
    out[name] = {'text': text, 'dur': round(dur, 2), 'model': MODEL}; print(name, round(dur, 2), text)
json.dump(out, open(os.path.join(D, 'call', SET + '-lines.json'), 'w'), indent=1)
