# Tutorial 30 variant 5 music: serious-but-upbeat 110 BPM pop-rock bed in E minor, cut to the beats in scenes.js (FILM_T).
# No bells or keys: a clean electric guitar (Karplus-Strong string, light drive, dotted-8th delay) picks an arpeggio
# over a muted 8th-note bass pulse while the pills drift in, a filtered noise rise follows the line, a full strum
# lands the toggle, then kick/snare/hats drive the UI and the split with offbeat guitar stabs, single guitar notes
# accent each switch and split row, and one ringing Em9 strum sits under the Devin logo. All synthesized.
from scipy.signal import fftconvolve, butter, sosfilt
BPM = 110; B = 60 / BPM; BAR = 4 * B; S16 = B / 4
SNAP, LAND, CARD, RING, SPLIT, SPLIT2, END = 4 * B, 10 * B, 13 * B, 14 * B, 17 * B, 18 * B, 23 * B
GTR = [[52, 59, 64, 66, 71], [48, 55, 59, 64, 67], [43, 50, 55, 59, 64], [42, 50, 57, 62, 66]]   # Em9  Cmaj7  G6  D/F#
BS = [28, 24, 31, 30]
BUS = {k: np.zeros(N) for k in ('gl', 'gr', 'pl', 'pr', 'dl', 'dr')}
def put(sig, t0, gain, pan=0.0, bus='p'):
    i = int(round(t0 * SR)); s = sig * gain
    if i < 0: s = s[-i:]; i = 0
    j = min(N, i + len(s))
    if j <= i: return
    BUS[bus + 'l'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 - pan)); BUS[bus + 'r'][i:j] += s[:j - i] * np.sqrt(0.5 * (1 + pan))
def hp(x, a): return x - lp(x, a)
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], 'bandpass', fs=SR, output='sos'), x)
def tt(d): return np.arange(int(d * SR)) / SR
def string(m, d, damp=0.9965, bright=0.55, mute=False):   # Karplus-Strong, generated at an integer period then resampled to pitch
    f = mtof(m); L = max(2, int(round(SR / f - 0.5))); P = L + 0.5; n = int(d * f * P) + L   # the 2-tap average adds half a sample: period L + 0.5
    y = np.zeros(n + L); y[:L] = lp(rng.standard_normal(L), bright) + np.linspace(1, -1, L) * 0.4
    g = (0.93 if mute else damp) * 0.5
    for i in range(L, n + L, L):
        seg = y[i - L:i]; prev = np.concatenate(([y[i - L - 1] if i > L else 0.0], seg[:-1]))
        blk = g * (seg + prev); y[i:i + L] = blk[:len(y[i:i + L])]
    out = np.interp(np.arange(int(d * SR)) * f * P / SR, np.arange(len(y)), y)
    return out * np.minimum(1, (d - tt(d)) / 0.04).clip(0)
def guitar(x, drive=1.4): x = np.tanh(drive * x) / np.tanh(drive); return lp(hp(x, 0.02), 0.28)
def strum(notes, d, gap=0.011, down=True, **kw):
    out = np.zeros(int((d + gap * len(notes)) * SR))
    for i, m in enumerate(notes if down else notes[::-1]):
        s = string(m, d, **kw); o = int(i * gap * SR); out[o:o + len(s)] += s * (0.85 + 0.15 * i / len(notes))
    return guitar(out / np.sqrt(len(notes)))
def note(m, d=0.9, **kw): return guitar(string(m, d, **kw))
def pad(notes, d):
    t = tt(d); e = np.minimum(1, t / 0.8) * np.minimum(1, (d - t) / 0.6).clip(0)
    return lp(sum(osc(mtof(m) * (1 + dt), d, 'saw') for m in notes for dt in (-0.003, 0.003)), 0.03) * e / len(notes)
def kick():
    t = tt(0.3); f = 48 + 120 * np.exp(-t * 38)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 11) + hp(noise(0.3), 0.6) * np.exp(-t * 350) * 0.3
def snare():
    t = tt(0.3); body = np.sin(2 * np.pi * 185 * t) * np.exp(-t * 28)
    return 0.55 * body + bp(noise(0.3), 1200, 9000) * np.exp(-t * 16)
def hat(d=0.05): t = tt(d); return bp(noise(d), 7000, 16000) * np.exp(-t * (90 if d < 0.1 else 18))
def bass(m, d):
    t = tt(d); x = np.sin(2 * np.pi * mtof(m) * t) + 0.5 * lp(osc(mtof(m), d, 'saw'), 0.06)
    return np.tanh(1.5 * x) * np.minimum(1, t / 0.004) * np.exp(-t * 7)

