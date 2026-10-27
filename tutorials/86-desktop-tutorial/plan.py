# Edit plan for the tutorial (exec'd by make_spec.py). P(take, phase, i) finds a beat by its capture phase.
PH = {}
for b in beats:
    t, f = b['src'].split('/'); PH.setdefault((t, b.get('phase', '')), []).append(f'{t}/{int(f[:4])}')
def P(t, ph, i=0): return PH[(t, ph)][i]
SPEC_BASE = {
    'title': 'Devin Desktop: a hands-on tour', 'subtitle': 'v3.11.216 · the new Agent Window',
    'outro': 'Update Devin Desktop and try it on your project', 'voOutro': 'Update Devin Desktop, and try it on your own project.',
    'dark': True, 'speed': 3, 'cps': 60, 'maxZoom': 1.25, 'pollRunMax': 2.2, 'voSentGap': 0.45, 'subPos': LEFT,
}
# cold open: three agents side by side
ed('org/21', hold=3.0, cursor=False, subPos=RIGHT,
   vo="This is the new Devin Desktop: a local Devin, a cloud Devin and Codex, side by side in one window.")
ed('local/0', scene='whatsnew', hold=1.0, cursor=False,
   vo="Version 3.11.212 rebuilt the Agent Window on the same interface as the Devin web app. Let's tour it on a small reading-list app called Pagemark.",
   voSay="Version three eleven two twelve rebuilt the Agent Window on the same interface as the Devin web app. Let's tour it on a small reading-list app called Pagemark.")
rng('local', 1, 29, subPos=TOP)
ed(P('local', 'new'), vo="Every session starts here. Cloud runs Devin on its own machine. Local runs it on yours.")
ed(P('local', 'local-toggle'), vo="I'll pick Local,")
ed(P('local', 'folder-menu'), vo="choose the pagemark folder,")
ed(P('local', 'agent-menu'), vo="and keep the agent on Devin Local.")
ed(P('local', 'mode-menu'), vo="The mode menu sets how much it does on its own. I'll use Smart.")
ed(P('local', 'model-menu'), vo="The model picker has Adaptive, Fusion, SWE-2 High, and models from Claude, GPT, Gemini and more.",
   voSay="The model picker has Adaptive, Fusion, swee two High, and models from Claude, G P T, Gemini and more.")
ed(P('local', 'model-list'), hold=1.0)
ed(P('local', 'model-fusion'), vo="Fusion pairs a frontier lead model with a cheaper sidekick that writes the code. I'll pick it.")
ed(P('local', 'prompt'), vo="Then I ask for a Mark as read toggle, an Unread only filter, and tests.")
rng('local', 30, 82, subPos=LEFT)
ed(P('local', 'send'), badge='Sped up', vo="Devin reads the code, makes the edits, and asks before it runs commands.")
polls('local', 31, 59, keep={38, 50, 56})
ed(P('local', 'approve'), hold=0.8, vo="I allow it, and it keeps going.")
ed(P('local', 'done'), badge='', hold=2.0, vo="It reports the files it changed and the tests it added.")
ed(P('local', 'prompt2'), vo="Next, I ask it to start the dev server.")
ed(P('local', 'send2'), badge='Sped up')
polls('local', 71, 82, keep={82})
for n in (61, 62, 67, 69, 77): ed(f'local/{n}', skip=True)
ed(PH[('local', 'approve')][1], vo="It asks again before starting the server, and I allow it.")
ed(P('preview2', 'tab-preview'), badge='', subPos=LEFT, vo="The Preview tab opens the running app right inside the session.")
rng('preview2', 0, 17, subPos=LEFT)
ed(P('preview2', 'mark'), vo="Mark as read works, and the title dims.")
for n in (3, 5, 7, 10, 12, 15): ed(f'preview2/{n}', skip=True)
ed(P('preview2', 'unread-on'), vo="and Unread only hides the books I've read.")
ed(P('preview2', 'unread-off'), vo="Untick it, and every book comes back.")
ed(P('preview2', 'reload'), vo="After a reload, the read state is still there.")
ed(P('preview2', 'persisted'), hold=0.8)
ed(P('preview2', 'changes'), hold=2.0, vo="And the Changes tab shows a diff for every file.")
rng('tests', 0, 34, subPos=LEFT)
ed(P('tests', 'prompt3'), vo="Now Devin tests its own change. I ask it to run the full suite.")
ed(P('tests', 'send3'), badge='Sped up')
polls('tests', 7, 33, keep={20})
ed(P('tests', 'tests-done'), badge='', hold=2.6, vo="All thirteen tests pass, across both test files.")
ed('acp/0', scene='acp', hold=1.0, cursor=False,
   vo="Desktop also speaks ACP, the Agent Client Protocol: an open standard for how editors talk to coding agents. So you can run agents like Codex, Claude Agent and Gemini CLI.")
