# 67 · The Developer Pain Index: voice script

Nader voice (`T8iHhGIWPm2GVYpQD1Am`), one whole-script take. Beat → line (spoken form in brackets where it differs).

- `0000.png` (why scene): Developers complain on X every day about their tools, their cloud bills and the job market, but nobody adds it up. The Developer Pain Index turns those posts into a monthly report you can cite, with every chart showing its sample size and dates.
- `0001.png` (flow scene): Each month, Grok from xAI searches X for complaint posts in each category, and rates how severe each one is. Everything after that runs on Modal, which groups the complaints into themes, saves the dataset to a Volume and serves the report page.  
  _(said: Each month, Grok from ex A I searches X for complaint posts in each category, and rates how severe each one is. Everything after that runs on Modal, which groups the complaints into themes, saves the dataset to a Volume and serves the report page.)_
- `0002.png` (modal scene): Why Modal? This job runs once a month, so a laptop script would have to stay awake for it, and your own server would sit idle the rest of the time. Modal starts the pull on a cron schedule and keeps the xAI key in a Secret. A Volume stores the results, and a web endpoint serves the page at a public URL. Between runs it scales to zero, so you only pay for the seconds it works.  
  _(said: Why Modal? This job runs once a month, so a laptop script would have to stay awake for it, and your own server would sit idle the rest of the time. Modal starts the pull on a cron schedule and keeps the ex A I key in a Secret. A Volume stores the results, and a web endpoint serves the page at a public URL. Between runs it scales to zero, so you only pay for the seconds it works.)_
- `0003.png` (fanout scene): When it runs, one .map() call spreads the searches across containers, so the six-month backfill ran 30 searches in parallel and kept 704 posts.  
  _(said: When it runs, one dot map call spreads the searches across containers, so the six month backfill ran thirty searches in parallel and kept seven hundred and four posts.)_
- `0004.png`: In the real run, Devin built all of this from one plain-language prompt in the demo repo.
- `0005.png`: The workspace had already used all five of its scheduled functions, so Devin asked first. The schedule stayed in the code but switched off, and it hasn't run yet.
- `0006.png`: Then modal deploy created each function and gave the report its own modal.run URL.  
  _(said: Then modal deploy created each function and gave the report its own modal dot run URL.)_
- `0007.png`: Devin opened a pull request with the whole app and its tests.
- `0008.png`: The page running on Modal shows September's index at 44 out of 100 from 109 posts found, with six real months on the trend line.  
  _(said: The page running on Modal shows September's index at forty four out of a hundred from a hundred and nine posts found, with six real months on the trend line.)_
- `0009.png`: Each category lists its top themes and the loudest real posts behind them.
- `0010.png` (uses scene): You could extend it with alerts when a theme spikes and with drill-downs for a single tool. A weekly edition just needs a weekly schedule and shorter search windows, and the data.json route lets other sites embed the numbers.  
  _(said: You could extend it with alerts when a theme spikes and with drill downs for a single tool. A weekly edition just needs a weekly schedule and shorter search windows, and the data dot jason route lets other sites embed the numbers.)_
- outro: Real posts from X, turned into a monthly report you can cite.
