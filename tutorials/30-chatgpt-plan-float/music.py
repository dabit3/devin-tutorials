# Tutorial 30, variant 2 music: airy 100 BPM two-step garage in E major, cut to scenes.js (bar = 2.4 s).
# Glassy FM bells and a soft pad on the lockup, the shuffled beat and sub bass drop as the window lands (2.4 s),
# a bright bell chord as the real switch flips on (6.0 s), a lift as the hover card floats forward (9.0 s),
# the beat steps out into a one-beat riser and a final chord on the end lockup (12.0 s). All synthesized.
from scipy.signal import fftconvolve
BPM = 100; BEAT = 60 / BPM; BAR = 4 * BEAT; S16 = BEAT / 4; SW = 0.22 * S16          # swing on off-16ths
DROP, FLIP, CARD, HIT = 2.4, 6.0, 9.0, 12.0
CH = [[64, 68, 71, 75, 78], [61, 64, 68, 71, 75], [57, 61, 64, 68, 71], [59, 63, 66, 68, 73]]   # Emaj9  C#m9  Amaj9  B6sus
BS = [28, 25, 33, 35]
B = {k: np.zeros(N) for k in ('pl', 'pr', 'dl', 'dr')}
def put(sig, t0, gain, pan=0.0, bus='p'):
    i = int(round(t0 * SR)); s = sig * gain
    if i < 0: s = s[-i:]; i = 0
    j = min(N, i + len(s))
    if j <= i: return
    B[bus + 'l'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 - pan)); B[bus + 'r'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 + pan))
def hp(x, a): return x - lp(x, a)
def tt(d): return np.arange(int(d * SR)) / SR
def bell(m, d=1.2, idx=1.6):                                   # 2-op FM bell, glassy
    t = tt(d); f = mtof(m)
    return np.sin(2 * np.pi * f * t + idx * np.exp(-t * 6) * np.sin(2 * np.pi * f * 3.5 * t)) * env(len(t), 0.002, d * 0.45, 4)
def keys(notes, d):                                            # soft electric-piano chord
    t = tt(d); e = env(len(t), 0.004, d * 0.8, 3)
    return sum(np.sin(2 * np.pi * mtof(m) * t + 0.9 * np.exp(-t * 8) * np.sin(2 * np.pi * mtof(m) * t)) for m in notes) * e / len(notes)
def pad(notes, d, cut=0.04):
    n = int(d * SR); e = np.minimum(1, np.arange(n) / (0.5 * SR)) * np.minimum(1, (n - np.arange(n)) / (0.5 * SR))
    return sum(lp(osc(mtof(m) * (1 + dt), d, 'saw'), cut) for m in notes for dt in (-0.002, 0.002)) * e / len(notes)
def sub(m, d):
    t = tt(d); return np.tanh(1.4 * np.sin(2 * np.pi * mtof(m) * t)) * env(len(t), 0.006, d * 0.9, 2.5) * np.minimum(1, (len(t) - np.arange(len(t))) / (0.02 * SR))
def kick():
    t = tt(0.3); f = 48 + 120 * np.exp(-t * 38)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 11)
def rim():
    x = hp(noise(0.12), 0.3) * env(int(0.12 * SR), 0.0005, 0.035, 4)
    return x + 0.5 * np.sin(2 * np.pi * 820 * tt(0.12)) * env(int(0.12 * SR), 0.0005, 0.02, 4)
def snare():
    x = hp(lp(noise(0.25), 0.5), 0.1) * env(int(0.25 * SR), 0.001, 0.12, 4)
    return x + 0.4 * np.sin(2 * np.pi * 190 * tt(0.25)) * env(int(0.25 * SR), 0.001, 0.05, 4)
def hat(d): x = hp(noise(d), 0.7); return x * env(len(x), 0.0005, d * 0.5, 5)
K, RM, SN, HC = kick(), rim(), snare(), hat(0.035)
def sw(k): return k * S16 + (SW if k % 2 else 0)

