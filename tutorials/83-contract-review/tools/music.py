"""Put the upbeat track under a narrated cut (used for tutorials 46 and 47).
Kit audio without its synth bed (SFX + narration) + the track, ducked under the voice and faded out at the end.
usage: VOICE=<id> python3 tutorials/46-modal-post-training/tools/music.py <video-dir> <music.mp3> <cut.mp4>
_kit stays untouched; ffmpeg must be on PATH."""
import json, os, subprocess, sys, wave
import numpy as np
from scipy.signal import lfilter
VD, MUSIC, CUT = (os.path.abspath(a) for a in sys.argv[1:4])
KIT = os.path.join(os.path.dirname(VD), '_kit', 'tools')
subprocess.run([sys.executable, os.path.join(KIT, 'audio.py'), VD], check=True, env={**os.environ, 'MUSIC_GAIN': '0'})
B = os.path.join(VD, 'build')
with wave.open(os.path.join(B, 'audio.wav')) as w:
    SR = w.getframerate()
    bed = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(float).reshape(-1, 2) / 32767
N = len(bed)
m = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', MUSIC, '-ac', '2', '-ar', str(SR), '-f', 's16le', '-'],
                                 capture_output=True, check=True).stdout, '<i2').astype(float).reshape(-1, 2) / 32767
while len(m) < N:
    m = np.concatenate([m, m])
m = m[:N]
cue = json.load(open(os.path.join(B, 'cues.json'))); FPS = cue['fps']
on = np.zeros(N, bool)
for v in cue.get('vo', []):
    with wave.open(os.path.join(VD, 'vo', os.environ['VOICE'], v['file'] + '.wav')) as w:
        n = w.getnframes() * SR // w.getframerate()
    i = int(v['t'] / FPS * SR); on[max(0, i - int(.3 * SR)):min(N, i + n + int(.5 * SR))] = True
target = np.where(on, float(os.environ.get('DUCK_DB', '-17')), float(os.environ.get('GAP_DB', '-9')))
g = lfilter([1 - 0.99985], [1, -0.99985], target - target[0]) + target[0]
rms = lambda x: np.sqrt((x ** 2).mean())
t = np.arange(N) / SR
fade = np.clip(t / 1.0, 0, 1) * np.clip((N / SR - t) / 3.0, 0, 1)
out = bed + m * (10 ** (g / 20) * rms(bed[on]) / rms(m) * fade)[:, None]
out /= max(1e-9, np.abs(out).max()) / 0.9
mix = os.path.join(B, 'mix.wav')
with wave.open(mix, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype('<i2').tobytes())
norm = os.path.join(B, 'mix_n.wav')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', mix, '-af', 'acompressor=threshold=-20dB:ratio=3:attack=4:release=150:makeup=2,loudnorm=I=-16:TP=-2:LRA=11', '-ar', '48000', norm], check=True)
tmp = CUT + '.tmp.mp4'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', CUT, '-i', norm, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k',
                '-ar', '48000', '-movflags', '+faststart', '-shortest', tmp], check=True)
os.replace(tmp, CUT)
print('music mixed into', os.path.basename(CUT), round(N / SR, 2), 's')
