# Tutorial 30 variant 3 (bento grid) music. Cinematic: 72 BPM hybrid trailer pulse in D minor that resolves to F major. Ticking 16th-note synth ostinato, taiko and toms, brass-like swells, a big hit on the flip and a wide F major bloom on the logo. Dm Bb F C.
# ---- launch-music engine: runs inside _kit/tools/audio.py and refills ML/MR. Everything is synthesized. ----
# Arrangement is locked to the edit in scenes.js (T.*): a filtered intro that opens into a drop when the intro folds
# into the header (GLIDE), a hit as the grid lands (TILES), a filtered breakdown + riser while the grid focuses (FOCUS),
# the drop's return on the switch flip (FLIP), and a final hit that rings out under the logo (LOGO).
from scipy.signal import fftconvolve, iirpeak, butter, sosfilt
from scipy.signal import lfilter as _lfilter
GLIDE, TILES, FOCUS, FLIP, LOGO = 2.5, 3.125, 6.875, 8.75, 10.625
END = N / SR
BUS = {k: np.zeros((2, N)) for k in ('drm', 'bas', 'mus', 'hook', 'fx')}
KT = []
def put(sig, t0, g=1.0, pan=0.0, bus='mus'):
    if sig.ndim == 1: sig = np.stack([sig * np.sqrt(0.5 * (1 - pan)), sig * np.sqrt(0.5 * (1 + pan))])
    i = int(round(t0 * SR)); s = sig * g
    if i < 0: s = s[:, -i:]; i = 0
    j = min(N, i + s.shape[1])
    if j > i: BUS[bus][:, i:j] += s[:, :j - i]
def tt(d): return np.arange(int(d * SR)) / SR
def flp(x, fc, o=2): return sosfilt(butter(o, min(fc, SR * 0.45), 'low', fs=SR, output='sos'), x)
def fhp(x, fc, o=2): return sosfilt(butter(o, fc, 'high', fs=SR, output='sos'), x)
def fbp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def adsr(n, a, d, s, r):
    t = np.arange(n) / SR; dur = n / SR
    e = np.where(t < a, t / max(a, 1e-4), s + (1 - s) * np.exp(-(t - a) / max(d, 1e-4)))
    return e * np.clip((dur - t) / max(r, 1e-4), 0, 1)
def smap(fn, x): return np.stack([fn(x[0]), fn(x[1])]) if x.ndim == 2 else fn(x)
def tvlp(x, fc):                                       # time-varying one-pole low-pass (fc array in Hz)
    a = (1 - np.exp(-2 * np.pi * np.minimum(fc, SR * 0.45) / SR)).tolist(); y = [0.0] * len(a); s = 0.0
    for i, v in enumerate(x.tolist()): s += a[i] * (v - s); y[i] = s
    return np.array(y)
def nsaw(f, d, ph=0.0): return 2 * ((f * tt(d) + ph) % 1) - 1
def sine(f, d): return np.sin(2 * np.pi * f * tt(d))
def sweep(f, d): return np.sin(2 * np.pi * np.cumsum(f) / SR)
def supersaw(m, d, voices=7, det=0.2, width=0.9):
    f = mtof(m); n = int(d * SR); Lx = np.zeros(n); Rx = np.zeros(n)
    for v in range(voices):
        c = (v - (voices - 1) / 2) / ((voices - 1) / 2); x = nsaw(f * 2 ** (c * det / 12), d, rng.random())[:n]
        Lx += x * np.sqrt(0.5 * (1 - c * width)); Rx += x * np.sqrt(0.5 * (1 + c * width))
    return np.stack([Lx, Rx]) / np.sqrt(voices)
def fenv(x, lo, hi, dec):                              # filter envelope hi -> lo
    def f1(y): e = np.exp(-np.arange(len(y)) / SR / dec); return e * flp(y, hi) + (1 - e) * flp(y, lo)
    return smap(f1, x)
