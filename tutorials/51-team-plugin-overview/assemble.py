"""Builds shots/ for the overview: blank placeholders for diagram scenes, real proof shots copied from tutorial 50.
usage: python3 assemble.py   (from this folder; needs ffmpeg on PATH or FFMPEG=...)"""
import json, os, shutil, subprocess
D = os.path.dirname(os.path.abspath(__file__)); SRC = os.path.join(D, '..', '50-team-plugin', 'shots'); OUT = os.path.join(D, 'shots')
FF = os.environ.get('FFMPEG', 'ffmpeg')
src_beats = json.load(open(os.path.join(SRC, 'beats.json')))
PLAN = [  # (scene name) or (tutorial 50 shot, what it proves)
    ('intro',), (83, 'Source tab: the plugin as plain files'),
    ('scope',), (84, 'Customize > Plugins > Organization: Orbit Team, required'), (260, 'devin plugins list in the real Devin CLI'),
    ('parts',), (103, 'Cloud session: injected rule and activated skill'), (234, 'PR #48: How I tested section from the skill'), (311, 'Devin CLI: the hook rejects a force-push'),
    ('uses',),
]
# Source tab file tree, measured on 50-team-plugin/shots/0083.png (centre x/y, 1440x810 UI coords)
BOX = {83: {'x': 315, 'y': 380, 'w': 290, 'h': 315, 'text': ''}}
os.makedirs(OUT, exist_ok=True)
blank = os.path.join(OUT, '_blank.png')
subprocess.run([FF, '-loglevel', 'error', '-y', '-f', 'lavfi', '-i', 'color=c=0xFCFCFC:s=4320x2430', '-frames:v', '1', blank], check=True)
beats, sources = [], {}
for n, item in enumerate(PLAN):
    img = '%04d.png' % n
    if isinstance(item[0], str):
        shutil.copy(blank, os.path.join(OUT, img)); beats.append({'img': img, 'cur': {'x': 1250, 'y': 700}, 'hold': 1.2})
        sources[img] = {'scene': item[0], 'source': 'diagram placeholder (blank #FCFCFC), drawn by scenes.js'}
    else:
        b = dict(src_beats[item[0]]); f = b['img']
        shutil.copy(os.path.join(SRC, f), os.path.join(OUT, img))
        row = {'img': img, 'cur': b.get('cur', {'x': 1250, 'y': 700}), 'hold': 1.2}
        if b.get('hlBox'): row['hlBox'] = b['hlBox']
        if item[0] in BOX: row['hlBox'] = BOX[item[0]]
        beats.append(row)
        sources[img] = {'source': 'tutorial 50-team-plugin', 'file': '50-team-plugin/shots/' + f, 'org': 'thequantexplorer', 'zoom': 1.25, 'shows': item[1]}
os.remove(blank)
json.dump(beats, open(os.path.join(OUT, 'beats.json'), 'w'), indent=1)
json.dump({'note': 'Every UI shot is a real capture from tutorial 50 (thequantexplorer org, ZOOM=1.25, light mode). Diagram beats are blank placeholders drawn by scenes.js.', 'shots': sources}, open(os.path.join(OUT, 'SOURCES.json'), 'w'), indent=1)
print(len(beats), 'beats')
