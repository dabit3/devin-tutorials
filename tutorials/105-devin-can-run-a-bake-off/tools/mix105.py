"""Tutorial 105 final audio: narration + SFX bed (audio105.py, MUSIC_GAIN=0) + Nader's 2-upbeat.mp3.
The track (~117.5 BPM, drop at 2.05 s) starts SHIFT s into the film, is extended with bar-aligned
crossfades only if the film outlasts it (a negative SHIFT trims the track's start so the drop lands earlier), is ducked under narration, and fades out over the last 3 s.
usage: VOICE=<voice-id> python3 mix105.py <video-dir> <music.mp3> <bed.wav> <out.wav> <shift>"""
import json, os, subprocess, sys, wave
import numpy as np
from scipy.signal import lfilter
VD, MUSIC, BED, OUT, SHIFT = sys.argv[1:6]; SHIFT = float(SHIFT)
SR = 48000
cue = json.load(open(os.path.join(VD, 'build', 'cues.json')))
FPS = cue['fps']; total = cue['frames'] / FPS
with wave.open(BED) as w:
    bed = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(float).reshape(-1, 2) / 32767
N = len(bed)
m = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', MUSIC, '-ac', '2', '-ar', str(SR), '-f', 's16le', '-'],
                                 capture_output=True, check=True).stdout, '<i2').astype(float).reshape(-1, 2) / 32767
BAR = 4 * 60 / 117.5; DROP = 2.05; X = int(0.04 * SR)
# extension: repeat from 8 bars after the drop, joined on a bar line
while len(m) < N:
    P = int((DROP + BAR * int((len(m) / SR - DROP) / BAR - 1)) * SR); L = int((DROP + 8 * BAR) * SR)
    r = np.linspace(0, 1, X)[:, None]
    m = np.concatenate([m[:P - X], m[P - X:P] * (1 - r) + m[L - X:L] * r, m[L:]])
m = (np.concatenate([np.zeros((int(SHIFT * SR), 2)), m]) if SHIFT >= 0 else m[int(-SHIFT * SR):])[:N]
VOICE_ON = np.zeros(N, bool)
for v in cue.get('vo', []):
    with wave.open(os.path.join(VD, 'vo', os.environ['VOICE'], v['file'] + '.wav')) as w:
        n = w.getnframes() * SR // w.getframerate()
    i = int(v['t'] / FPS * SR); VOICE_ON[max(0, i - int(.3 * SR)):min(N, i + n + int(.5 * SR))] = True
lo, hi = float(os.environ.get('DUCK_DB', '-17')), float(os.environ.get('GAP_DB', '-9'))
target = np.where(VOICE_ON, lo, hi)
g = lfilter([1 - 0.99985], [1, -0.99985], target - target[0]) + target[0]
rms = lambda x: np.sqrt((x ** 2).mean())
gain = 10 ** (g / 20) * rms(bed[VOICE_ON]) / rms(m[int(max(0, SHIFT) * SR):])
t = np.arange(N) / SR
fade = np.clip((total - t) / 3.0, 0, 1) * np.clip((t - max(0, SHIFT)) / 0.3, 0, 1)
out = bed + m * (gain * fade)[:, None]
out /= max(1e-9, np.abs(out).max()) / 0.9
with wave.open(OUT, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype('<i2').tobytes())
print('mixed', round(N / SR, 2), 's')
