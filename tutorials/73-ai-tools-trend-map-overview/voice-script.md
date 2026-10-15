# AI Tools Trend Map (overview): voice script

- Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`), one-request full-script take via `_kit/tools/vo_onetake.py`, saved default voice settings.
- Real run: Devin session in the thequantexplorer org, demo PR [thequantexplorer/product-demo-apps#76](https://github.com/thequantexplorer/product-demo-apps/pull/76), live app https://dabit3--ai-tools-trend-map-web.us-east.modal.run
- Proof shots are reused from `72-ai-tools-trend-map` (see `shots/SOURCES.json`).
- Pronunciation (`voSay`): "xAI" is spoken "ex A I", the adjective "live" is spoken "lyve", and ".map()" is spoken "dot map".

| Beat | Scene | Caption | Narration |
|---|---|---|---|
| 0010.png | intro | Which AI coding tools are people actually using? | Which AI coding tools are people actually using, and which ones are they only talking about? This app answers that with real posts from X, so founders, investors and developers can see what's catching on. |
| 0020.png | pipeline | X posts, the xAI API, Modal, storage, a live page | Here's how it works. Grok searches posts on X through the xAI API. Modal runs those searches on a daily schedule and keeps the results in a Modal Dict. A web endpoint on the same app serves the live page. |
| 0030.png | fanout | 40 searches in parallel with .map() | That's ten tools across four weeks, so each refresh runs forty searches in parallel with .map(). Every search has its own date range. |
| 0040.png | classify | Usage report or hype: counts are a sample, not totals | Grok labels each post it finds as a real usage report or as hype. The counts are posts found in the X search sample, not totals. |
| 0041.png | proof shot | The real run: one plain-language prompt | In the real run, Devin built the whole app from this one prompt. |
| 0051.png | proof shot | modal deploy, then lint and tests | It deployed the app with modal deploy, then ran the linter and the tests. |
| 0052.png | proof shot | Schedule off for this run: the workspace was at its limit | The daily schedule is in the code, but this run deployed with it switched off, because the workspace had hit its limit of scheduled functions. |
| 0061.png | proof shot | Live URL checked, pull request #76 | Devin checked the live URL again after a small color fix, and the code is in a pull request. |
| 0071.png | proof shot | The live app, with real data from X | Here's the live page with real data. In this sample, Codex and Cursor have the highest share of usage reports. |
| 0080.png | extend | Ways to extend it | To take it further, add a weekly digest, or alerts when a new tool starts to emerge. You could also track more categories, or add a second source to check the X sample against. |
| outro | | Let the data show what's catching on | Let the data show what's catching on. |
