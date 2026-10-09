# Tutorial 30 variant 3 (bento grid) music, lo-fi take. Chillhop synth: 90 BPM, soft filtered-square lead melody over warm pads, sub bass, dusty kick/snare. Gmaj7 F#m7 Em9 Asus.
P = {'bass': 'sub',
 'bpm': 90,
 'brush': False,
 'chords': [[55, 59, 62, 66], [54, 57, 61, 64], [52, 55, 59, 62, 66], [57, 62, 64, 69]],
 'crackle': 8,
 'crg': 0.3,
 'final': [50, 57, 62, 66, 69],
 'hats': [0, 2, 4, 6, 8, 10, 12, 14],
 'kick': [0, 6, 10],
 'lead': 'synth',
 'mel': [[(0, 78, 1.5), (6, 76, 1), (10, 74, 2)], [(0, 73, 1.5), (6, 76, 1), (10, 78, 2)], [(2, 71, 1), (6, 74, 1), (8, 76, 1.5), (12, 79, 1.5)],
         [(0, 78, 1), (4, 76, 1), (8, 74, 3)]],
 'padcut': 0.05,
 'padg': 0.5,
 'padoct': 0,
 'rim': False,
 'roots': [43, 42, 40, 45],
 'snare': [4, 12],
 'swing': 0.2,
 'tone': 0.45,
 'verb': 0.35,
 'wow': 1.1}
# ---- lo-fi engine (shared by the presets above). Runs inside _kit/tools/audio.py, refills ML/MR. ----
# No bells, no keys: nylon/muted guitar via Karplus-Strong, filtered-saw pads, sub/upright bass, dusty drums,
# vinyl crackle and tape wow. Sync points match scenes.js T.*: drums enter as the intro folds into the header,
# a strum as the grid lands, drums drop out while the grid focuses, return on the switch flip, final chord on the logo.
BEAT = 60 / P['bpm']; BAR = 4 * BEAT; S16 = BEAT / 4
GLIDE, TILES, FOCUS, FLIP, LOGO = 2.5, 3.125, 6.875, 8.75, 10.625
END = N / SR
O = GLIDE - BAR * np.ceil(GLIDE / BAR - 1e-9)          # grid origin: a downbeat lands on GLIDE
BUS = {k: np.zeros(N) for k in ('tl', 'tr', 'dl', 'dr')}
def put(sig, t0, gain, pan=0.0, bus='t'):
    i = int(round(t0 * SR)); s = sig * gain
    if i < 0: s = s[-i:]; i = 0
    j = min(N, i + len(s))
    if j <= i: return
    BUS[bus + 'l'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 - pan)); BUS[bus + 'r'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 + pan))
def hp(x, a): return x - lp(x, a)
def lp2(x, a): return lp(lp(x, a), a)
def fades(n, a, r):
    i = np.arange(n); return np.minimum(1, i / max(1, a * SR)) * np.minimum(1, (n - i) / max(1, r * SR))
def pluck(m, d, tone=0.4, fb=0.996):                    # Karplus-Strong string
    n = int(d * SR); p = max(2, int(round(SR / mtof(m) - 0.5))); y = np.zeros(n + p + 2)
    y[:p + 1] = lp(rng.uniform(-1, 1, p + 1), tone)
    for s in range(p + 1, len(y), p):
        e = min(s + p, len(y)); y[s:e] = fb * 0.5 * (y[s - p:e - p] + y[s - p - 1:e - p - 1])
    y = hp(y[:n], 0.01); return y * fades(n, 0.001, min(0.25, d / 3)) / (np.abs(y).max() + 1e-9)
def strum(notes, t0, d, gain, tone=0.4, fb=0.996, gap=0.018, pan=0.0):
    for k, m in enumerate(notes): put(pluck(m, d, tone, fb), t0 + k * gap, gain / np.sqrt(len(notes)), pan + (k - len(notes) / 2) * 0.06)
def pad(notes, d, cut, att=0.5, rel=0.7):
    n = int(d * SR)
    s = sum(osc(mtof(m) * (1 + dt), d, 'saw') for m in notes for dt in (-0.0025, 0.0, 0.0025))
    return lp2(s, cut) * fades(n, att, rel) / (3 * len(notes))
def sq(f, d):
    ph = 2 * np.pi * f * np.arange(int(d * SR)) / SR; return sum(np.sin(k * ph) / k for k in (1, 3, 5, 7, 9))
def synth(m, d, cut=0.1):                               # soft filtered-square lead
    n = int(d * SR); x = lp2(sq(mtof(m), d) + 0.5 * sq(mtof(m) * 1.004, d), cut)
    return x * fades(n, 0.008, 0.1) * np.exp(-np.arange(n) / SR * 2.2)
