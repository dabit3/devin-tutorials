# Tutorial 74: Job-market tracker on Modal with the xAI API (voice script)

Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, saved default settings). Generated as one full-script take with `_kit/tools/vo.py` and cut locally at sentence boundaries. `voSay` overrides: "xAI" is spoken "ex A I". The word "live" is avoided in narration (it was voiced as "liv").

Real run: https://app.devin.ai/sessions/2cbce76d537f403d89b569eef12074cf (thequantexplorer org, repo thequantexplorer/product-demo-apps, PR #72). Live app: https://dabit3--job-market-pulse.us-east.modal.run/ . Live-page numbers are from the 06:01 UTC hourly run on 2026-10-15 (78 sampled posts: 58 hiring, 20 layoffs, 0 looking for work). They are counts of posts in the X search sample, not labor statistics.

| Beat | Caption | Narration |
|---|---|---|
| 0000.png | Hourly job-market counts from sampled X posts | This is a job-market tracker. Every hour, it samples tech posts on X about hiring, layoffs and people looking for work, sorts them with Grok, and shows which roles, companies and skills come up most. |
| 0000a.png | Modal runs it hourly, in parallel, with no server | Why Modal? The app has to wake up every hour and make many Grok calls. Then it has to store the results and serve them on a page. You could run your own server and database. But that machine stays on all day for a few minutes of work each hour. You'd also wire up the schedule and the parallel calls yourself. On Modal, the collection is a scheduled function, so there's nothing to keep running. Dot map runs the xAI calls in parallel across containers. A Modal Volume stores each run, and a Modal Secret holds the xAI key. A web endpoint serves the page at a public URL. And between runs it scales to zero, so you only pay for the seconds it works. |
| 0007.png | One plain prompt: build, deploy, test, open a PR | Here's the prompt. I'm asking Devin to build it on Modal with the xAI API and X search, to label every number as a count of sampled posts, and to never name people who posted about layoffs or job hunting. |
| 0012.png |  | Devin also deploys it, tests the public URL, and opens a pull request. |
| 0020.png | Current xAI docs, and the key in a Modal Secret | First, Devin checks the current xAI docs for X search, and plans to keep the API key in a Modal Secret. |
| 0135.png | modal deploy, then a test of the public URL | Then it writes the app, deploys it with modal deploy, and tests the public URL. |
| 0154.png | Deployed, with PR #72 open | It's deployed, and the pull request is open in the demo apps repo. |
| 0346.png | 78 sampled posts in the last 24 hours | And here's the page running on Modal. In the last day it has seventy-eight sampled posts, fifty-eight about hiring and twenty about layoffs. |
| 0350.png | Every number is a count of sampled posts | The top role is Software Engineer, and the top skill is Python. No looking-for-work posts turned up in this sample yet, and every number here is a count of sampled posts, not a labor statistic. |
| outro | Your own job-market numbers, every hour | Your own job-market numbers, every hour. |
