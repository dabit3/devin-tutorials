"""Splices the finished-app hero footage (Chrome, real GPT-Live-1 audio recorded off WebRTC by hero.mjs) into
shots/beats.json: the opening stills + teacher clip before the take, the interruption + critic clips after it.
The take's own beats stay in shots/beats-take.json. Each clip is a 'call' so synccall.py locks it to real time."""
import json, os, shutil, subprocess
D = os.path.dirname(os.path.abspath(__file__)); S = os.path.join(D, 'shots'); A = os.path.join(D, 'audio')
H = os.environ.get('HERO', os.path.expanduser('~/t38'))
TAKE = os.path.join(S, 'beats-take.json')
if not os.path.exists(TAKE): shutil.copy(os.path.join(S, 'beats.json'), TAKE)
take = json.load(open(TAKE))
# the clean browser + iPhone recording card was captured last; play it before the Android card
cards = [n for n, b in enumerate(take) if b.get('mark') == 'card']
prs = [n for n, b in enumerate(take) if b.get('mark') == 'pr']
pr_seg = take[prs[0] - 1:] if prs else []
if prs: take = take[:prs[0] - 1]
if len(cards) >= 3: take = take[:cards[1]] + take[cards[-1]:] + take[cards[1]:cards[-1]]
take += pr_seg
# (clip, run, start s, end s) relative to each run's t0
SEGS = {'head': [('heroA', 'hero-teacher', 23.3, 35.0), ('heroA2', 'hero-teacher', 52.0, 57.3)],
        'tail': [('heroB', 'hero-teacher', 64.0, 76.0), ('heroB2', 'hero-teacher', 87.8, 94.0), ('heroB3', 'hero-teacher', 104.6, 112.4),
                 ('heroC', 'hero-critic', 15.0, 25.6), ('heroC2', 'hero-critic', 41.6, 50.8)]}
def still(name, run, at):
    h = json.load(open(f'{H}/{run}/hero.json')); t = h['t0'] + at * 1000
    f = min(h['frames'], key=lambda x: abs(x['t'] - t))['f']
    shutil.copy(f'{H}/{run}/f/' + os.path.basename(f), os.path.join(S, name)); return {'img': name, 'kind': 'still'}
def clip(name, run, a, b):
    h = json.load(open(f'{H}/{run}/hero.json')); t0 = h['t0']
    fr = [x for x in h['frames'] if t0 + a * 1000 <= x['t'] < t0 + b * 1000]
    out = []
    for i, x in enumerate(fr):
        img = f'{name}-{i:03d}.jpg'; shutil.copy(f'{H}/{run}/f/' + os.path.basename(x['f']), os.path.join(S, img))
        out.append({'img': img, 'kind': 'still', 'call': name, 'wall': x['t']})
    json.dump({'t0': fr[0]['t'], 't1': t0 + b * 1000}, open(os.path.join(S, name + '.json'), 'w'))
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'{H}/{run}/mix.wav', '-ss', str((fr[0]['t'] - t0) / 1000),
                    '-to', str(b), '-ar', '48000', '-ac', '2', os.path.join(A, name + '.wav')], check=True)
    return out
head = [still('intro-0.jpg', 'hero-teacher', 113.0), still('intro-1.jpg', 'hero-critic', 50.5), still('intro-2.jpg', 'hero-teacher', 23.0)]
for s in SEGS['head']: head += clip(*s)
tail = [still('tail-0.jpg', 'hero-teacher', 64.0)]
for s in SEGS['tail']: tail += clip(*s)
tail.append(still('outro.jpg', 'hero-teacher', 113.0))
json.dump(head + take + tail, open(os.path.join(S, 'beats.json'), 'w'), indent=1)
print(len(head), 'head', len(take), 'take', len(tail), 'tail')
