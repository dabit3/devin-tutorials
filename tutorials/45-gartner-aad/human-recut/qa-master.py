import json
import re
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path('/home/ubuntu/work/aad-human')
BUILD = ROOT / 'master-build'
QA = ROOT / 'qa'
MASTER = ROOT / '45-gartner-aad-human-master.mp4'


def run(args, **kwargs):
    return subprocess.run([str(a) for a in args], check=True, **kwargs)


def main():
    timeline = json.loads((BUILD / 'timeline.json').read_text())
    probe = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_format', '-show_streams', '-of', 'json', str(MASTER)]))
    (BUILD / 'master-ffprobe.json').write_text(json.dumps(probe, indent=2) + '\n')
    video, audio = probe['streams']
    assert video['codec_name'] == 'h264' and video['pix_fmt'] == 'yuv420p'
    assert (video['width'], video['height'], video['r_frame_rate']) == (3840, 2160, '30/1')
    assert int(video['nb_frames']) == timeline['frames']
    assert audio['codec_name'] == 'aac' and audio['sample_rate'] == '48000'
    assert abs(float(probe['format']['duration']) - timeline['seconds']) < .05
    assert float(probe['format']['duration']) <= 540
    points, gates, cuts = set(), [], []
    for line in timeline['lines']:
        start = line['startFrame']
        for label, offset in [('start', .3), ('middle', line['voiceSeconds']/2), ('end', line['voiceSeconds']-.3)]:
            frame = start + round(offset * 30)
            points.add(frame)
            gates.append({'line': line['line'], 'label': label, 'frame': frame, 'time': frame/30,
                          'image': str(QA / f'human-line{line["line"]:02}-{label}.png')})
    clips = [c for l in timeline['lines'] for c in l['clips']]
    for previous, current in zip(clips, clips[1:]):
        frame = current['masterStartFrame']
        assert previous['masterStartFrame'] + previous['frames'] == frame
        points.update([frame-1, frame])
        cuts.append({'frame': frame, 'time': frame/30, 'from': previous['stem'], 'to': current['stem'],
                     'sameWindow': previous['window'] == current['window'],
                     'before': str(QA / f'human-cut{frame:05}-before.png'),
                     'after': str(QA / f'human-cut{frame:05}-after.png')})
    ordered = sorted(points)
    (BUILD / 'qa-points.json').write_text(json.dumps({'gates': gates, 'cuts': cuts, 'extractedFrames': ordered}, indent=2)+'\n')
    expression = '+'.join(f'eq(n,{n})' for n in ordered)
    vf = f"blackdetect=d=0.05:pix_th=0.10,freezedetect=n=-60dB:d=3,select='{expression}'"
    with (BUILD / 'black-freeze-scan.log').open('w') as log:
        run(['ffmpeg', '-hide_banner', '-nostdin', '-y', '-threads', '1', '-i', MASTER,
             '-map', '0:v:0', '-an', '-vf', vf, '-vsync', '0', '-threads', '1',
             QA / 'human-frame-%04d.png'], stdout=subprocess.DEVNULL, stderr=log)
    images = {frame: QA / f'human-frame-{i+1:04}.png' for i, frame in enumerate(ordered)}
    for gate in gates:
        Path(gate['image']).write_bytes(images[gate['frame']].read_bytes())
    for cut in cuts:
        for label, frame in [('before', cut['frame']-1), ('after', cut['frame'])]:
            Path(cut[label]).write_bytes(images[frame].read_bytes())
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 22)
    sheet = Image.new('RGB', (5*640, 11*390), 'white')
    draw = ImageDraw.Draw(sheet)
    for i, line in enumerate(timeline['lines']):
        with Image.open(QA / f'human-line{line["line"]:02}-middle.png') as source:
            thumb = source.convert('RGB').resize((640, 360), Image.Resampling.LANCZOS)
        x, y = i%5*640, i//5*390
        sheet.paste(thumb, (x, y+30))
        draw.text((x+8, y+2), f'Line {line["line"]:02} / section {line["section"]:02}', fill='black', font=font)
    sheet.save(QA / 'human-contact-sheet.jpg', quality=94)
    log = (BUILD / 'black-freeze-scan.log').read_text()
    freezes, pending = [], None
    for row in log.splitlines():
        match = re.search(r'lavfi.freezedetect.freeze_start: ([\d.]+)', row)
        if match: pending = float(match[1])
        match = re.search(r'lavfi.freezedetect.freeze_end: ([\d.]+)', row)
        if match:
            end = float(match[1])
            freezes.append({'start': pending, 'end': end, 'duration': end-pending})
            pending = None
    if pending is not None:
        freezes.append({'start': pending, 'end': timeline['seconds'], 'duration': timeline['seconds']-pending})
    for freeze in freezes:
        freeze['lines'] = [line['line'] for line in timeline['lines'] if line['startFrame']/30 < freeze['end'] and (line['startFrame']+line['voiceFrames']+line['gapFrames'])/30 > freeze['start']]
    black = [row for row in log.splitlines() if 'black_start:' in row]
    report = {'duration': probe['format']['duration'], 'resolution': '3840x2160', 'fps': '30/1',
              'videoFrames': video['nb_frames'], 'videoCodec': video['codec_name'], 'audioCodec': audio['codec_name'],
              'audioSampleRate': audio['sample_rate'], 'blackIntervals': black, 'freezesOver3s': freezes,
              'gateImages': len(gates), 'cutPairs': len(cuts), 'status': 'awaiting-personal-final-frame-and-cut-review'}
    (BUILD / 'qa-results.json').write_text(json.dumps(report, indent=2)+'\n')
    print(json.dumps(report, indent=2), flush=True)


if __name__ == '__main__':
    main()
