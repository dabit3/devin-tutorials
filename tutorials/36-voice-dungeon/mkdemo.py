"""Cuts the off-camera Dungeon Voice demo take (headless Chrome, real GPT-Live audio) into shots/demo/ stills,
shots/demo.json beats and audio/demo*.wav clips. Source: DEMO=<take dir> with f/*.jpg, log.json, mix.wav."""
import json, os, shutil, subprocess, sys
D = os.path.dirname(os.path.abspath(__file__))
SRC = os.environ.get('DEMO', '/Users/devin/t36/demo/t13')
L = json.load(open(os.path.join(SRC, 'log.json')))
F = [f for f in L['frames'] if isinstance(f[0], int)]; T0 = F[0][1]
ts = [(f[1] - T0) / 1000 for f in F]
SEGS = {'demoA': (35.0, 65.6), 'demoB': (66.5, 72.3), 'demoC': (89.8, 110.6)}  # sneak (animated)/barge-in/fight, comedic switch, dash + rope bridge
STILLS = {'gate': 12.0, 'bridge': 26.0, 'troll': 33.0, 'outro': 111.0}  # silent stills for the narrated intro and the recap
FPS = 6
out = os.path.join(D, 'shots', 'demo'); shutil.rmtree(out, ignore_errors=True); os.makedirs(out)
def near(t): return min(range(len(ts)), key=lambda i: abs(ts[i] - t))
def put(i, name):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(SRC, 'f', f'{F[i][0]:04d}.jpg'), '-q:v', '3', os.path.join(out, name)], check=True)
    return 'demo/' + name
beats = []
for k, t in STILLS.items(): beats.append({'img': put(near(t), f'{k}.jpg'), 'kind': 'still', 'demo': k})
for seg, (a, b) in SEGS.items():
    idx, t = [], a
    while t < b:
        i = near(t)
        if not idx or i != idx[-1]: idx.append(i)
        t += 1 / FPS
    for j, i in enumerate(idx):
        beats.append({'img': put(i, f'{seg}-{j:03d}.jpg'), 'kind': 'still', 'demo': seg, 't': round(max(ts[i], a) - a, 3) if j else 0.0})
    for bb in beats[-len(idx):]: bb['segEnd'] = round(b - a, 3)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(a), '-to', str(b), '-i', os.path.join(SRC, 'mix.wav'),
                    '-af', 'afade=t=in:d=0.08,areverse,afade=t=in:d=0.25,areverse', '-ar', '48000', '-ac', '2', os.path.join(D, 'audio', seg + '.wav')], check=True)
json.dump(beats, open(os.path.join(D, 'shots', 'demo.json'), 'w'), indent=1)
print(len(beats), 'demo beats')
