"""Narration over Nader's upbeat track, no kit bed and no UI sounds (used by tutorials 42 and 43).
usage: VOICE=<voice-id> python3 music_mix.py <video-dir> <music.mp3> <out.wav> [drop_at_s]
The track's beat drop (2.05 s into the file) lands at drop_at_s (default 2.05, under the title card).
The music ducks under each line, fades out over the last 3 s, and loops on an 8-bar phrase if the film outlasts it."""
import json, os, subprocess, sys, wave
import numpy as np
from scipy.signal import lfilter
VD, MUSIC, OUT = sys.argv[1:4]; DROP_AT = float(sys.argv[4]) if len(sys.argv) > 4 else 2.05
SR, BPM, TRACK_DROP = 48000, 117.6, 2.05
cue = json.load(open(os.path.join(VD, 'build', 'cues.json')))
FPS = cue['fps']; total = cue['frames'] / FPS; N = int(round(total * SR))
voice = np.zeros(N); on = np.zeros(N, bool)
for v in cue['vo']:
    with wave.open(os.path.join(VD, 'vo', os.environ['VOICE'], v['file'] + '.wav')) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(float) / 32767
        if w.getframerate() != SR: sys.exit('voice must be 48 kHz')
    i = int(round(v['t'] / FPS * SR)); j = min(N, i + len(x)); voice[i:j] += x[:j - i]
    on[max(0, i - int(.3 * SR)):min(N, j + int(.5 * SR))] = True
m = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', MUSIC, '-ac', '2', '-ar', str(SR), '-f', 's16le', '-'],
                                 capture_output=True, check=True).stdout, '<i2').astype(float).reshape(-1, 2) / 32767
shift = DROP_AT - TRACK_DROP
m = np.concatenate([np.zeros((int(shift * SR), 2)), m]) if shift >= 0 else m[int(-shift * SR):]
BAR = 4 * 60 / BPM; L = int(8 * BAR * SR); X = int(0.04 * SR)
while len(m) < N:  # repeat the 8 bars before a bar boundary (counted from the drop), with a short crossfade
    k = int((len(m) / SR - shift - TRACK_DROP - 1) / BAR); end = int((shift + TRACK_DROP + k * BAR) * SR)
    seg, r = m[end - L:end], np.linspace(0, 1, X)[:, None]
    m = np.concatenate([m[:end - X], m[end - X:end] * (1 - r) + seg[:X] * r, seg[X:]])
m = m[:N]
t = np.arange(N) / SR
lo, hi = float(os.environ.get('DUCK_DB', '-17')), float(os.environ.get('GAP_DB', '-8'))
target = np.where(on, lo, hi)
g = lfilter([1 - 0.99985], [1, -0.99985], target - target[0]) + target[0]
rms = lambda a: np.sqrt((a ** 2).mean())
gain = 10 ** (g / 20) * rms(voice[on]) / rms(m[m.any(1)])
fade = np.clip((total - t) / 3.0, 0, 1) * np.clip((t - max(0, shift)) / 0.3, 0, 1)
out = voice[:, None] + m * (gain * fade)[:, None]
out /= max(1e-9, np.abs(out).max()) / 0.9
with wave.open(OUT, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype('<i2').tobytes())
print('mixed', round(total, 3), 's, music shift', round(shift, 2), 's')
