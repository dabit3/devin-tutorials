"""Merge the per-phase still dirs (SHOTS=... runs of capture.mjs) into one numbered sequence for genspec.py:
copies every png in order into shots-all/ as 0000.png.., rewrites beats.json img names, and carries the
callN.json/webm files over. Usage: mergeshots.py shots-pick shots shots-rejoin shots-watch shots-end"""
import json, os, shutil, sys
D = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(D, 'shots-all'); shutil.rmtree(OUT, ignore_errors=True); os.makedirs(OUT)
beats, n = [], 0
for d in sys.argv[1:]:
    S = os.path.join(D, d)
    for b in json.load(open(os.path.join(S, 'beats.json'))):
        src = os.path.join(S, b['img'])
        if not os.path.exists(src): continue
        b['img'] = f'{n:04d}.png'; b['src'] = f"{d}/{os.path.basename(src)}"
        shutil.copy2(src, os.path.join(OUT, b['img'])); beats.append(b); n += 1
    for f in os.listdir(S):
        if f.startswith('call') and (f.endswith('.json') or f.endswith('.webm')): shutil.copy2(os.path.join(S, f), OUT)
json.dump(beats, open(os.path.join(OUT, 'beats.json'), 'w'), indent=1)
print(n, 'stills ->', OUT, 'marks:', [b['mark'] for b in beats if b.get('mark')])
