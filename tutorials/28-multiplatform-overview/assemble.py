# Builds shots/ from the capture takes (shots-win, shots-android) and tutorial 18, plus placeholder beats for the scene diagrams.
#   python3 assemble.py        (rewrites shots/ and prints the new name of every source beat)
import json, os, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = {'win': 'shots-win', 'and': 'shots-android', 'mac': '../18-ios-ipad-mac-vms/shots'}
ORDER = [
    ('scene', 'idea'),
    ('win', '0003.png'), ('win', '0006.png'),
    ('scene', 'flow'),
    ('win', 'WIN_APP'), ('mac', '0136.png'), ('and', 'AND_APP'),
    ('scene', 'platforms'),
    ('scene', 'usecases'),
    ('win', 'WIN_END'),
]
PICK = json.load(open(os.path.join(HERE, 'picks.json'))) if os.path.exists(os.path.join(HERE, 'picks.json')) else {}
out = os.path.join(HERE, 'shots'); shutil.rmtree(out, ignore_errors=True); os.makedirs(out)
beats, names = [], {}
for i, (src, img) in enumerate(ORDER):
    img = PICK.get(img, img); new = f'{i:04d}.png'
    if src == 'scene':
        shutil.copy(os.path.join(HERE, SRC['win'], '0000.png'), os.path.join(out, new)); beats.append({'img': new, 'cur': {'x': 1300, 'y': 760}, 'scene': img})
    else:
        d = os.path.join(HERE, SRC[src]); b = next(x for x in json.load(open(os.path.join(d, 'beats.json'))) if x['img'] == img)
        shutil.copy(os.path.join(d, img), os.path.join(out, new)); b = {**b, 'img': new, 'src': f'{src}/{img}'}
        b.pop('kind', None) if b.get('kind') == 'poll' else None; beats.append(b)
    names[new] = f'{src}/{img}'
json.dump(beats, open(os.path.join(out, 'beats.json'), 'w'), indent=1)
for k, v in names.items(): print(k, v)
