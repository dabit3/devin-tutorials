"""Generate ElevenLabs narration for a tutorial from the `vo` lines in its spec.js.
usage: ELEVEN_LABS_API_KEY=... python3 vo.py <video-dir> <voice-id>
  -> <video-dir>/vo/<voice-id>/<img>.wav (48 kHz mono) + lines.json (durations and subtitle chunks)"""
import array, base64, difflib, json, math, os, re, subprocess, sys, urllib.request, uuid

VD, VOICE = os.path.abspath(sys.argv[1]), sys.argv[2]
MODEL = os.environ.get('VO_MODEL', 'eleven_multilingual_v2')
KEY = os.environ['ELEVEN_LABS_API_KEY']
src = open(os.path.join(VD, 'spec.js')).read()
spec = json.loads(re.sub(r'^\s*window\.SPEC\s*=\s*', '', src).rstrip().rstrip(';'))
beats = json.load(open(os.path.join(VD, 'shots', 'beats.json')))
edits = spec.get('edit', {})
order = [(b['img'], edits[b['img']]['vo']) for b in beats if edits.get(b['img'], {}).get('vo') and not edits[b['img']].get('skip')]
if spec.get('voOutro'): order.append(('outro', spec['voOutro']))
out = os.path.join(VD, 'vo', VOICE); os.makedirs(out, exist_ok=True)
manifest_p = os.path.join(out, 'lines.json')
old = json.load(open(manifest_p)) if os.path.exists(manifest_p) else {}

def chunks(text, al):
    chars, st, en = al['characters'], al['character_start_times_seconds'], al['character_end_times_seconds']
    words, cur = [], None
    for c, a, b in zip(chars, st, en):
        if c.isspace():
            if cur: words.append(cur); cur = None
            continue
        if cur is None: cur = {'text': '', 't0': a}
        cur['text'] += c; cur['t1'] = b
    if cur: words.append(cur)
    groups, g = [], []
    for w in words:
        g.append(w)
        if len(g) >= 8 or (len(g) >= 3 and w['text'][-1] in ',.:;?!' and w is not words[-1]):
            groups.append(g); g = []
    if g:
        if groups and len(g) < 3 and len(groups[-1]) + len(g) <= 10: groups[-1] += g
        else: groups.append(g)
    return [{'t0': round(x[0]['t0'], 3), 't1': round(x[-1]['t1'], 3), 'text': ' '.join(w['text'] for w in x)} for x in groups]

SENT_GAP = float(os.environ.get('VO_SENT_GAP', '0.6'))
SR = 48000
sentences = lambda t: [x for x in re.split(r'(?<=[.?!])\s+(?=[A-Z])', t.strip()) if x]

def tts(text, prev, nxt, wav):
    body = {'text': text, 'model_id': MODEL, 'previous_text': prev, 'next_text': nxt,
            'voice_settings': {'stability': 0.5, 'similarity_boost': 0.8, 'style': 0.15, 'use_speaker_boost': True}}
    req = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE}/with-timestamps?output_format=mp3_44100_192',
                                 data=json.dumps(body).encode(), headers={'xi-api-key': KEY, 'Content-Type': 'application/json'})
    d = json.load(urllib.request.urlopen(req, timeout=120))
    mp3 = wav[:-4] + '.mp3'
    open(mp3, 'wb').write(base64.b64decode(d['audio_base64']))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', mp3, '-ac', '1', '-ar', str(SR), wav], check=True); os.remove(mp3)
    return d['alignment']

def stt(wav):
    b = uuid.uuid4().hex
    body = (f'--{b}\r\nContent-Disposition: form-data; name="model_id"\r\n\r\nscribe_v1\r\n'
            f'--{b}\r\nContent-Disposition: form-data; name="file"; filename="a.wav"\r\nContent-Type: audio/wav\r\n\r\n').encode() + open(wav, 'rb').read() + f'\r\n--{b}--\r\n'.encode()
    req = urllib.request.Request('https://api.elevenlabs.io/v1/speech-to-text', data=body,
                                 headers={'xi-api-key': KEY, 'Content-Type': f'multipart/form-data; boundary={b}'})
    return json.load(urllib.request.urlopen(req, timeout=120))['text']

# Transcripts spell names and symbols their own way; map them back before comparing.
ALIAS = {'devon': 'devin', 'dev in': 'devin', '@': 'at', 'deep wiki': 'deepwiki', 'code maps': 'codemaps', 'swe': 'swee',
         '2': 'two', 'except': 'accept', 'id': 'ide', 'oneflow': 'one flow', '+': ' ', 'bang ': 'bang '}
