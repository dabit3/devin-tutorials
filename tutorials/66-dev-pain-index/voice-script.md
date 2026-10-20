# 66 · Build a Developer Pain Index on Modal: voice script

Nader voice (`T8iHhGIWPm2GVYpQD1Am`), one whole-script take. Beat → line (spoken form in brackets where it differs).

- `0000.png`: The Developer Pain Index ranks what developers complain about on X each month, and it groups similar complaints so you can follow each trend over time.
- `0002.png`: It works like an industry survey people can cite, except it's built from real posts, so every chart has to say how many posts it used and which dates they cover.
- `0004.png`: The goal is a report page at a public URL on Modal, with real data from X, plus a pull request in the demo repo.
- `0007.png`: The prompt asks for a Modal app that calls Grok from xAI, and uses its X search tool to find the posts. It runs on a monthly schedule and backfills earlier months, so every trend line has real data points.  
  _(said: The prompt asks for a Modal app that calls Grok from ex A I, and uses its X search tool to find the posts. It runs on a monthly schedule and backfills earlier months, so every trend line has real data points.)_
- `0007a.png` (modal scene): So why Modal? A monthly job shouldn't depend on a laptop being awake, or on a server you pay for all month. On Modal, a cron schedule starts the pull and .map() runs the searches in parallel containers. A Volume keeps the results, and a web endpoint serves the page at a public URL. The xAI key sits in a Modal Secret, and the app scales to zero between runs, so you only pay for the seconds it works.  
  _(said: So why Modal? A monthly job shouldn't depend on a laptop being awake, or on a server you pay for all month. On Modal, a cron schedule starts the pull and dot map runs the searches in parallel containers. A Volume keeps the results, and a web endpoint serves the page at a public URL. The ex A I key sits in a Modal Secret, and the app scales to zero between runs, so you only pay for the seconds it works.)_
- `0011.png`: Devin replies with a short plan before it starts.
- `0015.png`: From there it works on its own, and runs a real six month backfill of posts from X.
- `0140.png`: The first deploy fails because the Modal workspace already uses all five of its scheduled functions, so Devin asks how to handle it instead of stopping someone else's app.
- `0152.png`: I tell it to leave the cron off for now. The schedule stays in the code, but it hasn't run yet.
- `0155.png`: Devin redeploys without the schedule and checks the page at its public URL.
- `0195.png`: Then it opens a pull request in the demo repo with the whole app.
- `0269.png`: When it finishes, the summary says the backfill kept 704 posts across six months, for about $24.50 of xAI usage. All 14 unit tests pass.  
  _(said: When it finishes, the summary says the backfill kept seven hundred and four posts across six months, for about twenty four dollars and fifty cents of ex A I usage. All fourteen unit tests pass.)_
- `0314.png`: Devin's deploy step shows the real modal deploy output. It lists every function Modal created, from the parallel searches to the web endpoint.
- `0315.png`: The web endpoint gets its own modal.run URL, which is the public address of the report.  
  _(said: The web endpoint gets its own modal dot run URL, which is the public address of the report.)_
- `0328.png`: The page running on Modal shows September's index at 44 out of 100, built from 109 posts found in September.  
  _(said: The page running on Modal shows September's index at forty four out of a hundred, built from a hundred and nine posts found in September.)_
- `0329.png`: Each category gets its own trend line, with six real months behind it and nothing extrapolated.
- `0330.png`: Every category card shows its top complaint themes for the month.
- `0331.png`: The loudest complaints are real posts from X, each linked to its author.
- `0334.png`: In September, layoffs scored highest at 72, with AI coding agents second at 41 points.  
  _(said: In September, layoffs scored highest at seventy two, with AI coding agents second at forty one points.)_
- `0336.png`: A methodology note explains that these numbers come from a sample of posts, not a total count.
- outro: Describe the report you want, and Devin builds it and ships it to Modal.
