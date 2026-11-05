"""Build shots/ (curated, renumbered), shots/SOURCES.json and spec.js for Tutorial 102 from the raw capture.
usage: python3 tools/curate.py <raw-shots-dir>   (raw dir = the capture.mjs/act.mjs output with its beats.json)"""
import json, os, shutil, sys
VD = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.abspath(sys.argv[1]); OUT = os.path.join(VD, 'shots')
raw = {b['img']: b for b in json.load(open(os.path.join(RAW, 'beats.json')))}
SESSION = open(os.path.join(RAW, 'session.txt')).read().strip()
TOP = {'capPos': 'top', 'subPos': 'top'}
# (new name, raw shot or scene name, edit, what the shot proves)
PLAN = [
  ('0010.png', 'scene:hero', {'hold': 9.0, 'cursor': False,
    'vo': 'Devin can answer a data question with charts from a real dataset. You ask a business question in plain English, and you get back an interactive report you can explore.'}, None),
  ('0020.png', 'scene:ask', {'hold': 7.5,
    'vo': 'A good request names four things: the business question, the data to use, the rules for cleaning it, and what you want back.'}, None),
  ('0030.png', '0002.png', {'cursor': True, 'hold': 2.5, 'ring': True, 'ringFor': 4.5, 'subPos': 'bottom',
    'vo': 'Here, we ask what drove revenue for a UK online retailer, and when it should stock up for peak season, using the public UCI Online Retail II dataset.',
    'voSay': 'Here, we ask what drove revenue for a U K online retailer, and when it should stock up for peak season, using the public U C I Online Retail Two dataset.'},
    'Prompt typed in Agent mode on the thequantexplorer home page: business question, public UCI Online Retail II link, cleaning rule, HTML report deliverable'),
  ('0040.png', 'scene:work', {'hold': 9.0,
    'vo': "Devin works on its own machine, with a shell and Python. It downloads the data, cleans out cancellations and returns, analyzes it, and checks the totals."}, None),
  ('0050.png', '0016.png', {**TOP, 'hold': 2.5, 'ring': {'x': 643, 'y': 376, 'w': 680, 'h': 30}, 'ringFor': 3.5,
    'vo': 'You can follow every step in the session, starting with the download from the UCI archive.',
    'voSay': 'You can follow every step in the session, starting with the download from the U C I archive.'},
    'Live session downloading online+retail+ii.zip from archive.ics.uci.edu and loading it with pandas'),
  ('0060.png', '0050.png', {**TOP, 'hold': 2.5, 'ring': {'x': 733, 'y': 493, 'w': 852, 'h': 178}, 'ringFor': 4.5,
    'vo': 'Before it builds the page, Devin plans which charts to draw and which controls will make them interactive.'},
    "Devin's visible reasoning planning the report's charts and controls (metric selector, UK split toggle, seasonal tabs)"),
  ('0070.png', '0063.png', {**TOP, 'hold': 2.5, 'ring': {'x': 476, 'y': 619, 'w': 384, 'h': 34}, 'ringFor': 3.2,
    'vo': 'Then it opens the finished page in a browser and tests the chart controls.'},
    'Session running a Playwright script against the finished report; status "Testing report interactions and chart controls"'),
  ('0080.png', 'scene:report', {'hold': 6.5,
    'vo': 'The answer comes back as a single HTML report, with a summary, charts, and values you can hover over.'}, None),
  ('0090.png', '0067.png', {**TOP, 'hold': 2.5, 'ring': {'x': 732, 'y': 164, 'w': 836, 'h': 30}, 'ringFor': 4.0,
    'vo': 'Devin also writes up what it found: the UK made up 86 percent of sales, and the top tenth of customers brought in 64 percent.',
    'voSay': 'Devin also writes up what it found: the U K made up eighty-six percent of sales, and the top tenth of customers brought in sixty-four percent.'},
    "Devin's final message: net sales, what drove revenue, when to stock up"),
  ('0100.png', '0070.png', {**TOP, 'hold': 1.4, 'ring': {'x': 512, 'y': 410, 'w': 450, 'h': 340}, 'ringFor': 1.8,
    'vo': 'The report itself is attached right below the summary.'},
    'The attached online-retail-ii-report.html artifact card with its live preview, inline in the conversation'),
  ('0101.png', '0071.png', {**TOP, 'hold': 0.5}, 'Hovering the artifact card'),
  ('0102.png', '0072.png', {**TOP, 'hold': 1.2, 'vo': 'Open it, and the whole report expands beside the chat.'}, 'Clicking the card opens the report in the side panel'),
  ('0103.png', '0073.png', {**TOP, 'hold': 0.3}, 'Hovering Full width'),
  ('0104.png', '0074.png', {**TOP, 'hold': 0.9}, 'Full-width report: headline stat cards and summary written by Devin'),
  ('0150.png', '0089.png', {**TOP, 'hold': 1.6, 'ring': {'x': 549, 'y': 345, 'w': 822, 'h': 26}, 'ringFor': 2.6,
    'vo': 'The monthly chart shows both years peaking in November.'}, 'Monthly revenue chart in the report'),
  ('0151.png', '0090.png', {**TOP, 'hold': 1.6, 'vo': 'Hover a bar to see its exact revenue.'}, 'Hover tooltip on the Nov 10 bar (real interaction)'),
  ('0152.png', '0093.png', {**TOP, 'hold': 2.0, 'ring': {'x': 663, 'y': 387, 'w': 214, 'h': 30}, 'ringFor': 2.6,
    'vo': 'One switch splits UK sales from international sales.', 'voSay': 'One switch splits U K sales from international sales.'}, 'Split UK / international toggle turned on'),
  ('0180.png', '0098.png', {**TOP, 'hold': 1.6, 'vo': 'The seasonal view answers the stocking question.'}, 'Seasonal pattern chart, 2010 vs 2011 by month'),
  ('0181.png', '0100.png', {**TOP, 'hold': 2.0, 'ring': {'x': 1110, 'y': 370, 'w': 236, 'h': 262}, 'ringFor': 3.0,
    'vo': 'Weekly sales lift in the third week of September in both years.'}, '"By week" tab: shaded September to November weeks'),
  ('0182.png', '0103.png', {**TOP, 'hold': 2.0, 'ring': {'x': 591, 'y': 207, 'w': 124, 'h': 30}, 'ringFor': 2.6,
    'vo': 'And Christmas lines start climbing in August, so they should be in stock by then.'}, '"Christmas lines" tab: seasonal products rising from August'),
  ('0210.png', '0107.png', {**TOP, 'hold': 0.8, 'vo': 'The country chart can leave out the UK to compare the smaller markets.',
    'voSay': 'The country chart can leave out the U K to compare the smaller markets.'}, 'Top countries chart with the UK included'),
  ('0211.png', '0108.png', {**TOP, 'hold': 0.4}, 'Hovering the Include United Kingdom switch'),
  ('0212.png', '0109.png', {**TOP, 'hold': 2.2, 'ring': {'x': 262, 'y': 327, 'w': 232, 'h': 28}, 'ringFor': 2.2}, 'UK excluded: smaller markets rescaled'),
  ('0240.png', 'scene:recap', {'hold': 13.4, 'cursor': False,
    'vo': 'So one plain question became real data, a checked analysis, and a report with charts. You can ask a follow-up in the same session. And with your own database connected through MCP, the Data Analyst agent can answer questions on your data.',
    'voSay': 'So one plain question became real data, a checked analysis, and a report with charts. You can ask a follow-up in the same session. And with your own database connected through M C P, the Data Analyst agent can answer questions on your data.'}, None),
]
if os.path.isdir(OUT): shutil.rmtree(OUT)
os.makedirs(OUT)
beats, edit, sources = [], {}, []
for name, src, e, why in PLAN:
    if src.startswith('scene:'):
        open(os.path.join(OUT, name), 'wb').write(open(os.path.join(VD, 'tools', 'blank.png'), 'rb').read())
        beats.append({'img': name, 'cursor': False, 'capPos': 'bottom', 'hl': None, 'fade': 18})
        edit[name] = {'scene': src[6:], **e}
        sources.append({'img': name, 'kind': 'diagram', 'scene': src[6:], 'note': 'Diagram drawn by scenes.js; placeholder PNG only'})
    else:
        shutil.copy(os.path.join(RAW, src), os.path.join(OUT, name))
        b = {**raw[src], 'img': name}
        beats.append(b); edit[name] = e
        sources.append({'img': name, 'kind': 'real-ui', 'raw': src, 'org': 'thequantexplorer', 'session': SESSION,
                        'sessionTitle': 'dc102-Analyze Retail Revenue Seasonality', 'proves': why,
                        'captured': '2026-10-30 via capture.mjs / act.mjs (CDP, Chrome zoom 125%, account email masked)'})
