"""Generate a tutorial's whole narration as ONE ElevenLabs take, then cut it into per-beat clips.
usage: ELEVEN_LABS_API_KEY=... python3 vo_onetake.py <video-dir> <voice-id>
  -> <video-dir>/vo/<voice-id>/<img>.wav + lines.json (same format as vo.py, so build.sh/engine work unchanged)
One request keeps one voice, tone and pace across the script; per-sentence takes drift even with stitching.
Cuts go in the quietest 30 ms between the last letter of one line and the first letter of the next, and each
clip keeps VO_PAD_IN seconds of lead-in, so word onsets ("Open") are never clipped."""
import array, base64, difflib, json, math, os, re, subprocess, sys, urllib.request, uuid, wave

VD, VOICE = os.path.abspath(sys.argv[1]), sys.argv[2]
KEY = os.environ['ELEVEN_LABS_API_KEY']
MODEL = os.environ.get('VO_MODEL', 'eleven_multilingual_v2')
STABILITY = float(os.environ.get('VO_STABILITY', '0.5'))
STYLE = float(os.environ.get('VO_STYLE', '0'))
SIMILARITY = float(os.environ.get('VO_SIMILARITY', '0.75'))  # ElevenLabs defaults: 0.5 / 0.75 / style 0
SEED = int(os.environ.get('VO_SEED', '1234'))
LUFS = float(os.environ.get('VO_LUFS', '-21'))
PAD_IN, PAD_OUT = float(os.environ.get('VO_PAD_IN', '0.12')), float(os.environ.get('VO_PAD_OUT', '0.15'))
SR = 48000
spec = json.loads(re.sub(r'^\s*window\.SPEC\s*=\s*', '', open(os.path.join(VD, 'spec.js')).read()).rstrip().rstrip(';'))
beats = json.load(open(os.path.join(VD, 'shots', 'beats.json')))
E = spec.get('edit', {})
order = [(b['img'], E[b['img']]['vo'], E[b['img']].get('voSay', E[b['img']]['vo'])) for b in beats
         if E.get(b['img'], {}).get('vo') and not E[b['img']].get('skip')]
if spec.get('voOutro'): order.append(('outro', spec['voOutro'], spec['voOutro']))
for img, text, _ in order:
    if not text.rstrip().endswith(('.', '?', '!')): sys.exit(f'{img}: every vo line must be a whole sentence: {text!r}')
out = os.path.join(VD, 'vo', VOICE); os.makedirs(out, exist_ok=True)
U, bounds = '', []
for _, _, say in order:
    if U: U += ' '
    bounds.append((len(U), len(U) + len(say))); U += say

