"""Build shots/ for the narrated cut from the raw capture (capture.mjs writes $RAW/shots): keep only the beats the film uses,
renumber them, and add a placeholder PNG + beats.json row for each diagram scene.
usage: python3 tools/assemble.py <raw-shots-dir>"""
import json, os, shutil, sys
RAW = sys.argv[1]; VD = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); OUT = os.path.join(VD, 'shots')
raw = {b['img']: b for b in json.load(open(os.path.join(RAW, 'beats.json')))}
rng = lambda a, b: [f'{i:04d}.png' for i in range(a, b + 1)]
# (scene name) or [raw images], in film order
PLAN = [
    'title', 'cycle',
    rng(1, 38), ['0080.png'],               # session 1: the task, then the PR with CI green
    rng(82, 126), ['0138.png'],             # the correction, then Devin fixes the PR and saves the memory
    ['0139.png', '0140.png', '0141.png'],   # open the Updated memory card
    'drive',
    ['0516.png'],                           # Customize -> Memory
    ['0518.png', '0519.png', '0520.png'],   # open the saved note
    'dream', ['0517.png'],                  # Dreaming, then the latest dreaming session
    rng(148, 186),                          # session 2: a new task, no reminder
    ['0529.png'], ['0534.png'],             # Devin's report, the CHANGELOG diff
    'compare',
]
shutil.rmtree(OUT, ignore_errors=True); os.makedirs(OUT)
beats, src, n = [], {}, 0
blank = os.path.join(RAW, '0000.png')
for item in PLAN:
    for img in ([None] if isinstance(item, str) else item):
        name = f'{n:04d}.png'; n += 1
        if img is None:
            shutil.copy(blank, os.path.join(OUT, name)); beats.append({'img': name, 'cur': {'x': 1250, 'y': 700}, 'hold': 1.2}); src[name] = 'scene:' + item
        else:
            shutil.copy(os.path.join(RAW, img), os.path.join(OUT, name)); b = dict(raw[img]); b['img'] = name; beats.append(b); src[name] = img
json.dump(beats, open(os.path.join(OUT, 'beats.json'), 'w'), indent=1)
json.dump(src, open(os.path.join(VD, 'build-map.json'), 'w'), indent=1)
for k, v in src.items():
    if not v.endswith('.png') or raw.get(v, {}).get('kind') not in ('type',): print(k, v, raw.get(v, {}).get('mark') or raw.get(v, {}).get('kind') or '')
print('beats', len(beats))
