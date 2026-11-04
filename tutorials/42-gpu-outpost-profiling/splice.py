# Splices the phase captures into shots/ in story order (run once after all phases; sources stay in shots-*/).
import json, os, shutil
SRC = [
    ('shots-ui', range(2, 18)),          # Outposts tab (frames 0-1 showed the blueprint config, cut), Settings → Environment → Outposts, create gpu-h200, token + worker command
    ('shots-term', range(0, 44)),        # Modal: worker.py, secret, modal run --detach
    ('shots-sess', range(0, 15)),        # home → Virtual environment → gpu-h200, @repo, prompt, send
    ('shots-watch', [0, 3, 8, 12, 16, 20, 21]),  # live session on the outpost
    ('shots-res', range(0, 18)),         # timeline rows → nvidia-smi, profiler, vectorize check
    ('shots-pr', [2, 3]),                # PR tab with the diff
    ('shots-res', [19]),                 # final summary
]
if not os.path.isdir('shots-ui'):
    os.rename('shots', 'shots-ui')
shutil.rmtree('shots', ignore_errors=True); os.makedirs('shots')
# Cut beats keep their slot so later file names stay stable (tutorial 43 reuses them): cat worker.py and the PR diff.
SKIP = {f'shots-term/{i:04d}.png' for i in range(1, 7)} | {'shots-pr/0003.png'}
out, n = [], 2
for d, idx in SRC:
    beats = json.load(open(f'{d}/beats.json'))
    for i in idx:
        if f'{d}/{beats[i]["img"]}' in SKIP:
            n += 1; continue
        b = dict(beats[i]); name = f'{n:04d}.png'
        shutil.copy(f'{d}/{b["img"]}', f'shots/{name}')
        if d == 'shots-watch':
            b.pop('at', None); b.pop('kind', None); b.setdefault('hold', 1.2)
        if n == 2:
            b.pop('kind', None); b.pop('clickAt', None); b['hold'] = 1.6
        b['img'] = name; b['src'] = f'{d}/{beats[i]["img"]}'
        if b.get('mark'): b['mark'] = b['mark']
        out.append(b); n += 1
json.dump(out, open('shots/beats.json', 'w'), indent=1)
for i, b in enumerate(out):
    if b.get('mark') or i in (0,):
        print(i, b['src'], b.get('mark'))
print('total', n)
