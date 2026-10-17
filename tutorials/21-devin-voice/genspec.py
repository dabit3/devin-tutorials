"""Writes spec.js for tutorial 21 (the Jumpy Otter take) from shots/beats.json, then synccall.py locks the call stills to real time."""
import json, os, subprocess
D = os.path.dirname(os.path.abspath(__file__))
S = os.path.join(D, 'shots')
B = json.load(open(os.path.join(S, 'beats.json')))
I = lambda n: f'{n:04d}.png'
E = {}
def ed(n, **k): E.setdefault(I(n), {}).update(k)
def skip(a, b):
    for n in range(a, b + 1): ed(n, skip=True)

# The live gameplay intro (intro/) is spliced in front of this cut by splice.py; the kit cut starts at the session.
ed(0, hold=1.4, cursor=False, cap='Start in a new Devin session',
   vo="Here's how I built it, starting from a new Devin session.")
ed(3, hl=True, hold=1.0, cap='Pick macOS so Devin can run the iPhone simulator', capPos='auto')
ed(1, vo="First, switch the virtual environment from Ubuntu to macOS, so Devin can run the iPhone simulator.")
ed(5, hl=True)
ed(6, hold=1.4, hl=True, capPos='auto', cap='Ubuntu → macOS')
ed(7, hold=0.8)
ed(8, cap='Start a voice call with the waveform button', capPos='auto', hl=True,
   vo="Then click the waveform button beside the message box to start a voice call. Devin Voice uses ChatGPT voice under the hood.")

calls = {}
for n, b in enumerate(B):
    if b.get('call'): calls.setdefault(b['call'], []).append((n, b))
kept = {}
for name in calls:
    m = json.load(open(os.path.join(S, name + '.json')))
    kept[name] = [(n, b) for n, b in calls[name] if m['t0'] <= b['wall'] < m['t1']]
CAPS1 = {'greeting': 'Devin picks up and says hi', 'say0': 'Pitch the game: Jumpy Otter, one Expo codebase',
         'say1': 'Add Coach Otto, a voice sidekick built on GPT-Live-1', 'interrupt1': 'Interrupt mid-answer: Otto runs game tools and switches style',
         'say2': 'Docs tip: ask Devin to speak faster', 'say3': 'Keep the key on a server; test web, iPhone, and Android on Ubuntu',
         'say4': 'Then let Devin start building'}
CAPS2 = {'greeting': 'Same session: the call picks up where it left off', 'say0': "Ask how the game's coming along",
         'interrupt0': 'Interrupt Devin mid-sentence'}
for name, caps in (('call1', CAPS1), ('call2', CAPS2)):
    seen = set()
    for n, b in kept[name]:
        if b['phase'] in caps and b['phase'] not in seen: seen.add(b['phase']); ed(n, cap=caps[b['phase']])
# mute / silence highlight while Devin answers the interruption
r1 = [n for n, b in kept['call1'] if b['phase'] == 'reply1' and n > [m for m, c in kept['call1'] if c['phase'] == 'interrupt1'][0]][0] + 1
ed(r1, hl=[B[r1]['mute'], B[r1]['silence']], cap='Mute your mic, or silence Devin, any time')
for n in range(r1 + 1, r1 + 7): ed(n, hl='keep')
r3 = [n for n, b in kept['call1'] if b['phase'] == 'reply3'][0] + 6
ed(r3, cap='Every turn lands in the session history')

mark = lambda m, after=0: [n for n, b in enumerate(B) if b.get('mark') == m and n > after][0]
end1, rejoin = mark('call1-ended'), mark('rejoin')
ed(end1, cap='End the call; Devin keeps working', hl=True)
ed(end1 + 1, hold=1.6, cap='Devin builds the game and wires up GPT-Live-1',
   vo="Devin sets up the Expo project, builds the voxel city, and connects Coach Otter to GPT-Live-1 through a small server that keeps the API key.")
ed(end1 + 4, badge='Sped up')
skip(end1 + 5, 329)
ed(330, hold=1.6, cap='The game running on the iPhone simulator',
   vo="Soon the game is running on the iPhone simulator, live in the Computer tab.")
ed(rejoin, hold=1.2, hl=True, cap='Rejoin the call from inside the session',
   vo="Mid-build, you can rejoin the call from inside the session and ask how the game's coming along.")
end2 = mark('call2-ended')
ed(end2, hl=True, cap='End the call again')
skip(end2 + 1, 513)
ed(514, hold=2.0, cap='A second Devin on Ubuntu tests Android',
   vo="Devin starts a second Devin on Ubuntu to test Android. Its update says Coach Otter already talks on the web, and runs tools while he talks.")
skip(515, 635)
ed(636, hold=1.4, cap='Computer Use plays the web build in Chrome',
   vo="Then it plays the web build in Chrome with Computer Use.")
skip(671, 699)
ed(700, hold=1.4, cap='iPhone simulator: Coach tested with typed input',
   vo="On the iPhone simulator, audio doesn't work on this Mac, so Devin types to Coach instead of talking.")
skip(701, 732); skip(734, 744); skip(746, 750); skip(752, 1093)
web, ios, android = [n for n, b in enumerate(B) if b.get('mark') == 'card']
ed(web, hold=1.6, cap='Every test run comes with a recording and checks',
   vo="Every test comes with a recording and pass fail checks.")
ed(web + 3, cap='Chrome: 11 passed, 1 untested',
   vo="In Chrome, Coach connects, runs the boost, night, and best score tools, and switches style. Eleven checks pass, and one is left untested.")
skip(web + 27, ios - 1)
ed(ios, hold=1.2, cap='iPhone: 8 passed, with typed input',
   vo="On the iPhone, the tools, both styles, and reconnecting all work, and eight checks pass. The voice you heard at the start ran in Chrome.")
skip(ios + 27, android - 1)
ed(android, hold=1.4, cap='Android, tested by the Ubuntu Devin: 12 passed',
   vo="The Ubuntu Devin ran the game on an Android emulator with software rendering. All twelve checks pass, Coach tools included.")
skip(android + 28, mark('tab') - 1)
tab = mark('tab')
ed(tab + 2, hold=1.8, cap='Devin opens a PR with the reports')
skip(tab + 3, tab + 3)
ed(tab + 4, hold=1.2)
ed(tab, vo="Then it opens a pull request with the code, the reports, and the recordings.")
spec = {'title': 'Devin Voice + GPT-Live-1', 'subtitle': 'Build and test a cross-platform game by voice',
        'outro': 'One call: iOS, Android and web',
        'voOutro': "That's how you build and test a cross-platform game with your voice, using Devin Voice and GPT-Live-1.", 'speed': 3, 'cps': 48, 'capPos': 'bottom',
        'pollRunMax': 2.5, 'edit': E}
# narrated cut only: keep silences between lines near 1 s (calls untouched)
I4 = lambda n: f'{n:04d}.png'
NARRATED_JS = """const NARRATED = !!new URLSearchParams(location.search).get('voice');
if (NARRATED) {
  SPEC.pollRunMax = 1.0;
  for (const [k, v] of Object.entries(%s))
    Object.assign(SPEC.edit[k] ??= {}, v);
}
""" % json.dumps({I4(end1): {'travel': 0.45, 'dwell': 0.1}, I4(end1 + 1): {'hold': 0.35}, I4(end2): {'travel': 0.45, 'dwell': 0.1}})
open(os.path.join(D, 'spec.js'), 'w').write('window.SPEC = ' + json.dumps(spec, indent=2) + ';\n' + NARRATED_JS)
subprocess.run(['python3', os.path.join(D, 'synccall.py')], check=True)
