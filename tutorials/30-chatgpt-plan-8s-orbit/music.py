# "Slow orbit" sound: an unhurried ambient bed cut to the edit. Runs inside _kit/tools/audio.py (refills ML/MR).
# A Dmaj9 pad opens up as the card turns (air follows its turning speed), a soft tactile click and one clean
# electric-guitar note as the switch turns on, then Gmaj9 over a D pedal with a rising guitar figure for the lockup.
# All synthesized. FLIP / LOCK / SETTLE match scenes.js.
from scipy.signal import fftconvolve
FLIP, LOCK, SETTLE, END = 3.45, 5.55, 3.7, total
PL = {k: np.zeros(N) for k in ('tl', 'tr', 'dl', 'dr')}
def put(sig, t0, gain, pan=0.0, bus='t'):
    i = int(round(t0 * SR)); s = sig * gain
    if i < 0: s = s[-i:]; i = 0
    j = min(N, i + len(s))
    if j <= i: return
    PL[bus + 'l'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 - pan)); PL[bus + 'r'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 + pan))
def hp(x, a): return x - lp(x, a)
def saw(f, d): return osc(f, d, 'saw')
def ramp(n, a, r):                                              # linear attack / release envelope (samples)
    e = np.ones(n); a = max(1, int(a * SR)); r = max(1, int(r * SR))
    e[:a] = np.linspace(0, 1, a); e[-r:] *= np.linspace(1, 0, r); return e
def pad(notes, d, a, r, dark, bright, open_t=None):
    n = int(d * SR); out = np.zeros(n)
    for m in notes:
        for dt in (-0.0018, 0.0, 0.0021):
            x = saw(mtof(m) * (1 + dt), d)
            out += lp(x, dark) if open_t is None else lp(x, dark) * (1 - open_t) + lp(x, bright) * open_t
    return out * ramp(n, a, r) / (3 * len(notes))
def ks(f, d, bright=0.55, decay=0.9965):                       # Karplus-Strong, period L + 0.5 via a 2-tap average
    from scipy.signal import lfilter as lf
    n = int(d * SR); L = int(round(SR / f - 0.5))
    exc = np.zeros(n); burst = lp(rng.standard_normal(L), bright); exc[:L] = burst - burst.mean()
    a = np.zeros(L + 2); a[0] = 1; a[L] = -decay / 2; a[L + 1] = -decay / 2
    y = lf([1.0], a, exc)
    y = np.tanh(1.6 * y / (np.abs(y).max() + 1e-9)) / np.tanh(1.6)    # light drive: clean electric, not acoustic
    return lp(y, 0.5) * ramp(n, 0.001, 0.25)
def delayed(x, t, fb=0.33, taps=4, damp=0.35):                  # dotted-8th style echoes, darker each repeat
    out = np.zeros(len(x) + int(t * taps * SR)); y = x.copy()
    out[:len(x)] += x
    for k in range(1, taps + 1):
        y = lp(y, damp) * fb; i = int(k * t * SR); out[i:i + len(y)] += y
    return out

# Dmaj9 pad through the orbit: the filter opens as the card turns to face you (open_t), then it hands over to G
d1 = LOCK + 0.6; n1 = int(d1 * SR); ot = np.clip(np.arange(n1) / SR / SETTLE, 0, 1) ** 0.8
put(pad([50, 57, 64, 66, 69, 73], d1, 1.4, 0.9, 0.012, 0.045, ot), 0.0, 0.85, 0)
put(pad([43, 55, 59, 62, 66, 69, 76], END - LOCK + 0.3, 0.5, 1.2, 0.02, 0.05, None), LOCK - 0.25, 0.9, 0)
# D pedal sub under the whole piece
nsub = int(END * SR); tsub = np.arange(nsub) / SR
put(np.sin(2 * np.pi * mtof(38) * tsub) * np.clip(tsub / 2.0, 0, 1) * ramp(nsub, 0.01, 0.9), 0.0, 0.16, 0, 'd')
# air: band-limited noise that follows the card's turning speed, panning from left to centre with the yaw
u = np.clip(tsub / SETTLE, 0, 1); speed = 1.9 * (1 - u) ** 0.9 * (tsub < SETTLE)
air = hp(lp(noise(END), 0.12), 0.02) * speed * np.clip(tsub / 0.5, 0, 1)
put(air * np.sqrt(np.clip(0.5 + 0.5 * u, 0, 1)), 0.0, 0.05, -0.15, 'd')

# switch on: tactile click (two tiny transients, like a real toggle), a soft low thock, one guitar note with echoes
for o, g in ((0.0, 1.0), (0.045, 0.55)):
    c = hp(noise(0.012), 0.35) * env(int(0.012 * SR), 0.0002, 0.0035)
    put(c, FLIP + 0.04 + o, 0.16 * g, 0.12, 'd')
nt = int(0.12 * SR); put(np.sin(2 * np.pi * 150 * np.arange(nt) / SR) * env(nt, 0.001, 0.05, 4), FLIP + 0.04, 0.22, 0, 'd')
put(delayed(ks(mtof(81), 2.2), 0.3), FLIP + 0.1, 0.20, 0.25)         # A5
put(delayed(ks(mtof(76), 2.2), 0.3), FLIP + 0.22, 0.12, -0.2)        # E5

# lockup: a soft swell into it, then a rising Gmaj9 figure on the guitar
nr = int(0.7 * SR); put(hp(noise(0.7), 0.25) * (np.arange(nr) / nr) ** 2.5, LOCK - 0.7, 0.035, 0, 'd')
for i, (m, g) in enumerate(((67, 0.20), (71, 0.17), (74, 0.16), (78, 0.15), (81, 0.12))):
    put(delayed(ks(mtof(m), 2.6), 0.3, fb=0.28), LOCK + 0.02 + i * 0.15, g, -0.35 + 0.17 * i)

# room: long, soft synthetic reverb on the tonal bus
n = int(2.4 * SR); ir_t = np.arange(n) / SR
irl = lp(rng.standard_normal(n), 0.25) * np.exp(-ir_t / 0.55); irr = lp(rng.standard_normal(n), 0.25) * np.exp(-ir_t / 0.55)
irl /= np.sqrt((irl ** 2).sum()); irr /= np.sqrt((irr ** 2).sum())
wl = fftconvolve(PL['tl'], irl)[:N]; wr = fftconvolve(PL['tr'], irr)[:N]
ML[:] = PL['tl'] + 0.42 * wl + PL['dl']; MR[:] = PL['tr'] + 0.42 * wr + PL['dr']
pk = max(np.abs(ML).max(), np.abs(MR).max(), 1e-9); ML /= pk; MR /= pk
FADE_IN, FADE_OUT, KIT_STINGERS, MUSIC_GAIN = 0.05, 0.9, False, 0.55