def fopen(x, lo, hi, att):                             # filter swell lo -> hi
    def f1(y): e = np.minimum(1, np.arange(len(y)) / SR / att) ** 1.5; return e * flp(y, hi) + (1 - e) * flp(y, lo)
    return smap(f1, x)
# drums
def kick(f0=50, punch=1.0, d=0.45):
    t = tt(d); body = sweep(f0 + 170 * punch * np.exp(-t * 38), d) * np.exp(-t * 6.5)
    return np.tanh(1.8 * (body + fhp(noise(d), 2500) * np.exp(-t * 200) * 0.3))
def k808(m, d, glide=0.0):
    t = tt(d); f = mtof(m) * (1 + 1.2 * np.exp(-t * 35)) * 2 ** (glide * np.minimum(1, t / 0.12) / 12)
    return np.tanh(2.0 * sweep(f, d) * adsr(len(t), 0.002, 0.5, 0.8, 0.06)) * 0.8
def clap(d=0.4, tail=14):
    t = tt(d); x = fbp(noise(d), 900, 5000); e = np.zeros(len(t))
    for o in (0, 0.01, 0.021): e += (t >= o) * np.exp(-np.clip(t - o, 0, None) * 160)
    e += (t >= 0.03) * np.exp(-np.clip(t - 0.03, 0, None) * tail) * 0.8
    return x * e
def snare(d=0.3):
    t = tt(d); return fhp(noise(d), 1500) * np.exp(-t * 18) * 0.7 + sweep(190 + 70 * np.exp(-t * 50), d) * np.exp(-t * 24) * 0.7
def hat(d=0.05, op=False): t = tt(d); return fhp(noise(d), 7500, 4) * np.exp(-t * (11 if op else 75))
def shaker(d=0.09): t = tt(d); return fbp(noise(d), 4500, 12000) * np.minimum(1, t / 0.018) * np.exp(-t * 42)
def tamb(d=0.28):
    t = tt(d); x = sum(np.sin(2 * np.pi * f * t + rng.random() * 6) for f in (5300, 6900, 8200, 9700, 11300))
    return (fhp(noise(d), 6500) * 0.7 + x * 0.08) * np.minimum(1, t / 0.004) * np.exp(-t * 13)
def stomp(d=0.45):
    t = tt(d); return np.tanh(2 * (sweep(62 + 90 * np.exp(-t * 30), d) * np.exp(-t * 8) + flp(noise(d), 700) * np.exp(-t * 22) * 0.7))
def tom(m=43, d=0.7): t = tt(d); return sweep(mtof(m) * (1 + 0.45 * np.exp(-t * 14)), d) * np.exp(-t * 5) + fbp(noise(d), 150, 2500) * np.exp(-t * 32) * 0.35
def taiko(d=1.8): t = tt(d); return np.tanh(1.6 * (sweep(54 * (1 + 0.6 * np.exp(-t * 11)), d) * np.exp(-t * 2.6) + flp(noise(d), 1000) * np.exp(-t * 13) * 0.9))
def logdrum(m, d=0.55): t = tt(d); return np.tanh(2.4 * sweep(mtof(m) * (1 + 0.9 * np.exp(-t * 28)), d) * np.exp(-t * 5.5)) * 0.75
def conga(m, d=0.25): t = tt(d); return sweep(mtof(m) * (1 + 0.25 * np.exp(-t * 40)), d) * np.exp(-t * 15) + fbp(noise(d), 1500, 6000) * np.exp(-t * 140) * 0.3
def rim(d=0.07): t = tt(d); return fbp(noise(d), 1500, 7000) * np.exp(-t * 110) + sine(1700, d) * np.exp(-t * 90) * 0.4
def snap(d=0.12): t = tt(d); return fbp(noise(d), 1800, 6000) * np.exp(-t * 60) * 1.2
def crash(d=2.4): t = tt(d); x = fhp(noise(d), 3500) + 0.25 * sum(np.sin(2 * np.pi * f * t + rng.random() * 6) for f in (3170, 4290, 5530, 7110)); return x * np.minimum(1, t / 0.003) * np.exp(-t * 1.6)
# tonal
def ks(m, d, tone=0.5, fb=0.996):                       # plucked string (Karplus-Strong)
    n = int(d * SR); p = max(2, int(round(SR / mtof(m) - 0.5))); y = np.zeros(n + p + 2)
    y[:p + 1] = lp(rng.uniform(-1, 1, p + 1), tone)
    for s in range(p + 1, len(y), p):
        e = min(s + p, len(y)); y[s:e] = fb * 0.5 * (y[s - p:e - p] + y[s - p - 1:e - p - 1])
    y = fhp(y[:n], 80); return y * adsr(n, 0.001, 9, 1, min(0.2, d / 3)) / (np.abs(y).max() + 1e-9)
