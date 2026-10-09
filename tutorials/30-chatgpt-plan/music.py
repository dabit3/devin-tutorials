# Tutorial 30 music: bright 120 BPM house-pop cut to the edit. Runs inside _kit/tools/audio.py (refills ML/MR).
# Filtered pad + plucks in the intro, a snap on the title toggle, drums drop as the UI lands, a one-beat break
# and a final chord hit on the end card. All synthesized.
from scipy.signal import fftconvolve
BPM = 120; BEAT = 60 / BPM; BAR = 4 * BEAT; S16 = BEAT / 4
DROP = T(cue['intro'])                                         # UI window lands
END = T(cue['uiEnd'])
HIT = DROP + np.ceil((END + 0.95 - DROP) / BEAT - 1e-6) * BEAT        # end-card logo (scenes.js computes the same)
SNAP = DROP - 5 * BEAT                                         # title toggle switches on
CH = [[62, 66, 69, 73], [61, 64, 69, 76], [59, 62, 66, 69], [55, 62, 66, 71]]   # Dmaj7  A/C#  Bm  G
BS = [38, 37, 35, 31]
PL = {k: np.zeros(N) for k in ('pl', 'pr', 'dl', 'dr')}
def put(sig, t0, gain, pan=0.0, bus='p'):
    i = int(round(t0 * SR)); s = sig * gain
    if i < 0: s = s[-i:]; i = 0
    j = min(N, i + len(s))
    if j <= i: return
    PL[bus + 'l'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 - pan)); PL[bus + 'r'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 + pan))
def saw(f, d): return osc(f, d, 'saw')
def hp(x, a): return x - lp(x, a)
def kick():
    n = int(0.32 * SR); t = np.arange(n) / SR
    f = 46 + 110 * np.exp(-t * 32)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) + hp(noise(0.32), 0.5) * np.exp(-t * 300) * 0.3
def clap(d=0.22):
    x = hp(lp(noise(d), 0.45), 0.08); e = np.zeros(len(x)); idx = np.arange(len(x))
    for o, dd in ((0, 0.012), (0.01, 0.012), (0.02, 0.14)): e += env(len(x), 0.0005, dd, 4) * (idx >= o * SR)
    return x * e
def hat(d): x = hp(noise(d), 0.6); return x * env(len(x), 0.0005, d * 0.5, 5)
def pluck(notes, d=0.5, bright=1.0):
    n = int(d * SR)
    body = sum(lp(saw(mtof(m), d), 0.18) for m in notes) * env(n, 0.003, d * 0.7, 4)
    top = sum(saw(mtof(m), d) for m in notes) * env(n, 0.002, 0.07, 4) * 0.35 * bright
    return (body + top) / len(notes)
def pad(notes, d, cut=0.05):
    n = int(d * SR); e = np.minimum(1, np.arange(n) / (0.25 * SR)) * np.minimum(1, (n - np.arange(n)) / (0.4 * SR))
    return sum(lp(saw(mtof(m) * (1 + dt), d), cut) for m in notes for dt in (-0.0012, 0.0012)) * e / len(notes)
def bass(m, d): n = int(d * SR); return (np.sin(2 * np.pi * mtof(m) * np.arange(n) / SR) + 0.35 * lp(saw(mtof(m), d), 0.1)) * env(n, 0.004, d * 0.8, 3)

