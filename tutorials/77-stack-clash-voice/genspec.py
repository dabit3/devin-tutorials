"""Writes spec.js for tutorial 77 (Stack Clash voice): the kit cut that follows the real RIVET cold open (splice.py puts that in front).
shots/beats-take.json = the Devin Voice take from capture.mjs (start -> call 1 -> build -> rejoin (call 2) -> tests -> card/vid/pr/final phases).
Then synccall.py locks the call stills to real time."""
import datetime as dt, json, os, subprocess
from calltrim import window
D = os.path.dirname(os.path.abspath(__file__))
S = os.path.join(D, 'shots')
TAKE = json.load(open(os.path.join(S, 'beats-take.json')))
I = lambda n: f'{n:04d}.png'
# take index ranges (marks in beats-take.json): call1-ended 140, first (clipped) call-2 try 224-248 dropped, rejoin 343, call2-ended 367,
# card 1002 / playing 1004 (web + iPhone recording), pr-tab 1073, vid-1 1134 (Android clip), final 1155 (report + table)
START, CALL1_END, BUILD, REJOIN, CALL2_END, TESTS = (0, 10), 140, (262, 343), 343, 367, (368, 1002)
CARD, PLAY, ANDROID, PR, FINAL = 1002, (1004, 1032), (1134, 1153), (1073, 1078), (1155, 1160)
outro = {k: v for k, v in TAKE[FINAL[0]].items() if k not in ('cur', 'mark', 'hl')}; outro.update(img='outro-ember.jpg', kind='still')
B = TAKE[:CALL1_END + 1] + TAKE[BUILD[0]:BUILD[1]] + TAKE[REJOIN:CALL2_END + 1] + TAKE[TESTS[0]:TESTS[1]] + TAKE[CARD:PLAY[1]] \
    + TAKE[ANDROID[0]:ANDROID[1]] + TAKE[PR[0]:PR[1]] + TAKE[FINAL[0]:FINAL[1]] + [outro]
json.dump(B, open(os.path.join(S, 'beats.json'), 'w'), indent=1)
PACE = 1.2
E = {}
def ed(img, **k): E.setdefault(img if isinstance(img, str) else I(img), {}).update(k)
def skip(a, b):
    for n in range(a, b + 1): ed(n, skip=True)
# off-camera moments that must stay out of the cut: frames shot while the chat showed the repo-access/usage-limit nudges (by capture time, UTC)
def utc(h, m): return dt.datetime(2026, 10, 21, h, m, tzinfo=dt.timezone.utc).timestamp()
HIDE = [(utc(4, 38), utc(4, 53)), (utc(6, 8), utc(6, 34)), (utc(7, 9), utc(7, 18))]
hidden = []
for n in range(TESTS[1]):
    t = os.path.getmtime(os.path.join(S, I(n)))
    if any(a <= t <= b for a, b in HIDE): hidden.append(n)
print('hidden frames', len(hidden), hidden[:3], hidden[-3:])

# --- start: env menu, macOS, start the call ---
ed(0, hold=0.9, cap='Start in the Devin web app', capPos='auto',
   vo="Here's how I added a feature to it, just by talking. First, I switch the virtual environment from Ubuntu to macOS, so Devin can run the iPhone simulator.")
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
CAPS1 = {'greeting': 'Devin picks up and says hi', 'say0': 'Pitch the game: Stack Clash, one Expo codebase for iOS, Android and web',
         'say1': 'RIVET runs on GPT-Live-1; ask for a coaching-tip tool that reads the board',
         'interrupt1': 'Interrupt mid-answer: the tip caption should use the player\'s color',
         'say2': 'Docs tip: ask Devin to speak faster', 'say3': 'Test on web and iPhone, and start an Ubuntu Devin for Android',
         'say4': 'Then let Devin start building'}
CAPS2 = {'greeting': 'Same session: the call picks up where it left off', 'say0': "Ask how the feature's coming along",
         'interrupt0': 'Interrupt Devin mid-sentence'}
for name, caps in (('call1', CAPS1), ('call2', CAPS2)):
    seen = set()
    for n, b in kept[name]:
        if b['phase'] in caps and b['phase'] not in seen: seen.add(b['phase']); ed(n, cap=caps[b['phase']])
r1 = [n for n, b in kept['call1'] if b['phase'] == 'reply1' and n > [m for m, c in kept['call1'] if c['phase'] == 'interrupt1'][0]][0] + 1
ed(r1, hl=[TAKE[r1]['mute'], TAKE[r1]['silence']], cap='Mute your mic, or silence Devin, any time')
for n in range(r1 + 1, r1 + 6): ed(n, hl='keep')
r3 = [n for n, b in kept['call1'] if b['phase'] == 'reply3'][0] + 4
ed(r3, cap='Every turn lands in the session history')

