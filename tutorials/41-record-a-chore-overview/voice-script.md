# Overview 41: Record a chore once (voice script)

Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, model `eleven_v4`, the voice's saved default settings). Generated as one take whose request sends only `text` and `model_id` (no seed, no voice_settings): `VO_MODEL=eleven_v4 VO_NAME=nader VO_SEED=none python3 40-record-a-chore/vo_v4.py 41-record-a-chore-overview T8iHhGIWPm2GVYpQD1Am` (a folder-local wrapper around `_kit/tools/vo_onetake.py`), cut locally at sentence boundaries; the STT check passed on every line.

Diagram scenes are drawn by `scenes.js`; every UI proof is a real frame from tutorial 40 (mapped in `shots/SOURCES.json`). The Refund Desk demo app and its seeded data were built for the demo, and the tutorial author recorded the chore video.

| Beat | Scene | Caption | Narration |
|---|---|---|---|
| 0000.png | value | Record it once, and Devin runs it on a schedule | Record a repetitive web chore once, and Devin turns it into a Playwright script that runs on a schedule without you. |
| 0001.png | flow1 | 1. Record the chore once | First, you screen-record yourself doing the chore one time. |
| 0002.png | proof | We recorded this ourselves, on seeded demo data | For this demo, we recorded ourselves approving small damaged-item refunds, in a refund app we built with seeded data. |
| 0003.png | flow2 | 2. Attach it to a Devin session | Then you attach the video to a Devin session, with the goal in plain words. |
| 0004.png | proof | The video, attached to the prompt | The recording goes in like any other attachment. |
| 0005.png | flow3 | 3. Devin extracts the workflow | Devin pulls frames from the video and works out the steps, and the rule behind them. |
| 0006.png | proof | It inferred the rule from the frames | Here, it noticed that only damaged items of fifty dollars or less were approved. |
| 0007.png | flow4 | 4. It writes Playwright and runs it | Next, it writes a Playwright script and runs it in its own browser to prove it matches. |
| 0008.png | proof | The script running in Devin's browser | In the Computer tab, you can watch the script click through the app. |
| 0010.png | proof | The script, in a pull request | The script lands in a pull request. |
| 0009.png | flow5 | 5. Devin schedules future runs | Finally, Devin sets up an Automation with a schedule trigger, so the chore runs without you. |
| 0012.png | proof | A schedule trigger in Automations | This one runs every weekday morning. |
| 0013.png | proof | Each run reports its result | Each run reports back, here with the same six approvals and the exported file. |
| 0011.png | uses | Approvals, exports, data entry, smoke checks | It works for approval queues, morning exports, data entry from a spreadsheet, and smoke checks of a key flow. |
| outro | | Record it once. Devin does it from then on | Record it once, and let Devin do it from then on. |
