# Builds shots/ from the two capture takes: shots-ios (macOS session, iPhone Simulator) and shots-android (Ubuntu session, Android emulator).
#   python3 assemble.py        (rewrites shots/ and prints the source of every new beat)
import json, os, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = {'ios': 'shots-ios', 'and': 'shots-android'}
STILL = {'ios/0055.png', 'and/0063.png'}  # finished prompts, shown at once (too long to type on camera)
POLL = lambda a, b, step=1: [f'{i:04d}.png' for i in range(a, b + 1, step)]
ORDER = (
    [('ios', f) for f in ['0000.png', '0001.png', '0003.png', '0004.png', '0006.png', '0055.png', '0056.png', '0057.png']]
    + [('ios', f) for f in ['0058.png', '0059.png', '0060.png', '0061.png', '0063.png', '0064.png', '0066.png', '0067.png', '0068.png', '0069.png']]
    + [('and', f) for f in ['0001.png', '0003.png', '0004.png', '0006.png', '0063.png', '0064.png', '0065.png']]
    + [('and', f) for f in ['0066.png', '0074.png', '0082.png', '0086.png', '0094.png', '0102.png', '0110.png', '0114.png', '0118.png', '0122.png', '0130.png', '0134.png', '0139.png']]
    + [('and', f) for f in ['0172.png', '0173.png', '0174.png', '0175.png', '0176.png', '0177.png', '0178.png', '0179.png', '0182.png']]
)
out = os.path.join(HERE, 'shots'); shutil.rmtree(out, ignore_errors=True); os.makedirs(out)
cache, beats = {}, []
for i, (src, img) in enumerate(ORDER):
    d = os.path.join(HERE, SRC[src])
    if src not in cache: cache[src] = {x['img']: x for x in json.load(open(os.path.join(d, 'beats.json')))}
    new = f'{i:04d}.png'; b = {**cache[src][img], 'img': new, 'src': f'{src}/{img}'}
    if f'{src}/{img}' in STILL: b['kind'] = 'still'; b.pop('typed', None)
    shutil.copy(os.path.join(d, img), os.path.join(out, new)); beats.append(b)
    print(new, f'{src}/{img}', b.get('kind', ''), b.get('mark', ''))
json.dump(beats, open(os.path.join(out, 'beats.json'), 'w'), indent=1)
