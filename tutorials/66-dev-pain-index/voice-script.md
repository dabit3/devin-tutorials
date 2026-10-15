# 66 · Build a Developer Pain Index on Modal: voice script

Nader voice (`T8iHhGIWPm2GVYpQD1Am`), one whole-script take. Beat → line (spoken form in brackets where it differs).

- `0000.png`: The Developer Pain Index ranks what developers complain about on X each month, and it groups similar complaints so you can follow each trend over time.
- `0002.png`: It works like an industry survey people can cite, except it's built from real posts, so every chart has to say how many posts it used and which dates they cover.
- `0004.png`: The goal is a live report page on Modal with real data from X, plus a pull request in the demo repo.  
  _(said: The goal is a lyve report page on Modal with real data from X, plus a pull request in the demo repo.)_
- `0007.png`: The prompt asks for a Modal app that finds the posts with the xAI API's X search. It also asks for a monthly schedule, a parallel search per category and a backfill of earlier months, so every trend line has real data points.  
  _(said: The prompt asks for a Modal app that finds the posts with the ex A I A P I's X search. It also asks for a monthly schedule, a parallel search per category and a backfill of earlier months, so every trend line has real data points.)_
- `0011.png`: Devin replies with its plan, then reads the repo to see how the existing Modal app is set up.
- `0015.png`: From there it works on its own, writing the search, grouping and report code, and running a real backfill against X.
- `0140.png`: The first deploy fails because the Modal workspace already uses all five of its scheduled functions, so Devin asks how to handle it instead of stopping someone else's app.
- `0152.png`: I tell it to leave the cron off for now, which keeps the schedule in the code and ships the web page with the backfilled data.
- `0155.png`: Devin redeploys with the schedule turned off and tests the live URL.  
  _(said: Devin redeploys with the schedule turned off and tests the lyve URL.)_
- `0195.png`: Then it opens a pull request in the demo repo with the whole dev-pain-index folder.
- `0230.png`: An automated review flags three issues, so Devin fixes them, reruns the tests and redeploys.
- `0269.png`: When it finishes, the summary says the backfill kept 704 posts across six months, for about $24.50 of xAI usage. All 14 unit tests pass, and the cron stays off until a scheduled slot is free.  
  _(said: When it finishes, the summary says the backfill kept seven hundred and four posts across six months, for about twenty four dollars and fifty cents of ex A I usage. All fourteen unit tests pass, and the cron stays off until a scheduled slot is free.)_
- `0312.png`: Clicking the deploy step in the timeline shows the real modal deploy output, ending with the app deployed.
- `0315.png`: The web endpoint gets its own modal.run URL.  
  _(said: The web endpoint gets its own modal dot run URL.)_
- `0320.png`: The pull request tab shows the code, and app.py holds the whole pipeline.  
  _(said: The pull request tab shows the code, and app dot pie holds the whole pipeline.)_
- `0323.png`: A modal.Cron schedule runs the refresh on the first of every month, behind a flag so it can stay off for now.  
  _(said: A modal dot Cron schedule runs the refresh on the first of every month, behind a flag so it can stay off for now.)_
- `0324.png`: Each search calls the xAI Responses API with the X search tool, limited to one month of dates.  
  _(said: Each search calls the ex A I Responses API with the X search tool, limited to one month of dates.)_
- `0325.png`: The .map() call runs every category and month in parallel, so the six-month backfill was 30 searches at once.  
  _(said: The dot map call runs every category and month in parallel, so the six month backfill was thirty searches at once.)_
- `0326.png`: The web function serves the report page from the stored dataset as an ASGI app.  
  _(said: The web function serves the report page from the stored dataset as an A S G I app.)_
- `0328.png`: The live page shows September's index at 44 out of 100, built from 109 posts found in September.  
  _(said: The lyve page shows September's index at forty four out of a hundred, built from a hundred and nine posts found in September.)_
- `0329.png`: Each category gets its own trend line, with six real months behind it and nothing extrapolated.
- `0330.png`: Every category card shows its top complaint themes for the month.
- `0331.png`: The loudest complaints are real posts from X, each linked to its author.
- `0334.png`: In September, layoffs scored highest at 72, with AI coding agents second at 41 points.  
  _(said: In September, layoffs scored highest at seventy two, with AI coding agents second at forty one points.)_
- `0336.png`: A methodology note explains that these numbers come from a sample of posts, not a total count.
- outro: Describe the report you want, and Devin builds it and ships it to Modal.
