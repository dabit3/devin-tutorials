"""call/trim.json {"<call>": [head_s, end_s]}: drop dead air before the greeting and after the last turn.
The call then starts at the first still shot at or after head_s, so the audio and stills stay locked."""
import json, os
D = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(D, 'call', 'trim.json')

def window(name, m, beats):
    trim = json.load(open(P)).get(name) if os.path.exists(P) else None
    if not trim: return m
    head, end = trim if isinstance(trim, list) else (0, trim)
    m = dict(m)
    if end: m['t1'] = min(m['t1'], m['t0'] + end * 1000)
    if head: m['t0'] = min(b['wall'] for b in beats if b.get('call') == name and b['wall'] >= m['t0'] + head * 1000)
    return m
