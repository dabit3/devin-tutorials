# "The dot" sound design: near-silent and geometric, cut to scenes.js. Airy Dmaj9 pad, a soft sine blip for the dot,
# a gentle glide as it stretches, a crisp tick + clean guitar note when the knob lands, a quiet guitar pulse under the
# pull-back and card, then one clean guitar chord with a dotted-8th delay on the lockup. All synthesized.
# Runs inside _kit/tools/audio.py (refills ML/MR).
from scipy.signal import fftconvolve
DOT, STRETCH, STRETCH_END, ON, PULL, PULL_END, OUT, END = 0.30, 0.95, 1.85, 1.80, 2.45, 3.95, 5.35, 5.70
BEAT = 0.6
BUS = {k: np.zeros(N) for k in ('gl', 'gr', 'xl', 'xr')}        # g: tonal (reverb + delay), x: dry design
def put(sig, t0, gain, pan=0.0, bus='g'):
    i = int(round(t0 * SR)); s = sig * gain
    if i < 0: s = s[-i:]; i = 0
    j = min(N, i + len(s))
    if j <= i: return
    BUS[bus + 'l'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 - pan)); BUS[bus + 'r'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 + pan))
def hp(x, a): return x - lp(x, a)
def tt(d): return np.arange(int(d * SR)) / SR

def ks(m, d, damp=0.996, bright=0.6):
    """Karplus-Strong clean guitar string (period L+0.5 corrects the averaging filter's half-sample delay)."""
    f = mtof(m); L = max(2, int(round(SR / f - 0.5))); n = int(d * SR)
    y = np.zeros(n + L + 1); y[:L + 1] = lp(rng.uniform(-1, 1, L + 1), bright)
    i = L + 1
    while i < len(y):
        j = min(len(y), i + L)
        y[i:j] = damp * 0.5 * (y[i - L:j - L] + y[i - L - 1:j - L - 1]); i = j
    y = y[L + 1:L + 1 + n]
    y = np.tanh(1.4 * y) / np.tanh(1.4)                                # light drive
    return y * np.minimum(1, tt(d) / 0.002) * np.minimum(1, (d - tt(d)) / 0.05)
def pad(ns, d, c0, c1, a=0.6, r=0.8):
    t = tt(d); e = np.minimum(1, t / a) * np.minimum(1, (d - t) / r)
    x = sum(osc(mtof(m) * (1 + dt), d, 'saw') for m in ns for dt in (-0.002, 0.0, 0.002)) / (3 * len(ns))
    cut = np.exp(np.linspace(np.log(c0), np.log(c1), len(x)))           # slowly opening one-pole low-pass
    y = np.zeros_like(x); z = 0.0
    for k in range(0, len(x), 256):
        a_ = cut[k]; seg = x[k:k + 256]; out = lfilter([a_], [1, a_ - 1], seg, zi=[z * (1 - a_)])
        y[k:k + 256] = out[0]; z = out[0][-1]
    return y * e

# pad: Dmaj9, very low and filtered, opening through the pull-back; lifts to Gmaj9/D on the lockup
put(pad([50, 57, 61, 64, 66], END + 0.6, 0.006, 0.03, a=1.2, r=0.6), 0.0, 0.55)
put(pad([50, 55, 59, 62, 66, 69], 8.6 - END, 0.03, 0.05, a=0.35, r=1.6), END - 0.1, 0.6)

# the dot: soft sine blip that settles from A5 into D5, plus a hair of click
t = tt(0.9); f = 587.33 * (1 + 0.5 * np.exp(-t * 40))
put(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, t / 0.004) * np.exp(-t * 6), DOT, 0.30)
put(hp(noise(0.01), 0.7) * env(int(0.01 * SR), 0.0002, 0.003), DOT, 0.05, 0, 'x')

