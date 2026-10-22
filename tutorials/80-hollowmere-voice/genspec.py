"""Writes spec.js for tutorial 80 (Hollowmere: a waypoint-marker tool for Eira over Devin Voice) from shots/beats.json, then synccall.py locks the call stills to real time."""
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

# The live cold open (live/live.mp4) and the intro are spliced in front of this cut by splice.py; the kit cut starts at the session.
ed(0, hold=0.6, cursor=False, cap='Start in a new Devin session',
   vo="Here's how I added the feature, starting from a new Devin session.")
skip(1, 2)
ed(3, hl=True, hold=0.7, cap='Pick macOS so Devin can run the iPhone simulator', capPos='auto',
   vo="First, switch the virtual environment to macOS, so Devin can run the iPhone simulator.")
skip(4, 5)
ed(6, hold=0.6, hl=True, capPos='auto', cap='Ubuntu → macOS')
ed(7, hold=1.3, cap='Start a voice call with the waveform button', capPos='auto', hl=True, cam={'x': 1000, 'y': 420, 'z': 1.9}, camForce=True, camDur=0.7,
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
CAPS1 = {'greeting': 'Devin picks up', 'say0': 'Hollowmere: an Expo RPG in product-demo-apps; Eira, the companion, is a GPT-Live-1 voice',
         'say1': 'The ask: a mark_waypoint tool — a glowing marker in the world, plus a compass pin',
         'interrupt1': 'Interrupt mid-answer: “make the marker a tall beam of light”',
         'say2': 'Test in Chrome and on the iPhone simulator, with recordings, then open a PR', 'say3': 'Go ahead'}
CAPS2 = {'greeting': 'Same session: rejoin the call mid-build', 'say0': 'Ask how the waypoint tool is coming along',
         'interrupt0': 'Interrupt Devin mid-sentence'}
for name, caps in (('call1', CAPS1), ('call2', CAPS2)):
    seen = set()
    for n, b in kept[name]:
        if b['phase'] in caps and b['phase'] not in seen: seen.add(b['phase']); ed(n, cap=caps[b['phase']])
i1 = [m for m, c in kept['call1'] if c['phase'] == 'interrupt1'][0]
r1 = ([n for n, b in kept['call1'] if n > i1 and 'mute' in b] + [i1 + 3])[0]
if 'mute' in B[r1]:
    ed(r1, hl=[B[r1]['mute'], B[r1]['silence']], cap='Mute your mic, or silence Devin, any time')
    for n in range(r1 + 1, r1 + 7): ed(n, hl='keep')
else: ed(r1, cap='Devin picks the barge-in up mid-sentence: “Got it. Tall beam of light.”')
r3 = [n for n, b in kept['call1'] if b['phase'] == 'reply3'][0] + 4
ed(r3, cap='Every turn lands in the session history')

end1 = kept['call1'][-1][0] + 1
rejoin = mark('rejoin')
ed(end1, hold=1.6, cap='Devin reads the game and adds the waypoint tool to Eira',
   vo="Devin reads the game, adds a mark waypoint tool to Eira's server and client, and builds the beam of light, the compass pin, and the clear command.")
ed(end1 + 3, badge='Sped up')
skip(end1 + 4, rejoin - 1)
ed(rejoin, cap='You can rejoin the call from inside the session at any point')

end2 = mark('call2-ended')
ed(end2, hl=True, cap='End the call; Devin keeps working')
w2 = end2 + 1
ed(w2, hold=1.6, cap='Chrome: Devin types “mark the barrow” and watches the beam appear',
   vo="In Chrome, Devin tells Eira to mark the barrow. The beam goes up across the valley and the pin lands on the compass.")
skip(w2 + 1, w2 + 28)
ed(w2 + 29, hold=1.8, cap='iPhone simulator: software rendering, about one frame a minute',
   vo="Then the iPhone simulator. It renders in software here, about one frame a minute, so this part takes a while.")
ed(w2 + 32, badge='Sped up')
skip(w2 + 33, 345)
ed(346, hold=2.2, cap='PR #91: mark_waypoint tool with beam of light and compass pin',
   vo="The pull request has the code, the tests, and both recordings. The repo has no CI, so nothing ran on it.")
skip(347, 350)
web = mark('card', 350)
ed(web, hold=1.4, cap='The Chrome recording, in real time: five checks passed',
   vo="The Chrome recording: five checks passed. The hero stays put when you mark, a new mark replaces the old one, and arriving clears it.")
skip(web + 20, 444)
ios = mark('card', 444)
ed(ios, hold=1.8, cap='The iPhone recording: beam and pin seen, 2 checks passed, 2 untested',
   vo="On the iPhone simulator, Devin saw the beam and the compass pin. Two checks passed; two were not tested, because the frames come so slowly.")
skip(ios + 16, len(B) - 1)

# Punch-ins (v2 quality pass): kit camera moves onto what matters — the transcript line, the barge-in reply, the beam in Devin's own
# Chrome test, the iPhone simulator, the PR diff. UI coords are the kit's 1440x810 space; 'reset' eases back to the full window.
Z = lambda n, x, y, z, **k: ed(n, cam={'x': x, 'y': y, 'z': z}, camForce=True, camDur=1.2, **k)
# every punch-in frames a whole panel or bubble (nothing cut at the frame edge); phone footage is framed on the phone itself
ed(8, cam='reset', camDur=0.8)
Z(33, 790, 260, 1.8); ed(36, cam='reset')                      # the ask bubble
Z(63, 720, 500, 1.6); Z(66, 720, 260, 1.6); ed(70, cam='reset')  # barge-in pill + "Okay, I'll take a look. And", then "Got it. Tall beam of light."
E['0234.png'] = {'skip': False, 'hold': 2.4, 'cam': {'x': 864, 'y': 395, 'z': 1.25}, 'camForce': True, 'camDur': 1.4,
                 'cap': 'Devin\'s Chrome test: the beam goes up across the valley, the pin lands on the compass'}
Z(249, 1009, 240, 1.7); ed(251, cam='reset')                   # the iPhone simulator window
Z(346, 450, 360, 1.7)                                          # the iPhone test card + CI status
E['0350.png'] = {'skip': False, 'hold': 2.2, 'cam': {'x': 864, 'y': 420, 'z': 1.25}, 'camForce': True, 'camDur': 1.2,
                 'cap': 'PR #91: 17 files, +332 −20'}
ed(web, cam='reset'); Z(ios, 512, 420, 2.1)                    # the iPhone recording card
spec = {
    'title': 'Hollowmere × GPT-Live-1', 'subtitle': 'Add a feature to a voice-controlled RPG, by voice',
    'outro': 'One call: web, iPhone simulator, and a PR',
    'voOutro': "That's how you add a feature to a cross-platform game with your voice, using Devin Voice and GPT-Live-1.",
    'speed': 3, 'cps': 48, 'maxZoom': 2.2, 'capPos': 'bottom', 'pollRunMax': 2.5, 'edit': E,
}
open(os.path.join(D, 'spec.js'), 'w').write('window.SPEC = ' + json.dumps(spec, indent=2, ensure_ascii=False) + ';\n')
print('spec.js', len(E), 'edits')
subprocess.run(['python3', os.path.join(D, 'synccall.py')], check=True)
