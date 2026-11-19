"""Compare every detected-hold frame with its native-speed source frame."""
import json
import subprocess
from pathlib import Path

import numpy as np

ROOT = Path('/home/ubuntu/work/aad-human')
BUILD = ROOT / 'master-build'
timeline = json.loads((BUILD / 'timeline.json').read_text())
qa = json.loads((BUILD / 'qa-results.json').read_text())
clips = [clip for line in timeline['lines'] for clip in line['clips']]


def decode(path, first, count):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-threads', '1',
        '-ss', str(first / 30), '-i', str(path), '-an', '-frames:v', str(count),
        '-vf', 'scale=320:180,format=gray', '-threads', '1', '-f', 'rawvideo', '-'])
    frames = np.frombuffer(raw, dtype=np.uint8).reshape(-1, 180, 320)
    assert len(frames) == count, (path, first, count, len(frames))
    return frames


results = []
for index, freeze in enumerate(qa['freezesOver3s'], 1):
    first = round(freeze['start'] * 30)
    last = round(freeze['end'] * 30)
    pieces = []
    for clip in clips:
        start = max(first, clip['masterStartFrame'])
        end = min(last, clip['masterStartFrame'] + clip['frames'])
        if end <= start:
            continue
        source_start = clip['sourceStartFrame'] + start - clip['masterStartFrame']
        source = decode(clip['video'], source_start, end - start)
        master = decode(ROOT / '45-gartner-aad-human-master.mp4', start, end - start)
        error = np.abs(source.astype(np.int16) - master.astype(np.int16)).mean(axis=(1, 2))
        assert float(error.max()) < 2, (index, clip['stem'], float(error.max()))
        pieces.append(dict(stem=clip['stem'], sourceFrames=[source_start, source_start+end-start],
            masterFrames=[start, end], comparedFrames=end-start, maxMeanLumaError=float(error.max())))
    assert sum(piece['comparedFrames'] for piece in pieces) == last - first
    results.append(dict(id=index, **freeze, pieces=pieces,
        sourceVerdict='Every final hold frame matches the mapped native-speed source; no master-only frozen load or encoder stall.',
        visualVerdict='Pending personal readable-content disposition.'))
    print(f'SOURCE_HOLD {index:02}: {last-first} frames matched, max mean luma error {max(p["maxMeanLumaError"] for p in pieces):.4f}', flush=True)
(BUILD / 'freeze-source-verification.json').write_text(json.dumps(results, indent=2)+'\n')
print(f'PASS: all {len(results)} detected holds compared frame-by-frame with original native-speed sources.', flush=True)
