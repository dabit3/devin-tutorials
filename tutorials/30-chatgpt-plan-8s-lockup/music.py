# Tutorial 30 "The lockup" (8 s): a clean electric-guitar figure over a warm pad, 120 BPM, cut to scenes.js.
# Beat b lands at O + b * B. Line at b0, lockup at b1, card at b5.5 (soft pulse enters), switch on b8
# (tactile click + bright guitar dyad), close b11 (resolving strum, long tail). I - vi - IV - I in D. All synthesized.
from scipy.signal import fftconvolve
O, B = 0.3, 0.5; at = lambda b: O + b * B
LINE, LOGO, ASIDE, CARD, FLIP, CLOSE = at(0), at(1), at(4.5), at(5.5), at(8), at(11)
PL = {k: np.zeros(N) for k in ('tl', 'tr', 'dl', 'dr')}
def put(sig, t0, gain, pan=0.0, bus='t'):
    i = int(round(t0 * SR)); s = sig * gain
    if i < 0: s = s[-i:]; i = 0
    j = min(N, i + len(s))
    if j <= i: return
    PL[bus + 'l'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 - pan)); PL[bus + 'r'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 + pan))
def hp(x, a): return x - lp(x, a)
def ks(m, d, bright=0.5, decay=0.996):
    # Karplus-Strong string: the two-tap average adds half a sample of delay, so the loop is L + 0.5
    f = mtof(m); L = max(2, int(round(SR / f - 0.5))); n = int(d * SR)
    x = np.zeros(n); x[:L] = lp(rng.standard_normal(L), bright)
    a = np.zeros(L + 2); a[0] = 1; a[L] = a[L + 1] = -0.5 * decay
    y = lfilter([1], a, x)
    y = np.tanh(1.6 * y / (np.abs(y).max() + 1e-9)) * env(n, 0.001, d, 1.2)
    return lp(y, 0.5) + 0.25 * hp(y, 0.4)                 # pickup tone: warm body, a little edge
def strum(notes, d, gap=0.012, bright=0.5):
    out = np.zeros(int((d + gap * len(notes)) * SR))
    for i, m in enumerate(notes):
        s = ks(m, d, bright); k = int(i * gap * SR); out[k:k + len(s)] += s
    return out / np.sqrt(len(notes))
def pad(notes, d, cut=0.03, att=0.6, rel=0.8):
    n = int(d * SR); t = np.arange(n)
    e = np.minimum(1, t / (att * SR)) * np.minimum(1, (n - t) / (rel * SR))
    return sum(lp(osc(mtof(m) * (1 + dt), d, 'saw'), cut) for m in notes for dt in (-0.0015, 0.0015)) * e / len(notes)
def sub(m, d): n = int(d * SR); return np.sin(2 * np.pi * mtof(m) * np.arange(n) / SR) * env(n, 0.006, d * 0.7, 3)
def kick():
    n = int(0.3 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(50 + 70 * np.exp(-t * 30)) / SR) * np.exp(-t * 12)
def shaker(d=0.06): x = hp(noise(d), 0.7); return x * env(len(x), 0.004, d * 0.4, 5)

# D maj9 | Bm11 | G maj9(#11) | D maj9 : one chord per section
SECT = [(0.0, ASIDE, [50, 57, 64, 66, 69], 38), (ASIDE, FLIP, [47, 54, 61, 62, 66], 35),
        (FLIP, CLOSE, [43, 50, 57, 59, 61], 31), (CLOSE, total, [50, 57, 64, 66, 69], 38)]
for t0, t1, ch, root in SECT:
    put(pad([m + 12 for m in ch[1:]], t1 - t0 + 0.9, 0.03 if t0 < CARD else 0.045, 0.7 if t0 == 0 else 0.35), max(0, t0 - 0.15), 0.11, 0, 't')
    put(sub(root, min(2.6, t1 - t0 + 0.6)), t0, 0.15 if t0 > 0 else 0.0, 0, 't')
