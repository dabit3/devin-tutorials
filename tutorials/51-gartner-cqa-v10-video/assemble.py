# Builds shots/, spec.js and voice-script.md for the v9 Code Quality Assurance video (first person, still camera, cursor visible).
#   python3 assemble.py   (NO_CAPTIONS=1 for the caption-free build)
import json, os, re, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
G = os.path.expanduser('~/gartner')
SCRIPT = G + '/v10/Gartner-CQA-script-v10.md'
LINES = {m.group(1): m.group(2).strip() for m in re.finditer(r'^\| (\w+) \| ([^|]+) \|', open(SCRIPT).read(), re.M) if m.group(1) != '#'}
DIRS = {'n9': G + '/v9/shots', 'v3': G + '/v3', 'x': G + '/v10/shots', 'd': G + '/v10/desk'}
VOJ = os.path.join(HERE, 'vo', 'T8iHhGIWPm2GVYpQD1Am', 'lines.json')
VOD = {v['text']: v['dur'] for v in json.load(open(VOJ)).values()} if os.path.exists(VOJ) else {}
T = lambda d, a, b, step=1: [f'{d}/{i:04d}.png' for i in range(a, b + 1, step)]
# each line: list of (image, text, extra) ; text None = whole line; '' + at='phrase' = cut in when that phrase is spoken
# CARD:<name> = section card scene
P = [
 ('1', [('x:intro/0000.png', None)]),
 ('2', [('x:intro/0000.png', None), ('x:intro/0001.png', '', 'Devin Oncall'), ('x:intro/0002.png', '', 'Devin Security'), ('x:intro/0003.png', '', 'and Devin Review')]),
 ('3', [('x:intro/0001.png', 'Each one is built for a single job. Oncall is a site reliability agent with its own harness.'), ('x:intro/0002.png', 'Security uses agentic MapReduce to scan a whole codebase.'), ('x:pages1/0000.png', 'Review uses adversarial agents, where some agents find problems and others try to disprove them.')]),
 ('4', [('x:gov/0005.png', 'S0'), ('x:pages7/0000.png', 'S1')]),
 ('5', [('x:context/0001.png', None), ('x:pages1/0001.png', '', 'our runbooks'), ('x:context/0002.png', '', 'tools like Slack')]),
 ('6', [('x:context/0001.png', None)]),
 ('6a', [('x:wiki/0000.png', 'S0'), ('x:wiki/0001.png', 'S1')]),
 ('6b', [('x:wiki/0003.png', 'S0'), ('x:answer/0000.png', 'S1'), ('x:answer/0001.png', '', 'Devin answers')]),
 ('CARD', 'ch1'),
 ('7', [('x:pages1/0002.png', None)]),
 ('8', [('x:pages3/0002.png', 'S0'), ('x:pages3/0005.png', 'S1')]),
 ('9', [('x:re-ios/0000.png', 'S0'), ('x:ios-comp/0001.png', 'S1')]),
 ('10', [('x:ios-comp/0002.png', 'S0'), ('x:ios-comp/0012.png', '', 'removes the last'), ('x:ios-comp/0026.png', '', 'gets the same crash'), ('x:re-ios/0006.png', 'S1')]),
 ('11', [('x:re-ios/0004.png', None)]),
 ('12', [('x:re-ios/0006.png', None), ('x:re-ios/0008.png', '', 'how confident')]),
 ('13', [('x:pages3/0008.png', None)]),
 ('14', [('x:winonc/0000.png', 'S0'), ('x:winonc-comp/0001.png', 'S1'), ('x:winonc-comp/0008.png', '', 'finds a missing'), ('x:winonc/0001.png', '', 'and adds unit tests')]),
 ('15', [('x:pages1/0003.png', None), ('d:pr3.png', '', 'Devin Desktop')]),
 ('CARD', 'ch2'),
 ('16', [('x:re-suite/0000.png', None)]),
 ('17', [('x:re-suite/0001.png', None)]),
 ('18', [('x:re-suite/0002.png', None)]),
 ('19', [('x:win-comp/0006.png', 'S0'), ('x:win-comp/0013.png', 'S1'), ('x:win-comp/0019.png', '', 'and on Linux'), ('x:and-comp/0003.png', '', 'our Android app'), ('x:and-comp/0010.png', '', 'in an emulator')]),
 ('20', [('x:pages3/0009.png', None), ('x:pages3/0010.png', '', 'screenshots to')]),
 ('21', [('x:host/0004.png', None)]),
 ('CARD', 'ch3'),
 ('22', [('x:pages1/0018.png', 'S0'), ('x:pages1/0006.png', 'S1+')]),
 ('23', [('x:cwe3/0000.png', None)]),
 ('24', [('x:rvchat/0002.png', None), ('x:rvchat/0050.png', '', 'it explains')]),
 ('25', [('x:ci9/0000.png', None), ('x:ci9/0001.png', '', 'reproduces the failure')]),
 ('26', [('x:ci9/0002.png', None)]),
 ('27', [('x:stack9/0000.png', None), ('x:pages1/0008.png', '', 'a stack of three')]),
 ('28', [('x:gov/0009.png', None), ('x:readme/0000.png', '', 'updates the module'), ('x:pages1/0010.png', '', 'Each pull request')]),
 ('CARD', 'ch4'),
 ('29', [('x:pages1/0011.png', None)]),
 ('30', [('x:pages1/0012.png', 'S0'), ('x:pages2/0001.png', 'S1')]),
 ('31', [('x:pages3/0016.png', None), ('x:pages3/0017.png', '', 'then verifies')]),
 ('32', [('x:pages2/0003.png', None), ('x:fixsess/0000.png', '', 'starts a session'), ('x:pages1/0013.png', '', 'opens a pull request'), ('x:pages1/0014.png', '', 'which Review')]),
 ('CARD', 'ch5'),
 ('33', [('x:wf/0000.png', None), ('x:wf/0001.png', '', 'with steps where')]),
 ('34', [('x:wf/0002.png', 'S0'), ('x:wf/0003.png', 'S1')]),
 ('35', [('x:pages2/0005.png', None), ('x:pages1/0016.png', '', 'from Slack'), ('d:pr3.png', '', 'Devin Desktop'), ('x:pages1/0015.png', '', 'the API')]),
 ('36', [('x:gov/0004.png', None), ('x:gov/0002.png', '', 'what they can spend'), ('x:gov/0000.png', '', 'see usage')]),
 ('37', [('x:pages2/0004.png', None)]),
 ('38', [('x:pages1/0018.png', None)]),
]

