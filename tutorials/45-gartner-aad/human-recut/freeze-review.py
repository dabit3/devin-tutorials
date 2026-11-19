import json
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root=Path('/home/ubuntu/work/aad-human')
qa=root/'qa'
build=root/'master-build'
scan=json.loads((build/'qa-results.json').read_text())
frames=sorted(set(round((x['start']+x['end'])/2*30) for x in scan['freezesOver3s']))
expression='+'.join(f'eq(n,{n})' for n in frames)
subprocess.run(['ffmpeg','-v','error','-nostdin','-y','-threads','1','-i',str(root/'45-gartner-aad-human-master.mp4'),'-an','-vf',f"select='{expression}',scale=1280:720",'-vsync','0','-threads','1',str(qa/'human-freeze-%03d.png')],check=True)
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',22)
for page in range((len(frames)+7)//8):
    sheet=Image.new('RGB',(2560,4*760),'white')
    draw=ImageDraw.Draw(sheet)
    for j,freeze in enumerate(scan['freezesOver3s'][page*8:page*8+8]):
        i=page*8+j
        x,y=j%2*1280,j//2*760
        draw.text((x+5,y+5),f"Freeze {i+1}: {freeze['start']:.3f}–{freeze['end']:.3f} L{freeze['lines']}",fill='black',font=font)
        with Image.open(qa/f'human-freeze-{i+1:03}.png') as source:sheet.paste(source,(x,y+40))
    sheet.save(qa/f'human-freeze-sheet-{page+1:02}.jpg',quality=95)
print(f"EXTRACTED {len(frames)} detected-hold midpoint frames; {(len(frames)+7)//8} review sheets")