def strum(notes, t0, d, g, tone=0.5, fb=0.996, gap=0.012, up=False, pan=0.0, bus='mus'):
    ns = notes[::-1] if up else notes
    for k, m in enumerate(ns): put(ks(m, d, tone, fb), t0 + k * gap, g / np.sqrt(len(ns)), pan + (k / max(1, len(ns) - 1) - 0.5) * 0.5, bus)
def pluck(m, d, hi=7000, lo=350, dec=0.09):
    x = 0.5 * (nsaw(mtof(m), d, rng.random()) + nsaw(mtof(m) * 1.006, d, rng.random()))
    return fenv(x, lo, hi, dec) * adsr(int(d * SR), 0.002, 0.22, 0.0, 0.04)
def stab(notes, d, hi=6000, lo=600, dec=0.16, sus=0.25):
    x = sum(supersaw(m, d, 5, 0.16) for m in notes) / len(notes); return fenv(x, lo, hi, dec) * adsr(int(d * SR), 0.003, 0.25, sus, 0.06)
def padw(notes, d, cut=1600, att=0.4):
    x = sum(supersaw(m, d, 5, 0.12) for m in notes) / len(notes); return smap(lambda y: flp(y, cut), x) * adsr(int(d * SR), att, 1, 1, 0.5)
def brass(notes, d, att=0.12):
    x = sum(supersaw(m, d, 3, 0.08, 0.6) for m in notes) / len(notes); return fopen(x, 300, 2600, att) * adsr(int(d * SR), att * 0.5, 0.4, 0.8, 0.12)
VOW = {'ah': (800, 1150, 2900), 'oh': (450, 800, 2830), 'ee': (300, 2300, 3000), 'oo': (330, 700, 2500), 'eh': (530, 1840, 2480)}
def vox(m, d, v='ah', vib=0.006):                       # formant "vocal chop"
    t = tt(d); f = mtof(m) * (1 + vib * np.sin(2 * np.pi * 5.3 * t) * np.minimum(1, t / 0.2))
    src = 2 * ((np.cumsum(f) / SR) % 1) - 1
    y = sum(g * _lfilter(*iirpeak(fc, q, fs=SR), src) for fc, q, g in zip(VOW[v], (5, 7, 9), (1.0, 0.55, 0.3)))
    y += fbp(noise(d), 2500, 8000) * 0.02
    return y * adsr(len(t), 0.012, 0.25, 0.8, 0.05) / (np.abs(y).max() + 1e-9)
def choir(m, d, v='oh', g=1.0): return sum(vox(m + o, d, v, 0.008) * w for o, w in ((0, 1.0), (-12, 0.5), (0.08, 0.7), (-0.08, 0.7))) * g / 2.2
def bassl(m, d, cut=900, dec=0.15):
    x = nsaw(mtof(m), d) * 0.6 + sine(mtof(m), d); return fenv(x, 200, cut, dec) * adsr(int(d * SR), 0.003, 0.3, 0.7, 0.04)
# fx
def riser(d, f0=250, f1=9000):
    t = tt(d); fc = f0 * (f1 / f0) ** (t / d) ** 1.5
    x = tvlp(tvlp(fhp(noise(d), 200), fc), fc) * (t / d) ** 2
    return x / (np.abs(x).max() + 1e-9) + 0.12 * sweep(220 * 2 ** (2 * t / d), d) * (t / d) ** 2
