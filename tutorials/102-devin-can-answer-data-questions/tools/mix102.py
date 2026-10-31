"""Tutorial 102 final audio: narration + SFX bed (audio102.py, MUSIC_GAIN=0) + Nader's 2-upbeat.mp3.
The track is extended with bar-aligned joins (117.45 BPM, 8-bar crossfades placed under narration), ducked under the voice,
faded out over the last 3 s. usage: python3 mix102.py <video-dir> <music.mp3> <bed.wav> <out.wav>"""
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
DROP = 2.05; BAR = 4 * 60 / 117.45
VOICE_ON = np.zeros(N, bool)
for v in cue.get('vo', []):
    with wave.open(os.path.join(VD, 'vo', os.environ['VOICE'], v['file'] + '.wav')) as w:
        n = w.getnframes() * SR // w.getframerate()
    i = int(v['t'] / FPS * SR); VOICE_ON[max(0, i - int(.3 * SR)):min(N, i + n + int(.5 * SR))] = True
# extend: jump back 8 bars from a bar line (relative to the drop) that falls under narration
X = int(0.06 * SR); L = int(8 * BAR * SR); joins = []
while len(m) < N + SR:
    k = int((len(m) / SR - DROP) / BAR) - 2
    while k > 9 and not VOICE_ON[min(N - 1, int((DROP + k * BAR) * SR))]: k -= 1
    P = int((DROP + k * BAR) * SR); joins.append(round(P / SR, 2))
    head, tail = m[:P], m[P - L:]
    r = np.linspace(0, 1, X)[:, None]
    m = np.concatenate([head[:-X], head[-X:] * (1 - r) + tail[:X] * r, tail[X:]])
m = m[:N]
lo, hi = float(os.environ.get('DUCK_DB', '-17')), float(os.environ.get('GAP_DB', '-9'))
t = np.arange(N) / SR
target = np.where(VOICE_ON, lo, hi)
g = lfilter([1 - 0.99985], [1, -0.99985], target - target[0]) + target[0]
rms = lambda x: np.sqrt((x ** 2).mean())
gain = 10 ** (g / 20) * rms(bed[VOICE_ON]) / rms(m)
fade = np.clip((total - t) / 3.0, 0, 1)
out = bed + m * (gain * fade)[:, None]
out /= max(1e-9, np.abs(out).max()) / 0.9
with wave.open(OUT, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype('<i2').tobytes())
print('mixed', round(N / SR, 2), 's; joins at', joins)
