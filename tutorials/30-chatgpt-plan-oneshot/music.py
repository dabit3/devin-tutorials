# Variant 4 music: a warm, swung 104 BPM electro-pop groove, cut to the single camera move in scenes.js.
# Title: FM electric piano + marimba arpeggio. The groove enters as the camera starts its descent (beat 4),
# a bell chime lands on the switch (beat 12), the drums lift out on beat 21 and an E major hit lands with the
# Devin lockup on beat 22. IV-V-vi in A/E. Runs inside _kit/tools/audio.py (refills ML/MR). All synthesized.
from scipy.signal import fftconvolve
BPM = 104; BEAT = 60 / BPM; S16 = BEAT / 4; BAR = 4 * BEAT; SWING = 0.6
DROP, FLIP, LIFT, HIT = 4 * BEAT, 12 * BEAT, 21 * BEAT, 22 * BEAT     # scenes.js uses the same beat grid
def st(bar, k): return bar * BAR + (k // 2) * 2 * S16 + (k % 2) * 2 * S16 * SWING   # swung 16th k of a bar
CH = {'A': (33, [57, 61, 64, 68, 71]), 'B': (35, [59, 63, 66, 68, 73]), 'C#m': (37, [56, 61, 64, 68, 71]), 'E': (28, [56, 59, 64, 66, 71])}
BARS = ['A', 'B', 'C#m', 'A', 'B', 'C#m']
BUS = {k: np.zeros(N) for k in ('tl', 'tr', 'dl', 'dr')}
def put(sig, t0, gain, pan=0.0, bus='t'):
    i = int(round(t0 * SR)); s = sig * gain
    if i < 0: s = s[-i:]; i = 0
    j = min(N, i + len(s))
    if j <= i: return
    BUS[bus + 'l'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 - pan)); BUS[bus + 'r'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 + pan))
def hp(x, a): return x - lp(x, a)
def tt(d): return np.arange(int(d * SR)) / SR
def ep(m, d, bright=1.0):                       # FM tine piano
    t = tt(d); f = mtof(m); idx = (1.1 * bright) * np.exp(-t * 5)
    x = np.sin(2 * np.pi * f * t + idx * np.sin(2 * np.pi * f * t)) + 0.18 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 4)
    return x * np.minimum(1, t / 0.004) * np.exp(-t * 1.6 / max(d, 0.2)) * (1 + 0.12 * np.sin(2 * np.pi * 4.8 * t))
def chord(notes, d, bright=1.0): return sum(ep(m, d, bright) for m in notes) / len(notes)
def marimba(m, d=0.35):
    t = tt(d); f = mtof(m)
    return (np.sin(2 * np.pi * f * t) * np.exp(-t * 9) + 0.35 * np.sin(2 * np.pi * 3.93 * f * t) * np.exp(-t * 40)) * np.minimum(1, t / 0.0015)
def bell(m, d=1.6):
    t = tt(d); f = mtof(m)
    return np.sin(2 * np.pi * f * t + 1.6 * np.exp(-t * 3) * np.sin(2 * np.pi * 3.5 * f * t)) * np.exp(-t * 2.6) * np.minimum(1, t / 0.002)
def bass(m, d):
    t = tt(d); f = mtof(m)
    x = np.tanh(1.6 * (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t)))
    return x * np.minimum(1, t / 0.005) * np.minimum(1, (d - t) / 0.03) * np.exp(-t * 1.2)
def kick():
    t = tt(0.4); f = 44 + 80 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7.5) + hp(noise(0.4), 0.4) * np.exp(-t * 250) * 0.25
def snare():
    t = tt(0.25); x = hp(lp(noise(0.25), 0.5), 0.12) * np.exp(-t * 22) + 0.4 * np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30)
    return x
def shaker(d=0.06):
    x = hp(noise(d), 0.7); t = tt(d); return x * np.minimum(1, t / 0.008) * np.exp(-t * 60)
