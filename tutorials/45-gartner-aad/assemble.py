"""Assemble only the final script's tagged stills, with equal-duration cuts per line."""
import json
import math
from pathlib import Path
import re
import shutil

HERE = Path(__file__).resolve().parent
VOICE = 'T8iHhGIWPm2GVYpQD1Am'
source = (HERE / 'script.md').read_text()
captured = {b['id']: b for b in json.loads((HERE / 'shots/production-beats.json').read_text())}
voice_path = HERE / 'vo' / VOICE / 'lines.json'
voice = json.loads(voice_path.read_text()) if voice_path.exists() else {}
titles = ['Assisted development', 'Connect and index', 'Issue to spec', 'Split the work',
          'Interrupt and steer', 'Move to the cloud', 'Customize the harness',
          'Artifacts and testing', 'Review and merge', 'Cost and governance', 'One surface']
beats, edits, cards, lines = [], {}, [], []
section = 0
for row in source.splitlines():
    heading = re.match(r'^## (\d+)\. (.+)$', row)
    if heading:
        section = int(heading[1])
        assert section == len(cards) + 1
        name = f'section{section:02d}'
        key = name + '.png'
        cards.append({'scene': name, 'heading': heading[2], 'title': titles[section - 1], 'seconds': 2.5})
        beats.append({'img': key, 'scene': name, 'hold': 2.5, 'cursor': False, 'waitVo': True, 'fade': 0})
        edits[key] = {'scene': name, 'hold': 2.5, 'cursor': False, 'waitVo': True, 'fade': 0}
        continue
    match = re.match(r'^(\d+)\. \[([^]]+)\] (.+)$', row)
    if not match:
        continue
    number, tags, text = int(match[1]), [s.strip() for s in match[2].split(',')], match[3]
    assert number == len(lines) + 1
    first = f'line{number:02d}-01.png'
    duration = voice.get(first, {}).get('dur', 5)
    frames = math.ceil((duration + 0.3) * 60 / len(tags))
    hold = frames / 60
    parts = []
    for part, tag in enumerate(tags, 1):
        raw = captured[tag]
        key = f'line{number:02d}-{part:02d}.png'
        shutil.copyfile(HERE / 'shots' / raw['img'], HERE / 'shots' / key)
        box = raw.get('hlBox') or raw['ring']
        assert all(isinstance(box[k], (int, float)) for k in ('x', 'y', 'w', 'h'))
        assert box['w'] > 0 and box['h'] > 0
        cursor = {'x': min(1420, box['x'] + box['w'] * 0.35),
                  'y': min(790, box['y'] + box['h'] * 0.2)}
        beat = {'img': key, 'id': tag, 'source': raw['img'], 'line': number,
                'kind': 'hover', 'travel': 0, 'dwell': hold, 'hold': hold, 'fade': 0,
                'cursor': True, 'cur': cursor, 'target': cursor, 'hlBox': box,
                'hl': True, 'hlDelay': 0.12, 'camera': 'steady'}
        edit = {'line': number, 'hold': hold, 'cursor': True, 'hl': True,
                'hlDelay': 0.12, 'fade': 0}
        if part == 1:
            edit['vo'] = text
        beats.append(beat)
        edits[key] = edit
        parts.append({'img': key, 'id': tag, 'source': raw['img'], 'frames': frames,
                      'highlight': box, 'cursor': cursor})
    lines.append({'line': number, 'section': section, 'text': text, 'vo': first,
                  'voiceSeconds': duration, 'parts': parts})

assert len(lines) == 51 and len(cards) == 11
if voice:
    assert set(voice) == {line['vo'] for line in lines}
spec = {'title': '', 'subtitle': '', 'introHold': 0, 'tailHold': 0,
        'outro': 'Devin, by Cognition', 'outroSub': 'devin.ai  ·  cognition.com',
        'speed': 1, 'pace': 1, 'maxZoom': 1, 'voSentGap': 0.3, 'voNatural': False,
        'noSubs': True, 'noCaps': True, 'edit': edits}
(HERE / 'shots/beats.json').write_text(json.dumps(beats, indent=1) + '\n')
(HERE / 'spec.js').write_text('window.SPEC = ' + json.dumps(spec, indent=1) + ';\n')
(HERE / 'cards.json').write_text(json.dumps(cards, indent=1) + '\n')
(HERE / 'film-lines.json').write_text(json.dumps(lines, indent=1) + '\n')
(HERE / 'voice-script.md').write_text('# Final narration — 51 lines\n\n' + '\n\n'.join(l['text'] for l in lines) + '\n')
scenes = ['window.SCENES = {};']
for i, card in enumerate(cards, 1):
    scenes.append('window.SCENES[' + json.dumps(card['scene']) + '''] = (ctx, s, k) => {
 ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
 ctx.fillStyle = '#777'; k.font(17, 500);
 ctx.fillText(''' + json.dumps(f'{i:02d} / 11') + ''', k.VW / 2, 348);
 ctx.fillStyle = k.INK; k.font(43, 600);
 ctx.fillText(''' + json.dumps(card['title']) + ''', k.VW / 2, 408);
 ctx.restore();
};''')
(HERE / 'scenes.js').write_text('\n'.join(scenes) + '\n')
print(f'{len(lines)} narration lines; {len(cards)} cards; {sum(len(l["parts"]) for l in lines)} tagged cuts; {sum(len(l["text"].split()) for l in lines)} words')
if voice:
    seconds = sum(sum(p['frames'] for p in l['parts']) / 60 for l in lines) + 2.5 * len(cards) + 3.6
    assert seconds <= 540, f'Film exceeds nine minutes: {seconds:.3f}s'
    print(f'Expected duration: {seconds:.3f}s including section cards and kit outro')
