# Builds shots/ from the two capture takes: shots-mac (macOS session, iOS Simulator) then shots-linux (Ubuntu session, Android emulator).
#   python3 assemble.py        (rewrites shots/; linux beat N becomes 0116+N, then drops the beats spec.js skips)
# The raw takes (shots-mac/, shots-linux/, ~900 MB) stay out of git; shots/ keeps each beat's raw source in "src".
import json, os, re, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(HERE, 'shots'); shutil.rmtree(out, ignore_errors=True); os.makedirs(out)
beats = []
for src in ('shots-mac', 'shots-linux'):
    d = os.path.join(HERE, src)
    for b in json.load(open(os.path.join(d, 'beats.json'))):
        new = f'{len(beats):04d}.png'
        shutil.copy(os.path.join(d, b['img']), os.path.join(out, new))
        beats.append({**b, 'img': new, 'src': f"{src}/{b['img']}"})
skip = set(re.findall(r'"(\d{4}\.png)": \{\s*"skip": true', open(os.path.join(HERE, 'spec.js')).read()))
for b in beats:
    if b['img'] in skip: os.remove(os.path.join(out, b['img']))
beats = [b for b in beats if b['img'] not in skip]
json.dump(beats, open(os.path.join(out, 'beats.json'), 'w'), indent=1)
print(len(beats), 'beats kept,', len(skip), 'skipped beats dropped')
