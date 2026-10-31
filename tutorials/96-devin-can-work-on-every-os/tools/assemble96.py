#!/usr/bin/env python3
"""Copy the picked live captures (~/cap96, made with capture.mjs) into shots/ and write shots/beats.json.
Scene beats get a blank placeholder PNG, as the kit requires."""
import json, os, shutil, subprocess, sys
CAP = os.path.expanduser(os.environ.get('CAP', '~/cap96'))
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'shots')
PICKS = [  # (shot, scene or (capture dir, source frame))
    ('0000.png', 'idea'),
    *[(f'00{10 + i}.png', ('shots-windows', f'{i:04d}.png')) for i in range(8)],  # platform picker -> Windows
    ('0020.png', 'fanout'),
    ('0030.png', ('shots-windows', '0008.png')),  # the request, pasted
    ('0031.png', ('shots-windows', '0009.png')),  # hover Send
    ('0032.png', ('peek-windows', '0000.png')),   # Windows session at work
    ('0040.png', ('res-ubuntu', '0000.png')),
    ('0041.png', ('res-ubuntu', '0001.png')),
    ('0050.png', ('res-macos', '0000.png')),
    ('0051.png', ('res-macos', '0001.png')),
    ('0055.png', ('res-windows', '0000.png')),
    ('0056.png', ('res-windows', '0001.png')),
    ('0060.png', 'results'),
    ('0070.png', 'usecases'),
]
os.makedirs(OUT, exist_ok=True)
for f in os.listdir(OUT):
    if f.endswith('.png'): os.remove(os.path.join(OUT, f))
blank = os.path.join(OUT, '_blank.png')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', 'color=c=0xfafafa:s=4320x2430', '-frames:v', '1', blank], check=True)
src_beats, beats = {}, []
for img, src in PICKS:
    if isinstance(src, str):
        shutil.copy(blank, os.path.join(OUT, img)); beats.append({'img': img, 'cur': {'x': 1300, 'y': 760}, 'scene': src}); continue
    d, f = src
    if d not in src_beats: src_beats[d] = {b['img']: b for b in json.load(open(os.path.join(CAP, d, 'beats.json')))}
    shutil.copy(os.path.join(CAP, d, f), os.path.join(OUT, img))
    beats.append({**src_beats[d][f], 'img': img, 'src': f'{d}/{f}'})
os.remove(blank)
json.dump(beats, open(os.path.join(OUT, 'beats.json'), 'w'), indent=1)
print(len(beats), 'beats')
