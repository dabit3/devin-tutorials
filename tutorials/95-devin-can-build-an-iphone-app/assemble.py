# Builds shots/ from the raw capture (capture.mjs output, kept outside the repo) plus placeholder beats for the scene diagrams.
#   RAW=~/raw95 python3 assemble.py   (rewrites shots/ and prints the source of every beat)
import json, os, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.expanduser(os.environ.get('RAW', '~/raw95'))
# (scene name) or (raw shot, keep kind?): polls and the open menu become plain stills
ORDER = [
    'title', 'model',
    ('0001.png', 1), ('0002.png', 1), ('0003.png', 0), ('0004.png', 1), ('0005.png', 1), ('0006.png', 0),
    ('0007.png', 0), ('0008.png', 1), ('0009.png', 1), ('0010.png', 1),
    'build',
    ('0025.png', 0), ('0031.png', 0), ('0035.png', 0), ('0037.png', 0),
    'evidence',
    ('0080.png', 0), ('0081.png', 1), ('0082.png', 1), ('0095.png', 0), ('0098.png', 0), ('0122.png', 0), ('0079.png', 0),
    'recap',
]
raw = {b['img']: b for b in json.load(open(os.path.join(RAW, 'beats.json')))}
out = os.path.join(HERE, 'shots'); keep = os.path.join(out, 'SOURCES.json')
src_json = open(keep).read() if os.path.exists(keep) else None
shutil.rmtree(out, ignore_errors=True); os.makedirs(out)
if src_json: open(keep, 'w').write(src_json)
beats = []
for i, o in enumerate(ORDER):
    new = f'{i:04d}.png'
    if isinstance(o, str):
        shutil.copy(os.path.join(RAW, '0000.png'), os.path.join(out, new))
        beats.append({'img': new, 'cur': {'x': 1300, 'y': 760}, 'cursor': False, 'hl': None})
        print(new, 'scene', o)
    else:
        img, kind = o; b = {**raw[img], 'img': new, 'src': img}
        if not kind: b.pop('kind', None)
        b.pop('cap', None)
        shutil.copy(os.path.join(RAW, img), os.path.join(out, new)); beats.append(b)
        print(new, img)
json.dump(beats, open(os.path.join(out, 'beats.json'), 'w'), indent=1)
