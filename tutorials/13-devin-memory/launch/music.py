"""Synthesize the launch music bed (no samples): upbeat 120 BPM pop-house in D major, cut to the film.
usage: python3 music.py out.wav   (48 kHz stereo, unnormalized; build.sh runs loudnorm to -16 LUFS)"""
import sys, wave
import numpy as np
from scipy.signal import butter, lfilter, sawtooth, fftconvolve

SR, DUR = 48000, 35.6
N = int(DUR * SR)
BPM = 120; B = 60 / BPM; BAR = 4 * B
rng = np.random.default_rng(13)
mtof = lambda m: 440 * 2 ** ((m - 69) / 12)

class Bus:
    def __init__(s): s.L = np.zeros(N); s.R = np.zeros(N)
    def add(s, sig, t0, g=1.0, pan=0.0):
        i = int(round(t0 * SR))
        if i >= N or i + len(sig) <= 0: return
        if i < 0: sig = sig[-i:]; i = 0
        j = min(N, i + len(sig)); x = sig[:j - i] * g
        s.L[i:j] += x * np.sqrt(0.5 * (1 - pan)); s.R[i:j] += x * np.sqrt(0.5 * (1 + pan))

def filt(x, f, kind='low', order=2):
    b, a = butter(order, np.clip(np.atleast_1d(f) / (SR / 2), 1e-4, 0.99), kind); return lfilter(b, a, x)
def bp(x, lo, hi): b, a = butter(2, [lo / (SR / 2), hi / (SR / 2)], 'band'); return lfilter(b, a, x)
def tt(d): return np.arange(int(d * SR)) / SR
def adsr(n, a, d, s, r_at=None, r=0.05):
    t = np.arange(n) / SR
    e = np.where(t < a, t / max(a, 1e-4), s + (1 - s) * np.exp(-(t - a) / max(d, 1e-4)))
    if r_at is not None: e = e * np.clip(1 - (t - r_at) / r, 0, 1)
    return e
def noise(d): return rng.standard_normal(int(d * SR))

drums, bass, pad, arp, fx = Bus(), Bus(), Bus(), Bus(), Bus()

# ---- sounds ----
def kick():
    t = tt(0.42); f = 46 + 130 * np.exp(-t * 32)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7.5)
    click = filt(noise(0.42), 3000, 'high') * np.exp(-t * 300) * 0.3
    return np.tanh((body + click) * 1.6)
def clap():
    x = bp(noise(0.3), 900, 5000); t = tt(0.3); e = np.zeros_like(t)
    for o in (0, 0.011, 0.022): e += (t >= o) * np.exp(-(t - o).clip(0) * (90 if o < 0.02 else 18))
    return x * e * 0.8
def hat(d=0.045):
    x = filt(noise(d), 7000, 'high'); return x * np.exp(-tt(d) * (4 / d))
def ohat(): return filt(noise(0.22), 6500, 'high') * np.exp(-tt(0.22) * 14)
def snare():
    t = tt(0.2); return (bp(noise(0.2), 1200, 8000) * 0.8 + np.sin(2 * np.pi * 190 * t) * 0.5) * np.exp(-t * 28)
def crash(d=2.2):
    x = filt(noise(d), 4500, 'high') + 0.4 * bp(noise(d), 2500, 9000); return x * np.exp(-tt(d) * 2.2) * 0.5
def boom():
    t = tt(2.0); f = 40 + 60 * np.exp(-t * 6)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.8) + filt(noise(2.0), 200) * np.exp(-t * 4) * 0.6
def riser(d):
    t = tt(d); k = t / d
    x = noise(d); hp = filt(x, 400, 'high'); lp = filt(x, 9000, 'low')
    sweep = np.sin(2 * np.pi * np.cumsum(300 + 1500 * k ** 2) / SR) * 0.15
    return (hp * (0.3 + 0.7 * k) * k ** 2 * 0.5 + sweep * k) * np.clip((d - t) / 0.02, 0, 1)
def whoosh(d=0.55):
    t = tt(d); k = t / d; e = np.sin(np.pi * k) ** 2
    lo = bp(noise(d), 300, 1500); hi = bp(noise(d), 1500, 7000)
    return (lo * (1 - k) + hi * k) * e * 0.55
def supersaw(m, d, cutoff, voices=5, spread=0.18):
    t = tt(d); out = np.zeros(len(t))
    for v in range(voices):
        det = spread * (v - (voices - 1) / 2) / ((voices - 1) / 2)
        out += sawtooth(2 * np.pi * mtof(m + det) * t + rng.uniform(0, 6.28))
    return filt(out / voices, cutoff, order=2)
def pluck(m, d=0.22):
    t = tt(d); x = sawtooth(2 * np.pi * mtof(m) * t, 0.5) * 0.6 + np.sin(2 * np.pi * mtof(m) * t) * 0.6
    return filt(x, 2600) * np.exp(-t * 16)
def bassnote(m, d):
    t = tt(d); f = mtof(m)
    x = np.sin(2 * np.pi * f * t) * 0.8 + filt(sawtooth(2 * np.pi * f * t), 700) * 0.5
    return x * adsr(len(t), 0.004, 0.18, 0.6, d - 0.03, 0.03)

K, C, Hh, OH, SN = kick(), clap(), hat(), ohat(), snare()

# ---- harmony: D  A  Bm  G (I V vi IV) ----
CH = [[62, 66, 69, 74], [61, 64, 69, 73], [62, 66, 71, 74], [62, 67, 71, 74]]
BS = [38, 45, 47, 43]
ARP = [[74, 78, 81, 86], [73, 76, 81, 85], [74, 78, 83, 86], [74, 79, 83, 86]]
nbars = int(np.ceil(DUR / BAR))
GROOVE0, END = 4.0, 31.0

