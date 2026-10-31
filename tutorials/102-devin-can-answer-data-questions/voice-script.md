# Voice script: Devin can answer data questions

Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, model from `_kit/settings.json`), recorded as one take with `_kit/tools/vo.py` and cut into lines.

**0010.png** (diagram: hero)  
Devin can answer a data question with charts from a real dataset. You ask a business question in plain English, and you get back an interactive report you can explore.

**0020.png** (diagram: ask)  
A good request names four things: the business question, the data to use, the rules for cleaning it, and what you want back.

**0030.png** (real UI)  
Here, we ask what drove revenue for a UK online retailer, and when it should stock up for peak season, using the public UCI Online Retail II dataset.

**0040.png** (diagram: work)  
Devin works on its own machine, with a shell and Python. It downloads the data, cleans out cancellations and returns, analyzes it, and checks the totals.

**0050.png** (real UI)  
You can follow every step in the session, starting with the download from the UCI archive.

**0060.png** (real UI)  
Before it builds the page, Devin plans which charts to draw and which controls will make them interactive.

**0070.png** (real UI)  
Then it opens the finished page in a browser and tests the chart controls.

**0080.png** (diagram: report)  
The answer comes back as a single HTML report, with a summary, charts, and values you can hover over.

**0090.png** (real UI)  
Devin also writes up what it found: the UK made up 86 percent of sales, and the top tenth of customers brought in 64 percent.

**0100.png** (real UI)  
The report itself is attached right below the summary.

**0102.png** (real UI)  
Open it, and the whole report expands beside the chat.

**0150.png** (real UI)  
The monthly chart shows both years peaking in November.

**0151.png** (real UI)  
Hover a bar to see its exact revenue.

**0152.png** (real UI)  
One switch splits UK sales from international sales.

**0180.png** (real UI)  
The seasonal view answers the stocking question.

**0181.png** (real UI)  
Weekly sales lift in the third week of September in both years.

**0182.png** (real UI)  
And Christmas lines start climbing in August, so they should be in stock by then.

**0210.png** (real UI)  
The country chart can leave out the UK to compare the smaller markets.

**0240.png** (diagram: recap)  
So one plain question became real data, a checked analysis, and a report with charts. You can ask a follow-up in the same session. And with your own database connected through MCP, the Data Analyst agent can answer questions on your data.

**outro**  
Bring Devin your next data question.
