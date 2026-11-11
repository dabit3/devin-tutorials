"""Run _kit/tools/audio.py for this video without the opening title chime and title swell.
usage: MUSIC_GAIN=0 VOICE=<id> python3 audio100.py <_kit/tools/audio.py> <video-dir>. _kit stays untouched; the patched source runs in memory."""
import sys
src = open(sys.argv.pop(1)).read()
def sub(a, b):
    global src
    assert src.count(a) == 1, a
    src = src.replace(a, b)
sub("""for i, m in enumerate([72, 76, 79, 84]):
    add(osc(mtof(m), 1.6) * env(int(1.6 * SR), 0.003, 0.9, 3), 0.15 + i * 0.07, 0.07, pan=-0.2 + i * 0.13)""", "pass")
sub("add(swell([64, 71, 76]), T(cue['intro']) - 0.25, 0.05)", "")
exec(compile(src, 'audio.py', 'exec'))
