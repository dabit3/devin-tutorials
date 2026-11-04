"""Whites out the repo-maintenance warning banner (orange left bar + text) that the session showed in the chat during call 1.
Only pixels inside the banner block change; the stills stay time-locked to the call audio. Originals go to shots/orig/."""
import os, shutil, sys
from PIL import Image
D = os.path.dirname(os.path.abspath(__file__)); S = os.path.join(D, 'shots'); O = os.path.join(S, 'orig'); os.makedirs(O, exist_ok=True)
a, b = int(sys.argv[1]), int(sys.argv[2])
for n in range(a, b + 1):
    f = f'{n:04d}.png'; p = os.path.join(S, f)
    if not os.path.exists(p): continue
    im = Image.open(p).convert('RGB'); W, H = im.size; k = W / 1568
    px = im.load(); X = [int(x * k) for x in range(318, 326)]
    rows = [y for y in range(0, int(720 * k)) if any((lambda c: c[0] > 200 and 90 < c[1] < 200 and c[2] < 90)(px[x, y]) for x in X)]
    if not rows: continue
    spans, s0, prev = [], rows[0], rows[0]
    for y in rows[1:]:
        if y - prev > 6: spans.append((s0, prev)); s0 = y
        prev = y
    spans.append((s0, prev))
    spans = [(t, u) for t, u in spans if u - t > 20 * k]
    if not spans: continue
    if not os.path.exists(os.path.join(O, f)): shutil.copy(p, os.path.join(O, f))
    for t, u in spans:
        im.paste(px[int(150 * k), t], (int(312 * k), max(0, t - int(6 * k)), int(1262 * k), min(H, u + int(8 * k))))
    im.save(p, optimize=False)
    print(f, [(round(t / k), round(u / k)) for t, u in spans])
