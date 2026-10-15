# one-off: builds spec.js and reorders shots/beats.json into story order
import json
b = json.load(open('shots/beats.json'))
by = {x['img']: x for x in b}
P = lambda i: '%04d.png' % i
E = {}
order = []
def k(img, **kw):
    order.append(img); E[img] = kw
k('rec1.png', hold=5, cap='We recorded this chore ourselves, on seeded demo data',
  vo='Every morning, someone opens this refund dashboard and does the same few clicks. We recorded that chore once ourselves, in a demo app we built with seeded data that resets on every reload.')
k('rec2.png', hold=1.6)
k('rec3.png', hold=2.2, cap='Filter to Pending')
k('rec4.png', hold=3, cap='Approve damaged-item refunds of $50 or less',
  vo='Filter to pending, and approve every damaged item refund of fifty dollars or less.')
k('rec5.png', hold=1.4, cap='Export the approved CSV')
k('rec6.png', hold=2.0, cap='Check it in Exports', vo='Then export the approved CSV and check it in Exports.')
k(P(0), hold=1.4, cap='Start a new Devin session',
  vo='In Devin, start a new session and attach the recording like any other file.')
k(P(1)); k(P(2), cap='Attach the screen recording')
k(P(9), hold=3, cap='Give the goal: script it, prove it, schedule it',
  vo='Then give it the goal: watch the video, write a Playwright script that does the same thing, prove it in its browser, and schedule it for every weekday at nine UTC.')
k(P(11)); k(P(13), hold=1.4)
k(P(25), hold=4.5, cap='Devin pulls frames and infers the rule',
  vo='Devin pulls frames out of the video and works out the rule behind the clicks: damaged items of fifty dollars or less get approved, and the bigger ones stay pending.')
for i in (26, 30, 36, 40, 44):
    k(P(i), hold=1.1, badge='Sped up')
E[P(26)].update(cap='It writes the script and runs it headless',
  vo='It writes the script, runs it headless, and checks that it approves the same six refunds as the recording.')
k(P(217), hold=3, cap='We asked for a headed rerun to watch',
  vo='Devin had already run it in its own Chrome before we opened the Computer tab, so we asked for one more run, slowed down, to watch.')
k(P(219))
for i in range(223, 239, 2):
    if P(i) in by: k(P(i), hold=1.0, cursor=False)
E[P(225)].update(cap="The script drives Refund Desk in Devin's browser",
  vo="In the Computer tab, the script drives Refund Desk on its own: the pending filter, six approvals, the export, and the Exports page.")
k(P(277), hold=3, cap='Devin opened a PR with the script',
  vo='Devin also opened a pull request with the script, so the whole chore now lives in the repo as code.')
k(P(278), hold=2.2, cap='refund-chore.js, the whole chore in code')
k(P(186), hold=2.6, cap='Devin asks how the automation should run',
  vo='For the schedule, Devin asks two setup questions: who the runs act as, and when to email. We picked the organization and every run.')
k(P(188)); k(P(190))
k(P(191), hold=2.6, cap='Approve the automation Devin drafted',
  vo='Then it drafts the automation, with a weekday nine o\'clock schedule and a tight network policy, and we approve it.')
k(P(192)); k(P(193))
k(P(194), hold=2.4, cap='Devin offers a test run', vo='Devin offers a test run right away, and we approve that too, so we can watch one real run.')
k(P(196), hold=0.8); k(P(197), hold=1.0); k(P(198), hold=0.8); k(P(199), hold=1.0)
k(P(208), hold=2.6, cap="It's in the Automations list", vo='The automation now sits in the Automations list, active, and running as the organization.')
k(P(209), hold=0.8); k(P(210), hold=0.8)
k(P(211), hold=1.0, cap='Runs weekdays at 9:00 as the organization')
k(P(212), hold=2.6, cap='A schedule trigger, not a CI cron',
  vo='Its trigger runs on weekdays at nine in the morning, and the events list shows the test run we just started.')
k(P(213), hold=1.6, cap='One real run, triggered on camera')
k(P(214))
k(P(207), hold=5, cap='SUCCESS: the same six refunds, CSV attached',
  vo='About a minute later, the run reports success, with the same six approvals, and the CSV and a screenshot attached. From now on, it runs every weekday at nine, without us.')
for x in b:
    if x['img'] not in E: E[x['img']] = {'skip': True}
nb = [by[i] for i in order] + [x for x in b if x['img'] not in order]
json.dump(nb, open('shots/beats.json', 'w'), indent=1)
spec = {
  'title': 'Record a chore once', 'subtitle': 'Turn a screen recording into a scheduled Playwright automation',
  'outro': 'Record it once, and let Devin run it every morning',
  'voOutro': 'Record it once, and let Devin run it every morning.',
  'speed': 3, 'cps': 48, 'maxZoom': 1.6, 'pollRunMax': 1,
  'noZoom': [[P(11), P(214)]], 'edit': E}
open('spec.js', 'w').write('window.SPEC = ' + json.dumps(spec, indent=2) + ';\n')
print(len(order), 'kept of', len(b))
