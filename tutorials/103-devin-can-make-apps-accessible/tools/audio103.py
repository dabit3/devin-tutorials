"""Run _kit/tools/audio.py for video 103 without the title chime and title swell (the title scene replaces the title card).
BED_START (s): the light music bed starts here, fading in over 1.5 s. POP_FROM (s): no caption pops before this time.
_kit stays untouched; the patched source runs in memory."""
import os, sys
KIT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'audio.py')
src = open(sys.argv.pop(1)).read()
def sub(a, b):
    global src
    assert src.count(a) == 1, a
    src = src.replace(a, b)
sub("""for i, m in enumerate([72, 76, 79, 84]):
    add(osc(mtof(m), 1.6) * env(int(1.6 * SR), 0.003, 0.9, 3), 0.15 + i * 0.07, 0.07, pan=-0.2 + i * 0.13)""", "pass")
sub("add(swell([64, 71, 76]), T(cue['intro']) - 0.25, 0.05)", "")
sub("start = 0.2", "start = float(os.environ.get('BED_START', '0.2'))")
sub("fade_in = np.minimum(1, np.arange(N) / (1.5 * SR))", "fade_in = np.clip((np.arange(N) / SR - start) / 1.5, 0, 1)")
sub("""for f in cue['caps']:
    add(osc(mtof(88)""", """for f in [f for f in cue['caps'] if T(f) >= float(os.environ.get('POP_FROM', '0'))]:
    add(osc(mtof(88)""")
exec(compile(src, 'audio.py', 'exec'))
