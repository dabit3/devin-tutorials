# Builds shots/ from tutorial 38's real proof shots plus blank placeholder beats for the scene diagrams.
#   python3 assemble.py        (rewrites shots/, shots/beats.json and shots/SOURCES.json)
import json, os, shutil
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = '38-ios-android-one-pr'
ORDER = [('scene', 'idea'), ('scene', 'flow1'), (SRC, '0035.png'), (SRC, '0099.png'), ('scene', 'flow2'),
         (SRC, '0192.png'), ('scene', 'flow3'), (SRC, '0264.png'), (SRC, '0266.png'), ('scene', 'usecases')]
out = os.path.join(HERE, 'shots'); shutil.rmtree(out, ignore_errors=True); os.makedirs(out)
src_beats = {b['img']: b for b in json.load(open(os.path.join(HERE, '..', SRC, 'shots', 'beats.json')))}
beats, sources = [], {}
for i, (src, img) in enumerate(ORDER):
    new = f'{i:04d}.png'
    if src == 'scene':
        Image.new('RGB', (4320, 2430), '#FCFCFC').save(os.path.join(out, new))
        beats.append({'img': new, 'cur': {'x': 1300, 'y': 760}, 'scene': img})
    else:
        shutil.copy(os.path.join(HERE, '..', src, 'shots', img), os.path.join(out, new))
        b = {k: v for k, v in src_beats[img].items() if k not in ('kind', 'src', 'mark', 'hlBox')}
        beats.append({**b, 'img': new}); sources[new] = {'tutorial': src, 'file': f'shots/{img}', 'raw': src_beats[img].get('src')}
json.dump(beats, open(os.path.join(out, 'beats.json'), 'w'), indent=1)
json.dump(sources, open(os.path.join(out, 'SOURCES.json'), 'w'), indent=1)
print(len(beats), 'beats;', len(sources), 'reused shots')