def tts(seed):
    body = {'text': U, 'model_id': MODEL, 'seed': seed,
            'voice_settings': {'stability': STABILITY, 'similarity_boost': SIMILARITY, 'style': STYLE, 'use_speaker_boost': True}}
    req = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE}/with-timestamps?output_format=mp3_44100_192',
                                 data=json.dumps(body).encode(), headers={'xi-api-key': KEY, 'Content-Type': 'application/json'})
    d = json.load(urllib.request.urlopen(req, timeout=600))
    mp3, wav = os.path.join(out, '_take.mp3'), os.path.join(out, '_take.wav')
    open(mp3, 'wb').write(base64.b64decode(d['audio_base64']))
    log = subprocess.run(['ffmpeg', '-nostats', '-i', mp3, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    gain = LUFS - float(re.findall(r'I:\s+(-?[\d.]+) LUFS', log)[-1])
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', mp3, '-ac', '1', '-ar', str(SR), '-af', f'volume={gain:.2f}dB,alimiter=limit=0.89:level=false', wav], check=True)
    os.remove(mp3)
    return d['alignment'], wav

def stt(wav):
    b = uuid.uuid4().hex
    body = (f'--{b}\r\nContent-Disposition: form-data; name="model_id"\r\n\r\nscribe_v1\r\n'
            f'--{b}\r\nContent-Disposition: form-data; name="file"; filename="a.wav"\r\nContent-Type: audio/wav\r\n\r\n').encode() + open(wav, 'rb').read() + f'\r\n--{b}--\r\n'.encode()
    req = urllib.request.Request('https://api.elevenlabs.io/v1/speech-to-text', data=body, headers={'xi-api-key': KEY, 'Content-Type': f'multipart/form-data; boundary={b}'})
    return [w for w in json.load(urllib.request.urlopen(req, timeout=600))['words'] if w['type'] == 'word']

ALIAS = {'devon': 'devin', 'dev in': 'devin', '@': 'at', 'deep wiki': 'deepwiki', '2': 'two', '+': ' '}
def words(t):
    t = t.lower().replace('-', ' ')
    for a, b in ALIAS.items(): t = re.sub(rf'(?<![a-z]){re.escape(a)}(?![a-z])', b, t)
    return re.sub(r"[^a-z0-9' ]", ' ', t).split()

def pcm(wav):
    return array.array('h', subprocess.run(['ffmpeg', '-v', 'error', '-i', wav, '-f', 's16le', '-'], capture_output=True, check=True).stdout)

def write(wav, s):
    with wave.open(wav, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(s.tobytes())

def chunks(chars, st, en):
    ws, cur = [], None
    for c, a, b in zip(chars, st, en):
        if c.isspace():
            if cur: ws.append(cur); cur = None
            continue
        if cur is None: cur = {'text': '', 't0': a}
        cur['text'] += c; cur['t1'] = b
    if cur: ws.append(cur)
    gs, g = [], []
    for w in ws:
        g.append(w)
        if len(g) >= 8 or (len(g) >= 3 and w['text'][-1] in ',.:;?!' and w is not ws[-1]): gs.append(g); g = []
    if g:
        if gs and len(g) < 3 and len(gs[-1]) + len(g) <= 10: gs[-1] += g
        else: gs.append(g)
    return [{'t0': round(x[0]['t0'], 3), 't1': round(x[-1]['t1'], 3), 'text': ' '.join(w['text'] for w in x)} for x in gs]

for attempt in range(4):
    al, wav = tts(SEED + attempt)
    track = pcm(wav)
    n = SR // 100
    db = [20 * math.log10(math.sqrt(sum(x * x for x in track[i:i + n]) / n) / 32768 + 1e-9) for i in range(0, len(track) - n + 1, n)]
    q = [sum(db[f:f + 3]) / len(db[f:f + 3]) for f in range(len(db))]
    st, en = al['character_start_times_seconds'], al['character_end_times_seconds']
    alnum = lambda a, b: [c for c in range(a, b) if U[c].isalnum()]
    cuts = [0.0]
    for (a0, a1), (b0, b1) in zip(bounds, bounds[1:]):
        last, first = alnum(a0, a1)[-1], alnum(b0, b1)[0]
        lo, hi = max(st[last], en[last] - 0.1), min(en[first], st[first] + 0.15)
        f = min(range(int(lo * 100), max(int(lo * 100) + 1, int(hi * 100))), key=lambda f: q[min(f, len(q) - 1)])
        cuts.append(f / 100 + 0.015)
    cuts.append(len(track) / SR)
    heard = stt(wav)
    want, got = ''.join(words(U)), ''.join(words(' '.join(w['text'] for w in heard)))
    extra = sum(j2 - j1 for op, _, _, j1, j2 in difflib.SequenceMatcher(None, want, got, autojunk=False).get_opcodes() if op in ('insert', 'replace'))
    bad = [f'{order[i][0]} @ {c:.2f}s' for i, c in enumerate(cuts[1:-1]) if any(w['start'] < c - 0.02 and w['end'] > c + 0.02 for w in heard)]
    if extra <= max(5, len(want) // 40) and not bad: break
    print(f'take {attempt}: {extra} stray chars, cuts inside words: {bad}')
else:
    sys.exit('no clean take')

res = {}
for i, (img, text, say) in enumerate(order):
    c0, c1 = cuts[i], cuts[i + 1]
    loud = [f for f in range(int(c0 * 100), min(int(c1 * 100), len(db))) if db[f] > -45]
    s0 = max(c0, loud[0] / 100 - PAD_IN) if loud else c0
    s1 = min(c1, (loud[-1] + 1) / 100 + PAD_OUT) if loud else c1
    seg = track[int(s0 * SR):int(s1 * SR)]
    fade = int(0.005 * SR)
    for j in range(min(fade, len(seg))): seg[-1 - j] = int(seg[-1 - j] * j / fade)
    write(os.path.join(out, f'{img}.wav'), seg)
    a0, a1 = bounds[i]
    idx = [c for c in range(a0, a1)]
    ch = chunks([U[c] for c in idx], [st[c] - s0 for c in idx], [en[c] - s0 for c in idx])
    if say != text: ch = [{**ch[0], 't1': ch[-1]['t1'], 'text': text}]
    dur = round(s1 - s0, 3)
    res[img] = {'text': text, **({'say': say} if say != text else {}), 'dur': dur, 'at': round(s0, 3), 'end': round(s1, 3), 'mode': 'one-take', 'checked': True,
                'chunks': [{**c, 't0': round(max(0, c['t0']), 3), 't1': round(min(c['t1'], dur), 3)} for c in ch]}
    print(f'{img}: {dur:.2f}s  {text}')
os.replace(wav, os.path.join(out, '_full-take.wav'))
json.dump(res, open(os.path.join(out, 'lines.json'), 'w'), indent=1)
print('total speech', round(sum(r['dur'] for r in res.values()), 1), 's')
