# Builds shots/ for the overview: blank #FCFCFC placeholders for diagram scenes, real UI frames from this video's live capture.
#   python3 build_shots.py   (capture.mjs writes raw frames to shots/; move them to build/raw first; rewrites shots/, beats.json, SOURCES.json)
import json, os, shutil, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); RAW = os.path.join(HERE, 'build', 'raw')
SESSION = 'https://app.devin.ai/sessions/16bfae171d8145d494a3da9a81d1272d'
PR = 'https://github.com/thequantexplorer/product-demo-apps/pull/116'
ORDER = [('idea', None), ('roles', None),
         ('0002.png', 'Home composer, model picker open (Normal still selected), Fusion listed first'),
         ('0004.png', 'Fusion selected; its hover card in the web model picker'),
         ('0013.png', 'The task typed into the composer with the product-demo-apps repo mentioned, Fusion selected'),
         ('plan', None),
         ('0021.png', 'Running session: Tasks panel lists the four tasks under "sidekick" (1/4 done)'),
         ('0045.png', 'Session chat shows Devin’s own browser screenshot of the board (Review 2/1 in red, WIP toast); tasks 3/4'),
         ('0071.png', 'PR #116 open in the session’s PR tab'),
         ('0075.png', 'Session finished: 4/4 tasks done, final message about lint, build and Chrome testing'),
         ('why', None)]
out = os.path.join(HERE, 'shots'); shutil.rmtree(out, ignore_errors=True); os.makedirs(out)
raw = {b['img']: b for b in json.load(open(os.path.join(RAW, 'beats.json')))}
beats, sources = [], {}
for i, (x, note) in enumerate(ORDER):
    img = f'{i:04d}.png'
    if x.endswith('.png'):
        shutil.copy(os.path.join(RAW, x), os.path.join(out, img))
        beats.append({'img': img, 'cur': raw[x].get('cur', {'x': 720, 'y': 600})})
        sources[img] = {'kind': 'real-ui', 'source': 'new capture (capture.mjs)', 'raw_frame': x, 'org': 'thequantexplorer',
                        'session': SESSION, 'pr': PR, 'zoom': 1.25, 'masked': 'account email/name', 'note': note}
    else:
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', 'color=c=0xFCFCFC:s=4320x2430', '-frames:v', '1', os.path.join(out, img)], check=True)
        beats.append({'img': img, 'cur': {'x': 1300, 'y': 760}, 'scene': x})
        sources[img] = {'kind': 'animated-diagram', 'scene': x, 'source': 'diagram placeholder (blank #FCFCFC), drawn by scenes.js; claims from https://docs.devin.ai/cli/fusion'}
json.dump(beats, open(os.path.join(out, 'beats.json'), 'w'), indent=1)
json.dump({'note': 'Every UI shot is a real capture from one fresh Fusion session in the thequantexplorer org (session renamed dc107-Add Kanban WIP Limits), which opened thequantexplorer/product-demo-apps#116 from branch dc107-wip-limits. Diagrams are drawn by scenes.js and tagged DIAGRAM on screen.', 'shots': sources}, open(os.path.join(out, 'SOURCES.json'), 'w'), indent=1)
print(len(beats))
