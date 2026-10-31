"""Writes spec.js (pure JSON, as vo_onetake.py needs) from the edit plan below, and adds the scene placeholder beats. Usage: python3 make_spec.py"""
import json, os, subprocess
D = os.path.dirname(os.path.abspath(__file__))
BJ = f'{D}/shots/beats.json'
beats = json.load(open(BJ))
G = json.load(open(f'{D}/shots/term.json'))
SCENES = ['scene-title.png', 'scene-how.png']
if beats[0]['img'] != SCENES[0]:
    beats = [{'img': s, 'cursor': False} for s in SCENES] + beats
    json.dump(beats, open(BJ, 'w'), indent=1)
for s in SCENES:
    if not os.path.exists(f'{D}/shots/{s}'):
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', 'color=c=0xFCFCFC:s=4320x2430', '-frames:v', '1', f'{D}/shots/{s}'], check=True)
txt = {b['img']: b.get('txt', '') for b in beats}

def cells(r0, r1, c0, c1, pad=6):
    L, R = G['x'] + c0 * G['cw'] - pad, G['x'] + (c1 + 1) * G['cw'] + pad
    T, B = G['y'] + r0 * G['ch'] - pad, G['y'] + (r1 + 1) * G['ch'] + pad
    return {'x': round((L + R) / 2), 'y': round((T + B) / 2), 'w': round(R - L), 'h': round(B - T)}

def find(img, s, rows=1):
    for i, l in enumerate(txt[img].split('\n')):
        if s in l:
            c0 = len(l[:l.index(s)]); return cells(i, i + rows - 1, c0, c0 + len(s) - 1)
    raise SystemExit(f'{img}: no {s!r}')

def box(x0, y0, x1, y1):  # corners in the 1568-px-wide review screenshots -> 1440x810 UI px
    f = 1440 / 1568
    return {'x': round((x0 + x1) / 2 * f), 'y': round((y0 + y1) / 2 * f), 'w': round((x1 - x0) * f), 'h': round((y1 - y0) * f)}

E = {}
def ed(img, **k): E[img if isinstance(img, str) else f'{img:04d}.png'] = k
KEEP_POLLS = {45, 55, 64, 134}
for b in beats:
    if b.get('kind') == 'poll' and int(b['img'][:4]) not in KEEP_POLLS: ed(b['img'], skip=True)
ed(125, skip=True)

ed('scene-title.png', scene='title', hold=1.0, voDelay=1.9,
   vo="Devin can start in your terminal and hand off to the cloud.")
ed('scene-how.png', scene='how', hold=1.0,
   vo="Start a task in the Devin CLI. When it needs a server, a browser, or more time, type slash handoff. "
      "A cloud Devin picks it up on its own machine, with your repo and branch, the conversation, and your uncommitted changes, and finishes with a pull request.")
ed(0, hold=0.6, vo="Here I'm in the ledger API repo on my laptop, running the Devin CLI.")
ed(8, hold=0.6)
ed(12, vo="I ask for an endpoint that lists overdue invoices.")
ed(38, hold=0.8, ring=find('0038.png', 'Add GET /api/workspaces/:id/reports/overdue'), ringFor=1.6)
ed(45, hold=0.9, vo="Devin reads the routes and the seed data, adds the endpoint, and writes a test.")
ed(55, hold=0.9, ring=cells(14, 14, 3, 38), ringFor=1.4)
ed(64, hold=0.8)
ed(66, hold=1.0, vo="When it asks to run the tests, I decline. That's the part I'll hand off.",
   ring=find('0066.png', 'Exec(npm test)'), ringFor=1.6, subPos='top')
ed(67, hold=0.9, ring=find('0067.png', 'Deny'), ringFor=1.0, subPos='top')
ed(70, hold=0.5)
ed(71, vo="I type slash handoff with the rest of the job: run the suite, check the endpoint on a live server, and open a pull request.",
   voSay="I type slash handoff, with the rest of the job: run the suite, check the endpoint on a live server, and open a pull request.")
ed(105, hold=1.0, ring=find('0105.png', '/handoff'), ringFor=1.4)
ed(113, hold=1.0, vo="Then I pick Ubuntu for the cloud machine.", ring=find('0113.png', 'Ubuntu'), ringFor=1.6, subPos='top')
ed(118, hold=1.2, vo="The task is handed off, with a link to the cloud session, and my terminal is free again.",
   ring=find('0118.png', 'Handed task off to cloud Devin'), ringFor=2.2)
ed(126, hold=1.0, vo="Pressing down previews cloud agents right from the CLI.", ring=find('0126.png', 'Run the test suite, start the server and check'), ringFor=2.0, subPos='top')
ed(134, hold=0.8)
ed(135, hold=1.0, vo="In the web app, the cloud session starts from my request, with the diff from my local clone attached.",
   ring=box(228, 233, 598, 291), ringDelay=1.6, ringFor=2.2, cam={'x': 420, 'y': 300, 'z': 1.2}, camDur=1.2)
ed(136, cam='reset')
ed(137, hold=1.0, vo="That's the endpoint and test Devin wrote on my laptop.", ring=box(640, 66, 1557, 104), ringFor=1.8)
ed(138, hold=1.0, vo="Devin applies the diff, runs the tests, checks the endpoint, and opens a pull request.",
   ring=box(30, 483, 598, 622), ringDelay=1.8, ringFor=2.0)
ed(139, hold=1.0, vo="It reports all seven tests passing, CI passing too, and a live check of the endpoint against a seeded server.",
   ring=box(28, 150, 600, 200), ringFor=2.4, cam={'x': 380, 'y': 300, 'z': 1.2}, camDur=1.2)
ed(140, hold=0.6, vo="It even flags an unprotected CSV export, and asks before fixing it.", ring=box(26, 498, 602, 620), ringDelay=0.2, ringFor=2.6, cam='reset')
ed(141, hold=1.0, vo="The pull request describes the change, and exactly how it was tested.", ring=box(636, 456, 1556, 528), ringFor=2.2)
ed(143, hold=1.0, vo="And its check has passed.", ring=box(655, 140, 1540, 240), ringFor=1.2)

missing = [k for k in E if k not in txt]
if missing: raise SystemExit(f'edits for missing beats: {missing}')
old = {}
p = f'{D}/spec.js'
if os.path.exists(p):
    old = json.loads(open(p).read().split('=', 1)[1].rstrip().rstrip(';'))
spec = {
    'title': 'Devin can start in your terminal and hand off to the cloud',
    'subtitle': 'Devin CLI · /handoff',
    'outro': 'Start in your terminal. Finish in the cloud.',
    'voOutro': 'Start in your terminal, hand off to the cloud, and come back to a pull request.',
    'outroVoDelay': -0.15, 'introHold': 0, 'pace': 1, 'speed': 3, 'cps': 60, 'pollRunMax': 2.0,
    'voSentGap': 0.45, 'maxZoom': 1.3,
    'edit': E,
}
if 'voLines' in old: spec['voLines'] = old['voLines']
open(p, 'w').write('window.SPEC = ' + json.dumps(spec, indent=1) + ';\n')
print('beats', len(beats), 'edits', len(E), 'vo', sum(1 for v in E.values() if 'vo' in v))
