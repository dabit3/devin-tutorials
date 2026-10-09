# Tutorial 30 variant 3 (bento grid) music: a bright 96 BPM mallet-pop groove, cut to the edit. Runs inside
# _kit/tools/audio.py (refills ML/MR). FM marimba ostinato over warm pads, two-step kick, finger snaps and swung
# shakers. Each bento tile lands on an eighth note with a bell tone, the drums thin out while the grid focuses,
# return on the switch flip and resolve into a chord bloom on the logo. Times match scenes.js (T.*). All synthesized.
from scipy.signal import fftconvolve
BEAT = 60 / 96; BAR = 4 * BEAT; S16 = BEAT / 4
TILES, STAG, FOCUS, FLIP, LOGO = 4 * BEAT, BEAT / 2, 11 * BEAT, 14 * BEAT, 17 * BEAT
END = N / SR
CH = [[56, 59, 63, 66], [52, 56, 59, 63], [56, 59, 61, 64], [54, 59, 63, 68]]   # Emaj9  C#m9  Amaj9  B6
BS = [40, 37, 33, 35]
PL = {k: np.zeros(N) for k in ('pl', 'pr', 'dl', 'dr')}
def put(sig, t0, gain, pan=0.0, bus='p'):
    i = int(round(t0 * SR)); s = sig * gain
    if i < 0: s = s[-i:]; i = 0
    j = min(N, i + len(s))
    if j <= i: return
    PL[bus + 'l'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 - pan)); PL[bus + 'r'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 + pan))
def hp(x, a): return x - lp(x, a)
def fm(f, d, ratio, idx, dec, mdec):
    n = int(d * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * f * t + idx * np.exp(-t * mdec) * np.sin(2 * np.pi * f * ratio * t)) * np.exp(-t * dec) * np.minimum(1, t / 0.002)
def mallet(m, d=0.5): return fm(mtof(m), d, 4.0, 1.6, 9, 40)
def bell(m, d=1.4): return fm(mtof(m), d, 3.5, 2.2, 3.2, 6)
def pad(notes, d, cut=0.04):
    n = int(d * SR); e = np.minimum(1, np.arange(n) / (0.5 * SR)) * np.minimum(1, (n - np.arange(n)) / (0.5 * SR))
    return sum(lp(osc(mtof(m) * (1 + dt), d, 'saw'), cut) for m in notes for dt in (-0.0015, 0.0015)) * e / len(notes)
def kick():
    n = int(0.36 * SR); t = np.arange(n) / SR; f = 44 + 120 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 8) + hp(noise(0.36), 0.5) * np.exp(-t * 400) * 0.25
def snap():
    x = hp(lp(noise(0.16), 0.55), 0.12); idx = np.arange(len(x)); e = np.zeros(len(x))
    for o, dd in ((0, 0.006), (0.006, 0.006), (0.012, 0.07)): e += env(len(x), 0.0004, dd, 4) * (idx >= o * SR)
    body = osc(1800, 0.16) * env(len(x), 0.0004, 0.02, 4) * 0.25
    return x * e + body
def shaker(d=0.07): x = hp(noise(d), 0.7); n = len(x); return x * np.minimum(1, np.arange(n) / (0.012 * SR)) * np.exp(-np.arange(n) / SR / 0.02)
def sub(m, d): n = int(d * SR); t = np.arange(n) / SR; return (np.sin(2 * np.pi * mtof(m) * t) + 0.25 * np.sin(4 * np.pi * mtof(m) * t)) * env(n, 0.006, d * 0.9, 2.5)

