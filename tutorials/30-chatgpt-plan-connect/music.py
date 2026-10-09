# Tutorial 30 variant 5 music: bright, glassy 110 BPM broken-beat pop, cut to the beats in scenes.js (FILM_T).
# FM-bell ostinato and a soft pad while the two pills drift in, a rising sine as the line draws, a snap + chord
# when the line becomes a toggle, then a light syncopated groove (tight kick, rim, shaker, sub) under the UI and
# split, small bell accents on each switch, and a single held chord under the Devin logo. All synthesized.
from scipy.signal import fftconvolve
BPM = 110; B = 60 / BPM; BAR = 4 * B; S16 = B / 4
SNAP, LAND, CARD, RING, SPLIT, SPLIT2, END = 4 * B, 10 * B, 13 * B, 14 * B, 17 * B, 18 * B, 23 * B
CH = [[64, 68, 71, 75], [61, 64, 68, 71], [57, 61, 64, 68], [59, 63, 66, 68]]   # Emaj7  C#m7  Amaj7  B6
BS = [40, 37, 33, 35]
BUS = {k: np.zeros(N) for k in ('pl', 'pr', 'dl', 'dr')}
def put(sig, t0, gain, pan=0.0, bus='p'):
    i = int(round(t0 * SR)); s = sig * gain
    if i < 0: s = s[-i:]; i = 0
    j = min(N, i + len(s))
    if j <= i: return
    BUS[bus + 'l'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 - pan)); BUS[bus + 'r'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 + pan))
def hp(x, a): return x - lp(x, a)
def tt(d): return np.arange(int(d * SR)) / SR
def bell(m, d=0.9, idx=2.2):                                    # 2-op FM bell, glassy
    t = tt(d); f = mtof(m)
    mod = np.sin(2 * np.pi * f * 3.5 * t) * idx * np.exp(-t * 7)
    return np.sin(2 * np.pi * f * t + mod) * np.exp(-t * 4.2) * np.minimum(1, t / 0.002)
def pad(notes, d):
    t = tt(d); n = len(t); e = np.minimum(1, t / 0.6) * np.minimum(1, (d - t) / 0.5)
    x = sum(np.sin(2 * np.pi * mtof(m) * (1 + dt) * t) + 0.25 * np.sin(4 * np.pi * mtof(m) * t) for m in notes for dt in (-0.002, 0.002))
    return lp(x, 0.08) * e / len(notes)
def kick():
    t = tt(0.26); f = 50 + 140 * np.exp(-t * 45)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 14) + hp(noise(0.26), 0.6) * np.exp(-t * 400) * 0.25
def rim():
    t = tt(0.09); return (np.sin(2 * np.pi * 1700 * t) * 0.6 + hp(noise(0.09), 0.3)) * np.exp(-t * 70)
def snap():
    t = tt(0.18); x = hp(lp(noise(0.18), 0.5), 0.12); return x * (np.exp(-t * 55) + 0.4 * np.exp(-np.maximum(0, t - 0.008) * 30) * (t > 0.008))
def shaker(d=0.06): x = hp(noise(d), 0.7); t = tt(d)[:len(x)]; return x * np.minimum(1, t / 0.006) * np.exp(-t * 60)
def sub(m, d): t = tt(d); return np.sin(2 * np.pi * mtof(m) * t) * np.minimum(1, t / 0.005) * np.minimum(1, (d - t) / 0.03).clip(0)

