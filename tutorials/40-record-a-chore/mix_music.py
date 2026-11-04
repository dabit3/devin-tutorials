"""Music + voiceover mix for 40/41: narration from vo/<voice>/ over Nader's upbeat track, no kit bed and no UI sounds.
usage: VOICE=<voice id> python3 mix_music.py <video-dir> <music.mp3> <out.wav> [drop_at]
The track's beat drop (2.05 s in) lands at film time drop_at (default 2.05 s, under the title card); the music is ducked
under speech, fades out over the last 3 s, and is extended on a bar boundary if the film is longer than the track."""
import json, os, subprocess, sys, wave
import numpy as np
from scipy.signal import lfilter
VD, MUSIC, OUT = sys.argv[1:4]; DROP_AT = float(sys.argv[4]) if len(sys.argv) > 4 else 2.05
SHIFT = DROP_AT - 2.05; SR = 48000
cue = json.load(open(os.path.join(VD, 'build', 'cues.json')))
FPS = cue['fps']; N = int(round(cue['frames'] / FPS * SR))
pcm = lambda f, ch: np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', str(ch), '-ar', str(SR), '-f', 's16le', '-'],
                                                 capture_output=True, check=True).stdout, '<i2').astype(float) / 32767
m = pcm(MUSIC, 2).reshape(-1, 2)
m = m[int(-SHIFT * SR):] if SHIFT < 0 else np.concatenate([np.zeros((int(SHIFT * SR), 2)), m])
BAR = 4 * 60 / 117.6; L = int(8 * BAR * SR); P = int(round(200 / BAR) * BAR * SR); X = int(0.04 * SR)
while len(m) < N:
    head, tail = m[:P], m[P - L:]
    r = np.linspace(0, 1, X)[:, None]
    m = np.concatenate([head[:-X], head[-X:] * (1 - r) + tail[:X] * r, tail[X:]])
m = m[:N]
VL = np.zeros(N); ON = np.zeros(N, bool)
for v in cue['vo']:
    x = pcm(os.path.join(VD, 'vo', os.environ['VOICE'], v['file'] + '.wav'), 1)
    i = int(v['t'] / FPS * SR); j = min(N, i + len(x)); VL[i:j] += x[:j - i]
    ON[max(0, i - int(.3 * SR)):min(N, j + int(.5 * SR))] = True
VL *= 0.5 / max(1e-9, np.abs(VL).max())
t = np.arange(N) / SR; first = cue['vo'][0]['t'] / FPS
target = np.where(ON, float(os.environ.get('DUCK_DB', '-17')), np.where(t < first, float(os.environ.get('INTRO_DB', '3')), float(os.environ.get('GAP_DB', '-9'))))
g = lfilter([1 - 0.99985], [1, -0.99985], target - target[0]) + target[0]
rms = lambda a: np.sqrt((a ** 2).mean())
gain = 10 ** (g / 20) * rms(VL[ON]) / rms(m)
fade = np.clip((N / SR - t) / 3.0, 0, 1)
out = VL[:, None] + m * (gain * fade)[:, None]
out /= max(1e-9, np.abs(out).max()) / 0.9
with wave.open(OUT, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype('<i2').tobytes())
print('mixed', round(N / SR, 3), 's; music shift', round(SHIFT, 2), 's')