K, SN, SH = kick(), snap(), shaker()
kicks = []
nb = int(np.ceil(LOGO / BAR)) + 1
for b in range(nb):
    tb = b * BAR; ch = CH[min(b, 3) if b < 4 else 3]
    if tb >= LOGO: break
    put(pad([m + 12 for m in ch], BAR + 0.6), tb, 0.08 if b == 0 else 0.10, 0, 'p')
    for k, p16 in enumerate((0, 3, 6, 8, 11, 14)):                # 3-3-2 mallet ostinato
        t = tb + p16 * S16
        if t >= LOGO - 0.05: continue
        m = ch[(k * 2 + b) % 4] + (24 if k % 2 == 0 else 12)
        put(mallet(m), t, 0.11 if b else 0.08, 0.35 if k % 2 else -0.35, 'p')
    if b == 0: continue
    thin = lambda t: FOCUS <= t < FLIP
    for q in range(4):                                         # sub bass on beats, pushed eighth before 3
        t = tb + q * BEAT
        if t < LOGO - 0.05: put(sub(BS[b if b < 4 else 3] + 12, BEAT * 0.8), t, 0.30 if not thin(t) else 0.18, 0, 'p')
    for p16 in (0, 7, 10):                                     # two-step kick
        t = tb + p16 * S16
        if t < LOGO - 0.05 and not thin(t): kicks.append(t); put(K, t, 0.55, 0, 'd')
    for q in (1, 3):
        t = tb + q * BEAT
        if t < LOGO - 0.05: put(SN, t, 0.30, 0.08, 'd')
    for k in range(16):                                        # swung 16th shakers
        t = tb + k * S16 + (S16 * 0.16 if k % 2 else 0)
        if t < LOGO - 0.05: put(SH, t, (0.05 if k % 4 == 2 else 0.03), -0.3, 'd')
sc = np.ones(N)
for t in kicks:
    i = int(t * SR); j = min(N, i + int(0.35 * SR)); x = np.arange(j - i) / SR
    sc[i:j] = np.minimum(sc[i:j], 1 - 0.45 * np.exp(-x / 0.08))
PL['pl'] *= sc; PL['pr'] *= sc

# one bell per bento tile, climbing the chord
for i, m in enumerate([71, 75, 76, 80, 83, 87]):
    put(bell(m, 1.0), TILES + i * STAG, 0.05, -0.4 + 0.16 * i, 'p')
# soft lift into the focus, the switch "pop", the logo bloom
def riser(d, peak): n = int(d * SR); return hp(noise(d), 0.4) * (np.arange(n) / n) ** 2.4 * peak
put(riser(BEAT * 2, 0.07), FOCUS - BEAT * 2, 1, 0, 'd')
put(fm(mtof(83), 0.6, 2.0, 1.2, 10, 30), FLIP, 0.20, 0, 'p'); put(fm(mtof(90), 0.5, 2.0, 0.8, 12, 30), FLIP + 0.04, 0.10, 0.2, 'p')
put(K, FLIP, 0.5, 0, 'd')
put(riser(BEAT, 0.08), LOGO - BEAT, 1, 0, 'd')
put(K, LOGO, 0.55, 0, 'd'); put(sub(40, 2.4), LOGO, 0.34, 0, 'p')
put(pad([52, 59, 63, 66, 68, 71], END - LOGO + 0.2, 0.07) * np.exp(-np.arange(int((END - LOGO + 0.2) * SR)) / SR * 0.6), LOGO, 0.32, 0, 'p')
for i, m in enumerate([76, 80, 83, 87, 90]):
    put(bell(m, 2.4), LOGO + 0.09 * i, 0.055, -0.4 + 0.2 * i, 'p')

# room: short synthetic reverb on the tonal bus
n = int(1.6 * SR); ir_t = np.arange(n) / SR
irl = lp(rng.standard_normal(n), 0.3) * np.exp(-ir_t / 0.38); irr = lp(rng.standard_normal(n), 0.3) * np.exp(-ir_t / 0.38)
irl /= np.sqrt((irl ** 2).sum()); irr /= np.sqrt((irr ** 2).sum())
wl = fftconvolve(PL['pl'], irl)[:N]; wr = fftconvolve(PL['pr'], irr)[:N]
ML[:] = PL['pl'] + 0.3 * wl + PL['dl']; MR[:] = PL['pr'] + 0.3 * wr + PL['dr']
pk = max(np.abs(ML).max(), np.abs(MR).max(), 1e-9); ML /= pk; MR /= pk
FADE_IN, FADE_OUT, KIT_STINGERS, MUSIC_GAIN = 0.02, 0.9, False, 0.55