K, CL, HC, HO = kick(), clap(), hat(0.04), hat(0.16)
sc = np.ones(N)                                                # sidechain from the kick
kicks = []
b0 = int(np.floor(-DROP / BAR)) - 1
for b in range(b0, int((HIT - DROP) / BAR) + 2):
    tb = DROP + b * BAR; ch = CH[b % 4]
    if tb > HIT: break
    pre = tb < DROP
    put(pad([m + 12 for m in ch], BAR + 0.5, 0.035 if pre else 0.06), tb, 0.10 if pre else 0.12, 0, 'p')
    for k in range(16):                                        # 16th arp
        t = tb + k * S16
        if t >= HIT - BEAT or (pre and t < 0.15): continue
        m = ch[(k * 3) % 4] + 24
        put(osc(mtof(m), 0.3, 'tri') * env(int(0.3 * SR), 0.002, 0.12, 4), t, (0.035 if pre else 0.05) * (1.2 if k % 4 == 0 else 1), 0.4 if k % 2 else -0.4, 'p')
    if pre: continue
    for k in range(4):
        t = tb + k * BEAT
        if t >= HIT - BEAT: continue
        kicks.append(t); put(K, t, 0.55, 0, 'd')
        put(HO, t + BEAT / 2, 0.07, 0.2, 'd')
        put(bass(BS[b % 4], BEAT * 0.45), t + BEAT / 2, 0.30, 0, 'p')
        put(pluck([m + 12 for m in ch[:3]], 0.35), t + BEAT * 0.75, 0.13, -0.15 if k % 2 else 0.15, 'p')
        if k % 2: put(CL, t, 0.22, 0.05, 'd')
        for h in (1, 3): put(HC, t + h * S16, 0.035, -0.25, 'd')
for t in kicks:
    i = int(t * SR); j = min(N, i + int(0.4 * SR)); x = np.arange(j - i) / SR
    sc[i:j] = np.minimum(sc[i:j], 1 - 0.6 * np.exp(-x / 0.09))
PL['pl'] *= sc; PL['pr'] *= sc

# title toggle snap: bright chord pluck + soft low thump
put(pluck([74, 78, 81, 85], 0.9, 1.5), SNAP, 0.30, 0, 'p')
put(np.sin(2 * np.pi * 70 * np.arange(int(0.3 * SR)) / SR) * env(int(0.3 * SR), 0.002, 0.12, 4), SNAP, 0.35, 0, 'd')
# risers into the drop and into the end-card hit
def riser(d, peak):
    n = int(d * SR); r = (np.arange(n) / n) ** 2.2
    return hp(noise(d), 0.35) * r * peak
put(riser(1.0, 0.10), DROP - 1.0, 1, 0, 'd'); put(riser(BEAT, 0.12), HIT - BEAT, 1, 0, 'd')
# drop: soft crash
put(hp(noise(1.6), 0.55) * env(int(1.6 * SR), 0.001, 0.7, 4), DROP, 0.07, 0, 'd')
# end-card hit: kick, wide chord, sparkle, long tail
put(K, HIT, 0.6, 0, 'd'); put(hp(noise(2.0), 0.55) * env(int(2.0 * SR), 0.001, 0.9, 4), HIT, 0.08, 0, 'd')
put(pad([62, 69, 74, 78, 81], 3.0, 0.08) * np.exp(-np.arange(int(3.0 * SR)) / SR * 1.2), HIT, 0.30, 0, 'p')
put(bass(26, 1.6), HIT, 0.32, 0, 'p')
for i, m in enumerate([86, 90, 93, 98]):
    put(osc(mtof(m), 1.4, 'tri') * env(int(1.4 * SR), 0.002, 0.6, 4), HIT + 0.06 * i, 0.05, -0.3 + 0.2 * i, 'p')

# room: short synthetic reverb on the tonal bus
n = int(1.4 * SR); ir_t = np.arange(n) / SR
irl = lp(rng.standard_normal(n), 0.3) * np.exp(-ir_t / 0.32); irr = lp(rng.standard_normal(n), 0.3) * np.exp(-ir_t / 0.32)
irl /= np.sqrt((irl ** 2).sum()); irr /= np.sqrt((irr ** 2).sum())
wl = fftconvolve(PL['pl'], irl)[:N]; wr = fftconvolve(PL['pr'], irr)[:N]
ML[:] = PL['pl'] + 0.28 * wl + PL['dl']; MR[:] = PL['pr'] + 0.28 * wr + PL['dr']
pk = max(np.abs(ML).max(), np.abs(MR).max(), 1e-9); ML /= pk; MR /= pk
FADE_IN, FADE_OUT, KIT_STINGERS, MUSIC_GAIN = 0.02, 0.6, False, 0.55
