# Tutorial 74: Job-market pulse on Modal with the xAI API (voice script)

Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, saved default settings). Generated as one full-script take with `_kit/tools/vo.py` and cut locally at sentence boundaries. `voSay` overrides: "xAI" is spoken "ex A I". The word "live" is avoided in narration (it was voiced as "liv").

Real run: https://app.devin.ai/sessions/2cbce76d537f403d89b569eef12074cf (thequantexplorer org, repo thequantexplorer/product-demo-apps, PR #72). Live app: https://dabit3--job-market-pulse.us-east.modal.run/ . Live-page numbers are from the 06:01 UTC hourly run on 2026-10-15 (78 sampled posts: 58 hiring, 20 layoffs, 0 looking for work). They are counts of posts in the X search sample, not labor statistics.

| Beat | Caption | Narration |
|---|---|---|
| 0000.png | Hourly job-market counts from sampled X posts | This is a job-market pulse. Every hour, it samples tech posts on X about hiring, layoffs and people looking for work, sorts them with Grok, and shows which roles, companies and skills come up most. |
| 0007.png | One plain prompt: build, deploy, test, open a PR | Here's the prompt. I'm asking Devin to build it on Modal with the xAI API and X search, to label every number as a count of sampled posts, and to never name people who posted about layoffs or job hunting. |
| 0012.png |  | Devin also deploys it, tests the public URL, and opens a pull request. |
| 0020.png | Devin checks the current Modal and xAI docs first | Devin sets up Modal and reads the current xAI docs for X search before it writes any code. |
| 0079.png | App, dark page and tests, then a first run | Then it writes the app, a dark web page and the tests, and runs a first collection on Modal. |
| 0135.png | Lint, tests, modal deploy, then the public URL | It runs the linter and the tests, deploys with modal deploy, and checks the public URL. |
| 0154.png | Pull request #72 in product-demo-apps | And it opens a pull request in the demo apps repo. |
| 0300.png | Devin Review findings, fixed in the same PR | Devin Review flagged privacy and accuracy issues, so Devin fixed them in the same pull request. |
| 0329.png | 8 tests and the linter pass | Its summary says the eight tests and the linter pass, and the fresh run kept forty-six of a hundred and twenty-five posts. |
| 0334.png | PR #72, open for review | The pull request is open for review, so let's look at the code. |
| 0336.png | xAI Responses API with the X search tool | Each search calls the xAI Responses API with the X search tool, limited to recent posts. |
| 0337.png | modal.Cron runs it at the top of every hour | A Modal Cron schedule runs the collection at the top of every hour. |
| 0338.png | .map() runs the six searches in parallel | With search dot map, the six searches run in parallel. |
| 0339.png | Each post gets a structured label from Grok | Then classify dot map sends each post to Grok in parallel, and gets back a structured label. |
| 0340.png | A Modal web endpoint serves the page | And the asgi app decorator serves the page and its data from a Modal web endpoint. |
| 0346.png | 78 sampled posts in the last 24 hours | And here's the page running on Modal. In the last day it has seventy-eight sampled posts, fifty-eight about hiring and twenty about layoffs. |
| 0350.png | Every number is a count of sampled posts | The top role is Software Engineer, and the top skill is Python. No looking-for-work posts turned up in this sample yet, and every number here is a count of sampled posts, not a labor statistic. |
| outro | Your own job-market numbers, every hour | Your own job-market numbers, every hour. |
