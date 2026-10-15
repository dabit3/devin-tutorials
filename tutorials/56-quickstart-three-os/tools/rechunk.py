"""Split voSay lines back into short subtitle chunks after vo_onetake.py.
vo_onetake.py keeps a line whose voSay differs from vo as ONE subtitle chunk, which overflows the frame for
long lines. This times each written word from a Speech-to-Text pass over that line's clip and regroups
the words with the kit's own chunk rule (8 words, or 3+ words ending in punctuation).
usage (from tutorials/): ELEVEN_LABS_API_KEY=... python3 56-quickstart-three-os/tools/rechunk.py <video-dir> <voice-id>
Re-run it after every vo_onetake.py run."""
import bisect, json, os, sys, urllib.request, uuid

VD, VOICE = sys.argv[1], sys.argv[2]
KEY = os.environ['ELEVEN_LABS_API_KEY']
d = os.path.join(VD, 'vo', VOICE); lj = os.path.join(d, 'lines.json'); L = json.load(open(lj))

def stt(wav):
    b = uuid.uuid4().hex
    body = (f'--{b}\r\nContent-Disposition: form-data; name="model_id"\r\n\r\nscribe_v1\r\n'
            f'--{b}\r\nContent-Disposition: form-data; name="file"; filename="a.wav"\r\nContent-Type: audio/wav\r\n\r\n').encode() + open(wav, 'rb').read() + f'\r\n--{b}--\r\n'.encode()
    req = urllib.request.Request('https://api.elevenlabs.io/v1/speech-to-text', data=body, headers={'xi-api-key': KEY, 'Content-Type': f'multipart/form-data; boundary={b}'})
    return [w for w in json.load(urllib.request.urlopen(req, timeout=600))['words'] if w['type'] == 'word']

def at(frac, xs, ts):  # piecewise-linear time at a character fraction of the line
    i = min(max(bisect.bisect_right(xs, frac) - 1, 0), len(xs) - 2)
    return ts[i] + (ts[i + 1] - ts[i]) * (frac - xs[i]) / ((xs[i + 1] - xs[i]) or 1)

for key, v in L.items():
    if 'say' not in v or len(v['chunks']) > 1: continue
    heard = stt(os.path.join(d, f'{key}.wav'))
    hs = ' '.join(w['text'] for w in heard); xs, ts, pos = [], [], 0
    for w in heard:
        xs += [pos / len(hs), (pos + len(w['text'])) / len(hs)]; ts += [w['start'], w['end']]; pos += len(w['text']) + 1
    words, pos, t = v['text'].split(), 0, v['text']
    ws = []
    for w in words:
        a = t.index(w, pos); b = a + len(w); pos = b
        ws.append({'text': w, 't0': at(a / len(t), xs, ts), 't1': at(b / len(t), xs, ts)})
    gs, g = [], []
    for w in ws:
        g.append(w)
        if len(g) >= 8 or (len(g) >= 3 and w['text'][-1] in ',.:;?!' and w is not ws[-1]): gs.append(g); g = []
    if g:
        if gs and len(g) < 3 and len(gs[-1]) + len(g) <= 10: gs[-1] += g
        else: gs.append(g)
    v['chunks'] = [{'t0': round(max(0, x[0]['t0']), 3), 't1': round(min(x[-1]['t1'], v['dur']), 3), 'text': ' '.join(w['text'] for w in x)} for x in gs]
    print(key, [(c['t0'], c['text']) for c in v['chunks']])
json.dump(L, open(lj, 'w'), indent=1)