HLX = {('4', 'x:pages7/0000.png'): [{'x': 744, 'y': 579, 'w': 760, 'h': 56}]}  # (line, src) -> [box] overrides; None drops a capture-time box
HOLDX = {('6b', 'x:answer/0001.png'): 1.6, ('24', 'x:rvchat/0050.png'): 2.5, ('38', 'x:pages1/0018.png'): 1.5, ('6a', 'x:wiki/0001.png'): 1.2}
SAY = [('CWE', 'C W E'), ('AGENTS.md', 'agents dot M D'), ('README', 'read-me'), ('MapReduce', 'map-reduce'), ('CI,', 'C I,'), ('CI ', 'C I '), ('CI.', 'C I.'), ('VMs', 'V Ms'), ('VM', 'V M'), ('iOS', 'i O S'), ('MCP', 'M C P'), ('API', 'A P I'), ('UI', 'U I'), ('DeepWiki', 'Deep Wiki')]
out = os.path.join(HERE, 'shots'); shutil.rmtree(out, ignore_errors=True); os.makedirs(out)
BJ = {}
def beat(src):
    pfx, rel = src.split(':', 1); path = os.path.join(DIRS[pfx], rel); d = os.path.dirname(path)
    if d not in BJ:
        f = os.path.join(d, 'beats.json'); BJ[d] = {b['img']: b for b in json.load(open(f))} if os.path.exists(f) else {}
    b = dict(BJ[d].get(os.path.basename(path), {}))
    for k in ('kind', 'at', 'mark', 'n', 'paste', 'chars', 'target', 'clickAt', 'line', 'tag', 'hold'): b.pop(k, None)
    b.setdefault('cur', {'x': 1180, 'y': 700})
    return path, b
