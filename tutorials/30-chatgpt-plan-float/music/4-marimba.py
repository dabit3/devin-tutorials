# 4. Marimba pop, 104 BPM, D major (D  A/C#  Bm  G): a 3-3-2 marimba riff, light dembow-style drums,
# shaker 16ths, warm pad and sub bass. Sunny keynote feel.
grid(60 * 16 / (HIT - DROP))                                    # 4 bars from the window landing to the end lockup
CH = [[62, 66, 69, 74], [61, 64, 69, 73], [59, 62, 66, 71], [59, 62, 67, 71]]
BS = [38, 37, 35, 31]
RIFF = [(0, 3), (3, 2), (6, 1), (8, 3), (11, 2), (14, 1)]          # (16th, chord tone)
n0 = nb(DROP)
def ci(n): return ((n + 16) // 4) % 4
for n in range(nb(0.3) - 4, n0):                                # intro: the riff alone, then the shaker joins
    if (n + 16) % 4: continue
    t = at(n); p = max(0, (t - 0.3) / (DROP - 0.3))
    for s, k in RIFF:
        if t + s * S16 >= 0.3: put(marimba(CH[ci(n)][k] + 12), t + s * S16, 0.08 + 0.06 * p, 0.2 if s % 2 else -0.2)
    put(pad([m for m in CH[ci(n)]], BAR + 0.3, 1400, 0.4, 0.3), max(t, 0.1), 0.14)
for s in range(nb(DROP - BAR) * 4, n0 * 4): put(shaker(), HIT + s * S16, 0.025 + 0.02 * (s % 2), 0.3, 'd')
put(riser(BAR, 0.14), DROP - BAR, 1, 0, 'd')
put(crash(2.0), DROP, 0.07, 0, 'd')
for n in range(n0, 0, 4):
    t = at(n); ch = CH[ci(n)]; bn = BS[ci(n)]
    put(pad([m for m in ch], BAR + 0.3, 1800, 0.05, 0.3), t, 0.16)
    for s, k in RIFF:
        put(marimba(ch[k] + 12), t + s * S16, 0.15, 0.2 if s % 2 else -0.2)
        if s in (0, 8): put(marimba(ch[k] + 24, 0.4), t + s * S16, 0.05, 0.3)
    for s in range(16):
        ts = t + s * S16
        if n == -4 and s >= 12: continue                        # one-beat break before the lockup
        put(shaker(), ts, 0.03 + 0.02 * (s % 2), 0.3, 'd')
        if s in (0, 8): put(kick(0.4, 50, 110), ts, 0.62, 0, 'd'); duck(ts, 0.35)
        if s in (4, 12): put(clap(), ts, 0.22, 0, 'd')
        if s in (3, 6, 11, 14): put(snare(0.12, 330, 40), ts, 0.10, -0.1, 'd')
        if s in (0, 6, 8, 14): put(sub(bn, S16 * (6 if s in (0, 8) else 2) * 0.95), ts, 0.38)
put(riser(BEAT, 0.12), at(-1), 1, 0, 'd')
for t in (at(nb(FLIP)), at(nb(CARD))): put(crash(1.8), t, 0.05, 0, 'd')
lockup_hit([50, 57, 62, 66, 69], 38)
finish(0.24, 0.45)