def words(t):
    t = t.lower().replace('-', ' ')
    for a, b in ALIAS.items(): t = re.sub(rf'(?<![a-z]){re.escape(a)}(?![a-z])', b, t)
    return re.sub(r"[^a-z0-9' ]", ' ', t).split()

def matches(want, got):
    w, g = ''.join(words(want)), ''.join(words(got))
    extra = sum(j2 - j1 for op, _, _, j1, j2 in difflib.SequenceMatcher(None, w, g, autojunk=False).get_opcodes() if op in ('insert', 'replace'))
    return extra <= max(3, len(w) // 12)

def env(wav):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', wav, '-f', 's16le', '-'], capture_output=True, check=True).stdout
    a, n = array.array('h', raw), SR // 100
    return [20 * math.log10(math.sqrt(sum(x * x for x in a[i:i + n]) / n) / 32768 + 1e-9) for i in range(0, len(a) - n + 1, n)]

def span(al, wav):
    """Speech span of one take: from the first letter to the end of the last letter's sound, dropping anything
    after it that follows a gap (TTS sometimes appends a stray syllable past the final character)."""
    ch, st, en = al['characters'], al['character_start_times_seconds'], al['character_end_times_seconds']
    idx = [i for i, c in enumerate(ch) if c.isalnum()]
    t0, t1 = max(0.0, st[idx[0]] - 0.03), en[idx[-1]]
    e = env(wav)
    k = min(int(t1 * 100), len(e) - 1)
    quiet = 0
    while k < len(e) and k < int((t1 + 0.25) * 100):
        quiet = quiet + 1 if e[k] < -50 else 0
        if quiet >= 3: break
        k += 1
    return t0, (k - quiet + 1) / 100 + 0.04

# Each sentence is its own request (with neighbouring sentences as context) so it gets a complete
# sentence cadence; sentences within one line are joined with SENT_GAP seconds of silence.
# Every take is transcribed and regenerated if it says something other than its text.
res = {}
for li, (img, text) in enumerate(order):
    wav = os.path.join(out, f'{img}.wav')
    if old.get(img, {}).get('text') == text and old[img].get('sentGap') == SENT_GAP and old[img].get('checked') and os.path.exists(wav):
        res[img] = old[img]; continue
    sents = sentences(text)
    prev_all = [x for _, t in order[:li] for x in sentences(t)]
    next_all = [x for _, t in order[li + 1:] for x in sentences(t)]
    parts, ch, off = [], [], 0.0
    for k, sent in enumerate(sents):
        before = (prev_all + sents[:k])[-2:]
        # next_text makes a finished sentence sound like it runs on, so only unfinished ones get it.
        after = [] if sent.rstrip().endswith((".", "?", "!")) else (sents[k + 1:] + next_all)[:1]
        part = f'{wav[:-4]}.{k}.wav'
        for attempt in range(4):
            al = tts(sent, ' '.join(before), ' '.join(after), part)
            t0, t1 = span(al, part)
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', part, '-af', f'atrim={t0:.3f}:{t1:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st={t1 - t0 - 0.04:.3f}:d=0.04', part + '.cut.wav'], check=True)
            got = stt(part + '.cut.wav')
            if matches(sent, got): break
            print(f'  retry {img}.{k}: heard {got!r}')
        else:
            sys.exit(f'{img}: no clean take for {sent!r}')
        os.replace(part + '.cut.wav', part)
        if k: off += SENT_GAP
        ch += [{**c, 't0': round(max(0, c['t0'] - t0) + off, 3), 't1': round(min(c['t1'], t1) - t0 + off, 3)} for c in chunks(sent, al)]
        parts.append((part, off, t1 - t0)); off += t1 - t0
    filt = ''.join(f'[{i}]adelay={int(o * 1000)}[a{i}];' for i, (_, o, _) in enumerate(parts))
    filt += ''.join(f'[a{i}]' for i in range(len(parts))) + f'amix=inputs={len(parts)}:normalize=0,atrim=0:{off:.3f}[o]'
    cmd = ['ffmpeg', '-v', 'error', '-y'] + sum((['-i', p] for p, _, _ in parts), []) + ['-filter_complex', filt, '-map', '[o]', '-ar', str(SR), '-ac', '1', wav]
    subprocess.run(cmd, check=True)
    for p, _, _ in parts: os.remove(p)
    res[img] = {'text': text, 'dur': round(off, 3), 'sentGap': SENT_GAP, 'checked': True, 'chunks': ch}
    print(f'{img}: {off:.2f}s  {text}')
    json.dump({**old, **res}, open(manifest_p, 'w'), indent=1)
json.dump(res, open(manifest_p, 'w'), indent=1)
print('total speech', round(sum(r['dur'] for r in res.values()), 1), 's')