def sub(m, d):
    n = int(d * SR); t = np.arange(n) / SR
    return np.tanh(1.6 * (np.sin(2 * np.pi * mtof(m) * t) + 0.2 * np.sin(4 * np.pi * mtof(m) * t))) * fades(n, 0.01, min(0.12, d / 3))
def upright(m, d):
    n = int(d * SR); t = np.arange(n) / SR
    return lp2(osc(mtof(m), d, 'tri') + 0.3 * osc(mtof(m) * 2, d), 0.15) * np.exp(-t * 3.2) * fades(n, 0.004, 0.06)
def kick():
    n = int(0.42 * SR); t = np.arange(n) / SR; f = 46 + 75 * np.exp(-t * 26)
    return lp(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7.5) + lp(noise(0.42), 0.3) * np.exp(-t * 300) * 0.3, 0.5)
def snare():
    t = np.arange(int(0.3 * SR)) / SR
    return lp(hp(lp(noise(0.3), 0.32), 0.04) * np.exp(-t * 16) + osc(190, 0.3, 'tri') * np.exp(-t * 34) * 0.5, 0.45)
def rim():
    t = np.arange(int(0.06 * SR)) / SR
    return lp(hp(noise(0.06), 0.2) * np.exp(-t * 90) + osc(420, 0.06, 'tri') * np.exp(-t * 70) * 0.6, 0.5)
def hat(d=0.06):
    t = np.arange(int(d * SR)) / SR; return lp(hp(noise(d), 0.55), 0.7) * np.exp(-t * 55)
def brush(d=0.18):
    t = np.arange(int(d * SR)) / SR; return lp(hp(noise(d), 0.3), 0.5) * np.minimum(1, t / 0.03) * np.exp(-t * 16)
def at(tb, p16): return tb + p16 * S16 + (P['swing'] * S16 if p16 % 4 == 2 else 0.5 * P['swing'] * S16 if p16 % 2 else 0)
def drums_on(t): return GLIDE - 0.01 <= t < LOGO - 0.05
def thin(t): return FOCUS <= t < FLIP

CH, RT = P['chords'], P['roots']
K, SN, RM, HT, BR = kick(), snare(), rim(), hat(), brush()
kicks = []
nb = int(np.ceil((LOGO - O) / BAR))
for b in range(nb):
    tb = O + b * BAR; ch = CH[b % 4]; r = RT[b % 4]; nxt = RT[(b + 1) % 4]
    pd = min(BAR + 0.8, LOGO + 0.3 - max(tb, 0))
    if pd > 0.5: put(pad([m + P['padoct'] for m in ch], pd, P['padcut'], 0.5, 0.45), max(tb, 0) - 0.05, P['padg'])
    # bass
    if P['bass'] == 'sub':
        for p16, dur in ((0, 2.5), (10, 1.4)):
            t = at(tb, p16)
            if drums_on(t): put(sub(r, dur * BEAT), t, 0.42 * (0.6 if thin(t) else 1))
    else:
        for q, m in enumerate((r, r + 7, r + 12 if q == 2 else r + 10, nxt - 1) if False else (r, r + 7, r + 10, nxt - 1)):
            t = at(tb, 4 * q)
            if drums_on(t): put(upright(m + 12, BEAT * 0.95), t, 0.55 * (0.6 if thin(t) else 1)); put(sub(m, BEAT * 0.9), t, 0.18)
    # guitar / lead
    soft = lambda t: 0.7 if t < GLIDE else 1.0
    if P['lead'] == 'arp':
        for i, p16 in enumerate((0, 3, 6, 8, 10, 13)):
            t = at(tb, p16)
            if 0.15 <= t < LOGO - 0.05: put(pluck(ch[(0, 2, 1, 3, 2, 4)[i] % len(ch)] + 12, 1.4, 0.35, 0.996), t, 0.16 * soft(t), 0.3 if i % 2 else -0.3)
    elif P['lead'] == 'offbeat':
        for p16 in (2, 6, 10, 14):
            t = at(tb, p16)
            if 0.15 <= t < LOGO - 0.05: strum([m + 12 for m in ch[-3:]], t, 0.42, 0.2 * soft(t), 0.25, 0.975, 0.008, 0.15)
    elif P['lead'] == 'comp':
        for p16, d, fb in ((6, 0.9, 0.99), (12, 0.5, 0.98)):
            t = at(tb, p16)
            if 0.15 <= t < LOGO - 0.05: strum(ch, t, d, 0.24 * soft(t), 0.35, fb, 0.02, -0.1)
    else:
        for p16, m, dur in P['mel'][b % 4]:
            t = at(tb, p16)
            if 0.15 <= t < LOGO - 0.05: put(synth(m, dur * BEAT + 0.3), t, 0.13 * soft(t), 0.15)
    # drums
    for p16 in P['kick']:
        t = at(tb, p16)
        if drums_on(t) and not thin(t): kicks.append(t); put(K, t, 0.62, 0, 'd')
    for p16 in P['snare']:
        t = at(tb, p16)
        if drums_on(t) and not thin(t): put(RM if P['rim'] else SN, t, 0.34 if P['rim'] else 0.36, 0.06, 'd')
    for p16 in P['hats']:
        t = at(tb, p16)
        if drums_on(t): put(BR if P['brush'] else HT, t, (0.12 if p16 % 4 == 0 else 0.08) * rng.uniform(0.8, 1.1) * (0.8 if thin(t) else 1), 0.25, 'd')

