# Overview 41: Record a chore once (voice script)

Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, default settings). Model `eleven_multilingual_v2`. Generated as one take (`VO_NAME=nader python3 _kit/tools/vo.py 41-record-a-chore-overview T8iHhGIWPm2GVYpQD1Am`) and cut locally at sentence boundaries; the STT check passed on every line.

Diagram scenes are drawn by `scenes.js`; every UI proof is a real frame from tutorial 40 (mapped in `shots/SOURCES.json`). The Refund Desk demo app and its seeded data were built for the demo, and the tutorial author recorded the chore video.

| Beat | Scene | Caption | Narration |
|---|---|---|---|
| 0000.png | value | One recording in, a working automation out | Show Devin a chore once on video, and it builds the automation for you: it works out the steps, writes a Playwright script, and runs it on a schedule without you. |
| 0014.png | builds | You give it a video. Devin builds the rest | You never write down the steps or any code, the recording is the whole spec, and Devin builds everything else from it. |
| 0001.png | flow1 | 1. Record the chore once | First, you screen-record yourself doing the chore one time. |
| 0002.png | proof | We recorded this ourselves, on seeded demo data | For this demo, we recorded ourselves approving small damaged-item refunds, in a refund app we built with seeded data. |
| 0003.png | flow2 | 2. Attach it to a Devin session | Then you attach the video to a Devin session, with the goal in plain words. |
| 0004.png | proof | The video, attached to the prompt | The recording goes in like any other attachment. |
| 0005.png | flow3 | 3. Devin extracts the workflow | Devin pulls frames from the video and works out the steps, and the rule behind them, with nobody spelling them out. |
| 0006.png | proof | It inferred the rule from the frames | Here, it noticed on its own that only damaged items of fifty dollars or less were approved. |
| 0007.png | flow4 | 4. It turns what it saw into Playwright | Next, it turns what it saw into a Playwright script and runs it in its own browser to prove it matches. |
| 0008.png | proof | The script running in Devin's browser | In the Computer tab, you can watch the script click through the app. |
| 0010.png | proof | The script, in a pull request | The script lands in a pull request. |
| 0009.png | flow5 | 5. Devin schedules future runs | Finally, Devin sets up an Automation with a schedule trigger, so the chore runs without you. |
| 0012.png | proof | A schedule trigger in Automations | This one runs every weekday morning. |
| 0013.png | proof | Each run reports its result | Each run reports back, here with the same six approvals and the exported file. |
| 0011.png | uses | Approvals, exports, data entry, smoke checks | It works for approval queues, morning exports, data entry from a spreadsheet, and smoke checks of a key flow. |
| outro |  | One recording in. Devin builds and runs the rest | That's how one screen recording becomes an automation that Devin builds and runs for you. |
