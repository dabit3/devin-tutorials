"""Synthesizes the launch music bed + hits (no samples, no voice), cut to the edit at 120 BPM.
usage: python3 music.py [out.wav]  -> build/music.wav (48 kHz stereo, peak-normalized; build.sh loudnorms to -16 LUFS)"""
import os, sys, wave
import numpy as np
from scipy.signal import lfilter, butter

SR, BPM, DUR = 48000, 120, 37.0
B = 60 / BPM                      # one beat = 0.5 s; every scene cut in index.html lands on a beat
N = int(DUR * SR)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(17)
mtof = lambda m: 440 * 2 ** ((m - 69) / 12)

def add(sig, t0, gain=1.0, pan=0.0, side=None):
    i = int(round(t0 * SR))
    if i >= N or i + len(sig) <= 0: return
    j = min(N, i + len(sig)); s = sig[:j - i] * gain
    L[i:j] += s * np.sqrt(0.5 * (1 - pan)); R[i:j] += s * np.sqrt(0.5 * (1 + pan))
def env(n, a, d, curve=5.0):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-curve * t / d)
def saw(f, dur, detune=0.0):
    n = int(dur * SR); t = np.arange(n) / SR
    out = np.zeros(n)
    for d in (-detune, 0, detune) if detune else (0,):
        ph = (f * (1 + d) * t + rng.random()) % 1.0
        out += 2 * ph - 1
    return out / (3 if detune else 1)
def lp(x, fc, order=2):
    b, a = butter(order, min(fc, SR * 0.45) / (SR / 2)); return lfilter(b, a, x)
def hp(x, fc, order=2):
    b, a = butter(order, fc / (SR / 2), 'high'); return lfilter(b, a, x)
def noise(dur): return rng.standard_normal(int(dur * SR))

def kick(g=1.0):
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = 48 + 120 * np.exp(-t * 32)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7.5)
    click = hp(noise(0.006), 2000) * 0.25
    body[:len(click)] += click
    return np.tanh(body * 1.6) * g
def clap():
    d = 0.22; x = hp(lp(noise(d), 6000), 900)
    e = np.zeros(len(x)); t = np.arange(len(x)) / SR
    for o in (0, 0.009, 0.019): e += (t >= o) * np.exp(-np.maximum(t - o, 0) * 55) * 0.6
    e += np.exp(-t * 18) * 0.35
    return x * e
def hat(d=0.04, open_=False):
    d = 0.22 if open_ else d
    x = hp(noise(d), 7500); return x * env(len(x), 0.001, d, 4 if open_ else 6)
def crash(d=2.2):
    x = hp(noise(d), 4500); return x * env(len(x), 0.002, d, 3.5)
def impact():
    n = int(1.4 * SR); t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * np.cumsum(38 + 90 * np.exp(-t * 14)) / SR) * np.exp(-t * 3.2)
    return np.tanh(boom * 2) * 0.9 + crash(1.4) * 0.35
def riser(d):
    x = noise(d); t = np.arange(len(x)) / SR
    out = np.zeros(len(x)); step = 2400
    for i in range(0, len(x), step):
        fc = 400 + 9000 * (t[i] / d) ** 2
        out[i:i + step] = lp(x[max(0, i - 2000):i + step], fc)[-len(x[i:i + step]):]
    return out * (t / d) ** 2.2
def whoosh(d=0.45):
    x = riser(d); return hp(x, 1500)
def tick():
    n = int(0.05 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * 2600 * t) * np.exp(-t * 140) + hp(noise(0.05), 5000) * np.exp(-t * 200) * 0.4
def stab(notes, d=0.32, bright=4200):
    x = sum(saw(mtof(m), d, 0.006) for m in notes) / len(notes)
    return lp(x, bright) * env(len(x), 0.003, d, 4.5)
def pad(notes, d, bright=1800):
    x = sum(saw(mtof(m), d, 0.008) for m in notes) / len(notes)
    e = np.minimum(1, np.arange(len(x)) / (0.25 * SR)) * np.minimum(1, (len(x) - np.arange(len(x))) / (0.4 * SR))
    return lp(x, bright) * e
def bass(m, d):
    x = saw(mtof(m), d) * 0.7 + np.sin(2 * np.pi * mtof(m - 12) * np.arange(int(d * SR)) / SR) * 0.6
    return lp(x, 900) * env(int(d * SR), 0.004, d, 2.5)

# progression, one chord per bar (4 beats): Am  F  C  G
CH = [(57, [69, 72, 76]), (53, [65, 69, 72]), (48, [67, 72, 76]), (55, [67, 71, 74])]
GROOVE = (4.0, 32.0)       # full groove under the product moments
pump = np.ones(N)          # sidechain-style ducking driven by kicks

