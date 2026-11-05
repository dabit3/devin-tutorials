"""Overview 109 final audio: the narration + SFX bed (audio109.py, MUSIC_GAIN=0) over Nader's upbeat track.
usage: python3 mix109.py <video-dir> <music.mp3> <bed.wav> <out.wav> <shift>
The track starts <shift> s into the film (its drop lands on the title), is extended with bar-aligned joins placed
under narration if the film outlasts it, ducks under the voice, and fades out over the last 3 s."""
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
VOICE_ON = np.zeros(N, bool)
for v in cue.get('vo', []):
    with wave.open(os.path.join(VD, 'vo', os.environ['VOICE'], v['file'] + '.wav')) as w:
        n = w.getnframes() * SR // w.getframerate()
    i = int(v['t'] / FPS * SR); VOICE_ON[max(0, i - int(.3 * SR)):min(N, i + n + int(.5 * SR))] = True
# extend: repeat 8-bar phrases from bar-aligned points after the drop (117.45 BPM, drop at 2.05 s), crossfading 40 ms
BAR = 4 * 60 / 117.45; DROP = 2.05; X = int(0.04 * SR); joins = []
need = N - int(SHIFT * SR)
while len(m) < need:
    cut = int((DROP + int((len(m) / SR - DROP) / BAR - 1) * BAR) * SR); back = int(8 * BAR * SR)
    head, tail = m[:cut], m[cut - back:]
    r = np.linspace(0, 1, X)[:, None]
    m = np.concatenate([head[:-X], head[-X:] * (1 - r) + tail[:X] * r, tail[X:]]); joins.append(SHIFT + cut / SR)
for j in joins:
    if not VOICE_ON[min(N - 1, int(j * SR))]: print(f'warning: join at {j:.2f}s is not under narration')
m = np.concatenate([np.zeros((int(SHIFT * SR), 2)), m])[:N]
if len(m) < N: m = np.concatenate([m, np.zeros((N - len(m), 2))])
lo, hi = float(os.environ.get('DUCK_DB', '-16')), float(os.environ.get('GAP_DB', '-8'))
target = np.where(VOICE_ON, lo, hi)
g = lfilter([1 - 0.99985], [1, -0.99985], target - target[0]) + target[0]
rms = lambda x: np.sqrt((x ** 2).mean())
gain = 10 ** (g / 20) * rms(bed[VOICE_ON]) / rms(m[int(SHIFT * SR):int(SHIFT * SR) + int(60 * SR)])
t = np.arange(N) / SR
fade = np.clip((total - t) / 3.0, 0, 1) * np.clip((t - SHIFT) / 0.3, 0, 1)
out = bed + m * (gain * fade)[:, None]
out /= max(1e-9, np.abs(out).max()) / 0.9
with wave.open(OUT, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype('<i2').tobytes())
print('mixed', round(N / SR, 2), 's; joins', [round(j, 2) for j in joins])
