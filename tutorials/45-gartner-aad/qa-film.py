"""Privacy scan source stills or sample the encoded master at every narration midpoint."""
import csv
import io
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import textwrap

from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
lines = json.loads((HERE / 'film-lines.json').read_text())
qa = HERE / 'qa'
qa.mkdir(exist_ok=True)
if sys.argv[1] == 'sources':
    binary = os.environ.get('OCR_BIN') or shutil.which('tesseract')
    if not binary:
        raise SystemExit('Set OCR_BIN to an installed Tesseract binary')
    masks = {}
    for source in sorted({p['source'] for line in lines for p in line['parts']}):
        image = Image.open(HERE / 'shots' / source).convert('RGB')
        full = image.width
        image.thumbnail((1920, 1080))
        data = io.BytesIO()
        image.save(data, format='PNG')
        result = subprocess.run([binary, 'stdin', 'stdout', '--psm', '11', '--dpi', '144', '-l', 'eng', 'tsv'],
                                input=data.getvalue(), capture_output=True, check=True)
        boxes = []
        scale = full / image.width
        for word in csv.DictReader(io.StringIO(result.stdout.decode()), delimiter='\t'):
            if re.search(r'eigen|gma[i1l]{1,2}\.?com', word.get('text', ''), re.I):
                boxes.append({k: round(int(word[k]) * scale) for k in ('left', 'top', 'width', 'height')})
        if boxes:
            masks[source] = boxes
        print(f'OCR {source}: {len(boxes)} privacy regions', flush=True)
    (HERE / 'email-masks.json').write_text(json.dumps(masks, indent=1) + '\n')
    print(f'PASS: scanned all {len({p["source"] for l in lines for p in l["parts"]})} unique film sources; {len(masks)} sources need masking')
elif sys.argv[1] == 'frames':
    master = HERE / '45-gartner-aad-master.mp4'
    cues = json.loads((HERE / 'build/cues.json').read_text())
    starts = {v['file']: v['t'] / cues['fps'] for v in cues['vo']}
    manifest = []
    for line in lines:
        middle = starts[line['vo']] + line['voiceSeconds'] / 2
        path = qa / f'line{line["line"]:02d}.png'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(middle), '-i', str(master),
                        '-frames:v', '1', str(path)], check=True)
        manifest.append({'line': line['line'], 'seconds': round(middle, 4), 'frame': path.name,
                         'text': line['text'], 'beats': [p['id'] for p in line['parts']]})
    font = ImageFont.truetype('DejaVuSans.ttf', 28)
    title = ImageFont.truetype('DejaVuSans.ttf', 34)
    for page, start in enumerate(range(0, len(manifest), 4), 1):
        sheet = Image.new('RGB', (3840, 2460), '#eeeeee')
        draw = ImageDraw.Draw(sheet)
        for i, item in enumerate(manifest[start:start + 4]):
            x, y = i % 2 * 1920, i // 2 * 1230
            image = Image.open(qa / item['frame']).convert('RGB').resize((1920, 1080), Image.Resampling.LANCZOS)
            sheet.paste(image, (x, y + 150))
            draw.text((x + 15, y + 8), f'LINE {item["line"]:02d} — {item["seconds"]:.3f}s', font=title, fill='black')
            for row, text in enumerate(textwrap.wrap(item['text'], width=115)[:3]):
                draw.text((x + 15, y + 52 + row * 30), text, font=font, fill='black')
        sheet.save(qa / f'contact-sheet-{page:02d}.jpg', quality=95)
    overview = Image.new('RGB', (2560, 13 * 390), 'white')
    draw = ImageDraw.Draw(overview)
    for i, item in enumerate(manifest):
        x, y = i % 4 * 640, i // 4 * 390
        image = Image.open(qa / item['frame']).convert('RGB').resize((640, 360), Image.Resampling.LANCZOS)
        overview.paste(image, (x, y + 30))
        draw.text((x + 10, y), f'Line {item["line"]:02d}', font=font, fill='black')
    overview.save(qa / 'contact-sheet.jpg', quality=95)
    (qa / 'samples.json').write_text(json.dumps(manifest, indent=1) + '\n')
    print('PASS: extracted 51 encoded-master narration midpoint frames; wrote overview and 13 detailed contact sheets')
else:
    raise SystemExit('usage: python3 qa-film.py sources|frames')