# edit accents
def chord_at(t): return CH[int(np.floor((t - O) / BAR + 1e-6)) % 4]
def accent(notes, t, g, d=1.6):
    if P['lead'] == 'synth':
        for k, m in enumerate(notes): put(synth(m, d, 0.08), t + 0.012 * k, g / len(notes) * 1.6, -0.3 + 0.15 * k)
    else: strum(notes, t, d, g, 0.4, 0.996, 0.022)
def swell(notes, d, t_end, g):                          # reversed pad tail rising into a cut
    n = int(d * SR); x = pad(notes, d, P['padcut'] * 1.5, 0.01, 0.01) * np.exp(-np.arange(n) / SR * 3.5)
    put(x[::-1], t_end - d, g)
accent([m + 12 for m in chord_at(TILES)[:4]], TILES, 0.2)
swell([m + 12 for m in chord_at(FLIP)], 1.1, FLIP, 0.7)
accent([m + 12 for m in chord_at(FLIP)[1:4]], FLIP, 0.14, 1.0); put(K, FLIP, 0.5, 0, 'd'); kicks.append(FLIP)
swell(P['final'], 0.9, LOGO, 0.6)
accent(P['final'], LOGO, 0.26, 2.8)
put(pad(P['final'], END - LOGO + 0.2, P['padcut'], 0.08, 1.4) * np.exp(-np.arange(int((END - LOGO + 0.2) * SR)) / SR * 0.5), LOGO, P['padg'] * 1.3)
put(sub(P['final'][0] - 12, 2.6), LOGO, 0.36); put(K, LOGO, 0.5, 0, 'd'); kicks.append(LOGO)

# vinyl crackle + hiss (not wowed)
cr = np.zeros(N); k = rng.poisson(P['crackle'] * END); cr[rng.integers(0, N, k)] = rng.uniform(-1, 1, k) * rng.uniform(0, 1, k) ** 3
cr = hp(lp(cr, 0.6), 0.25) * 2.5 + lp(rng.standard_normal(N), 0.08) * 0.004
put(cr, 0, P['crg'], 0, 'd')
# kick sidechain on the tonal bus, tape wow, short room
sc = np.ones(N)
for t in kicks:
    i = int(t * SR); j = min(N, i + int(0.4 * SR)); x = np.arange(j - i) / SR; sc[i:j] = np.minimum(sc[i:j], 1 - 0.35 * np.exp(-x / 0.1))
tt = np.arange(N) / SR
dl = P['wow'] * (0.0022 * (1 + np.sin(2 * np.pi * 0.42 * tt)) + 0.00008 * np.sin(2 * np.pi * 5.7 * tt))
for kk in ('tl', 'tr'): BUS[kk] = np.interp(np.arange(N) - dl * SR, np.arange(N), BUS[kk] * sc)
from scipy.signal import fftconvolve
n = int(1.4 * SR); ir_t = np.arange(n) / SR
irl = lp(rng.standard_normal(n), 0.25) * np.exp(-ir_t / 0.35); irr = lp(rng.standard_normal(n), 0.25) * np.exp(-ir_t / 0.35)
irl /= np.sqrt((irl ** 2).sum()); irr /= np.sqrt((irr ** 2).sum())
ML[:] = BUS['tl'] + P['verb'] * fftconvolve(BUS['tl'], irl)[:N] + 1.6 * BUS['dl']
MR[:] = BUS['tr'] + P['verb'] * fftconvolve(BUS['tr'], irr)[:N] + 1.6 * BUS['dr']
pk = max(np.abs(ML).max(), np.abs(MR).max(), 1e-9); ML /= pk; MR /= pk
ML[:] = hp(lp(np.tanh(1.5 * ML), P['tone']), 0.004); MR[:] = hp(lp(np.tanh(1.5 * MR), P['tone']), 0.004)   # warm tape tone
pk = max(np.abs(ML).max(), np.abs(MR).max(), 1e-9); ML /= pk; MR /= pk
if os.environ.get('MUSIC_DEBUG'):
    print({k: round(float(np.sqrt((v ** 2).mean())), 4) for k, v in BUS.items()})
FADE_IN, FADE_OUT, KIT_STINGERS, MUSIC_GAIN = 0.02, 0.9, False, 0.55
