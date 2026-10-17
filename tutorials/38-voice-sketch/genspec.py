"""Writes spec.js for tutorial 38 (Sketch Buddy) from shots/beats.json (hero footage spliced in by addhero.py around the
take in shots/beats-take.json), then synccall.py locks the call and hero clips to real time."""
import json, os, subprocess
D = os.path.dirname(os.path.abspath(__file__))
S = os.path.join(D, 'shots')
B = json.load(open(os.path.join(S, 'beats.json')))
T = json.load(open(os.path.join(S, 'beats-take.json')))
I = lambda n: f'{n:04d}.png'
E = {}
def ed(n, **k): E.setdefault(n if isinstance(n, str) else I(n), {}).update(k)
def skip(a, b):
    for n in range(a, b + 1): ed(n, skip=True)

# demo-first intro: the finished app, real GPT-Live-1 audio recorded in Chrome
ed('intro-0.jpg', hold=2.4, cursor=False, cap="Building and testing a cross-platform app, just by using my voice",
   vo="Today I'll be building and testing a cross-platform mobile app just by using my voice. It's called Sketch Buddy, and one codebase runs on iOS, Android, and the web.")
ed('intro-1.jpg', hold=1.6, cursor=False, cap='Devin + Devin Voice to build it, GPT-Live-1 inside the app',
   vo="I'll build it with Devin and Devin Voice, which uses ChatGPT voice under the hood. And the app's art buddy talks back through OpenAI's GPT-Live-1 API.")
ed('intro-2.jpg', hold=1.0, cursor=False, cap='Describe a scene out loud',
   vo="You describe a scene, and the buddy keeps talking while tools in the background draw it.")
ed('heroA-000.jpg', cap='GPT-Live-1 talks while background tools draw')
ed('heroA2-000.jpg', cap='Shapes stream onto the canvas')

ed(3, hl=True, hold=1.0, cap='Pick macOS so Devin can run the iPhone simulator', capPos='auto',
   vo="Now let's build it. First, switch the virtual environment from Ubuntu to macOS, so Devin can run the iPhone simulator.")
ed(5, hl=True)
ed(6, hold=1.4, hl=True, capPos='auto', cap='Ubuntu → macOS')
ed(7, hold=0.8)
ed(8, cap='Start a voice call with the waveform button', capPos='auto', hl=True,
   vo="Then click the waveform button beside the message box to start a voice call.")

calls = {}
for n, b in enumerate(T):
    if b.get('call'): calls.setdefault(b['call'], []).append((n, b))
kept = {}
for name in calls:
    m = json.load(open(os.path.join(S, name + '.json')))
    kept[name] = [(n, b) for n, b in calls[name] if m['t0'] <= b['wall'] < m['t1']]
CAPS1 = {'greeting': 'Devin picks up', 'say0': 'Pitch Sketch Buddy: one Expo codebase',
         'say1': 'An art buddy that talks and draws, voiced by GPT-Live-1', 'interrupt1': 'Interrupt mid-answer: add a style switch and Surprise me',
         'say2': 'Docs tip: ask Devin to speak faster', 'say3': 'Test on web and iPhone, and start an Ubuntu Devin for Android',
         'say4': 'Then let Devin start building'}
CAPS2 = {'greeting': 'Same session: Devin gives a quick status', 'say0': "Ask how Sketch Buddy's coming along",
         'interrupt0': 'Barge in mid-answer; Devin picks right back up'}
for name, caps in (('call1', CAPS1), ('call2', CAPS2)):
    seen = set()
    for n, b in kept[name]:
        if b['phase'] in caps and b['phase'] not in seen: seen.add(b['phase']); ed(n, cap=caps[b['phase']])
# mute / silence highlight while Devin answers the interruption
r1 = [n for n, b in kept['call1'] if b['phase'] == 'reply1' and n > [m for m, c in kept['call1'] if c['phase'] == 'interrupt1'][0]][0] + 1
ed(r1, hl=[T[r1]['mute'], T[r1]['silence']], cap='Mute your mic, or silence Devin, any time')
for n in range(r1 + 1, r1 + 7): ed(n, hl='keep')
r3 = [n for n, b in kept['call1'] if b['phase'] == 'reply3'][0] + 6
ed(r3, cap='Every turn lands in the session history')
r4 = [n for n, b in kept['call1'] if b['phase'] == 'reply4'][0] + 12
ed(r4, cap='The key stays on a small server')

