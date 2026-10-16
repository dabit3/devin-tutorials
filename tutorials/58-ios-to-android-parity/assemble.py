# Builds shots/ from the two capture takes: shots-ios (macOS session, iPhone Simulator) and shots-android2 (Ubuntu session, Android emulator at full screen height).
#   python3 assemble.py        (rewrites shots/ and prints the source of every new beat)
import json, os, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = {'ios': 'shots-ios', 'and': 'shots-android2'}
STILL = {'ios/0055.png', 'and/0072.png'}  # finished prompts, shown at once (too long to type on camera)
POLL = lambda a, b, step=1: [f'{i:04d}.png' for i in range(a, b + 1, step)]
ORDER = (
    [('ios', f) for f in ['0000.png', '0001.png', '0003.png', '0004.png', '0006.png', '0055.png', '0056.png', '0057.png']]
    + [('ios', f) for f in ['0058.png', '0059.png', '0060.png', '0061.png', '0063.png', '0064.png', '0066.png', '0067.png', '0068.png', '0069.png']]
    + [('and', f) for f in ['0001.png', '0003.png', '0004.png', '0006.png', '0072.png', '0073.png', '0074.png']]
    + [('and', f) for f in ['0075.png', '0084.png', '0090.png', '0100.png', '0108.png', '0122.png', '0128.png', '0134.png', '0156.png', '0158.png', '0160.png', '0162.png', '0166.png']]
    + [('and', f) for f in ['0180.png', '0181.png', '0182.png', '0183.png', '0184.png', '0185.png', '0186.png', '0187.png', '0189.png']]
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
