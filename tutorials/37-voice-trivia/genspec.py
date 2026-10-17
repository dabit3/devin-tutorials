"""Writes shots/beats.json (demo intro + live capture) and spec.js for tutorial 37 (Trivia Night Live), then synccall.py
locks the call and demo stills to real time. Live capture beats come from shots/beats-main.json (capture.mjs output)."""
import json, os, shutil, subprocess
D = os.path.dirname(os.path.abspath(__file__))
S = os.path.join(D, 'shots')
MID = {'x': 720, 'y': 405}
main = json.load(open(os.path.join(S, 'beats-main.json')))
ld = lambda n: [dict(b, kind='still', cur=MID) for b in json.load(open(os.path.join(S, n + '-beats.json')))]
def still(name, src):
    shutil.copyfile(os.path.join(S, src), os.path.join(S, name))
    return {'img': name, 'cur': MID}
# demo-first intro: real GPT-Live-1 host audio from the finished app (demo-capture.mjs), split into three clips
B = ([still('i1.jpg', 'd0374.jpg'), still('i2.jpg', 'd0044.jpg'), still('i3.jpg', 'd0020.jpg')] + ld('demoa')
     + [still('i4.jpg', 'd0385.jpg')] + ld('demob') + [still('i5.jpg', 'p0050.jpg')] + ld('piratea') + main)
json.dump(B, open(os.path.join(S, 'beats.json'), 'w'))
I = lambda n: f'{n:04d}.png'
E = {}
def ed(n, **k): E.setdefault(n if isinstance(n, str) else I(n), {}).update(k)
def skip(a, b):
    for n in range(a, b + 1): ed(n, skip=True)

ed('i1.jpg', hold=2.0, cursor=False, cap='Build and test a cross-platform game, just by talking',
   vo="Today I'll be building and testing a cross-platform mobile game just by using my voice. It runs on iOS, Android, and the web, from one codebase.")
ed('i2.jpg', hold=1.6, cap='Devin + Devin Voice + OpenAI GPT-Live-1',
   vo="I'll talk to Devin through Devin Voice, which uses ChatGPT voice under the hood. And the game's host talks to players through OpenAI's GPT-Live-1 API.")
ed('i3.jpg', hold=0.6, cap='The host handles interruptions: blurt out the answer',
   vo="The host handles interruptions, so I can shout out an answer while it's still reading.")
ed('i4.jpg', hold=0.6, cap='Tools run in the background: card, clock, score, confetti',
   vo="Tools run in the background, flipping cards, running the clock, and keeping score while it talks.")
ed('i5.jpg', hold=0.6, cap='Custom conversational style: the pirate host',
   vo="And you can change its style. Here's the pirate host.")

ed(0, hold=0.5, cursor=True, cap='Now build it, starting from a new Devin session')
ed(3, hl=True, hold=1.0, cap='Pick macOS so Devin can run the iPhone simulator', capPos='auto',
   vo="First, switch the virtual environment from Ubuntu to macOS, so Devin can run the iPhone simulator.")
ed(5, hl=True)
ed(6, hold=1.0, hl=True, capPos='auto', cap='Ubuntu → macOS')
ed(7, hold=0.5)
ed(8, cap='Start a voice call with the waveform button', capPos='auto', hl=True,
   vo="Then click the waveform button beside the message box to start a voice call.")

kept = {}
for n, b in enumerate(main):
    if b.get('call'): kept.setdefault(b['call'], []).append((n, b))
for name in kept:
    m = json.load(open(os.path.join(S, name + '.json')))
    kept[name] = [(n, b) for n, b in kept[name] if m['t0'] <= b['wall'] < m['t1']]
CAPS1 = {'greeting': 'Devin picks up and says hi', 'say0': 'Pitch the game: Trivia Night Live, one Expo codebase',
         'say1': 'A GPT-Live-1 host you can interrupt, plus game tools', 'interrupt1': 'Interrupt mid-answer: add a classic / pirate host switch',
         'say2': 'Docs tip: ask Devin to speak faster', 'say3': 'Key stays on a server; test with a recorded answer',
         'say4': 'Test web and iPhone, and start an Ubuntu Devin for Android', 'say5': 'Then let Devin start building'}
CAPS2 = {'greeting': 'Same session: the call picks up where it left off', 'say0': "Ask how the game show's coming along",
         'interrupt0': 'Interrupt Devin mid-sentence; it keeps going'}