def revcym(d=1.2): t = tt(d); return (fhp(noise(d), 5000) * np.exp(-t * 3.2))[::-1]
def impact(d=2.2):
    t = tt(d); return np.tanh(1.5 * (sweep(70 * np.exp(-t * 1.2) + 20, d) * np.exp(-t * 2.2) + flp(noise(d), 1500) * np.exp(-t * 9) * 0.6))
def downlift(d=1.2): t = tt(d); fc = 8000 * (300 / 8000) ** (t / d); return tvlp(noise(d), fc) * np.exp(-t * 2.5)
# grid + sections
def grid(bpm, origin=0.0, swing=0.0):
    global BEAT, BAR, S16, ORG, SW
    BEAT = 60 / bpm; BAR = 4 * BEAT; S16 = BEAT / 4; ORG = origin; SW = swing
def at(b, s16): return ORG + b * BAR + s16 * S16 + (SW * S16 if s16 % 2 == 1 else 0)
def bars(): return range(int(np.floor(-ORG / BAR)) - 1, int(np.ceil((END - ORG) / BAR)) + 1)
def groove(t): return GLIDE - 0.01 <= t < FOCUS or FLIP - 0.01 <= t < LOGO - 0.05
def brk(t): return FOCUS <= t < FLIP - 0.01
def live(t): return 0 <= t < LOGO - 0.05
def kk(sig, t, g=1.0): KT.append(t); put(sig, t, g, 0, 'drm')
def common_fx(roll=True, big=1.0):
    put(revcym(1.3), GLIDE - 1.3, 0.22, 0, 'fx'); put(impact(), GLIDE, 0.35 * big, 0, 'fx'); put(crash(), GLIDE, 0.12, -0.2, 'fx')
    put(riser(FLIP - FOCUS - 0.1), FOCUS + 0.1, 0.20, 0, 'fx')
    if roll:
        n = 16
        for i in range(n): t = FLIP - BEAT * 2 + i * BEAT * 2 / n; put(snare(0.18), t, 0.12 + 0.25 * i / n, 0.1, 'drm')
    put(impact(), FLIP, 0.55 * big, 0, 'fx'); put(crash(), FLIP, 0.18, 0.2, 'fx'); put(revcym(0.8), FLIP - 0.8, 0.15, 0, 'fx')
    put(impact(2.8), LOGO, 0.5 * big, 0, 'fx'); put(crash(3.0), LOGO, 0.14, -0.1, 'fx'); put(revcym(0.9), LOGO - 0.9, 0.14, 0, 'fx')
def mixdown(duck=0.4, verb=(0.08, 0.15, 0.22, 0.3, 0.35), delay=0.3, drive=1.4):
    sc = np.ones(N)
    for t in KT:
        i = int(t * SR); j = min(N, i + int(0.3 * SR)); x = np.arange(j - i) / SR; sc[i:j] = np.minimum(sc[i:j], 1 - duck * np.exp(-x / 0.07))
    for k in ('bas', 'mus', 'hook'): BUS[k] *= sc if k != 'hook' else (1 - 0.5 * (1 - sc))
    h = BUS['hook']; dt = int(3 * S16 * SR); dl = np.zeros_like(h)   # ping-pong dotted-eighth delay on the hook
    for k in range(1, 6):
        if k * dt < N: dl[k % 2, k * dt:] += (delay ** k) * h[(k + 1) % 2, :N - k * dt]
    BUS['hook'] = h + smap(lambda y: flp(fhp(y, 300), 5000), dl)
    t = np.arange(N) / SR                                       # filter automation: intro opens, breakdown dips
    fc = np.full(N, 20000.0)
    m = t < GLIDE; fc[m] = 350 * (18000 / 350) ** ((t[m] / GLIDE) ** 1.8)
    m = (t >= FOCUS) & (t < FOCUS + 0.45); fc[m] = 20000 * (700 / 20000) ** ((t[m] - FOCUS) / 0.45)
    m = (t >= FOCUS + 0.45) & (t < FLIP); fc[m] = 700 * (9000 / 700) ** (((t[m] - FOCUS - 0.45) / (FLIP - FOCUS - 0.45)) ** 2)
    tone = BUS['mus'] + BUS['hook'] + BUS['bas']
    tone = np.stack([tvlp(tvlp(tone[c], fc), fc) for c in (0, 1)])
    n = int(2.2 * SR); it = np.arange(n) / SR; pre = int(0.018 * SR)
    ir = np.stack([np.concatenate([np.zeros(pre), flp(rng.standard_normal(n), 7000) * np.exp(-it / 0.45)]) for _ in (0, 1)])
    ir /= np.sqrt((ir ** 2).sum(1, keepdims=True))
    send = verb[0] * BUS['drm'] + verb[2] * tone + verb[4] * BUS['fx']
    wet = np.stack([fftconvolve(send[c], ir[c])[:N] for c in (0, 1)])
    mix = BUS['drm'] + tone + BUS['fx'] + wet
    mix = smap(lambda y: fhp(y, 28), mix); mix /= np.abs(mix).max() + 1e-9
    mix = np.tanh(drive * mix) / np.tanh(drive)
    ML[:] = mix[0]; MR[:] = mix[1]
