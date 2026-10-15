# "The split" music: 96 BPM, light and serious. Clean electric guitar (Karplus-Strong, light drive, dotted-8th delay)
# over a soft pad; a filtered whoosh as the columns part, a pulse that carries the real row, a switch tick on the flip,
# and one strummed chord on the lockup. Beat b lands at O + b*BEAT (same grid as scenes.js). Runs inside
# _kit/tools/audio.py (refills ML/MR). All synthesized.
from scipy.signal import fftconvolve
BPM = 96; BEAT = 60 / BPM; O = 0.25
at = lambda b: O + b * BEAT
BUS = {k: np.zeros(N) for k in ('gl', 'gr', 'tl', 'tr', 'dl', 'dr')}
def put(sig, t0, gain, pan=0.0, bus='t'):
    i = int(round(t0 * SR)); s = sig * gain
    if i < 0: s = s[-i:]; i = 0
    j = min(N, i + len(s))
    if j <= i: return
    BUS[bus + 'l'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 - pan)); BUS[bus + 'r'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 + pan))
def hp(x, a): return x - lp(x, a)
def tt(d): return np.arange(int(d * SR)) / SR
def ks(m, d, damp=0.996, bright=0.5):
    # Karplus-Strong string; the averaging filter adds half a sample, so the loop is L + 0.5 samples long
    f = mtof(m); L = max(2, int(round(SR / f - 0.5))); n = int(d * SR)
    y = np.zeros(n + L + 1); y[:L + 1] = lp(rng.uniform(-1, 1, L + 1), bright)
    for k in range(L + 1, n + L + 1, L):
        e = min(k + L, n + L + 1); idx = np.arange(k, e)
        y[k:e] = damp * 0.5 * (y[idx - L] + y[idx - L - 1])
    x = y[L + 1:]; x = x - lp(x, 0.01)
    return np.tanh(1.6 * x) / np.tanh(1.6) * np.minimum(1, (n - np.arange(n)) / (0.04 * SR))
def pad(ns, d, cut=0.03):
    t = tt(d); e = np.minimum(1, t / 0.6) * np.minimum(1, (d - t) / 0.8)
    return sum(lp(osc(mtof(m) * (1 + dt), d, 'saw'), cut) for m in ns for dt in (-0.0015, 0.0015)) * e / len(ns)
def sub(m, d):
    t = tt(d); return np.tanh(1.4 * np.sin(2 * np.pi * mtof(m) * t)) * np.minimum(1, t / 0.004) * np.exp(-t * 3) * np.minimum(1, (d - t) / 0.02)
def kick():
    t = tt(0.35); f = 44 + 110 * np.exp(-t * 36)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) + hp(noise(0.35), 0.5) * np.exp(-t * 400) * 0.2
def snap():
    x = hp(lp(noise(0.12), 0.6), 0.2); return x * env(len(x), 0.0003, 0.05, 4)
def hat(d): x = hp(noise(d), 0.62); return x * env(len(x), 0.0004, d * 0.5, 5)

D9, BM9, G9, A6 = [50, 57, 62, 66, 69, 76], [47, 54, 61, 62, 66, 73], [43, 50, 57, 59, 66, 69], [45, 52, 59, 61, 66, 71]
HAR = [(0, D9, 38), (4, BM9, 35), (7, G9, 31), (8, A6, 33), (9, D9, 38)]
def harm(b):
    r = HAR[0]
    for h in HAR:
        if b >= h[0]: r = h
    return r
END = 9; K, SN, HC = kick(), snap(), hat(0.03)

# pad bed: very soft, opens up a little after the split
for i, (b0, ch, bs) in enumerate(HAR):
    b1 = HAR[i + 1][0] if i + 1 < len(HAR) else 14
    put(pad([m + 12 for m in ch[1:]], (b1 - b0) * BEAT + 0.6, 0.022 if b0 < 4 else 0.032), at(b0) - 0.15, 0.11, 0, 't')

# guitar: an eighth-note arpeggio from the first frame to the lockup
PAT = [0, 2, 3, 4, 5, 4, 3, 2]
for k in range(int(END * 2)):
    b = k * 0.5; _, ch, _ = harm(b); m = ch[PAT[k % 8]] + 12
    if b in (7.0, 7.5): continue                                  # leave room for the switch chord
    put(ks(m, 1.4, 0.9965, 0.55), at(b), 0.16 * (1.15 if k % 2 == 0 else 0.9), -0.25 if k % 2 else 0.25, 'g')
