# 5. Cinematic pulse, 111 BPM, F major (Dm  Bb  F  C): staccato string ostinato, toms, backbeat,
# warm brass-like swells and an impact as the window lands. Keynote energy, kept light.
grid(60 * 17 / (HIT - DROP))
CH = [[50, 57, 62, 65], [46, 53, 58, 62], [53, 57, 60, 65], [48, 55, 60, 64]]
BS = [38, 34, 41, 36]
n0 = nb(DROP)
def ci(n): return ((n + 16) // 4) % 4
def ost(ch, d=0.14): t = tt(d); return filt(supersaw(ch, d, 3, 0.006), 3200) * np.minimum(1, t / 0.004) * np.exp(-t * 22)
for s in range((n0 - 7) * 4, n0 * 4, 2):                        # intro: 8th-note strings fading up, low drone
    t = HIT + s * S16; p = (t - 0.3) / (DROP - 0.3)
    if t >= 0.3: put(ost([m + 12 for m in CH[0][:3]]), t, 0.04 + 0.08 * p, 0.2 if s % 4 else -0.2)
put(sweep(pad([38, 45, 50], DROP, 9000, 0.8, 0.1), 200, 1500), 0.0, 0.28)
for k in range(3): put(tom(95 - 12 * k), at(n0 - 1) + k * BEAT / 3, 0.18, 0.2 - 0.2 * k, 'd')
put(riser(2 * BEAT, 0.15), DROP - 2 * BEAT, 1, 0, 'd')
put(boom(1.8), DROP, 0.5, 0, 'd'); put(crash(2.4), DROP, 0.10, 0, 'd'); put(tom(70, 0.8), DROP, 0.25, 0, 'd')
for n in range(n0 + 1, 0):
    t = at(n); q = (n + 16) % 4; ch = CH[ci(n)]
    if q == 0: put(pad([m + 12 for m in ch], BAR + 0.3, 1300, 0.25, 0.3, 6), t, 0.22); put(piano(ch[-1] + 24, 1.6), t, 0.08, 0.2)
    if n == -1: put(riser(BEAT, 0.16), t, 1, 0, 'd'); continue
    for s in range(4): put(ost([m + 12 for m in (ch[0], ch[1], ch[3])[s % 3:s % 3 + 1]] + [ch[0] + 12], 0.12), t + s * S16, 0.12 if s == 0 else 0.08, 0.25 if s % 2 else -0.25)
    if q == 0 or (q == 1 and n % 8 == 5) or q == 2: put(kick(0.4, 48, 120), t + (BEAT * 0.75 if q == 1 else 0), 0.6, 0, 'd'); duck(t, 0.3)
    if q in (1, 3): put(snare(0.35, 180, 10), t, 0.30, 0, 'd'); put(clap(), t, 0.12, 0, 'd')
    put(hat(0.04), t + BEAT / 2, 0.045, 0.3, 'd')
    put(bass(BS[ci(n)] - 12, BEAT * 0.9, 500), t, 0.32)
    if n >= -5 and n <= -2: put(tom(120 - 15 * (n + 5)), t + BEAT / 2, 0.16, 0.3 - 0.2 * (n + 5), 'd')
for t in (at(nb(FLIP)), at(nb(CARD))): put(crash(2.0), t, 0.07, 0, 'd')
lockup_hit([53, 57, 60, 65, 69], 29)
finish(0.28, 0.55)
