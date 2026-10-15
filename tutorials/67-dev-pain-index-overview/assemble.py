# Builds shots/ for the overview: blank placeholders for scene beats, proof shots copied from tutorial 66.
import json, os, shutil, subprocess
T66 = '../66-dev-pain-index/shots'
SEQ = ['why', 'flow', 'fanout', 7, 140, 314, 195, 328, 331, 'uses']
b66 = {b['img']: b for b in json.load(open(f'{T66}/beats.json'))}
shutil.rmtree('shots', ignore_errors=True); os.makedirs('shots')
blank = 'shots/_blank.png'
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'lavfi', '-i', 'color=c=#0B0B0C:s=4320x2430', '-frames:v', '1', blank], check=True)
beats, src = [], {}
for i, item in enumerate(SEQ):
    name = f'{i:04d}.png'
    if isinstance(item, str):
        shutil.copy(blank, f'shots/{name}'); beats.append({'img': name, 'cur': {'x': 720, 'y': 405}, 'hold': 6})
        src[name] = {'scene': item, 'source': 'diagram drawn by scenes.js'}
    else:
        f = f'{item:04d}.png'; shutil.copy(f'{T66}/{f}', f'shots/{name}')
        b = {'img': name, 'cur': b66[f]['cur'], 'hold': 3}
        if isinstance(b66[f].get('hlBox'), dict): b['hlBox'] = {k: b66[f]['hlBox'][k] for k in 'xywh'}
        beats.append(b)
        src[name] = {'source': 'tutorial 66 (66-dev-pain-index), real capture in thequantexplorer', 'file': f'tutorials/66-dev-pain-index/shots/{f}', 'mark': b66[f].get('mark')}
os.remove(blank)
json.dump(beats, open('shots/beats.json', 'w'), indent=1)
json.dump(src, open('shots/SOURCES.json', 'w'), indent=1)
print(len(beats), 'beats')
