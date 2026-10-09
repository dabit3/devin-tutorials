# "Three beats" music: 150 BPM, three clean hits on the bar downbeats (Link. / Switch. / Done.) and a fourth,
# deeper one under the lockup. Runs inside _kit/tools/audio.py (refills ML/MR). All synthesized:
# Karplus-Strong clean electric guitar strums through a dotted-8th delay, a soft pad, sub thumps, quiet 8th hats,
# a small tick when the switch turns on, and a room reverb. Times match scenes.js.
from scipy.signal import fftconvolve
B = 0.4; H1 = 0.4; H2 = H1 + 4 * B; H3 = H2 + 4 * B; LOCK = H3 + 4 * B; FLIP = H2 + 2 * B
CH = {H1: [50, 57, 64, 66, 69], H2: [47, 54, 62, 64, 69], H3: [43, 50, 57, 59, 66], LOCK: [38, 45, 50, 57, 64, 66, 69]}
ROOT = {H1: 38, H2: 35, H3: 31, LOCK: 26}
BUS = {k: np.zeros(N) for k in ('tl', 'tr', 'dl', 'dr', 'gl', 'gr')}   # tonal, dry/drums, guitar (into delay)
def put(sig, t0, gain, pan=0.0, bus='t'):
    i = int(round(t0 * SR)); s = sig * gain
    if i < 0: s = s[-i:]; i = 0
    j = min(N, i + len(s))
    if j <= i: return
    BUS[bus + 'l'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 - pan)); BUS[bus + 'r'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 + pan))
def hp(x, a): return x - lp(x, a)
def ks(m, dur, g=0.997, bright=0.55):
    f = mtof(m); n = int(dur * SR); L = max(2, int(round(SR / f - 0.5)))   # 2-tap average adds half a sample
    x = np.zeros(n); x[:L] = lp(rng.standard_normal(L), bright)
    a = np.zeros(L + 2); a[0] = 1; a[L] = -g / 2; a[L + 1] = -g / 2
    y = lfilter([1], a, x); y = np.tanh(1.6 * y / (np.abs(y).max() + 1e-9)) / np.tanh(1.6)
    return y * np.minimum(1, (n - np.arange(n)) / (0.05 * SR))
def strum(notes, t0, gain, dur=2.2, gap=0.011, g=0.997):
    for i, m in enumerate(notes):
        put(ks(m, dur, g), t0 + i * gap, gain * (0.85 if i == 0 else 1.0), -0.35 + 0.7 * i / max(1, len(notes) - 1), 'g')
def thump(f0=52, d=0.5, k=26):
    n = int(d * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(f0 + 90 * np.exp(-t * k)) / SR) * np.exp(-t * 7)
def pad(notes, d, cut=0.05):
    n = int(d * SR); e = np.minimum(1, np.arange(n) / (0.12 * SR)) * np.minimum(1, (n - np.arange(n)) / (0.35 * SR))
    return sum(lp(osc(mtof(m) * (1 + dt), d, 'saw'), cut) for m in notes for dt in (-0.0015, 0.0015)) * e / len(notes)
def air(d, peak):
    n = int(d * SR); return hp(noise(d), 0.4) * (np.arange(n) / n) ** 2.5 * peak
def hat(d=0.035): x = hp(noise(d), 0.65); return x * env(len(x), 0.0004, d * 0.5, 5)

hits = [H1, H2, H3, LOCK]
for idx, h in enumerate(hits):
    last = h == LOCK
    nxt = hits[idx + 1] if not last else total
    put(air(0.32 if not last else 0.6, 0.05 if not last else 0.07), h - (0.32 if not last else 0.6), 1, 0, 'd')
    put(thump(46 if last else 52, 0.9 if last else 0.5), h, 0.6 if last else 0.5, 0, "d")
    strum(CH[h], h, 0.16 if last else 0.15, dur=3.2 if last else 2.0, g=0.998 if last else 0.997)
    put(pad([m + 12 for m in CH[h][1:]], (nxt - h) + (0.8 if not last else 0), 0.06 if last else 0.045), h, 0.08, 0, 't')
    rn = int((nxt - h + 0.2) * SR); rt = np.arange(rn) / SR
    put(np.sin(2 * np.pi * mtof(ROOT[h] + 12) * rt) * np.minimum(1, rt / 0.02) * np.exp(-rt * (0.6 if last else 1.6)), h, 0.15, 0, 't')
    if last: put(hp(noise(2.4), 0.6) * env(int(2.4 * SR), 0.001, 1.1, 4), h, 0.05, 0, 'd')
# quiet 8th-note pulse between the first and last hits, off for the beat before the lockup
t = H1 + B / 2
while t < LOCK - B - 0.01:
    on = abs((t - H1) / B - round((t - H1) / B)) < 1e-6
    put(hat(0.03 if on else 0.05), t, 0.03 if on else 0.045, 0.25 if on else -0.2, 'd'); t += B / 2
# muted guitar picks on beats 2-4 for motion
for h in hits[:3]:
    for k in (1, 2, 3):
        if h + k * B < LOCK - B - 0.01: put(ks(CH[h][2] + 12, 0.25, 0.97, 0.35), h + k * B + 0.2, 0.05, 0.3 if k % 2 else -0.3, 'g')
# the switch turning on: a small tick and a high harmonic
put(hp(noise(0.006), 0.3) * env(int(0.006 * SR), 0.0002, 0.003), FLIP, 0.30, 0.1, 'd')
put(ks(86, 1.2, 0.996, 0.7), FLIP + 0.005, 0.07, 0.15, 'g')
# lockup sparkle: a soft guitar arpeggio answering the hit
for i, m in enumerate([78, 81, 85, 88]): put(ks(m, 1.8, 0.997, 0.6), LOCK + 0.6 + i * B / 2, 0.05, -0.3 + 0.2 * i, 'g')

# dotted-8th delay on the guitar, then a short room on guitar + tonal buses
D = int(0.75 * B * SR)
for c in ('gl', 'gr'):
    x = BUS[c]; y = x.copy()
    for k in range(1, 5): y[k * D:] += lp(x[:-k * D], 0.35) * (0.30 ** k)
    BUS[c] = y
n = int(1.6 * SR); irt = np.arange(n) / SR
irl = lp(rng.standard_normal(n), 0.28) * np.exp(-irt / 0.38); irr = lp(rng.standard_normal(n), 0.28) * np.exp(-irt / 0.38)
irl /= np.sqrt((irl ** 2).sum()); irr /= np.sqrt((irr ** 2).sum())
wl = BUS['tl'] + BUS['gl']; wr = BUS['tr'] + BUS['gr']
ML[:] = wl + 0.30 * fftconvolve(wl, irl)[:N] + BUS['dl']; MR[:] = wr + 0.30 * fftconvolve(wr, irr)[:N] + BUS['dr']
pk = max(np.abs(ML).max(), np.abs(MR).max(), 1e-9); ML /= pk; MR /= pk
ML[:] = np.tanh(2 * ML) / np.tanh(2); MR[:] = np.tanh(2 * MR) / np.tanh(2)
FADE_IN, FADE_OUT, KIT_STINGERS, MUSIC_GAIN = 0.01, 0.7, False, 0.55