# the switch turns on: a bright strummed chord
for i, m in enumerate([57, 62, 66, 69, 74, 78]): put(ks(m + 12, 2.0, 0.998, 0.7), at(7) + 0.012 * i, 0.12, -0.3 + 0.12 * i, 'g')
# the lockup: a slower, fuller strum that rings out
for i, m in enumerate([50, 57, 62, 66, 69, 76, 81]): put(ks(m + 12, 2.6, 0.9988, 0.6), at(END) + 0.018 * i, 0.12, -0.35 + 0.1 * i, 'g')

# columns part: one soft filtered whoosh
n = int(1.3 * SR); t = np.arange(n) / n
w = noise(1.3); bell_t = np.sin(np.pi * t); w = (lp(hp(w, 0.05), 0.08) * (1 - bell_t) + lp(hp(w, 0.25), 0.4) * bell_t * 0.6) * bell_t ** 1.6
put(w, at(4) - 0.15, 0.22, 0, 'd')
put(sub(26, 1.0), at(4), 0.22, 0, 't')

# pulse under the real row (from the split to the lockup)
kicks = []
for k in range(int((END - 4) * 1)):
    b = 4 + k; kicks.append(at(b)); put(K, at(b), 0.42 if k else 0.5, 0, 'd')
    _, ch, bs = harm(b); put(sub(bs, BEAT * 0.45), at(b + 0.5), 0.22, 0, 't')
    for h in (0.5,): put(HC, at(b + h), 0.035, 0.25, 'd')
    for q in (0.25, 0.75): put(hat(0.02), at(b + q), 0.012, -0.35, 'd')
put(SN, at(6), 0.16, 0.1, 'd')
put(osc(2600, 0.03) * env(int(0.03 * SR), 0.0002, 0.006) + hp(noise(0.03), 0.5) * env(int(0.03 * SR), 0.0002, 0.004) * 0.5, at(7), 0.16, 0, 'd')  # switch tick
put(hp(noise(1.6), 0.55) * env(int(1.6 * SR), 0.001, 0.7, 4), at(7), 0.03, 0, 'd')
n = int(BEAT * SR); put(hp(noise(BEAT), 0.4) * (np.arange(n) / n) ** 2.6, at(END - 1), 0.06, 0, 'd')
put(K, at(END), 0.5, 0, 'd'); put(sub(26, 2.0), at(END), 0.3, 0, 't')

sc = np.ones(N)
for t in kicks:
    i = int(t * SR); j = min(N, i + int(0.3 * SR)); x = np.arange(j - i) / SR
    sc[i:j] = np.minimum(sc[i:j], 1 - 0.35 * np.exp(-x / 0.08))
for k in ('tl', 'tr', 'gl', 'gr'): BUS[k] *= sc
# guitar: dotted-eighth delay (ping-pong) + shared room
dl = int(0.75 * BEAT * SR); gl, gr = BUS['gl'].copy(), BUS['gr'].copy()
for r in range(1, 4):
    g = 0.32 ** r; src_l, src_r = (BUS['gr'], BUS['gl']) if r % 2 else (BUS['gl'], BUS['gr'])
    gl[r * dl:] += lp(src_l[:-r * dl], 0.4) * g; gr[r * dl:] += lp(src_r[:-r * dl], 0.4) * g
n = int(1.8 * SR); ir_t = np.arange(n) / SR
irl = lp(rng.standard_normal(n), 0.3) * np.exp(-ir_t / 0.45); irr = lp(rng.standard_normal(n), 0.3) * np.exp(-ir_t / 0.45)
irl /= np.sqrt((irl ** 2).sum()); irr /= np.sqrt((irr ** 2).sum())
wl = fftconvolve(gl + BUS['tl'], irl)[:N]; wr = fftconvolve(gr + BUS['tr'], irr)[:N]
ML[:] = gl + BUS['tl'] + 0.28 * wl + BUS['dl']; MR[:] = gr + BUS['tr'] + 0.28 * wr + BUS['dr']
pk = max(np.abs(ML).max(), np.abs(MR).max(), 1e-9); ML /= pk; MR /= pk
ML[:] = np.tanh(2 * ML) / np.tanh(2); MR[:] = np.tanh(2 * MR) / np.tanh(2)
FADE_IN, FADE_OUT, KIT_STINGERS, MUSIC_GAIN = 0.01, 0.7, False, 0.55