kick_times = []
for bi in range(nbars):
    t0 = bi * BAR; ci = bi % 4
    if t0 >= END: break
    # pad: whole bar chord, filtered dark in the intro, bright from the drop
    cut = 1100 if t0 < 2 else (2200 if t0 < GROOVE0 else (4200 if t0 < 28 else 5200))
    for m in CH[ci]:
        x = supersaw(m, BAR + 0.05, cut) * adsr(int((BAR + 0.05) * SR), 0.02, 1.5, 0.75, BAR - 0.02, 0.06)
        pad.add(x, t0, 0.16, pan=rng.uniform(-0.5, 0.5))
    for s in range(16):
        t = t0 + s * B / 4
        if t >= END: break
        n = ARP[ci][[0, 1, 2, 3, 2, 1, 2, 3][s % 8]] + (12 if t >= 28 and s % 4 == 2 else 0)
        g = (0.35 if t < 2 else 0.6) * (1.0 if s % 4 == 0 else 0.7)
        arp.add(pluck(n), t, g * 0.5, pan=0.35 * np.sin(s * 0.9))
    for q in range(4):
        tb = t0 + q * B
        if tb >= END: continue
        if tb >= 2.0:
            drums.add(K, tb, 0.95); kick_times.append(tb)
        if tb >= GROOVE0:
            if q in (1, 3): drums.add(C, tb, 0.55, pan=0.05)
            drums.add(OH, tb + B / 2, 0.22, pan=0.2)
            for s in range(4): drums.add(Hh, tb + s * B / 4, 0.16 if s % 2 else 0.08, pan=-0.25)
        if tb >= 2.0:  # offbeat bass
            bass.add(bassnote(BS[ci], B / 2 - 0.02), tb + B / 2, 0.55)
            if tb >= GROOVE0 and q == 3: bass.add(bassnote(BS[ci] + 12, B / 4 - 0.02), tb + 3 * B / 4, 0.35)

# rolls and hits on the cuts
def roll(t_end, dur, g=0.4):
    t, n = t_end - dur, 0
    while t < t_end - 1e-6:
        k = 1 - (t_end - t) / dur
        step = B / 2 if k < 0.5 else (B / 4 if k < 0.8 else B / 8)
        drums.add(SN, t, g * (0.3 + 0.7 * k), pan=0.1); t += step
roll(4.0, 2 * B, 0.45); fx.add(riser(2.0), 2.0, 0.9)
for t in (13.0, 22.0): roll(t, B, 0.32)
roll(31.0, 2 * B, 0.5); fx.add(riser(2.0), 29.0, 1.0)
for t in (4.0, 13.0, 22.0, 28.0): drums.add(crash(), t, 0.5)
for t, p in ((8.0, -0.4), (13.0, 0.4), (22.0, -0.4), (24.5, 0.4), (28.0, 0.0), (3.7, 0.0)): fx.add(whoosh(), t - 0.18, 0.45, pan=p)
fx.add(boom(), 0.4, 0.5)
# finale: big chord, sub boom, crash, long ring-out under the logo
fx.add(boom(), END, 0.9); drums.add(crash(3.5), END, 0.6)
for m in CH[0] + [50, 86]:
    x = supersaw(m, 4.5, 3800) * adsr(int(4.5 * SR), 0.01, 1.4, 0.35, 3.6, 0.9)
    pad.add(x, END, 0.2, pan=rng.uniform(-0.6, 0.6))
bass.add(bassnote(38, 3.0) * np.exp(-tt(3.0) * 0.8), END, 0.6)
for i, n in enumerate([74, 78, 81, 86, 90, 93]):
    arp.add(pluck(n, 0.6), END + 0.95 + i * B / 4, 0.32, pan=0.4 * np.sin(i))

# sidechain pump on pad, bass, arp
sc = np.ones(N)
for kt in kick_times:
    i = int(kt * SR); n = min(N - i, int(0.45 * SR))
    if n > 0: sc[i:i + n] = np.minimum(sc[i:i + n], 1 - 0.65 * np.exp(-np.arange(n) / SR / 0.09))
for bus in (pad, arp): bus.L *= sc; bus.R *= sc
bass.L *= 0.4 + 0.6 * sc; bass.R *= 0.4 + 0.6 * sc

def reverb(bus, mix, d=1.6):
    ir = np.exp(-tt(d) * 3.5)
    irL = rng.standard_normal(len(ir)) * ir; irR = rng.standard_normal(len(ir)) * ir
    irL /= np.sqrt((irL ** 2).sum()); irR /= np.sqrt((irR ** 2).sum())
    return bus.L + mix * fftconvolve(bus.L, irL)[:N], bus.R + mix * fftconvolve(bus.R, irR)[:N]

pl, pr = reverb(pad, 0.25); al, ar = reverb(arp, 0.35); fl, fr = reverb(fx, 0.2)
L = drums.L + bass.L + pl + al + fl
R = drums.R + bass.R + pr + ar + fr
L = filt(L, 25, 'high'); R = filt(R, 25, 'high')
fade = np.clip((DUR - 0.15 - np.arange(N) / SR) / 0.9, 0, 1)
L *= fade; R *= fade
pk = max(np.abs(L).max(), np.abs(R).max()); L, R = np.tanh(L / pk * 1.2) * 0.8, np.tanh(R / pk * 1.2) * 0.8
st = (np.stack([L, R], 1) * 32767).astype('<i2')
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes())
print('wrote', sys.argv[1], f'{DUR}s')
