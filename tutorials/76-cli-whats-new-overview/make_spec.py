"""Writes spec.js (pure JSON, as vo.py needs) from the edit plan below. Usage: python3 make_spec.py"""
import json, os
D = os.path.dirname(os.path.abspath(__file__))
beats = json.load(open(f'{D}/shots/beats.json'))
G = json.load(open(f'{D}/shots/term.json'))
txt = {b['img']: b.get('txt', '') for b in beats}

def cells(r0, r1, c0, c1, pad=6):
    L, R = G['x'] + c0 * G['cw'] - pad, G['x'] + (c1 + 1) * G['cw'] + pad
    T, B = G['y'] + r0 * G['ch'] - pad, G['y'] + (r1 + 1) * G['ch'] + pad
    return {'x': round((L + R) / 2), 'y': round((T + B) / 2), 'w': round(R - L), 'h': round(B - T)}

def find(img, s):
    for i, l in enumerate(txt[img].split('\n')):
        if s in l:
            c0 = len(l[:l.index(s)]); return cells(i, i, c0, c0 + len(s) - 1)
    raise SystemExit(f'{img}: no {s!r}')

E = {}
def ed(img, **k): E[f'{img:04d}.png'] = k
KEEP_POLLS = {96, 186, 206}
for b in beats:
    n = int(b['img'][:4])
    if b.get('kind') == 'poll' and (44 <= n <= 54 or 41 <= n <= 42 or (66 <= n <= 215 and n not in KEEP_POLLS) or 240 <= n <= 241):
        ed(n, skip=True)

ed(0, scene='themes', hold=1.0, cursor=False,
   vo="Let's look at what's new in the Devin CLI, starting with long-running goals, then models, plugins, and terminal features.")
ed(1, hold=1.0, vo="Here in Ghostty, I've updated to the latest version of Devin, so let's dive in.")
ed(9, hold=0.8)
ed(10, vo="The biggest addition is /goal, which keeps Devin working on an objective turn after turn until it's complete or blocked.",
    voSay="The biggest addition is slash goal, which keeps Devin working on an objective turn after turn until it's complete or blocked.")
ed(40, hold=1.0, vo="I'll ask for a collapse toggle on each column, and tell it to finish when tests, lint and build all pass.",
    ring=find('0040.png', '/goal'), ringFor=2.4)
ed(43, hold=0.8, ring=find('0043.png', 'Goal Running'), ringFor=1.0)
ed(49, hold=1.0, vo="Pressing Ctrl+C while it works now clears what I've typed, without stopping the task.",
    voSay="Pressing Control C while it works now clears what I've typed, without stopping the task.",
    ring=find('0049.png', 'Also rename the Backlog column'), ringFor=1.4)
ed(50, hold=1.4, ring=find('0050.png', 'Guide Devin while it works'), ringFor=1.2)
ed(55, vo="A message sent while it works now goes straight to the running turn, so you can steer it without cancelling anything.")
ed(64, hold=0.6)
ed(65, hold=0.8)
ed(96, hold=1.4, vo="Devin reads it at its next step.")
ed(186, hold=0.9)
ed(206, hold=0.9)
ed(216, hold=1.2, vo="When all the checks pass, it reports the goal complete.", ring=find('0216.png', '✓ Goal Complete'), ringFor=2.0)
ed(217, hold=0.4)
ed(218, hold=1.2, vo="Typing /goal on its own shows the status.", voSay="Typing slash goal on its own shows the status.",
    ring=find('0218.png', '✓ Goal Complete (1 turn)'), ringFor=2.0)
ed(219, scene='goalcmds', hold=1.0, cursor=False,
   vo="If a run gets interrupted, /goal resume picks it back up, /goal clear drops it, and a run pauses itself after 50 turns.",
   voSay="If a run gets interrupted, slash goal rezoom picks it back up, slash goal clear drops it, and a run pauses itself after fifty turns.")
