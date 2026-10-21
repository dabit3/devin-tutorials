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
   vo="Then click the waveform button beside the message box to start a voice call.")

calls = {}
for n, b in enumerate(B):
    if b.get('call'): calls.setdefault(b['call'], []).append((n, b))
kept = {}
for name in calls:
    m = json.load(open(os.path.join(S, name + '.json')))
    kept[name] = [(n, b) for n, b in calls[name] if m['t0'] <= b['wall'] < m['t1']]
CAPS1 = {'greeting': 'Devin picks up and says hi', 'say0': 'Pitch the game: Jumpy Otter, one Expo codebase',
         'say1': 'Add Coach Otto, a voice sidekick built on GPT-Live-1', 'interrupt1': 'Interrupt mid-answer: voice requests should change the gameplay',
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
end1 = mark('call1-ended')
rejoin = mark('rejoin', mark('call2-ended'))  # the first rejoin take (barge-in too early) is dropped
ed(end1, cap='End the call; Devin keeps working', hl=True)
ed(end1 + 1, hold=1.6, cap='Devin builds the game and wires up GPT-Live-1',
   vo="Devin sets up the Expo project, builds the San Francisco board, and turns each power-up into a tool Coach Otto can call through GPT-Live-1. A small server keeps the API key.")
ed(end1 + 4, badge='Sped up')
skip(end1 + 5, rejoin)
ed(rejoin + 1, hold=1.6, hl=True, cap='Mid-build: rejoin the call from inside the session',
   vo="Mid-build, you can rejoin the call from inside the session and ask how the game's coming along.")
end2 = mark('call2-ended', rejoin)
ed(end2, hl=True, cap='End the call again')
skip(end2 + 1, 499)
ed(500, hold=1.4, cap='Computer Use plays the web build in Chrome',
   vo="Then Devin plays the web build in Chrome with Computer Use.")
skip(501, 539)
ed(540, hold=1.4, cap='iPhone simulator: power-ups tested with the buttons',
   vo="On the iPhone simulator, it taps the power-up buttons, since there's no microphone to talk through.")
skip(541, 578)
web, ios, android = [n for n, b in enumerate(B) if b.get('mark') == 'card']
ed(web, hold=1.6, cap='Every test run comes with a recording and checks',
   vo="Every test comes with a recording and pass fail checks.")
ed(web + 3, cap='Chrome: 9 passed, 1 failed',
   vo="In Chrome, all four power-ups work by voice. The first voice attempt stalled, so one check failed, and a fresh browser fixed it.")
skip(web + 27, ios - 1)
ed(ios, hold=1.2, cap='iPhone: 4 passed, voice untested',
   vo="On the iPhone, gameplay and all four power-up buttons pass. Voice is left untested there.")
skip(ios + 27, android - 1)
ed(android, hold=1.4, cap='Android, tested by an Ubuntu Devin: 10 passed, 1 untested',
   vo="A second Devin on Ubuntu ran the game on an Android emulator. Ten checks pass, and spoken voice is left untested.")
tab = mark('tab')
skip(android + 16, tab - 2)
ed(tab + 1, hold=1.8, cap='Devin opens a PR with the reports')
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
""" % json.dumps({  # the rejoin click waits for the rejoin line, so it plays over the hover frame
    I4(7): {'hold': 0.6}, I4(end1): {'travel': 0.45, 'dwell': 0.1}, I4(end1 + 1): {'hold': 0.35}, I4(end2): {'travel': 0.45, 'dwell': 0.1},
    I4(mark('call2-start', rejoin)): {'waitVo': True}})
open(os.path.join(D, 'spec.js'), 'w').write('window.SPEC = ' + json.dumps(spec, indent=2) + ';\n' + NARRATED_JS)
subprocess.run(['python3', os.path.join(D, 'synccall.py')], check=True)
