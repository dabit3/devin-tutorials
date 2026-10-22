"""Finds the newest user bubble (light grey box) in a call still and prints a cam entry (1440x810 frame coords) that frames it."""
import sys, json
from PIL import Image
import numpy as np
for f in sys.argv[1:]:
    im = np.asarray(Image.open(f'shots/{f}.png').convert('RGB').resize((1440, 810)), dtype=int)
    g = (im[:, :, 0] >= 234) & (im[:, :, 0] <= 250) & (abs(im[:, :, 0] - im[:, :, 1]) <= 3) & (abs(im[:, :, 2] - im[:, :, 1]) <= 4)
    g[:, :250] = False; g[:, 1200:] = False; g[630:, :] = False; g[:35, :] = False
    rows = np.where(g.sum(1) > 120)[0]
    if len(rows) == 0: print(f, 'no bubble'); continue
    # newest bubble = lowest contiguous row block
    blocks, s = [], rows[0]
    for a, b in zip(rows, rows[1:]):
        if b - a > 3: blocks.append((s, a)); s = b
    blocks.append((s, rows[-1])); blocks = [b for b in blocks if b[1] - b[0] >= 18] or blocks; y0, y1 = blocks[-1]
    cols = np.where(g[y0:y1 + 1].sum(0) > (y1 - y0) * 0.5)[0]; x0, x1 = cols[0], cols[-1]
    w, h = x1 - x0, y1 - y0
    z = round(min(2.0, 0.78 * 1440 / max(w, 300), 0.6 * 810 / max(h, 120)), 2)
    print(f, 'box', [int(x0), int(y0), int(w), int(h)], 'cam', json.dumps({'x': int((x0 + x1) / 2), 'y': int((y0 + y1) / 2), 'z': z}))
