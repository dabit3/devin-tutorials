import json
import math
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path('/home/ubuntu/work/aad-human')
qa = root / 'qa'
build = root / 'master-build'
timeline = json.loads((build / 'timeline.json').read_text())
voices = json.loads(Path('/home/ubuntu/repos/devin-tutorials/tutorials/45-gartner-aad/vo/T8iHhGIWPm2GVYpQD1Am/lines.json').read_text())
points = []
for line in timeline['lines']:
    for i, chunk in enumerate(voices[f"line{line['line']:02}-01.png"]['chunks'], 1):
        for label, offset in [('start', chunk['t0']), ('end', max(chunk['t0'], chunk['t1'] - .03))]:
            frame = line['startFrame'] + round(offset * 30)
            points.append(dict(line=line['line'], clause=i, label=label, text=chunk['text'], frame=frame, time=frame / 30))
frames = sorted(set(p['frame'] for p in points))
expression = '+'.join(f'eq(n,{n})' for n in frames)
subprocess.run(['ffmpeg', '-v', 'error', '-nostdin', '-y', '-threads', '1', '-i', str(root / '45-gartner-aad-human-master.mp4'), '-an', '-vf', f"select='{expression}',scale=1280:720", '-vsync', '0', '-threads', '1', str(qa / 'human-clause-frame-%04d.png')], check=True)
images = {frame: str(qa / f'human-clause-frame-{i+1:04}.png') for i, frame in enumerate(frames)}
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 21)
for n in range(1, 52):
    selected = [p for p in points if p['line'] == n]
    sheet = Image.new('RGB', (2560, math.ceil(len(selected)/2)*770), 'white')
    draw = ImageDraw.Draw(sheet)
    for i, p in enumerate(selected):
        p['image'] = images[p['frame']]
        x, y = i%2*1280, i//2*770
        draw.text((x+4, y), f"L{n} clause{p['clause']} {p['label']} @ {p['time']:.3f}s", fill='black', font=font)
        draw.text((x+4, y+24), p['text'][:100], fill='black', font=font)
        with Image.open(p['image']) as source:
            sheet.paste(source, (x,y+50))
    sheet.save(qa / f'human-clause-line{n:02}.jpg', quality=95)
(build / 'final-clause-points.json').write_text(json.dumps(points, indent=2)+'\n')
print(f'EXTRACTED {len(frames)} unique final-file clause frames; {len(points)} clause boundary references; 51 review sheets.')
