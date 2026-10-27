# Edit plan for the overview (exec'd by make_spec.py): only the beats listed in KEEP are shown.
PH = {}
for b in beats:
    t, f = b['src'].split('/'); PH.setdefault((t, b.get('phase', '')), []).append(f'{t}/{int(f[:4])}')
def P(t, ph, i=0): return PH[(t, ph)][i]
SPEC_BASE = {
    'title': "Devin Desktop: what's new", 'subtitle': 'v3.11.216 · the new Agent Window',
    'outro': 'Update Devin Desktop today', 'voOutro': 'Update Devin Desktop, and give it a try.',
    'dark': True, 'speed': 3, 'cps': 60, 'maxZoom': 1.25, 'pollRunMax': 1.6, 'voSentGap': 0.45, 'subPos': LEFT,
}
KEEP = {'org/21', 'local/0', 'local/1', 'local/3', 'local/17', 'local/18', 'local/20', 'local/30', 'local/38', 'local/50', 'local/56', 'local/60',
        'preview2/1', 'preview2/2', 'preview2/4', 'preview2/6', 'preview2/8', 'preview2/9', 'preview2/16', 'preview2/17', 'tests/34',
        'acp/0', 'acp/4', 'acp/5', 'acp/7', 'acp/8', 'acp/10', 'acp/11', 'acp2/5', 'acp2/6', 'acp2/26',
        P('cloud', 'new-cloud'), P('cloud', 'env-list'), P('cloud', 'caps-list'), P('cloud', 'cloud-send'), 'cloud/40', 'cloud/50',
        P('org','cloud-report'), P('org','local-open'), *[f'org/{n}' for n in range(7, 14)], 'org/21#2', P('org','props'), P('org','sort-open'), P('org','filter-open'), P('org','group-open'), *[f'org/{n}' for n in range(31, 43)], 'org/49', 'org/49#2'}
for k in IDX:
    if k not in KEEP: ed(k, skip=True)
for k in KEEP:
    t = k.split('/')[0]; ed(k, subPos=TOP if (t in ('local', 'cloud') and IDX[k] < IDX.get(P(t, 'send') if t == 'local' else P('cloud', 'cloud-send'))) else (RIGHT if t in ('org', 'acp') else LEFT))
ed('org/21', hold=2.6, cursor=False, subPos=RIGHT, vo="This is the new Devin Desktop. A local Devin, a cloud Devin and Codex, side by side in one window.")
ed('local/0', scene='whatsnew', hold=1.0, cursor=False,
   vo="Version 3.11.212 rebuilt the Agent Window on the same interface as the Devin web app, and 3.11.216 is the latest release.",
   voSay="Version three eleven two twelve rebuilt the Agent Window on the same interface as the Devin web app, and three eleven two sixteen is the latest release.")
ed('local/1', scene='localcloud', hold=0.6, cursor=False,
   vo="Every session is Local, running on your machine, or Cloud, where Devin gets a virtual machine of its own.")
ed('local/3', vo="Pick Local, a folder and an agent,")
ed('local/17', vo="then a model: Adaptive, Fusion, SWE-2 High, or models from Claude, GPT, Gemini and more.",
   voSay="then a model: Adaptive, Fusion, swee two High, or models from Claude, G P T, Gemini and more.")
ed('local/18', hold=1.4)
ed('local/20', scene='fusion', hold=0.6, cursor=False,
   vo="Fusion pairs a frontier lead model, which plans and reviews, with a cheaper sidekick that writes the code and runs the tests.")
ed('local/30', badge='Sped up', vo="Here, Devin adds a read-state filter to a reading-list app,")
ed('local/60', badge='', hold=1.2, vo="and reports what it changed.")
ed('preview2/1', vo="The Preview tab runs the app inside the session,")
ed('preview2/9', hold=1.2)
ed('preview2/16', vo="and Changes shows every diff.")
ed('preview2/17', hold=1.2)
ed('tests/34', hold=2.2, vo="Devin tests its own work, too. All thirteen tests pass.")
ed('acp/0', scene='acp', hold=0.8, cursor=False,
   vo="ACP, the Agent Client Protocol, is an open standard for how editors talk to coding agents, so Desktop can run Codex, Claude Agent, Gemini CLI and others.")
ed('acp/4', vo="Turn one on in Settings, under Agents,")
ed('acp/11', hold=0.8)
ed('acp2/5', vo="and it shows up in a Local session.")
ed('acp2/26', hold=2.0, vo="Here, Codex explains the new filter.")
ed(P('cloud', 'new-cloud'), scene='envs', hold=0.8, cursor=False,
   vo="Desktop runs on macOS, Windows and Linux. Cloud sessions run on Ubuntu, macOS or Windows machines, and Windows WSL distros now sit next to SSH hosts as remote hosts.")
