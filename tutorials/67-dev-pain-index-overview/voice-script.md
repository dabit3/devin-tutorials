# 67 · The Developer Pain Index: voice script

Nader voice (`T8iHhGIWPm2GVYpQD1Am`), one whole-script take. Beat → line (spoken form in brackets where it differs).

- `0000.png` (why scene): Developers complain on X every day about their tools, their cloud bills and the job market, but nobody adds it up. The Developer Pain Index turns those posts into a monthly report you can cite, with every chart showing its sample size and dates.
- `0001.png` (flow scene): Each month, Grok searches X through the xAI API to find complaint posts for each category, and rates how severe each one is. Modal functions group similar complaints into themes and save the dataset to a Volume, and a web endpoint serves the report page.  
  _(said: Each month, Grok searches X through the ex A I A P I to find complaint posts for each category, and rates how severe each one is. Modal functions group similar complaints into themes and save the dataset to a Volume, and a web endpoint serves the report page.)_
- `0002.png` (fanout scene): The refresh function fans out with .map(), so every category and month runs at once, and the six-month backfill was 30 searches that kept 704 posts.  
  _(said: The refresh function fans out with dot map, so every category and month runs at once, and the six month backfill was thirty searches that kept seven hundred and four posts.)_
- `0003.png`: In the real run, Devin built all of this from one plain-language prompt in the demo repo.
- `0004.png`: When Modal's scheduled-function limit blocked the cron, Devin asked before touching anything, so the schedule stayed in the code but switched off.
- `0005.png`: Then modal deploy created each function and gave the report its own modal.run URL.  
  _(said: Then modal deploy created each function and gave the report its own modal dot run URL.)_
- `0006.png`: Devin opened a pull request with the whole app and its tests.
- `0007.png`: The deployed report shows September's index at 44 out of 100 from 109 posts, with six real months on the trend line.  
  _(said: The deployed report shows September's index at forty four out of a hundred from a hundred and nine posts, with six real months on the trend line.)_
- `0008.png`: Each category lists its top themes and the loudest real posts behind them.
- `0009.png` (uses scene): You could extend it with alerts when a theme spikes and with drill-downs for a single tool. A weekly edition just needs a weekly schedule and shorter search windows, and the data.json route lets other sites embed the numbers.  
  _(said: You could extend it with alerts when a theme spikes and with drill downs for a single tool. A weekly edition just needs a weekly schedule and shorter search windows, and the data dot jason route lets other sites embed the numbers.)_
- outro: Real posts from X, turned into a monthly report you can cite.
