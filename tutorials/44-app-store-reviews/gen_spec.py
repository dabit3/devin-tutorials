# Writes spec.js from source-keyed edits (e.g. 'coord/0026.png'), mapped to shots/ names through the 'src'
# field assemble.py writes into shots/beats.json. Beats not kept here are skipped.
#   python3 gen_spec.py
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
beats = json.load(open(os.path.join(HERE, 'shots', 'beats.json')))
by_src = {b['src']: b for b in beats}
exp_marks = {b.get('mark'): f"exp/{b['img']}" for b in json.load(open(os.path.join(HERE, 'shots-exp', 'beats.json'))) if b.get('mark')}

def rng(src, a, b): return [f'{src}/{n:04d}.png' for n in range(a, b + 1)]
KEEP = (['exp/' + b['img'] for b in json.load(open(os.path.join(HERE, 'shots-exp', 'beats.json')))]
        + [x for x in rng('coord', 0, 10) if x != 'coord/0003.png'] + ['coord/0016.png', 'coord/0023.png', 'coord/0026.png', 'coord/0040.png']
        + ['ios/0004.png', 'ios/0008.png'] + ['ios/0013.png', 'ios/0015.png', 'ios/0017.png', 'ios/0019.png']
        + ['and/0022.png', 'and/0030.png', 'and/0040.png', 'and/0050.png', 'and/0064.png']
        + rng('pay', 3, 5)
        + ['ios/0068.png', 'ios/0073.png', 'ios/0080.png', 'ios/0081.png'] + rng('ios', 103, 105)
        + ['and/0229.png', 'and/0243.png', 'and/0257.png', 'and/0267.png']
        + rng('pay', 0, 2) + ['pay/0008.png', 'pay/0009.png'])

