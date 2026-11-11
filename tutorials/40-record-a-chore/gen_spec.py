# one-off: builds spec.js and reorders shots/beats.json into story order
import json
b = json.load(open('shots/beats.json'))
by = {x['img']: x for x in b}
P = lambda i: '%04d.png' % i
E = {}
order = []
def k(img, **kw):
    order.append(img); E[img] = kw
k('scene-builds.png', scene='builds', hold=6, voHold=9.0, cursor=False, capPos='bottom',
  cap='One screen recording in, a working automation out',
  vo='In this video, Devin watches a screen recording of a chore. It works out the steps, writes a Playwright script, and tests it. Then it opens a pull request and puts the script on a schedule.')
k('rec1.png', hold=5, cap='We recorded this chore ourselves, on seeded demo data',
  vo='Here is the chore. Each morning, someone opens this refund dashboard and does the same clicks. We built this demo app and filled it with sample data. We recorded the chore ourselves.')
k('rec2.png', hold=1.6)
k('rec3.png', hold=2.2, cap='Filter to Pending')
k('rec4.png', hold=3, cap='Approve damaged-item refunds of $50 or less',
  vo='First, filter to pending. Then approve each damaged item refund of fifty dollars or less.')
k('rec5.png', hold=1.4, cap='Export the approved CSV')
k('rec6.png', hold=2.0, cap='Check it in Exports', vo='Last, export the approved CSV and check it on the Exports page.')
k(P(0), hold=1.4, cap='Start a new Devin session',
  vo='In Devin, start a new session and attach the recording. The recording is the only description of the chore that Devin gets.')
k(P(1)); k(P(2), cap='The recording is the only spec')
k(P(9), hold=3, cap='Give the goal, not the steps',
  vo='The prompt gives the goal, not the steps. Devin must write a Playwright script that does the same thing. It must test the script in its browser and schedule it for weekdays at nine UTC.')
k(P(11)); k(P(13), hold=1.4)
k(P(25), hold=4.5, cap='Nobody told it the rule: Devin infers it from the frames',
  vo='Nobody told Devin the rule. It pulls frames out of the video and works out the rule from the clicks. Damaged items of fifty dollars or less get approved. The larger ones stay pending.')
for i in (26, 30, 36, 40, 44):
    k(P(i), hold=1.1, badge='Sped up')
E[P(26)].update(cap='It writes the script from what it saw',
  vo='Devin writes the script from what it saw. It runs the script in the background and checks the result. The script approves the same six refunds as the recording.')
k(P(217), hold=3, cap='We asked for a headed rerun to watch',
  vo='Devin ran the script in its own Chrome before we opened the Computer tab. We asked it for one more slow run, so we could watch.')
k(P(219))
for i in range(223, 239, 2):
    if P(i) in by: k(P(i), hold=1.0, cursor=False)
E[P(225)].update(cap="The script drives Refund Desk in Devin's browser",
  vo='In the Computer tab, the script works through Refund Desk by itself. It sets the pending filter, makes six approvals, exports the file, and opens the Exports page.')
k(P(277), hold=3, cap='Devin opened a PR with the script',
  vo='Devin also opened a pull request with the script. We only showed Devin the chore on video, and now it is code in the repo.')
k(P(278), hold=2.2, cap='refund-chore.js, written from the recording')
k(P(186), hold=2.6, cap='Devin asks how the automation should run',
  vo='For the schedule, Devin asks two setup questions. It asks who the runs act as, and when to send email. We picked the organization, and an email after every run.')
k(P(188)); k(P(190))
k(P(191), hold=2.6, cap='Approve the automation Devin drafted',
  vo='Then Devin drafts the automation. It runs weekdays at nine in the morning, with a strict network policy. We approve it.')
k(P(192)); k(P(193))
k(P(194), hold=2.4, cap='Devin offers a test run', vo='Devin offers to start a test run now. We approve that too, so we can watch one run.')
k(P(196), hold=0.8); k(P(197), hold=1.0); k(P(198), hold=0.8); k(P(199), hold=1.0)
k(P(208), hold=2.6, cap="It's in the Automations list", vo='The automation is now in the Automations list. It is active and runs as the organization.')
k(P(209), hold=0.8); k(P(210), hold=0.8)
k(P(211), hold=1.0, cap='Runs weekdays at 9:00 as the organization')
k(P(212), hold=2.6, cap='A schedule trigger, not a CI cron',
  vo='Its trigger runs on weekdays at nine in the morning. The events list shows the test run we just started.')
k(P(213), hold=1.6, cap='One real run, triggered on camera')
k(P(214))
k(P(207), hold=5, cap='SUCCESS: the same six refunds, CSV attached',
  vo='About a minute later, the run reports success. It made the same six approvals. It attached the CSV file and a screenshot. From now on, the script runs every weekday at nine without us.')
for x in b:
    if x['img'] not in E: E[x['img']] = {'skip': True}
nb = [by[i] for i in order] + [x for x in b if x['img'] not in order]
json.dump(nb, open('shots/beats.json', 'w'), indent=1)
spec = {
  'title': 'From recording to automation', 'subtitle': 'Devin builds a scheduled Playwright automation from one screen recording',
  'outro': 'One recording in, an automation Devin builds and runs',
  'voOutro': "That's how you turn one screen recording of a chore into a scheduled automation with Devin.",
  'speed': 3, 'cps': 48, 'maxZoom': 1.6, 'pollRunMax': 1,
  'noZoom': [[P(11), P(214)]], 'edit': E}
open('spec.js', 'w').write('window.SPEC = ' + json.dumps(spec, indent=2) + ';\n')
print(len(order), 'kept of', len(b))