for name, caps in (('call1', CAPS1), ('call2', CAPS2)):
    seen = set()
    for n, b in kept[name]:
        if b['phase'] in caps and b['phase'] not in seen: seen.add(b['phase']); ed(n, cap=caps[b['phase']])
r1 = [n for n, b in kept['call1'] if b['phase'] == 'reply1' and n > [m for m, c in kept['call1'] if c['phase'] == 'interrupt1'][0]][0] + 1
ed(r1, hl=[main[r1]['mute'], main[r1]['silence']], cap='Mute your mic, or silence Devin, any time')
for n in range(r1 + 1, r1 + 7): ed(n, hl='keep')
r3 = [n for n, b in kept['call1'] if b['phase'] == 'reply3'][0] + 6
ed(r3, cap='Every turn lands in the session history')

ed(284, cap='End the call; Devin keeps working', hl=True)
# build: only stills without the 'Take control' overlay on the Computer view
ed(285, cap='Devin builds the Expo app, the key server and the GPT-Live-1 host', badge='Sped up',
   vo="Devin sets up the Expo app, a small server that keeps the OpenAI key, and the GPT-Live-1 host with its game tools.")
skip(286, 297); skip(301, 366)
# quicker cursor moves outside the calls
for n in (1, 4, 283, 368, 401, 1055, 1103): ed(n, travel=0.45, dwell=0.1)
for n in (2, 402): ed(n, hold=0.35)
skip(403, 403)
ed(367, hold=0.9, cap='Rejoin the call from inside the session',
   vo="Mid-build, you can rejoin the call from inside the session and ask how it's going.")
ed(368, hl=True)
ed(402, hl=True, cap='End the call again')
skip(404, 569)
ed(570, hold=1.6, cap='Built; a second Devin on Ubuntu tests Android',
   vo="Once it's built, a first live test passes in Chrome, and Devin starts a second Devin on Ubuntu to test Android.")
skip(589, 947)
ed(948, cap='The iPhone simulator, live in the Computer tab',
   vo="Then it plays the game on the iPhone simulator, live in the Computer tab.")
skip(976, 1053)
ed(1054, hold=1.2, cap='Every test run comes with a recording',
   vo="Every test run comes with a recording and pass-fail checks. In Chrome, a spoken answer cut in while the host was reading, and it scored.")
ed(1057, cap='Web: voice barge-in scored (checked in headless Chrome)')
ed(1080, cap="iPhone: game checks pass; the simulator has no audio here",
   vo="On the iPhone simulator, the game checks pass. The simulator has no working audio on this Mac, so the voice was tested in Chrome.")
ed(1102, hold=1.0, cap='Android, tested by the Ubuntu Devin',
   vo="For Android, the second Devin ran the app on an emulator. Confetti, auto-advance and the phone layout pass. Voice was blocked by the emulator's audio.")
ed(1105, cap='Android emulator: 4 passed, voice blocked by emulator audio')
skip(1131, 1164)
skip(1165, 1166)
ed(1167, hold=1.4, cap='Results go into the pull request',
   vo="Then it adds every result to its pull request.")
skip(1168, 1168)
ed(1169, hold=1.8, cap='One conversation, one codebase: iOS, Android and web',
   vo="And that's how you build and test a cross-platform voice game, just by talking to Devin.")
spec = {'title': 'Trivia Night Live', 'subtitle': 'A GPT-Live-1 game show, built and tested by voice',
        'outro': 'One call: iOS, Android and web', 'speed': 3, 'cps': 48, 'capPos': 'bottom',
        'pollRunMax': 2.5, 'noZoom': [['0000.png']], 'edit': E}
# narrated cut only: keep silences between lines near 1 s (calls and app clips untouched)
NARRATED_JS = """const NARRATED = !!new URLSearchParams(location.search).get('voice');
if (NARRATED) {
  SPEC.pollRunMax = 1.0;
  for (const [k, v] of Object.entries({ '0000.png': { hold: 0.3 }, '0284.png': { hold: 0.5 } }))
    Object.assign(SPEC.edit[k] ??= {}, v);
  for (const n of [298, 299, 300]) (SPEC.edit[String(n).padStart(4, '0') + '.png'] ??= {}).skip = true;
}
"""
open(os.path.join(D, 'spec.js'), 'w').write('window.SPEC = ' + json.dumps(spec, indent=2) + ';\n' + NARRATED_JS)
subprocess.run(['python3', os.path.join(D, 'synccall.py')], check=True)
