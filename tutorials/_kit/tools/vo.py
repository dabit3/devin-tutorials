"""Generate ElevenLabs narration for a tutorial from the `vo` lines in its spec.js.
usage: ELEVEN_LABS_API_KEY=... python3 vo.py <video-dir> <voice-id>
  -> <video-dir>/vo/<voice-id>/<img>.wav (48 kHz mono) + lines.json (durations and subtitle chunks)
All lines are generated as one take and cut apart; changing any line regenerates the whole take."""
import array, base64, wave, difflib, json, math, os, re, subprocess, sys, urllib.request, uuid

VD, VOICE = os.path.abspath(sys.argv[1]), sys.argv[2]
MODEL = os.environ.get('VO_MODEL', 'eleven_multilingual_v2')
KEY = os.environ['ELEVEN_LABS_API_KEY']
src = open(os.path.join(VD, 'spec.js')).read()
spec = json.loads(re.sub(r'^\s*window\.SPEC\s*=\s*', '', src).rstrip().rstrip(';'))
beats = json.load(open(os.path.join(VD, 'shots', 'beats.json')))
edits = spec.get('edit', {})
order = [(b['img'], edits[b['img']]['vo']) for b in beats if edits.get(b['img'], {}).get('vo') and not edits[b['img']].get('skip')]
# Optional `voSay`: the same sentences as `vo`, spelled for the voice (e.g. a comma for a pause); subtitles keep `vo`.
says = {b['img']: edits[b['img']]['voSay'] for b in beats if edits.get(b['img'], {}).get('voSay')}
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

SR = 48000
sentences = lambda t: [x for x in re.split(r'(?<=[.?!])\s+(?=[A-Z])', t.strip()) if x]
# Pre-roll before a line's first aligned letter; the aligner marks plosives ("Cap") at the burst, so a short pre-roll clipped them.
LEAD = float(os.environ.get('VO_LEAD', '0.12'))
LUFS = float(os.environ.get('VO_LUFS', '-21'))

# The whole script is one ElevenLabs request with the voice's own default settings (no voice_settings, seed,
# speed or context), so every line comes from the same continuous take; separate per-sentence requests drifted
# in tone even with request stitching. The take is then cut into lines at the pauses between them.
def tts(text, mp3):
    body = {'text': text, 'model_id': MODEL}
    req = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE}/with-timestamps?output_format=mp3_44100_192',
                                 data=json.dumps(body).encode(), headers={'xi-api-key': KEY, 'Content-Type': 'application/json'})
    d = json.load(urllib.request.urlopen(req, timeout=300))
    open(mp3, 'wb').write(base64.b64decode(d['audio_base64']))
    return d['alignment']

