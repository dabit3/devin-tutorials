"""Run _kit/tools/audio.py for Tutorials 36 + 37 with Nader's chosen track instead of the synthesized bed.
Changes, applied in memory (_kit stays untouched): the music bed is ES "2AM" by Ben Elson (2am-ben-elson.mp3,
looped with a crossfade if the cut is longer), and the title chime, tonal swells and caption pops are removed.
Clicks and typing ticks stay. Env: MUSIC_FILE, MUSIC_LEVEL (track gain, default 0.32), DUCK (under narration, default 0.3).
usage: python3 audio36.py <kit audio.py> <video-dir>"""
import os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
src = open(sys.argv.pop(1)).read()
def sub(a, b):
    global src
    assert src.count(a) == 1, a
    src = src.replace(a, b)
os.environ.setdefault('DUCK', '0.3')
sub("mg = fade_in * fade_out * MUSIC_GAIN * 1.8 * duck", """raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', os.environ.get('MUSIC_FILE', os.path.join(HERE, '2am-ben-elson.mp3')),
    '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
track = np.frombuffer(raw, '<f4').reshape(-1, 2).astype(float)
xf = int(2 * SR)
while len(track) < N:
    ramp = np.linspace(0, 1, xf)[:, None]
    head = np.frombuffer(raw, '<f4').reshape(-1, 2).astype(float)
    track = np.concatenate([track[:-xf], track[-xf:] * (1 - ramp) + head[:xf] * ramp, head[xf:]])
ML, MR = track[:N, 0], track[:N, 1]
mg = fade_in * fade_out * float(os.environ.get('MUSIC_LEVEL', '0.32')) * duck""")
sub("""for i, m in enumerate([72, 76, 79, 84]):
    add(osc(mtof(m), 1.6) * env(int(1.6 * SR), 0.003, 0.9, 3), 0.15 + i * 0.07, 0.07, pan=-0.2 + i * 0.13)""", "pass")
sub("add(swell([64, 71, 76]), T(cue['intro']) - 0.25, 0.05)", "")
sub("add(swell([72, 67, 64]), T(cue['uiEnd']) - 0.1, 0.045)", "")
sub("for f in cue['caps']:", "for f in []:")
exec(compile(src, 'audio.py', 'exec'))
