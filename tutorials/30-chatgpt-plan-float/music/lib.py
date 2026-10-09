# Shared synth kit for music/<style>.py. Runs inside _kit/tools/audio.py (via ../music.py), so np, SR, N,
# total, noise, mtof, rng, ML/MR are already defined. All sounds are synthesized; no samples.
from scipy.signal import fftconvolve, butter, sosfilt
DROP, FLIP, CARD, HIT, END = 3.4, 7.0, 10.0, 12.6, total     # scenes.js: window lands, switch on, card lands, end lockup
B = {k: np.zeros(N) for k in ('pl', 'pr', 'dl', 'dr')}         # p = tonal bus (reverb + sidechain), d = drums
def put(sig, t0, gain=1.0, pan=0.0, bus='p'):
    i = int(round(t0 * SR)); s = np.asarray(sig) * gain
    if i < 0: s = s[-i:]; i = 0
    j = min(N, i + len(s))
    if j <= i: return
    B[bus + 'l'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 - pan)); B[bus + 'r'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 + pan))
def tt(d): return np.arange(int(d * SR)) / SR
def filt(x, fc, kind='low', order=2): return sosfilt(butter(order, float(np.clip(fc, 20, SR * 0.47)), kind, fs=SR, output='sos'), x)
def sweep(x, f0, f1, curve=2.0, blk=480):                       # lowpass whose cutoff glides f0 -> f1
    y = np.zeros_like(x); zi = np.zeros((1, 2)); nb = max(1, len(x) // blk)
    for b in range(nb + 1):
        seg = x[b * blk:(b + 1) * blk]
        if not len(seg): break
        fc = f0 + (f1 - f0) * (b / nb) ** curve
        y[b * blk:b * blk + len(seg)], zi = sosfilt(butter(2, float(np.clip(fc, 20, SR * 0.47)), 'low', fs=SR, output='sos'), seg, zi=zi)
    return y
def ar(n, a, r):                                                # attack / release envelope
    i = np.arange(n); return np.minimum(1, i / max(1, a * SR)) * np.minimum(1, (n - i) / max(1, r * SR))
def dec(d, k): t = tt(d); return np.minimum(1, t / 0.003) * np.exp(-t * k)
# grid: beats are counted from the end-lockup downbeat (beat 0 = HIT)
def grid(bpm):
    global BPM, BEAT, BAR, S16; BPM = bpm; BEAT = 60 / bpm; BAR = 4 * BEAT; S16 = BEAT / 4
def at(n): return HIT + n * BEAT
def nb(t): return int(round((t - HIT) / BEAT))
# oscillators
def saw(f, d, ph=0.0): return 2 * ((f * tt(d) + ph) % 1) - 1
def tri(f, d): return 2 / np.pi * np.arcsin(np.sin(2 * np.pi * f * tt(d)))
def supersaw(notes, d, voices=5, spread=0.010):
    x = 0
    for m in notes:
        for v in range(voices):
            x = x + saw(mtof(m) * (1 + spread * (v / max(1, voices - 1) - 0.5)), d, rng.random())
    return x / (len(notes) * np.sqrt(voices))
# instruments
def kick(d=0.4, f0=48, punch=140, k=8.0, drive=1.6):
    t = tt(d); f = f0 + punch * np.exp(-t * 32)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * k) + filt(noise(d), 2500, 'high') * np.exp(-t * 350) * 0.3
    return np.tanh(drive * x) / np.tanh(drive)
def snare(d=0.3, tone=190, k=15):
    t = tt(d); return filt(filt(noise(d), 1000, 'high'), 9000) * np.exp(-t * k) * 0.8 + np.sin(2 * np.pi * tone * t) * np.exp(-t * 28) * 0.5
def clap(d=0.35, k=13):
    t = tt(d); x = filt(filt(noise(d), 900, 'high'), 7000); e = np.zeros_like(t)
    for o in (0, 0.008, 0.016): e += (t >= o) * np.exp(-np.clip(t - o, 0, None) * 220)
    return x * (e + (t >= 0.024) * np.exp(-np.clip(t - 0.024, 0, None) * k)) * 0.6
def hat(d=0.05, k=70): return filt(noise(d), 7500, 'high') * dec(d, k)
def ohat(d=0.25): return hat(d, 13)
def shaker(d=0.07): t = tt(d); return filt(filt(noise(d), 4500, 'high'), 11000) * np.minimum(1, t / 0.012) * np.exp(-t * 50)
def tamb(d=0.14): t = tt(d); return (filt(noise(d), 6500, 'high') + 0.2 * np.sin(2 * np.pi * 7400 * t)) * np.minimum(1, t / 0.002) * np.exp(-t * 28)
def tom(f=110, d=0.6): t = tt(d); return np.sin(2 * np.pi * np.cumsum(f * (1 + 0.6 * np.exp(-t * 18))) / SR) * np.exp(-t * 6) + filt(noise(d), 1800) * np.exp(-t * 40) * 0.25
def crash(d=2.2, k=2.4): t = tt(d); return filt(noise(d), 4500, 'high') * np.minimum(1, t / 0.002) * np.exp(-t * k)
def riser(d, peak=1.0): r = (np.arange(int(d * SR)) / (d * SR)) ** 2.5; return sweep(filt(noise(d), 300, 'high'), 800, 9000) * r * peak
def boom(d=1.6): t = tt(d); return np.sin(2 * np.pi * np.cumsum(38 + 60 * np.exp(-t * 12)) / SR) * np.exp(-t * 2.6)
def piano(m, d=1.4, bright=1.0):
    t = tt(d); f = mtof(m); x = 0
    for k in range(1, 9): x = x + np.sin(2 * np.pi * f * k * np.sqrt(1 + 0.0003 * k * k) * t) * np.exp(-t * (1.1 + k * (1.3 - 0.5 * bright))) / k ** 1.15
    return x * np.minimum(1, t / 0.002) * 0.6