def loudness(wav):
    log = subprocess.run(['ffmpeg', '-nostats', '-i', wav, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', log)[-1])

def stt(wav, timed=False):
    b = uuid.uuid4().hex
    body = (f'--{b}\r\nContent-Disposition: form-data; name="model_id"\r\n\r\nscribe_v1\r\n'
            f'--{b}\r\nContent-Disposition: form-data; name="file"; filename="a.wav"\r\nContent-Type: audio/wav\r\n\r\n').encode() + open(wav, 'rb').read() + f'\r\n--{b}--\r\n'.encode()
    req = urllib.request.Request('https://api.elevenlabs.io/v1/speech-to-text', data=body,
                                 headers={'xi-api-key': KEY, 'Content-Type': f'multipart/form-data; boundary={b}'})
    d = json.load(urllib.request.urlopen(req, timeout=120))
    return [w for w in d['words'] if w['type'] == 'word'] if timed else d['text']

# Transcripts spell names and symbols their own way; map them back before comparing.
ALIAS = {'devon': 'devin', 'dev in': 'devin', '@': 'at', 'deep wiki': 'deepwiki', 'code maps': 'codemaps', 'swe': 'swee',
         '2': 'two', 'except': 'accept', 'id': 'ide', 'oneflow': 'one flow', '+': ' ', 'bang ': 'bang ', 'swift ui': 'swiftui', 'x code build': 'xcodebuild', 'x code gen': 'xcodegen', 'xcode build': 'xcodebuild', 'xcode gen': 'xcodegen', 'test flight': 'testflight'}
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

def pcm(wav):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', wav, '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return array.array('h', raw)

def write(wav, samples):
    with wave.open(wav, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(samples.tobytes())

MODE = 'single-take-1'
items = [(img, text, says.get(img, text)) for img, text in order]
key = [list(x) for x in items]
if all(old.get(img, {}).get('mode') == MODE and old[img].get('take') == key and os.path.exists(os.path.join(out, f'{img}.wav')) for img, _, _ in items):
    sys.exit('narration unchanged')
U = ' '.join(say for _, _, say in items)
bounds, o = [], 0
for _, _, say in items: bounds.append((o, o + len(say))); o += len(say) + 1
take_wav = os.path.join(out, '_take.wav')

def cut_take():
    """One take of U, gain-matched to LUFS as a whole. Returns (track, times, cuts) or None if a cut is unclean."""
    al = tts(U, take_wav[:-4] + '.mp3')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', take_wav[:-4] + '.mp3', '-ac', '1', '-ar', str(SR), take_wav], check=True)
    os.remove(take_wav[:-4] + '.mp3')
    gain = LUFS - loudness(take_wav)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', take_wav, '-af', f'volume={gain:.2f}dB,alimiter=limit=0.89:level=false', take_wav + '.n.wav'], check=True)
    os.replace(take_wav + '.n.wav', take_wav)
    track = pcm(take_wav)
    st, en = al['character_start_times_seconds'], al['character_end_times_seconds']
    if ''.join(al['characters']) != U: sys.exit('alignment text differs from the request')
    times = list(zip(st, en))
    n = SR // 100
    e = [math.sqrt(sum(x * x for x in track[i:i + n]) / n + 1e-9) for i in range(0, len(track), n)]
    q = [sum(e[f:f + 3]) / len(e[f:f + 3]) for f in range(len(e))]
    alnum = lambda a, b: [times[c] for c in range(a, b) if U[c].isalnum()]
    # cut in the quietest 30 ms window around the aligned gap between two lines (alignment can be ~100 ms late)
    cuts = []
    for (a0, a1), (b0, b1) in zip(bounds, bounds[1:]):
        last, first = alnum(a0, a1)[-1], alnum(b0, b1)[0]
        lo, hi = max(last[1] - 0.15, last[0]), min(first[0] + 0.15, first[1])
        f = min(range(int(lo * 100), max(int(lo * 100) + 1, int(hi * 100))), key=lambda f: q[min(f, len(q) - 1)])
        cuts.append(f / 100 + 0.015)
    # every cut must fall between the last heard word of one line and the first heard word of the next
    heard = stt(take_wav, timed=True)
    if not matches(' '.join(t for _, t, _ in items), ' '.join(w['text'] for w in heard)):
        print('  retake: transcript differs:', ' '.join(w['text'] for w in heard)); return None
    for li, c in enumerate(cuts):
        pre, post = [w for w in heard if w['end'] <= c + 0.02], [w for w in heard if w['start'] >= c - 0.02]
        # compare letters, not words: the transcript may split "codebase" into "code base"
        tail, head = ''.join(words(items[li][1])), ''.join(words(items[li + 1][1]))
        ok = pre and post and len(pre) + len(post) == len(heard) and tail.endswith(''.join(words(pre[-1]['text']))) and head.startswith(''.join(words(post[0]['text'])))
        if not ok:
            near = [(w['text'], w['start'], w['end']) for w in heard if abs(w['start'] - c) < 1.5]
            print(f'  retake: cut {c:.2f}s not between {items[li][1]!r} and {items[li + 1][1]!r}: {near}'); return None
    return track, times, cuts, e

for attempt in range(4):
    r = cut_take()
    if r: break
else: sys.exit('no clean take')
track, times, cuts, e = r
alnum = lambda a, b: [times[c] for c in range(a, b) if U[c].isalnum()]
res = {}
for li, ((img, text, say), (a0, a1)) in enumerate(zip(items, bounds)):
    # trim each line to its own speech: from just before its first letter to the end of its last sound
    w0, w1 = alnum(a0, a1)[0][0], alnum(a0, a1)[-1][1]
    lo = cuts[li - 1] if li else 0.0
    hi = cuts[li] if li < len(cuts) else len(track) / SR
    c0 = max(lo, w0 - LEAD)
    k = min(int(w1 * 100), len(e) - 1); quiet = 0
    while k < len(e) and k < int(hi * 100) and k < int((w1 + 0.3) * 100):
        quiet = quiet + 1 if 20 * math.log10(e[k] / 32768 + 1e-9) < -50 else 0
        if quiet >= 3: break
        k += 1
    c1 = min(hi, (k - quiet + 1) / 100 + 0.05)
    seg = track[int(c0 * SR):int(c1 * SR)]
    fade = int(0.01 * SR)
    for j in range(min(fade, len(seg))):
        seg[j] = int(seg[j] * j / fade); seg[-1 - j] = int(seg[-1 - j] * j / fade)
    write(os.path.join(out, f'{img}.wav'), seg)
    ch = []
    for ssay, stext in zip(sentences(say), sentences(text)):
        s0 = U.index(ssay, a0)
        idx = range(s0, s0 + len(ssay))
        al = {'characters': [U[c] for c in idx], 'character_start_times_seconds': [times[c][0] - c0 for c in idx], 'character_end_times_seconds': [times[c][1] - c0 for c in idx]}
        cs = chunks(ssay, al)
        if ssay != stext: cs = [{**cs[0], 't1': cs[-1]['t1'], 'text': stext}]
        ch += [{**c, 't0': round(max(0, c['t0']), 3), 't1': round(min(c['t1'], c1 - c0), 3)} for c in cs]
    res[img] = {'text': text, **({'say': say} if say != text else {}), 'dur': round(c1 - c0, 3), 'takeAt': round(c0, 3), 'mode': MODE, 'take': key, 'chunks': ch}
    print(f'{img}: {c1 - c0:.2f}s  {text}')
os.remove(take_wav)
json.dump(res, open(manifest_p, 'w'), indent=1)
print('total speech', round(sum(r['dur'] for r in res.values()), 1), 's; take', round(len(track) / SR, 1), 's')