def beat_t(i): return i * B
# --- intro (0 - 4 s): pad + hats build, three hits on Find. Prove. Fix.
add(impact(), 0.08, 0.55)
add(pad(CH[0][1], 2.0, 1200), 0.0, 0.35, 0.0)
for i in range(8): add(hat(), 0.25 + i * 0.25, 0.10 + 0.02 * i, 0.3)
for k, tt in enumerate((2.0, 2.5, 3.0)):
    add(kick(), tt, 0.95)
    add(stab([n + 12 for n in CH[k % 4][1]] + [CH[k % 4][0] + 12], 0.45, 5200), tt, 0.5, (-0.3, 0, 0.3)[k])
    add(crash(0.6), tt, 0.12)
add(riser(1.0), 3.0, 0.32)
for i in range(8): add(clap(), 3.5 + i * B / 8, 0.12 + 0.05 * i)   # snare roll into the drop

# --- groove (4 - 32 s)
t0, t1 = GROOVE
nb = int((t1 - t0) / B)
for i in range(nb):
    t = t0 + i * B
    bar = int((t - t0) // (4 * B)); root, chord = CH[bar % 4]
    add(kick(), t, 0.95)
    ki = int(t * SR); pump[ki:ki + int(0.18 * SR)] = np.minimum(pump[ki:ki + int(0.18 * SR)], np.linspace(0.45, 1, int(0.18 * SR)) ** 1.5)
    if i % 2 == 1: add(clap(), t, 0.45, 0.05)
    for s16 in range(4):
        add(hat(), t + s16 * B / 4, (0.16 if s16 == 2 else 0.08), 0.35)
    add(hat(open_=True), t + B / 2, 0.10, -0.3)
    for e8 in range(2):
        add(bass(root - 12 + (12 if (i * 2 + e8) % 4 == 3 else 0), B / 2 * 0.9), t + e8 * B / 2, 0.42)
    # syncopated chord stabs: on the "and" of 1 and on 3
    if i % 4 in (0, 2): add(stab(chord, 0.22), t + (B / 2 if i % 4 == 0 else 0), 0.20, 0.2 if i % 8 < 4 else -0.2)
    if i % 4 == 3: add(stab([n + 12 for n in chord], 0.18, 6000), t + 0.75 * B, 0.13, 0.4)
# top-line pluck arpeggio from the "Ranked" scene on, for lift
for i in range(int((32 - 12.5) / (B / 2))):
    t = 12.5 + i * B / 2
    bar = int((t - t0) // (4 * B)); root, chord = CH[bar % 4]
    m = (chord + [chord[0] + 12])[i % 4] + 12
    x = saw(mtof(m), 0.16) * 0.5 + np.sin(2 * np.pi * mtof(m) * np.arange(int(0.16 * SR)) / SR)
    add(lp(x, 5000) * env(len(x), 0.002, 0.16, 6), t, 0.07, (-0.4, 0.4)[i % 2])

# --- hits on scene cuts and clicks
for c in (8.5, 12.5, 17.0, 21.5, 24.5, 29.0):
    add(whoosh(0.5), c - 0.5, 0.35, 0.2)
    add(crash(1.6), c, 0.16)
for c in (4.0,): add(impact(), c, 0.6); add(crash(2.4), c, 0.25)
for c in (7.5, 23.5): add(tick(), c, 0.35)
for k, c in enumerate((29.0, 29.5, 30.0)): add(stab([n + 12 for n in CH[k][1]], 0.3, 6000), c, 0.25)
# --- end card: big hit + held chord that rings out
add(riser(1.5), 30.5, 0.3)
add(impact(), 32.0, 0.85)
add(crash(3.5), 32.0, 0.3)
end = pad([57, 64, 69, 72, 76], 4.9, 2400) * np.exp(-np.arange(int(4.9 * SR)) / SR * 0.5)
add(end, 32.0, 0.5)
add(bass(45, 3.0), 32.0, 0.5)

L *= pump; R *= pump
fade = np.ones(N); fs = int(36.2 * SR); fade[fs:] = np.linspace(1, 0, N - fs) ** 2
L *= fade; R *= fade
mix = np.stack([L, R], 1)
mix = np.tanh(mix / np.abs(mix).max() * 1.4) / np.tanh(1.4) * 0.89   # gentle saturation, peak -1 dBFS
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), 'build', 'music.wav')
os.makedirs(os.path.dirname(out), exist_ok=True)
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('wrote', out, f'{N / SR:.2f}s')
