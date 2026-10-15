# Frosted-glass cut music: airy, minimal, 120 BPM. Cut to scenes.js (beat b at O + b*BEAT):
# glass arrives on b0 with a soft air swell, clean electric guitar harmonics pick a quiet D add9 pattern,
# the switch flips on b4 (a tactile click + low thump, the pattern opens up), a faint shimmer rides the light
# sweep, a reverse swell carries the morph into b9, where one guitar chord and a sub note land under the lockup.
# Runs inside _kit/tools/audio.py (refills ML/MR). All synthesized, no samples.
from scipy.signal import fftconvolve
BPM = 120; BEAT = 60 / BPM; O = 0.2
at = lambda b: O + b * BEAT
FADE_IN, FADE_OUT, KIT_STINGERS = 0.02, 1.0, False
DRY = {k: np.zeros(N) for k in 'lr'}; WET = {k: np.zeros(N) for k in 'lr'}
def put(sig, t0, gain, pan=0.0, rev=0.3):
    i = int(round(t0 * SR)); s = sig * gain
    if i < 0: s = s[-i:]; i = 0
    j = min(N, i + len(s))
    if j <= i: return
    gl, gr = np.sqrt(0.5 * (1 - pan)), np.sqrt(0.5 * (1 + pan))
    DRY['l'][i:j] += s[:j - i] * gl; DRY['r'][i:j] += s[:j - i] * gr
    WET['l'][i:j] += s[:j - i] * gl * rev; WET['r'][i:j] += s[:j - i] * gr * rev
def tt(d): return np.arange(int(d * SR)) / SR
def hp(x, a): return x - lp(x, a)
def ks(m, d, bright=0.5, damp=0.996):
    # Karplus-Strong string; effective period is L + 0.5 for the two-tap average
    f = mtof(m); L = max(2, int(round(SR / f - 0.5))); n = int(d * SR)
    x = np.zeros(n); b = lp(noise(L / SR)[:L], bright); x[:len(b)] = b - b.mean()
    a = np.zeros(L + 2); a[0] = 1; a[L] = -0.5 * damp; a[L + 1] = -0.5 * damp
    y = lfilter([1], a, x); y = np.tanh(1.4 * y / max(1e-9, np.abs(y).max())) / np.tanh(1.4)
    return y * np.minimum(1, (n - np.arange(n)) / (0.08 * SR))
def pad(ns, d, cut=0.02):
    t = tt(d); e = np.minimum(1, t / 1.2) * np.minimum(1, (d - t) / 0.8)
    return sum(lp(osc(mtof(m) * (1 + dt), d, 'saw'), cut) for m in ns for dt in (-0.0018, 0.0018)) * e / len(ns)
def sub(m, d):
    t = tt(d); return np.sin(2 * np.pi * mtof(m) * t) * np.minimum(1, t / 0.01) * np.exp(-t * 1.3) * np.minimum(1, (d - t) / 0.05)
def air(d, rise=True, a=0.02, b=0.25):
    t = tt(d); x = noise(d); sw = np.linspace(a, b, len(x)) if rise else np.linspace(b, a, len(x))
    y = np.zeros(len(x)); acc = 0.0
    for k in range(0, len(x), 256):                    # time-varying one-pole low-pass
        seg = x[k:k + 256]; c = sw[k]; o = lfilter([c], [1, c - 1], seg, zi=[acc * (1 - c)])
        y[k:k + 256] = o[0]; acc = o[0][-1]
    y = hp(y, 0.02); e = (t / d) ** 2 if rise else np.exp(-t * 4)
    return y * e
def click():
    x = hp(lp(noise(0.03), 0.7), 0.3) * env(int(0.03 * SR), 0.0002, 0.006)
    return x + osc(3100, 0.03) * env(int(0.03 * SR), 0.0002, 0.004) * 0.35
def thump():
    t = tt(0.4); f = 42 + 60 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7) * np.minimum(1, t / 0.002)

# D add9 colour throughout; it settles to Gmaj9/D at the lockup and back to D add9 ringing out.
put(pad([50, 57, 62, 64, 66], 4.9), 0.0, 0.10, 0, 0.5)
put(pad([50, 55, 59, 62, 66, 69], total - 4.1 + 0.2, 0.028), at(8) - 0.2, 0.11, 0, 0.5)
put(air(1.1, False, 0.02, 0.12), at(0), 0.05, 0, 0.6)
put(sub(38, 2.5), at(0), 0.10, 0, 0)

ARP = [74, 69, 76, 66, 78, 69, 76, 69]               # D5 A4 E5 F#4 F#5 A4 E5 A4
for k in range(16):                                  # eighths from b1 to b9
    b = 1 + k * 0.5
    if b >= 9: break
    open_ = b >= 4
    put(ks(ARP[k % 8], 1.6, 0.35 if not open_ else 0.6, 0.995), at(b), (0.05 if not open_ else 0.075) * (0.85 if k % 2 else 1),
        -0.35 if k % 2 else 0.35, 0.45)

put(click(), at(4), 0.30, 0.1, 0.15); put(thump(), at(4), 0.30, 0, 0.1); put(sub(38, 2.1), at(4), 0.13, 0, 0)
for b in (5, 6, 7): put(thump(), at(b), 0.12, 0, 0.05)
put(air(1.15, True, 0.05, 0.5), at(4) + 0.12, 0.022, -0.2, 0.7)   # shimmer under the light sweep
put(air(0.5 * 2 * BEAT, True, 0.02, 0.35), at(8) - 0.5, 0.06, 0, 0.6)  # reverse swell through the morph

# lockup: a soft strum of Gmaj9/D, then D add9 harmonics ring out
for i, m in enumerate([50, 55, 62, 66, 69, 74]):
    put(ks(m, total - at(9) + 0.3, 0.55, 0.9985), at(9) + i * 0.018, 0.085, -0.3 + i * 0.12, 0.5)
put(sub(38, total - at(9)), at(9), 0.14, 0, 0); put(thump(), at(9), 0.24, 0, 0.1)
for i, m in enumerate([78, 81, 86]):
    put(ks(m, 2.4, 0.6, 0.997), at(11) + i * 0.25, 0.035, 0.4 - i * 0.4, 0.7)

# dotted-eighth delay on the dry bus, then a short dark plate on the send
def delay(x, d, fb, mix):
    D = int(d * SR); a = np.zeros(D + 1); a[0] = 1; a[D] = -fb; b = np.zeros(D + 1); b[D] = 1
    return x + mix * lp(lfilter(b, a, x), 0.4)
ir_t = np.arange(int(2.2 * SR)) / SR
IR = {c: lp(noise(2.2), 0.3) * np.exp(-ir_t * 2.6) for c in 'lr'}
for c, M in (('l', ML), ('r', MR)):
    d = delay(DRY[c], 0.75 * BEAT, 0.28, 0.22 if c == 'l' else 0.18)
    w = fftconvolve(WET[c], IR[c])[:N] * 0.05
    M[:] = d + w
pk = max(np.abs(ML).max(), np.abs(MR).max(), 1e-9)
ML[:] = np.tanh(2 * ML / pk) / np.tanh(2); MR[:] = np.tanh(2 * MR / pk) / np.tanh(2)
