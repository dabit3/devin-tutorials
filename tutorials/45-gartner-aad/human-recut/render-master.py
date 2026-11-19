"""Native-frame-only assembly of reviewed sources and the original narration."""
import argparse
import hashlib
import json
import math
from pathlib import Path
import subprocess
import wave

import numpy as np

ROOT = Path('/home/ubuntu/work/aad-human')
REPO = Path('/home/ubuntu/repos/devin-tutorials/tutorials/45-gartner-aad')
VO = REPO / 'vo/T8iHhGIWPm2GVYpQD1Am'
BUILD = ROOT / 'master-build'
FPS, SR = 30, 48000
SECTIONS = [1, 3, 7, 16, 25, 30, 32, 38, 41, 45, 51]


def run(args, **kwargs):
    return subprocess.run([str(a) for a in args], check=True, **kwargs)


def load(path):
    return json.loads(path.read_text())


def voice_duration(n, metadata):
    path = VO / f'line{n:02}-01.png.wav'
    if path.exists():
        with wave.open(str(path), 'rb') as source:
            assert source.getparams()[:3] == (1, 2, SR)
            assert source.getnframes() > 0
            return source.getnframes() / source.getframerate()
    duration = metadata['dur']
    assert duration > 0
    return duration


def plan():
    inventory = load(ROOT / 'final-accepted-inventory.json')
    voices = load(VO / 'lines.json')
    lines, position = [], 0
    for entry in inventory['lines']:
        n = entry['line']
        duration = voice_duration(n, voices[f'line{n:02}-01.png'])
        frames = math.ceil(duration * FPS - 1e-8)
        gap = 0 if n == 51 else (30 if n + 1 in SECTIONS else 12)
        clips = []
        for i, source in enumerate(entry['sources']):
            first = round(source['voice'][0] * FPS)
            last = frames if i == len(entry['sources']) - 1 else round(source['voice'][1] * FPS)
            start = round(source['source'][0] * FPS)
            count = last - first + (gap if i == len(entry['sources']) - 1 else 0)
            sidecar = load(Path(source['sidecar']))
            assert start >= 0 and count > 0 and start + count <= sidecar['timing']['frames']
            clips.append({'stem': source['stem'], 'video': sidecar['video'],
                          'window': source['window'], 'sourceStartFrame': start,
                          'frames': count, 'lineOffsetFrame': first,
                          'masterStartFrame': position + first,
                          'path': str(BUILD / f'line{n:02}-part{i+1:02}.mp4')})
        lines.append({'line': n, 'section': sum(n >= s for s in SECTIONS),
                      'text': voices[f'line{n:02}-01.png']['text'],
                      'startFrame': position, 'voiceSeconds': duration,
                      'voiceFrames': frames, 'gapFrames': gap, 'clips': clips})
        position += frames + gap
    assert position / FPS <= 540
    return {'fps': FPS, 'frames': position, 'seconds': position / FPS,
            'rounding': 'Nearest native source frame and nearest internal cut frame; line end rounded up. No speed change, interpolated frames, still padding or audio stretch. Maximum source quantization 1/60 second.',
            'gapRule': '12 actual outgoing handle frames (0.4s), 30 at section boundary (1s), plus <=1 frame line-end quantization; no final gap.',
            'lines': lines}


def write_wav(path, samples, channels=1):
    with wave.open(str(path), 'wb') as output:
        output.setparams((channels, 2, SR, 0, 'NONE', 'not compressed'))
        output.writeframes(samples.astype('<i2').tobytes())


