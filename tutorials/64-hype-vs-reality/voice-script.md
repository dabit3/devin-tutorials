# Tutorial 64: Hype vs. Reality, step by step (voice script)

Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, saved/default voice settings). Generated as one full-script take with `python3 _kit/tools/vo.py 64-hype-vs-reality T8iHhGIWPm2GVYpQD1Am` and cut locally at sentence boundaries. Pronunciation overrides (`voSay`): "xAI" → "ex A I", "modal.run" → "modal dot run".

Real run: https://app.devin.ai/sessions/c8075a40bc5444cfa92fb5004964efe2 (thequantexplorer org, repo thequantexplorer/product-demo-apps, folder `hype-vs-reality/`). Pull request: https://github.com/thequantexplorer/product-demo-apps/pull/74. Deployed app: https://dabit3--hype-vs-reality.us-east.modal.run (JSON at `/api/predictions`).

All numbers come from the real run: 6 predictions found from 4 public accounts (@sama, @elonmusk, @levie, @VitalikButerin), 1 marked right with a cited source, 5 pending with check dates in 2027–2028. X search returns a sample of posts, so these are counts of sampled posts found, not totals. The daily Cron re-check was filmed as deployed, then switched off after filming (web endpoint only) to save cost and free a shared scheduled-function slot; the narration says so.

## Prompt typed on screen

> @thequantexplorer/product-demo-apps in a new hype-vs-reality folder, build a Modal app that tracks tech predictions people post on X. Use the xAI API with X search to find recent prediction posts from a few well-known tech accounts, and extract them in parallel: the exact quote, a link to the post, and when it can be checked. Re-check the pending ones on a daily schedule, and only mark one right or wrong with a cited source. Serve a dark leaderboard page from a web endpoint, deploy it with modal deploy, test it, and open a PR.

## Edit

The Modal explainer (`0000b.png`) is a diagram scene drawn by `scenes.js` (copied from tutorial 65). No code, diffs or routine Devin logs are shown: after the prompt the cut goes to Devin's plan and `modal deploy` (`0133.png`), the browser test (`0304.png`), the PR with Devin Review (`0321.png`), then the deployed app.

## Narration

| Beat | Caption | Narration |
|---|---|---|
| 0000a.png (deployed app preview) | Track tech predictions from X, then check them later | Tech predictions get posted on X all the time, but almost nobody checks back later. Here, Devin builds a tracker that keeps the exact quote and a link, and re-checks each prediction when it comes due. It ends on a public modal.run page. Its posts come from X, through the xAI API. |
| 0000b.png (modal) | Why Modal: no server to run, parallel calls, storage, a public URL | Why Modal? Grok does the searching, through the xAI API. Modal runs everything around it. The job comes in bursts: one big parallel search, then nothing until the next check. A laptop script stops when the lid closes, and a server of your own sits idle all day. On Modal, a schedule runs the re-checks with no server to maintain. Map spreads the xAI calls across many containers at once. A Modal Dict stores the results, and a web endpoint serves the page at a public URL. The xAI key lives in a Modal Secret. When nothing is running, the app scales to zero, so you pay per second of work. |
| 0088.png | A plain-language prompt in the product-demo-apps repo | The prompt is plain language. It asks for a Modal app that finds prediction posts with X search, and extracts them in parallel. A prediction can only be marked right or wrong with a cited source. |
| 0133.png (plan + modal deploy) | Devin's plan, then modal deploy | Devin plans the Modal pieces, writes the app and its tests, then ships it with modal deploy. |
| 0304.png (browser test) | Devin tests the page at its public URL | Then it opens the public URL in its own browser, to test the page. |
| 0321.png (PR + Devin Review) | A pull request, with five review findings fixed | It opens a pull request in the demo repo, and fixes the five issues Devin Review flagged. |
| 0329.png | The app at its public modal.run URL | Here's the app running on Modal at its public URL, with real posts pulled from X. |
| 0330.png | Counts of sampled posts found, not totals | These are counts of sampled posts found so far, not totals for everything on X. |
| 0331.png | Verdict date and cited source | The one marked right shows when it happened, and the source it was checked against. |
| 0332.png | Pending until its check date | Everything else stays pending, with the date it can be checked. |
| 0335.png | Exact quotes, linked to the original posts | Each card keeps the exact quote and a link to the original post. After filming, the daily schedule was switched off to save cost. |
| outro | Predictions from X, checked when they come due, every verdict cited | Predictions from X, checked when they come due, every verdict cited. |
