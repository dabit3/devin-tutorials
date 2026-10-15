#!/usr/bin/env python3
"""Repaint tofu in captured terminal shots.

The capture rendered U+23FA (the CLI's tool-call / goal-status dot) with no font that has it, so
xterm drew an empty box. term.html now maps it to U+25CF; this script fixes the shots already
captured: it finds hollow-box cells on the term.json grid and redraws them as JetBrains Mono's
U+25CF in the box's own color. Usage: python3 fix_glyphs.py [--dry]
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
SHOTS = os.path.join(HERE, 'shots')
DPR, FS = 3, 24
g = json.load(open(os.path.join(SHOTS, 'term.json')))
CW, CH, X0, Y0 = g['cw'] * DPR, g['ch'] * DPR, g['x'] * DPR, g['y'] * DPR
FONT = ImageFont.truetype(os.path.join(HERE, '..', '_kit', 'fonts', 'JetBrainsMono-VF.ttf'), FS * DPR)


def tofu(cell, bg):
    fg = np.abs(cell.astype(int) - bg).sum(2) > 90
    ys, xs = np.nonzero(fg)
    if len(xs) < 20: return None
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    w, h = x1 - x0 + 1, y1 - y0 + 1
    if not (0.55 * CW < w < 0.88 * CW and 0.45 * CH < h < 0.62 * CH): return None
    b = fg[y0:y1 + 1, x0:x1 + 1]
    edges = [b[:, :3].any(1).mean(), b[:, -3:].any(1).mean(), b[:3].any(0).mean(), b[-3:].any(0).mean()]
    inner = b[int(h * .25):int(h * .75), int(w * .3):int(w * .7)]
    if min(edges) < 0.95 or inner.mean() > 0.45: return None
    col = np.median(cell[ys, xs], axis=0).astype(int)
    return (x0 + x1) / 2, (y0 + y1) / 2, tuple(int(c) for c in col)


def fix(path, dry):
    im = Image.open(path).convert('RGB'); a = np.asarray(im)
    hits = []
    for r in range(g['rows']):
        for c in range(g['cols']):
            L, T = int(round(X0 + c * CW)), int(round(Y0 + r * CH))
            R, B = int(round(X0 + (c + 1) * CW)), int(round(Y0 + (r + 1) * CH))
            cell = a[T:B, L:R]
            bg = np.median(np.concatenate([cell[:3].reshape(-1, 3), cell[-3:].reshape(-1, 3)]), axis=0)
            t = tofu(cell, bg)
            if t: hits.append((L, T, R, B, tuple(int(v) for v in bg), t))
    if hits and not dry:
        d = ImageDraw.Draw(im)
        for L, T, R, B, bg, (cx, cy, col) in hits:
            d.rectangle([L, T, R - 1, B - 1], fill=bg)
            d.text((L + cx, T + cy), '\u25cf', font=FONT, fill=col, anchor='mm')
        im.save(path)
    return len(hits)


if __name__ == '__main__':
    dry = '--dry' in sys.argv
    beats = json.load(open(os.path.join(SHOTS, 'beats.json')))
    total = 0
    for b in beats:
        if b.get('scene') or b.get('ghostty'): continue
        n = fix(os.path.join(SHOTS, b['img']), dry)
        if n: print(b['img'], n)
        total += n
    print('cells', total)
