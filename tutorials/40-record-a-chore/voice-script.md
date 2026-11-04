# Tutorial 40: Record a chore once (voice script)

Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, default settings). Model `eleven_multilingual_v2`. Generated as one take (`VO_NAME=nader python3 _kit/tools/vo.py 40-record-a-chore T8iHhGIWPm2GVYpQD1Am`) and cut locally at sentence boundaries; the STT check passed on every line.

Real run: https://app.devin.ai/sessions/a38ddebe2f1d4454a83d485e70c76dec (thequantexplorer org, repo thequantexplorer/product-demo-apps, folder `refund-desk`). The Refund Desk app and its seeded data were built for this demo and reset on every reload; the tutorial author recorded the chore video. Devin opened PR #60 in product-demo-apps and created the automation "Refund Desk morning chore (weekdays 9:00 UTC)"; its test run (https://app.devin.ai/sessions/d3cfa44ab39e402bb30de7f9b3b28d34) reported SUCCESS with the same six approvals ($187.24) and the CSV attached. The headed run in the Computer tab is a rerun we asked for in the same session, because Devin's first browser run finished before we opened the tab.

Plain-English rewrite. The narrated cut (`40-record-a-chore-nader.mp4`) has no captions; its audio is this narration over Nader's track `2-upbeat.mp3`, ducked under the voice, with no kit music bed and no UI sounds (mixed by `40-record-a-chore/mix_music.py`).

| Beat | Caption | Narration |
|---|---|---|
| scene-builds.png | One screen recording in, a working automation out | In this video, Devin watches a screen recording of a chore. It works out the steps, writes a Playwright script, and tests it. Then it opens a pull request and puts the script on a schedule. |
| rec1.png | We recorded this chore ourselves, on seeded demo data | Here is the chore. Each morning, someone opens this refund dashboard and does the same clicks. We built this demo app and filled it with sample data. We recorded the chore ourselves. |
| rec3.png | Filter to Pending |  |
| rec4.png | Approve damaged-item refunds of $50 or less | First, filter to pending. Then approve each damaged item refund of fifty dollars or less. |
| rec5.png | Export the approved CSV |  |
| rec6.png | Check it in Exports | Last, export the approved CSV and check it on the Exports page. |
| 0000.png | Start a new Devin session | In Devin, start a new session and attach the recording. The recording is the only description of the chore that Devin gets. |
| 0002.png | The recording is the only spec |  |
| 0009.png | Give the goal, not the steps | The prompt gives the goal, not the steps. Devin must write a Playwright script that does the same thing. It must test the script in its browser and schedule it for weekdays at nine UTC. |
| 0025.png | Nobody told it the rule: Devin infers it from the frames | Nobody told Devin the rule. It pulls frames out of the video and works out the rule from the clicks. Damaged items of fifty dollars or less get approved. The larger ones stay pending. |
| 0026.png | It writes the script from what it saw | Devin writes the script from what it saw. It runs the script in the background and checks the result. The script approves the same six refunds as the recording. |
| 0217.png | We asked for a headed rerun to watch | Devin ran the script in its own Chrome before we opened the Computer tab. We asked it for one more slow run, so we could watch. |
| 0225.png | The script drives Refund Desk in Devin's browser | In the Computer tab, the script works through Refund Desk by itself. It sets the pending filter, makes six approvals, exports the file, and opens the Exports page. |
| 0277.png | Devin opened a PR with the script | Devin also opened a pull request with the script. We only showed Devin the chore on video, and now it is code in the repo. |
| 0278.png | refund-chore.js, written from the recording |  |
| 0186.png | Devin asks how the automation should run | For the schedule, Devin asks two setup questions. It asks who the runs act as, and when to send email. We picked the organization, and an email after every run. |
| 0191.png | Approve the automation Devin drafted | Then Devin drafts the automation. It runs weekdays at nine in the morning, with a strict network policy. We approve it. |
| 0194.png | Devin offers a test run | Devin offers to start a test run now. We approve that too, so we can watch one run. |
| 0208.png | It's in the Automations list | The automation is now in the Automations list. It is active and runs as the organization. |
| 0211.png | Runs weekdays at 9:00 as the organization |  |
| 0212.png | A schedule trigger, not a CI cron | Its trigger runs on weekdays at nine in the morning. The events list shows the test run we just started. |
| 0213.png | One real run, triggered on camera |  |
| 0207.png | SUCCESS: the same six refunds, CSV attached | About a minute later, the run reports success. It made the same six approvals. It attached the CSV file and a screenshot. From now on, the script runs every weekday at nine without us. |
| outro | One recording in, an automation Devin builds and runs | That's how you turn one screen recording of a chore into a scheduled automation with Devin. |
