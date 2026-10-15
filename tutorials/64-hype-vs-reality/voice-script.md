# Tutorial 64: Hype vs. Reality, step by step (voice script)

Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, saved/default voice settings). Generated as one full-script take with `python3 _kit/tools/vo.py 64-hype-vs-reality T8iHhGIWPm2GVYpQD1Am` and cut locally at sentence boundaries. Pronunciation overrides (`voSay`): "xAI" → "ex A I", "live" → "lyve", "extract.map" → "extract dot map", "modal.run" → "modal dot run".

Real run: https://app.devin.ai/sessions/c8075a40bc5444cfa92fb5004964efe2 (thequantexplorer org, repo thequantexplorer/product-demo-apps, folder `hype-vs-reality/`). Pull request: https://github.com/thequantexplorer/product-demo-apps/pull/74. Deployed app: https://dabit3--hype-vs-reality.us-east.modal.run (JSON at `/api/predictions`).

All numbers come from the real run: 6 predictions found from 4 public accounts (@sama, @elonmusk, @levie, @VitalikButerin), 1 marked right with a cited source, 5 pending with check dates in 2027–2028. X search returns a sample of posts, so these are counts of posts found, not totals.

## Prompt typed on screen

> @thequantexplorer/product-demo-apps in a new hype-vs-reality folder, build a Modal app that tracks tech predictions people post on X. Use the xAI API with X search to find recent prediction posts from a few well-known tech accounts, and extract them in parallel: the exact quote, a link to the post, and when it can be checked. Re-check the pending ones on a daily schedule, and only mark one right or wrong with a cited source. Serve a dark leaderboard page from a web endpoint, deploy it with modal deploy, test it, and open a PR.

## Narration

| Beat | Caption | Narration |
|---|---|---|
| 0000a.png (live app preview) | Track tech predictions from X, then check them later | Tech predictions get posted on X all the time, but almost nobody checks back later. Here, Devin builds a tracker that keeps the exact quote and a link, and re-checks each prediction when it comes due. It ends deployed on Modal, with a live page of real posts pulled from X through the xAI API. |
| 0088.png | A plain-language prompt in the product-demo-apps repo | In plain language, I ask for a Modal app that uses the xAI API with X search to find prediction posts, extracts them in parallel, and re-checks the pending ones every day. |
| 0089.png | Only cited sources can settle a prediction | A prediction can only be marked right or wrong with a cited source, and the job ends with a deploy, a test and a pull request. |
| 0092.png | Devin probes X search first | Devin starts by probing the xAI API, to see exactly how X search returns posts and citations. |
| 0120.png | Tracker logic, dark page and Modal app | Then it writes the tracker logic, the dark leaderboard page and the Modal app around them. |
| 0133.png | modal deploy ships it | Once the tests pass, it ships the app with modal deploy. |
| 0134.png | A real search on the deployed app | Then it calls the deployed endpoint and runs a real search for predictions. |
| 0209.png | Devin opens a pull request | With real data on the page, Devin pushes a branch and opens a pull request. |
| 0225.png | Devin tests the deployed page in its browser | It also tests the deployed page in its own browser, and checks that the counts match the JSON. |
| 0314.png | Devin sums up the run | When Devin is done, it sums up the run. |
| 0315.png | Six predictions found so far | So far, it has found six predictions from four well-known accounts. |
| 0316.png | One resolved with a source, five pending | One is marked right with a cited source, and the other five stay pending until their check dates. |
| 0321.png | Five review findings, all resolved | Devin Review flagged five issues while it worked, and Devin fixed every one and redeployed. |
| 0322.png | The xAI Responses API | In the code, the tracker calls the xAI Responses API. |
| 0323.png | X search, one account and a date range | Each search uses the X search tool, limited to one account and a date range. |
| 0324.png | Stored in a Modal Dict | Predictions are stored in a Modal Dict, keyed by the post's ID. |
| 0325.png | starmap: one container per account | Discovery fans out with starmap, one container per account. |
| 0326.png | map: every new post in parallel | Then extract.map processes every new post in parallel. |
| 0327.png | A daily Cron re-checks pending predictions | A Modal Cron schedule re-checks the pending predictions every day. |
| 0328.png | The web endpoint serves the page | And a web endpoint serves the leaderboard page. |
| 0329.png | The deployed app on modal.run | Here's the deployed app at its modal.run URL, with real posts pulled from X. |
| 0330.png | Counts of posts found, not totals | These are counts of posts found so far, not totals for everything on X. |
| 0331.png | Verdict date and cited source | The one marked right shows when it happened and the source it was checked against, so you can open it and judge for yourself. |
| 0332.png | Pending until its check date | Everything else stays pending, with the date it can be checked. |
| 0335.png | Exact quotes, linked to the original posts | Each card keeps the exact quote and a link to the original post. |
| outro | Predictions from X, checked on a schedule, every verdict cited | Predictions from X, checked on a schedule, with every verdict cited. |
