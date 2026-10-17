"""Writes spec.js and shots/beats.json for tutorial 39 (Mission Control). beats.json = the demo-first intro stills
(shots/demo/beats.json, from mkdemo.py) followed by the Devin capture (shots/capture.json, from capture.mjs).
Then synccall.py locks the call stills to real time."""
import json, os, subprocess
D = os.path.dirname(os.path.abspath(__file__))
S = os.path.join(D, 'shots')
B = json.load(open(os.path.join(S, 'capture.json')))
DEMO = json.load(open(os.path.join(S, 'demo', 'beats.json')))
json.dump(DEMO + B, open(os.path.join(S, 'beats.json'), 'w'), indent=0)
I = lambda n: f'{n:04d}.png'
E = {}
def ed(k, **kw): E.setdefault(I(k) if isinstance(k, int) else k, {}).update(kw)
def skip(a, b):
    for n in range(a, b + 1): ed(n, skip=True)

# ---- demo-first intro: the finished game, real GPT-Live-1 audio (15 fps stills, 4 frames each at 60 fps) ----
F = 1 / 18
ed('demo/calm3_s0.jpg', hold=2.0, cursor=False, cap='Built and tested just by talking',
   vo="Today I'll be building and testing a cross-platform mobile game just by using my voice. It's called Mission Control, and it runs on iOS, Android, and the web from one codebase.")
ed('demo/calm3_s1.jpg', hold=2.0, cap='Devin Voice to build it, GPT-Live-1 inside the game',
   vo="I'll build it by talking to Devin with Devin Voice, which uses ChatGPT voice under the hood. Inside the game, Mission Control talks to the pilot through OpenAI's GPT-Live-1 API, and runs tools in the background while it talks.")
calm = [b['img'] for b in DEMO if b['demo'] == 'calm3' and 'clipFrame' in b]
rook = [b['img'] for b in DEMO if b['demo'] == 'rookie2' and 'clipFrame' in b]
for img in calm + rook: ed(img, hold=F, fade=0)
ed(calm[0], clip='demo_calm3', cap='Calm NASA controller, live over GPT-Live-1')
ed(calm[12], cap='"Deploy the landing gear": a background tool lowers it')
ed(calm[100], cap='"How much fuel?": the telemetry tool lights up the panel')
ed(calm[194], cap='"Kill the engine!"')
ed(calm[250], cap='Touch controls work too (arrow keys on web)')
ed(calm[478], cap='The Eagle has landed')
ed('demo/rookie2_s0.jpg', hold=2.2, cap='Style switch: Panicked Rookie',
   vo="You can also switch its conversational style. Here's the panicked rookie.")
ed(rook[0], clip='demo_rookie2', cap='Panicked Rookie, same tools')
ed(rook[45], cap='"Abort, abort!"')
ed(rook[118], cap='Mission lost: touched down at 6.4 m/s')

# ---- macOS + call ----
ed(0, hold=1.2, cursor=True, cap="Let's build it", vo="Let's build it.")
ed(3, hl=True, hold=1.0, cap='Pick macOS so Devin can run the iPhone simulator', capPos='auto',
   vo="First, switch the virtual environment from Ubuntu to macOS, so Devin can run the iPhone simulator.")
ed(5, hl=True)
ed(6, hold=1.0, hl=True, capPos='auto', cap='Ubuntu → macOS')
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
CAPS1 = {'greeting': 'Devin picks up and says hi', 'say0': 'Pitch the game: Mission Control, one Expo codebase',
         'say1': 'A lunar lander you fly by voice, with GPT-Live-1 and background tools',
         'interrupt1': 'Interrupt mid-answer: add a calm / panicked style switch',
         'say2': 'Docs tip: ask Devin to speak faster',
         'say3': 'Use the Live API, test web + iPhone, Android on an Ubuntu Devin',
         'say4': 'Then let Devin start building'}
CAPS2 = {'greeting': 'Same session: the call picks up where it left off', 'say0': "Ask how the lander's coming along",
         'interrupt0': 'Interrupt Devin mid-sentence'}
for name, caps in (('call1', CAPS1), ('call2', CAPS2)):
    seen = set()
    for n, b in kept[name]:
        if b['phase'] in caps and b['phase'] not in seen: seen.add(b['phase']); ed(n, cap=caps[b['phase']])
