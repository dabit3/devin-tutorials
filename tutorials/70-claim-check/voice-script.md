# Claim Check on Modal (in-depth tutorial), voice script

Narrated by Nader (ElevenLabs voice T8iHhGIWPm2GVYpQD1Am, saved default settings), generated as one full-script take with `_kit/tools/vo.py` and cut at sentence boundaries. Where the spoken text differs from the subtitle (`voSay`), it is noted in the table ("xAI" is spoken "ex A I", "arXiv" is spoken "archive").

Real run: Devin session https://app.devin.ai/sessions/fc4836d867d04b1d9a93986d16498736 in the thequantexplorer org (dark theme), repo thequantexplorer/product-demo-apps, folder claim-check/, PR https://github.com/thequantexplorer/product-demo-apps/pull/71, deployed app https://dabit3--claim-check-web.us-east.modal.run. The numbers on screen (5 posts found, 5 supported) come from the deployed run at 2026-10-15 05:17 UTC.

| Beat | Caption | Narration |
|---|---|---|
| 0000.png | Viral AI claims rarely get checked against sources | Viral AI posts often make technical claims, like a benchmark record or a funding round, and few people check the sources behind them. |
| 0001.png | Goal: a deployed page of claims, verdicts and sources | Here, Devin builds a claim checker on Modal that uses the xAI API to find those posts on X, and shows a verdict for each claim with its primary sources. *(spoken: Here, Devin builds a claim checker on Modal that uses the ex A I API to find those posts on X, and shows a verdict for each claim with its primary sources.)* |
| 0003.png | The prompt: hourly scan, parallel checks, dark page | In the prompt, I ask for an hourly scan with X Search and parallel claim checks, with results saved in a Modal Dict and shown on a dark web page. It must never post to X, and it labels counts as posts found, not totals. |
| 0004.png | Devin reads the docs and probes X Search | Devin starts by reading the xAI docs and running a small X Search probe, and then it writes the app, its tests and a README. *(spoken: Devin starts by reading the ex A I docs and running a small X Search probe, and then it writes the app, its tests and a README.)* |
| 0011.png | Tests, modal deploy, then a check of the URL | It runs the tests, deploys with modal deploy, and checks that the page and the JSON endpoint both respond. |
| 0014.png | The hourly job runs on the deployed app | Then it runs the hourly job on the deployed app to test it with real posts from X. |
| 0016.png | Devin opens a pull request | Next, Devin pushes a branch and opens a pull request. |
| 0017.png | Devin Review flags bugs and security findings | Devin Review checks the pull request and flags a few bugs and security findings. |
| 0018.png | Three resolved, four still open | In Devin Review, three findings are resolved, and two bugs and two warnings are still open. |
| 0019.png | find_posts: xAI Responses API with X Search | The find posts function calls the xAI Responses API with the X Search tool. *(spoken: The find posts function calls the ex A I Responses API with the X Search tool.)* |
| 0020.png | check_claim: Grok looks for primary sources | Each post goes to check claim, where Grok searches for primary sources and returns a verdict. |
| 0021.png | .map() checks the claims in parallel | The hourly job fans the posts out with check claim dot map, so the claims are checked in parallel. |
| 0022.png | modal.Cron runs it every hour | A Modal Cron schedule runs that job at the top of every hour. |
| 0023.png | Results are saved in a modal.Dict | The results go into a Modal Dict, which keeps the latest run and a short history. |
| 0024.png | @modal.asgi_app serves the page | And a FastAPI app behind modal asgi app serves the page. |
| 0025.png | Devin fixes review comments and redeploys | Devin works through the review comments, pushes fixes and deploys again. |
| 0028.png | Devin reports the URL and how it tested | When it's done, Devin reports the deployed URL and how it tested the app, and notes that every verdict so far was supported. |
| 0029.png | The deployed page on modal.run | Here's the deployed page at its modal dot run URL. |
| 0030.png | 5 posts found this run, all 5 supported | This run found five posts, and all five claims were supported by their sources. |
| 0031.png | Each card: post, claim and verdict | Each card shows the post, the claim Grok pulled out, and the verdict. |
| 0032.png | Primary sources link to the evidence | Below that are the primary source links, like the arXiv paper behind this benchmark claim. *(spoken: Below that are the primary source links, like the archive paper behind this benchmark claim.)* |
| 0034.png | Counts are posts found, not totals | X Search returns a sample of posts, so the page labels its counts as posts found by each search, not totals. |
| outro | Viral claims in, verdicts with primary sources out | Viral claims in, verdicts with primary sources out. |