def marimba(m, d=0.7):
    t = tt(d); f = mtof(m)
    return (np.sin(2 * np.pi * f * t) * np.exp(-t * 7) + 0.22 * np.sin(2 * np.pi * f * 3.93 * t) * np.exp(-t * 26) + 0.05 * np.sin(2 * np.pi * f * 9.2 * t) * np.exp(-t * 70)) * np.minimum(1, t / 0.0015)
def glock(m, d=1.0): t = tt(d); f = mtof(m); return (np.sin(2 * np.pi * f * t) + 0.12 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 8)) * np.minimum(1, t / 0.001) * np.exp(-t * 4.5)
def pluck(m, d=0.35, cut=3200, k=9, voices=3): t = tt(d); return filt(supersaw([m], d, voices, 0.008), cut) * np.minimum(1, t / 0.002) * np.exp(-t * k)
def pad(notes, d, cut=1600, a=0.3, r=0.5, voices=5): return filt(supersaw(notes, d, voices, 0.012), cut) * ar(int(d * SR), a, r)
def stab(notes, d=0.22, cut=3500): t = tt(d); return filt(supersaw(notes, d, 4, 0.012), cut) * np.minimum(1, t / 0.003) * np.exp(-t * 11)
def sub(m, d, drive=1.3): n = int(d * SR); x = np.sin(2 * np.pi * mtof(m) * tt(d)); return np.tanh(drive * x) / np.tanh(drive) * ar(n, 0.004, 0.03)
def bass(m, d, cut=700): n = int(d * SR); return (0.7 * np.sin(2 * np.pi * mtof(m) * tt(d)) + 0.45 * filt(saw(mtof(m), d), cut)) * ar(n, 0.004, 0.03)
def click():                                                    # the real switch flipping on
    return filt(noise(0.03), 5000) * dec(0.03, 260) + 0.25 * np.sin(2 * np.pi * 2600 * tt(0.03)) * dec(0.03, 300)
SC = np.ones(N)
def duck(t, depth=0.45, rel=0.11):
    i = int(t * SR); j = min(N, i + int(0.45 * SR))
    if j > i: SC[i:j] = np.minimum(SC[i:j], 1 - depth * np.exp(-np.arange(j - i) / SR / rel))
def finish(rev=0.25, decay=0.45, click_gain=0.25):
    global FADE_IN, FADE_OUT, KIT_STINGERS, MUSIC_GAIN
    put(click(), FLIP, click_gain, 0, 'd')
    B['pl'] *= SC; B['pr'] *= SC
    n = int(4 * decay * SR); t = np.arange(n) / SR; ir = []
    for _ in range(2):
        h = filt(rng.standard_normal(n), 6000) * np.exp(-t / decay); ir.append(h / np.sqrt((h ** 2).sum()))
    wl = fftconvolve(B['pl'], ir[0])[:N]; wr = fftconvolve(B['pr'], ir[1])[:N]
    ML[:] = B['pl'] + rev * wl + B['dl']; MR[:] = B['pr'] + rev * wr + B['dr']
    pk = max(np.abs(ML).max(), np.abs(MR).max(), 1e-9); ML[:] = ML / pk; MR[:] = MR / pk
    FADE_IN, FADE_OUT, KIT_STINGERS, MUSIC_GAIN = 0.02, 0.6, False, 0.55
def lockup_hit(ch, bn, pad_g=0.28, pno_g=0.24):                  # end lockup: kick, crash, wide chord, sparkle, long tail
    put(kick(0.5), HIT, 0.6, 0, 'd'); put(crash(2.4, 1.8), HIT, 0.09, 0, 'd')
    d = END - HIT + 0.5
    put(pad([m + 12 for m in ch], d, 2400, 0.01, 1.2) * np.exp(-tt(d) * 0.7), HIT, pad_g)
    for i, m in enumerate(ch): put(piano(m + 12, 2.4), HIT + 0.012 * i, pno_g / 2, -0.2 + 0.1 * i)
    put(sub(bn, 1.8) * np.exp(-tt(1.8) * 1.2), HIT, 0.4)
    for i, m in enumerate([ch[-1] + 12, ch[1] + 24]): put(glock(m, 1.6), HIT + 0.1 + 0.08 * i, 0.05, 0.3 * (1 - 2 * i))
