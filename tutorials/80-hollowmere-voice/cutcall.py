"""Cut a dead stretch out of a recorded voice call: removes [a, b] seconds (measured from the call's t0)
from audio/callN.wav and from the stills (shots/beats.json walls + shots/callN.json t1/plays shift by the
cut), so synccall.py still locks the remaining stills to the shortened audio. Usage: cutcall.py call1 58.5 97.5"""
import json, os, subprocess, sys
D = os.path.dirname(os.path.abspath(__file__))
name, a, b = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
S, A = os.path.join(D, 'shots'), os.path.join(D, 'audio', name + '.wav')
m = json.load(open(os.path.join(S, name + '.json')))
beats = json.load(open(os.path.join(S, 'beats.json')))
wa, wb, cut = m['t0'] + a * 1000, m['t0'] + b * 1000, (b - a) * 1000
dropped = [x for x in beats if x.get('call') == name and wa <= x['wall'] < wb]
beats = [x for x in beats if x not in dropped]
for x in beats:
    if x.get('call') == name and x['wall'] >= wb: x['wall'] -= cut
m['t1'] -= cut
for p in m['plays']:
    if p['t'] >= wb: p['t'] -= cut
if not os.path.exists(A + '.orig'): os.rename(A, A + '.orig')
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', A + '.orig', '-af',
                f"aselect='not(between(t,{a},{b}))',asetpts=N/SR/TB", A], check=True)
json.dump(beats, open(os.path.join(S, 'beats.json'), 'w'), indent=1)
json.dump(m, open(os.path.join(S, name + '.json'), 'w'), indent=1)
print(name, 'cut', round(b - a, 1), 's; dropped', len(dropped), 'stills; now', round((m['t1'] - m['t0']) / 1000, 1), 's')
