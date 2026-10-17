"""Writes spec.js for tutorial 40 (Pitch Tank) from shots/beats.json, then synccall.py locks the call and demo clips to real time.
Frames are found by mark / call / src tag (see shots/beats.json), not by fixed numbers."""
import json, os, subprocess
D = os.path.dirname(os.path.abspath(__file__))
S = os.path.join(D, 'shots')
B = json.load(open(os.path.join(S, 'beats.json')))
I = lambda n: f'{n:04d}.png'
E = {}
def ed(n, **k): E.setdefault(I(n), {}).update(k)
def skip(a, b):
    for n in range(a, b + 1): ed(n, skip=True)
mark = lambda m: [n for n, b in enumerate(B) if b.get('mark') == m][0]
calln = lambda c: [n for n, b in enumerate(B) if b.get('call') == c]
src = lambda s: [n for n, b in enumerate(B) if b.get('src') == s]
def wall_at(c, sec):  # first still of clip c shot at least sec seconds after its recording started
    m = json.load(open(os.path.join(S, c + '.json')))
    return [n for n in calln(c) if B[n]['wall'] >= m['recStart'] + sec * 1000][0]

# ---- demo-first intro: the finished game with its real GPT-Live-1 audio ----
dA, dC, dB = calln('demoA'), calln('demoC'), calln('demoB')
ed(0, hold=1.0, cursor=False, cap='Pitch Tank: pitch your startup to AI investors',
   vo="Today I'll be building and testing a cross-platform mobile game just by using my voice. One codebase runs on iOS, Android, and the web.")
ed(2, hold=0.8, cap='Built with Devin Voice · investors voiced by GPT-Live-1',
   vo="I'll use Devin and Devin Voice, which uses ChatGPT voice under the hood. The game's investors talk through OpenAI's GPT-Live-1 API.")
skip(1, 1); skip(3, 4); ed(5, hold=0.3); skip(6, 7); skip(8, 12); ed(13, hold=0.5); skip(14, dA[0] - 1)
ed(dA[0], cap='Pitch out loud; the investors listen and answer')
ed(wall_at('demoA', 18.0), cap='A background tool pops an offer card')
ed(dA[-1] + 1, hold=0.6, cap='They talk and listen at the same time',
   vo="The investors talk and listen at the same time, and background tools pop offer cards while they talk.")
ed(dC[0], cap='Cut an investor off mid-question')
ed(dC[-1] + 1, hold=0.5, cap='Interest keeps updating',
   vo="You can cut them off mid-question.")
ed(mark('score'), hold=0.8, cap='End the pitch for a score', vo="End the pitch for a score.")
ed(mark('sharks'), hold=0.4, cap='Or switch the panel to ruthless sharks', vo="Or switch to ruthless sharks.")
ed(dB[0], cap='Sharks grill your numbers')

# ---- the take: macOS, call 1 ----
T = dB[-1] + 1
ed(T, hold=0.8, cap='Start on the Devin home page', vo="Here's how I built it.")
skip(T + 1, T + 2)
ed(T + 3, hl=True, hold=0.6, cap='Pick macOS so Devin can run the iPhone simulator', capPos='auto',
   vo="First, switch the environment to macOS for the iPhone simulator.")
ed(T + 5, hl=True)
ed(T + 6, hold=0.8, hl=True)
ed(T + 7, hold=0.4)
ed(T + 8, cap='Start a voice call with the waveform button', capPos='auto', hl=True,
   vo="Then click the waveform button to start a voice call.")
kept = {}
for name in ('call1', 'call2'):
    m = json.load(open(os.path.join(S, name + '.json')))
    kept[name] = [(n, B[n]) for n in calln(name) if m['t0'] <= B[n]['wall'] < m['t1']]
CAPS1 = {'greeting': 'Devin picks up and says hi', 'say0': 'Pitch the game: Pitch Tank, one Expo codebase',
         'say1': 'Investors talk back through GPT-Live-1; tools run in the background',
         'interrupt1': 'Interrupt mid-answer: add mentors vs. sharks, and a final score',
         'say2': 'Docs tip: ask Devin to speak faster', 'say3': 'Test on web and iPhone, and start an Ubuntu Devin for Android',
         'say4': 'Then let Devin start building'}
CAPS2 = {'greeting': 'Same session: the call picks up where it left off', 'say0': "Ask how the game's coming along",
         'interrupt0': 'Interrupt Devin mid-sentence'}
