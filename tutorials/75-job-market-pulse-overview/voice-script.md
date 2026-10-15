# Tutorial 75: Job-market pulse overview (voice script)

Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, saved default settings), one full-script take with `_kit/tools/vo.py`. `voSay`: "xAI" spoken "ex A I"; the word "live" is avoided in narration. Proof shots are reused from tutorial 74 (see `shots/SOURCES.json`). Numbers are from the 06:01 UTC run on 2026-10-15 and are counts of sampled X posts, not labor statistics.

| Beat | Caption | Narration |
|---|---|---|
| 0000.png | Three buckets, tallied by role, company and skill | This is a job-market pulse. Every hour it samples tech posts on X, sorts them into hiring, layoffs and looking for work, and counts the roles, companies and skills they mention. You get your own up-to-date numbers, instead of waiting for a monthly report. |
| 0001.png | X search to Modal to a web page | Here's how it works. Grok searches X through the xAI API. A Modal Cron job runs every hour, and dot map fans the searches and labels out in parallel. Each run is saved to a Modal Volume, and a web endpoint serves the page. |
| 0002.png | One plain prompt to Devin | Devin built it from one plain prompt in the demo apps repo. |
| 0003.png | Tests, modal deploy, then the public URL | It ran the tests, deployed with modal deploy, and checked the public URL. |
| 0004.png | modal.Cron: every hour | In the code, a Modal Cron schedule runs the collection every hour. |
| 0005.png | .map(): six searches in parallel | And search dot map runs the six searches in parallel. |
| 0006.png | Pull request #72 | It all landed in one pull request. |
| 0007.png | 78 sampled posts in the last 24 hours | The page shows seventy-eight sampled posts from the last day. Fifty-eight are about hiring, and twenty are about layoffs. |
| 0008.png | Sampled posts per hourly run | A chart counts the posts from each hourly run. |
| 0009.png | Counts of sampled posts, never names | These are counts of posts in a sample, not labor statistics. And the page never names anyone who posted about layoffs or job hunting. |
| 0010.png | Four ways to extend it | To take it further, track one role over time, like forward deployed engineers. Post a weekly digest to Slack. Split the counts by region or seniority. Or get an alert when a skill suddenly spikes. |
| outro | Your own job-market numbers | Your own job-market numbers, every hour. |
