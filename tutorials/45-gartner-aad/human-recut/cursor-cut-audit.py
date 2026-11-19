import json
from pathlib import Path
import struct

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy.signal import fftconvolve

ROOT = Path('/home/ubuntu/work/aad-human')
BUILD = ROOT / 'master-build'
QA = ROOT / 'qa'


def main():
    data = Path('/usr/share/icons/breeze_cursors/cursors/left_ptr').read_bytes()
    _, _, _, count = struct.unpack_from('<4I', data)
    templates = []
    for i in range(count):
        kind, size, pos = struct.unpack_from('<3I', data, 16+12*i)
        if kind != 0xfffd0002:
            continue
        header, _, _, _, w, h, hx, hy, _ = struct.unpack_from('<9I', data, pos)
        pixels = np.frombuffer(data[pos+header:pos+header+w*h*4], '<u4').reshape(h, w)
        rgba = np.stack([(pixels>>16)&255, (pixels>>8)&255, pixels&255, pixels>>24], -1).astype('uint8')
        image = Image.fromarray(rgba).resize((w//2, h//2), Image.Resampling.NEAREST)
        t = np.array(image)
        opaque = t[:,:,3] > 250
        black = opaque & (t[:,:,0] < 50)
        white = opaque & (t[:,:,0] > 200)
        kernel = black.astype('float32') - white.astype('float32')
        templates.append((kernel, int(white.sum()), int(black.sum()+white.sum()), (hx/2,hy/2),size))
    points = json.loads((BUILD / 'qa-points.json').read_text())
    cache = {}
    def find(file):
        if file in cache:
            return cache[file]
        with Image.open(file) as source:
            arr = np.array(source.convert('L').resize((1920,1080),Image.Resampling.BOX),dtype='float32')
        candidates=[]
        for kernel, whites, total, hot, size in templates:
            error=(whites*255 + fftconvolve(arr,kernel[::-1,::-1],mode='valid'))/(total*255)
            y,x=np.unravel_index(np.argmin(error),error.shape)
            candidates.append({'error':float(error[y,x]),'x':float((x+hot[0])*2),'y':float((y+hot[1])*2),'size':size})
        best=min(candidates,key=lambda c:c['error'])
        cache[file]=best
        return best
    rows=[]
    for i,cut in enumerate(points['cuts']):
        if not cut['sameWindow']:
            continue
        before,after=find(cut['before']),find(cut['after'])
        distance=((before['x']-after['x'])**2+(before['y']-after['y'])**2)**.5
        rows.append({**cut,'beforeCursor':before,'afterCursor':after,'distance':distance,
                     'needsReview':distance>10 or max(before['error'],after['error'])>.12})
    (BUILD / 'cursor-cut-audit.json').write_text(json.dumps(rows,indent=2)+'\n')
    font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',20)
    for i in range(0,len(rows),4):
        sheet=Image.new('RGB',(1600,4*500),'white')
        draw=ImageDraw.Draw(sheet)
        for j,row in enumerate(rows[i:i+4]):
            for k,key in enumerate(['before','after']):
                with Image.open(row[key]) as source:
                    thumb=source.convert('RGB').resize((800,450),Image.Resampling.LANCZOS)
                sheet.paste(thumb,(k*800,j*500+45))
            draw.text((5,j*500+2),f'{row["time"]:.3f}s: {row["from"]} -> {row["to"]}; pointer delta {row["distance"]:.0f}px',font=font,fill='black')
        sheet.save(QA / f'human-cut-sheet-{i//4+1:02}.jpg',quality=94)
    print(json.dumps(rows,indent=2),flush=True)


if __name__ == '__main__':
    main()
