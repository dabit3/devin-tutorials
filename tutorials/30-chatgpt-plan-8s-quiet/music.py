# Tutorial 30 "Near silence": almost no music. A soft, slowly breathing Dadd9 air pad, one tactile switch click
# at FLIP, and a quiet high bloom as the line + lockup rise in. Runs inside _kit/tools/audio.py (refills ML/MR).
# Times match scenes.js. finish.sh then sets the final mix to about -20 LUFS.
from scipy.signal import fftconvolve
CARD_IN, FLIP, END_IN = 0.6, 2.75, 4.8
t = np.arange(N) / SR
def hp(x, a): return x - lp(x, a)
def ramp(t0, t1): return np.clip((t - t0) / (t1 - t0), 0, 1)
def smooth(x): return x * x * (3 - 2 * x)
BUS = {k: np.zeros(N) for k in ('pl', 'pr', 'cl', 'cr')}
def put(sig, t0, gain, pan=0.0, bus='c'):
    i = int(round(t0 * SR)); j = min(N, i + len(sig))
    if j <= i: return
    s = sig[:j - i] * gain
    BUS[bus + 'l'][i:j] += s * np.sqrt(0.5 * (1 - pan)); BUS[bus + 'r'][i:j] += s * np.sqrt(0.5 * (1 + pan))

# pad: detuned sine pairs with a touch of 2nd harmonic, each voice breathing on its own slow LFO
pad_l = np.zeros(N); pad_r = np.zeros(N)
for i, (m, g) in enumerate([(50, 0.9), (57, 0.75), (64, 0.5), (66, 0.32), (69, 0.38)]):
    f = mtof(m); lfo = 0.78 + 0.22 * np.sin(2 * np.pi * (0.09 + 0.037 * i) * t + 1.7 * i)
    for dt, side in ((-0.0011, 0), (0.0011, 1)):
        v = (np.sin(2 * np.pi * f * (1 + dt) * t + i) + 0.12 * np.sin(4 * np.pi * f * (1 + dt) * t)) * g * lfo
        (pad_l if side == 0 else pad_r)[:] += v
# high bloom for the lockup: slow-attack D5 / A5 / E6, no transient
bloom = np.zeros(N)
for m, g in ((74, 0.22), (81, 0.16), (88, 0.06)):
    bloom += np.sin(2 * np.pi * mtof(m) * t) * g
bloom *= smooth(ramp(END_IN - 0.15, END_IN + 0.9)) * np.exp(-np.maximum(0, t - END_IN - 0.9) / 2.2)
shape = (smooth(ramp(0.05, 1.9))                                   # fade up from silence
         * (1 - 0.32 * smooth(ramp(FLIP - 0.75, FLIP - 0.05)) + 0.32 * smooth(ramp(FLIP, FLIP + 0.9)))   # hold the breath before the click
         * (1 + 0.18 * smooth(ramp(END_IN - 0.2, END_IN + 1.2))))  # open slightly for the lockup
air = lp(hp(rng.standard_normal(N), 0.05), 0.06), lp(hp(rng.standard_normal(N), 0.05), 0.06)
BUS['pl'] += lp(pad_l, 0.09) * shape * 0.055 + bloom * 0.3 + air[0] * shape * 0.025
BUS['pr'] += lp(pad_r, 0.09) * shape * 0.055 + bloom * 0.3 + air[1] * shape * 0.025

# the click: bright tick + tiny tonal body + soft low thock, then the knob landing 16 ms later
def tick(g):
    n = int(0.06 * SR); x = np.arange(n) / SR
    snap = hp(lp(rng.standard_normal(n), 0.55), 0.25) * np.exp(-x / 0.0011)
    body = np.sin(2 * np.pi * 2100 * x) * np.exp(-x / 0.0028) * 0.45
    thock = np.sin(2 * np.pi * np.cumsum(115 + 90 * np.exp(-x / 0.006)) / SR) * np.exp(-x / 0.011) * 0.55
    return (snap + body + thock) * np.minimum(1, x / 0.0002) * g
put(tick(1.0), FLIP, 0.55, 0.06); put(tick(0.45), FLIP + 0.016, 0.55, 0.1)

# small room on the click, a long soft hall on the pad
def ir(d, dec, a):
    n = int(d * SR); x = np.arange(n) / SR
    h = lp(rng.standard_normal(n), a) * np.exp(-x / dec); return h / np.sqrt((h ** 2).sum())
cl, cr = BUS['cl'], BUS['cr']
cwl = fftconvolve(cl, ir(0.5, 0.07, 0.4))[:N]; cwr = fftconvolve(cr, ir(0.5, 0.07, 0.4))[:N]
pwl = fftconvolve(BUS['pl'], ir(3.0, 0.7, 0.2))[:N]; pwr = fftconvolve(BUS['pr'], ir(3.0, 0.7, 0.2))[:N]
ML[:] = BUS['pl'] * 0.7 + pwl * 0.3 + cl + 0.22 * cwl
MR[:] = BUS['pr'] * 0.7 + pwr * 0.3 + cr + 0.22 * cwr
pk = max(np.abs(ML).max(), np.abs(MR).max(), 1e-9); ML /= pk; MR /= pk
FADE_IN, FADE_OUT, KIT_STINGERS, MUSIC_GAIN = 0.01, 1.4, False, 0.5
