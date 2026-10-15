# AI Tools Trend Map (overview): voice script

- Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`), one-request full-script take via `_kit/tools/vo.py`, saved default voice settings.
- Real run: Devin session in the thequantexplorer org, demo PR [thequantexplorer/product-demo-apps#76](https://github.com/thequantexplorer/product-demo-apps/pull/76), app at https://dabit3--ai-tools-trend-map-web.us-east.modal.run
- Proof shots are reused from `72-ai-tools-trend-map` (see `shots/SOURCES.json`).
- Pronunciation (`voSay`): "xAI" is spoken "ex A I", ".map()" is spoken "dot map", and "modal.run" is spoken "modal dot run".

| Beat | Scene | Caption | Narration |
|---|---|---|---|
| 0010.png | intro | Which AI coding tools are people actually using? | Which AI coding tools are people actually using, and which ones are they only talking about? This app answers that with real posts from X, so founders, investors and developers can see what's catching on. |
| 0020.png | pipeline | X posts, the xAI API, Modal, storage, a public page | Here's how it works. Grok searches posts on X through the xAI API. Modal runs those searches and keeps the results in a Modal Dict. A web endpoint on the same app serves the page. |
| 0025.png | modal | Why Modal: schedule, parallel searches, storage, a public URL | So why Modal? A laptop script can't keep running on a timer, and it has no public URL. A server you manage would sit idle and cost money between refreshes. On Modal, a scheduled function does the daily pull, and .map() runs the searches in parallel across containers. A Modal Dict keeps the results, and a web endpoint serves the page at a modal.run URL. The xAI key lives in a Modal Secret. The app scales to zero when nobody is using it, and you only pay for the seconds it runs. |
| 0030.png | fanout | 40 searches in parallel with .map() | That's ten tools across four weeks, so each refresh runs forty searches in parallel with .map(). Every search has its own date range. |
| 0040.png | classify | Usage report or hype: counts are a sample, not totals | Each post that Grok finds gets a label, real usage report or hype. The counts are posts found in the X search sample, not totals. |
| 0041.png |  | The real run: one plain-language prompt | In the real run, Devin built the whole app from this one prompt. |
| 0051.png |  | Deployed with modal deploy | It deployed the app to Modal with modal deploy. |
| 0052.png |  | Schedule off for this run: the workspace was at its limit | The daily schedule is in the code, but this run deployed with it switched off, because the workspace had hit its limit of scheduled functions. |
| 0061.png |  | Public URL checked, pull request #76 | Devin checked the public URL again after a small color fix, and the code is in a pull request. |
| 0071.png |  | The app on Modal, with real data from X | Here's the page running on Modal with real data. In this sample, Codex and Cursor have the highest share of usage reports. |
| 0080.png | extend | Ways to extend it | To take it further, add a weekly digest, or alerts when a new tool starts to emerge. You could also track more categories, or add a second source to check the X sample against. |
| outro | | | Let the data show what's catching on. |
