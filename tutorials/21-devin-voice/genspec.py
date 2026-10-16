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

ed(0, hold=2.6, cursor=False, cap="Build a cross-platform mobile game, just by talking",
   vo="Let's build a cross-platform mobile game, just by talking to Devin. One codebase that runs on iOS, Android, and the web.")
ed(1, hold=1.6, cap='Devin Voice uses ChatGPT voice under the hood',
   vo="And here's the big part: Devin Voice uses ChatGPT voice under the hood, so it feels like a real conversation.")
ed(3, hl=True, hold=1.0, cap='Pick macOS so Devin can run the iPhone simulator', capPos='auto',
   vo="First, switch the virtual environment from Ubuntu to macOS, so Devin can run the iPhone simulator.")
ed(5, hl=True)
ed(6, hold=1.4, hl=True, capPos='auto', cap='Ubuntu → macOS')
ed(7, hold=0.8)
ed(8, cap='Start a voice call with the waveform button', capPos='auto', hl=True,
   vo="Then click the waveform button beside the message box to start a voice call.")

calls = {}
for n, b in enumerate(B):
    if b.get('call'): calls.setdefault(b['call'], []).append((n, b))
kept = {}
for name in calls:
    m = json.load(open(os.path.join(S, name + '.json')))
    kept[name] = [(n, b) for n, b in calls[name] if m['t0'] <= b['wall'] < m['t1']]
CAPS1 = {'greeting': 'Devin picks up and says hi', 'say0': 'Pitch the game: Jumpy Otter, one Expo codebase',
         'say1': 'An otter hopping through San Francisco', 'interrupt1': 'Interrupt mid-answer: add creatine bottles and a combo meter',
         'say2': 'Docs tip: ask Devin to speak faster', 'say3': 'Test on web and iPhone, and start an Ubuntu Devin for Android',
         'say4': 'Then let Devin start building'}
CAPS2 = {'greeting': 'Same session: the call picks up where it left off', 'say0': "Ask how the game's coming along",
         'interrupt0': 'Interrupt Devin mid-sentence; it keeps going'}
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

ed(154, cap='End the call; Devin keeps working', hl=True)
ed(156, cap='Devin builds Jumpy Otter with Expo and three.js', badge='Sped up',
   vo="Devin sets up the Expo project, builds the voxel city with three.js, and wires up the traffic, piers, creatine and combo meter.")
# watch stills: only those where Devin is working and the Computer view has no 'Take control' overlay
skip(189, 307)
ed(308, hold=2.0, cap='It plays the web build in Chrome',
   vo="Then it plays the web build in Chrome with Computer Use, on its own Mac.")
skip(309, 413)   # usage-limit pauses and earlier rejoin attempts
skip(414, 414)
ed(415, hold=1.2, hl=True, cap='Rejoin the call from inside the session',
   vo="Mid-build, you can rejoin the call from inside the session and ask how the game's coming along.")
ed(432, hl=True, cap='End the call again')
skip(434, 489)
ed(490, hold=2.0, cap='Then the iPhone simulator, live in the Computer tab',
   vo="Then it switches to the iPhone simulator, and you can watch it play live in the Computer tab.")
skip(491, 849)
ed(850, cap='Devin Review flags a bug; Devin fixes it and plays again', badge='Sped up',
   vo="It opens a pull request. Devin Review flags a combo bug, and Devin fixes it and plays the game again.")
marks = [n for n, b in enumerate(B) if b.get('mark') == 'card' and n > 1367]
cards = marks[:2] + marks[-1:]   # Chrome, iPhone, then the last Android take (seeked to gameplay)
assert len(marks) >= 3, marks
skip(cards[1] + 25, cards[2] - 1)
skip(865, cards[0] - 1)
chrome, iphone, android = cards
ed(chrome, hold=1.6, cap='Every test run comes with a recording',
   vo="Every test run comes with a recording. In Chrome, the otter picks up creatine, rides the piers, and all nine checks pass.")
ed(chrome + 3, cap='Chrome: 9 passed')
ed(iphone, hold=1.2, cap='iPhone: combo, creatine pickup, 8 passed',
   vo="On the iPhone, the combo meter climbs, a creatine bottle gets picked up, and all eight checks pass.")
skip(android, android + 1)
ed(android + 2, hold=1.2, cap='Android, tested by the Ubuntu Devin',
   vo="For Android, a second Devin on Ubuntu ran the game on an Android emulator. Screen fill, the combo and swipes pass. Creatine wasn't verified there, and the software emulator runs at a low frame rate.")
ed(android + 3, cap='Android emulator: 3 of 4 checks pass')
ed(android + 22, hold=2.2, cap='One conversation, one codebase: iOS, Android and web',
   vo="One conversation, one codebase, tested on iOS, Android, and the web.")
skip(android + 23, len(B) - 1)
spec = {'title': 'Devin Voice', 'subtitle': 'Talk a game into existence, then watch Devin test it',
        'outro': 'One call: iOS, Android and web', 'speed': 3, 'cps': 48, 'capPos': 'bottom',
        'pollRunMax': 2.5, 'edit': E}
# narrated cut only: keep silences between lines near 1 s (calls untouched)
NARRATED_JS = """const NARRATED = !!new URLSearchParams(location.search).get('voice');
if (NARRATED) {
  SPEC.pollRunMax = 1.0;
  for (const [k, v] of Object.entries({ '0154.png': { travel: 0.45, dwell: 0.1 }, '0155.png': { hold: 0.35 },
                                        '0432.png': { travel: 0.45, dwell: 0.1 }, '0433.png': { hold: 0.35 } }))
    Object.assign(SPEC.edit[k] ??= {}, v);
  for (let n = 172; n <= 188; n++) (SPEC.edit[String(n).padStart(4, '0') + '.png'] ??= {}).skip = true;
}
"""
open(os.path.join(D, 'spec.js'), 'w').write('window.SPEC = ' + json.dumps(spec, indent=2) + ';\n' + NARRATED_JS)
subprocess.run(['python3', os.path.join(D, 'synccall.py')], check=True)