ed(P('cloud', 'env-list'), hold=1.4, vo="You pick the environment in Configuration,")
ed(P('cloud', 'caps-list'), hold=1.4, vo="and a capability: Fusion, Ultra, Normal, Lite, or SWE-2 in preview.",
   voSay="and a capability: Fusion, Ultra, Normal, Lite, or swee two in preview.")
ed(P('cloud', 'cloud-send'), badge='Sped up', vo="This cloud Devin tests Pagemark in Chrome on its own machine,")
ed('cloud/50', badge='', hold=1.0)
ed(P('org','cloud-report'), hold=1.8, vo="and reports back: both controls work, with two small UX notes.")
ed(P('org','local-open'), vo="Drag sessions onto an open one to see up to eight side by side.")
ed('org/21#2', hold=1.0)
ed(P('org','props'), vo="Sort them,")
ed(P('org','filter-open'), hold=1.0, vo="filter them,")
ed(P('org','group-open'), hold=1.0, vo="group them by workspace,")
ed(P('org','ctx'), vo="and file them into folders.")
ed('org/49', hold=1.4)
ed('org/49#2', scene='recap', hold=0.8, cursor=False,
   vo="Local and cloud, Fusion and SWE-2, ACP agents, real tests, and sessions arranged your way.",
   voSay="Local and cloud, Fusion and swee two, ACP agents, real tests, and sessions arranged your way.")
# tighten visual stretches that outran the narration
for k in ('preview2/2', 'preview2/6', 'acp/7', 'acp/10', 'org/8', 'org/10', 'org/31', 'org/33', 'org/35', 'org/37', 'org/38', 'org/40', 'org/41'):
    if k in IDX: ed(k, skip=True)
for k in ('org/12', 'org/13'): ed(k, hold=0.4)
ed('org/21#2', hold=0.6); ed('org/49', hold=0.6); ed('acp/11', hold=0.4); ed('preview2/9', hold=0.6); ed(P('org', 'filter-open'), hold=0.6); ed(P('org', 'group-open'), hold=0.6)
for n in (9, 11): ed(f'org/{n}', hold=0.3)
for n in (34, 36, 39, 42): ed(f'org/{n}', hold=0.5)
ed(P('org', 'sort-open'), hold=0.8)
# second pass from the timing audit
ed('acp/5', hold=0.5); ed('acp/8', hold=0.4); ed('org/49#2', hold=0.2)
for n in (34, 36, 39, 42): ed(f'org/{n}', hold=0.3)
# subtitles: let the kit place each one in the clearest space on its frames (audited for overlap)
for v in E.values(): v.pop('subPos', None)
SPEC_BASE['subPos'] = 'auto'
SPEC_BASE['voCapScale'] = 0.9
# split-view frames are dense: use the clear space in the right-hand pane
for n in range(13, 20):
    if f'org/{n}' in IDX: ed(f'org/{n}', subPos={'x': 0.78, 'y': 0.86})
for k in [f'org/{n}' for n in range(20, 50)] + ['org/21#2']:
    if k in IDX: ed(k, subPos={'x': 0.77, 'y': 0.15})
ed(P('org', 'local-open'), subPos={'x': 0.78, 'y': 0.86})
# diagram beats: no click ring from the shot underneath, subtitles below the cards
for v in E.values():
    if v.get('scene'): v.update(kind='still', target=None, ring=False, hl=False, subPos={'x': 0.5, 'y': 0.88})
# Settings > Agents: subtitles in the empty lower sidebar, off the search field
for n in range(0, 16):
    k = f'acp/{n}'
    if k in IDX and not E.get(IDX[k], {}).get('scene'): ed(k, subPos={'x': 0.095, 'y': 0.9, 'maxW': 0.17})
ed('acp/0', hold=9.0)  # ACP diagram stays up for the whole ACP explanation
# New-session screen: subtitles in the clear band under the composer and its menus (auto placement put them inside the empty composer)
for n in range(1, 30):
    k = f'local/{n}'
    if k in IDX and not E.get(IDX[k], {}).get('scene'): ed(k, subPos={'x': 0.64, 'y': 0.9})
# Chat and Preview views: subtitles in the empty lower sidebar, clear of the chat, approvals and composer
for t, a, b, pos in (('local', 30, 83, LEFT), ('preview2', 0, 40, LEFT), ('cloud', 0, 26, {'x': 0.45, 'y': 0.9}), ('cloud', 26, 28, LEFT)):
    for n in range(a, b):
        k = f'{t}/{n}'
        if k in IDX and not E.get(IDX[k], {}).get('scene'): ed(k, subPos=pos)
# Preview tab: subtitles in the empty header band right of the Pagemark title; Changes tab: in the empty pane under the diff
for n in range(0, 40):
    k = f'preview2/{n}'
    if k in IDX: ed(k, subPos={'x': 0.83, 'y': 0.2} if 1 <= n <= 15 else {'x': 0.77, 'y': 0.7})
