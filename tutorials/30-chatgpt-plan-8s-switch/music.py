# "The switch" sound design. Runs inside _kit/tools/audio.py (refills ML/MR). Times match scenes.js.
# An airy D major pad, a two-part physical click when the switch flips (press + seat) with a low bloom and one clean
# guitar chord, a quiet ring as the line lands, and a final open chord under the Devin lockup. All synthesized.
from scipy.signal import fftconvolve
FLIP, FLIP_DUR, LINE, LOGO = 2.0, 0.26, 2.7, 5.2
DOT8 = 0.75 * 60 / 96                                          # dotted-eighth delay at 96 BPM
BUS = {k: np.zeros(N) for k in ('tl', 'tr', 'dl', 'dr')}       # t = tonal (reverb), d = dry
def put(sig, t0, gain, pan=0.0, bus='t'):
    i = int(round(t0 * SR)); s = sig * gain
    if i < 0: s = s[-i:]; i = 0
    j = min(N, i + len(s))
    if j <= i: return
    BUS[bus + 'l'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 - pan)); BUS[bus + 'r'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 + pan))
def hp(x, a): return x - lp(x, a)
def saw(f, d): return osc(f, d, 'saw')
def ramp(n, a, r):                                              # linear attack / release envelope
    i = np.arange(n); return np.minimum(1, i / max(1, a * SR)) * np.minimum(1, (n - i) / max(1, r * SR))
def pad(notes, d, cut, a=1.2, r=1.5):
    n = int(d * SR)
    return sum(lp(lp(saw(mtof(m) * (1 + dt), d), cut), cut) for m in notes for dt in (-0.0015, 0.0015)) * ramp(n, a, r) / len(notes)
def ks(f, d, bright=0.5, damp=0.996):                         # Karplus-Strong clean string (period L + 0.5 corrected)
    n = int(d * SR); L = max(2, int(round(SR / f - 0.5)))
    exc = np.zeros(n); burst = lp(rng.standard_normal(L), bright); exc[:L] = burst - burst.mean()
    a = np.zeros(L + 2); a[0] = 1; a[L] = -damp / 2; a[L + 1] = -damp / 2
    from scipy.signal import lfilter as _lf
    y = _lf([1], a, exc); return np.tanh(1.4 * y / max(1e-9, np.abs(y).max())) * env(n, 0.001, d, 2.2)
def strum(notes, t0, gain, gap=0.022, d=3.0, pan=0.0):
    for i, m in enumerate(notes):
        s = ks(mtof(m), d, 0.45)
        for k in range(4):                                     # dotted-eighth echoes, alternating sides
            put(lp(s, 0.5 if k else 0.9), t0 + i * gap + k * DOT8, gain * (0.42 ** k), pan + (0.35 if k % 2 else -0.35) * (k > 0))
def sub(m, d, a=0.02):
    n = int(d * SR); return np.sin(2 * np.pi * mtof(m) * np.arange(n) / SR) * ramp(n, a, d * 0.7)

total_s = N / SR
# bed: D major add9, opens up when the switch flips, resolves to an open D under the logo
put(pad([62, 66, 69, 76], FLIP + 0.6, 0.012, 1.4, 0.6), 0.0, 0.55)
put(pad([62, 66, 69, 73, 76], LOGO - FLIP + 0.5, 0.03, 0.08, 0.6), FLIP - 0.02, 0.55)
put(pad([50, 57, 62, 66, 69, 76], total_s - LOGO + 0.2, 0.022, 0.15, 1.8), LOGO - 0.1, 0.6)
put(sub(38, FLIP + 0.5, 1.0), 0.0, 0.10, 0, 'd')
# the switch: press, then the knob seating; dry and close
def tick(d, cut_lo, cut_hi):
    x = noise(d); x = lp(x, cut_hi) - lp(x, cut_lo); return x * env(len(x), 0.0002, d * 0.35, 5)
put(tick(0.025, 0.25, 0.9), FLIP, 0.55, 0.05, 'd'); put(osc(3100, 0.012) * env(int(0.012 * SR), 0.0001, 0.004), FLIP, 0.12, 0.05, 'd')
put(tick(0.035, 0.08, 0.6), FLIP + FLIP_DUR * 0.85, 0.45, 0.1, 'd'); put(osc(2400, 0.015) * env(int(0.015 * SR), 0.0001, 0.005), FLIP + FLIP_DUR * 0.85, 0.09, 0.1, 'd')
put(np.sin(2 * np.pi * 150 * np.arange(int(0.08 * SR)) / SR) * env(int(0.08 * SR), 0.0005, 0.03, 4), FLIP + FLIP_DUR * 0.85, 0.22, 0, 'd')
# the bloom: low swell + one clean guitar chord as the knob lands
put(sub(38, 2.2, 0.03) * np.exp(-np.arange(int(2.2 * SR)) / SR * 1.4), FLIP + 0.2, 0.30, 0, 'd')
strum([62, 69, 74, 76, 78], FLIP + 0.21, 0.13, 0.018, 2.6)
# the line lands: a single high harmonic, soft
strum([81], LINE + 0.05, 0.06, 0, 2.0, 0.25)
# the logo: open D chord, slower strum, longer tail
strum([50, 57, 62, 66, 69, 74], LOGO + 0.02, 0.15, 0.03, 3.0)
put(sub(38, 2.8, 0.05) * np.exp(-np.arange(int(2.8 * SR)) / SR * 0.9), LOGO + 0.02, 0.32, 0, 'd')

n = int(1.8 * SR); ir_t = np.arange(n) / SR
irl = lp(rng.standard_normal(n), 0.3) * np.exp(-ir_t / 0.45); irr = lp(rng.standard_normal(n), 0.3) * np.exp(-ir_t / 0.45)
irl /= np.sqrt((irl ** 2).sum()); irr /= np.sqrt((irr ** 2).sum())
wl = fftconvolve(BUS['tl'], irl)[:N]; wr = fftconvolve(BUS['tr'], irr)[:N]
ML[:] = BUS['tl'] + 0.35 * wl + BUS['dl'] + 0.08 * fftconvolve(BUS['dl'], irl)[:N]
MR[:] = BUS['tr'] + 0.35 * wr + BUS['dr'] + 0.08 * fftconvolve(BUS['dr'], irr)[:N]
pk = max(np.abs(ML).max(), np.abs(MR).max(), 1e-9); ML /= pk; MR /= pk
ML[:] = np.tanh(1.6 * ML) / np.tanh(1.6); MR[:] = np.tanh(1.6 * MR) / np.tanh(1.6)
FADE_IN, FADE_OUT, KIT_STINGERS, MUSIC_GAIN = 0.05, 0.5, False, 0.55
