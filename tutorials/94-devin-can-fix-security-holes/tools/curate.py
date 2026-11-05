#!/usr/bin/env python3
"""Pick the beats used in the cut from the raw live capture (raw/, not committed) into shots/."""
import json, os, shutil
D = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW, OUT = os.path.join(D, 'raw'), os.path.join(D, 'shots')
# (raw image, raw beat): a click beat shows the pre-click frame with the click beat's target
PICK = [0, 2, 0, (16, 17), 0, 62, 0, 103, (104, 105), 107, (107, 108), 0, 114, 130, 133]
raw = {b['img']: b for b in json.load(open(os.path.join(RAW, 'beats.json')))}
beats = []
for i, r in enumerate(PICK):
    im, bt = r if isinstance(r, tuple) else (r, r)
    src, dst = f'{im:04d}.png', f'{i:04d}.png'
    shutil.copyfile(os.path.join(RAW, src), os.path.join(OUT, dst))
    b = dict(raw[f'{bt:04d}.png']); b['img'] = dst; b['raw'] = src; b.pop('hold', None)
    if b.get('kind') != 'click': b.pop('target', None); b.pop('clickAt', None)
    b.setdefault('cur', {'x': 1250, 'y': 700})
    beats.append(b)
json.dump(beats, open(os.path.join(OUT, 'beats.json'), 'w'), indent=1)
print(len(beats))
