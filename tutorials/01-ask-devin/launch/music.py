"""Generates the launch music bed + UI sfx (deterministic). 120 BPM, beat grid starts at T0.
usage: python3 music.py out.wav"""
import sys
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile

SR = 48000
DUR = 37.0
T0, BEAT = 0.42, 0.5
N = int(SR * DUR)
rng = np.random.default_rng(7)
mix = np.zeros((N, 2))
duck = np.ones(N)

def bt(b): return T0 + b * BEAT
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def add(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N or i + len(sig) <= 0: return
    j = max(0, -i); sig = sig[j:]; i += j
    sig = sig[:N - i]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    mix[i:i + len(sig), 0] += sig * gain * l * 1.414
    mix[i:i + len(sig), 1] += sig * gain * r * 1.414
def tt(d): return np.arange(int(d * SR)) / SR
def midi(n): return 440 * 2 ** ((n - 69) / 12)
def saw(f, t, ph=0.0): return 2 * ((f * t + ph) % 1) - 1

# ---- instruments
def kick():
    t = tt(.42); f = 48 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 7.5) + 0.25 * np.exp(-t * 120) * rng.standard_normal(len(t)) * 0.3
def clap():
    t = tt(.3); n = rng.standard_normal(len(t))
    env = sum(np.exp(-np.clip(t - d, 0, None) * 60) * (t >= d) for d in (0, .011, .022)) * 0.5 + np.exp(-t * 14) * 0.6
    return bp(n, 900, 4200) * env
def hat(d=.05, open_=False):
    t = tt(.25 if open_ else d); n = hp(rng.standard_normal(len(t)), 7000, 4)
    return n * np.exp(-t * (14 if open_ else 70))
def stab(notes, d=.22):
    t = tt(d); s = np.zeros(len(t))
    for n in notes:
        for det in (-0.12, 0, 0.12):
            s += saw(midi(n + det), t, rng.random())
    s = lp(s / (len(notes) * 3), 3200)
    return s * np.minimum(1, t / .004) * np.exp(-t * 9)
def pad(notes, d):
    t = tt(d); s = np.zeros(len(t))
    for n in notes:
        for det in (-0.08, 0.08):
            s += saw(midi(n + det), t, rng.random())
    s = lp(s / (len(notes) * 2), 1400)
    return s * np.minimum(1, t / .25) * np.minimum(1, (d - t) / .3)
def bass(n, d=.22):
    t = tt(d); f = midi(n)
    s = lp(saw(f, t) * .7 + np.sin(2 * np.pi * f * t) * .6, 900)
    return s * np.minimum(1, t / .003) * np.exp(-t * 6)
def pluck(n, d=.2):
    t = tt(d); f = midi(n)
    s = np.sin(2 * np.pi * f * t + 0.8 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 20))
    return s * np.exp(-t * 16)
def riser(d, f0=400, f1=7000):
    t = tt(d); n = rng.standard_normal(len(t)); out = np.zeros(len(t)); blk = 2400
    for k in range(0, len(t), blk):
        p = k / len(t); f = f0 * (f1 / f0) ** p
        out[k:k + blk] = bp(n[k:k + blk], f * .7, min(f * 1.4, 20000))
    return out * (t / d) ** 2
def impact():
    t = tt(2.4); s = np.sin(2 * np.pi * np.cumsum(40 + 80 * np.exp(-t * 18)) / SR) * np.exp(-t * 2.2)
    n = lp(rng.standard_normal(len(t)), 5000) * np.exp(-t * 4) * .35
    return s + n
def whoosh(d=.5):
    t = tt(d); n = rng.standard_normal(len(t)); out = np.zeros(len(t)); blk = 1200
    for k in range(0, len(t), blk):
        p = k / len(t); f = 600 + 3200 * np.sin(np.pi * p)
        out[k:k + blk] = bp(n[k:k + blk], f * .6, f * 1.5)
    return out * np.sin(np.pi * t / d) ** 2
def click():
    t = tt(.05); return hp(rng.standard_normal(len(t)), 2500) * np.exp(-t * 180) + np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 120) * .5

# A major: I V vi IV  (A, E, F#m, D)
CHORDS = [[57, 61, 64, 69], [56, 59, 64, 68], [57, 61, 66, 69], [57, 62, 66, 69]]
ROOTS = [45, 40, 42, 38]
K, C = kick(), clap()
END = 63                      # beat of the logo impact (31.92 s)
for b in range(-1, 72):
    t = bt(b); bar = (b // 4) % 4 if b >= 0 else 3
    groove = 0 <= b < END - 1
    if groove or (END <= b < END + 8 and b % 2 == 0):
        add(K, t, .95)
        i = int(t * SR); L = int(.28 * SR)
        if i < N: duck[i:i + L] = np.minimum(duck[i:i + L], 1 - .55 * np.exp(-np.arange(min(L, N - i)) / SR * 9))
    if groove and b % 2 == 1: add(C, t, .42)
    if groove and b >= 8:
        add(hat(), t + BEAT / 2, .26, .25)
        add(hat(.03), t + BEAT / 4, .10, -.25); add(hat(.03), t + 3 * BEAT / 4, .10, -.25)
        if b % 8 == 7: add(hat(open_=True), t + BEAT / 2, .18, .2)
    elif groove:
        add(hat(), t + BEAT / 2, .18, .2)
    if groove and b >= 8:
        add(bass(ROOTS[bar]), t + BEAT / 2, .5); add(bass(ROOTS[bar] + 12, .12), t + 3 * BEAT / 4, .22)
    if groove and b >= 0 and b % 4 in (0, 1, 2, 3):
        add(stab(CHORDS[bar]), t + (BEAT / 2 if b % 2 == 0 else 0), .20 if b >= 8 else .16, -.15)
    if groove and b >= 16:
        ch = CHORDS[bar] + [CHORDS[bar][1] + 12]
        for s in range(4):
            add(pluck(ch[(b * 4 + s) % len(ch)] + 12), t + s * BEAT / 4, .07, .35 * (1 if s % 2 else -1))
for bar in range(0, END // 4):
    add(pad(CHORDS[bar % 4], 4 * BEAT), bt(bar * 4), .16)

# words + transitions
for t in (0.42, 0.92): add(stab([57, 61, 64, 69, 76], .4), t, .28)
add(riser(.42, 300, 5000), 0.0, .18)
add(riser(1.8), bt(4.4), .12)                 # into first product shot
add(riser(1.0, 500, 9000), bt(END - 2), .22)  # into logo
add(impact(), bt(END), .7)
add(pad([57, 64, 69, 73, 76], 4.9), bt(END), .30)
add(stab([57, 61, 64, 69, 76], .5), bt(END), .3)
add(stab([57, 61, 64, 69, 76], .5), 33.42, .16)
for t in (3.25, 11.7, 15.8, 19.8, 23.85, 28.0, 31.45): add(whoosh(.6), t, .12)
for t in (6.0, 18.0, 22.0, 25.5): add(click(), t, .22)

# gentle global sidechain pump off the kick
mix *= (0.82 + 0.18 * duck)[:, None]
fade = np.ones(N); fs, fe = int(35.9 * SR), N
fade[fs:fe] = np.linspace(1, 0, fe - fs) ** 1.5
mix *= fade[:, None]
mix = hp(mix.T, 25).T
peak = np.max(np.abs(mix)); mix = mix / peak * 0.89
mix = np.tanh(mix * 1.15) / np.tanh(1.15) * 0.89
wavfile.write(sys.argv[1] if len(sys.argv) > 1 else 'music.wav', SR, (mix * 32767).astype(np.int16))
print('ok', DUR, 's')