rng('acp', 1, 15, subPos=RIGHT)
ed(P('acp', 'app-settings'), vo="You turn them on in Settings, under Agents.")
ed(P('acp', 'agent-search'), vo="I'll search for Codex, and enable it.")
ed(P('acp', 'agent-enabled'), hold=1.0)
for n in (12, 14, 15): ed(f'acp/{n}', skip=True)
for n in (0, 2, 4, 7, 10, 16): ed(f'acp2/{n}', skip=True)
rng('acp2', 0, 26, subPos=TOP)
ed(P('acp2', 'local-acp'), vo="Back in a new Local session,")
ed(P('acp2', 'agent-menu2'), vo="Codex is now in the agent menu.")
ed(P('acp2', 'acp-prompt'), vo="I ask how the new filter works, without changing any files.")
ed(P('acp2', 'acp-send'), badge='Sped up', subPos=LEFT)
polls('acp2', 18, 26, keep={26})
ed('acp2/26', badge='', hold=2.6, subPos=LEFT, vo="Codex reads the code and explains it. No files changed.")
rng('cloud', 0, 27, subPos=TOP)
ed(P('cloud', 'new-cloud'), vo="Now the cloud. A cloud Devin gets a virtual machine of its own.")
ed(P('cloud', 'config'), vo="Configuration sets up that machine.")
ed(P('cloud', 'env-list'), hold=1.4, vo="Its environment can be Ubuntu, macOS or Windows,")
ed(P('cloud', 'repos-list'), vo="and which repositories it can use.")
ed(P('cloud', 'caps-list'), hold=1.4, vo="The capability menu offers Fusion, Ultra, Normal and Lite, with SWE-2 in preview.",
   voSay="The capability menu offers Fusion, Ultra, Normal and Lite, with swee two in preview.")
ed(P('cloud', 'cloud-prompt'), vo="I ask it to check out the branch, run the tests and build, and try the controls in a browser.")
ed(P('cloud', 'cloud-send'), badge='Sped up', vo="It works on its own machine,")
rng('cloud', 28, 50, subPos=LEFT)
polls('cloud', 28, 50, keep={40, 50})
ed('cloud/50', badge='', hold=1.6, vo="and drives Chrome to test Pagemark itself.")
rng('org', 0, 49, subPos=RIGHT)
ed(P('org', 'cloud-report'), hold=2.2, vo="Its report: both controls work, all thirteen tests pass, and two small UX issues are worth a look.")
ed(P('org', 'cloud-report2'), hold=1.6)
ed(P('org', 'local-open'), vo="Now, arranging sessions.")
ed(P('org', 'split1-grab'), vo="Drag one from the sidebar onto an open session,")
ed(P('org', 'split1-drop'), hold=0.8, vo="and they sit side by side, up to eight at once.")
ed(P('org', 'split2-grab'), vo="I add the Codex session the same way.")
ed(P('org', 'three-up'), hold=1.0)
ed(P('org', 'props'), vo="Properties sorts by last updated or last created,")
ed(P('org', 'filter-open'), hold=1.4, vo="filters by session type, agent, status, pull requests and more,")
ed(P('org', 'group-open'), hold=1.2, vo="and groups sessions by workspace.")
ed(P('org', 'ctx'), vo="Right-click a session to file it in a folder,")
ed(P('org', 'new-folder'), vo="or make a new one, like Pagemark launch.")
ed(P('org', 'folder-made'), hold=1.0, vo="Pagemark launch now holds the Codex session,")
ed(P('org', 'ctx2'), vo="and I move the local session in too.")
ed(P('org', 'org-done'), hold=1.6)
ed('org/49#2', scene='recap', hold=1.0, cursor=False,
   vo="So: local and cloud sessions, any model including Fusion and SWE-2, ACP agents, real tests, and sessions you can arrange however you like.",
   voSay="So: local and cloud sessions, any model including Fusion and swee two, ACP agents, real tests, and sessions you can arrange however you like.")