for name, caps in (('call1', CAPS1), ('call2', CAPS2)):
    seen = set()
    for n, b in kept[name]:
        if b['phase'] in caps and b['phase'] not in seen: seen.add(b['phase']); ed(n, cap=caps[b['phase']])
k1 = kept['call1']
r1 = [n for n, b in k1 if b['phase'] == 'reply1' and n > [m for m, c in k1 if c['phase'] == 'interrupt1'][0]][0] + 1
ed(r1, hl=[B[r1]['mute'], B[r1]['silence']], cap='Mute your mic, or silence Devin, any time')
for n in range(r1 + 1, r1 + 7): ed(n, hl='keep')
r3 = [n for n, b in k1 if b['phase'] == 'reply3'][0] + 6
ed(r3, cap='Every turn lands in the session history')
e1 = mark('call1-ended')
ed(e1 - 1, cap='End the call; Devin keeps working', hl=True)

# ---- build (chat only; the live Computer view had a hover overlay, so it's skipped) ----
ed(e1 + 1, hold=1.2, cap='Devin builds Pitch Tank: Expo app, voice server, cartoon panel', badge='Sped up',
   vo="Devin builds the game, plus a small server that keeps the OpenAI key private.")
rj = mark('rejoin')
for n in range(e1 + 2, mark('tabs-panel')):
    if (n - e1) % 8: ed(n, skip=True)
    elif B[n].get('kind') == 'poll': ed(n, hold=0.3)
skip(mark('tabs-panel'), rj)
ed(rj + 1, hold=0.8, hl=True, cap='Rejoin the call from inside the session',
   vo="Mid-build, I rejoin the call from inside the session.")
e2 = mark('call2-ended')
ed(e2 - 1, hl=True, cap='End the call again')

# ---- Computer Use test runs, replayed from the session timeline ----
rp = src('replay')
ed(rp[0], hold=1.0, cap='Devin tests the web build in Chrome with Computer Use', badge='Replay',
   vo="Then Devin tests the web build in Chrome. Its Mac has no microphone, so it feeds in a recorded pitch.")
ed(rp[7], hold=0.8, cap='Chrome: the pitch gets scored')
ed(rp[8], hold=1.0, cap='Same test on the iPhone simulator', badge='Replay',
   vo="Then it runs the same test on the iPhone simulator.")
ed(rp[14], hold=0.8)
skip(rp[-1] + 1, src('pr')[0] - 1)
for k in (1, 2, 5, 6, 9, 10, 12, 13): ed(rp[k], skip=True)

# ---- PR, recordings, Android ----
pr = src('pr')[0]
ed(pr, hold=1.0, cap='Devin opens a pull request', vo="When it's done, Devin opens a pull request.")
cc, ic, an = src('chromecard'), src('iphonecard'), src('android')
ed(cc[0], hold=1.0, cap='Each test run has a recording · Chrome: 7 passed',
   vo="Each test run comes with a recording and pass-fail checks. Chrome passes all seven.")
for n in cc[-3:] + ic[-3:] + cc[4:-3:2] + ic[2:-3:2]: ed(n, skip=True)
for n in cc + ic:
    if B[n].get('kind') == 'poll': E.setdefault(I(n), {}).setdefault('hold', 0.2 if n in cc else 0.15)
ed(ic[0], hold=0.8, cap='iPhone: 6 passed', vo="The iPhone passes all six.")
ed(an[0], hold=1.0, cap='Android via a second Devin on Ubuntu: 8 passed, 2 dropped (emulator mic distorted)', badge='Android recording',
   vo="A second Devin on Ubuntu tested Android in an emulator. It reports eight checks passing and two dropped. The emulator's mic was distorted, so some captions were wrong.")
ed(an[1], skip=True); ed(an[3], skip=True)
ed(an[-1], hold=1.6, cap='One voice call, one codebase: iOS, Android and web',
   vo="That's how you build and test a cross-platform game just by using your voice.")
spec = {'title': 'Devin Voice + GPT-Live-1', 'subtitle': 'Talk a voice game into existence, then watch Devin test it',
        'outro': 'Pitch Tank: iOS, Android and web', 'speed': 3, 'cps': 48, 'capPos': 'bottom',
        'pollRunMax': 2.5, 'edit': E}
open(os.path.join(D, 'spec.js'), 'w').write('window.SPEC = ' + json.dumps(spec, indent=2) + ';\n')
subprocess.run(['python3', os.path.join(D, 'synccall.py')], check=True)
