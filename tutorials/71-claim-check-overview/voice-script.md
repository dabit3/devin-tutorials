# Claim Check: how it works (overview), voice script

Narrated by Nader (ElevenLabs voice T8iHhGIWPm2GVYpQD1Am, saved default settings), generated as one full-script take with `_kit/tools/vo.py` and cut at sentence boundaries. Where the spoken text differs from the subtitle (`voSay`), it is noted in the table ("xAI" is spoken "ex A I", "arXiv" is spoken "archive").

Proof shots are reused from the 70-claim-check capture (see shots/SOURCES.json): the same Devin session, PR #71 in thequantexplorer/product-demo-apps, and the deployed app https://dabit3--claim-check-web.us-east.modal.run. Diagram beats are drawn by scenes.js.

| Beat | Caption | Narration |
|---|---|---|
| 0000.png (value diagram) | Viral AI claims, checked against primary sources | Claim Check watches X for viral AI posts that make technical claims, then finds the primary sources and checks each claim against them. |
| 0001.png (why diagram) | A checker that shows its links earns trust | Claims like these spread fast, and checking them takes real sources, so a checker that shows its links is easier to trust. |
| modal.png (modal diagram) | Modal: schedule, parallel .map(), Dict, endpoint, Secret | Modal is where it all runs. A scheduled function wakes up every hour, so there's no server to keep running. Calling .map() spreads the claim checks across containers, so they run in parallel. A Modal Dict stores the results, a web endpoint serves the page at a public modal.run URL, and a Modal Secret keeps the xAI key out of the code. Between runs it scales to zero and bills by the second, which beats leaving a laptop script or a server on all day. *(spoken: Modal is where it all runs. A scheduled function wakes up every hour, so there's no server to keep running. Calling dot map spreads the claim checks across containers, so they run in parallel. A Modal Dict stores the results, a web endpoint serves the page at a public modal dot run URL, and a Modal Secret keeps the ex A I key out of the code. Between runs it scales to zero and bills by the second, which beats leaving a laptop script or a server on all day.)* |
| 0002.png (pipe1 diagram) | X posts come in through the xAI API, on a schedule | Here's the path a claim takes. Posts on X come in through the xAI API, where Grok runs X Search on the hourly schedule. *(spoken: Here's the path a claim takes. Posts on X come in through the ex A I API, where Grok runs X Search on the hourly schedule.)* |
| 0003.png (pipe2 diagram) | .map() checks every claim in parallel | Then check claim dot map fans the posts out, so the claims are checked in parallel, with Grok searching the web for primary sources. |
| 0004.png (pipe3 diagram) | Results in a modal.Dict, served by a web endpoint | The verdicts land in the Modal Dict, and the page running on Modal shows them. |
| 0005.png | Built by Devin from one short prompt | Devin built all of this from one short prompt in the product demo apps repo. |
| 0006.png | Tests, modal deploy, and a check of the URL | It wrote the app and its tests, ran modal deploy, and checked the deployed URL. |
| 0008.png | Devin Review: three findings resolved, four open | Devin then opened a pull request, where Devin Review shows three findings resolved and four still open. |
| 0009.png | This run: 5 posts found, all 5 supported | In this run, it found five posts on X, and all five claims were supported. |
| 0010.png | Every verdict links to its primary sources | Each verdict links to its primary sources, like the arXiv paper behind a benchmark claim. *(spoken: Each verdict links to its primary sources, like the archive paper behind a benchmark claim.)* |
| 0011.png (extend diagram) | Four ways to extend it | You can take it further. Let people paste a post to check it on demand. Send unclear verdicts to a person for review. Add filings and press releases as sources for funding claims. Or send a Slack alert when a claim is not supported. |
| outro | Every viral claim, checked against its sources | Every viral claim, checked against its sources. |