# the stretch: a gentle glide D4 -> A4 with a soft air swish
d = STRETCH_END - STRETCH + 0.25; t = tt(d); p = np.clip(t / (STRETCH_END - STRETCH), 0, 1); p = p * p * (3 - 2 * p)
f = 293.66 * 2 ** (7 / 12 * p); g = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.5
put((np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.3 * np.sin(4 * np.pi * np.cumsum(f) / SR)) * g, STRETCH, 0.08, -0.1)
sw = lp(hp(noise(d), 0.25), 0.2) * g
put(sw, STRETCH, 0.05, 0.25, 'x')

# knob on: crisp tick, soft low thump, one clean guitar D5
put(hp(noise(0.012), 0.6) * env(int(0.012 * SR), 0.0002, 0.004) + osc(3200, 0.012) * env(int(0.012 * SR), 0.0002, 0.003) * 0.5, ON, 0.22, 0.05, 'x')
t = tt(0.35); put(np.sin(2 * np.pi * np.cumsum(70 + 40 * np.exp(-t * 30)) / SR) * np.exp(-t * 14), ON, 0.35, 0, 'x')
put(ks(74, 2.2), ON + 0.01, 0.30, 0.1)

# quiet guitar pulse under the pull-back and the card, then one beat of silence before the lockup
for i, m in enumerate([69, 76, 74, 78, 69, 76]):
    tb = ON + (i + 1) * BEAT
    if tb > OUT - 0.1: break
    put(ks(m, 1.6, 0.994, 0.45), tb, 0.13, -0.35 if i % 2 else 0.35)
# air swell under the camera pull-back
d = PULL_END - PULL + 0.4; t = tt(d); e = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 2
put(lp(hp(noise(d), 0.15), 0.08) * e, PULL, 0.10, 0, 'x')
# tiny lift into the lockup
d = END - OUT; t = tt(d); put(hp(noise(d), 0.35) * (t / d) ** 2.5, OUT, 0.05, 0, 'x')

# lockup: one clean strummed Dadd9 chord, sub bloom
for i, m in enumerate([50, 57, 62, 66, 69, 76]):
    put(ks(m, 8.0 - END + 0.5, 0.9975, 0.55), END + 0.022 * i, 0.20, -0.3 + 0.12 * i)
t = tt(2.3); put(np.sin(2 * np.pi * mtof(38) * t) * np.minimum(1, t / 0.03) * np.exp(-t * 1.4), END, 0.30, 0, 'x')

# dotted-8th delay + short room on the tonal bus
dl = int(0.75 * BEAT * SR)
for side, other in (('gl', 'gr'), ('gr', 'gl')):
    x = BUS[side].copy(); y = np.zeros(N)
    for k in range(1, 5):
        tap = np.zeros(N); tap[dl * k:] = x[:N - dl * k]; y += lp(tap, 0.25) * 0.32 ** k
    BUS[other + '_d'] = y
BUS['gr'] += BUS.pop('gr_d') * 0.9; BUS['gl'] += BUS.pop('gl_d') * 0.9   # ping-pong
n = int(1.8 * SR); ir_t = np.arange(n) / SR
irl = lp(rng.standard_normal(n), 0.3) * np.exp(-ir_t / 0.45); irr = lp(rng.standard_normal(n), 0.3) * np.exp(-ir_t / 0.45)
irl /= np.sqrt((irl ** 2).sum()); irr /= np.sqrt((irr ** 2).sum())
wl = fftconvolve(BUS['gl'], irl)[:N]; wr = fftconvolve(BUS['gr'], irr)[:N]
ML[:] = BUS['gl'] + 0.35 * wl + BUS['xl']; MR[:] = BUS['gr'] + 0.35 * wr + BUS['xr']
pk = max(np.abs(ML).max(), np.abs(MR).max(), 1e-9); ML /= pk; MR /= pk
ML[:] = np.tanh(2 * ML) / np.tanh(2); MR[:] = np.tanh(2 * MR) / np.tanh(2)
FADE_IN, FADE_OUT, KIT_STINGERS, MUSIC_GAIN = 0.01, 0.6, False, 0.55
