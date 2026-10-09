# Keynote cut music: bright 100 BPM syncopated pop (FM e-piano chops, sub bass, kick/clap/snap, shaker), cut to scenes.js.
# Beat b lands at O + b*BEAT. Title lines on b0/b2, the switch flips on the drop (b8), the logo lands on b20.
# Runs inside _kit/tools/audio.py (refills ML/MR). All synthesized.
from scipy.signal import fftconvolve
BPM = 100; BEAT = 60 / BPM; O = 0.25
at = lambda b: O + b * BEAT
BUS = {k: np.zeros(N) for k in ('tl', 'tr', 'dl', 'dr')}
def put(sig, t0, gain, pan=0.0, bus='t'):
    i = int(round(t0 * SR)); s = sig * gain
    if i < 0: s = s[-i:]; i = 0
    j = min(N, i + len(s))
    if j <= i: return
    BUS[bus + 'l'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 - pan)); BUS[bus + 'r'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 + pan))
def hp(x, a): return x - lp(x, a)
def tt(d): return np.arange(int(d * SR)) / SR
def ep(m, d, bright=1.0, dec=3.0):                              # FM electric piano
    t = tt(d); f = mtof(m); I = bright * 1.8 * np.exp(-t * 6)
    x = np.sin(2 * np.pi * f * t + I * np.sin(2 * np.pi * f * t)) + 0.25 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 9)
    return x * np.minimum(1, t / 0.003) * np.exp(-t * dec) * np.minimum(1, (d - t) / 0.03)
def chord(ns, d, bright=1.0, dec=3.0): return sum(ep(m, d, bright, dec) for m in ns) / len(ns)
def bell(m, d=1.2):
    t = tt(d); f = mtof(m)
    return (np.sin(2 * np.pi * f * t + 1.2 * np.exp(-t * 4) * np.sin(2 * np.pi * 3.5 * f * t))) * np.minimum(1, t / 0.002) * np.exp(-t * 3.2)
def sub(m, d):
    t = tt(d); return np.tanh(1.6 * np.sin(2 * np.pi * mtof(m) * t)) * np.minimum(1, t / 0.004) * np.exp(-t * 2.5) * np.minimum(1, (d - t) / 0.02)
def kick():
    t = tt(0.35); f = 44 + 120 * np.exp(-t * 38)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 8) + hp(noise(0.35), 0.5) * np.exp(-t * 400) * 0.25
def clap():
    x = hp(lp(noise(0.25), 0.5), 0.1); e = np.zeros(len(x)); idx = np.arange(len(x))
    for o, dd in ((0, 0.01), (0.008, 0.01), (0.016, 0.16)): e += env(len(x), 0.0004, dd, 4) * (idx >= o * SR)
    return x * e
def snap():
    x = hp(lp(noise(0.08), 0.7), 0.25); return x * env(len(x), 0.0003, 0.03, 4) + osc(1900, 0.08) * env(int(0.08 * SR), 0.0003, 0.012, 4) * 0.3
def hat(d): x = hp(noise(d), 0.62); return x * env(len(x), 0.0004, d * 0.5, 5)
def pad(ns, d, cut=0.03):
    t = tt(d); e = np.minimum(1, t / 0.4) * np.minimum(1, (d - t) / 0.5)
    return sum(lp(osc(mtof(m) * (1 + dt), d, 'saw'), cut) for m in ns for dt in (-0.0015, 0.0015)) * e / len(ns)

E, CSM, A, Bc = [56, 59, 63, 66], [56, 59, 63, 64], [56, 59, 61, 64], [54, 58, 61, 63]   # Emaj9  C#m9  Amaj9  B6/9
HAR = [(0, E, 40), (4, CSM, 37), (8, A, 33), (12, Bc, 35), (16, CSM, 37), (18, Bc, 35)]   # (start beat, chord, bass)
def harm(b):
    r = HAR[0]
    for h in HAR:
        if b >= h[0]: r = h
    return r
END = 20; K, CL, SN, HC, HO = kick(), clap(), snap(), hat(0.035), hat(0.12)

# pads under everything (quiet), dark before the drop, a touch brighter after
for i, (b0, ch, bs) in enumerate(HAR):
    b1 = HAR[i + 1][0] if i + 1 < len(HAR) else END
    put(pad([m + 12 for m in ch], (b1 - b0) * BEAT + 0.4, 0.025 if b0 < 8 else 0.04), at(b0), 0.10, 0, 't')

