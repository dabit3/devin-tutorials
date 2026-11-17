# Builds shots/, spec.js and voice-script.md for the v4 Code Quality Assurance video.
#   python3 assemble.py   (NO_CAPTIONS=1 for the caption-free build)
import json, os, re, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
OLD = os.path.join(HERE, '..', '42-gartner-cqa-v2', 'shots')
V3 = os.path.expanduser('~/gartner/v3/shots')
V3K = os.path.expanduser('~/gartner/v3/shots4k')
SCRIPT = os.path.expanduser('~/gartner/v2/Gartner-CQA-script-v4-criteria.md')
B = {b['img']: b for b in json.load(open(os.path.join(OLD, 'beats.json')))}
HL = json.load(open(os.path.join(HERE, '..', '43-gartner-cqa-v2-video', 'hl.json')))
LINES = {int(m.group(1)): m.group(2).strip() for m in re.finditer(r'^\| (\d+) \| ([^|]+) \|', open(SCRIPT).read(), re.M)}
# line -> list of images (v3 shots by name, old take by NNNN.png); multiple images split the line by sentence
MAP = {
 1: ['k:intro-slide-4k.png'], 2: ['k:intro-slide-4k.png'],
 3: ['v:v03-review-settings-0.png'], 4: ['v:v03-review-settings-0.png'], 5: ['v:v03-review-settings-0.png'], 6: ['v:v06-review-trigger.png'],
 7: ['d10:0000.png'], 8: ['d10:0003.png'], 9: ['f10:0004.png'], 10: ['f10:0000.png'], 11: ['f10:0046.png'], 12: ['f10:0070.png'],
 13: ['k:d01-desktop-review-info.png'], 14: ['v:v06-review-trigger.png'], 15: ['v:v15-review-billing.png', 'v:v03-review-settings-2.png'],
 16: ['f9b:0000.png'], 17: ['f9b:0001.png'], 18: ['f9b:0004.png'], 19: ['f9b:0007.png'], 20: ['f9:0057.png'],
 21: ['v:s03-threat.png'], 22: ['v:s24-References.png'], 23: ['v:s33-validation-section.png'], 24: ['v:s34-pr8-review.png'],
 25: ['0329.png'], 26: ['0340.png'], 27: ['0346.png'], 28: ['0347.png'],
 29: ['0521.png'], 30: ['0521.png'], 31: ['0521.png'],
 32: ['0700.png'], 33: ['0724.png'], 34: ['0726.png'], 35: ['v:w02-pr2-screenshots.png'], 36: ['v:w01-pr2-github.png'],
 37: ['0951.png'], 38: ['0951.png'], 39: ['0949.png'], 40: ['0953.png'],
 41: ['0976.png'], 42: ['0988.png'], 43: ['1121.png'], 44: ['1126.png'], 45: ['1125.png'], 46: ['1133.png'],
 47: ['v:o03-investigation.png', 'v:o10-win-repro-msg.png'], 48: ['v:o08-oncall-pr3-review.png'],
 49: ['v:r20-review-home-4repos.png'], 50: ['v:r20-review-home-4repos.png'], 51: ['v:r20-review-home-4repos.png'],
}
FRESH = {p: os.path.expanduser('~/gartner/v3/' + d) for p, d in (('d10', 'draft10a'), ('f10', 'fresh10'), ('f9', 'fresh9'), ('f9b', 'fresh9b'))}
FB = {p: {b['img']: b for b in json.load(open(os.path.join(d, 'beats.json')))} for p, d in FRESH.items()}
HL4 = {'o10-win-repro-msg.png': {'x': 72, 'y': 330, 'w': 425, 'h': 118}}
SAY = [('CWE-862', 'CWE eight six two'), ('CWE-290', 'CWE two ninety'), ('REVIEW.md', 'review dot M D'), ('AGENTS.md', 'agents dot M D'), ('999,999', 'nine hundred and ninety-nine thousand nine hundred and ninety-nine'),
       ('CI,', 'C I,'), ('CI ', 'C I '), ('CI.', 'C I.'), ('VMs', 'V Ms'), ('VM', 'V M'), ('iOS', 'i O S'), ('MCP', 'M C P'), ('API', 'A P I')]
out = os.path.join(HERE, 'shots'); shutil.rmtree(out, ignore_errors=True); os.makedirs(out)
beats, edit, order = [], {}, []
for ln in sorted(MAP):
    imgs, vo = MAP[ln], LINES[ln]
    sents = re.split(r'(?<=[.!?])\s+', vo)
    if len(imgs) > 1:
        k = len(sents) // len(imgs); parts = [' '.join(sents[i * k:(i + 1) * k if i < len(imgs) - 1 else None]) for i in range(len(imgs))]
    else: parts = [vo]
    for img, part in zip(imgs, parts): order.append((ln, img, part))
for i, (ln, src, vo) in enumerate(order):
    new = f'{i:04d}.png'
    if src.split(':')[0] in FRESH:
        pfx, name = src.split(':'); b = dict(FB[pfx].get(name, {'cur': {'x': 1300, 'y': 760}}))
        for k in ('kind', 'at', 'mark', 'n', 'paste', 'chars', 'target', 'clickAt'): b.pop(k, None)
        shutil.copy(os.path.join(FRESH[pfx], name), os.path.join(out, new)); b.update(img=new, src=src.replace(':', '-'))
    elif src.startswith(('v:', 'k:')):
        d = V3 if src[0] == 'v' else V3K
        shutil.copy(os.path.join(d, src[2:]), os.path.join(out, new)); b = {'img': new, 'src': src[2:], 'cur': {'x': 1300, 'y': 760}}
    else:
        b = dict(B[src]); shutil.copy(os.path.join(OLD, src), os.path.join(out, new))
        for k in ('kind', 'at', 'mark', 'n', 'paste', 'chars'): b.pop(k, None)
        b.update(img=new, src=src)
    beats.append(b)
    e = {'hold': 2.5, 'cursor': False, 'hl': None, 'capPos': 'bottom', 'line': ln}
    if src in HL: e.update(hl=HL[src], hlDelay=0.5)
    elif src[2:] in HL4: e.update(hl=HL4[src[2:]], hlDelay=0.5)
    e['vo'] = vo; say = vo
    for a, z in SAY: say = say.replace(a, z)
    if say != vo: e['voSay'] = say
    edit[new] = e
json.dump(beats, open(os.path.join(out, 'beats.json'), 'w'), indent=1)
spec = {'title': '', 'subtitle': '', 'introHold': 0.2, 'outro': 'Devin, by Cognition', 'outroSub': 'devin.ai  ·  cognition.com',
        'speed': 1, 'cps': 48, 'maxZoom': 1.4, 'voSentGap': 1.0, 'pace': 1.5, 'edit': edit}
if os.environ.get('NO_CAPTIONS'): spec['noSubs'] = True
open(os.path.join(HERE, 'spec.js'), 'w').write('window.SPEC = ' + json.dumps(spec, indent=1) + ';\n')
with open(os.path.join(HERE, 'voice-script.md'), 'w') as f:
    f.write('# Code Quality Assurance with Devin (v4): narration script\n\n')
    for _, _, vo in order: f.write(vo + '\n\n')
print(len(beats), 'beats;', sum(len(v.split()) for _, _, v in order), 'words')