K, RM, SN, SH = kick(), rim(), snap(), shaker()
sc = np.ones(N); kicks = []
nb = int(np.ceil(END / BAR)) + 1
for b in range(nb):
    tb = b * BAR; ch = CH[b % 4]
    put(pad([m + 12 for m in ch], BAR + 0.6), tb, 0.08 if tb < SNAP else 0.11, 0, 'p')
    for k in range(8):                                          # mallet ostinato, 8ths with a skip
        t = tb + k * B / 2
        if t >= END - 0.05 or k in (3, 7) and tb >= SNAP: continue
        m = ch[[0, 2, 3, 1, 2, 3, 1, 2][k]] + 12
        put(bell(m, 0.8, 1.6), t, 0.11 if tb < SNAP else 0.10, -0.35 if k % 2 else 0.35, 'p')
    if tb < SNAP: continue
    for k in range(16):                                         # broken beat: kick 1, 2&, 3a ; rim 2, 4 ; shaker 16ths
        t = tb + k * S16
        if t >= END - 0.02: continue
        if k in (0, 6, 11): kicks.append(t); put(K, t, 0.62, 0, 'd')
        if k in (4, 12): put(SN, t, 0.30, 0.05, 'd'); put(RM, t, 0.08, -0.1, 'd')
        if k in (14,): put(RM, t, 0.07, 0.25, 'd')
        put(SH, t, 0.05 if k % 2 else 0.028, 0.3, 'd')
    for k, (o, d) in enumerate(((0, 0.7), (1.5, 0.4), (2.75, 0.9))):   # sub follows the kick
        t = tb + o * B
        if t < END - 0.02: put(sub(BS[b % 4], min(d * B, END - t)), t, 0.36, 0, 'p')
for t in kicks:
    i = int(t * SR); j = min(N, i + int(0.3 * SR)); x = np.arange(j - i) / SR
    sc[i:j] = np.minimum(sc[i:j], 1 - 0.45 * np.exp(-x / 0.08))
BUS['pl'] *= sc; BUS['pr'] *= sc

# the line drawing: a quiet rising sine (2 beats) into the toggle snap
t = tt(2 * B); f = 440 * 2 ** (t / (2 * B) * 1.0)
put(np.sin(2 * np.pi * np.cumsum(f) / SR) * (t / (2 * B)) ** 1.5 * 0.5, 2 * B, 0.06, 0, 'p')
put(hp(noise(2 * B), 0.4) * (tt(2 * B) / (2 * B)) ** 2.5, 2 * B, 0.05, 0, 'd')
# toggle snap: click + bright chord
put(rim(), SNAP, 0.25, 0, 'd')
for i, m in enumerate([76, 80, 83, 87]): put(bell(m, 1.6, 2.6), SNAP + 0.012 * i, 0.12, -0.3 + 0.2 * i, 'p')
# small accents: switch lands, hover-card ring, billing split rows
for t0, ms, g in ((LAND, [83, 88], 0.10), (RING, [88], 0.08), (SPLIT, [80], 0.08), (SPLIT2, [76], 0.07)):
    for i, m in enumerate(ms): put(bell(m, 1.1, 2.0), t0 + 0.03 * i, g, 0.2 - 0.4 * i, 'p')
# end: one held Emaj9 chord + low E, sparkle
put(K, END, 0.55, 0, 'd')
put(pad([64, 71, 75, 78, 80], 2.6) * np.exp(-tt(2.6) * 0.6), END, 0.34, 0, 'p')
put(sub(28, 1.8) * np.exp(-tt(1.8) * 1.6), END, 0.40, 0, 'p')
for i, m in enumerate([88, 92, 95, 99]): put(bell(m, 1.8, 1.4), END + 0.07 * i, 0.07, -0.3 + 0.2 * i, 'p')

# room: short synthetic plate on the tonal bus
n = int(1.6 * SR); ir_t = np.arange(n) / SR
irl = lp(rng.standard_normal(n), 0.35) * np.exp(-ir_t / 0.38); irr = lp(rng.standard_normal(n), 0.35) * np.exp(-ir_t / 0.38)
irl /= np.sqrt((irl ** 2).sum()); irr /= np.sqrt((irr ** 2).sum())
wl = fftconvolve(BUS['pl'], irl)[:N]; wr = fftconvolve(BUS['pr'], irr)[:N]
ML[:] = BUS['pl'] + 0.30 * wl + BUS['dl']; MR[:] = BUS['pr'] + 0.30 * wr + BUS['dr']
pk = max(np.abs(ML).max(), np.abs(MR).max(), 1e-9); ML /= pk; MR /= pk
ML[:] = np.tanh(2.0 * ML) / np.tanh(2.0); MR[:] = np.tanh(2.0 * MR) / np.tanh(2.0)   # gentle soft clip keeps transient peaks under -1 dBFS after loudnorm
FADE_IN, FADE_OUT, KIT_STINGERS, MUSIC_GAIN = 0.02, 0.5, False, 0.55
