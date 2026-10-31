"""Build shots/ for Tutorial 110 from the raw captures: live session (~/cap110/raw), proof beats (~/cap110/proof) and
blank #FCFCFC placeholders for the diagram scenes. Writes shots/beats.json and shots/SOURCES.json.
usage: python3 tools/assemble.py [raw_dir] [proof_dir]"""
import json, os, shutil, sys
from PIL import Image
VD = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser('~/cap110/raw')
PROOF = sys.argv[2] if len(sys.argv) > 2 else os.path.expanduser('~/cap110/proof')
SESSION = 'https://app.devin.ai/sessions/e0c43b0d06c84d33b99b7235aa175436'
PLAN = ['scene:hero', 'scene:how', 'raw:0001', 'raw:0002', 'raw:0003', 'raw:0053', 'raw:0061',
        'proof:0000', 'proof:0002', 'proof:0003', 'proof:0004', 'proof:0009', 'proof:0011', 'proof:0012',
        'proof:0014', 'proof:0016', 'proof:0017', 'proof:0018', 'proof:0019', 'proof:0020', 'scene:uses']
WHAT = {'raw': 'capture.mjs PHASE=start/watch: fresh dc110 session in thequantexplorer (sketch attached, Devin building and testing)',
        'proof': 'capture.mjs PHASE=step: the finished session (chat, test report with recording, live app preview, PR #79 tab)'}
out = os.path.join(VD, 'shots'); shutil.rmtree(out, ignore_errors=True); os.makedirs(out)
src_beats = {k: {b['img']: b for b in json.load(open(os.path.join(d, 'beats.json')))} for k, d in (('raw', RAW), ('proof', PROOF))}
beats, sources = [], {}
for i, item in enumerate(PLAN):
    img = f'{i:04d}.png'; kind, ref = item.split(':')
    if kind == 'scene':
        Image.new('RGB', (4320, 2430), (252, 252, 252)).save(os.path.join(out, img))
        beats.append({'img': img, 'cur': {'x': 1100, 'y': 760}, 'hold': 2})
        sources[img] = {'scene': ref, 'source': 'diagram placeholder (blank #FCFCFC), drawn by scenes.js'}
        continue
    b = dict(src_beats[kind][ref + '.png']); b['img'] = img
    shutil.copy(os.path.join(RAW if kind == 'raw' else PROOF, ref + '.png'), os.path.join(out, img))
    beats.append(b)
    sources[img] = {'source': 'new capture', 'org': 'thequantexplorer', 'session': SESSION, 'script': WHAT[kind],
                    'raw': f'{kind}/{ref}.png', 'name': b.get('name'), 'zoom': 1.25}
json.dump(beats, open(os.path.join(out, 'beats.json'), 'w'), indent=1)
json.dump({'note': 'Fresh live run made for this video in the thequantexplorer org at ZOOM=1.25 with the session sidebar collapsed and the account email masked. '
           'The sketch (assets/team-sketch.png, drawn by tools/sketch.py) was attached to the session prompt; Devin built the Team page in thequantexplorer/orbit-demo '
           '(branch dc110-team-page, PR #79), tested it with a recording and posted a sketch-vs-build comparison. assets/team-live.png is a crop of proof/0016.png used in the hero diagram.',
           'session': SESSION, 'pr': 'https://github.com/thequantexplorer/orbit-demo/pull/79', 'shots': sources}, open(os.path.join(out, 'SOURCES.json'), 'w'), indent=1)
print(len(beats), 'beats')
