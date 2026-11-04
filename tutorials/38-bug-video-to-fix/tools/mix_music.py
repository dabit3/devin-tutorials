"""Voice + Nader's upbeat track, no kit music bed and no UI sounds (tutorials 38 and 39).
usage: python3 mix_music.py <video-dir> <music.mp3> <out.wav>
The track's drop (2.05 s into the file) lands DROP_AT s into the film, under the title card.
The music sits DUCK_DB under the voice while a line plays, GAP_DB between lines, TITLE_DB before the first line,
and fades out over the last 3 s. A film longer than the track repeats 8 bars on a bar boundary."""
import json, os, subprocess, sys, wave
import numpy as np
from scipy.signal import lfilter
VD, MUSIC, OUT = sys.argv[1:4]
VOICE = os.environ.get('VOICE', 'T8iHhGIWPm2GVYpQD1Am'); SR = 48000
DROP, BPM = 2.05, 117.6
SHIFT = float(os.environ.get('DROP_AT', '1.0')) - DROP
cue = json.load(open(os.path.join(VD, 'build', 'cues.json'))); FPS = cue['fps']
N = int(round(cue['frames'] / FPS * SR))
voice = np.zeros(N); on = np.zeros(N, bool)
for v in cue['vo']:
    with wave.open(os.path.join(VD, 'vo', VOICE, v['file'] + '.wav')) as w:
        assert w.getframerate() == SR
        x = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(float) / 32767
    i = int(round(v['t'] / FPS * SR)); j = min(N, i + len(x)); voice[i:j] += x[:j - i]
    on[max(0, i - int(.3 * SR)):min(N, j + int(.5 * SR))] = True
m = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', MUSIC, '-ac', '2', '-ar', str(SR), '-f', 's16le', '-'],
                                 capture_output=True, check=True).stdout, '<i2').astype(float).reshape(-1, 2) / 32767
m = m[int(-SHIFT * SR):] if SHIFT < 0 else np.concatenate([np.zeros((int(SHIFT * SR), 2)), m])
BAR = 4 * 60 / BPM; L = int(8 * BAR * SR); X = int(0.04 * SR)
while len(m) < N:
    P = int((len(m) / SR - DROP + min(0, SHIFT)) // BAR * BAR * SR)
    head, tail = m[:P], m[P - L:]; r = np.linspace(0, 1, X)[:, None]
    m = np.concatenate([head[:-X], head[-X:] * (1 - r) + tail[:X] * r, tail[X:]])
m = m[:N]
t = np.arange(N) / SR; first = min(v['t'] for v in cue['vo']) / FPS
target = np.where(on, float(os.environ.get('DUCK_DB', '-17')), np.where(t < first - .3, float(os.environ.get('TITLE_DB', '-2')), float(os.environ.get('GAP_DB', '-9'))))
g = lfilter([1 - 0.99985], [1, -0.99985], target - target[0]) + target[0]
rms = lambda x: np.sqrt((x ** 2).mean())
gain = 10 ** (g / 20) * rms(voice[on]) / rms(m[int(max(0, SHIFT) * SR):])
fade = np.clip((N / SR - t) / 3.0, 0, 1) * np.clip((t - max(0, SHIFT)) / 0.3, 0, 1)
out = voice[:, None] + m * (gain * fade)[:, None]
out /= np.abs(out).max() / 0.9
with wave.open(OUT, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype('<i2').tobytes())
print('mixed', round(N / SR, 3), 's; drop at', round(SHIFT + DROP, 2), 's')
