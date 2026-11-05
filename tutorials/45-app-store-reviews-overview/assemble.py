# Builds shots/ for the overview: diagram placeholders (scene beats) plus real shots reused from tutorial 44's
# shots/ (looked up by their raw capture frame), and writes shots/SOURCES.json (shot -> source tutorial and file).
#   python3 assemble.py            (OUT=<dir> writes somewhere other than shots/)
import json, os, shutil
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
T44 = '44-app-store-reviews'
S44 = os.path.join(HERE, '..', T44, 'shots')
B44 = {b['src']: b for b in json.load(open(os.path.join(S44, 'beats.json')))}
ORDER = [
    ('scene', 'flow0'), ('exp', '0024.png'),
    ('scene', 'flow1'), ('coord', '0026.png'),
    ('scene', 'flow2'), ('coord', '0040.png'), ('ios', '0004.png'), ('and', '0064.png'),
    ('scene', 'flow3'), ('pay', '0005.png'),
    ('scene', 'flow4'), ('ios', '0068.png'), ('and', '0257.png'),
    ('scene', 'uses'), ('pay', '0008.png'),
]
out = os.environ.get('OUT') or os.path.join(HERE, 'shots'); shutil.rmtree(out, ignore_errors=True); os.makedirs(out)
size = Image.open(os.path.join(S44, B44['coord/0000.png']['img'])).size
beats, sources = [], {}
for i, (src, img) in enumerate(ORDER):
    new = f'{i:04d}.png'
    if src == 'scene':
        Image.new('RGB', size, '#FCFCFC').save(os.path.join(out, new))
        beats.append({'img': new, 'cur': {'x': 1300, 'y': 760}, 'scene': img})
        sources[new] = {'scene': img, 'source': 'diagram drawn by scenes.js'}
    else:
        b = B44[f'{src}/{img}']
        shutil.copy(os.path.join(S44, b['img']), os.path.join(out, new))
        sources[new] = {'tutorial': T44, 'file': f"{T44}/shots/{b['img']}",
                        'source': f'real capture, thequantexplorer org, tutorial 44 (raw shots-{src}/{img})'}
        b = {k: v for k, v in b.items() if k not in ('kind', 'at', 'mark')}
        beats.append({**b, 'img': new, 'src': f'{src}/{img}'})
    print(new, sources[new])
json.dump(beats, open(os.path.join(out, 'beats.json'), 'w'), indent=1)
json.dump(sources, open(os.path.join(out, 'SOURCES.json'), 'w'), indent=1)
