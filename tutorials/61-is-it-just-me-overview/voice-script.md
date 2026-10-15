# Tutorial 61: Is it just me? How it works and what you can do (voice script)

Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, saved default voice settings). Generated as one full-script take with `python3 _kit/tools/vo.py 61-is-it-just-me-overview T8iHhGIWPm2GVYpQD1Am` and cut locally.

Diagram scenes (`idea`, `pipeline`, `fanout`, `whymodal`, `honest`, `extend`) are drawn by `scenes.js` on the dark palette. Every UI shot is a genuine frame reused from the 60-is-it-just-me capture of the same real run (see `shots/SOURCES.json`): the Devin session in the thequantexplorer org, PR https://github.com/thequantexplorer/product-demo-apps/pull/70, and the app https://dabit3--is-it-just-me-web.us-east.modal.run.

Numbers come from the real run: ChatGPT had 6 posts found in the last 6 hours; one AWS post in the last day named the Middle East. Counts are posts found by xAI X search, a sample of posts, not platform-wide totals.

| Beat | Caption | Narration |
|---|---|---|
| 0000.png | Is it just me, or is it down for everyone? | Is it just me, or is Slack not working for everyone? This app answers that from real posts on X. |
| 0001.png | Grok searches X, Modal runs everything else | Here's how it works. Grok searches X through the xAI API. Modal runs everything else, from a scheduled job to the page at its public URL. |
| 0002.png | Every minute, one scan per service, in parallel | Every minute, a Modal Cron job wakes up and fans out with starmap, one scan per service, in parallel. The counts land in a Modal Dict, so they persist between runs. |
| 0003.png | No laptop to keep awake, no server to run | Why Modal? A script on your laptop stops when your laptop sleeps. Your own server runs all day for a job that takes seconds. On Modal, it wakes up on schedule, scales to zero in between, and you only pay for the seconds it runs. The xAI key stays in a Modal Secret. |
| 0004.png | One plain-language prompt in Devin | In the real run, Devin built it from one plain-language prompt. |
| 0005.png | Devin's plan, after one real search call | It checked the setup, made one real search call, and shared its plan. |
| 0006.png | modal deploy puts it on Modal | Then it wrote the app, and deployed it with modal deploy. |
| 0007.png | All 12 unit tests pass | It tested the deployed page, and all twelve unit tests passed. |
| 0008.png | Its pull request, ready to merge | And it opened a pull request that's ready to merge. |
| 0009.png | Only what the posts actually say | The app is honest by design. A region or error only shows up if a post actually says it. The counts are posts found, a sample of X, not every report. |
| 0010.png | ChatGPT: six posts found in six hours | On the page running on Modal, ChatGPT had six posts found in the last six hours. |
| 0011.png | AWS: one post names the Middle East | For AWS, one post named the Middle East, quoted straight from X. |
| 0012.png | Ways to extend it | From here, you can extend it. Watch the services your team depends on. Alert a Slack channel when posts spike. Or compare it against the official status page, and keep weeks of history. |
| outro | Is it just me? Now you know. | Is it just me? Now you know. |

## Pronunciation overrides (`voSay`)

- 0001.png: "Here's how it works. Grok searches X through the ex A I API. Modal runs everything else, from a scheduled job to the page at its public URL."
- 0002.png: "Every minute, a Modal Cron job wakes up and fans out with star map, one scan per service, in parallel. The counts land in a Modal Dict, so they persist between runs."
- 0003.png: "Why Modal? A script on your laptop stops when your laptop sleeps. Your own server runs all day for a job that takes seconds. On Modal, it wakes up on schedule, scales to zero in between, and you only pay for the seconds it runs. The ex A I key stays in a Modal Secret."
