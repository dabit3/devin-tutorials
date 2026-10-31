"""Tutorial 90 final audio: narration + SFX bed (audio90.py, MUSIC_GAIN=0) + the upbeat track, shifted by SHIFT s (negative trims its head) so its drop (2.05 s) lands under the title card.
usage: python3 mix26.py <video-dir> <music.mp3> <bed.wav> <out.wav> <shift> <music_end|full>
music_end=<seconds>: the track plays under the intro and fades out by that time (plain cut, the light bed takes over);
full: the track runs the whole film, ducked under narration (music cut)."""
import json, os, subprocess, sys, wave
import numpy as np
from scipy.signal import lfilter
VD, MUSIC, BED, OUT, SHIFT, MODE = sys.argv[1:7]; SHIFT = float(SHIFT)
SR = 48000
cue = json.load(open(os.path.join(VD, 'build', 'cues.json')))
FPS = cue['fps']; total = cue['frames'] / FPS
with wave.open(BED) as w:
    bed = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(float).reshape(-1, 2) / 32767
N = len(bed)
m = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', MUSIC, '-ac', '2', '-ar', str(SR), '-f', 's16le', '-'],
                                 capture_output=True, check=True).stdout, '<i2').astype(float).reshape(-1, 2) / 32767
BAR = 4 * 60 / 117.45; L = int(8 * BAR * SR); P = int(round(200 / BAR) * BAR * SR); X = int(0.04 * SR)
while len(m) < N:
    head, tail = m[:P], m[P - L:]
    r = np.linspace(0, 1, X)[:, None]
    m = np.concatenate([head[:-X], head[-X:] * (1 - r) + tail[:X] * r, tail[X:]])
m = (m[int(-SHIFT * SR):] if SHIFT < 0 else np.concatenate([np.zeros((int(SHIFT * SR), 2)), m]))[:N]
duck = np.ones(N); VOICE_ON = np.zeros(N, bool)
for v in cue.get('vo', []):
    with wave.open(os.path.join(VD, 'vo', os.environ['VOICE'], v['file'] + '.wav')) as w:
        n = w.getnframes() * SR // w.getframerate()
    i = int(v['t'] / FPS * SR); VOICE_ON[max(0, i - int(.3 * SR)):min(N, i + n + int(.5 * SR))] = True
lo, hi = float(os.environ.get('DUCK_DB', '-17')), float(os.environ.get('GAP_DB', '-9'))
t = np.arange(N) / SR
intro_end = min((v['t'] / FPS for v in cue.get('vo', [])), default=0)
target = np.where(VOICE_ON, lo, np.where(t < intro_end, float(os.environ.get('INTRO_DB', '3')), hi))
g = lfilter([1 - 0.99985], [1, -0.99985], target - target[0]) + target[0]
rms = lambda x: np.sqrt((x ** 2).mean())
vo_rms = rms(bed[VOICE_ON]); m_rms = rms(m[int(max(0, SHIFT) * SR):])
gain = 10 ** (g / 20) * vo_rms / m_rms
t = np.arange(N) / SR
end = total if MODE == 'full' else float(MODE)
fade = np.clip((end - t) / 3.0, 0, 1) * np.clip((t - max(0, SHIFT)) / 0.3, 0, 1)
out = bed + m * (gain * fade)[:, None]
out /= max(1e-9, np.abs(out).max()) / 0.9
with wave.open(OUT, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype('<i2').tobytes())
print('mixed', round(N / SR, 2), 's; music ends', round(end, 2))
