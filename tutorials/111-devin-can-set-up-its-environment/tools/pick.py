"""Curate ~/cap111/raw into shots/: picked frames renumbered, beats.json meta carried over, faithful crops where noted, blank #FCFCFC placeholders for diagram scenes.
usage: python3 tools/pick.py [raw-dir]"""
import json, os, subprocess, sys
RAW = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser('~/cap111/raw')
VD = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); OUT = os.path.join(VD, 'shots')
CROP = {'left': 'crop=3140:1766:1180:335,scale=4320:2430:flags=lanczos', 'top': 'crop=3840:2160:240:270,scale=4320:2430:flags=lanczos'}
PICK = [('blank', 'fresh'), ('blank', 'flow'), ('0041', 'left'), '0050', '0077', ('blank', 'parts'), '0078', '0079', '0098', '0103',
        '0104', '0115', '0125', '0135', '0145', ('0336', 'top'), '0350', '0365', '0366', '0372', '0378', '0383', '0429', '0448']
raw = {b['img']: b for b in json.load(open(os.path.join(RAW, 'beats.json')))}
beats, src = [], {}
for i, p in enumerate(PICK):
    name = '%04d.png' % i; dst = os.path.join(OUT, name)
    r, how = (p, None) if isinstance(p, str) else p
    if r == 'blank':
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', 'color=c=0xFCFCFC:s=4320x2430', '-frames:v', '1', dst], check=True)
        beats.append({'img': name, 'cur': {'x': 1250, 'y': 700}, 'hold': 1.2}); src[name] = {'scene': how, 'source': 'diagram placeholder (blank #FCFCFC), drawn by scenes.js'}
        continue
    b = {k: v for k, v in raw[r + '.png'].items() if k != 'name'}; b['img'] = name
    if how:
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(RAW, r + '.png'), '-vf', CROP[how], dst], check=True); b['cursor'] = False
    else:
        subprocess.run(['cp', os.path.join(RAW, r + '.png'), dst], check=True)
    beats.append(b); src[name] = {'raw': r + '.png', 'capture': raw[r + '.png'].get('name'), **({'crop': CROP[how]} if how else {})}
json.dump(beats, open(os.path.join(OUT, 'beats.json'), 'w'), indent=1)
json.dump(src, open(os.path.join(OUT, '_picked.json'), 'w'), indent=1)
print(len(beats), 'shots')
