"""Writes spec.js for tutorial 79 (the Glow Puck time-out take) from shots/beats.json, then synccall.py locks the call stills to real time."""
import json, os, subprocess
D = os.path.dirname(os.path.abspath(__file__))
S = os.path.join(D, 'shots')
B = json.load(open(os.path.join(S, 'beats.json')))
I = lambda n: f'{n:04d}.png'
E = {}
def ed(n, **k): E.setdefault(I(n), {}).update(k)
def skip(a, b):
    for n in range(a, b + 1): ed(n, skip=True)
mark = lambda m, after=0: [n for n, b in enumerate(B) if b.get('mark') == m and n > after][0]

# The live cold open (live/live.mp4) is spliced in front of this cut by splice.py; the kit cut starts at the session.
ed(0, hold=1.4, cursor=False, cap='Start in a new Devin session',
   vo="Here's how I built the new feature, starting from a new Devin session.")
ed(3, hl=True, hold=1.0, cap='Pick macOS so Devin can run the iPhone simulator', capPos='auto')
ed(1, vo="First, switch the virtual environment to macOS, so Devin can run the iPhone simulator.")
ed(5, hl=True)
ed(6, hold=1.4, hl=True, capPos='auto', cap='Ubuntu → macOS')
ed(7, hold=0.8)
ed(8, cap='Start a voice call with the waveform button', capPos='auto', hl=True,
   vo="Then click the waveform button beside the message box to start a voice call.")

calls = {}
for n, b in enumerate(B):
    if b.get('call'): calls.setdefault(b['call'], []).append((n, b))
kept = {}
TRIM = json.load(open(os.path.join(D, 'call', 'trim.json'))) if os.path.exists(os.path.join(D, 'call', 'trim.json')) else {}
for name in calls:
    m = json.load(open(os.path.join(S, name + '.json')))
    t1 = min(m['t1'], m['t0'] + TRIM[name] * 1000) if name in TRIM else m['t1']
    kept[name] = [(n, b) for n, b in calls[name] if m['t0'] <= b['wall'] < t1]
CAPS1 = {'greeting': 'Devin picks up', 'say0': 'Glow Puck: an Expo game in product-demo-apps, with a GPT-Live-1 referee',
         'say1': 'The ask: a “time out” tool — 10-second countdown, then play resumes',
         'interrupt1': 'Interrupt mid-answer: the referee should announce it',
         'say2': 'Test in Chrome and on the iPhone simulator, with recordings, then open a PR', 'say3': 'Go ahead'}
CAPS2 = {'greeting': 'Same session: rejoin the call mid-build', 'say0': 'Ask how the time out feature is coming along',
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

end1, rejoin = mark('call1-ended'), mark('rejoin')
ed(end1, cap='End the call; Devin keeps working', hl=True)
ed(end1 + 1, hold=1.6, cap='Devin adds the time out tool to the referee',
   vo="Devin reads the game, adds a time out tool to the referee's server and client, and wires the ten second countdown into the match.")
ed(end1 + 4, badge='Sped up')
skip(end1 + 5, 191)
ed(192, hold=1.8, cap='Mid-build: a PR is already open, tests next',
   vo="About fifteen minutes in, the pull request is already open, and Devin is setting up a virtual microphone so it can talk to the referee. You can rejoin the call from inside the session at any point.")
skip(193, rejoin - 1)

end2 = mark('call2-ended')
ed(end2, hl=True, cap='End the call again')
skip(end2 + 1, 292)
ed(293, hold=2.0, cap='Chrome: Computer Use says “time out” to the referee',
   vo="In Chrome, Devin says time out to the referee through the virtual microphone. The tool fires, the table freezes, and the countdown runs.")
skip(294, 328)
ed(329, hold=2.0, cap='iPhone simulator: same test, same referee',
   vo="Then the same test on the iPhone simulator, with the referee connected over the dev build.")
skip(330, 380)
ed(381, hold=2.2, cap='Devin reports: three time outs per platform, two recordings',
   vo="Devin's report: three time outs on each platform, each one with the countdown, the freeze, the announcement, and play back in. It also caught one try where the referee said time out but never called the tool, and fixed the prompt.")
skip(382, 449)
ed(450, hold=2.2, cap='PR #86: referee time out with a 10-second countdown',
   vo="The pull request has the code and both recordings. The repo has no CI, so nothing ran on it.")
skip(451, 456)
web, ios = [n for n, b in enumerate(B) if b.get('mark') == 'card' and n > 456]
ed(web, hold=1.4, cap='The Chrome recording, in real time',
   vo="The recordings are real time and silent; the referee's lines show up as captions.")
ed(web + 3, cap='Not tested: “resume” during a countdown, or a second time out',
   vo="Not tested: saying resume during a countdown, and calling a second time out while one is running.")
skip(web + 22, ios - 1)
ed(ios, hold=1.4, cap='The iPhone recording', vo="On the iPhone, the same three time outs.")
skip(ios + 24, len(B) - 3)
an = mark('android')
ed(an, hold=3.0, cap='Android emulator: countdown, frozen puck and auto-resume work',
   vo="Android I checked on a Linux emulator. The countdown, the frozen table and the ten-second auto-resume work there too.")
ed(an + 1, hold=3.0, cap='Fired from a debug hook, not by voice; sound and frame rate not judged there',
   vo="But I had to fire it from a debug hook: the emulator's mic didn't reach the referee this time, and sound and frame rate can't be judged on that machine.")

spec = {
    'title': 'Glow Puck × GPT-Live-1', 'subtitle': 'Add a feature to a cross-platform game by voice',
    'outro': 'One call: web, iPhone, and a PR',
    'voOutro': "That's how you add a feature to a cross-platform game with your voice, using Devin Voice and GPT-Live-1.",
    'speed': 3, 'cps': 48, 'capPos': 'bottom', 'pollRunMax': 2.5, 'edit': E,
}
open(os.path.join(D, 'spec.js'), 'w').write('window.SPEC = ' + json.dumps(spec, indent=2, ensure_ascii=False) + ';\n')
print('spec.js', len(E), 'edits')
subprocess.run(['python3', os.path.join(D, 'synccall.py')], check=True)