def prepare(timeline):
    BUILD.mkdir(exist_ok=True)
    (BUILD / 'vo').mkdir(exist_ok=True)
    (BUILD / 'timeline.json').write_text(json.dumps(timeline, indent=2) + '\n')
    voices = load(VO / 'lines.json')
    original = None
    master = np.zeros(timeline['frames'] * SR // FPS, dtype='<i2')
    provenance = []
    for line in timeline['lines']:
        n = line['line']
        filename = f'line{n:02}-01.png.wav'
        existing = VO / filename
        if existing.exists():
            with wave.open(str(existing), 'rb') as source:
                assert source.getparams()[:3] == (1, 2, SR)
                samples = np.frombuffer(source.readframes(source.getnframes()), '<i2').copy()
            origin = str(existing)
        else:
            if original is None:
                with wave.open(str(VO / '_full-take.wav'), 'rb') as source:
                    assert source.getparams()[:3] == (1, 2, SR)
                    original = np.frombuffer(source.readframes(source.getnframes()), '<i2')
            v = voices[f'line{n:02}-01.png']
            start, end = round(v['at'] * SR), round(v['end'] * SR)
            samples = original[start:end].copy()
            # Match vo_onetake.py's original per-line WAV export.
            for j in range(min(int(.005 * SR), len(samples))):
                samples[-1-j] = int(int(samples[-1-j]) * j / int(.005 * SR))
            origin = f'{VO}/_full-take.wav [{v["at"]},{v["end"]}], original 5ms export tail fade'
        assert abs(len(samples) / SR - line['voiceSeconds']) < .002
        write_wav(BUILD / 'vo' / filename, samples)
        offset = line['startFrame'] * SR // FPS
        assert not master[offset:offset+len(samples)].any()
        master[offset:offset+len(samples)] = samples
        provenance.append({'line': n, 'origin': origin, 'samples': len(samples),
                           'sha256': hashlib.sha256(samples.tobytes()).hexdigest()})
    write_wav(BUILD / 'voice-only.wav', master)
    (BUILD / 'audio-provenance.json').write_text(json.dumps(provenance, indent=2) + '\n')
    print(f'PREPARED {len(timeline["lines"])} lines; {timeline["frames"]} native frames; {timeline["seconds"]:.3f}s; audio VO only, original line27 replacement.', flush=True)


def render(timeline):
    for line in timeline['lines']:
        for clip in line['clips']:
            output = Path(clip['path'])
            signature = hashlib.sha256(json.dumps(clip, sort_keys=True).encode()).hexdigest()
            stamp = output.with_suffix('.sha256')
            if output.exists() and stamp.exists() and stamp.read_text() == signature:
                print('REUSE', output.name, flush=True)
                continue
            log = output.with_suffix('.log')
            args = ['ffmpeg', '-hide_banner', '-nostdin', '-y', '-threads', '1',
                    '-ss', str(clip['sourceStartFrame'] / FPS), '-i', clip['video'],
                    '-an', '-map', '0:v:0', '-frames:v', str(clip['frames']),
                    '-vf', 'setpts=PTS-STARTPTS', '-vsync', '0',
                    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-threads', '2',
                    '-pix_fmt', 'yuv420p', '-r', '30', '-movflags', '+faststart', output]
            print('RENDER', output.name, clip['frames'], 'frames', flush=True)
            with log.open('w') as stderr:
                run(args, stdout=subprocess.DEVNULL, stderr=stderr)
            probe = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=nb_frames', '-of', 'json', str(output)]))
            assert int(probe['streams'][0]['nb_frames']) == clip['frames']
            stamp.write_text(signature)
    concat = BUILD / 'concat.txt'
    concat.write_text(''.join(f"file '{clip['path']}'\n" for line in timeline['lines'] for clip in line['clips']))
    run(['ffmpeg', '-hide_banner', '-nostdin', '-y', '-i', BUILD / 'voice-only.wav',
         '-af', 'acompressor=threshold=-20dB:ratio=3:attack=4:release=150:makeup=2,loudnorm=I=-16:TP=-2:LRA=11',
         '-ar', str(SR), BUILD / 'voice-normalized.wav'], stdout=subprocess.DEVNULL, stderr=(BUILD / 'audio-normalize.log').open('w'))
    run(['ffmpeg', '-hide_banner', '-nostdin', '-y', '-f', 'concat', '-safe', '0', '-i', concat,
         '-i', BUILD / 'voice-normalized.wav', '-map', '0:v:0', '-map', '1:a:0',
         '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-ar', str(SR),
         '-movflags', '+faststart', ROOT / '45-gartner-aad-human-master.mp4'],
        stdout=subprocess.DEVNULL, stderr=(BUILD / 'mux.log').open('w'))
    print('MASTER_RENDERED', ROOT / '45-gartner-aad-human-master.mp4', flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--prepare-only', action='store_true')
    args = parser.parse_args()
    timeline = plan()
    prepare(timeline)
    if not args.prepare_only:
        render(timeline)
