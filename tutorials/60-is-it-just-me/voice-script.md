# Tutorial 60: Is it just me? An outage detector on Modal and the xAI API, step by step (voice script)

Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, saved default voice settings). Generated as one full-script take with `python3 _kit/tools/vo.py 60-is-it-just-me T8iHhGIWPm2GVYpQD1Am` and cut locally.

Real run: https://app.devin.ai/sessions/703807ab87394f00b38bb6f902a9ca9c (thequantexplorer org, repo thequantexplorer/product-demo-apps, folder `is-it-just-me/`). Demo PR: https://github.com/thequantexplorer/product-demo-apps/pull/70. App: https://dabit3--is-it-just-me-web.us-east.modal.run

The two Modal diagram scenes (`pipeline`: where Modal fits; `whymodal`: why Modal over a laptop script or your own server) are drawn by `scenes.js` on the dark palette. They name only what the app uses: a `modal.Cron` scheduled function, `.starmap()` parallel scans, a `modal.Dict` for the counts, an `@modal.asgi_app()` web endpoint at a public `*.modal.run` URL, and the xAI key in a Modal Secret. No code is walked through on screen. The second prompt below was sent in the real run but isn't shown in the cut.

## Prompts typed on screen

1. `@thequantexplorer/product-demo-apps Build an "Is it just me?" outage detector in a new is-it-just-me/ folder. Type a service like Slack, GitHub, ChatGPT or AWS and see if people on X are saying it's down. On Modal, run a job every minute that uses the xAI API's X search to find and classify new posts, and store the counts. Serve a dark web page with a spike chart, affected regions and the most common error messages. Only show regions and errors the posts actually mention, and label counts as posts found. Deploy it with modal deploy, test the live URL, and open a PR.`
2. `Two changes: use a thin blue accent instead of the purple one, and only allow Slack, GitHub, ChatGPT and AWS so nobody can run up the X search bill. Then redeploy and test the live URL again.`

All numbers in the narration come from the real run: the cost heads-up (one X search call fetched 9 posts for about $0.055), the four Devin Review fixes, the 12 passing unit tests, and the deployed page counts (ChatGPT: 1 post found in 15 minutes, 6 in 6 hours, "model not found" in 3 posts; AWS: 1 post in 24 hours naming the Middle East; GitHub: 0 posts). Counts are posts found by xAI X search, a sample of posts, not platform-wide totals.

| Beat | Caption | Narration |
|---|---|---|
| 0000.png | Is it just me, or is it down for everyone? | When Slack or GitHub stops working, everyone asks the same thing. Is it just me, or is it down for everyone? |
| 0001.png | An app that answers from real posts on X | In this tutorial, Devin builds an app that answers that from real posts on X. It searches X with the xAI API, and it runs on Modal. |
| scene-pipeline.png | Grok finds the posts, Modal runs the rest | Here's where Modal fits. Grok finds the posts through the xAI API, and Modal runs the rest. Every minute, a scheduled job scans each service in parallel. It stores the counts in a Modal Dict, and serves the page at a public URL. |
| scene-why.png | No laptop to keep awake, no server to run | Why Modal? A script on your laptop stops when your laptop sleeps. Your own server runs all day for a job that takes seconds. On Modal, the job wakes up on schedule, scales to zero in between, and you only pay for the seconds it runs. The xAI key stays in a Modal Secret. |
| 0005.png | A Modal job every minute, real posts, stored counts | The prompt asks for exactly that. A Modal job every minute that searches X for outage posts, and stores the counts. |
| 0006.png | Only regions and errors the posts mention | It also asks for a dark page with a spike chart, showing only the regions and errors that posts actually mention. |
| 0019.png | Devin's plan, with a daily budget for paid searches | Devin checks the setup, makes one real search call, and replies with its plan. That call cost about five cents, so it caps the scans with a daily post budget. |
| 0074.png | modal deploy: the app is on Modal | Then Devin writes the app, and deploys it with modal deploy. Modal confirms the deployment in under two seconds. |
| 0202.png | Tested, reviewed, and all 12 unit tests pass | It tests the deployed page, fixes four bugs that Devin Review found, and all twelve unit tests pass. |
| 0369.png | The PR is ready for review | The pull request is open in the session, and it's ready to merge. |
| 0370.png | The app, running on Modal at its public URL | And here's the app, running on Modal at its public URL. GitHub is quiet right now, and the page says no posts were found. |
| 0380.png | 1 post found in 15 minutes, 6 in 6 hours | For ChatGPT, it found one post in the last fifteen minutes and six in the last six hours, so it's probably just you. |
| 0381.png | Posts found, not people affected | The chart counts the posts it found about problems. It doesn't count people. |
| 0382.png | No ChatGPT post names a region | None of these posts names a region, so that panel stays empty. |
| 0383.png | "model not found" appears in 3 posts | The most common error quoted is model not found, in three posts. |
| 0384.png | Every number comes from these real posts | Every number on the page comes from real posts like these, each linked back to X. |
| 0390.png | AWS: one post in 24 hours names a region | For AWS, one post in the last day names the Middle East. |
| 0392.png | Its own words: an AWS outage in the Middle East | That region comes straight from the post's own words, so the page can say exactly where it came from. |
| outro | Real posts in, an honest answer out | Real posts go in, and an honest answer comes out. |

## Pronunciation overrides (`voSay`)

- 0001.png: "In this tutorial, Devin builds an app that answers that from real posts on X. It searches X with the ex A I API, and it runs on Modal."
- scene-pipeline.png: "Here's where Modal fits. Grok finds the posts through the ex A I API, and Modal runs the rest. Every minute, a scheduled job scans each service in parallel. It stores the counts in a Modal Dict, and serves the page at a public URL."
- scene-why.png: "Why Modal? A script on your laptop stops when your laptop sleeps. Your own server runs all day for a job that takes seconds. On Modal, the job wakes up on schedule, scales to zero in between, and you only pay for the seconds it runs. The ex A I key stays in a Modal Secret."