# intro: two title chords, then an eighth-note pulse that climbs into the drop
put(chord([m + 12 for m in E] + [52], 2.2, 1.2, 1.6), at(0), 0.42, 0, 't'); put(sub(28, 1.6), at(0), 0.25, 0, 't')
put(chord([m + 12 for m in E] + [71], 2.0, 1.3, 1.8), at(2), 0.40, 0, 't'); put(sub(40, 1.2), at(2), 0.20, 0, 't')
for k in range(8):
    b = 4 + k * 0.5
    put(chord([m + 12 for m in CSM], 0.25, 0.7 + 0.08 * k, 9), at(b), 0.10 + 0.02 * k, -0.2 if k % 2 else 0.2, 't')
for b in (5, 7): put(SN, at(b), 0.30, 0.1, 'd')
put(bell(83, 1.0), at(6), 0.09, 0.3, 't')                                  # card scene
n = int(2 * BEAT * SR); r = (np.arange(n) / n) ** 2.4
put(hp(noise(2 * BEAT), 0.4) * r, at(6), 0.09, 0, 'd')                     # riser into the drop

# groove from the drop to the logo
kicks = []
for bar in range(8, END, 4):
    for off in (0, 1.5, 2, 3.5 if (bar // 4) % 2 else None):
        if off is None: continue
        t = at(bar + off); kicks.append(t); put(K, t, 0.62, 0, 'd')
    for off in (1, 3): put(CL, at(bar + off), 0.26, 0.05, 'd')
    for k in range(8): put(HC if k % 2 == 0 else HO, at(bar + k * 0.5), 0.030 if k % 2 == 0 else 0.042, 0.25, 'd')
    for k in range(16): put(hat(0.02), at(bar + k * 0.25), 0.014 * (1.4 if k % 4 == 2 else 1), -0.35, 'd')
    for off in (0, 0.75, 1.5, 2, 2.75, 3.5):
        b = bar + off; _, ch, bs = harm(b)
        put(sub(bs + (12 if off == 2.75 else 0), BEAT * 0.42), at(b), 0.34, 0, 't')
    for off in (0.5, 1.25, 2, 2.75, 3.5):
        b = bar + off; _, ch, bs = harm(b)
        put(chord([m + 12 for m in ch], 0.3, 1.0, 8), at(b), 0.17, -0.18 if int(off * 4) % 2 else 0.18, 't')
put(hp(noise(1.8), 0.55) * env(int(1.8 * SR), 0.001, 0.8, 4), at(8), 0.06, 0, 'd')   # soft crash on the drop
put(osc(2600, 0.03) * env(int(0.03 * SR), 0.0002, 0.006), at(8), 0.10, 0, 'd')       # switch tick
for b, m in ((11, 83), (15.25, 80), (15.75, 87), (16.5, 78), (17, 83)): put(bell(m, 1.0), at(b), 0.07, 0.25, 't')
put(hp(noise(BEAT), 0.4) * (np.arange(int(BEAT * SR)) / (BEAT * SR)) ** 2.4, at(END - 1), 0.08, 0, 'd')
# logo: kick, wide Emaj chord, bells, long tail
put(K, at(END), 0.7, 0, 'd'); put(hp(noise(2.4), 0.55) * env(int(2.4 * SR), 0.001, 1.0, 4), at(END), 0.07, 0, 'd')
put(chord([52, 56, 59, 63, 64, 68, 71], 2.6, 1.3, 1.1), at(END), 0.55, 0, 't'); put(sub(28, 2.2), at(END), 0.32, 0, 't')
for i, m in enumerate([83, 87, 90, 95]): put(bell(m, 1.6), at(END) + 0.07 * i, 0.06, -0.3 + 0.2 * i, 't')

sc = np.ones(N)                                                            # light sidechain from the kick
for t in kicks:
    i = int(t * SR); j = min(N, i + int(0.3 * SR)); x = np.arange(j - i) / SR
    sc[i:j] = np.minimum(sc[i:j], 1 - 0.45 * np.exp(-x / 0.08))
BUS['tl'] *= sc; BUS['tr'] *= sc
n = int(1.6 * SR); ir_t = np.arange(n) / SR
irl = lp(rng.standard_normal(n), 0.3) * np.exp(-ir_t / 0.38); irr = lp(rng.standard_normal(n), 0.3) * np.exp(-ir_t / 0.38)
irl /= np.sqrt((irl ** 2).sum()); irr /= np.sqrt((irr ** 2).sum())
wl = fftconvolve(BUS['tl'], irl)[:N]; wr = fftconvolve(BUS['tr'], irr)[:N]
ML[:] = BUS['tl'] + 0.3 * wl + BUS['dl']; MR[:] = BUS['tr'] + 0.3 * wr + BUS['dr']
pk = max(np.abs(ML).max(), np.abs(MR).max(), 1e-9); ML /= pk; MR /= pk
FADE_IN, FADE_OUT, KIT_STINGERS, MUSIC_GAIN = 0.01, 0.5, False, 0.55
