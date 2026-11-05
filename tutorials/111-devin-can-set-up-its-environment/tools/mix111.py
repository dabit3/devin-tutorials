"""Lay Nader's 2-upbeat.mp3 under the VO+SFX bed: trim to length, duck under narration, fade out.
usage: python3 tools/mix111.py <video-dir> <music.mp3> <bed.wav> <out.wav>
The track (~312 s) is longer than the video, so it plays straight through from 0 s with no joins."""
import json, os, subprocess, sys, wave
import numpy as np
VD, MUSIC, BED, OUT = sys.argv[1:5]
SR = 48000
with wave.open(BED) as w:
    bed = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(float).reshape(-1, 2) / 32767
N = len(bed)
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', MUSIC, '-f', 's16le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
mu = np.frombuffer(raw, '<i2').astype(float).reshape(-1, 2) / 32767
assert len(mu) >= N, 'track shorter than the video'
mu = mu[:N]
cue = json.load(open(os.path.join(VD, 'build', 'cues.json')))
voice = os.environ['VOICE']
speech = np.zeros(N)
for v in cue.get('vo', []):
    with wave.open(os.path.join(VD, 'vo', voice, v['file'] + '.wav')) as w:
        d = w.getnframes() / w.getframerate()
    i = int(v['t'] / cue['fps'] * SR); j = min(N, i + int(d * SR))
    speech[max(0, i - int(0.25 * SR)):j + int(0.35 * SR)] = 1
DUCK, OPEN = float(os.environ.get('DUCK', '0.32')), float(os.environ.get('OPEN', '0.62'))
target = OPEN - (OPEN - DUCK) * speech
k = int(0.12 * SR)
g = np.convolve(np.pad(target, (k, k), mode='edge'), np.ones(2 * k + 1) / (2 * k + 1), mode='same')[k:-k]
t = np.arange(N) / SR
FADE = float(os.environ.get('FADE', '3.0'))
g *= np.clip((t[-1] - t) / FADE, 0, 1) * np.clip(t / 0.05, 0, 1)
pk = np.abs(mu).max() or 1
out = bed + mu / pk * 0.5 * g[:, None]
out /= max(1e-9, np.abs(out).max()) / 0.8
with wave.open(OUT, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((out * 32767).astype('<i2').tobytes())
print('mixed', round(N / SR, 2), 's')
