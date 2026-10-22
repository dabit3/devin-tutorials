"""Writes spec.js for tutorial 78 (ACE RALLY + Chair) from shots/beats.json, then synccall.py locks the call stills to real time."""
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
skip(0, 2)
# the macOS pick stays under 3 s: punch in on the environment menu, then on the voice-call button
ed(3, hold=1.0, hl=True, cam={'x': 690, 'y': 585, 'z': 1.5}, camDur=0.8, camForce=True, cap='Pick macOS: Devin can run the iPhone simulator',
   vo="Here's how I did it. In a new Devin session, pick macOS, so Devin can run the iPhone simulator, then start a voice call.")
skip(4, 5)
ed(6, hold=0.5, hl=True)
skip(7, 7)
ed(8, hold=1.2, cam={'x': 900, 'y': 470, 'z': 2.0}, camDur=1.0, camForce=True, cap='Start a voice call with the waveform button', hl=True)

calls = {}
for n, b in enumerate(B):
    if b.get('call'): calls.setdefault(b['call'], []).append((n, b))
kept = {}
for name in calls:
    m = json.load(open(os.path.join(S, name + '.json')))
    kept[name] = [(n, b) for n, b in calls[name] if m['t0'] <= b['wall'] < m['t1']]
CAPS1 = {'greeting': 'Devin picks up and says hi', 'say0': 'An Expo tennis game with Chair, a GPT-Live-1 umpire',
         'say1': 'The ask: switch Chair\u2019s language as a background tool', 'interrupt1': 'Interrupt mid-answer: the key stays on the server',
         'say2': 'Docs tip: ask Devin to speak faster', 'say3': 'Web and iPhone here; an Ubuntu Devin tests Android',
         'say4': 'Then let Devin start building'}
CAPS2 = {'greeting': 'Same session: the call picks up where it left off', 'say0': "Ask how it\u2019s going",
         'interrupt0': 'Interrupt Devin mid-sentence'}
# Both calls are shown as a split screen by compose.py: the kit frame's centre 55 % (x 864-2976 at 4K) becomes the left pane,
# so every call cam frames the transcript inside that 792-UI-px-wide window; the right pane is live gameplay.
PHONE_L = {'x': 1010, 'y': 377, 'z': 1.6}  # the landscape iPhone simulator in the Computer tab, dock excluded
MODAL = {'x': 710, 'y': 404, 'z': 1.1}     # the whole test-report modal
CARD = {'x': 480, 'y': 450, 'z': 1.5}      # the test-run card in the chat column
CHATCOL = {'x': 480, 'y': 440, 'z': 1.5}   # the chat column beside the Agents tab
PRTAB = {'x': 1002, 'y': 330, 'z': 1.7}    # the PR panel: window x 578-1425, past the chat text (ends 545) and the divider (576), 10 px before the panel text (589)
PANE_W = 792
BASE1 = {'x': 716, 'y': 405, 'z': 0.88}    # call 1: the whole chat column (x 275-1157) with a 9 px margin
BASE2 = {'x': 531, 'y': 512, 'z': 1.356}   # call 2: the narrow chat column (x 0-584) lands in the left 55 % of the frame, call bar included
LC = json.load(open(os.path.join(S, 'linecams.json')))  # final bubble of each spoken line (UI px), measured from the stills
def linecam(name, phase):
    r = LC.get(f'{name}:{phase}')
    if not r: return None
    x0, x1, y0, y1 = r
    z = max(0.9, min(1.6, PANE_W / (x1 - x0 + 80)))
    hh = 405 / z
    return {'x': (x0 + x1) / 2, 'y': min(max((y0 + y1) / 2, hh), 810 - hh), 'z': round(z, 3)}
for name, caps, base in (('call1', CAPS1, BASE1), ('call2', CAPS2, BASE2)):
    seen, prev = set(), None
    ed(kept[name][0][0] - 1, cam=base, camDur=1.0, camForce=True)
    for n, b in kept[name]:
        ph = b['phase']
        if ph in caps and ph not in seen:
            seen.add(ph); ed(n, cap=caps[ph], **({'capPos': {'x': 0.275, 'y': 0.93}} if name == 'call2' else {}))
            # no horizontal punch-ins: any window narrower than the column (x 275-1157) cuts Devin's wrapped lines at an edge
        if ph.startswith('reply') and ph != prev: ed(n, cam=base, camDur=1.5, camForce=True)
        prev = ph
# mute / silence highlight while Devin answers the interruption
r1 = [n for n, b in kept['call1'] if b['phase'] == 'reply1' and n > [m for m, c in kept['call1'] if c['phase'] == 'interrupt1'][0]][0] + 1
ed(r1, hl=[B[r1]['mute'], B[r1]['silence']], cap='Mute your mic, or silence Devin, any time')
for n in range(r1 + 1, r1 + 7): ed(n, hl='keep')
r3 = [n for n, b in kept['call1'] if b['phase'] == 'reply3'][0] + 6
ed(r3, cap='Every turn lands in the session history')

mark = lambda m, after=0: [n for n, b in enumerate(B) if b.get('mark') == m and n > after][0]
end1, rejoin = mark('call1-ended'), mark('rejoin')
ed(end1, cap='End the call; Devin keeps working', hl=True, cam='reset', camDur=1.0)
# 205-249: the pull warning, the off-camera GitHub fix and the nudge; not part of the story
skip(end1 + 1, 249)
ed(250, hold=1.8, cap='Devin adds a language tool to Chair and a language badge', badge='Sped up',
   vo="Devin pulls the game, adds a set language tool to Chair, and shows the current language in his panel. The OpenAI key stays on the project's small server.")
