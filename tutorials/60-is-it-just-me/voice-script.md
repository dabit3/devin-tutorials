# Tutorial 60: Is it just me? An outage detector on Modal and the xAI API, step by step (voice script)

Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, saved default voice settings). Generated as one full-script take with `python3 _kit/tools/vo.py 60-is-it-just-me T8iHhGIWPm2GVYpQD1Am` and cut locally.

Real run: https://app.devin.ai/sessions/703807ab87394f00b38bb6f902a9ca9c (thequantexplorer org, repo thequantexplorer/product-demo-apps, folder `is-it-just-me/`). Demo PR: https://github.com/thequantexplorer/product-demo-apps/pull/70. Live app: https://dabit3--is-it-just-me-web.us-east.modal.run

## Prompts typed on screen

1. `@thequantexplorer/product-demo-apps Build an "Is it just me?" outage detector in a new is-it-just-me/ folder. Type a service like Slack, GitHub, ChatGPT or AWS and see if people on X are saying it's down. On Modal, run a job every minute that uses the xAI API's X search to find and classify new posts, and store the counts. Serve a dark web page with a spike chart, affected regions and the most common error messages. Only show regions and errors the posts actually mention, and label counts as posts found. Deploy it with modal deploy, test the live URL, and open a PR.`
2. `Two changes: use a thin blue accent instead of the purple one, and only allow Slack, GitHub, ChatGPT and AWS so nobody can run up the X search bill. Then redeploy and test the live URL again.`

All numbers in the narration come from the real run: the cost heads-up (one X search call fetched 9 posts for about $0.055), the four Devin Review fixes, the 12 passing unit tests, and the live page counts (ChatGPT: 1 post found in 15 minutes, 6 in 6 hours, "model not found" in 3 posts; AWS: 1 post in 24 hours naming the Middle East; GitHub: 0 posts). Counts are posts found by xAI X search, a sample of posts, not platform-wide totals.

| Beat | Caption | Narration |
|---|---|---|
| 0000.png | Is it just me, or is it down for everyone? | When Slack or GitHub acts up, everyone asks the same thing. Is it just me, or is it down for everyone? |
| 0001.png | Devin builds the answer from real posts on X | In this tutorial, Devin builds an app that answers that question from real posts on X, using the xAI API, and runs it on Modal. |
| 0005.png | A job every minute, real posts, stored counts | The prompt asks for a Modal job that runs every minute, searches X for outage posts, and stores the counts. |
| 0006.png | Only regions and errors the posts mention | It also asks for a dark page with a spike chart, showing only the regions and errors that posts actually mention. |
| 0007.png | Devin checks the repo and the API keys | Devin checks the repo and the Modal and xAI setup, then makes one real search call. |
| 0019.png | One call cost about 5 cents, so Devin caps the budget | That call cost about five cents, so Devin caps the scans with a daily post budget before it writes the app. |
| 0020.png | Devin writes the detector and the Modal app | Then it writes the detection logic in one file, and the Modal app in another. |
| 0069.png | A Modal Dict stores the counts | Here's the code from its pull request. The counts live in a Modal Dict, so they persist between runs. |
| 0070.png | Each scan uses xAI's X search tool | Each scan calls the xAI Responses API with the X search tool, and asks for structured JSON back. |
| 0071.png | modal.Cron("* * * * *") runs it every minute | A Modal Cron schedule runs the tick function every minute. |
| 0072.png | .starmap() scans every service in parallel | Inside it, starmap runs one scan per service, in parallel. |
| 0073.png | @modal.asgi_app() serves the web page | And the same app serves the web page as an ASGI endpoint. |
| 0074.png | modal deploy puts it live | Devin deploys it with modal deploy, and Modal prints the deployment link. |
| 0075.png | Unit tests, a live URL check, then a PR | Then it runs the unit tests, checks the live URL, and opens a pull request. |
| 0103.png | The PR is open, and Devin tests the page | With the pull request open, Devin tests the deployed page in its own browser. |
| 0156.png | Devin Review finds four bugs | Devin Review finds four bugs, so Devin fixes them, adds regression tests, and redeploys. |
| 0202.png | All 12 unit tests pass after the fixes | Its summary lists the four fixes, and says all twelve unit tests pass. |
| 0203.png | Two changes: a blue accent and four services | It also warns that anyone can trigger paid searches. So I ask for a thin blue accent, and only four allowed services. |
| 0205.png | Devin restricts the services and redeploys | Devin restricts the services, swaps the accent, redeploys, and tests the live URL again. |
| 0365.png | Its last check types a service that isn't allowed | In its last check, it types Discord, to confirm that other services are refused. |
| 0369.png | The PR is ready for review | The pull request is open in the session, and it's ready to merge. |
| 0370.png | The deployed app on Modal | And here's the deployed app on Modal. GitHub is quiet right now, and the page says no posts were found. |
| 0380.png | 1 post found in 15 minutes, 6 in 6 hours | For ChatGPT, it found one post in the last fifteen minutes and six in the last six hours, so it's probably just you. |
| 0381.png | Posts found, not people affected | The chart counts posts found that report problems, not people affected. |
| 0382.png | No ChatGPT post names a region | None of these posts names a region, so that panel stays empty. |
| 0383.png | "model not found" appears in 3 posts | The most common error quoted is model not found, in three posts. |
| 0384.png | Every number comes from these real posts | Every number on the page comes from real posts like these, each linked back to X. |
| 0390.png | AWS: one post in 24 hours names a region | For AWS, one post in the last day names the Middle East. |
| 0392.png | Its own words: an AWS outage in the Middle East | That region comes straight from the post's own words, so the page can say exactly where it came from. |
| outro | Real posts in, an honest answer out | Real posts in, an honest answer out. |

## Pronunciation overrides (`voSay`)

- 0001.png: "In this tutorial, Devin builds an app that answers that question from real posts on X, using the ex A I API, and runs it on Modal."
- 0007.png: "Devin checks the repo and the Modal and ex A I setup, then makes one real search call."
- 0070.png: "Each scan calls the ex A I Responses API with the X search tool, and asks for structured JSON back."
- 0072.png: "Inside it, star map runs one scan per service, in parallel."
- 0073.png: "And the same app serves the web page as an A S G I endpoint."
- 0075.png: "Then it runs the unit tests, checks the lyve URL, and opens a pull request."
- 0205.png: "Devin restricts the services, swaps the accent, redeploys, and tests the lyve URL again."
