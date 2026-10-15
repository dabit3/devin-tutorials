# AI Tools Trend Map: voice script

- Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`), one-request full-script take via `_kit/tools/vo_onetake.py`, saved default voice settings.
- Real run: Devin session in the thequantexplorer org, demo PR [thequantexplorer/product-demo-apps#76](https://github.com/thequantexplorer/product-demo-apps/pull/76), live app https://dabit3--ai-tools-trend-map-web.us-east.modal.run
- Pronunciation: "xAI" is spoken "ex A I"; the adjective "live" is spoken "lyve" (`voSay`).

| Beat | Caption | Narration |
|---|---|---|
| 0000.png | Goal: a live trend map of AI coding tools, usage vs hype | Founders, investors and developers all want to know which AI coding tools people actually use, and which ones they only talk about. By the end of this video, we'll have a live page on Modal that answers that with real posts from X. |
| 0001.png | One plain-language prompt | I pick the product demo apps repo and give Devin one plain-language prompt. It asks for ten tools over the last four weeks, searched with Grok through the xAI API, with each post labeled as a usage report or hype. It also asks for a daily schedule on Modal, one parallel search per tool and week, and a dark page that labels every count as a sample. |
| 0004.png | Devin checks the repo and sets up Modal | Devin starts by looking at how this repo already uses Modal, and sets up the tools it needs. |
| 0078.png | modal deploy, then lint and tests | After writing the app, Devin deploys it with modal deploy, then runs the linter and the tests. |
| 0082.png | Schedule off for now: the workspace was at its limit | The first deploy hit the workspace's limit of five scheduled functions. So Devin deployed with the daily schedule switched off, and kept the schedule in the code for later. |
| 0086.png | One manual refresh: 40 searches in parallel | Next, it starts a manual refresh, which runs one search per tool and week, forty in all, in parallel. |
| 0119.png | Testing the live URL and /api/data | Once the data is in, Devin tests the live URL, checking the page and the data endpoint. |
| 0170.png | Branch pushed, pull request next | Then it pushes the branch and opens a pull request. |
| 0191.png | Browser checks and review fixes | Before finishing, Devin runs browser checks on the live page and fixes the issues its code review found. |
| 0324.png | First version: purple hype bars | The hype bars came out purple, which I don't want on this page. |
| 0327.png | Follow-up: neutral grey for hype | So I ask for a neutral grey, and another check of the live URL. |
| 0346u.png | Grey hype bars, redeployed | Less than a minute later, the bars are grey and the page is redeployed. |
| 0347.png | The live app at its modal.run URL | Here's the live app on Modal. Every count is posts found in the X search sample, not a total. In this sample, Codex and Cursor are ahead on usage share. |
| outro | Let the data show what's catching on | Let the data show what's catching on. |
