# Tutorial 75: Job-market tracker overview (voice script)

Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, saved default settings), one full-script take with `_kit/tools/vo.py`. `voSay`: "xAI" spoken "ex A I"; the word "live" is avoided in narration. Proof shots are reused from tutorial 74 (see `shots/SOURCES.json`). Numbers are from the 06:01 UTC run on 2026-10-15 and are counts of sampled X posts, not labor statistics.

| Beat | Caption | Narration |
|---|---|---|
| 0000.png | Three buckets, tallied by role, company and skill | This is a job-market tracker. Every hour it samples tech posts on X, sorts them into hiring, layoffs and looking for work, and counts the roles, companies and skills they mention. You get your own up-to-date numbers, instead of waiting for a monthly report. |
| 0001a.png | Modal runs it hourly, in parallel, with no server | Why Modal? The app has to wake up every hour and make many Grok calls. Then it has to store the results and serve them on a page. You could run your own server and database. But that machine stays on all day for a few minutes of work each hour. You'd also wire up the schedule and the parallel calls yourself. On Modal, the collection is a scheduled function, so there's nothing to keep running. Dot map runs the xAI calls in parallel across containers. A Modal Volume stores each run, and a Modal Secret holds the xAI key. A web endpoint serves the page at a public URL. And between runs it scales to zero, so you only pay for the seconds it works. |
| 0001.png | X search, Grok, then Modal | Here's how the pieces connect. Every hour, the scheduled function asks Grok to search X through the xAI API. Dot map classifies the posts in parallel. Each run lands in the Volume, and the web endpoint reads it to serve the page. |
| 0002.png | One plain prompt to Devin | Devin built it from one plain prompt in the demo apps repo. |
| 0003.png | Tests, modal deploy, then the public URL | It ran the tests, deployed with modal deploy, and checked the public URL. |
| 0006.png | Deployed, with PR #72 open | It all landed in one pull request. |
| 0007.png | 78 sampled posts in the last 24 hours | The page shows seventy-eight sampled posts from the last day. Fifty-eight are about hiring, and twenty are about layoffs. |
| 0008.png | Sampled posts per hourly run | A chart counts the posts from each hourly run. |
| 0009.png | Counts of sampled posts, never names | These are counts of posts in a sample, not labor statistics. And the page never names anyone who posted about layoffs or job hunting. |
| 0010.png | Four ways to extend it | To take it further, track one role over time, such as forward deployed engineers. You could post a weekly digest to Slack. You could split the counts by region or seniority. And you could get an alert when a skill suddenly spikes. |
| outro | Your own job-market numbers | Your own job-market numbers, every hour. |