i1 = [m for m, c in kept['call1'] if c['phase'] == 'interrupt1'][0]
r1 = [n for n, b in kept['call1'] if b['phase'] == 'reply1' and n > i1][0] + 1
ed(r1, hl=[B[r1]['mute'], B[r1]['silence']], cap='Mute your mic, or silence Devin, any time')
for n in range(r1 + 1, r1 + 7): ed(n, hl='keep')
r3 = [n for n, b in kept['call1'] if b['phase'] == 'reply3'][0] + 6
ed(r3, cap='Every turn lands in the session history')

ed(248, cap='End the call; Devin keeps working', hl=True)
ed(250, cap='Devin builds Mission Control with Expo', badge='Sped up',
   vo="Devin builds the game with Expo, plus a small server that starts the GPT-Live session, and starts a second Devin on Ubuntu for Android.")
ed(274, cap='A second Devin on Ubuntu takes Android')
skip(279, 280); skip(291, 310)
ed(281, cap='It shows up in the Agents tab')
ed(311, hold=1.2, hl=True, cap='Rejoin the call from inside the session',
   vo="Mid-build, you can rejoin the call from inside the session, and ask how the lander's coming along.")
ed(345, hl=True, cap='End the call again')
skip(347, 357)
ed(358, hold=1.2, cap='It tests the web build in Chrome with Computer Use',
   vo="Then it tests the web build in Chrome with Computer Use, on its own Mac.")
skip(425, 429)
ed(430, hold=1.2, cap='Then the iPhone simulator, live in the Computer tab',
   vo="Then it switches to the iPhone simulator, and you can watch it fly live in the Computer tab.")
cards = [n for n, b in enumerate(B) if b.get('mark') == 'card']
web, ios, android = cards[0], cards[1], cards[-1]
skip(467, web - 1)   # 0467-0470: idle "Take control" overlay
ed(web, hold=1.6, cap='Every test run comes with a recording',
   vo="It opens a pull request, and every test run comes with a recording. In Chrome, Mission Control greets the pilot, its tools lower the gear and burn the engine, and seven checks pass. A real microphone couldn't be tested on the VM.")
ed(web + 3, cap='Chrome: 7 passed, 1 untested (no mic on the VM)')
ed(ios, hold=1.2, cap='iPhone simulator: 6 passed, 1 failed',
   vo="On the iPhone simulator, a spoken 'deploy the landing gear', played through a virtual mic, puts the gear down. Six checks pass. The first launch dropped back to the home screen once, and a retry recovered.")
skip(cards[2], android - 1)   # first Android capture (diff panel open); the last one hides the panel
ANDROID = json.load(open(os.path.join(D, 'android.json')))   # {"keep": [offsets from the card], "landed": offset}
for n in range(android, len(B)):
    if n - android not in ANDROID['keep']: ed(n, skip=True)
    elif n > android: ed(n, hold=0.5)
ed(android, hold=1.2, cap='Android emulator, tested by the Ubuntu Devin',
   vo="For Android, the second Devin ran the game on an emulator. The styles, typed radio calls, touch controls, landing and crash all pass. Speech through the emulator's virtual mic didn't get through, so the game's voice was heard in Chrome.")
ed(android + ANDROID['keep'][2], cap='Android: radio, touch, landing pass; mic speech failed')
ed(android + ANDROID['landed'], hold=1.8, cap='One conversation, one codebase: iOS, Android and web',
   vo="And that's how you build and test a voice-controlled game on iOS, Android, and the web, just by talking to Devin.")
spec = {'title': 'Mission Control', 'subtitle': 'Fly a lunar lander by voice, built by talking to Devin',
        'outro': 'One call: iOS, Android and web', 'speed': 3, 'cps': 48, 'capPos': 'bottom',
        'pollRunMax': 1.5, 'noZoom': [['0000.png', None]], 'edit': E}
NARRATED_JS = """const NARRATED = !!new URLSearchParams(location.search).get('voice');
if (NARRATED) {
  SPEC.pollRunMax = 1.0;
  for (const [k, v] of Object.entries({ '0248.png': { travel: 0.45, dwell: 0.1 }, '0249.png': { hold: 0.35 },
                                        '0345.png': { travel: 0.45, dwell: 0.1 }, '0346.png': { hold: 0.35 },
                                        '0000.png': { hold: 0.5 } }))
    Object.assign(SPEC.edit[k] ??= {}, v);
}
"""
if os.environ.get('VOGEN'): NARRATED_JS = ''   # vo.py needs strict JSON after window.SPEC =
open(os.path.join(D, 'spec.js'), 'w').write('window.SPEC = ' + json.dumps(spec, indent=2) + ';\n' + NARRATED_JS)
subprocess.run(['python3', os.path.join(D, 'synccall.py')], check=True)
