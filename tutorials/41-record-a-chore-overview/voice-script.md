# Overview 41: Record a chore once (voice script)

Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, default settings). Model `eleven_multilingual_v2`. Generated as one take (`VO_NAME=nader python3 _kit/tools/vo.py 41-record-a-chore-overview T8iHhGIWPm2GVYpQD1Am`) and cut locally at sentence boundaries; the STT check passed on every line.

Diagram scenes are drawn by `scenes.js`; every UI proof is a real frame from tutorial 40 (mapped in `shots/SOURCES.json`). The Refund Desk demo app and its seeded data were built for the demo, and the tutorial author recorded the chore video.

Plain-English rewrite. The narrated cut (`41-record-a-chore-overview-nader.mp4`) has no captions; its audio is this narration over Nader's track `2-upbeat.mp3`, ducked under the voice, with no kit music bed and no UI sounds (mixed by `40-record-a-chore/mix_music.py`).

| Beat | Scene | Caption | Narration |
|---|---|---|---|
| 0000.png | value | One recording in, a working automation out | In this video, Devin turns a screen recording of a chore into a scheduled automation. |
| 0014.png | builds | You give it a video. Devin builds the rest | You do not write the steps or any code. Devin works out the steps, writes a Playwright script, and tests it. It opens a pull request and puts the script on a schedule. |
| 0001.png | flow1 | 1. Record the chore once | First, you record your screen while you do the chore one time. |
| 0002.png | proof | We recorded this ourselves, on seeded demo data | For this demo, we built a refund app and filled it with sample data. We recorded ourselves approving small refunds for damaged items. |
| 0003.png | flow2 | 2. Attach it to a Devin session | Then you attach the video to a Devin session and describe the goal in plain words. |
| 0004.png | proof | The video, attached to the prompt | The recording goes in like any other attachment. |
| 0005.png | flow3 | 3. Devin extracts the workflow | Devin pulls frames from the video. It works out the steps and the rule behind them on its own. |
| 0006.png | proof | It inferred the rule from the frames | Here, it saw that only damaged items of fifty dollars or less were approved. |
| 0007.png | flow4 | 4. It turns what it saw into Playwright | Next, Devin writes a Playwright script from what it saw. It runs the script in its own browser to check that it matches. |
| 0008.png | proof | The script running in Devin's browser | In the Computer tab, you can watch the script click through the app. |
| 0010.png | proof | The script, in a pull request | The script goes into a pull request. |
| 0009.png | flow5 | 5. Devin schedules future runs | Finally, Devin sets up an Automation with a schedule trigger. The chore then runs without you. |
| 0012.png | proof | A schedule trigger in Automations | This one runs every weekday morning. |
| 0013.png | proof | Each run reports its result | Each run reports back. This run made the same six approvals and exported the file. |
| 0011.png | uses | Approvals, exports, data entry, smoke checks | You can use this for approval queues, morning exports, and data entry from a spreadsheet. You can also use it to check that an important flow still runs. |
| outro |  | One recording in. Devin builds and runs the rest | That's how you turn one screen recording into a scheduled automation with Devin. |