FADE_IN, FADE_OUT, KIT_STINGERS, MUSIC_GAIN = 0.02, 0.8, False, 0.55

# ---- track ----
grid(72, GLIDE)
CH = [[50, 57, 62, 65], [46, 53, 58, 62], [41, 53, 57, 60], [48, 55, 60, 64]]; RT = [38, 34, 41, 36]
TK = taiko()
for b in bars():
    tb = at(b, 0); ch = CH[b % 4]; r = RT[b % 4]
    if live(tb + 0.1): put(padw(ch, BAR + 0.4, 1200, 0.6), max(0, tb), 0.18)
    for s in range(16):
        t = at(b, s)
        if 0.05 <= t < LOGO - 0.05:
            m = ch[(0, 2, 1, 2)[s % 4]] + 12 + (12 if s % 8 == 6 else 0)
            put(pluck(m, 0.2, 4500, 300, 0.05), t, 0.16 * (1.0 if s % 4 == 0 else 0.7), 0.35 * (1 if s % 2 else -1))
        if groove(t) and s % 2 == 0: put(hat(0.03), t, 0.07 if s % 4 else 0.11, 0.2, 'drm')
    for s, g in ((0, 0.8), (10, 0.5)):
        t = at(b, s)
        if groove(t): kk(TK, t, g)
    for s, m in ((6, 43), (14, 40), (15, 38)):
        t = at(b, s)
        if groove(t): put(tom(m, 0.6), t, 0.32, -0.25, 'drm')
    t = at(b, 0)
    if groove(t): put(brass([m - 12 for m in ch[:3]], BAR * 0.9, 0.35), t, 0.22); put(k808(r - 12, BAR * 0.8), t, 0.35, 0, 'bas')
for i in range(12): put(tom(45 - (i % 3) * 2, 0.4), FLIP - BEAT + i * BEAT / 12, 0.12 + 0.025 * i, -0.3 + 0.05 * i, 'drm')
common_fx(roll=False, big=1.3)
put(brass([62, 65, 69, 74], 1.2, 0.08), TILES, 0.24); kk(TK, TILES, 0.6)
put(brass([53, 57, 60, 65], 1.6, 0.05), FLIP, 0.28); kk(TK, FLIP, 0.9)
FIN = [41, 53, 57, 60, 64, 67, 72]
put(padw(FIN, END - LOGO + 0.3, 2600, 0.08), LOGO, 0.32); put(brass(FIN[:5], 2.6, 0.06), LOGO, 0.26)
put(padw([81, 84, 88], END - LOGO, 5000, 0.8), LOGO + 0.2, 0.08); kk(TK, LOGO, 1.0); put(k808(29, 3.0), LOGO, 0.45, 0, 'bas')
mixdown(duck=0.3, verb=(0.15, 0.15, 0.35, 0.3, 0.45), delay=0.2)