skip(251, 259); ed(260, hold=1.2, badge='Sped up'); skip(261, 275); ed(276, hold=1.2, badge='Sped up'); skip(277, rejoin - 1)
ed(rejoin - 1, cam='reset', camDur=1.5)
ed(rejoin, hold=1.6, hl=True, cap='Mid-build: rejoin the call from inside the session',
   vo="Soon the web build is running in the Computer tab. Mid-build, you can rejoin the call from inside the session and ask how it's going.")
end2 = mark('call2-ended')
ed(end2, hl=True, cap='End the call again', cam='reset', camDur=1.0)
skip(end2 + 1, 339)
ed(340, hold=1.6, cam=PHONE_L, camDur=1.5, camForce=True, cap='Computer Use tests the web build: Spanish, then Japanese', badge='Sped up',
   vo="Then Devin tests it with Computer Use. In Chrome, he asks Chair to call the match in Spanish, then Japanese, while the match keeps going.")
skip(341, 399)
ed(400, hold=1.8, cam='reset', camDur=1.5, cap='A second Devin on Ubuntu tests Android',
   vo="Your Mac can't run Android, so Devin starts a second Devin on Ubuntu for the emulator.")
skip(401, 412)
ed(413, hold=1.6, cam=PHONE_L, camDur=1.5, camForce=True, cap='iPhone simulator: Chair tested with typed input', badge='Sped up',
   vo="On the iPhone simulator, this Mac has no audio device, so Devin types to Chair instead of talking.")
skip(414, 533)
ed(534, hold=1.8, cap='Japanese: the badge, the captions and the greeting after a reboot')
skip(535, 559)
ed(560, hold=1.2, cam='reset', camDur=1.5, cap='Waiting for the Android Devin')
skip(561, 645)   # blueprint suggestion card and the wait
web, ios = [n for n, b in enumerate(B) if b.get('mark') == 'card']
ed(web, hold=1.6, cam=CARD, camDur=1.5, camForce=True, cap='Every test run comes with a recording and checks',
   vo="Every test comes with a recording and pass fail checks.")
ed(web + 2, cam=MODAL, camDur=1.5, camForce=True)
ed(web + 3, cap='Chrome: 9 passed',
   vo="In Chrome, the badge starts in English, switches to Spanish and Japanese while the match keeps going, Japanese survives a reload, and nine checks pass.")
skip(web + 24, ios - 1)
ed(ios, hold=1.2, cam=CARD, camDur=1.5, camForce=True, cap='iPhone recheck: 4 passed', vo="On the iPhone, the same switches, the panel fix and the reconnect in Japanese pass: four checks in the final recheck.")
ed(ios + 2, cam=MODAL, camDur=1.5, camForce=True)
skip(ios + 20, 707)
agents = mark('agents')
skip(agents - 1, agents + 1)   # the Agents tab and the chat column are still loading on these three
ed(agents + 2, kind='still', hold=2.2, cam='reset', camDur=1.5, cap='Android, by the Ubuntu Devin: Spanish and Japanese pass, one drop flagged',
   vo="The Ubuntu Devin ran it on an Android emulator. Spanish and Japanese pass, and it flags one dropped connection that came back with a tap.")
tab = agents + 3
ed(tab, hl=True, cam=PRTAB, camDur=1.5, camForce=True)
ed(tab + 1, hold=0.6, cap='Devin opens a PR with the reports and recordings',
   vo="Then it opens a pull request with the code, the reports, and the recordings.")
skip(tab + 2, tab + 3)   # the PR page stays under 3 s
summ = mark('summary')
ed(summ, hold=2.0, cam='reset', camDur=1.2, cap='One call, one feature, tested on web, iPhone and Android')
skip(summ + 1, len(B) - 1)
for n in range(len(B)): ed(n, fade=0)   # hard cuts between stills: a dissolve of two scroll positions stacks the text (the only crossfades are in the gameplay, splice2.py)
spec = {'title': 'Devin Voice + GPT-Live-1', 'subtitle': 'Add and test a game feature by voice',
        'outro': 'One call: web, iPhone and Android',
        'voOutro': "That's how you add and test a feature in a cross-platform game with your voice, using Devin Voice and GPT-Live-1.", 'speed': 3, 'cps': 48, 'capPos': 'bottom',
        'pollRunMax': 2.5, 'outroVoDelay': 0, 'maxZoom': 2.0, 'capScale': 1.3, 'voCapScale': 1.3, 'edit': E}
if os.environ.get('NO_OUTRO_VO'): del spec['voOutro']   # the recap plays over the closing gameplay clip (compose.py), not the end card
# narrated cut only: keep silences between lines near 1 s (calls untouched)
I4 = lambda n: f'{n:04d}.png'
NARRATED_JS = """const NARRATED = !!new URLSearchParams(location.search).get('voice');
if (NARRATED) {
  SPEC.pollRunMax = 1.0;
  for (const [k, v] of Object.entries(%s))
    Object.assign(SPEC.edit[k] ??= {}, v);
}
""" % json.dumps({  # the rejoin click waits for the 0332 line, so it plays over the hover frame (game on the iPhone)
    I4(7): {'hold': 0.6}, I4(end1): {'travel': 0.45, 'dwell': 0.1}, I4(end1 + 1): {'hold': 0.35}, I4(end2): {'travel': 0.45, 'dwell': 0.1},
    I4(mark('call2-start')): {'waitVo': True}})
open(os.path.join(D, 'spec.js'), 'w').write('window.SPEC = ' + json.dumps(spec, indent=2) + ';\n' + NARRATED_JS)
subprocess.run(['python3', os.path.join(D, 'synccall.py')], check=True)