mark = lambda m: [n for n, b in enumerate(T) if b.get('mark') == m]
end1, rejoin, end2 = mark('call1-ended')[0], mark('rejoin')[0], mark('call2-ended')[0]
ed(end1, cap='End the call; Devin keeps working', hl=True)
ed(end1 + 1, cap='Devin builds Sketch Buddy with Expo', badge='Sped up',
   vo="Devin sets up the Expo app, adds a small server that keeps the OpenAI key private, and wires GPT-Live-1 to the drawing tools.")
# watch stills: only those without the Computer view's 'Take control' overlay
skip(end1 + 31, rejoin - 1)
ed(rejoin, hold=1.2, hl=True, cap='Rejoin the call from inside the session',
   vo="Mid-build, you can rejoin the call from inside the session and ask how it's coming along.")
ed(end2, hl=True, cap='End the call again')
cards = mark('card')
assert len(cards) >= 3, cards
old, android, clean = cards[0], cards[1], cards[-1]
REPORT = 523
skip(end2 + 1, REPORT - 1)
ed(REPORT, hold=2.0, cap='Computer Use tests in Chrome and the iPhone simulator', badge='Sped up',
   vo="It tests the app in Chrome and on the iPhone simulator with Computer Use, and writes up a report.")
skip(REPORT + 1, android - 1)   # earlier report polls, the first (setup) recording, and the retest request
ed(clean, hold=1.6, cap='Chrome + iPhone simulator: 19 passed', vo="Every test run comes with a recording. In Chrome and on the iPhone simulator, the buddy answers each scene, draws it step by step, switches styles both ways, and all nineteen checks pass.")
ed(android, hold=1.2, cap='Android, tested by the Ubuntu Devin', vo="For Android, a second Devin on Ubuntu ran the app on an emulator. The buddy talks out loud and draws the scene, though its replies are slow on the software emulator.")
summ = mark('summary')
skip(android + 14, summ[0] - 1)   # the rest of the Android recording; the narration is done by then
skip(summ[0], summ[1] - 1)
skip(summ[1] + 1, clean - 1)   # scrolling the Ubuntu session (beats-take order: android, summary, clean card, PR)   # the macOS recap repeats the Android report; show the Ubuntu Devin's own session instead
ed(summ[1], hold=1.6, cap="The Ubuntu Devin's own session and report")
prm = mark('pr')[0]
ed(prm, hold=2.2, cap='The pull request in product-demo-apps',
   vo="Then it opens a pull request in the product demo apps repo, ready to review.")
skip(prm + 2, prm + 3)   # scrolled diff frames: no code walkthrough
ed('tail-0.jpg', hold=1.0, cursor=False, cap='The finished app',
   vo="Here's the finished app. You can change your mind while it's drawing, or switch the buddy to a deadpan critic.")
ed('heroB-000.jpg', cap='"Make the moon bigger... no, purple"')
ed('heroB3-000.jpg', cap='Background tools resize and recolor the moon')
ed('heroC-000.jpg', cap='Same app, deadpan critic style')
ed('outro.jpg', hold=2.4, cursor=False, cap='One call: iOS, Android and web',
   vo="And that's how you build and test a cross-platform app with your voice. One call with Devin, one codebase, and an app that talks back through GPT-Live-1.")
spec = {'title': 'Sketch Buddy', 'subtitle': 'Talk an app into existence with Devin Voice and GPT-Live-1',
        'outro': 'One call: iOS, Android and web', 'speed': 3, 'cps': 48, 'capPos': 'bottom',
        'pollRunMax': 2.5, 'edit': E}
NARRATED_JS = """const NARRATED = !!new URLSearchParams(location.search).get('voice');
if (NARRATED) { SPEC.pollRunMax = 1.0; }
"""
open(os.path.join(D, 'spec.js'), 'w').write('window.SPEC = ' + json.dumps(spec, indent=2) + ';\n' + NARRATED_JS)
subprocess.run(['python3', os.path.join(D, 'synccall.py')], check=True)