ed(220, hold=1.2, vo="That covers goals, so let's move on to the rest of the release, starting with the model picker.")
ed(221, hold=1.4, vo="Alt+Enter now switches models for this session only, while Enter still saves your pick as the default.",
    voSay="Alt Enter now switches models for this session only, while Enter still saves your pick as the default.",
    ring=find('0221.png', 'alt+↵ this session only'), ringFor=2.0)
ed(222, hold=1.4, ring=find('0222.png', 'Model set to Adaptive for this session'), ringFor=1.8)
ed(223, scene='billing', hold=1.0, cursor=False,
   vo="If you pay for a provider plan like ChatGPT, the picker now marks the models it can cover with an asterisk, and /billing turns that on or off.",
   voSay="If you pay for a provider plan like ChatGPT, the picker now marks the models it can cover with an asterisk, and slash billing turns that on or off.")
ed(224, scene='config', hold=1.0, cursor=False,
   vo="Two new settings let you turn off the typewriter effect so text appears instantly, and pick the model your subagents use.")
for n in range(225, 243): ed(n, skip=True)
ed(243, vo="Next, let's look at plugins and MCP servers.")
ed(252, hold=1.6, vo="Running devin mcp list now shows a Source line, naming the configuration file or plugin each server came from.",
   ring=find('0252.png', 'Source: plugin https://github.com/CognitionAI/devin-marketplace#plugins/metabase'), ringFor=2.0)
ed(253, scene='ext', hold=1.0, cursor=False,
   vo="Plugin installs also accept repos that only ship skills, new hooks run around context compaction, and remote MCP servers from Devin Cloud are in private preview.")
ed(254, vo="The last group is the terminal and cloud, where running devin cloud on its own now opens a Devin Cloud session.")
ed(267, hold=1.4, ring=find('0267.png', 'Cloud · Normal'), ringFor=1.6)
ed(268, scene='terminal', hold=1.0, cursor=False,
   vo="Your terminal can now show which sessions need you, cloud sessions can copy files to and from your machine, and you can let a trusted command always run outside the sandbox.")
ed(269, scene='fixes', hold=1.0, cursor=False,
   vo="On top of that, smart mode asks for approval less often, startup is faster, and session history works on network drives.")

# scene rows appear as the narration says each cue word: times come from STT word timestamps of each line's clip (cues.json, made by cues.py)
KEYS = {'0000.png': ['goals', 'models', 'plugins', 'terminal'],
        '0219.png': [None, None, 'resume|rezoom', 'clear', 'fifty|50'],
        '0223.png': ['marks', 'billing'],
        '0224.png': ['typewriter', 'subagents'],
        '0253.png': ['skills', 'compaction', 'remote'],
        '0268.png': ['sessions', 'files', 'sandbox'],
        '0269.png': ['smart', 'startup', 'network']}
CP = f'{D}/cues.json'
REVEAL = {}
if os.path.exists(CP):
    C = json.load(open(CP))
    def when(img, kw, i):
        if kw is None: return round(0.15 + 0.35 * i, 2)
        for w in C.get(img, []):
            if any(w['w'].startswith(k) for k in kw.split('|')): return round(max(0, w['t'] - 0.1), 2)
        print(f'warning: {img}: {kw!r} not in cues (run cues.py)'); return round(0.15 + 0.35 * i, 2)
    for img, kws in KEYS.items():
        REVEAL[E[img]['scene']] = [when(img, k, i) for i, k in enumerate(kws)]
spec = {
    'title': 'Devin CLI: What\'s new', 'subtitle': 'Stable v3000.11.92 · Oct 14, 2026',
    'outro': 'Update the CLI and give Devin a goal', 'voOutro': 'Run devin update, and give Devin a goal.',
    'dark': True, 'speed': 3, 'cps': 60, 'maxZoom': 1.3, 'pollRunMax': 2.2, 'voSentGap': 0.45,
    'reveal': REVEAL, 'edit': E,
}
open(f'{D}/spec.js', 'w').write('window.SPEC = ' + json.dumps(spec, indent=2, ensure_ascii=False) + ';\n')
print(len(E), 'edits;', sum(1 for v in E.values() if v.get('vo')), 'vo lines;', sum(len(v['vo'].split()) for v in E.values() if v.get('vo')), 'words')