kicks = []
for b in range(0, 6):
    tb = b * BAR; ch = CH[b % 4]
    if tb >= HIT: break
    live = DROP <= tb < HIT
    put(pad([m + 12 for m in ch[:4]], BAR + 0.6, 0.03 if not live else 0.045), tb, 0.12, 0, 'p')
    if not live:                                               # intro: bell motif over the lockup
        for k, m in enumerate([ch[1] + 12, ch[2] + 12, ch[4] + 12, ch[3] + 24]):
            put(bell(m, 1.4), 0.1 + k * 2 * S16 + 0.5 * BEAT, 0.07, -0.35 + 0.23 * k, 'p')
        put(bell(ch[0] + 24, 1.6), tb + 2 * BEAT + S16, 0.05, 0.3, 'p'); put(bell(ch[2] + 24, 1.6), tb + 3 * BEAT, 0.045, -0.3, 'p')
        continue
    # two-step: kick on 1 and the skipped "a" of 2, rim on 2 and 4, shuffled 16th hats
    for k in (0, 7, 10):
        t = tb + sw(k)
        if b % 2 == 0 and k == 10: continue
        if t < HIT - BEAT: kicks.append(t); put(K, t, 0.5, 0, 'd')
    for q in (1, 3):
        t = tb + q * BEAT
        if t < HIT - BEAT: put(SN if q == 3 else RM, t, 0.17 if q == 3 else 0.12, 0.08, 'd')
    for k in range(16):
        t = tb + sw(k)
        if t < HIT - BEAT and k % 4 != 0: put(HC, t, 0.03 if k % 2 else 0.02, -0.25 if k % 2 else 0.25, 'd')
    # bass: syncopated sub
    for k, d in ((0, 5), (6, 2), (10, 4), (14, 2)):
        t = tb + sw(k)
        if t < HIT - BEAT: put(sub(BS[b % 4] + (12 if k == 14 else 0), d * S16 * 0.95), t, 0.33, 0, 'p')
    # chord stabs, off the beat
    for k in (2, 6, 11):
        t = tb + sw(k)
        if t < HIT - BEAT: put(keys([m + 12 for m in ch[:4]], 0.5), t, 0.10, -0.12 if k == 6 else 0.12, 'p')
    # bell arp, sparse
    for k in (3, 8, 13):
        t = tb + sw(k)
        if t < HIT - BEAT: put(bell(ch[(k // 3) % 5] + 24, 0.7, 1.2), t, 0.03, 0.4 if k % 2 else -0.4, 'p')

sc = np.ones(N)
for t in kicks:
    i = int(t * SR); j = min(N, i + int(0.3 * SR)); x = np.arange(j - i) / SR
    sc[i:j] = np.minimum(sc[i:j], 1 - 0.45 * np.exp(-x / 0.08))
B['pl'] *= sc; B['pr'] *= sc

def riser(d, peak, cut=0.35):
    n = int(d * SR); r = (np.arange(n) / n) ** 2.4
    return hp(noise(d), cut) * r * peak
def swell(notes, d):
    n = int(d * SR); r = (np.arange(n) / n) ** 2
    return sum(osc(mtof(m), d, 'tri') for m in notes) * r / len(notes)
# window lands: soft riser, airy crash, low sub thump
put(riser(1.2, 0.07), DROP - 1.2, 1, 0, 'd'); put(hp(noise(1.8), 0.6) * env(int(1.8 * SR), 0.001, 0.8, 4), DROP, 0.05, 0, 'd')
# switch flips on: a real-feeling click, then a bright bell chord
put(lp(noise(0.03), 0.6) * env(int(0.03 * SR), 0.0003, 0.008), FLIP, 0.35, 0, 'd')
put(np.sin(2 * np.pi * 2400 * tt(0.02)) * env(int(0.02 * SR), 0.0002, 0.006), FLIP, 0.08, 0, 'd')
for i, m in enumerate([76, 80, 83, 87]): put(bell(m + 12, 1.8, 1.3), FLIP + 0.02 + 0.035 * i, 0.06, -0.3 + 0.2 * i, 'p')
# hover card floats forward: tonal swell into a bell
put(swell([71, 76, 80], 0.8), CARD - 0.8, 0.05, 0, 'p'); put(bell(88, 1.6, 1.2), CARD, 0.05, 0.2, 'p'); put(bell(83, 1.6, 1.2), CARD + S16, 0.04, -0.2, 'p')
# end lockup: riser, kick, wide Emaj9 with a long tail and a sparkle
put(riser(BEAT * 1.2, 0.09), HIT - BEAT * 1.2, 1, 0, 'd')
put(K, HIT, 0.55, 0, 'd'); put(hp(noise(2.2), 0.6) * env(int(2.2 * SR), 0.001, 1.0, 4), HIT, 0.055, 0, 'd')
put(pad([64, 71, 75, 78, 83], 2.6, 0.07) * np.exp(-tt(2.6) * 0.9), HIT, 0.30, 0, 'p')
put(keys([64, 68, 71, 75, 78], 2.4), HIT, 0.14, 0, 'p'); put(sub(28, 1.8), HIT, 0.32, 0, 'p')
for i, m in enumerate([88, 92, 95, 99]): put(bell(m, 1.8, 1.0), HIT + 0.07 * i, 0.04, -0.3 + 0.2 * i, 'p')

# space: a longer, darker synthetic hall on the tonal bus
n = int(2.2 * SR); ir_t = np.arange(n) / SR
irl = lp(rng.standard_normal(n), 0.22) * np.exp(-ir_t / 0.55); irr = lp(rng.standard_normal(n), 0.22) * np.exp(-ir_t / 0.55)
irl /= np.sqrt((irl ** 2).sum()); irr /= np.sqrt((irr ** 2).sum())
wl = fftconvolve(B['pl'], irl)[:N]; wr = fftconvolve(B['pr'], irr)[:N]
ML[:] = B['pl'] + 0.34 * wl + B['dl']; MR[:] = B['pr'] + 0.34 * wr + B['dr']
pk = max(np.abs(ML).max(), np.abs(MR).max(), 1e-9); ML /= pk; MR /= pk
FADE_IN, FADE_OUT, KIT_STINGERS, MUSIC_GAIN = 0.02, 0.5, False, 0.55