def say(t):
    for a, z in SAY: t = re.sub(r'\b' + re.escape(a), z, t) if a[0].isalnum() else t.replace(a, z)
    return t
beats, edit, words = [], {}, 0
blank = os.path.join(DIRS['x'], 'intro/0000.png')
for ln, parts in P:
    if ln == 'CARD':
        new = f'{len(beats):04d}.png'; shutil.copy(blank, os.path.join(out, new)); beats.append({'img': new, 'src': 'card', 'cur': {'x': 1180, 'y': 700}})
        edit[new] = {'hold': 2.2, 'scene': parts, 'cursor': False, 'waitVo': True}; continue
    line = LINES[ln]; sents = re.split(r'(?<=[.!?])\s+', line)
    texts = []; cur = None
    for p in parts:
        img, t = p[0], p[1]; at = p[2] if len(p) > 2 else None
        if t is None: t = line
        elif re.fullmatch(r'S\d\+?', t): t = ' '.join(sents[int(t[1]):] if t.endswith('+') else [sents[int(t[1])]])
        if t: texts.append(t); cur = t
        path, b = beat(img); new = f'{len(beats):04d}.png'; shutil.copy(path, os.path.join(out, new)); b.update(img=new, src=img)
        hl = b.pop('hl', None); beats.append(b); e = {'hold': 0.5 if not t else 0.6, 'cursor': True, 'hl': HLX.get((ln, img), hl), 'hlDelay': 0.5, 'capPos': 'bottom', 'line': ln}
        if not t:
            if isinstance(at, tuple): e['voSync'] = round(at[1], 2); e['hold'] = 0.12
            else:
                w = cur.split(); i = cur.find(at); assert i >= 0, (ln, at)
                dur = VOD.get(cur, len(w) / 2.55); e['voSync'] = round(dur * len(cur[:i].split()) / len(w), 2)
        else:
            if not texts[:-1] and ln != '1': e['voGap'] = 1.0
            e['vo'] = t; s = say(t)
            if s != t: e['voSay'] = s
        if (ln, img) in HOLDX: e['hold'] = HOLDX[(ln, img)]
        edit[new] = e
    assert ' '.join(texts) == line, (ln, texts)
    words += len(line.split())
json.dump(beats, open(os.path.join(out, 'beats.json'), 'w'), indent=1)
spec = {'title': 'Code quality assurance with Devin', 'subtitle': 'From a production alert or a pull request to tested, reviewed code', 'introHold': 3.4, 'introSfx': False,
        'outro': 'Devin, by Cognition', 'outroSub': 'devin.ai  ·  cognition.com', 'speed': 1, 'cps': 48, 'maxZoom': 1, 'voSentGap': 0.3, 'pace': 1.5, 'edit': edit}
if os.environ.get('NO_CAPTIONS'): spec['noSubs'] = True
open(os.path.join(HERE, 'spec.js'), 'w').write('window.SPEC = ' + json.dumps(spec, indent=1) + ';\n')
with open(os.path.join(HERE, 'voice-script.md'), 'w') as f:
    f.write('# How we keep code quality high with Devin (v10): narration script\n\n' + '\n\n'.join(LINES[l] for l, _ in P if l != 'CARD') + '\n')
print(len(beats), 'beats;', words, 'words; lines', len([l for l, _ in P if l != 'CARD']), 'of', len(LINES))
