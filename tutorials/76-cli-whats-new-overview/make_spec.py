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
   vo="This release adds long-running goals, model and config controls, plugin and MCP upgrades, and terminal and cloud improvements.")
ed(1, hold=1.0,
   vo="Here in Ghostty, I'm on version 3000.11.92, the latest stable.",
   voSay="Here in Ghostty, I'm on version three thousand, point eleven, point ninety-two, the latest stable.")
ed(9, hold=0.8)
ed(10, vo="The headline is /goal: Devin keeps working across turns until the goal is complete or blocked.",
    voSay="The headline is slash goal: Devin keeps working across turns until the goal is complete or blocked.")
ed(40, hold=1.0, vo="I'll ask for a collapse toggle, done when tests, lint and build pass.",
    ring=find('0040.png', '/goal'), ringFor=2.4)
ed(43, hold=0.8, ring=find('0043.png', 'Goal Running'), ringFor=1.0)
ed(49, hold=1.0, vo="Pressing Ctrl+C now clears a draft without stopping the task.", voSay="Pressing Control C now clears a draft without stopping the task.",
    ring=find('0049.png', 'Also rename the Backlog column'), ringFor=1.4)
ed(50, hold=1.4, ring=find('0050.png', 'Guide Devin while it works'), ringFor=1.2)
ed(55, vo="And messages typed while it works go straight to the running turn.")
ed(64, hold=0.6)
ed(65, hold=0.8)
ed(96, hold=1.4, vo="Devin reads it at its next step.")
ed(186, hold=0.9)
ed(206, hold=0.9)
ed(216, hold=1.2, vo="When the checks pass, it reports the goal complete.", ring=find('0216.png', '✓ Goal Complete'), ringFor=2.0)
ed(217, hold=0.4)
ed(218, hold=1.2, vo="Typing /goal on its own shows the status.", voSay="Typing slash goal on its own shows the status.",
    ring=find('0218.png', '✓ Goal Complete (1 turn)'), ringFor=2.0)
ed(219, scene='goalcmds', hold=1.0, cursor=False,
   vo="And /goal resume picks up after an interrupt, /goal clear drops it, and runs pause after 50 turns.",
   voSay="And slash goal resume picks up after an interrupt, slash goal clear drops it, and runs pause after fifty turns.")
ed(220, hold=1.2, vo="In the model picker, Alt+Enter switches for this session only, and Enter still saves a default.",
    voSay="In the model picker, Alt Enter switches for this session only, and Enter still saves a default.")
ed(221, hold=1.4, ring=find('0221.png', 'alt+↵ this session only'), ringFor=2.0)
ed(222, hold=1.4, ring=find('0222.png', 'Model set to Adaptive for this session'), ringFor=1.8)
ed(223, scene='config', hold=1.0, cursor=False,
   vo="Provider plans can now pay for marked models, and new settings cover typewriter text, the subagent model, local tools permissions, and the sessions folder.")
for n in range(224, 243): ed(n, skip=True)
ed(243, vo="And devin mcp list now shows a Source line naming where each server came from.")
ed(252, hold=1.6, ring=find('0252.png', 'Source: plugin https://github.com/CognitionAI/devin-marketplace#plugins/metabase'), ringFor=2.0)
ed(253, scene='ext', hold=1.0, cursor=False,
   vo="Plugin installs now take skills-only repos, plugins can target cloud or local with stable hook paths, new hooks run around compaction, MCP supports the newest protocol, and remote MCPs are in private preview.")
ed(254, vo="Running devin cloud on its own now opens a Devin Cloud session.")
ed(267, hold=1.4, ring=find('0267.png', 'Cloud · Normal'), ringFor=1.6)
ed(268, scene='terminal', hold=1.0, cursor=False,
   vo="Terminals can show session status, sandbox prompts can always allow a command, devin connect copies files, Ctrl+U clears line by line, and stuck sessions can be forced open.",
   voSay="Terminals can show session status, sandbox prompts can always allow a command, devin connect copies files, Control U clears line by line, and stuck sessions can be forced open.")
ed(269, scene='fixes', hold=1.0, cursor=False,
   vo="Org-required prompts now say so, smart mode asks less, startup is faster, and session history works on network drives.")

# scene rows appear as the narration names them: keyword -> time in the cut line (chunk times, interpolated by characters)
KEYS = {'0000.png': ['goals', 'model and config', 'plugin and MCP', 'terminal and cloud'],
        '0219.png': [None, None, 'resume', 'clear', '50 turns'],
        '0223.png': ['Provider plans', 'typewriter', 'subagent', 'local tools', 'sessions folder'],
        '0253.png': ['skills-only', 'target cloud', 'hook paths', 'compaction', 'newest protocol', 'remote MCPs'],
        '0268.png': ['session status', 'sandbox', 'devin connect', 'Ctrl+U', 'forced open'],
        '0269.png': ['Org-required', 'Org-required', 'smart mode', 'startup', 'session history']}
LP = f'{D}/vo/T8iHhGIWPm2GVYpQD1Am/lines.json'
REVEAL = {}
if os.path.exists(LP):
    L = json.load(open(LP))
    def when(img, kw, i):
        if kw is None: return round(0.15 + 0.35 * i, 2)
        for c in L[img]['chunks']:
            if kw in c['text']:
                return round(max(0, c['t0'] + (c['t1'] - c['t0']) * c['text'].index(kw) / len(c['text']) - 0.15), 2)
        print(f'warning: {img}: {kw!r} not in narration (regenerate vo)'); return round(0.15 + 0.35 * i, 2)
    for img, kws in KEYS.items():
        if img in L: REVEAL[E[img]['scene']] = [when(img, k, i) for i, k in enumerate(kws)]
spec = {
    'title': 'Devin CLI: What\'s new', 'subtitle': 'Stable v3000.11.92 · Oct 14, 2026',
    'outro': 'Update the CLI and give Devin a goal', 'voOutro': 'Run devin update, and give Devin a goal.',
    'dark': True, 'speed': 3, 'cps': 60, 'maxZoom': 1.3, 'pollRunMax': 2.2, 'voSentGap': 0.45,
    'reveal': REVEAL, 'edit': E,
}
open(f'{D}/spec.js', 'w').write('window.SPEC = ' + json.dumps(spec, indent=2, ensure_ascii=False) + ';\n')
print(len(E), 'edits;', sum(1 for v in E.values() if v.get('vo')), 'vo lines;', sum(len(v['vo'].split()) for v in E.values() if v.get('vo')), 'words')
