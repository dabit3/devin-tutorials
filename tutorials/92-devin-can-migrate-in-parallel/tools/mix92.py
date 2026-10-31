"""Tutorial 92 final audio: narration + SFX bed (audio92.py, MUSIC_GAIN=0) + Nader's 2-upbeat track from film 0 s,
extended with bar-aligned joins if the film outgrows it, ducked under narration and faded out at the end.
usage: VOICE=<id> python3 mix92.py <video-dir> <music.mp3> <bed.wav> <out.wav>"""
import json, os, subprocess, sys, wave
import numpy as np
from scipy.signal import lfilter
VD, MUSIC, BED, OUT = sys.argv[1:5]
SR = 48000
cue = json.load(open(os.path.join(VD, 'build', 'cues.json')))
total = cue['frames'] / cue['fps']
with wave.open(BED) as w:
    bed = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(float).reshape(-1, 2) / 32767
N = len(bed)
m = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', MUSIC, '-ac', '2', '-ar', str(SR), '-f', 's16le', '-'],
                                 capture_output=True, check=True).stdout, '<i2').astype(float).reshape(-1, 2) / 32767
BAR = 4 * 60 / 117.45; DROP = 2.05; L = int(8 * BAR * SR); X = int(0.04 * SR)
P = int((DROP + 16 * BAR) * SR)
while len(m) < N:
    head, tail = m[:P], m[P - L:]
    r = np.linspace(0, 1, X)[:, None]
    m = np.concatenate([head[:-X], head[-X:] * (1 - r) + tail[:X] * r, tail[X:]])
m = m[:N]
VOICE_ON = np.zeros(N, bool)
for v in cue.get('vo', []):
    with wave.open(os.path.join(VD, 'vo', os.environ['VOICE'], v['file'] + '.wav')) as w:
        n = w.getnframes() * SR // w.getframerate()
    i = int(v['t'] / cue['fps'] * SR); VOICE_ON[max(0, i - int(.3 * SR)):min(N, i + n + int(.5 * SR))] = True
lo, hi = float(os.environ.get('DUCK_DB', '-17')), float(os.environ.get('GAP_DB', '-9'))
target = np.where(VOICE_ON, lo, hi)
g = lfilter([1 - 0.99985], [1, -0.99985], target - target[0]) + target[0]
rms = lambda x: np.sqrt((x ** 2).mean())
gain = 10 ** (g / 20) * rms(bed[VOICE_ON]) / rms(m)
t = np.arange(N) / SR
fade = np.clip((total - t) / 3.0, 0, 1)
out = bed + m * (gain * fade)[:, None]
out /= max(1e-9, np.abs(out).max()) / 0.9
with wave.open(OUT, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype('<i2').tobytes())
print('mixed', round(N / SR, 2), 's')
