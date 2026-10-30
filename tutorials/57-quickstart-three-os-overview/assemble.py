# Builds shots/ from tutorial 56's real capture plus blank placeholder beats for the scene diagrams.
#   python3 assemble.py        (rewrites shots/, shots/beats.json and shots/SOURCES.json)
import json, os, shutil
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = '56-quickstart-three-os'
SRC_DIR = os.path.join(HERE, '..', SRC, 'shots')
ORDER = [
    ('scene', 'idea'),
    ('56', '0003.png'), ('56', '0083.png'),
    ('scene', 'flow'),
    ('56', '0257.png'), ('56', '0302.png'), ('56', '0270.png'),
    ('scene', 'found'),
    ('56', '0438.png'), ('56', '0435.png'),
    ('scene', 'when'),
]
out = os.path.join(HERE, 'shots'); shutil.rmtree(out, ignore_errors=True); os.makedirs(out)
src_beats = {b['img']: b for b in json.load(open(os.path.join(SRC_DIR, 'beats.json')))}
beats, sources = [], {}
for i, (src, img) in enumerate(ORDER):
    new = f'{i:04d}.png'
    if src == 'scene':
        Image.new('RGB', (4320, 2430), '#FCFCFC').save(os.path.join(out, new))
        beats.append({'img': new, 'cur': {'x': 1300, 'y': 760}, 'scene': img})
    else:
        shutil.copy(os.path.join(SRC_DIR, img), os.path.join(out, new))
        b = {k: v for k, v in src_beats[img].items() if k not in ('kind', 'cap', 'mark', 'at', 'chars', 'clickAt')}
        beats.append({**b, 'img': new})
        sources[new] = f'{SRC}/shots/{img}'
json.dump(beats, open(os.path.join(out, 'beats.json'), 'w'), indent=1)
json.dump(sources, open(os.path.join(out, 'SOURCES.json'), 'w'), indent=1)
for k, v in sources.items(): print(k, v)