# tighten visual stretches that outran the narration
for k in ('local/6', 'local/9', 'acp/6', 'acp/13', 'acp2/1', 'cloud/11', 'cloud/12', 'org/1', 'org/22', 'org/37', 'org/38', 'org/40', 'org/45', 'org/47'):
    if k in IDX: ed(k, skip=True)
for k in ('org/12', 'org/19'): ed(k, hold=0.3)
for k in ('org/13', 'org/20'): ed(k, hold=0.6)
ed(P('org', 'three-up'), hold=0.8); ed(P('org', 'org-done'), hold=0.6); ed(P('acp', 'agent-enabled'), hold=0.6)
for n in (8, 9, 10, 11, 15, 16, 17, 18): ed(f'org/{n}', hold=0.3)
ed(P('org', 'sort-open'), hold=0.8)
for k in ('local/19', 'local/21', 'cloud/2', 'cloud/6', 'cloud/9'):
    if k in IDX and not E.get(IDX[k], {}).get('vo'): ed(k, skip=True)
# second pass from the timing audit
ed('local/8', skip=True); ed('acp/8', hold=0.3); ed(P('acp', 'agent-enabled'), hold=0.3); ed('acp2/6', hold=0.6); ed('acp2/9', skip=True)
ed('org/19', hold=0.2); ed('org/20', hold=0.4); ed(P('org', 'three-up'), hold=0.5); ed('org/46', hold=0.4); ed('org/48', hold=0.3)
ed('org/49#2', hold=0.2); ed(P('preview2', 'changes'), hold=1.4)
# subtitles: let the kit place each one in the clearest space on its frames (audited for overlap)
for v in E.values(): v.pop('subPos', None)
SPEC_BASE['subPos'] = 'auto'
SPEC_BASE['voCapScale'] = 0.9
# split-view frames are dense: use the clear space in the right-hand pane
for n in range(13, 20):
    if f'org/{n}' in IDX: ed(f'org/{n}', subPos={'x': 0.78, 'y': 0.86})
for k in [f'org/{n}' for n in range(20, 50)] + ['org/21#2']:
    if k in IDX: ed(k, subPos={'x': 0.77, 'y': 0.15})
# diagram beats: no click ring from the shot underneath, subtitles below the cards
for v in E.values():
    if v.get('scene'): v.update(kind='still', target=None, ring=False, hl=False, subPos={'x': 0.5, 'y': 0.88})
ed('org/21#2', hold=0.8)
# Settings > Agents: subtitles in the empty lower sidebar, off the search field
for n in range(0, 16):
    k = f'acp/{n}'
    if k in IDX and not E.get(IDX[k], {}).get('scene'): ed(k, subPos={'x': 0.095, 'y': 0.9, 'maxW': 0.17})
ed('acp/0', hold=7.0, subPos={'x': 0.095, 'y': 0.9, 'maxW': 0.17})  # ACP diagram stays up through the explanation; subtitles where they stay clear of the Settings page that follows
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
ed(P('preview2', 'reload'), subPos=LEFT)  # this line runs on into the Changes tab, so it sits in the sidebar
ed('acp/8', hold=0.1)
ed('acp/9', skip=True)
ed('acp/11', hold=0.1)
# Tighter timing: outro voice right as the outro card lands; drag frames and folder moves held more briefly
SPEC_BASE['outroVoDelay'] = -0.3
for k, h in (('org/15', 0.1), ('org/16', 0.1), ('org/17', 0.1), ('org/18', 0.1), ('org/19', 0.1), ('org/20', 0.2), ('org/21#2', 0.5),
             ('org/29', 0.8), ('org/30', 0.6), ('org/34', 0.6)): ed(k, hold=h)
