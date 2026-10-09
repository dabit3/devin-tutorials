# 3. Indie stomp-pop, 117 BPM, C major (C  G/B  Am  F): stomp kick, big claps on 2 and 4, tambourine,
# driving 8th-note piano chords and a glockenspiel top line.
grid(60 * 18 / (HIT - DROP))
CH = [[60, 64, 67, 72], [59, 62, 67, 71], [57, 60, 64, 69], [57, 60, 65, 69]]
BS = [36, 35, 33, 29]
MEL = [[79, 76, 79, 81], [79, 74, 76, 74], [76, 72, 76, 79], [77, 76, 74, 72]]
n0 = nb(DROP)
def ci(n): return ((n + 16) // 4) % 4
for n in range(nb(0.3), n0):                                    # intro: piano chords on the beat, building
    t = at(n); p = (t - 0.3) / (DROP - 0.3)
    for k, m in enumerate(CH[ci(n)]): put(piano(m, 0.7, 0.8), t + 0.008 * k, 0.05 + 0.06 * p)
    if (n + 16) % 4 == 0: put(piano(BS[ci(n)] + 12, 1.2), t, 0.12)
put(riser(2 * BEAT, 0.16), DROP - 2 * BEAT, 1, 0, 'd')
for k in range(2): put(clap(), at(n0 - 1) + k * BEAT / 2, 0.14 + 0.06 * k, 0, 'd')
put(crash(2.0), DROP, 0.08, 0, 'd')
for n in range(n0, 0):
    t = at(n); q = (n + 16) % 4; ch = CH[ci(n)]
    if n == -1: put(riser(BEAT, 0.14), t, 1, 0, 'd'); put(piano(BS[ci(n)] + 12, 1.0), t, 0.15); continue
    if q in (0, 2): put(kick(0.45, 52, 90, 9, 2.0), t, 0.7, 0, 'd'); put(tom(85, 0.35), t, 0.12, 0, 'd'); duck(t, 0.3)
    if q in (1, 3): put(clap(0.4, 10), t, 0.36, 0, 'd'); put(snare(0.3, 180, 12), t, 0.14, 0, 'd')
    for h in range(2): put(tamb(), t + h * BEAT / 2, 0.05 if h else 0.035, 0.3, 'd')
    for h in range(2):
        for k, m in enumerate(ch): put(piano(m, 0.45, 1.2), t + h * BEAT / 2 + 0.006 * k, 0.085 if h == 0 else 0.06, -0.1)
    put(piano(BS[ci(n)], 0.6) + 0.6 * piano(BS[ci(n)] + 12, 0.6), t, 0.22)
    put(sub(BS[ci(n)], BEAT * 0.9), t, 0.18)
    if n >= -16: put(glock(MEL[ci(n)][q] + 12, 0.8), t, 0.07, 0.25)
for t in (at(nb(FLIP)), at(nb(CARD))): put(crash(1.8), t, 0.06, 0, 'd')
lockup_hit([48, 55, 60, 64, 67], 36)
finish(0.2, 0.42)
