"""Tutorial 104 final audio: narration + SFX bed (audio104.py, MUSIC_GAIN=0) + Nader's 2-upbeat.mp3.
The track starts at film 0 (its drop lands on the title card), is extended with bar-aligned 8-bar joins,
ducked under the voice, and faded out over the last 3 s.
usage: VOICE=<id> python3 mix104.py <video-dir> <music.mp3> <bed.wav> <out.wav>"""
import json, os, subprocess, sys, wave
import numpy as np
from scipy.signal import lfilter
VD, MUSIC, BED, OUT = sys.argv[1:5]
SR = 48000
cue = json.load(open(os.path.join(VD, 'build', 'cues.json')))
FPS = cue['fps']; total = cue['frames'] / FPS
with wave.open(BED) as w:
    bed = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(float).reshape(-1, 2) / 32767
N = len(bed)
m = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', MUSIC, '-ac', '2', '-ar', str(SR), '-f', 's16le', '-'],
                                 capture_output=True, check=True).stdout, '<i2').astype(float).reshape(-1, 2) / 32767
DROP = 2.05; BAR = 4 * 60 / 117.5; X = int(0.04 * SR)
joins = []
if len(m) < N:  # extend: from the last whole bar after the drop, repeat the 8 bars before it (crossfaded, bar-aligned)
    P = int((DROP + int((len(m) / SR - DROP - 1) / BAR) * BAR) * SR); L = int(8 * BAR * SR)
    m = m[:P]
    while len(m) < N:
        seg = m[-L:]; r = np.linspace(0, 1, X)[:, None]
        joins.append(len(m) / SR)
        m = np.concatenate([m[:-X], m[-X:] * (1 - r) + seg[:X] * r, seg[X:]])
m = m[:N]
VOICE_ON = np.zeros(N, bool)
for v in cue.get('vo', []):
    with wave.open(os.path.join(VD, 'vo', os.environ['VOICE'], v['file'] + '.wav')) as w:
        n = w.getnframes() * SR // w.getframerate()
    i = int(v['t'] / FPS * SR); VOICE_ON[max(0, i - int(.3 * SR)):min(N, i + n + int(.5 * SR))] = True
t = np.arange(N) / SR
first_vo = min((v['t'] / FPS for v in cue.get('vo', [])), default=0)
target = np.where(VOICE_ON, float(os.environ.get('DUCK_DB', '-17')), np.where(t < first_vo, 0.0, float(os.environ.get('GAP_DB', '-9'))))
g = lfilter([1 - 0.99985], [1, -0.99985], target - target[0]) + target[0]
rms = lambda x: np.sqrt((x ** 2).mean())
gain = 10 ** (g / 20) * rms(bed[VOICE_ON]) / rms(m)
fade = np.clip((total - t) / 3.0, 0, 1)
out = bed + m * (gain * fade)[:, None]
out /= max(1e-9, np.abs(out).max()) / 0.9
with wave.open(OUT, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype('<i2').tobytes())
print('mixed', round(N / SR, 2), 's; joins at', [round(j, 2) for j in joins], 'first vo', round(first_vo, 2))
