# Tutorial 65: Hype vs. Reality overview (voice script)

Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, saved/default voice settings). Generated as one full-script take with `python3 _kit/tools/vo.py 65-hype-vs-reality-overview T8iHhGIWPm2GVYpQD1Am` and cut locally at sentence boundaries. Pronunciation overrides (`voSay`): "xAI" → "ex A I".

Real run shown in the proof shots (reused from tutorial 64, see `shots/SOURCES.json`): https://app.devin.ai/sessions/c8075a40bc5444cfa92fb5004964efe2 (thequantexplorer org). Pull request: https://github.com/thequantexplorer/product-demo-apps/pull/74. Deployed app: https://dabit3--hype-vs-reality.us-east.modal.run.

Numbers come from the real run: 6 predictions found from 4 public accounts, 1 marked right with a cited source, 5 pending. X search returns a sample of posts, so these are counts of sampled posts found, not totals. The daily Cron re-check was switched off after filming (web endpoint only) to save cost; the narration says so. The extension ideas are suggestions, not features of the demo app.

| Beat | Caption | Narration |
|---|---|---|
| 0000.png (intro) | Find predictions on X, then check them later | Tech predictions on X are easy to post and rarely checked later. This app keeps the exact quote and a link to each post, then checks back when each one comes due. |
| 0001.png (pipeline) | Where Modal fits: everything after the X search | Here's where Modal fits. Grok searches X through the xAI API. It looks at posts from a few public accounts. Everything after that runs on Modal, right up to the page anyone can open. |
| 0001b.png (modal) | Why Modal: no server to run, parallel calls, storage, a public URL | Why use Modal? The job comes in bursts: one big parallel search, then nothing until the next check. A laptop script stops when the lid closes, and a server of your own sits idle all day. On Modal, a schedule runs the re-checks with no server to maintain. Map spreads the xAI calls across many containers at once. A Dict stores the results, and a web endpoint serves the page at a public URL. The xAI key lives in a Modal Secret. When nothing is running, the app scales to zero, so you pay per second of work. |
| 0002.png (rules) | Pending until a check date, verdicts only with sources | To stay factual, every quote is checked against the original post. Each prediction stays pending until its check date, and it's only marked right or wrong when a cited source backs it up. |
| 0003.png | Devin built it from one plain-language prompt | Devin built the whole thing from one plain-language prompt in the product demo apps repo. |
| 0004.png | Devin's plan, then modal deploy | It planned the Modal pieces, and shipped the app with modal deploy. |
| 0005.png | A pull request, with review findings fixed | It opened a pull request, and fixed the five issues Devin Review flagged. |
| 0006.png | Counts of sampled posts found so far | On the page running on Modal, it has found six predictions so far in sampled posts. One is marked right, and five are still pending. |
| 0007.png | Each pending prediction shows its check date | Each pending one shows the date it can be checked. After filming, the daily schedule was switched off to save cost. |
| 0008.png (extend) | More accounts, alerts, account pages, dashboards | To extend it, you could track more accounts and topics, or send an alert when a check date arrives. You could also add a page for each account, or feed the JSON into your own dashboard. |
| outro | Bold predictions, checked later, with a source for every verdict | Bold predictions, checked later, with a source for every verdict. |