json.dump(beats, open(os.path.join(OUT, 'beats.json'), 'w'), indent=0)
open(os.path.join(OUT, 'session.txt'), 'w').write(SESSION + '\n')
json.dump({'dataset': 'UCI Machine Learning Repository, Online Retail II (https://archive.ics.uci.edu/dataset/502/online+retail+ii), downloaded by Devin in the session',
           'docs': ['https://docs.devin.ai/work-with-devin/data-analyst.md'], 'shots': sources}, open(os.path.join(OUT, 'SOURCES.json'), 'w'), indent=1)
spec = {
  'title': 'Devin can answer data questions', 'subtitle': 'A business question on a real dataset becomes an interactive report',
  'outro': 'Ask Devin your next data question', 'voOutro': 'Bring Devin your next data question.', 'outroVoDelay': 0.0,
  'introHold': 0, 'pace': 1, 'speed': 3, 'capMin': 3, 'voSentGap': 0.45, 'maxZoom': 1.3, 'subPos': 'bottom',
  'noZoom': [['0010.png', '0240.png']], 'edit': edit}
s = json.dumps(spec, indent=1, ensure_ascii=False)
open(os.path.join(VD, 'spec.js'), 'w').write('window.SPEC = ' + s + ';\n')
print(len(beats), 'beats')
