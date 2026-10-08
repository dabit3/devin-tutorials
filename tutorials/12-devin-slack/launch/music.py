"""Music bed for the launch video.
music_src.mp3 was generated with the ElevenLabs Music API (see README); it is 120 BPM with beat 1 at 0.0 s,
a one-beat drop-out at 15.0 s and a hard stop at 30.0 s. This adds a reverb tail after the stop so the end card
rings out, trims to the video length and normalizes to -16 LUFS (true peak -1.5 dB).
usage: python3 music.py <duration_s> -> music.wav (48 kHz stereo)"""
import subprocess, sys
import numpy as np
from scipy.signal import fftconvolve
DUR = float(sys.argv[1]); SR = 48000
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', 'music_src.mp3', '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)
N = int(DUR * SR); y = np.zeros((N, 2)); y[:min(N, len(x))] = x[:N]
# reverb tail: convolve the last bar with a decaying stereo-noise IR and bring it in only after the stop
rng = np.random.default_rng(3); n = int(3.2 * SR); tt = np.arange(n) / SR
ir = rng.standard_normal((n, 2)) * np.exp(-tt / 0.75)[:, None]; ir[: int(0.012 * SR)] = 0
a, b = int(28.0 * SR), int(30.05 * SR)
seg = y[a:b].copy()
wet = np.stack([fftconvolve(seg[:, k], ir[:, k]) for k in range(2)], 1)
wet /= np.abs(wet).max() + 1e-9
start = int(29.8 * SR); wet = wet[start - a:]
L = min(len(wet), N - start); w = wet[:L]
t2 = np.arange(L) / SR
gain = 0.30 * np.clip(t2 / 0.25, 0, 1) * np.clip((DUR - 29.8 - t2) / 1.2, 0, 1) ** 1.5
y[start:start + L] += w * gain[:, None]
fo = int(0.05 * SR); y[-fo:] *= np.linspace(1, 0, fo)[:, None]
pcm = np.clip(y, -1, 1).astype(np.float32).tobytes()
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', str(SR), '-c:a', 'pcm_s16le', 'music.wav'], input=pcm, check=True)
print('music.wav', DUR, 's')