E = {
  'exp/0000.png': dict(hold=6, cursor=False, capPos='bottom', cap='Run it every night, or whenever new reviews come in',
    vo="In this video, Devin turns a batch of one-star app reviews into bug fixes. It reproduces each bug on the iOS Simulator and the Android emulator first."),
  exp_marks['ls']: dict(cursor=False, capPos='bottom', cap='Two exports: App Store Connect and Google Play', voGap=1.2,
    vo="Tabby is a small Expo demo app. We planted four bugs in it on purpose. The reviews are demo data in the App Store Connect and Google Play export formats."),
  exp_marks['json']: dict(hold=2.6, cursor=False, capPos='bottom', cap='App Store Connect customer reviews (demo data)'),
  exp_marks['csv']: dict(hold=2.6, cursor=False, capPos='bottom', cap='Google Play reviews CSV (demo data)'),
  'coord/0000.png': dict(hold=2.2, voGap=1.2, cap='Start one session on the demo repo',
    vo="For this demo, I start one Devin session by hand and mention the demo repo. You can also run it on a schedule, for example every night."),
  'coord/0007.png': dict(hold=4, cursor=False, cap='Group, reproduce on iOS and Android, then fix',
    vo="The prompt asks Devin to group the complaints into themes. Then two managed Devins, which are child sessions, reproduce each theme. One uses macOS with the iOS Simulator, and one uses Linux with the Android emulator. Devin fixes what reproduces in one pull request, then tests the fix on both."),
  'coord/0010.png': dict(cap='', badge='Sped up'),
  'coord/0026.png': dict(hold=4, badge=None, cap='Four bug themes, plus reviews that are not bugs', voGap=1.2,
    ring=dict(x=725, y=332, w=870, h=250), ringFor=4,
    vo="Devin reads all twenty-five reviews. It groups them into four bug themes and links each theme to the likely cause in the code. Some reviews are not bugs. One review complains about ads, but the app has no ads. Two reviews ask for new features."),
  'coord/0040.png': dict(hold=3.5, cap='Two managed Devins: macOS and Linux',
    ring=dict(x=700, y=410, w=830, h=66), ringFor=3.5,
    vo="Then the first Devin, the coordinator, starts the two managed Devins. One is a macOS session for the iOS Simulator. The other is a Linux session for the Android emulator. The coordinator waits for their results."),
  'ios/0004.png': dict(hold=3.5, cursor=False, cap="iOS Simulator: each person's share skips the tip", voGap=1.2,
    vo="On the iOS Simulator, the macOS Devin enters a bill from one of the reviews. Each person's share leaves out the tip."),
  'ios/0008.png': dict(hold=3, cap='Dark mode: the bill name disappears',
    vo="In dark mode, the bill names disappear from the list."),
  'ios/0013.png': dict(hold=2.6, cap='Force-quit and reopen: the saved bills are gone',
    vo="Then it force-quits Tabby on the Simulator and opens it again. The saved bills are gone."),
  'ios/0019.png': dict(hold=2),
  'and/0022.png': dict(hold=2.6, cursor=False, cap='The Linux Devin runs Tabby on the Android emulator', voGap=1.2,
    vo="At the same time, the Linux Devin runs the same app in Expo Go on the Android emulator."),
  'and/0040.png': dict(hold=3, cap='Same bill on Android: the tip is left out',
    vo="It finds the same tip bug."),
  'and/0050.png': dict(hold=3, cap='Dark mode hides the bill name',
    vo="Bill names disappear in dark mode here too."),
  'and/0064.png': dict(hold=3.5, cap='Deleting the last bill crashes the app',
    vo="Deleting the last bill crashes the app with an uncaught error."),
  'pay/0003.png': dict(cursor=True, voGap=1.2, cap='One PR with all four fixes',
    vo="Both Devins reproduced the bugs. The coordinator then opens one pull request with all four fixes. The ads review and the feature requests are not part of it."),
  'pay/0005.png': dict(hold=4, cursor=False, cap='Devin Review findings drove three more commits',
    vo="Devin Review found edge cases in the restart fix. The coordinator pushed three more commits to fix them."),
  'ios/0068.png': dict(hold=3, cursor=False, cap='iOS re-check: the share now includes the tip', voGap=1.2,
    vo="Then both Devins test the fix again. On iOS, the same bill now includes the tip."),
  'ios/0073.png': dict(hold=2.6, cap='Bill names are readable in dark mode',
    vo="The bill names show in dark mode."),
  'ios/0080.png': dict(hold=1.6, cap='Delete the last bill',
    vo="Deleting the last bill now goes back to the empty list. The app does not crash."),
  'ios/0081.png': dict(hold=2.4, cap='Back to the empty list, no crash'),
  'ios/0103.png': dict(hold=2, cap='Force-quit and reopen to check saved bills',
    vo="It also force-quits and opens the app again to check that the bills stay saved."),
  'and/0229.png': dict(hold=1.6, cursor=False, cap='Android re-check on the same build', voGap=1.2,
    vo="On Android, the split includes the tip too. Bill names are easy to read in dark mode."),
  'and/0243.png': dict(hold=2.6, cap='The share includes the tip'),
  'and/0257.png': dict(hold=2.2, cap='Dark mode fixed on Android'),
  'and/0267.png': dict(hold=1.6, cap='Delete down to the last bill'),
  'pay/0000.png': dict(cursor=True, voGap=1.2, cap='Both managed Devins, asleep when done',
    vo="The Agents tab lists both managed Devins. The coordinator put them to sleep when they finished."),
  'pay/0002.png': dict(hold=3, cursor=False),
  'pay/0008.png': dict(hold=3.5, cursor=False, cap='Final re-check passed on both platforms', voGap=1.2,
    vo="The final summary says both platforms passed the last check on the latest commit. CI passed, and every review thread is resolved."),
  'pay/0009.png': dict(hold=3.5, cap="It lists what it couldn't test",
    vo="It also lists what it could not test and a known follow-up. The pull request is left for you to merge."),
}
missing = [k for k in list(E) + KEEP if k not in by_src]
if missing: raise SystemExit(f'not in shots/: {missing}')
edit = {}
for b in beats:
    s = b['src']
    if s not in KEEP: edit[b['img']] = {'skip': True}; continue
    e = dict(E.get(s, {}))
    if 'hold' not in e and b.get('kind') in (None, 'poll') and b.get('hold') is None: e['hold'] = 1.2
    if e: edit[b['img']] = e
first_session = by_src['coord/0009.png']['img']
spec = {"title": "App Store reviews to fixes", "subtitle": "Group 1-star reviews, reproduce on iOS and Android, fix in one PR",
        "outro": "1-star reviews to fixes, verified on iOS and Android", "voOutro": "That's how you turn one-star reviews into fixes, tested on iOS and Android.",
        "speed": 3, "cps": 48, "maxZoom": 1.6, "pollRunMax": 2.5, "noZoom": [[first_session]], "edit": edit}
open(os.path.join(HERE, 'spec.js'), 'w').write('window.SPEC = ' + json.dumps(spec, indent=2) + ';\n')
print('kept', sum(1 for v in edit.values() if not v.get('skip')), 'of', len(beats))
