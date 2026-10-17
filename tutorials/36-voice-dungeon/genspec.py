"""Writes spec.js for tutorial 36 (Dungeon Voice): shots/beats.json = the demo take (shots/demo.json, from mkdemo.py)
followed by the Devin take (shots/beats-take.json, from capture.mjs). Then synccall.py locks the call stills to real time."""
import json, os, subprocess
from calltrim import window
D = os.path.dirname(os.path.abspath(__file__))
S = os.path.join(D, 'shots')
DEMO = json.load(open(os.path.join(S, 'demo.json')))
TAKE = json.load(open(os.path.join(S, 'beats-take.json')))
ANDROID = (584, 627)  # Ubuntu child session: recording card + playback (shot before the parent's cards)
OUTRO = [b for b in DEMO if b['demo'] == 'outro']
DEMO = [b for b in DEMO if b['demo'] != 'outro']
WEB, IOS, SUMMARY = (632, 650), (652, 682), (629, 631)  # parent's all-platforms recording (web, iPhone retest) and its pass/fail table
cut = lambda ab: TAKE[ab[0]:ab[1]]
B = DEMO + TAKE[:ANDROID[0]] + cut(WEB) + cut(IOS) + cut(ANDROID) + cut(SUMMARY) + OUTRO
json.dump(B, open(os.path.join(S, 'beats.json'), 'w'), indent=1)
PACE = 1.2
I = lambda n: f'{n:04d}.png'
E = {}
def ed(img, **k): E.setdefault(img if isinstance(img, str) else I(img), {}).update(k)
def skip(a, b):
    for n in range(a, b + 1): ed(n, skip=True)

# demo-first intro: two silent stills carry the opening narration, then three real GPT-Live clips
ed('demo/gate.jpg', hold=1.8, cursor=False, cap='Dungeon Voice: a fantasy game you play by talking',
   vo="Today I'll be building and testing a cross-platform mobile game just by using my voice. It runs on iOS, Android, and the web, from one codebase.")
ed('demo/bridge.jpg', hold=1.6, cursor=False, cap='Built with Devin Voice; the DM is GPT-Live-1',
   vo="I'll talk to Devin with Devin Voice, which uses ChatGPT voice under the hood. And the game's dungeon master talks to players through OpenAI's GPT-Live-1 API.")
DEMO_CAPS = {'demoA': [(0, 'Real GPT-Live-1 audio: the player speaks, the DM narrates'), (4.0, 'A background tool rolls the d20 while it keeps talking'),
                       (10.6, 'Interrupt mid-scene: "wait, actually, I attack"'), (15.0, 'Tools update the hearts and the log')],
             'demoB': [(0, 'Switch the narrator from spooky to comedic')],
             'demoC': [(0, '"I run across the bridge and head north"'), (4.7, 'Natural 20: the map and room card update')]}
first_vo = {'demoA': "It listens while it talks, handles interruptions, and runs tools in the background that roll the die and update the room, the map, and your hearts."}
segs = {}
for b in DEMO:
    if b['demo'] in DEMO_CAPS: segs.setdefault(b['demo'], []).append(b)
for seg, bs in segs.items():
    caps = list(DEMO_CAPS[seg])
    for i, b in enumerate(bs):
        nxt = bs[i + 1]['t'] if i + 1 < len(bs) else b['segEnd']
        e = dict(hold=round((nxt - b['t']) / PACE, 4), cursor=False, fade=0)
        if i == 0: e['clip'] = seg
        while caps and caps[0][0] <= b['t'] + 1e-6: e['cap'] = caps.pop(0)[1]
        ed(b['img'], **e)
ed('demo/troll.jpg', hold=1.2, cursor=False, cap='It listens while it talks and runs tools', vo=first_vo['demoA'])

# Devin take: indices below are positions in beats-take.json (img names 0000.png...)
ed(0, hold=0.9, cap='Start in the Devin web app', capPos='auto',
   vo="Here's how I built it. First, I switch the virtual environment from Ubuntu to macOS, so Devin can run the iPhone simulator.")
for n in (1, 2, 4, 7, 8): ed(n, hold=0.5)
ed(3, hl=True, hold=0.7, capPos='auto', cap='Pick macOS for the iPhone simulator')
ed(5, hl=True)
ed(6, hold=0.8, hl=True, capPos='auto', cap='Ubuntu → macOS')
ed(9, cap='Start a voice call', capPos='auto', hl=True,
   vo="Then I click the waveform button beside the message box to start a voice call.")

calls = {}
for n, b in enumerate(TAKE):
    if b.get('call'): calls.setdefault(b['call'], []).append((n, b))
kept = {}
for name in calls:
    m = window(name, json.load(open(os.path.join(S, name + '.json'))), B)
    kept[name] = [(n, b) for n, b in calls[name] if m['t0'] <= b['wall'] < m['t1']]
CAPS1 = {'greeting': 'Devin picks up and says hi', 'say0': 'Pitch the game: Dungeon Voice, one Expo codebase',
         'say1': 'GPT-Live-1 is the dungeon master; tools update the screen',
         'interrupt1': 'Interrupt mid-answer: add a spooky / comedic narrator switch',
         'say2': 'Docs tip: ask Devin to speak faster', 'say3': 'Test on web and iPhone, and start an Ubuntu Devin for Android',
         'say4': 'Then let Devin start building'}
CAPS2 = {'greeting': 'Same session: the call picks up where it left off', 'say0': "Ask how the game's coming along",
         'interrupt0': 'Interrupt Devin mid-sentence'}
