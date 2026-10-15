# Tutorial 61: Is it just me? How it works and what you can do (voice script)

Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, saved default voice settings). Generated as one full-script take with `python3 _kit/tools/vo.py 61-is-it-just-me-overview T8iHhGIWPm2GVYpQD1Am` and cut locally.

Diagram scenes (`idea`, `pipeline`, `fanout`, `honest`, `extend`) are drawn by `scenes.js` on the dark palette. Every UI shot is a genuine frame reused from the 60-is-it-just-me capture of the same real run (see `shots/SOURCES.json`): the Devin session in the thequantexplorer org, PR https://github.com/thequantexplorer/product-demo-apps/pull/70, and the live app https://dabit3--is-it-just-me-web.us-east.modal.run.

Numbers come from the real run: ChatGPT had 6 posts found in the last 6 hours; one AWS post in the last day named the Middle East. Counts are posts found by xAI X search, a sample of posts, not platform-wide totals.

| Beat | Caption | Narration |
|---|---|---|
| 0000.png | Is it just me, or is it down for everyone? | Is it just me, or is Slack down for everyone? This app answers that from real posts on X. |
| 0001.png | Grok searches X, Modal runs the rest | Here's how it works. Grok searches X through the xAI API, and Modal runs everything else. |
| 0002.png | Every minute, one scan per service, in parallel | Every minute, a Modal Cron job fans out with starmap, one scan per service, in parallel. The counts are stored in a Modal Dict. |
| 0003.png | One plain-language prompt in Devin | In the real run, Devin built it from one plain-language prompt. |
| 0004.png | Devin writes the detector and the Modal app | It planned the work, then wrote the detection logic and the Modal app. |
| 0005.png | modal.Cron("* * * * *") from its pull request | This is the Cron schedule, straight from its pull request. |
| 0006.png | modal deploy puts it on Modal | Then Devin deployed it with modal deploy. |
| 0007.png | Its pull request, ready to merge | It tested the app, and opened a pull request that's ready to merge. |
| 0008.png | Only what the posts actually say | The app is honest by design. A region or error only shows up if a post actually says it. The counts are posts found, a sample of X, not every report. |
| 0009.png | ChatGPT: six posts found in six hours | On the deployed page, ChatGPT had six posts found in the last six hours. |
| 0010.png | AWS: one post names the Middle East | For AWS, one post named the Middle East, quoted straight from X. |
| 0011.png | Ways to extend it | From here, you can extend it. Watch the services your team depends on. Alert a Slack channel when posts spike. Or compare it against the official status page, and keep weeks of history. |
| outro | Is it just me? Now you know. | Is it just me? Now you know. |

## Pronunciation overrides (`voSay`)

- 0001.png: "Here's how it works. Grok searches X through the ex A I API, and Modal runs everything else."
- 0002.png: "Every minute, a Modal Cron job fans out with star map, one scan per service, in parallel. The counts are stored in a Modal Dict."
