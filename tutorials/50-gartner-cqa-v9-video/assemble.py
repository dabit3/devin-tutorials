# Builds shots/, spec.js and voice-script.md for the v9 Code Quality Assurance video (first person, still camera, cursor visible).
#   python3 assemble.py   (NO_CAPTIONS=1 for the caption-free build)
import json, os, re, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
G = os.path.expanduser('~/gartner')
SCRIPT = G + '/v9/Gartner-CQA-script-v9.md'
LINES = {m.group(1): m.group(2).strip() for m in re.finditer(r'^\| (\w+) \| ([^|]+) \|', open(SCRIPT).read(), re.M) if m.group(1) != '#'}
DIRS = {'n9': G + '/v9/shots', 'v3': G + '/v3'}
VOJ = os.path.join(HERE, 'vo', 'T8iHhGIWPm2GVYpQD1Am', 'lines.json')
VOD = {v['text']: v['dur'] for v in json.load(open(VOJ)).values()} if os.path.exists(VOJ) else {}
T = lambda d, a, b, step=1: [f'{d}/{i:04d}.png' for i in range(a, b + 1, step)]
# each line: list of (image, text, extra) ; text None = whole line; '' + at='phrase' = cut in when that phrase is spoken
# CARD:<name> = section card scene
P = [
 ('1', [('n9:agents/0000.png', None)]),
 ('2', [('n9:agents/0000.png', None), ('n9:agents/0002.png', '', 'three of'), ('n9:agents/0004.png', '', 'Devin Oncall'), ('n9:agents/0008.png', '', 'Devin Security'), ('v3:shots/r24m-review-home.png', '', 'and Devin Review')]),
 ('3', [('n9:agents/0005.png', 'Each one is built for a single job. Oncall is a site reliability agent with its own harness.'), ('n9:agents/0008.png', 'Security uses agentic MapReduce to scan a whole codebase.'), ('v3:shots/n-rv9.png', 'Review uses adversarial agents, where some agents find problems and others try to disprove them.')]),
 ('4', [('n9:gov/0004.png', 'S0'), ('n9:readme/0001.png', 'S1')]),
 ('5', [('n9:context/0001.png', 'Before any work starts, Devin pulls in our context. That includes the AGENTS.md file in each repository,'), ('v3:onc2/0012.png', 'our runbooks, and tools like Slack that we connect through MCP.'), ('n9:context/0002.png', '', 'like Slack')]),
 ('6', [('n9:context/0001.png', None)]),
 ('6a', [('n9:wiki/0000.png', None), ('n9:wiki/0001.png', '', 'DeepWiki')]),
 ('6b', [('n9:wiki/0003.png', 'When I have a question, I ask in chat. Here I ask how a claim moves from submission to approval,')] + [('n9:' + f, '', ('TYPE', 0.4 + 0.16 * k)) for k, f in enumerate(T('wiki', 4, 28))] + [('n9:answer/0000.png', 'and Devin answers with links to the code.'), ('n9:answer/0001.png', '', 'links')]),
 ('CARD', 'ch1'),
 ('7', [('v3:onc2/0010.png', None)]),
 ('8', [('v3:shots/n-ios-trigger.png', None)]),
 ('9', [('v3:re-ios/0000.png', None)]),
 ('10', [('v3:re-ios/0003.png', 'S0'), ('v3:re-ios/0005.png', '', 'same crash'), ('v3:re-ios/0008.png', 'S1')]),
 ('11', [('v3:re-ios/0004.png', None)]),
 ('12', [('v3:re-ios/0014.png', None)]),
 ('13', [('v3:shots/o02-issue.png', None)]),
 ('14', [('v3:shots/n-win-rc-a.png', 'S0'), ('v3:shots/o10-win-repro-msg.png', 'S1'), ('v3:shots/n-win-rc-b.png', '', 'finds a missing')]),
 ('15', [('v3:shots/o08-oncall-pr3-review.png', None), ('v3:shots/d01-desktop-review-info.png', '', 'in Devin Desktop')]),
 ('CARD', 'ch2'),
 ('16', [('v3:re-suite/0000.png', None)]),
 ('17', [('v3:re-suite/0001.png', None)]),
 ('18', [('v3:suite4/0003.png', None)]),
 ('19', [('v3:re-win/0000.png', 'For apps with a UI, Devin tests in the running app.'), ('v3:re-win/0003.png', 'On Windows it drives the desktop app,'), ('n9:android/0002.png', 'and on Linux it runs our Android app in an emulator.'), ('n9:android/0001.png', '', 'emulator')]),
 ('20', [('v3:shots/w01-pr2-github.png', None), ('v3:shots/w02-pr2-screenshots.png', '', 'screenshots')]),
 ('21', [('v3:shots/n-host-menu.png', None)]),
 ('CARD', 'ch3'),
 ('22', [('v3:shots/r24m-review-home.png', 'S0'), ('n9:gov/0004.png', 'S1+')]),
 ('23', [('v3:fresh9b/0004.png', None)]),
 ('24', [('n9:rvchat/0002.png', 'S0')] + [('n9:' + f, '', ('TYPE', 0.3 + 0.12 * k)) for k, f in enumerate(T('rvchat', 3, 25, 2))] + [('n9:rvchat/0052.png', 'S1+')]),
 ('25', [('v3:ci9r/0000.png', 'S0'), ('v3:ci9r/0003.png', 'S1')]),
 ('26', [('v3:ci9r/0002.png', None)]),
 ('27', [('v3:stack9r/0000.png', 'S0'), ('v3:stack9r/0001.png', 'S1')]),
 ('28', [('n9:gov/0007.png', 'S0'), ('n9:readme/0000.png', '', 'README'), ('v3:rv14/0000.png', 'S1')]),
 ('CARD', 'ch4'),
 ('29', [('n9:agents/0008.png', 'S0'), ('v3:shots/s04-threat.png', 'S1'), ('v3:shots/s05-q2.png', '', 'threat model')]),
 ('30', [('v3:shots/s15-findings.png', 'S0'), ('v3:shots/s16-finding.png', 'S1')]),
 ('31', [('v3:shots/s18-how.png', 'Security writes down its reasoning,'), ('v3:shots/s33-validation-section.png', 'then verifies that the attack works before it reports it.')]),
 ('32', [('v3:shots/n-fix-btn.png', None), ('v3:shots/s20-fix-clicked.png', '', 'starts a session'), ('v3:shots/s23-pr8.png', '', 'opens a pull request'), ('v3:shots/s34-pr8-review.png', '', 'which Review')]),
 ('CARD', 'ch5'),
 ('33', [('v3:re-wf/0000.png', None)]),
 ('34', [('v3:re-wf/0004.png', 'S0'), ('v3:shots/n-sessions.png', 'S1')]),
 ('35', [('v3:shots/n-sessions.png', None), ('v3:shots/n-slack.png', '', 'from Slack'), ('v3:shots4k/desk10-info.png', '', 'Devin Desktop'), ('v3:shots/n-api.png', '', 'the API')]),
 ('36', [('n9:gov/0004.png', None), ('n9:gov/0002.png', '', 'what they can spend'), ('n9:gov/0001.png', '', 'see usage')]),
 ('37', [('v3:shots/n-merge.png', None)]),
 ('38', [('v3:shots/r24m-review-home.png', None)]),
]
HOLDX = {('6b', 'n9:answer/0001.png'): 1.6, ('24', 'n9:rvchat/0052.png'): 2.5, ('4', 'n9:readme/0001.png'): 1.2, ('38', 'v3:shots/r24m-review-home.png'): 1.5, ('6a', 'n9:wiki/0001.png'): 1.2}
SAY = [('CWE', 'C W E'), ('AGENTS.md', 'agents dot M D'), ('README', 'read-me'), ('MapReduce', 'map-reduce'), ('CI,', 'C I,'), ('CI ', 'C I '), ('CI.', 'C I.'), ('VMs', 'V Ms'), ('VM', 'V M'), ('iOS', 'i O S'), ('MCP', 'M C P'), ('API', 'A P I'), ('UI', 'U I'), ('DeepWiki', 'Deep Wiki')]
out = os.path.join(HERE, 'shots'); shutil.rmtree(out, ignore_errors=True); os.makedirs(out)
BJ = {}
def beat(src):
    pfx, rel = src.split(':', 1); path = os.path.join(DIRS[pfx], rel); d = os.path.dirname(path)
    if d not in BJ:
        f = os.path.join(d, 'beats.json'); BJ[d] = {b['img']: b for b in json.load(open(f))} if os.path.exists(f) else {}
    b = dict(BJ[d].get(os.path.basename(path), {}))
    for k in ('kind', 'at', 'mark', 'n', 'paste', 'chars', 'target', 'clickAt', 'hl', 'line', 'tag', 'hold'): b.pop(k, None)
    b.setdefault('cur', {'x': 1180, 'y': 700})
    return path, b
