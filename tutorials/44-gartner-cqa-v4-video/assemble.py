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
 1: ['k:intro-slide-4k.png'], 2: ['su:0000.png'],
 3: ['v:v03-review-settings-0.png'], 4: ['v:v03-review-settings-0.png'], 5: ['v:v03-review-settings-0.png'], 6: ['v:v06-review-trigger.png'],
 7: ['d10:0000.png'], 8: ['d10:0003.png'], 9: ['f10:0004.png'], 10: ['f10:0000.png'], 11: ['f10:0046.png'], 12: ['f10:0070.png'],
 13: ['k:desk10-info.png', 'k:desk10-asked.png'], 14: ['v:v06-review-trigger.png'], 15: ['v:v15-review-billing.png', 'v:fix16-ctx-tooltip.png'],
 16: ['f9b:0000.png'], 17: ['f9b:0001.png'], 18: ['f9b:0004.png'], 19: ['f9b:0007.png'], 20: ['f9:0057.png'],
 21: ['v:s04-threat.png', 'v:s05-q2.png'], 22: ['v:s24-References.png'], 23: ['v:s33-validation-section.png'], 24: ['v:s34-pr8-review.png'],
 25: ['c9:0000.png'], 26: ['c9:0002.png'], 27: ['c9:0003.png'], 28: ['c9:0001.png'],
 29: ['rv13:0000.png'], 30: ['st9:0001.png'], 31: ['rv12:0000.png', 'rv14:0000.png'],
 32: ['rsu:0000.png'], 33: ['s4:0005.png'], 34: ['s4:0001.png'], 35: ['s2:0006.png'], 36: ['s4:0003.png'], 37: ['rsu:0001.png', 's4:0000.png'],
 38: ['rwin:0000.png'], 39: ['rwin:0003.png', 'b3:0012.png'],
 40: ['rwf:0000.png'], 41: ['b3:0007.png'], 42: ['rwf:0004.png'], 43: ['rwf:0005.png'],
 44: ['onc2:0010.png'], 45: ['onc2:0012.png'], 46: ['rios:0000.png'], 47: ['rios:0008.png'], 48: ['rios:0004.png'], 49: ['rios:0014.png'],
 50: ['v:o03-investigation.png', 'v:o10-win-repro-msg.png'], 51: ['v:o08-oncall-pr3-review.png'],
 52: ['v:r24m-review-home.png'], 53: ['v:r24m-review-home.png'], 54: ['v:r24m-review-home.png'], 55: ['v:r24m-review-home.png'],
}
# lines shown over several screens, split at commas or sentences: (src, text, hold or None); texts joined by spaces = the line
PARTS = {
 2: [('v:n-sessions.png', 'The demo goes through each stage in order.', None, None),
     ('d10:0000.png', 'It starts with writing code and opening a pull request.', None, None),
     ('v:s15-findings.png', 'Then it covers security, a failing build, a refactor, new tests, and production bugs.', 0.6, None),
     ('c9:0000.png', '', 0.6, 1.5), ('st9:0001.png', '', 0.6, 2.4), ('s4:0000.png', '', 0.6, 3.1), ('v:n-ios-trigger.png', '', 0.6, 3.8)],
 4: [('v:n-agents-md.png', 'The team keeps its rules in a file called AGENTS.md. One rule is that every bug fix needs a regression test, which is a test that proves the bug stays fixed.', None, None),
     ('v:n-rv9.png', 'Devin follows this rule when it writes code, and Devin Review flags pull requests that break it.', None, None),
     ('v:n-merge.png', 'Devin opens pull requests, and a person on the team approves every merge.', None, None)],
 5: [('v:n-agents-menu.png', 'Devin includes specialized agents, which are agents built for one job.', None, None),
     ('v:n-sessions.png', 'Each one runs in its own session, with its own context, and the team manages them from the web app, Devin Desktop, Slack, or the API.', 0.8, None),
     ('k:desk10-info.png', '', 0.55, 5.15), ('v:n-slack.png', '', 0.2, 6.1), ('v:n-api.png', '', 0.6, 6.6)],
 6: [('v:n-agents-menu.png', 'This video uses three.', 0.6, None),
     ('v:n-rv9.png', 'Devin Review uses adversarial agents. Some agents look for problems, and other agents try to prove each problem is wrong.', None, None),
     ('v:s13.png', 'Devin Security uses agentic MapReduce to scan a whole codebase.', 0.8, None),
     ('v:n-oncall.png', 'Devin Oncall is a site reliability agent with its own harness.', 0.8, None)],
 24: [('v:n-fix-btn.png', 'One click on Fix with Devin starts a fix.', 0.6, None),
      ('v:s34-pr8-review.png', 'Devin makes the service require a signed header from the gateway, adds tests, and opens a pull request. Devin Review reviews it like any other change.', 0.6, None)],
 42: [('rwf:0000.png', 'It starts one agent for each of the six packages.', 0.6, None),
      ('v:n-sessions.png', 'Each agent runs in its own session, with its own context.', 0.6, None),
      ('rwf:0004.png', 'It writes unit and integration tests, runs them, and pushes a branch.', 0.6, None)],
 45: [('onc2:0012.png', "The responder can use the team's tools through MCP, such as Slack, and it follows the team's runbook.", 0.6, None),
      ('rios:0005.png', 'It runs on a macOS VM with Xcode and the iOS Simulator.', 0.6, None)],
 46: [('v:n-ios-trigger.png', 'A crash monitor sends an alert, and Devin Oncall starts a session. The alert has the stack trace and the breadcrumbs, which are the last steps the user took.', 0.6, None)],
 47: [('rios:0003.png', 'Devin follows the breadcrumbs in the iOS Simulator and gets the same crash.', 0.6, None),
      ('rios:0005.png', '', 0.6, 2.6),
      ('rios:0008.png', 'The cause is a division by zero when an estimate has no line items.', 0.6, None)],
 50: [('v:o03-investigation.png', 'Here the alert comes from a Windows desktop app.', 0.6, None),
      ('v:n-win-rc-a.png', 'Oncall starts a session on a Windows virtual machine and reports that it reproduced the crash.', 0.6, None),
      ('v:n-win-rc-b.png', 'It finds the cause, a missing claim type in the approval rules, writes a fix with unit tests and a UI test, and reports its confidence.', 0.6, None)],
 53: [('v:r24m-review-home.png', 'Devin fixed a failing build, split a refactor into small pull requests, wrote and ran a whole test suite, and fixed production crashes on macOS and Windows.', 0.6, None),
      ('rios:0005.png', '', 0.6, 6.4), ('v:o08-oncall-pr3-review.png', '', 0.6, 8.0)],
 54: [('v:n-host-menu.png', 'This works on Linux, macOS, and Windows VMs, with the iOS Simulator and Android emulators.', 0.6, None),
      ('rios:0005.png', '', 0.6, 2.9)],
}
HOLD = {}
FRESH = {p: os.path.expanduser('~/gartner/v3/' + d) for p, d in (('d10', 'draft10a'), ('f10', 'fresh10'), ('f9', 'fresh9'), ('f9b', 'fresh9b'), ('su', 'suite'), ('s2', 'suite2'), ('s4', 'suite4'), ('rsu', 're-suite'), ('rci', 're-ci'), ('ci2', 'ci2'), ('rst', 're-stack'), ('rwin', 're-win'), ('rwf', 're-wf'), ('rios', 're-ios'), ('b3', 'b3'), ('onc', 'onc'), ('onc2', 'onc2'), ('c9', 'ci9r'), ('st9', 'stack9r'), ('rv12', 'rv12'), ('rv13', 'rv13'), ('rv14', 'rv14'))}
FB = {p: {b['img']: b for b in json.load(open(os.path.join(d, 'beats.json')))} for p, d in FRESH.items()}
HLV6 = json.load(open(os.path.join(HERE, 'hl-v6.json')))  # 'line:src' -> boxes (1440x810, center + size)
HL4 = {'o10-win-repro-msg.png': {'x': 72, 'y': 330, 'w': 425, 'h': 118}}
SAY = [('CWE-862', 'CWE eight six two'), ('CWE-290', 'CWE two ninety'), ('REVIEW.md', 'review dot M D'), ('AGENTS.md', 'agents dot M D'), ('999,999', 'nine hundred and ninety-nine thousand nine hundred and ninety-nine'),
       ('CI,', 'C I,'), ('CI ', 'C I '), ('CI.', 'C I.'), ('VMs', 'V Ms'), ('VM', 'V M'), ('iOS', 'i O S'), ('MCP', 'M C P'), ('API', 'A P I')]
