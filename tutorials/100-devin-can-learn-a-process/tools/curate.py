"""Pick the beats used in the film from the raw live capture (raw/, not committed) into shots/ with fresh numbering.
Scene beats get a blank #FCFCFC placeholder that scenes.js draws over. Writes shots/beats.json and prints raw -> shot."""
import json, os, shutil, subprocess
VD = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW, OUT = os.path.join(VD, 'raw'), os.path.join(VD, 'shots')
raw = json.load(open(os.path.join(RAW, 'beats.json')))
R = lambda a, b: list(range(a, b + 1))
PLAN = ['title', 'chore', *R(0, 7), 9, 12, 15, 18, 21, 24, 32, *R(33, 38), *R(44, 50), 55, 58, 61, 64, *R(65, 67), 72,
        *R(73, 76), *R(98, 109), 112, 114, 117, 120, 123, 'reuse']
os.makedirs(OUT, exist_ok=True)
for f in os.listdir(OUT):
    if f.endswith('.png') or f == 'beats.json': os.remove(os.path.join(OUT, f))
size = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'stream=width,height', '-of', 'csv=p=0:s=x', os.path.join(RAW, raw[0]['img'])], capture_output=True, text=True, check=True).stdout.strip()
blank = os.path.join(RAW, '_blank.png')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', f'color=c=0xFCFCFC:s={size}', '-frames:v', '1', blank], check=True)
beats = []
for n, src in enumerate(PLAN):
    img = f'{n:04d}.png'
    if isinstance(src, str):
        shutil.copy(blank, os.path.join(OUT, img)); beats.append({'img': img, 'cur': {'x': 720, 'y': 600}, 'hold': 1})
        print(img, 'scene', src)
    else:
        b = dict(raw[src]); shutil.copy(os.path.join(RAW, b['img']), os.path.join(OUT, img)); b['raw'] = b['img']; b['img'] = img; beats.append(b)
        print(img, b['raw'], b.get('mark') or '', b.get('kind') or '')
json.dump(beats, open(os.path.join(OUT, 'beats.json'), 'w'), indent=1)
