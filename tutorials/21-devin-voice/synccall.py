"""Lock each voice call's stills to real time in spec.js: the first still of call N gets clip 'callN'
(audio/callN.wav from mixcall.py) and every still holds exactly until the next one was shot, so the
frames line up with the call audio. Run after editing spec.js by hand; it only touches call stills."""
import json, os, re
D = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(D, 'spec.js')
head, _, tail = open(P).read().partition('\n};\n')  # tail: narrated-only JS after the JSON
spec = json.loads(re.sub(r'^\s*window\.SPEC\s*=\s*', '', head) + '\n}')
beats = json.load(open(os.path.join(D, 'shots', 'beats.json')))
pace, E = spec.get('pace', 1.2), spec.setdefault('edit', {})
TRIM = json.load(open(os.path.join(D, 'call', 'trim.json'))) if os.path.exists(os.path.join(D, 'call', 'trim.json')) else {}
for name in sorted({b['call'] for b in beats if b.get('call')}):
    m = json.load(open(os.path.join(D, 'shots', name + '.json')))
    trim = TRIM.get(name)
    if trim: m['t1'] = min(m['t1'], m['t0'] + trim * 1000)
    for b in beats:
        if b.get('call') == name and b['wall'] >= m['t1']: E.setdefault(b['img'], {})['skip'] = True
    cs = [b for b in beats if b.get('call') == name and b['wall'] < m['t1']]
    for i, b in enumerate(cs):
        e = E.setdefault(b['img'], {})
        assert not e.get('skip') and not e.get('cam') and not e.get('vo'), f"{b['img']}: call stills can't skip, zoom or carry vo"
        nxt = cs[i + 1]['wall'] if i + 1 < len(cs) else m['t1']
        e['hold'] = round((nxt - b['wall']) / 1000 / pace, 4)
        if i == 0: e['clip'] = name
    print(name, len(cs), 'stills', round((m['t1'] - cs[0]['wall']) / 1000, 1), 's')
open(P, 'w').write('window.SPEC = ' + json.dumps(spec, indent=2) + ';\n' + tail)
