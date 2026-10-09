# 2. Future-bass lite, 157 BPM half-time, F major (Bbmaj7  C  Am7  Dm7): pumping supersaw chords, a bright
# pluck hook, sub bass, kick + snare in half time. Soft piano chords and a filter swell in the intro.
grid(60 * 24 / (HIT - DROP))                                    # 6 half-time bars from the window landing to the end lockup
CH = [[58, 62, 65, 69], [60, 64, 67, 72], [57, 60, 64, 67], [62, 65, 69, 72]]
BS = [34, 36, 33, 38]
HOOK = [[77, 76, 72, 74], [76, 72, 69, 72], [72, 74, 76, 79], [77, 76, 74, 72]]
n0 = nb(DROP)
for b in range(2):                                              # intro: two bars, piano + swelling chord
    t = at(n0 - 8 + 4 * b); ch = CH[2 + b]
    put(sweep(pad([m + 12 for m in ch], BAR + 0.2, 9000, 0.4, 0.2), 400, 2600), t, 0.22)
    for q in range(4):
        for k, m in enumerate(ch): put(piano(m + 12, 0.9), t + q * BEAT + 0.01 * k, 0.05 + 0.02 * b)
    for q, m in enumerate(HOOK[2 + b][:3] if b else []): put(pluck(m, 0.4, 3000), t + q * BEAT, 0.07, 0.2)
put(riser(BAR, 0.2), DROP - BAR, 1, 0, 'd')
put(crash(2.0), DROP, 0.09, 0, 'd'); put(boom(1.2), DROP, 0.25, 0, 'd')
for n in range(n0, 0):
    t = at(n); i = n - n0; b = (i // 4) % 4; ch = CH[b]; q = i % 4
    if q == 0:
        put(pad([m + 12 for m in ch], BAR + 0.1, 3200, 0.02, 0.15, 6), t, 0.30)
        put(sub(BS[b], BAR * 0.98), t, 0.42)
    duck(t, 0.75, 0.16)
    if n == -1: put(riser(BEAT, 0.18), t, 1, 0, 'd'); continue
    if q == 0 or (q == 1 and b % 2): put(kick(0.45, 46, 150), t + (BEAT / 2 if q == 1 else 0), 0.65, 0, 'd')
    if q == 2: put(snare(0.35, 200, 11), t, 0.30, 0, 'd'); put(clap(), t, 0.26, 0, 'd')
    for h in range(2): put(hat(0.04), t + h * BEAT / 2, 0.05 if h else 0.035, -0.25, 'd')
    put(pluck(HOOK[b][q], 0.35, 4500, 8, 4), t, 0.11, 0.15)
    if q in (1, 3): put(pluck(HOOK[b][q] + 12, 0.25, 5000, 12), t + BEAT / 2, 0.04, -0.3)
for t in (at(nb(FLIP)), at(nb(CARD))): put(crash(1.8), t, 0.06, 0, 'd')
lockup_hit([53, 57, 60, 65, 67], 29)
finish(0.24, 0.5)
