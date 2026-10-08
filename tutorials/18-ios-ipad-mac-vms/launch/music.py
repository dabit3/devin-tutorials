"""Generates music.wav: a 36 s, 120 BPM upbeat electronic track synced to the edit (one beat = 0.5 s).
Section hits land on 4.0, 8.0, 12.0, 17.0, 22.0, 28.0 and 31.5 s, matching the cuts in index.html."""
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
from scipy.io import wavfile

SR, DUR, BPM = 48000, 36.0, 120
B = 60 / BPM
N = int(SR * DUR)
rng = np.random.default_rng(7)
t_all = np.arange(N) / SR
L = np.zeros(N); R = np.zeros(N)

def add(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N: return
    sig = sig[: N - i]
    L[i:i + len(sig)] += sig * gain * (1 - max(0, pan))
    R[i:i + len(sig)] += sig * gain * (1 + min(0, pan))

def env(n, a=0.002, d=0.2, s=0.0, rel=0.05):
    t = np.arange(n) / SR
    e = np.minimum(1, t / a) * (s + (1 - s) * np.exp(-t / d))
    r = int(rel * SR)
    if r and r < n: e[-r:] *= np.linspace(1, 0, r)
    return e

def lp(x, f, order=2):
    return sosfilt(butter(order, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, order=2):
    return sosfilt(butter(order, f, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi):
    return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)

def saw(f, n, ph=0.0):
    t = np.arange(n) / SR
    return 2 * ((f * t + ph) % 1) - 1

def note(m): return 440 * 2 ** ((m - 69) / 12)

# --- drums ---
def kick():
    n = int(.42 * SR); t = np.arange(n) / SR
    f = 46 + 110 * np.exp(-t / .035)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.tanh(1.6 * np.sin(ph) * np.exp(-t / .16)) + 0.25 * rng.standard_normal(n) * np.exp(-t / .004)
def clap():
    n = int(.3 * SR); t = np.arange(n) / SR
    e = sum(np.exp(-np.maximum(0, t - o) / .008) * (t >= o) for o in (0, .011, .022)) * .5 + np.exp(-t / .09) * .6
    return bp(rng.standard_normal(n), 900, 5200) * e
def hat(open_=False):
    n = int((.22 if open_ else .05) * SR); t = np.arange(n) / SR
    return hp(rng.standard_normal(n), 7000) * np.exp(-t / (.07 if open_ else .012))
def impact():
    n = int(2.2 * SR); t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * np.cumsum(30 + 60 * np.exp(-t / .08)) / SR) * np.exp(-t / .7)
    crash = hp(rng.standard_normal(n), 3500) * np.exp(-t / .6) * .35
    return boom * .9 + crash
def riser(d):
    n = int(d * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n); out = np.zeros(n); seg = 2048
    for i in range(0, n, seg):
        f = 400 + 9000 * (i / n) ** 2
        out[i:i + seg] = bp(x[i:i + seg], f, min(f * 1.8, 20000))
    return out * (t / d) ** 2 * .5
def whoosh(d=.35):
    n = int(d * SR); t = np.arange(n) / SR
    return bp(rng.standard_normal(n), 1200, 6000) * np.sin(np.pi * t / d) ** 2 * .35

# --- harmony: C  G  Am  F  (one chord per bar of 4 beats) ---
prog = [(48, [60, 64, 67, 72]), (43, [59, 62, 67, 71]), (45, [60, 64, 69, 72]), (41, [60, 65, 69, 72])]
bar = 4 * B
def chord_at(t): return prog[int(t // bar) % 4]

def supersaw(freqs, n):
    x = np.zeros(n)
    for f in freqs:
        for k, dt in enumerate((-.12, -.06, 0, .06, .12)):
            x += saw(f * 2 ** (dt / 12), n, rng.random())
    return x / (len(freqs) * 5)

pad = np.zeros(N); lead = np.zeros(N); bass = np.zeros(N); drums = np.zeros(N)
DROP, END = 4.0, 34.0

def put(buf, sig, at, g=1.0):
    i = int(at * SR)
    if i >= N: return
    sig = sig[: N - i]; buf[i:i + len(sig)] += sig * g

# pads per bar
for b in range(int(DUR // bar) + 1):
    t0 = b * bar
    if t0 >= 35.5: break
    root, ch = chord_at(t0)
    n = int(min(bar, DUR - t0) * SR) if t0 < 32 else int((DUR - t0) * SR)
    sig = supersaw([note(m) for m in ch], n) * env(n, a=.03, d=9, s=.8, rel=.08)
    put(pad, sig, t0, .55 if t0 >= DROP else .3)

# pad filter opens over the intro
cut = np.where(t_all < DROP, 600 + 2600 * (t_all / DROP) ** 2, 3800)
pad = lp(pad, 3800) * 0.6 + lp(pad, 900) * 0.4 * (cut < 3800)

# plucky arpeggio, 16ths
for k in range(int(DUR / (B / 4))):
    t0 = k * B / 4
    if t0 >= END: break
    if 16.0 <= t0 < 17.0: continue
    root, ch = chord_at(t0)
    seq = ch + [ch[2] + 12, ch[1] + 12]
    m = seq[[0, 2, 1, 3, 2, 4, 3, 5][k % 8] % len(seq)] + 12
    n = int(.22 * SR)
    sq = np.sign(np.sin(2 * np.pi * note(m) * np.arange(n) / SR)) * .5 + saw(note(m) * 1.003, n) * .5
    g = .16 if t0 < DROP else .22
    if k % 4 == 0: g *= 1.25
    put(lead, lp(sq * env(n, d=.07), 5200), t0, g)

# rolling off-beat bass (8ths), sub on the downbeat
for k in range(int(DUR / (B / 2))):
    t0 = k * B / 2
    if t0 < DROP or t0 >= END or 16.0 <= t0 < 17.0: continue
    root, _ = chord_at(t0)
    n = int(.24 * SR); f = note(root - 12) if k % 2 == 0 else note(root)
    s = lp(saw(f, n) + .6 * np.sin(2 * np.pi * f / 2 * np.arange(n) / SR), 900) * env(n, a=.004, d=.12, s=.3, rel=.03)
    put(bass, s, t0, .55 if k % 2 else .4)

# drums
side = np.ones(N)
for k in range(int(DUR / B)):
    t0 = k * B
    if t0 < DROP or t0 >= END: continue
    if 16.0 <= t0 < 17.0: continue
    put(drums, kick(), t0, .95)
    i = int(t0 * SR); n = int(.28 * SR)
    side[i:i + n] = np.minimum(side[i:i + n], 1 - .55 * np.exp(-np.arange(min(n, N - i)) / SR / .09))
    if k % 2 == 1: put(drums, clap(), t0, .5)
for k in range(int(DUR / (B / 2))):
    t0 = k * B / 2
    if t0 >= END: continue
    if t0 < DROP and t0 < 2.0: continue
    if k % 2 == 1: put(drums, hat(open_=(t0 >= 8 and k % 8 == 7)), t0, .22)
for k in range(int(DUR / (B / 4))):
    t0 = k * B / 4
    if DROP <= t0 < END and k % 2 == 1 and not (16 <= t0 < 17): put(drums, hat(), t0, .08)
# snare build into the 17 s drop
for k in range(16):
    t0 = 16.0 + k * (1.0 / 16)
    put(drums, clap(), t0, .12 + .3 * k / 16)

fx = np.zeros(N)
put(fx, riser(2.0), 2.0, .6)
put(fx, riser(1.0), 16.0, .5)
put(fx, riser(1.0), 21.0, .35)
put(fx, riser(1.5), 30.0, .45)
for at in (4.0, 17.0, 22.0, 31.5):
    put(fx, impact(), at, .7)
for at in (6.0, 8.0, 12.0, 14.5, 28.0):
    put(fx, whoosh(), at - .2, 1.0)
# final chord rings out
root, ch = prog[0]
n = int(2.5 * SR)
put(pad, supersaw([note(m) for m in ch + [76]], n) * env(n, a=.01, d=1.2), 34.0, .7)
put(bass, np.sin(2 * np.pi * note(36) * np.arange(n) / SR) * env(n, d=.9), 34.0, .5)
put(drums, kick(), 34.0, 1.0)

def reverb(x, d=1.6, mix=.25):
    n = int(d * SR); ir = rng.standard_normal(n) * np.exp(-np.arange(n) / SR / (d / 5))
    ir = lp(ir, 6000); ir /= np.sqrt((ir ** 2).sum())
    return fftconvolve(x, ir)[: len(x)] * mix

music = (pad * side + bass * side) 
wetL = reverb(pad + lead, mix=.22); wetR = reverb(pad + lead, mix=.22)
L = music + lead * .9 + drums + fx + wetL + lead * .15
R = music + lead * .7 + drums + fx + wetR + np.roll(lead, int(.1875 * SR)) * .25
st = np.stack([L, R], 1)
fade = np.ones(N); fn = int(.6 * SR); fade[-fn:] = np.linspace(1, 0, fn) ** 2
st *= fade[:, None]
st = np.tanh(st * 1.2) / np.tanh(1.2)
st /= np.abs(st).max() / 0.89
wavfile.write('music.wav', SR, (st * 32767).astype(np.int16))
print('wrote music.wav', st.shape[0] / SR, 's')
