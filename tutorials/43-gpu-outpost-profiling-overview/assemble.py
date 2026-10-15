# Builds shots/ for the overview: blank placeholders for scene beats, proof shots copied from tutorial 42.
import json, os, shutil, subprocess
T42 = '../42-gpu-outpost-profiling/shots'
SEQ = ['pain', 'flow', 42 * 0 + 17, 61, 66, 'loop', 96, 103, 104, 'uses']
b42 = {b['img']: b for b in json.load(open(f'{T42}/beats.json'))}
shutil.rmtree('shots', ignore_errors=True); os.makedirs('shots')
blank = 'shots/_blank.png'
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'lavfi', '-i', 'color=c=#FCFCFC:s=4320x2430', '-frames:v', '1', blank], check=True)
beats, src = [], {}
for i, item in enumerate(SEQ):
    name = f'{i:04d}.png'
    if isinstance(item, str):
        shutil.copy(blank, f'shots/{name}'); beats.append({'img': name, 'cur': {'x': 720, 'y': 405}, 'hold': 6})
        src[name] = {'scene': item, 'source': 'diagram drawn by scenes.js'}
    else:
        f = f'{item:04d}.png'; shutil.copy(f'{T42}/{f}', f'shots/{name}')
        b = {'img': name, 'cur': b42[f]['cur'], 'hold': 3}
        if 'hlBox' in b42[f]: b['hlBox'] = {k: b42[f]['hlBox'][k] for k in 'xywh'}
        beats.append(b)
        src[name] = {'source': 'tutorial 42 (42-gpu-outpost-profiling), real capture in thequantexplorer', 'file': f'tutorials/42-gpu-outpost-profiling/shots/{f}', 'raw': b42[f].get('src')}
os.remove(blank)
json.dump(beats, open('shots/beats.json', 'w'), indent=1)
json.dump(src, open('shots/SOURCES.json', 'w'), indent=1)
print(len(beats), 'beats')
