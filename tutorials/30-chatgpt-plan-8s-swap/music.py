# "The word swap" sound: a quiet, clean electric-guitar figure over an airy pad at 80 BPM, cut to scenes.js.
# Bar 1 (0-3 s) Em9, soft and waiting. Bar 2 lands with the switch at 3.0 s: a tactile tick, a low thump and a lift
# to Gmaj9 while the words roll. Bar 3 lands with the lockup at 6.0 s on a low Dadd9 strum that rings out.
# Runs inside _kit/tools/audio.py (refills ML/MR). All synthesized; no keys or bells.
from scipy.signal import fftconvolve, lfilter as _lf
BEAT = 0.75; E8 = BEAT / 2; SW, LOGO = 3.0, 6.0
BUS = {k: np.zeros(N) for k in ('gl', 'gr', 'dl', 'dr')}
def put(sig, t0, gain, pan=0.0, bus='g'):
    i = int(round(t0 * SR)); s = sig * gain
    if i < 0: s = s[-i:]; i = 0
    j = min(N, i + len(s))
    if j <= i: return
    BUS[bus + 'l'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 - pan)); BUS[bus + 'r'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 + pan))
def hp(x, a): return x - lp(x, a)
def tt(d): return np.arange(int(d * SR)) / SR
def ks(m, d, bright=0.5, damp=0.996):                         # Karplus-Strong string, period L+0.5 for true pitch
    f = mtof(m); L = max(2, int(round(SR / f - 0.5))); n = int(d * SR)
    x = np.zeros(n); burst = lp(rng.standard_normal(L), bright); x[:L] = burst - burst.mean()
    a = np.zeros(L + 2); a[0] = 1; a[L] = -damp / 2; a[L + 1] = -damp / 2
    y = _lf([1.0], a, x)
    y = hp(y, 0.02); y = np.tanh(1.4 * y / max(1e-9, np.abs(y).max())) / np.tanh(1.4)     # light drive
    return y * np.minimum(1, (n - np.arange(n)) / (0.04 * SR))
def pad(ns, d, att=0.6, rel=0.8, cut=0.03):
    t = tt(d); e = np.minimum(1, t / att) * np.clip((d - t) / rel, 0, 1)
    return sum(lp(osc(mtof(m) * (1 + dt), d, 'saw'), cut) for m in ns for dt in (-0.0018, 0.0018)) * e / len(ns)
def sub(m, d, dec=1.6):
    t = tt(d); return np.sin(2 * np.pi * mtof(m) * t) * np.minimum(1, t / 0.006) * np.exp(-t * dec) * np.clip((d - t) / 0.05, 0, 1)

EM9, G9, D9 = [52, 55, 59, 62, 66], [55, 59, 62, 66, 69], [50, 57, 62, 64, 66, 69]
# pads: Em9 breathes in, lifts to Gmaj9 on the switch, settles on Dadd9 under the logo
put(pad([m + 12 for m in EM9], SW + 0.5, 0.9, 0.5), 0.0, 0.16)
put(pad([m + 12 for m in G9], LOGO - SW + 0.4, 0.25, 0.5, 0.04), SW, 0.17)
put(pad([m + 12 for m in D9[1:]], total - LOGO + 0.5, 0.35, 1.4, 0.035), LOGO, 0.15)

# guitar: a sparse eighth-note figure, a little brighter after the switch
fig1 = [64, 71, 74, 71, 78, 74]                                # E B D B F# D
fig2 = [67, 74, 78, 74, 81, 78, 83, 78]                        # G D F# D A F# B F#
for k, m in enumerate(fig1): put(ks(m, 1.6, 0.35), 0.75 + k * E8, 0.20 - 0.01 * (k % 2), -0.25 if k % 2 else 0.2)
for k, m in enumerate(fig2[:7]): put(ks(m, 1.4, 0.45), SW + k * E8, 0.21 - 0.012 * (k % 2), -0.25 if k % 2 else 0.2)
# the lockup: one slow low strum of Dadd9, plus the octave
for k, m in enumerate([38, 45, 50, 57, 62, 64, 66, 69]): put(ks(m, 2.6, 0.4, 0.9975), LOGO + 0.018 * k, 0.17, -0.3 + 0.08 * k)
put(sub(26, 2.2, 1.3), LOGO, 0.38, 0, 'd')

# low pulse from the switch: soft sub on the beats
for k in range(4): put(sub(31, 0.6, 5.0), SW + k * BEAT, 0.30 if k == 0 else 0.16, 0, 'd')
# the switch: tactile tick + a gentle air swell into it
tk = hp(noise(0.025), 0.35) * env(int(0.025 * SR), 0.0002, 0.006, 4)
put(tk, SW, 0.22, 0.25, 'd'); put(osc(2600, 0.02) * env(int(0.02 * SR), 0.0002, 0.005, 4), SW, 0.06, 0.25, 'd')
put(osc(70, 0.3) * env(int(0.3 * SR), 0.002, 0.12, 4), SW, 0.30, 0, 'd')
for t1, d, g in ((SW, 0.9, 0.05), (LOGO, 1.1, 0.045)):
    n = int(d * SR); r = (np.arange(n) / n) ** 2.6
    put(lp(hp(noise(d), 0.3), 0.5) * r, t1 - d, g, 0, 'd')
# a whisper of shaker under bar 2 for motion
for k in range(8):
    x = hp(noise(0.05), 0.6) * env(int(0.05 * SR), 0.004, 0.03, 4); put(x, SW + E8 / 2 + k * E8, 0.018, 0.35, 'd')

# dotted-eighth delay on the guitar, then a short synthetic room on the tonal bus
dly = int(0.75 * BEAT * SR)
for side in ('gl', 'gr'):
    x = BUS[side]; y = x.copy(); fb = 0.32
    for rep in range(1, 5): y[dly * rep:] += lp(x[:N - dly * rep], 0.25) * fb ** rep * (0.9 if side == 'gl' else 1.0)
    BUS[side] = y
n = int(1.8 * SR); ir_t = np.arange(n) / SR
irl = lp(rng.standard_normal(n), 0.3) * np.exp(-ir_t / 0.45); irr = lp(rng.standard_normal(n), 0.3) * np.exp(-ir_t / 0.45)
irl /= np.sqrt((irl ** 2).sum()); irr /= np.sqrt((irr ** 2).sum())
wl = fftconvolve(BUS['gl'], irl)[:N]; wr = fftconvolve(BUS['gr'], irr)[:N]
ML[:] = BUS['gl'] + 0.32 * wl + BUS['dl']; MR[:] = BUS['gr'] + 0.32 * wr + BUS['dr']
pk = max(np.abs(ML).max(), np.abs(MR).max(), 1e-9); ML /= pk; MR /= pk
ML[:] = np.tanh(2 * ML) / np.tanh(2); MR[:] = np.tanh(2 * MR) / np.tanh(2)   # soft clip keeps AAC true peak in check
FADE_IN, FADE_OUT, KIT_STINGERS, MUSIC_GAIN = 0.05, 1.0, False, 0.55
