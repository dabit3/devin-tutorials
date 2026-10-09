"""Writes spec.js for tutorial 21 from shots/beats.json, then synccall.py locks the call stills to real time."""
import json, os, subprocess
D = os.path.dirname(os.path.abspath(__file__))
B = json.load(open(os.path.join(D, 'shots', 'beats.json')))
I = lambda n: f'{n:04d}.png'
E = {}
def ed(n, **k): E.setdefault(I(n), {}).update(k)
def skip(a, b):
    for n in range(a, b + 1): ed(n, skip=True)
ed(0, hold=2.6, cursor=False, cap='Devin Voice: build an app by talking to Devin',
   vo="This is Devin Voice. You can talk an app into existence, and then watch Devin build it and test it.")
ed(1, cap='Pick macOS so Devin can run the iPhone and iPad simulators', capPos='auto', hl=True,
   vo="First, open Configuration and switch the virtual environment from Ubuntu to macOS, so Devin can run the iPhone and iPad simulators.")
ed(3, hl=True, hold=1.0)
ed(5, hl=True)
ed(6, hold=1.4, hl=True, capPos='auto', cap='Ubuntu → macOS')
ed(7, hold=0.8)
ed(8, cap='Start a voice call with the waveform button', capPos='auto', hl=True,
   vo="Then click the waveform button beside the message box to start a voice call.")
# call 1 captions: first still of each phase, spaced by synccall's capMin check
calls = {}
for n, b in enumerate(B):
    if b.get('call'): calls.setdefault(b['call'], []).append((n, b))
CAPS1 = {'greeting': 'Devin picks up and says hi', 'say0': 'Describe the app: Mise, one Expo codebase',
         'say1': 'Six recipes and a hands-free Cook Mode', 'interrupt1': 'Change your mind mid-call: a wide web layout',
         'say2': 'Docs tip: ask Devin to speak faster', 'say3': 'Tell it where the code goes and how to test',
         'say4': 'Then let Devin start building'}
CAPS2 = {'greeting': 'Same session: the call picks up where it left off', 'say0': 'Ask how it\'s going',
         'interrupt0': 'Interrupt Devin mid-sentence; it keeps going'}
for name, caps in (('call1', CAPS1), ('call2', CAPS2)):
    seen = set()
    for n, b in calls[name]:
        if b['phase'] in caps and b['phase'] not in seen: seen.add(b['phase']); ed(n, cap=caps[b['phase']])
# mute / silence highlight during Devin's reply to the change request
r1 = [n for n, b in calls['call1'] if b['phase'] == 'reply1' and n > 83][:1][0] + 4
ed(r1, hl=[B[r1]['mute'], B[r1]['silence']], cap='Mute your mic, or silence Devin, any time')
for n in range(r1 + 1, r1 + 9): ed(n, hl='keep')
r3 = [n for n, b in calls['call1'] if b['phase'] == 'reply3'][0] + 6
ed(r3, cap='Every turn lands in the session history')
ed(199, cap='End the call; Devin keeps working', hl=True)
ed(201, cap='Devin builds Mise with Expo', badge='Sped up',
   vo="Devin scaffolds the Expo app with six recipes and a Cook Mode, then runs lint, typecheck, and the web and iOS builds.")
ed(255, hold=1.2, cap='Rejoin the call from inside the session',
   vo="Mid-build, you can rejoin the call from inside the session and just ask how it's going.")
ed(256, hl=True)
ed(294, hl=True, cap='End the call again')
ed(296, cap='Devin tests in Chrome, then on the iPhone and iPad simulators', badge='Sped up',
   vo="Then it tests Mise with Computer Use: first in Chrome, then on the iPhone and iPad simulators, recording each run.")
skip(352, 359)   # usage-limit pause + typed "keep going"
ed(404, cap='Devin opens the PR in product-demo-apps', hold=1.6,
   vo="Devin opens a pull request in the product demo apps repo, and suggests a blueprint update for next time.")
ed(444, cap='Ask for a proper iPhone test recording', hold=1.6,
   vo="The first iPhone run came back as a plain video, so I ask for a real test recording with pass and fail checks.")
ed(456, hl=True)
ed(458, cap='Watch the iPhone Simulator live in the Computer tab', hl=True,
   vo="In the Computer tab, you can watch Devin tap through Cook Mode on the iPhone Simulator, timer and all.")
skip(459, 459)
ed(484, cap='Every test run comes with a recording', hold=1.6,
   vo="Every test run comes with a recording. In Chrome, the wide layout puts the steps in their own column, and all five checks pass.")
ed(486, cap='Chrome: 5 passed')
ed(501, hold=1.2, vo="On the iPhone, the list opens the recipe, and all eight checks pass.")
ed(503, cap='iPhone: 8 passed')
ed(518, hold=1.2, vo="And on the iPad, the recipes sit in a sidebar next to the recipe, and all three checks pass.")
ed(520, cap='iPad: sidebar + detail, 3 passed')
skip(531, 534)   # recording ended, same still
skip(535, 538)   # summary stills: the idle Computer view shows a 'Take control' overlay; end on the passing iPad recording instead
ed(530, cap='One conversation, three platforms, one PR', hold=2.2,
   vo="One conversation, one codebase, tested on the web, the iPhone and the iPad.")
spec = {'title': 'Devin Voice', 'subtitle': 'Talk an app into existence, then watch Devin test it',
        'outro': 'One call, tested on web, iPhone and iPad', 'speed': 3, 'cps': 48, 'capPos': 'bottom',
        'pollRunMax': 2.5, 'edit': E}
open(os.path.join(D, 'spec.js'), 'w').write('window.SPEC = ' + json.dumps(spec, indent=2) + ';\n')
subprocess.run(['python3', os.path.join(D, 'synccall.py')], check=True)
