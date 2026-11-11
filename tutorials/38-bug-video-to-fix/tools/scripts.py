"""Write voice-script.md (repo) and <folder>-voiceover-script.md (timed, for recording the voiceover yourself).
usage: python3 scripts.py <video-dir> <build-dir-with-cues.json> <out-dir> <title>"""
import json, os, sys
VD, BD, OUT, TITLE = sys.argv[1:5]
name = os.path.basename(os.path.normpath(VD)); num = name.split('-')[0]
L = json.load(open(os.path.join(VD, 'vo', 'T8iHhGIWPm2GVYpQD1Am', 'lines.json')))
cue = json.load(open(os.path.join(BD, 'cues.json'))); FPS = cue['fps']
vo = sorted(cue['vo'], key=lambda v: v['t'])
assert len(vo) == len(L), (len(vo), len(L))
ts = lambda s: f'{int(s // 60):02d}:{s % 60:04.1f}'
head = (f"Narrated in Nader's voice (ElevenLabs `T8iHhGIWPm2GVYpQD1Am`, model `eleven_multilingual_v2`; the request sends only the text and `model_id`). "
        "The whole script is one take made with `_kit/tools/vo.py`, cut at sentence boundaries and laid over each beat.\n\n"
        "Disclosure: we put the Fernhouse checkout bug in the demo on purpose, and we recorded the customer clip ourselves, playing the customer.\n")
with open(os.path.join(VD, 'voice-script.md'), 'w') as f:
    f.write(f'# Tutorial {num}: {TITLE} (voice script)\n\n{head}\n## Lines\n\n')
    f.write('\n'.join(f"{i}. {L[v['file']]['text']}\n" for i, v in enumerate(vo, 1)))
total = cue['frames'] / FPS
with open(os.path.join(OUT, f'{name}-voiceover-script.md'), 'w') as f:
    f.write(f'# Tutorial {num}: {TITLE} (voiceover script)\n\nVideo: `{name}-silent.mp4`, {ts(total)} long. '
            'Each line starts and ends at the times shown (mm:ss.s). Start reading each line at its start time.\n\n'
            '| # | Start | End | Line |\n|---|---|---|---|\n')
    for i, v in enumerate(vo, 1):
        s = v['t'] / FPS; f.write(f"| {i} | {ts(s)} | {ts(s + L[v['file']]['dur'])} | {L[v['file']]['text']} |\n")
print(name, len(vo), 'lines', ts(total))
