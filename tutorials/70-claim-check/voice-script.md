# Claim Check on Modal (in-depth tutorial), voice script

Narrated by Nader (ElevenLabs voice T8iHhGIWPm2GVYpQD1Am, saved default settings), generated as one full-script take with `_kit/tools/vo.py` and cut at sentence boundaries. Where the spoken text differs from the subtitle (`voSay`), it is noted in the table ("xAI" is spoken "ex A I", "arXiv" is spoken "archive").

Real run: Devin session https://app.devin.ai/sessions/fc4836d867d04b1d9a93986d16498736 in the thequantexplorer org (dark theme), repo thequantexplorer/product-demo-apps, folder claim-check/, PR https://github.com/thequantexplorer/product-demo-apps/pull/71, deployed app https://dabit3--claim-check-web.us-east.modal.run. The numbers on screen (5 posts found, 5 supported) come from the deployed run at 2026-10-15 05:17 UTC.

| Beat | Caption | Narration |
|---|---|---|
| 0000.png | Viral AI claims rarely get checked against sources | Viral AI posts often make technical claims, like a benchmark record or a funding round, and few people check the sources behind them. |
| 0001.png | Goal: a deployed page of claims, verdicts and sources | Here, Devin builds a claim checker that uses the xAI API to find those posts on X, and shows a verdict for each claim with its primary sources. *(spoken: Here, Devin builds a claim checker that uses the ex A I API to find those posts on X, and shows a verdict for each claim with its primary sources.)* |
| modal.png (modal diagram) | Why Modal: no server, parallel checks, pay per second | It runs on Modal. A scheduled function pulls new posts every hour, so there's no server to keep running. Calling .map() checks the claims in parallel across containers. A Modal Dict stores the results, a web endpoint serves the page at a public modal.run URL, and a Modal Secret holds the xAI key. Between runs it scales to zero, and you pay by the second, instead of leaving a laptop script or a server on all day. *(spoken: It runs on Modal. A scheduled function pulls new posts every hour, so there's no server to keep running. Calling dot map checks the claims in parallel across containers. A Modal Dict stores the results, a web endpoint serves the page at a public modal dot run URL, and a Modal Secret holds the ex A I key. Between runs it scales to zero, and you pay by the second, instead of leaving a laptop script or a server on all day.)* |
| 0003.png | The prompt: hourly scan, parallel checks, dark page | In the prompt, I ask for an hourly scan with X Search and parallel claim checks, with results saved in a Modal Dict and shown on a dark web page. It must never post to X, and it labels counts as posts found, not totals. |
| 0005.png | Devin's plan, then the app and its tests | Devin replies with a short plan that matches the prompt, and then it writes the app and its tests. |
| 0011.png | modal deploy, then a check of the public URL | Then it runs modal deploy, and calls the public URL to check that the page responds. |
| 0016.png | Devin opens a pull request | Next, Devin pushes a branch and opens a pull request. |
| 0018.png | Devin Review: three resolved, four still open | Devin Review checks the pull request. Three findings are resolved, and four are still open. |
| 0028.png | Devin reports the URL and how it tested | When it's done, Devin reports the deployed URL and how it tested the app, and notes that every verdict so far was supported. |
| 0029.png | The deployed page on modal.run | Here's the page running on Modal. |
| 0030.png | 5 posts found this run, all 5 supported | This run found five posts, and all five claims were supported by their sources. |
| 0031.png | Each card: post, claim and verdict | Each card shows the post, the claim Grok pulled out, and the verdict. |
| 0032.png | Primary sources link to the evidence | Below that are the primary source links, like the arXiv paper behind this benchmark claim. *(spoken: Below that are the primary source links, like the archive paper behind this benchmark claim.)* |
| 0034.png | Counts are posts found, not totals | X Search returns a sample of posts, so the page labels its counts as posts found by each search, not totals. |
| outro | Viral claims in, verdicts with primary sources out | Viral claims in, verdicts with primary sources out. |
