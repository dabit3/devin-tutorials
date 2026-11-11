"""Build shots/ (raw capture frames + diagram placeholders), shots/SOURCES.json and spec.js for tutorial 91.
usage: python3 tools/assemble.py <raw-capture-dir>   (raw = capture.mjs output: 0000.png.. + beats.json)"""
import json, os, shutil, sys
VD = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); RAW = os.path.abspath(sys.argv[1])
PLACE = os.path.join(VD, '..', '26-sdlc-overview', 'shots', '0005.png')  # blank 4320x2430 placeholder
raw = json.load(open(os.path.join(RAW, 'beats.json')))
KEEP = [0, 1, 2] + list(range(6, 47)) + list(range(90, 98)) + list(range(104, 115))
NOTES = {0: 'Ask home, sidebar collapsed', 1: 'Agent/Ask toggle', 6: 'repo chip under the composer', 8: 'Select repositories dialog search',
         22: 'composer scoped to thequantexplorer/insidetheforyou', 25: 'question typed', 46: 'sent; Thinking', 90: 'Searching across 1 repo',
         97: 'answer with ScoreLab.tsx citations, code panel open', 104: 'citation ScoreLab.tsx:69-73', 107: 'code panel jumped to lines 69-73',
         108: 'DeepWiki overview page', 111: 'Relevant source files expanded', 112: 'System Architecture and Code Entity Mapping diagram', 114: 'diagram expanded'}
out = os.path.join(VD, 'shots'); shutil.rmtree(out, ignore_errors=True); os.makedirs(out)
beats, src, name = [], {}, {}
def place(scene, note):
    img = f'{len(beats):04d}.png'; shutil.copy(PLACE, os.path.join(out, img))
    beats.append({'img': img, 'cursor': False, 'capPos': 'bottom', 'hl': None, 'fade': 0})
    src[img] = {'kind': 'animated-diagram', 'source': '91-devin-can-explain-any-codebase/scenes.js', 'scene': scene, 'note': note}; name[scene] = img
place('intro', 'Blank placeholder; diagram drawn by the scene: unfamiliar repo -> Devin -> cited answer.')
place('how', 'Blank placeholder; diagram drawn by the scene: indexed repo -> Ask Devin and DeepWiki.')
for i in KEEP:
    b = dict(raw[i]); img = f'{len(beats):04d}.png'; shutil.copy(os.path.join(RAW, b['img']), os.path.join(out, img)); b['img'] = img
    beats.append(b); name[i] = img
    src[img] = {'kind': 'real-ui', 'source': f'fresh capture, thequantexplorer org, capture.mjs raw/{i:04d}.png', 'captured': '2026-10-30',
                'org': 'https://app.devin.ai/org/thequantexplorer', 'repo': 'thequantexplorer/insidetheforyou', 'note': NOTES.get(i, raw[i].get('kind') or 'still')}
place('uses', 'Blank placeholder; diagram drawn by the scene: what to use it for (from docs.devin.ai Ask Devin page).')
json.dump(beats, open(os.path.join(out, 'beats.json'), 'w'), indent=1)
json.dump(src, open(os.path.join(out, 'SOURCES.json'), 'w'), indent=2)
E = json.load(open(os.path.join(VD, 'tools', 'edits.json')))
spec = {k: v for k, v in E.items() if k != 'edit'}
spec['edit'] = {name[int(k) if k.isdigit() else k]: v for k, v in E['edit'].items()}
open(os.path.join(VD, 'spec.js'), 'w').write('window.SPEC = ' + json.dumps(spec, indent=2, ensure_ascii=False) + ';\n')
print(len(beats), 'beats')
