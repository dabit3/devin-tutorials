# Builds shots/ for the overview: blank #FCFCFC placeholders for diagram scenes, proof shots copied from tutorial 58.
#   python3 build_shots.py   (rewrites shots/, shots/beats.json and shots/SOURCES.json)
import json, os, shutil
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
T58 = os.path.join(HERE, '..', '58-ios-to-android-parity')
ORDER = ['idea', '0003.png', '0010.png', 'flow', '0033.png', '0045.png', 'why', '0046.png', 'usecases', 'setup', '0022.png']
src58 = {b['img']: b for b in json.load(open(os.path.join(T58, 'shots', 'beats.json')))}
out = os.path.join(HERE, 'shots'); shutil.rmtree(out, ignore_errors=True); os.makedirs(out)
beats, sources = [], {}
for i, x in enumerate(ORDER):
    img = f'{i:04d}.png'
    if x.endswith('.png'):
        b = src58[x]
        shutil.copy(os.path.join(T58, 'shots', x), os.path.join(out, img))
        beats.append({'img': img, 'cur': b.get('cur', {'x': 720, 'y': 600}), 'src': '58/' + x})
        sources[img] = {'source': 'tutorial 58-ios-to-android-parity', 'file': 'shots/' + x, 'capture': b['src'].replace('ios/', 'shots-ios/').replace('and/', 'shots-android2/'),
                        'org': 'thequantexplorer', 'zoom': 1.25}
    else:
        Image.new('RGB', (4320, 2430), '#FCFCFC').save(os.path.join(out, img))
        beats.append({'img': img, 'cur': {'x': 1300, 'y': 760}, 'scene': x})
        sources[img] = {'scene': x, 'source': 'diagram placeholder (blank #FCFCFC), drawn by scenes.js'}
json.dump(beats, open(os.path.join(out, 'beats.json'), 'w'), indent=1)
json.dump({'note': 'Every UI proof is a real capture from tutorial 58 (macOS session 6291d432, Ubuntu session 03b8eb40, thequantexplorer/product-demo-apps#79). No new captures.', 'shots': sources}, open(os.path.join(out, 'SOURCES.json'), 'w'), indent=1)
print(len(beats))
