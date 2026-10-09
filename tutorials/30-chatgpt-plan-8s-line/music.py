# "One sentence" sound design. Runs inside _kit/tools/audio.py (refills ML/MR). All synthesized, no samples.
# A soft Dmaj9 air pad under everything; one muted clean-guitar note per word (rising), a warm low bloom when the
# Devin lockup lands, then a crisp switch tick and a gentle strummed chord with dotted-8th echoes when the switch
# turns on. Everything breathes out with the fade. Times match scenes.js.
from scipy.signal import lfilter
T_WORD0, T_GAP, T_LOGO, T_CARD, T_ON, T_FADE, T_END = 0.35, 0.15, 1.18, 2.55, 3.85, 7.1, 7.8
KIT_STINGERS = False; FADE_IN = 0.02; FADE_OUT = 0.6

def ks(m, d, damp=0.996, bright=0.5, drive=1.4):
    """Karplus-Strong string; period L+0.5 from the two-tap average, so L = SR/f - 0.5."""
    n = int(d * SR); P = SR / mtof(m) - 0.5; Li = int(P)
    exc = np.zeros(n); burst = lp(noise(Li / SR + 1e-3)[:Li], bright); exc[:Li] = burst - burst.mean()
    a = np.zeros(Li + 2); a[0] = 1; a[Li] = -0.5 * damp; a[Li + 1] = -0.5 * damp
    y = lfilter([1], a, exc)
    y = np.tanh(drive * y / (np.abs(y).max() + 1e-9)) / np.tanh(drive)
    return y * np.minimum(1, (n - np.arange(n)) / (0.05 * SR))
def echo(x, dt, fb=0.32, taps=4, tone=0.25):
    out = x.copy(); k = int(dt * SR); cur = x
    for i in range(1, taps + 1):
        cur = lp(cur, tone) * fb
        if k * i >= len(x): break
        out[k * i:] += cur[:len(x) - k * i]
    return out
def place(sig, t0, g, pan=0.0):
    madd(sig, t0, g, pan)

# air pad: detuned filtered saws, Dmaj9 voicing, swells in slowly and opens a little at the lockup
pad_notes = [50, 57, 61, 64, 66]
n = N; t = np.arange(n) / SR
open_ = np.clip((t - T_LOGO) / 1.2, 0, 1)
padsig = np.zeros(n)
for m in pad_notes:
    for dt in (-0.0015, 0.0015):
        padsig += lfilter([0.035], [1, 0.035 - 1], osc(mtof(m) * (1 + dt), n / SR, 'saw')) * (0.8 + 0.6 * open_)
padsig /= len(pad_notes) * 2
swell = np.clip(t / 1.4, 0, 1) ** 1.6 * (0.55 + 0.45 * np.clip((t - T_LOGO) / 0.8, 0, 1))
madd(padsig * swell, 0, 0.3, -0.15); madd(np.roll(padsig, int(0.011 * SR)) * swell, 0, 0.3, 0.15)

# one muted guitar note per word, rising: A4 B4 D5 E5 F#5
for i, m in enumerate([69, 71, 74, 76, 78]):
    x = ks(m, 0.9, damp=0.986, bright=0.35) * env(int(0.9 * SR), 0.002, 0.5, 3)
    place(echo(x, 0.42, 0.22, 2), T_WORD0 + i * T_GAP + 0.03, 0.15, -0.35 + i * 0.17)

# lockup lands: warm low bloom (sine D2 + soft octave) and a high harmonic A5
bl = int(2.4 * SR); tb = np.arange(bl) / SR
bloom = (np.sin(2 * np.pi * mtof(38) * tb) + 0.35 * np.sin(2 * np.pi * mtof(50) * tb)) * np.minimum(1, tb / 0.06) * np.exp(-tb * 1.6)
place(bloom, T_LOGO + 0.05, 0.42)
place(echo(ks(81, 1.6, 0.995, 0.3) * env(int(1.6 * SR), 0.002, 1.2, 3), 0.42, 0.3, 3), T_LOGO + 0.08, 0.10, 0.25)

# card rises: a faint airy breath
br = int(1.0 * SR); x = lp(noise(1.0) - lp(noise(1.0), 0.05), 0.3)
place(x * np.sin(np.pi * np.arange(br) / br) ** 2, T_CARD - 0.05, 0.035)

# switch on: crisp two-part tick, then a gentle up-strum of Dadd9 with dotted-8th echoes
tk = int(0.03 * SR); tt = np.arange(tk) / SR
tick = (lp(noise(0.03), 0.7) * np.exp(-tt * 900) * 0.6 + np.sin(2 * np.pi * 2600 * tt) * np.exp(-tt * 500) * 0.4)
place(tick, T_ON, 0.7); place(tick * 0.5, T_ON + 0.018, 0.35)
for i, m in enumerate([50, 57, 62, 66, 69, 76]):
    x = ks(m, 3.6, 0.9975, 0.45) * env(int(3.6 * SR), 0.003, 2.6, 3)
    place(echo(x, 0.45, 0.3, 4), T_ON + 0.03 + i * 0.022, 0.22, -0.3 + i * 0.12)
place(bloom * 0.6, T_ON + 0.02, 0.28)

# breathe out with the picture
fo = np.clip((T_END + 0.2 - t) / (T_END + 0.2 - T_FADE), 0, 1) ** 1.5
ML[:] *= fo; MR[:] *= fo
# soft clip so the AAC master keeps true peak under -1 dBFS after loudnorm
pk = max(np.abs(ML).max(), np.abs(MR).max()) + 1e-9
ML[:] = np.tanh(2 * ML / pk) / np.tanh(2) * pk; MR[:] = np.tanh(2 * MR / pk) / np.tanh(2) * pk