def say(t):
    for a, z in SAY: t = re.sub(r'\b' + re.escape(a), z, t) if a[0].isalnum() else t.replace(a, z)
    return t
beats, edit, words = [], {}, 0
blank = os.path.join(DIRS['n9'], 'agents/0000.png')
for ln, parts in P:
    if ln == 'CARD':
        new = f'{len(beats):04d}.png'; shutil.copy(blank, os.path.join(out, new)); beats.append({'img': new, 'src': 'card', 'cur': {'x': 1180, 'y': 700}})
        edit[new] = {'hold': 2.2, 'scene': parts, 'cursor': False}; continue
    line = LINES[ln]; sents = re.split(r'(?<=[.!?])\s+', line)
    texts = []; cur = None
    for p in parts:
        img, t = p[0], p[1]; at = p[2] if len(p) > 2 else None
        if t is None: t = line
        elif re.fullmatch(r'S\d\+?', t): t = ' '.join(sents[int(t[1]):] if t.endswith('+') else [sents[int(t[1])]])
        if t: texts.append(t); cur = t
        path, b = beat(img); new = f'{len(beats):04d}.png'; shutil.copy(path, os.path.join(out, new)); b.update(img=new, src=img)
        beats.append(b); e = {'hold': 0.5 if not t else 0.6, 'cursor': True, 'hl': None, 'capPos': 'bottom', 'line': ln}
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
spec = {'title': 'Code quality assurance with Devin', 'subtitle': 'From a production alert or a pull request to tested, reviewed code', 'introHold': 3.4,
        'outro': 'Devin, by Cognition', 'outroSub': 'devin.ai  ·  cognition.com', 'speed': 1, 'cps': 48, 'maxZoom': 1, 'voSentGap': 0.3, 'pace': 1.5, 'edit': edit}
if os.environ.get('NO_CAPTIONS'): spec['noSubs'] = True
open(os.path.join(HERE, 'spec.js'), 'w').write('window.SPEC = ' + json.dumps(spec, indent=1) + ';\n')
with open(os.path.join(HERE, 'voice-script.md'), 'w') as f:
    f.write('# How we keep code quality high with Devin (v9): narration script\n\n' + '\n\n'.join(LINES[l] for l, _ in P if l != 'CARD') + '\n')
print(len(beats), 'beats;', words, 'words; lines', len([l for l, _ in P if l != 'CARD']), 'of', len(LINES))
