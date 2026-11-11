# Builds shots/ from the parallel capture takes: the review-export terminal (shots-exp), the coordinator (shots-coord),
# the macOS child (shots-ios), the Linux child (shots-and) and the payoff stills (shots-pay). Segments and beat ranges live in picks.json:
#   {"order": [["coord", 0, 47], ["ios", 14, 60], ...]}   (inclusive ranges of source beat numbers)
#   python3 assemble.py      (rewrites shots/ and prints the new name of every source beat)
import json, os, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = {'exp': 'shots-exp', 'coord': 'shots-coord', 'ios': 'shots-ios', 'and': 'shots-and', 'pay': 'shots-pay'}
picks = json.load(open(os.path.join(HERE, 'picks.json')))
out = os.path.join(HERE, 'shots'); shutil.rmtree(out, ignore_errors=True); os.makedirs(out)
beats, i = [], 0
for src, a, b in picks['order']:
    d = os.path.join(HERE, SRC[src]); bmap = {x['img']: x for x in json.load(open(os.path.join(d, 'beats.json')))}
    for n in range(a, b + 1):
        img = f'{n:04d}.png'
        if img not in bmap: continue
        new = f'{i:04d}.png'; i += 1
        shutil.copy(os.path.join(d, img), os.path.join(out, new))
        beats.append({**bmap[img], 'img': new, 'src': f'{src}/{img}'})
        print(new, f'{src}/{img}')
json.dump(beats, open(os.path.join(out, 'beats.json'), 'w'), indent=1)