for name, caps in (('call1', CAPS1), ('call2', CAPS2)):
    seen = set()
    for n, b in kept[name]:
        if b['phase'] in caps and b['phase'] not in seen: seen.add(b['phase']); ed(n, cap=caps[b['phase']])
r1 = [n for n, b in kept['call1'] if b['phase'] == 'reply1' and n > [m for m, c in kept['call1'] if c['phase'] == 'interrupt1'][0]][0] + 1
ed(r1, hl=[TAKE[r1]['mute'], TAKE[r1]['silence']], cap='Mute your mic, or silence Devin, any time')
for n in range(r1 + 1, r1 + 6): ed(n, hl='keep')
r3 = [n for n, b in kept['call1'] if b['phase'] == 'reply3'][0] + 6
ed(r3, cap='Every turn lands in the session history')


# --- build, rejoin, tests, PR ---
ed(291, hl=True, cap='End the call')
ed(292, hold=0.8, cap='Devin builds Dungeon Voice', badge='Sped up',
   vo="Devin sets up the Expo app, a small server that keeps the OpenAI key private, the pixel-art screens, and the game tools.")
for n in range(293, 323): ed(n, hold=0.2)
for n in range(293, 322):
    if (322 - n) % 3: ed(n, skip=True)
ed(322, hold=0.6)
skip(323, 361)   # idle Computer view with the 'Take control' hint
ZOOM_CHAT = dict(cam={'x': 400, 'y': 560, 'z': 1.8}, camForce=True, camDur=0.8)
ed(362, hold=1.4, hl=True, cap='Rejoin the call from inside the session', **ZOOM_CHAT,
   vo="Mid-build, I rejoin the call from inside the session and ask how it's going.")
ed(362, badge='', subPos='top')
ed(363, hold=0.6)
ed(364, hold=0.6)
ed(365, cam='reset', camDur=0.6)
ed(387, hl=True, cap='End the call again')
skip(388, 415)
ed(416, badge='')
ed(416, hold=2.0, cap='Devin opens a PR and starts an Ubuntu Devin for Android',
   cam={'x': 320, 'y': 430, 'z': 1.8}, camForce=True, camDur=0.8,
   vo="When the build is ready, Devin opens a pull request, and starts a second Devin on Ubuntu to test Android.")
skip(417, ANDROID[0] - 1)
CARD_CAM = dict(cam={'x': 487, 'y': 432, 'z': 2.0}, camForce=True, camDur=0.8)
ed(WEB[0], hold=1.0, cap="Devin's test recording: web in Chrome first", **CARD_CAM,
   vo="Devin tests the web version in Chrome first.")
for n in range(WEB[0] + 1, WEB[1]): ed(n, hold=0.25, badge='Sped up')
ed(WEB[0] + 5, cap='A typed action rolls the d20 and updates the room',
   vo="A typed action rolls the die, the room card updates, and the dungeon master narrates it.")
for n in range(IOS[0], IOS[1]): ed(n, hold=0.3 if n < IOS[0] + 16 else 0.22, badge='Sped up')
ed(IOS[0] + 3, cap='iPhone Simulator: Devin added a virtual mic, then the DM narrates',
   vo="On the iPhone Simulator, the Mac has no microphone, so Devin adds a virtual one, and the dungeon master starts narrating.")
ed(IOS[0] + 16, cap='Comedic narrator and saved game pass on iPhone',
   vo="The comedic narrator and saved progress pass on iPhone too.")
a = ANDROID[0]
ed(a, hold=1.4, cam='reset', cap='The Ubuntu Devin runs the app on an Android emulator',
   vo="On Android, the second Devin runs the same app on an emulator, typing actions instead of talking.")
ed(a + 1, hold=0.5)
ed(a + 2, hold=0.6)
for n in range(a + 3, ANDROID[1]): ed(n, hold=0.2 if n < a + 16 else 0.22)
skip(a + 27, ANDROID[1] - 1)
ed(a + 16, hold=1.8, cap='No sound there: DM voice and dice spin not checked',
   vo="The troll roll, the map, the comedic narrator, and resuming a saved game all pass.")
ed(SUMMARY[0], badge='', hold=0.6, cap='Every check passes on web, iPhone and Android')
ed(SUMMARY[0] + 1, hold=2.4, cap="No speakers on test machines; the DM voice above is from my Chrome run",
   vo="Every check passes on all three. The test machines have no speakers, so the voice you heard at the start is from my own run in Chrome.")
ed(OUTRO[0]['img'], hold=2.4, cursor=False, cap='One call: iOS, Android and web',
   vo="And that's how you build and test a cross-platform game, just by talking to Devin, with a dungeon master that talks back.")

spec = {'title': 'Dungeon Voice', 'subtitle': 'Talk a voice game into existence, then watch Devin test it',
        'outro': 'One call: iOS, Android and web', 'speed': 3, 'cps': 48, 'capPos': 'bottom', 'pace': PACE,
        'pollRunMax': 2.5, 'maxZoom': 2.0, 'noZoom': [['0000.png', None]], 'edit': E}
NARRATED_JS = """const NARRATED = !!new URLSearchParams(location.search).get('voice');
if (NARRATED) SPEC.pollRunMax = 1.0;
"""
open(os.path.join(D, 'spec.js'), 'w').write('window.SPEC = ' + json.dumps(spec, indent=2) + ';\n' + ('' if os.environ.get('VO_PREP') else NARRATED_JS))
subprocess.run(['python3', os.path.join(D, 'synccall.py')], check=True)
