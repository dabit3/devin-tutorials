import json, os
# Generates sections.json from the clip timestamps in footage-manifest.md.
# Blank / "Loading screenshot..." Computer-pane stretches (blanks.json from blanks.py, plus MANUAL) are cut from every
# part except the cropped test-recording viewer. Frame-accurate OCR hits for loading text
# (loading.json from loading.py) are cut from every part, as are frames showing a word that must not appear on screen
# (words.json, ranges found with wordcheck.py on the source clips).
HERE = os.path.dirname(os.path.abspath(__file__))
BLANKS = json.load(open(os.path.join(HERE, "blanks.json")))
LOADING = json.load(open(os.path.join(HERE, "loading.json")))
WORDS = json.load(open(os.path.join(HERE, "words.json")))
MANUAL = {  # empty panes the pixel check can't see: Google start pages, loading spinners, unloaded PR images
    "04-expo-mobile-apps.mp4": [[27, 35.2], [94.5, 117]],
    "05-neon-breakout.mp4": [[23.5, 28.5]],
    "06-orbit-confetti.mp4": [[20.25, 24.5]],
    "09-devin-arcade.mp4": [[4.25, 8]],
}
NOT_BLANK = {  # pixel-check false positives: sparse but loaded panes
    "06-orbit-confetti.mp4": [[37.5, 38.25]],
    "07-architecture-map.mp4": [[57.75, 58.5]],
}
LPAD = 0.1  # OCR hits are frame-exact in the scan; pad for frame-rate resampling in the cut
CROP = [360, 321, 3120]
PROMPT = 5.0; CONV = 3.0; COMP = 3.0; ART = 2.0; ARTMAX = 12; ARCH = 2.0

def part(src, start, span, speed=1, clean=True, **kw):
    ranges = [[a - LPAD, b + LPAD] for a, b in LOADING.get(src, []) + WORDS.get(src, [])]
    if clean:
        ranges = ranges + [r for r in BLANKS.get(src, []) if r not in NOT_BLANK.get(src, [])] + MANUAL.get(src, [])
    skip = []
    for a, b in ranges:
        a, b = max(a, start), min(b, start + span)
        if b > a: skip.append([round(a, 3), round(b, 3)])
    skip.sort(); merged = []
    for a, b in skip:
        if merged and a <= merged[-1][1]: merged[-1][1] = max(merged[-1][1], b)
        else: merged.append([a, b])
    cut = sum(b - a for a, b in merged)
    p = {"src": src, "in": start, "dur": round((span - cut) / speed, 3)}
    if speed != 1: p["speed"] = speed
    if merged: p["skip"] = merged; p["span"] = span
    p.update(kw)
    return p

# name, title, prompt_start, conv, comp, viewer_open, viewer_close, art, summary, extra
S = [
 ("01-brewbot","Devin designing and testing three landing pages",0,7,19,46,75,76,105,{}),
 ("02-kanban-qa","Devin running exploratory QA on a Kanban app",1,7,23,51,80,81,130,{}),
 ("03-solar-system","Devin building and testing a 3D solar system",1,7,26,53,82,84,117,{}),
 ("04-expo-mobile-apps","Devin building and testing three Expo mobile apps",0,7,26,59,88,89,107,{"art":(89.5,5,1.25)}),
 ("05-neon-breakout","Devin building and playtesting a Breakout game",1,7,23,50,72,73,93,{}),
 ("06-orbit-confetti","Devin shipping a feature PR and testing it",1,7,19,47,76,77,95,{}),
 ("07-architecture-map","Devin mapping a codebase's architecture",0,7,None,None,None,19,86,{}),
 ("08-earthquake-globe","Devin building and testing an earthquake globe",0,7,26,53,82,84,121,{}),
 ("09-devin-arcade","Devin and three child sessions building an arcade",0,6,41,74,96,98,121,{"agents":(28,41)}),
 ("12-groovebox-16","Devin building and testing a drum machine",1,7,21,49,78,79,112,{}),
]
secs = []
for n, t, p, c, comp, vo, vc, a, s, x in S:
    src = n + ".mp4"
    parts = [part(src, p + 0.3, PROMPT)]
    end_conv = x.get("agents", (comp,))[0] if comp else a
    parts.append(part(src, c, end_conv - c, CONV))
    if "agents" in x:
        ag = x["agents"]; parts.append(part(src, ag[0], ag[1] - ag[0], 1.5))
    if comp is not None:
        parts.append(part(src, comp + 1, vo - comp - 1, COMP))
        parts.append(part(src, vo + 1.5, vc - vo - 1.5, clean=False, crop=CROP, tag=True))
        if "art" in x: parts.append(part(src, *x["art"]))
        else: parts.append(part(src, a + 0.5, min(s - a, ARTMAX * ART), ART))
    else:
        parts.append(part(src, a, s - a, ARCH))
    secs.append(dict(title=t, parts=parts))

ios = "11-native-ios.mp4"
secs.insert(0, dict(title="Devin building and testing a native iOS app", parts=[
    part(ios, 1.3, PROMPT),
    part(ios, 7, 26, 3),
    part(ios, 34, 27, 2),
    part(ios, 62.5, 27.5, clean=False, crop=CROP, tag=True),
    part(ios, 95, 7),
    part(ios, 104, 10.5, 1.5),
    part(ios, 118, 11, 2)]))

total = 8
for sec in secs:
    d = sum(q["dur"] for q in sec["parts"]) - 0.6 * (len(sec["parts"]) - 1); total += d
    print(f'{d:6.1f}  {sec["title"]}  ' + " ".join(str(q["dur"]) + ("*" if "skip" in q else "") for q in sec["parts"]))
print("total", round(total, 1))
spec = dict(output="121-conference-reel.mp4", open="", close="devin.ai",
            openDur=4, closeDur=4, testTag="Devin's test recording", sections=secs)
json.dump(spec, open(os.path.join(HERE, "sections.json"), "w"), indent=1)
