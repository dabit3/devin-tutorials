# Tutorial 40: Record a chore once (voice script)

Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, default settings). Model `eleven_multilingual_v2`. Generated as one take (`VO_NAME=nader python3 _kit/tools/vo.py 40-record-a-chore T8iHhGIWPm2GVYpQD1Am`) and cut locally at sentence boundaries; the STT check passed on every line.

Real run: https://app.devin.ai/sessions/a38ddebe2f1d4454a83d485e70c76dec (thequantexplorer org, repo thequantexplorer/product-demo-apps, folder `refund-desk`). The Refund Desk app and its seeded data were built for this demo and reset on every reload; the tutorial author recorded the chore video. Devin opened PR #60 in product-demo-apps and created the automation "Refund Desk morning chore (weekdays 9:00 UTC)"; its test run (https://app.devin.ai/sessions/d3cfa44ab39e402bb30de7f9b3b28d34) reported SUCCESS with the same six approvals ($187.24) and the CSV attached. The headed run in the Computer tab is a rerun we asked for in the same session, because Devin's first browser run finished before we opened the tab.

| Beat | Caption | Narration |
|---|---|---|
| scene-builds.png | One screen recording in, a working automation out | In this video, Devin builds a working automation from nothing but a screen recording, with no written steps and no code from us. It watches the video, works out what we did and why, then writes a Playwright script, tests it in its own browser, opens a pull request, and puts it on a weekday schedule. |
| rec1.png | We recorded this chore ourselves, on seeded demo data | Here's the chore. Every morning, someone opens this refund dashboard and does the same few clicks, so we recorded it once ourselves, in a demo app we built with seeded data that resets on every reload. |
| rec3.png | Filter to Pending |  |
| rec4.png | Approve damaged-item refunds of $50 or less | Filter to pending, and approve every damaged item refund of fifty dollars or less. |
| rec5.png | Export the approved CSV |  |
| rec6.png | Check it in Exports | Then export the approved CSV and check it in Exports. |
| 0000.png | Start a new Devin session | In Devin, start a new session and attach the recording, which is the only description of the chore that Devin gets. |
| 0002.png | The recording is the only spec |  |
| 0009.png | Give the goal, not the steps | The prompt gives the goal, not the steps: watch the video, write a Playwright script that does the same thing, prove it in its browser, and schedule it for every weekday at nine UTC. |
| 0025.png | Nobody told it the rule: Devin infers it from the frames | Nobody told it the rule, so Devin pulls frames out of the video and works it out from the clicks: damaged items of fifty dollars or less get approved, and the bigger ones stay pending. |
| 0026.png | It writes the script from what it saw | From what it saw, it writes the script, runs it headless, and checks that it approves the same six refunds as the recording. |
| 0217.png | We asked for a headed rerun to watch | Devin had already run it in its own Chrome before we opened the Computer tab, so we asked for one more run, slowed down, to watch. |
| 0225.png | The script drives Refund Desk in Devin's browser | In the Computer tab, the script drives Refund Desk on its own: the pending filter, six approvals, the export, and the Exports page. |
| 0277.png | Devin opened a PR with the script | Devin also opened a pull request with the script, so a chore we only ever showed it on video now lives in the repo as code. |
| 0278.png | refund-chore.js, written from the recording |  |
| 0186.png | Devin asks how the automation should run | For the schedule, Devin asks two setup questions: who the runs act as, and when to email. We picked the organization and every run. |
| 0191.png | Approve the automation Devin drafted | Then it drafts the automation, with a weekday nine o'clock schedule and a tight network policy, and we approve it. |
| 0194.png | Devin offers a test run | Devin offers a test run right away, and we approve that too, so we can watch one real run. |
| 0208.png | It's in the Automations list | The automation now sits in the Automations list, active, and running as the organization. |
| 0211.png | Runs weekdays at 9:00 as the organization |  |
| 0212.png | A schedule trigger, not a CI cron | Its trigger runs on weekdays at nine in the morning, and the events list shows the test run we just started. |
| 0213.png | One real run, triggered on camera |  |
| 0207.png | SUCCESS: the same six refunds, CSV attached | About a minute later, the run reports success, with the same six approvals, and the CSV and a screenshot attached. From now on, it runs every weekday at nine, without us, and all we ever gave it was one recording and a goal. |
| outro | One recording in, an automation Devin builds and runs | That's how you turn one screen recording into an automation Devin builds and runs for you. |
