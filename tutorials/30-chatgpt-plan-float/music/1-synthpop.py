# 1. Bright synth-pop, 130 BPM, A major (A  E/G#  F#m  D): driving 8th-note bass, backbeat snare + clap,
# supersaw pad and a 16th pluck arp. The arp builds through the intro, the beat drops as the window lands.
grid(60 * 20 / (HIT - DROP))                                    # 5 bars from the window landing to the end lockup
CH = [[57, 61, 64, 69], [56, 59, 64, 68], [54, 57, 61, 66], [50, 54, 57, 62]]
BS = [33, 32, 30, 26]
n0 = nb(DROP)
put(sweep(pad([m + 12 for m in CH[0]], DROP + 0.3, 8000, 0.9, 0.25), 350, 3500), 0.0, 0.30)
for s in range((n0 - 8) * 4, n0 * 4):
    t = HIT + s * S16; p = (t - 0.4) / (DROP - 0.4)
    if t < 0.4: continue
    ch = CH[0] if s < (n0 - 4) * 4 else CH[3]
    put(pluck(ch[(s * 3) % 4] + 24, 0.3, 1500 + 3000 * p), t, 0.05 + 0.07 * p, 0.35 if s % 2 else -0.35)
put(riser(2 * BEAT, 0.2), DROP - 2 * BEAT, 1, 0, 'd')
for k in range(4): put(snare(0.2), at(n0 - 1) + k * S16, 0.05 + 0.04 * k, 0, 'd')
put(crash(1.8), DROP, 0.08, 0, 'd')
for n in range(n0, 0):
    t = at(n); i = n - n0; ch = CH[(i // 4) % 4]; bn = BS[(i // 4) % 4]; q = i % 4
    if q == 0: put(pad([m + 12 for m in ch], BAR + 0.25, 2600, 0.05, 0.3), t, 0.20)
    if n == -1: put(riser(BEAT, 0.16), t, 1, 0, 'd'); continue
    if q in (0, 2): put(kick(), t, 0.62, 0, 'd'); duck(t)
    if q == 1: put(kick(), t + BEAT / 2, 0.42, 0, 'd'); duck(t + BEAT / 2, 0.3)
    if q in (1, 3): put(snare(), t, 0.24, 0.05, 'd'); put(clap(), t, 0.22, -0.05, 'd')
    for h in range(2): put(hat(), t + h * BEAT / 2, 0.07 if h else 0.045, 0.25, 'd')
    for h in range(2): put(bass(bn + 12 * h, BEAT / 2 * 0.9, 900), t + h * BEAT / 2, 0.30)
    for s in range(4): put(pluck(ch[((i * 4 + s) * 3) % 4] + 24, 0.25, 4200), t + s * S16, 0.08 if s == 0 else 0.06, 0.35 if s % 2 else -0.35)
for t in (at(nb(FLIP)), at(nb(CARD))): put(crash(1.8), t, 0.06, 0, 'd')
lockup_hit([57, 61, 64, 69, 71], 33)
finish(0.22, 0.4)
