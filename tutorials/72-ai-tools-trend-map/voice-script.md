# AI Tools Trend Map: voice script

- Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`), one-request full-script take via `_kit/tools/vo.py`, saved default voice settings.
- Real run: Devin session in the thequantexplorer org, demo PR [thequantexplorer/product-demo-apps#76](https://github.com/thequantexplorer/product-demo-apps/pull/76), app at https://dabit3--ai-tools-trend-map-web.us-east.modal.run
- `0000m.png` is a diagram scene (`scene: 'modal'` in `scenes.js`): why Modal, and the Modal pieces the app uses.
- Pronunciation (`voSay`): "xAI" is spoken "ex A I", ".map()" is spoken "dot map", and "modal.run" is spoken "modal dot run".

| Beat | Caption | Narration |
|---|---|---|
| 0000.png | Goal: a trend map of AI coding tools, usage vs hype | Founders, investors and developers all want to know which AI coding tools people actually use, and which ones they only talk about. By the end of this video, we'll have a public page on Modal that answers that with real posts from X. |
| 0000m.png | Why Modal: schedule, parallel searches, storage, a public URL | So why Modal? A laptop script can't keep running on a timer, and it has no public URL. A server you manage would sit idle and cost money between runs. On Modal, a scheduled function does the daily pull, and .map() runs the xAI searches in parallel across containers. A Modal Dict stores the results, and a web endpoint serves the page at a modal.run URL. The xAI key lives in a Modal Secret. The app scales to zero when it's idle, and you pay by the second. |
| 0001.png | One plain-language prompt | I pick the product demo apps repo and give Devin one plain-language prompt. It asks for ten tools over the last four weeks, with each post labeled as a usage report or hype. Grok does the searching through the xAI API, and the app runs on Modal. |
| 0078.png | Deployed with modal deploy | Devin writes the app and deploys it with modal deploy. |
| 0082.png | Schedule off for now: the workspace was at its limit | The first deploy hit the workspace's limit of five scheduled functions. So Devin deployed with the daily schedule switched off, and kept the schedule in the code for later. |
| 0150.png | Devin's plan, task by task | Its task list shows the plan. It stored the xAI key as a Modal Secret, then wrote the app and its tests before the deploy. |
| 0171.png | Pull request #76 | Then it opens a pull request. |
| 0318.png | Browser test passed on the public URL | Devin also tests the page in a browser at its public URL. All ten tools, both charts and the mobile layout pass. |
| 0324.png | First version: purple hype bars | The hype bars came out purple, which I don't want on this page. |
| 0327.png | Follow-up: neutral grey for hype | So I ask for a neutral grey, and another check of the page. |
| 0346u.png | Grey hype bars, redeployed | Less than a minute later, the bars are grey and the page is redeployed. |
| 0347.png | The app at its modal.run URL | Here's the app running on Modal at its public URL. Every count is posts found in the X search sample, not a total. In this sample, Codex and Cursor are ahead on usage share. |
| outro | Let the data show what's catching on | Let the data show what's catching on. |
