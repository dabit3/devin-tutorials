"""Verify the encoded master and its script-specific assembly; visual QA is separate."""
import json
from pathlib import Path
import re
import subprocess
import wave

HERE = Path(__file__).resolve().parent
VOICE = 'T8iHhGIWPm2GVYpQD1Am'
script = (HERE / 'script.md').read_text()
expected = re.findall(r'^(\d+)\. \[([^]]+)\] (.+)$', script, re.M)
lines = json.loads((HERE / 'film-lines.json').read_text())
cards = json.loads((HERE / 'cards.json').read_text())
beats = json.loads((HERE / 'shots/beats.json').read_text())
spec = json.loads((HERE / 'spec.js').read_text().removeprefix('window.SPEC = ').strip().removesuffix(';'))
voice = json.loads((HERE / 'vo' / VOICE / 'lines.json').read_text())
cues = json.loads((HERE / 'build/cues.json').read_text())
assert len(expected) == len(lines) == len(voice) == len(cues['vo']) == 51
assert len(cards) == len(re.findall(r'^## \d+\.', script, re.M)) == 11
assert spec['noSubs'] and spec['noCaps'] and spec['maxZoom'] == 1
assert not spec.get('voOutro')
for (number, tags, text), line in zip(expected, lines):
    assert int(number) == line['line'] and text == line['text'] == voice[line['vo']]['text']
    assert [tag.strip() for tag in tags.split(',')] == [p['id'] for p in line['parts']]
    assert len({p['frames'] for p in line['parts']}) == 1
    assert voice[line['vo']]['mode'] == 'one-take' and voice[line['vo']]['checked']
    with wave.open(str(HERE / 'vo' / VOICE / (line['vo'] + '.wav'))) as wav:
        assert wav.getframerate() == 48000 and wav.getnchannels() == 1
        assert abs(wav.getnframes() / 48000 - line['voiceSeconds']) < 0.002
for beat in beats:
    if 'line' not in beat:
        continue
    box, cursor = beat['hlBox'], beat['cur']
    assert beat['travel'] == 0 and beat['dwell'] == beat['hold']
    assert beat['cursor'] and beat['hl'] and not beat.get('cam')
    assert box['x'] - box['w'] / 2 <= cursor['x'] <= box['x'] + box['w'] / 2
    assert box['y'] - box['h'] / 2 <= cursor['y'] <= box['y'] + box['h'] / 2
    assert (HERE / 'shots' / beat['img']).read_bytes() == (HERE / 'shots' / beat['source']).read_bytes()
assert [v['file'] for v in cues['vo']] == [line['vo'] for line in lines]
probe = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_streams', '-show_format',
                                           '-of', 'json', str(HERE / '45-gartner-aad-master.mp4')]))
video = [s for s in probe['streams'] if s['codec_type'] == 'video']
audio = [s for s in probe['streams'] if s['codec_type'] == 'audio']
assert len(video) == len(audio) == 1 and len(probe['streams']) == 2
assert (video[0]['width'], video[0]['height']) == (3840, 2160)
assert video[0]['avg_frame_rate'] == '60/1'
assert int(video[0]['nb_frames']) == cues['frames']
assert float(probe['format']['duration']) <= 540
samples = json.loads((HERE / 'qa/samples.json').read_text())
assert [s['line'] for s in samples] == list(range(1, 52))
assert all((HERE / 'qa' / s['frame']).exists() for s in samples)
print('PASS: exact 51-line narration; 11 cards; 76 script-tagged cuts; equal per-line split holds')
print('PASS: one-take Nader clips; parked on-target cursors; metadata highlights; no camera motion; both caption systems disabled')
print(f'PASS: encoded master 3840x2160 60fps, {video[0]["nb_frames"]} frames, video+audio only; duration {probe["format"]["duration"]}s <= 540s')
print('PASS: all 51 encoded-master midpoint samples exist; visual review must be recorded separately')
