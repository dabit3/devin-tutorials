"""After the cuts are final: keep only the stills the cut uses (shots/beats.json) and quantize them, like the other tutorials' shots/.
usage: python3 prune.py [--dry]"""
import json, os, subprocess, sys
D = os.path.dirname(os.path.abspath(__file__)); S = os.path.join(D, 'shots')
B = json.load(open(os.path.join(S, 'beats.json')))
keep = {b['img'] for b in B if not b.get('skip')}
keep |= {'beats.json', 'beats-take.json', 'call1.json', 'call2.json', 'call1.webm', 'call2.webm'}
spec = open(os.path.join(D, 'spec.js')).read(); spec = spec[spec.index('{'):spec.rindex('};') + 1]
skipped = {k for k, v in json.loads(spec)['edit'].items() if v.get('skip')}
keep -= skipped
rm = [f for f in os.listdir(S) if f not in keep and not f.startswith('call2-try1') and os.path.isfile(os.path.join(S, f))]
import shutil
if os.path.isdir(os.path.join(S, 'orig')) and '--dry' not in sys.argv: shutil.rmtree(os.path.join(S, 'orig'))  # unredacted banner stills
print('keep', len(keep), 'remove', len(rm))
if '--dry' in sys.argv: sys.exit(0)
for f in rm: os.remove(os.path.join(S, f))
pngs = [os.path.join(S, f) for f in sorted(keep) if f.endswith('.png')]
for i in range(0, len(pngs), 40):
    subprocess.run(['pngquant', '--force', '--skip-if-larger', '--quality=70-92', '--ext', '.png', *pngs[i:i + 40]], check=False)
print('quantized', len(pngs))