# guitar: a quiet eighth-note figure that walks the chord, panned left/right
ARP = [0, 2, 3, 1, 4, 2, 3, 1]
for k in range(int((CLOSE - LINE) / (B / 2))):
    t = LINE + k * B / 2
    if t >= CLOSE - 0.01: break
    ch = next(c for a, b, c, _ in SECT if a <= t < b)
    m = ch[ARP[k % 8]] + 12
    put(ks(m, 1.2, 0.45), t, (0.11 if k % 2 == 0 else 0.075) * (0.75 if t < ASIDE else 1.0), -0.35 if k % 2 else 0.3, 't')
# line: a single clean high note; lockup: low strum + a soft thump
put(ks(81, 2.2, 0.6), LINE, 0.16, 0.1, 't')
put(strum([50, 57, 62, 66, 69], 2.6, 0.016), LOGO, 0.24, 0, 't'); put(sub(38, 1.2), LOGO, 0.32, 0, 'd')
# aside: an airy rise as the lockup steps up
n = int(0.9 * SR); r = (np.arange(n) / n) ** 2
put(lp(hp(noise(0.9), 0.3), 0.5) * r * np.minimum(1, (n - np.arange(n)) / (0.08 * SR)), ASIDE - 0.25, 0.05, 0, 'd')
# soft pulse while the card is up: round kick on beats, shaker on off-eighths
for b in np.arange(5.5, 11, 1.0):
    put(kick(), at(b), 0.30, 0, 'd')
    put(shaker(), at(b) + B / 2, 0.035, 0.25, 'd')
    put(shaker(0.03), at(b) + B * 0.75, 0.015, -0.25, 'd')
# switch on: tactile click (tick + body), bright guitar dyad, short shimmer
c = hp(noise(0.02), 0.5) * env(int(0.02 * SR), 0.0002, 0.006)
put(c, FLIP, 0.30, 0, 'd'); put(osc(1800, 0.03) * env(int(0.03 * SR), 0.0002, 0.008), FLIP, 0.10, 0, 'd')
put(sub(55, 0.25) * 0.8, FLIP, 0.25, 0, 'd')
put(strum([78, 85], 2.0, 0.03, 0.7), FLIP + 0.01, 0.20, 0.15, 't')
# close: resolving strum, kick and low D, long tail under the end lockup
put(kick(), CLOSE, 0.35, 0, 'd'); put(sub(38, 2.4), CLOSE, 0.34, 0, 't')
put(strum([50, 57, 62, 66, 69, 76], 3.4, 0.02, 0.55), CLOSE, 0.30, 0, 't')
put(ks(81, 2.5, 0.6), at(12), 0.12, 0.2, 't')                     # one note as the line lands
# dotted-eighth delay + short room on the tonal bus
dly = int(0.75 * B * SR)
wetL, wetR = np.zeros(N), np.zeros(N); srcL, srcR = PL['tl'].copy(), PL['tr'].copy()
for k in range(1, 4):
    g = 0.22 * 0.5 ** (k - 1); s = dly * k
    (wetL if k % 2 else wetR)[s:] += lp((srcR if k % 2 else srcL)[:N - s], 0.35) * g
PL['tl'] += wetL; PL['tr'] += wetR
n = int(1.8 * SR); it = np.arange(n) / SR
irl = lp(rng.standard_normal(n), 0.25) * np.exp(-it / 0.45); irr = lp(rng.standard_normal(n), 0.25) * np.exp(-it / 0.45)
irl /= np.sqrt((irl ** 2).sum()); irr /= np.sqrt((irr ** 2).sum())
wl = fftconvolve(PL['tl'], irl)[:N]; wr = fftconvolve(PL['tr'], irr)[:N]
ML[:] = PL['tl'] + 0.3 * wl + PL['dl']; MR[:] = PL['tr'] + 0.3 * wr + PL['dr']
pk = max(np.abs(ML).max(), np.abs(MR).max(), 1e-9); ML /= pk; MR /= pk
ML[:] = np.tanh(2 * ML) / np.tanh(2); MR[:] = np.tanh(2 * MR) / np.tanh(2)   # soft clip: keeps the AAC true peak in check
FADE_IN, FADE_OUT, KIT_STINGERS, MUSIC_GAIN = 0.02, 0.9, False, 0.55
