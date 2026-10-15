# Tutorial 65: Hype vs. Reality overview (voice script)

Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, saved/default voice settings). Generated as one full-script take with `python3 _kit/tools/vo.py 65-hype-vs-reality-overview T8iHhGIWPm2GVYpQD1Am` and cut locally at sentence boundaries. Pronunciation overrides (`voSay`): "xAI" → "ex A I".

Real run shown in the proof shots (reused from tutorial 64, see `shots/SOURCES.json`): https://app.devin.ai/sessions/c8075a40bc5444cfa92fb5004964efe2 (thequantexplorer org). Pull request: https://github.com/thequantexplorer/product-demo-apps/pull/74. Deployed app: https://dabit3--hype-vs-reality.us-east.modal.run.

Numbers come from the real run: 6 predictions found from 4 public accounts, 1 marked right with a cited source, 5 pending. X search returns a sample of posts, so these are counts of posts found, not totals. The extension ideas are suggestions, not features of the demo app.

| Beat | Caption | Narration |
|---|---|---|
| 0000.png (intro) | Find predictions on X, then check them later | Tech predictions on X are easy to post and rarely checked later. This app keeps the exact quote and a link to each post, then checks back when each one comes due. |
| 0001.png (pipeline) | X posts, xAI search, Modal functions, storage, page | It runs as one Modal app. Grok, through the xAI API, searches X for recent posts from a few public accounts. Modal extracts them in parallel with map, and stores the results in a Modal Dict. A daily Cron job re-checks the pending ones, and a web endpoint serves the leaderboard. |
| 0002.png (rules) | Pending until a check date, verdicts only with sources | To stay factual, every quote is checked against the original post. Each prediction stays pending until its check date, and it's only marked right or wrong when a cited source backs it up. |
| 0003.png | Devin built it from one plain-language prompt | Devin built the whole thing from one plain-language prompt in the product demo apps repo. |
| 0004.png | Deployed with modal deploy | It shipped the app with modal deploy, then tested the deployed page. |
| 0005.png | A pull request, with review findings fixed | It opened a pull request, and fixed the five issues Devin Review flagged. |
| 0006.png | Counts of posts found so far | On the deployed page, it has found six predictions so far, with one marked right and five still pending. |
| 0007.png | Each pending prediction shows its check date | Each pending one shows the date it can be checked. |
| 0008.png (extend) | More accounts, alerts, account pages, dashboards | To extend it, you could track more accounts and topics, or send an alert when a check date arrives. You could also add a page for each account, or feed the JSON into your own dashboard. |
| outro | Bold predictions, checked later, with a source for every verdict | Bold predictions, checked later, with a source for every verdict. |
