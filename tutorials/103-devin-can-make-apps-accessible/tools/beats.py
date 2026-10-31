"""Build shots/beats.json for video 103 from the raw capture (shots/beats-raw.json): diagram scene beats go in
front of the real shots they introduce, and the PR diff shots move up to sit right after the PR opens."""
import json, os
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'shots')
raw = json.load(open(os.path.join(D, 'beats-raw.json')))
by = {b['img']: b for b in raw}
scene = lambda n: {'img': n, 'cur': {'x': 720, 'y': 600}, 'hold': 1}
order = [b['img'] for b in raw]
diff = [f'{i:04d}.png' for i in range(152, 160)]
order = [i for i in order if i not in diff]
at = order.index('0094.png') + 1
order[at:at] = diff
before = {'0000.png': ['s00.png', 's05.png', 's10.png'], '0071.png': ['s20.png'], '0095.png': ['s30.png']}
out = []
for i in order:
    out += [scene(s) for s in before.get(i, [])]
    out.append(by[i])
out.append(scene('s40.png'))
json.dump(out, open(os.path.join(D, 'beats.json'), 'w'), indent=1)
print(len(out), 'beats')
