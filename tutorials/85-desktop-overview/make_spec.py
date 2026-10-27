"""Writes spec.js (pure JSON, as vo.py needs) and voice-script.md from the edit plan below. Usage: python3 make_spec.py
Edits are keyed by source take frame ('take/N', '#2' = its second use), resolved through shots/beats.json 'src'."""
import json, os
D = os.path.dirname(os.path.abspath(__file__))
beats = json.load(open(f'{D}/shots/beats.json'))
IDX = {}
for b in beats:
    t, f = b['src'].split('/'); k = f'{t}/{int(f[:4])}'
    k = k if k not in IDX else k + '#2'
    IDX[k] = b['img']
E = {}
def ed(key, **k):
    if key not in IDX: return  # beats cut from the film are pruned from shots/
    img = IDX[key]; E.setdefault(img, {}).update(k)
def rng(take, a, b, **k):
    for n in range(a, b + 1):
        if f'{take}/{n}' in IDX: ed(f'{take}/{n}', **k)
TOP = {'x': 0.62, 'y': 0.16}      # new-session screens: empty space above the centered composer
LEFT = {'x': 0.117, 'y': 0.88, 'maxW': 0.215}    # sidebar bottom, clear of the chat and composer; longer lines split to fit
RIGHT = {'x': 0.77, 'y': 0.93}    # side panel bottom
def polls(take, a, b, keep=()):
    for n in range(a, b + 1):
        k = f'{take}/{n}'
        if k in IDX and n not in keep and next(x for x in beats if x['img'] == IDX[k]).get('kind') == 'poll': ed(k, skip=True)
exec(open(f'{D}/plan.py').read())
spec = dict(SPEC_BASE, edit=E)
open(f'{D}/spec.js', 'w').write('window.SPEC = ' + json.dumps(spec, indent=2, ensure_ascii=False) + ';\n')
lines = [f'# Voice script: {spec["title"]}', '', 'One whole-script ElevenLabs `eleven_multilingual_v2` take per voice (`T8iHhGIWPm2GVYpQD1Am`, Nader, and `c1uwEpPUcC16tq1udqxk`), cut into lines by `_kit/tools/vo.py`. Spoken text that differs from the subtitle is shown below it.', '']
for img in sorted(E):
    v = E[img]
    if v.get('vo'):
        lines.append(f'**{img}**{" (scene: " + v["scene"] + ")" if v.get("scene") else ""}: {v["vo"]}')
        if v.get('voSay'): lines.append(f'  - spoken: {v["voSay"]}')
        lines.append('')
lines.append(f'**Outro**: {spec["voOutro"]}')
open(f'{D}/voice-script.md', 'w').write('\n'.join(lines) + '\n')
print(len(E), 'edits;', sum(1 for v in E.values() if v.get('vo')), 'vo lines;', sum(len(v['vo'].split()) for v in E.values() if v.get('vo')), 'words')
