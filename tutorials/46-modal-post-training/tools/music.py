"""Voice + upbeat track for tutorials 46 and 47 (no kit synth bed, no UI sounds).
The narration lines are placed at their cue times, the track is shifted so its drop (2.05 s) lands at DROP_AT,
extended on a bar boundary if the film is longer than the track, ducked under the voice and faded out at the end.
usage: VOICE=<id> python3 tutorials/46-modal-post-training/tools/music.py <video-dir> tutorials/46-modal-post-training/music/2-upbeat.mp3 <video.mp4> <out.mp4>
env: DROP_AT (film s, default 2.05), DUCK_DB (-17), GAP_DB (-9), INTRO_DB (-4), all relative to the voice level.
_kit stays untouched; build/cues.json comes from the render; ffmpeg must be on PATH."""
import json, os, subprocess, sys, wave
import numpy as np
from scipy.signal import lfilter
VD, MUSIC, VIDEO, OUT = (os.path.abspath(a) for a in sys.argv[1:5])
B, SR, BPM, DROP = os.path.join(VD, 'build'), 48000, 117.6, 2.05
cue = json.load(open(os.path.join(B, 'cues.json'))); FPS = cue['fps']
N = int(round(cue['frames'] / FPS * SR))
voice, on = np.zeros(N), np.zeros(N, bool)
for v in cue.get('vo', []) + cue.get('voLate', []):
    with wave.open(os.path.join(VD, 'vo', os.environ['VOICE'], v['file'] + '.wav')) as w:
        assert w.getframerate() == SR and w.getnchannels() == 1
        x = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(float) / 32767
    i = int(round(v['t'] / FPS * SR)); x = x[:max(0, N - i)]
    voice[i:i + len(x)] += x
    on[max(0, i - int(.3 * SR)):min(N, i + len(x) + int(.5 * SR))] = True
m = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', MUSIC, '-ac', '2', '-ar', str(SR), '-f', 's16le', '-'],
                                 capture_output=True, check=True).stdout, '<i2').astype(float).reshape(-1, 2) / 32767
shift = float(os.environ.get('DROP_AT', DROP)) - DROP
m = np.concatenate([np.zeros((int(shift * SR), 2)), m]) if shift >= 0 else m[int(-shift * SR):]
BAR = 4 * 60 / BPM
while len(m) < N:  # repeat from 8 bars back on a bar boundary, 40 ms crossfade
    P = int((int((len(m) / SR - 2 * BAR - DROP) / BAR) * BAR + DROP) * SR); L = int(8 * BAR * SR); X = int(0.04 * SR)
    head, tail = m[:P], m[P - L:]
    r = np.linspace(0, 1, X)[:, None]
    m = np.concatenate([head[:-X], head[-X:] * (1 - r) + tail[:X] * r, tail[X:]])
m = m[:N]
t = np.arange(N) / SR
first = min((v['t'] for v in cue.get('vo', [])), default=0) / FPS
env = lambda k, d: float(os.environ.get(k, d))
target = np.where(on, env('DUCK_DB', -17), np.where(t < first, env('INTRO_DB', -4), env('GAP_DB', -9)))
g = lfilter([1 - 0.99985], [1, -0.99985], target - target[0]) + target[0]
rms = lambda x: np.sqrt((x ** 2).mean())
fade = np.clip(t / 0.3, 0, 1) * np.clip((N / SR - t) / 3.0, 0, 1)
out = voice[:, None] + m * (10 ** (g / 20) * rms(voice[on]) / rms(m) * fade)[:, None]
out /= max(1e-9, np.abs(out).max()) / 0.9
mix = os.path.join(B, 'mix.wav')
with wave.open(mix, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype('<i2').tobytes())
norm = os.path.join(B, 'mix_n.wav')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', mix, '-af', 'acompressor=threshold=-20dB:ratio=3:attack=4:release=150:makeup=2,loudnorm=I=-16:TP=-2:LRA=11', '-ar', '48000', norm], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', VIDEO, '-i', norm, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k',
                '-ar', '48000', '-movflags', '+faststart', '-shortest', OUT], check=True)
print('voice + music ->', os.path.basename(OUT), round(N / SR, 2), 's, drop at', round(shift + DROP, 2), 's')