# --- build (sped up), rejoin, tests, recordings, PR ---
ed(CALL1_END, hl=True, cap='End the call')
ed(BUILD[0], hold=0.8, cap='Devin builds the coaching-tip tool', badge='Sped up',
   vo="Devin reads how Rivet is wired up, adds a tool that inspects the player's board, and draws the tip under the board in the player's color.")
for n in range(BUILD[0] + 1, BUILD[1]): ed(n, hold=0.2)
for n in range(BUILD[0] + 1, BUILD[1]):
    if (BUILD[1] - n) % 3: ed(n, skip=True)
ZOOM_CHAT = dict(cam={'x': 400, 'y': 560, 'z': 1.8}, camForce=True, camDur=0.8)
ed(REJOIN, hold=1.4, hl=True, cap='Rejoin the call from inside the session', **ZOOM_CHAT,
   vo="Mid-build, I rejoin the call from inside the session and ask how it's going.")
ed(REJOIN, badge='', subPos='top')
ed(REJOIN + 1, hold=0.6)
ed(REJOIN + 2, hold=0.6)
ed(REJOIN + 3, cam='reset', camDur=0.6)
ed(CALL2_END, hl=True, cap='End the call again')
ed(TESTS[0], hold=1.6, badge='Sped up', cap='Devin opens a PR, then tests on web, iPhone Simulator and Android',
   vo="Devin opens a pull request, then tests the feature itself: in Chrome, on the iPhone Simulator, and through a second Devin on Ubuntu for Android. The first run caught two iPhone layout failures, so Devin fixed them and ran it again.")
for n in range(TESTS[0] + 1, TESTS[1]): ed(n, hold=0.2)
for n in range(TESTS[0] + 1, TESTS[1]):
    if (TESTS[1] - n) % 7: ed(n, skip=True)
for n in hidden: ed(n, skip=True)
CARD_CAM = dict(cam={'x': 487, 'y': 432, 'z': 2.0}, camForce=True, camDur=0.8)
ed(CARD, badge='', hold=1.0, cap="Devin's test recording: web in Chrome, then the iPhone Simulator", **CARD_CAM,
   vo="Here's Devin's recording. In Chrome, Rivet reads the board, speaks a tip, and the caption shows under the right board, in the player's color, for about six seconds.")
for n in range(PLAY[0], PLAY[1]): ed(n, hold=0.9)
ed(PLAY[0] + 14, cap='iPhone Simulator: no mic on that Mac, so the tool calls are triggered directly',
   vo="On the iPhone Simulator the Mac has no microphone, so Devin triggers the same tool calls directly, and checks the layout, color and timing.")
a = ANDROID[0]
ed(a, hold=1.2, cam='reset', cap='The Ubuntu Devin talks to RIVET for real on an Android emulator',
   vo="On Android, the second Devin talks to Rivet for real on an emulator, and the tip lands in portrait and landscape. It also noted one intermittent connection drop in the PR as a known issue.")
for n in range(a + 1, ANDROID[1]): ed(n, hold=0.9)
ed(PR[0], hold=1.0, cap='The pull request: tool, caption, 33 tests, typecheck and lint')
ed(PR[0] + 1, hold=1.6, cap='The pull request: tool, caption, 33 tests, typecheck and lint',
   vo="The pull request has the tool, the caption, and the tests: thirty-three pass, with typecheck and lint.")
for n in range(PR[0] + 2, PR[1]): ed(n, hold=1.0)
ed(FINAL[0], hold=2.6, cap='Passes on web and iPhone; Android passes except one known issue',
   vo="Every check passes on web and iPhone, and on Android, except that one known issue.")
for n in range(FINAL[0] + 1, FINAL[1]): ed(n, hold=1.2)
ed('outro-ember.jpg', hold=2.6, cursor=False, cap='One call: a new feature on iOS, Android and web',
   vo="And that's how you add a feature to a cross-platform game just by talking to Devin, with an announcer that talks back.")

spec = {'title': 'Stack Clash', 'subtitle': 'Add a feature to a voice-driven game, just by talking', 'outro': 'One call: iOS, Android and web',
        'speed': 3, 'cps': 48, 'capPos': 'bottom', 'pace': PACE, 'pollRunMax': 2.5, 'maxZoom': 2.0, 'noZoom': [['0000.png', None]], 'edit': E}
NARRATED_JS = """const NARRATED = !!new URLSearchParams(location.search).get('voice');
if (NARRATED) SPEC.pollRunMax = 1.0;
"""
open(os.path.join(D, 'spec.js'), 'w').write('window.SPEC = ' + json.dumps(spec, indent=2) + ';\n' + ('' if os.environ.get('VO_PREP') else NARRATED_JS))
subprocess.run(['python3', os.path.join(D, 'synccall.py')], check=True)
