"""One ElevenLabs take for the whole narration INCLUDING the three cold-open intro lines (intro/lines-text.json):
prepends i0/i1/i2 beats to shots/beats.json and spec.js for vo_onetake.py, restores both, then moves the intro clips to intro/.
usage: ELEVEN_LABS_API_KEY=... python3 vointro.py <voice-id>"""
import json, os, re, shutil, subprocess, sys
D = os.path.dirname(os.path.abspath(__file__)); VOICE = sys.argv[1]
BJ, SP = os.path.join(D, 'shots', 'beats.json'), os.path.join(D, 'spec.js')
beats, spec_src = open(BJ).read(), open(SP).read()
intro = json.load(open(os.path.join(D, 'intro', 'lines-text.json')))
try:
    b = json.loads(beats); s = json.loads(re.sub(r'^\s*window\.SPEC\s*=\s*', '', spec_src).rstrip().rstrip(';'))
    for k in reversed(list(intro)): b.insert(0, {'img': k + '.png'})
    for k, t in intro.items(): s['edit'][k + '.png'] = {'vo': t}
    json.dump(b, open(BJ, 'w')); open(SP, 'w').write('window.SPEC = ' + json.dumps(s, indent=2, ensure_ascii=False) + ';\n')
    subprocess.run(['python3', os.path.join(D, '..', '_kit', 'tools', 'vo_onetake.py'), D, VOICE], check=True)
finally:
    open(BJ, 'w').write(beats); open(SP, 'w').write(spec_src)
vd = os.path.join(D, 'vo', VOICE); L = json.load(open(os.path.join(vd, 'lines.json'))); out = {}
os.makedirs(os.path.join(D, 'intro'), exist_ok=True)
for k in intro:
    shutil.move(os.path.join(vd, k + '.png.wav'), os.path.join(D, 'intro', k + '.png.wav')); out[k + '.png'] = L.pop(k + '.png')
json.dump(L, open(os.path.join(vd, 'lines.json'), 'w'), indent=1); json.dump(out, open(os.path.join(D, 'intro', 'lines.json'), 'w'), indent=1)
print('intro lines', {k: v['dur'] for k, v in out.items()}, '| narration lines', len(L))