out = os.path.join(HERE, 'shots'); shutil.rmtree(out, ignore_errors=True); os.makedirs(out)
beats, edit, order = [], {}, []
for ln in sorted(MAP):
    imgs, vo = MAP[ln], LINES[ln]
    sents = re.split(r'(?<=[.!?])\s+', vo)
    if ln in PARTS:
        assert ' '.join(t for _, t, _, _ in PARTS[ln] if t) == vo, ln
        for img, part, hold, sync in PARTS[ln]: order.append((ln, img, part)); HOLD[(ln, img, part)] = (hold, sync)
        continue
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
    hold, sync = HOLD.get((ln, src, vo), (None, None))
    e = {'hold': hold or 2.5, 'cursor': False, 'hl': None, 'capPos': 'bottom', 'line': ln}
    if src in HL: e.update(hl=HL[src], hlDelay=0.5)
    elif src[2:] in HL4: e.update(hl=HL4[src[2:]], hlDelay=0.5)
    elif f"{ln}:{b['src']}" in HLV6: e.update(hl=HLV6[f"{ln}:{b['src']}"], hlDelay=0.5)
    elif b.get('hl'): e.update(hl=b['hl'], hlDelay=0.5)
    if sync is not None: e['voSync'] = sync
    if not vo: edit[new] = e; continue
    e['vo'] = vo; say = vo
    for a, z in SAY: say = say.replace(a, z)
    if say != vo: e['voSay'] = say
    edit[new] = e
json.dump(beats, open(os.path.join(out, 'beats.json'), 'w'), indent=1)
spec = {'title': '', 'subtitle': '', 'introHold': 0.2, 'outro': 'Devin, by Cognition', 'outroSub': 'devin.ai  ·  cognition.com',
        'speed': 1, 'cps': 48, 'maxZoom': 1.4, 'voSentGap': 0.3, 'pace': 1.5, 'edit': edit}
if os.environ.get('NO_CAPTIONS'): spec['noSubs'] = True
open(os.path.join(HERE, 'spec.js'), 'w').write('window.SPEC = ' + json.dumps(spec, indent=1) + ';\n')
with open(os.path.join(HERE, 'voice-script.md'), 'w') as f:
    f.write('# Code Quality Assurance with Devin (v4): narration script\n\n')
    for _, _, vo in order:
        if vo: f.write(vo + '\n\n')
print(len(beats), 'beats;', sum(len(v.split()) for _, _, v in order), 'words')
