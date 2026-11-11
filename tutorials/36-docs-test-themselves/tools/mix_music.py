"""Tutorials 36 + 37 music-voiceover mix: Nader's voiceover lines + the 2-upbeat track (117.6 BPM, drop at 2.05 s), no kit bed and no UI sounds.
The track starts SHIFT s into the film (drop lands at SHIFT + 2.05 s, under the title card), is ducked under speech, and fades out over the last 3 s.
If the film is longer than the track, the track is extended by repeating 8 bars from a bar boundary (40 ms crossfade).
usage: VOICE=<voice-id> python3 mix_music.py <video-dir> <music.mp3> <out.wav> [shift=0]"""
import json, os, subprocess, sys, wave
import numpy as np
from scipy.signal import lfilter
VD, MUSIC, OUT = sys.argv[1:4]; SHIFT = float(sys.argv[4]) if len(sys.argv) > 4 else 0.0
SR = 48000
cue = json.load(open(os.path.join(VD, 'build', 'cues.json')))
FPS = cue['fps']; total = cue['frames'] / FPS; N = int(round(total * SR))
voice = np.zeros(N); on = np.zeros(N, bool)
for v in cue['vo']:
    with wave.open(os.path.join(VD, 'vo', os.environ['VOICE'], v['file'] + '.wav')) as w:
        assert w.getframerate() == SR and w.getnchannels() == 1
        x = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(float) / 32767
    i = int(round(v['t'] / FPS * SR)); j = min(N, i + len(x))
    voice[i:j] += x[:j - i]; on[max(0, i - int(.3 * SR)):min(N, j + int(.5 * SR))] = True
m = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', MUSIC, '-ac', '2', '-ar', str(SR), '-f', 's16le', '-'],
                                 capture_output=True, check=True).stdout, '<i2').astype(float).reshape(-1, 2) / 32767
BAR = 4 * 60 / 117.6; L = int(8 * BAR * SR); P = int((2.05 + round(200 / BAR) * BAR) * SR); X = int(0.04 * SR)
while len(m) < N + abs(int(SHIFT * SR)):
    head, tail = m[:P], m[P - L:]
    r = np.linspace(0, 1, X)[:, None]
    m = np.concatenate([head[:-X], head[-X:] * (1 - r) + tail[:X] * r, tail[X:]])
m = np.concatenate([np.zeros((int(SHIFT * SR), 2)), m])[:N] if SHIFT >= 0 else m[int(-SHIFT * SR):][:N]
t = np.arange(N) / SR
first = cue['vo'][0]['t'] / FPS
lo, hi, intro = float(os.environ.get('DUCK_DB', '-17')), float(os.environ.get('GAP_DB', '-9')), float(os.environ.get('INTRO_DB', '-3'))
target = np.where(on, lo, np.where(t < first - 0.3, intro, hi))
g = lfilter([1 - 0.99985], [1, -0.99985], target - target[0]) + target[0]
rms = lambda x: np.sqrt((x ** 2).mean())
gain = 10 ** (g / 20) * rms(voice[on]) / rms(m[len(m) // 10:])
fade = np.clip((total - t) / 3.0, 0, 1) * np.clip(t / 0.05, 0, 1)
out = voice[:, None] + m * (gain * fade)[:, None]
out /= max(1e-9, np.abs(out).max()) / 0.9
with wave.open(OUT, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype('<i2').tobytes())
print('mixed', round(N / SR, 3), 's')