KK, SN, SH = kick(), snare(), shaker()
kicks = []
# title bar: sustained piano chord and a rising marimba arpeggio
put(chord(CH['A'][1], 2.6, 0.8), 0.02, 0.34, 0)
put(bass(CH['A'][0] + 12, BAR * 0.95), 0.02, 0.10, 0)
for k in range(16):
    t = st(0, k)
    if k % 2: continue
    notes = CH['A'][1]; m = notes[(k // 2) % len(notes)] + 12
    put(marimba(m), t + 0.05, 0.12 * (0.7 + 0.3 * (k / 16)), -0.35 if (k // 2) % 2 else 0.35)
for b, name in enumerate(BARS):
    if b == 0: continue
    root, notes = CH[name]; tb = b * BAR
    last = b == len(BARS) - 1                    # C#m bar is cut short by the hit on beat 22
    for k in range(16):
        t = st(b, k)
        if t >= HIT - 0.02: continue
        if k in (0, 3, 6, 10, 13):              # syncopated piano stabs
            put(chord(notes, 0.42 if k else 0.8), t, 0.26 if k == 0 else 0.18, 0.15 if k % 2 else -0.15)
        if k % 2 == 0:                           # marimba line on swung 8ths
            m = notes[(k // 2 * 2 + b) % len(notes)] + 12
            put(marimba(m), t, 0.085, -0.4 if (k // 2) % 2 else 0.4)
        if k in (0, 6, 10, 14):                  # bass
            m = root + (7 if k == 10 else 12 if k == 14 else 0)
            put(bass(m, S16 * (3 if k != 14 else 1.6)), t, 0.30)
        if t >= LIFT: continue
        if k in (0, 7, 10):
            kicks.append(t); put(KK, t, 0.62, 0, 'd')
        if k in (4, 12): put(SN, t, 0.26, 0.05, 'd')
        put(SH, t, 0.05 if k % 2 else 0.028, 0.3, 'd')
# soft sidechain on the tonal bus
sc = np.ones(N)
for t in kicks:
    i = int(t * SR); j = min(N, i + int(0.35 * SR)); x = np.arange(j - i) / SR
    sc[i:j] = np.minimum(sc[i:j], 1 - 0.45 * np.exp(-x / 0.08))
BUS['tl'] *= sc; BUS['tr'] *= sc
# risers: into the drop and into the hit
def riser(d, peak): n = int(d * SR); return hp(noise(d), 0.3) * (np.arange(n) / n) ** 2.4 * peak
put(riser(BEAT * 1.5, 0.09), DROP - BEAT * 1.5, 1, 0, 'd'); put(riser(BEAT, 0.11), HIT - BEAT, 1, 0, 'd')
# switch flips on: bell chime pair + tiny tick
put(bell(88), FLIP, 0.12, 0.2); put(bell(95), FLIP + 0.07, 0.06, -0.2)
put(hp(noise(0.02), 0.5) * np.exp(-tt(0.02) * 300), FLIP, 0.10, 0, 'd')
# end hit with the lockup: E major chord, sub, soft cymbal, sparkle; long tail
root, notes = CH['E']
put(KK, HIT, 0.7, 0, 'd'); put(hp(noise(2.4), 0.6) * np.exp(-tt(2.4) * 1.8), HIT, 0.05, 0, 'd')
put(chord(notes + [76], 2.6, 1.1), HIT, 0.42, 0)
put(bass(root + 12, 1.8), HIT, 0.34); put(bass(root, 1.8), HIT, 0.16)
for i, m in enumerate([83, 88, 92, 95]): put(marimba(m, 0.6), HIT + 0.09 * i, 0.06, -0.3 + 0.2 * i)
# room
n = int(1.6 * SR); ir_t = np.arange(n) / SR
irl = lp(rng.standard_normal(n), 0.25) * np.exp(-ir_t / 0.38); irr = lp(rng.standard_normal(n), 0.25) * np.exp(-ir_t / 0.38)
irl /= np.sqrt((irl ** 2).sum()); irr /= np.sqrt((irr ** 2).sum())
wl = fftconvolve(BUS['tl'], irl)[:N]; wr = fftconvolve(BUS['tr'], irr)[:N]
ML[:] = BUS['tl'] + 0.32 * wl + BUS['dl']; MR[:] = BUS['tr'] + 0.32 * wr + BUS['dr']
pk = max(np.abs(ML).max(), np.abs(MR).max(), 1e-9); ML /= pk; MR /= pk
FADE_IN, FADE_OUT, KIT_STINGERS, MUSIC_GAIN = 0.01, 0.9, False, 0.55
