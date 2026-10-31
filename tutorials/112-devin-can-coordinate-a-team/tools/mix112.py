"""Tutorial 112 final audio: narration + SFX bed (audio112.py, MUSIC_GAIN=0) + Nader's 2-upbeat track for the whole film.
The track's drop (2.05 s in) lands DROP_AT s into the title card (default 0.5); if the film is longer than the track,
it is extended with an 8-bar join (bar-aligned, ~117.45 BPM) placed under narration. Ducked under the voice, faded out at the end.
usage: VOICE=<id> python3 mix112.py <video-dir> <music.mp3> <bed.wav> <out.wav>"""
import json, os, subprocess, sys, wave
import numpy as np
from scipy.signal import lfilter
VD, MUSIC, BED, OUT = sys.argv[1:5]
SR = 48000; DROP = 2.05; DROP_AT = float(os.environ.get("DROP_AT", "0.5"))
cue = json.load(open(os.path.join(VD, 'build', 'cues.json')))
FPS = cue['fps']; total = cue['frames'] / FPS; intro_end = cue['intro'] / FPS
with wave.open(BED) as w:
    bed = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(float).reshape(-1, 2) / 32767
N = len(bed)
m = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', MUSIC, '-ac', '2', '-ar', str(SR), '-f', 's16le', '-'],
                                 capture_output=True, check=True).stdout, '<i2').astype(float).reshape(-1, 2) / 32767
BAR = 4 * 60 / 117.45; X = int(0.04 * SR)
shift = DROP_AT - DROP
m = m[int(-shift * SR):] if shift < 0 else np.concatenate([np.zeros((int(shift * SR), 2)), m])
# bar grid in film time: bars start at intro_end + k*BAR
joins = []
while len(m) < N:
    L = int(8 * BAR * SR)
    k = int((len(m) / SR - 4 * BAR - intro_end) / BAR); P = int((intro_end + k * BAR) * SR)
    head, tail = m[:P], m[P - L:]
    r = np.linspace(0, 1, X)[:, None]
    m = np.concatenate([head[:-X], head[-X:] * (1 - r) + tail[:X] * r, tail[X:]]); joins.append(round(P / SR, 2))
m = m[:N]
VOICE_ON = np.zeros(N, bool)
for v in cue.get('vo', []):
    with wave.open(os.path.join(VD, 'vo', os.environ['VOICE'], v['file'] + '.wav')) as w:
        n = w.getnframes() * SR // w.getframerate()
    i = int(v['t'] / FPS * SR); VOICE_ON[max(0, i - int(.3 * SR)):min(N, i + n + int(.5 * SR))] = True
t = np.arange(N) / SR
lo, hi = float(os.environ.get('DUCK_DB', '-17')), float(os.environ.get('GAP_DB', '-9'))
target = np.where(VOICE_ON, lo, np.where(t < intro_end, float(os.environ.get('INTRO_DB', '-2')), hi))
g = lfilter([1 - 0.99985], [1, -0.99985], target - target[0]) + target[0]
rms = lambda x: np.sqrt((x ** 2).mean())
gain = 10 ** (g / 20) * rms(bed[VOICE_ON]) / rms(m[int(max(0, shift) * SR):])
fade = np.clip((total - t) / 3.0, 0, 1) * np.clip(t / 0.05, 0, 1)
out = bed + m * (gain * fade)[:, None]
out /= max(1e-9, np.abs(out).max()) / 0.9
with wave.open(OUT, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype('<i2').tobytes())
print("mixed", round(N / SR, 2), "s; drop at", DROP_AT, "; joins", joins)