K, SN, HC, HO = kick(), snare(), hat(0.05), hat(0.3)
sc = np.ones(N); kicks = []
for b in range(int(np.ceil(END / BAR)) + 1):
    tb = b * BAR; ch = GTR[b % 4]; pre = tb < SNAP
    if tb >= END: break
    put(pad([m + 12 for m in ch[1:4]], BAR + 0.7), tb, 0.06 if pre else 0.08, 0, 'p')
    for k in range(8):                                           # muted 8th bass pulse
        t = tb + k * B / 2
        if t < END - 0.05: put(bass(BS[b % 4] + (12 if k % 2 and not pre else 0), B * 0.45), t, 0.22 if pre else 0.30, 0, 'p')
    if pre:
        for k, i in enumerate([0, 2, 3, 4, 2, 3, 1, 3]):           # clean picked arpeggio, intro only
            put(note(ch[i] + 12, 0.9, bright=0.4), tb + k * B / 2, 0.20, -0.3 if k % 2 else 0.3, 'g')
        continue
    for k in (1.5, 3.5):                                         # offbeat chord stabs
        t = tb + k * B
        if t < END - 0.1: put(strum([m + 12 for m in ch[1:5]], 0.32, 0.007, down=k == 1.5, bright=0.5), t, 0.22, 0.35 if k == 1.5 else -0.35, 'g')
    for k in range(16):                                          # muted scratches, very quiet
        t = tb + k * S16
        if k % 4 == 2 and t < END - 0.1: put(strum([m + 12 for m in ch[1:4]], 0.08, 0.004, mute=True, bright=0.7), t, 0.07, -0.15, 'g')
    for k in range(16):
        t = tb + k * S16
        if t >= END - 0.02: continue
        if k in (0, 6, 8, 10): kicks.append(t); put(K, t, 0.62, 0, 'd')
        if k in (4, 12): put(SN, t, 0.34, 0.05, 'd')
        if k % 2 == 0: put(HC, t, 0.05 if k % 4 else 0.035, 0.25, 'd')
        if k == 14: put(HO, t, 0.035, 0.25, 'd')
for t in kicks:
    i = int(t * SR); j = min(N, i + int(0.3 * SR)); x = np.arange(j - i) / SR
    sc[i:j] = np.minimum(sc[i:j], 1 - 0.4 * np.exp(-x / 0.09))
for k in ('pl', 'pr'): BUS[k] *= sc

# the line drawing: filtered noise rise into the snap
r = (tt(2 * B) / (2 * B)) ** 2.4
put(bp(noise(2 * B), 1500, 7000) * r, 2 * B, 0.07, 0, 'd')
# toggle snap: full strum + kick + soft crash
put(strum(GTR[0], 1.8, 0.012), SNAP - 0.012 * 2, 0.34, 0, 'g'); put(K, SNAP, 0.6, 0, 'd')
put(bp(noise(1.4), 4000, 15000) * np.exp(-tt(1.4) * 3.5), SNAP, 0.05, 0, 'd')
# single guitar notes on each switch and split row
for t0, m, g, pan in ((LAND, 83, 0.20, 0.25), (RING, 86, 0.16, -0.25), (SPLIT, 79, 0.16, 0.2), (SPLIT2, 76, 0.16, -0.2)):
    put(note(m, 1.2, bright=0.35), t0, g, pan, 'g')
# end: one ringing Em9 strum, low E, warm pad
put(K, END, 0.55, 0, 'd')
put(strum(GTR[0], 2.4, 0.016, damp=0.998), END - 0.016 * 2, 0.38, 0, 'g')
put(bass(28, 1.6) * np.exp(-tt(1.6) * 0.5), END, 0.34, 0, 'p')
put(pad([64, 71, 74, 78], 2.3) * np.exp(-tt(2.3) * 0.5), END, 0.10, 0, 'p')

# guitar delay (dotted 8th, darkening repeats) + a short room on guitar and pad
gl, gr = BUS['gl'].copy(), BUS['gr'].copy(); dly = int(0.75 * B * SR)
for i, fb in enumerate((0.32, 0.16, 0.08)):
    o = dly * (i + 1); src = lp(BUS['gr' if i % 2 == 0 else 'gl'], 0.25)
    (gl if i % 2 == 0 else gr)[o:] += fb * src[:N - o]
n = int(1.4 * SR); ir_t = np.arange(n) / SR
irl = lp(rng.standard_normal(n), 0.3) * np.exp(-ir_t / 0.3); irr = lp(rng.standard_normal(n), 0.3) * np.exp(-ir_t / 0.3)
irl /= np.sqrt((irl ** 2).sum()); irr /= np.sqrt((irr ** 2).sum())
wl = fftconvolve(gl + BUS['pl'], irl)[:N]; wr = fftconvolve(gr + BUS['pr'], irr)[:N]
ML[:] = gl + BUS['pl'] + 0.22 * wl + BUS['dl']; MR[:] = gr + BUS['pr'] + 0.22 * wr + BUS['dr']
pk = max(np.abs(ML).max(), np.abs(MR).max(), 1e-9); ML /= pk; MR /= pk
ML[:] = np.tanh(2.0 * ML) / np.tanh(2.0); MR[:] = np.tanh(2.0 * MR) / np.tanh(2.0)   # gentle soft clip keeps transient peaks under -1 dBFS after loudnorm
FADE_IN, FADE_OUT, KIT_STINGERS, MUSIC_GAIN = 0.02, 0.5, False, 0.55
