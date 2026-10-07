"""Generate ElevenLabs narration for a tutorial from the `vo` lines in its spec.js.
usage: ELEVEN_LABS_API_KEY=... python3 vo.py <video-dir> <voice-id>
  -> <video-dir>/vo/<voice-id>/<img>.wav (48 kHz mono) + lines.json (durations and subtitle chunks)"""
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
# Optional `voSpeed` (ElevenLabs speed, 0.7-1.2) slows or speeds one utterance, rarely needed: 0.85 sounded too slow.
speeds = {b['img']: edits[b['img']]['voSpeed'] for b in beats if edits.get(b['img'], {}).get('voSpeed')}
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

# Tone consistency: every take is conditioned on the audio of the last three accepted takes (ElevenLabs
# request stitching via `previous_request_ids`; `previous_text` is only a fallback once IDs expire), sampled
# with a fixed seed, at a high stability with no style exaggeration, then gain-matched to VO_LUFS.
STABILITY = float(os.environ.get('VO_STABILITY', '0.45'))
STYLE = float(os.environ.get('VO_STYLE', '0.35'))
SEED = int(os.environ.get('VO_SEED', '1234'))
SPEED = float(os.environ.get('VO_SPEED', '1.05'))
LUFS = float(os.environ.get('VO_LUFS', '-21'))
prev_ids = []

def tts(text, prev, nxt, wav, speed=1.0):
    body = {'text': text, 'model_id': MODEL, 'previous_text': prev, 'next_text': nxt, 'seed': SEED,
            'previous_request_ids': prev_ids[-3:],
            'voice_settings': {'stability': STABILITY, 'similarity_boost': 0.8, 'style': STYLE, 'use_speaker_boost': True, **({'speed': speed} if speed != 1.0 else {})}}
    req = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE}/with-timestamps?output_format=mp3_44100_192',
                                 data=json.dumps(body).encode(), headers={'xi-api-key': KEY, 'Content-Type': 'application/json'})
    r = urllib.request.urlopen(req, timeout=120)
    d = json.load(r)
    mp3 = wav[:-4] + '.mp3'
    open(mp3, 'wb').write(base64.b64decode(d['audio_base64']))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', mp3, '-ac', '1', '-ar', str(SR), wav], check=True); os.remove(mp3)
    return d['alignment'], r.headers.get('request-id')

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

# Narration is generated per sentence, never per line: a line that stops mid-sentence ("Backlog collapses,")
# is joined with the following lines into one utterance, each whole sentence of it is one ElevenLabs request
# (previous sentences as context, no next_text, so it gets a finished-sentence cadence), and the utterance is
# cut back into lines at the quietest point between their words. A fragment request would instead start
# speaking its next_text before the clip ends. Sentences are joined with SENT_GAP seconds of silence.
# Every sentence take is transcribed and regenerated if it says something other than its text.
MODE = 'sentence-cut-4'
groups, g = [], []
for img, text in order:
    g.append((img, text, says.get(img, text)))
    if text.rstrip().endswith(('.', '?', '!')): groups.append(g); g = []
if g: groups.append(g)

def take(sent, shown, before, part, speed=1.0):
    for attempt in range(4):
        al, rid = tts(sent, before, '', part, speed)
        t0, t1 = span(al, part)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', part, '-af', f'atrim={t0:.3f}:{t1:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st={t1 - t0 - 0.04:.3f}:d=0.04', part + '.cut.wav'], check=True)
        gain = LUFS - loudness(part + '.cut.wav')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', part + '.cut.wav', '-af', f'volume={gain:.2f}dB,alimiter=limit=0.89:level=false', part + '.norm.wav'], check=True)
        os.replace(part + '.norm.wav', part + '.cut.wav')
        got = stt(part + '.cut.wav')
        if matches(shown, got):
            os.replace(part + '.cut.wav', part)
            if rid: prev_ids.append(rid)
            return al, t0, t1
        print(f'  retry {sent!r}: heard {got!r}')
    sys.exit(f'no clean take for {sent!r}')

def pcm(wav):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', wav, '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return array.array('h', raw)

def write(wav, samples):
    with wave.open(wav, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(samples.tobytes())

res, said = {}, []
for gi, grp in enumerate(groups):
    key = [[img, text, say] + ([speeds[img]] if img in speeds else []) for img, text, say in grp]
    speed = float(speeds.get(grp[0][0], SPEED))
    if all(old.get(img, {}).get('utt') == key and old[img].get('mode') == MODE and old[img].get('sentGap') == SENT_GAP and os.path.exists(os.path.join(out, f'{img}.wav')) for img, _, _ in grp):
        for img, text, _ in grp: res[img] = old[img]
        said += sentences(' '.join(t for _, t, _ in grp)); continue
    U = ' '.join(say for _, _, say in grp); shownU = ' '.join(t for _, t, _ in grp)
    bounds, o = [], 0
    for _, _, say in grp: bounds.append((o, o + len(say))); o += len(say) + 1
    sents, shown = sentences(U), sentences(shownU)
    if len(sents) != len(shown): sys.exit(f'{grp[0][0]}: voSay must have the same sentences as vo')
    # one track for the utterance; times[c] = (start, end) of character c of U in it
    track, times, pos, off = array.array('h'), [None] * len(U), 0, 0.0
    for k, sent in enumerate(sents):
        pos = U.index(sent, pos)
        part = os.path.join(out, f'_utt{gi}.{k}.wav')
        al, t0, t1 = take(sent, shown[k], ' '.join(said[-2:]), part, speed)
        said.append(shown[k])
        if k:
            off += SENT_GAP; track.extend([0] * int(SENT_GAP * SR))
        off = len(track) / SR
        for j, (a, b) in enumerate(zip(al['character_start_times_seconds'], al['character_end_times_seconds'])):
            if j < len(sent): times[pos + j] = (min(max(a - t0, 0), t1 - t0) + off, min(max(b - t0, 0), t1 - t0) + off)
        track.extend(pcm(part)); os.remove(part)
        pos += len(sent)
    e = [math.sqrt(sum(x * x for x in track[i:i + SR // 100]) / (SR // 100) + 1e-9) for i in range(0, len(track), SR // 100)]
    def alnum_times(a, b):
        return [times[c] for c in range(a, b) if U[c].isalnum() and times[c]]
    # 30 ms average loudness per 10 ms frame; the cut goes in the quietest window near the aligned word gap
    # (alignment times can be ~100 ms late, so the window reaches past them on both sides).
    q = [sum(e[f:f + 3]) / len(e[f:f + 3]) for f in range(len(e))]
    cuts = [0.0]
    for (a0, a1), (b0, b1) in zip(bounds, bounds[1:]):
        lo, hi = alnum_times(a0, a1)[-1][1], alnum_times(b0, b1)[0][0]
        lo, hi = max(lo - 0.15, alnum_times(a0, a1)[-1][0]), min(hi + 0.15, alnum_times(b0, b1)[0][1])
        f = min(range(int(lo * 100), max(int(lo * 100) + 1, int(hi * 100))), key=lambda f: q[min(f, len(q) - 1)])
        cuts.append(f / 100 + 0.015)
    cuts.append(len(track) / SR)
    # Check every cut against a transcript of the whole utterance: it must fall between two heard words,
    # the last word of one line and the first word of the next (an isolated short "and" is often misheard).
    if len(grp) > 1:
        write(os.path.join(out, '_utt.wav'), track)
        heard = stt(os.path.join(out, '_utt.wav'), timed=True); os.remove(os.path.join(out, '_utt.wav'))
        for li, c in enumerate(cuts[1:-1]):
            pre, post = [w for w in heard if w['end'] <= c + 0.02], [w for w in heard if w['start'] >= c - 0.02]
            ok = pre and post and len(pre) + len(post) == len(heard) and words(pre[-1]['text'])[-1:] == words(grp[li][1])[-1:] and words(post[0]['text'])[:1] == words(grp[li + 1][1])[:1]
            if not ok: sys.exit(f'{grp[li][0]}: cut at {c:.2f}s does not fall between {grp[li][1]!r} and {grp[li + 1][1]!r}: {[(w["text"], w["start"], w["end"]) for w in heard]}')
    for li, ((img, text, say), (a0, a1)) in enumerate(zip(grp, bounds)):
        c0, c1 = cuts[li], cuts[li + 1]
        seg = track[int(c0 * SR):int(c1 * SR)]
        fade = int(0.01 * SR)
        for j in range(min(fade, len(seg))):
            seg[j] = int(seg[j] * j / fade); seg[-1 - j] = int(seg[-1 - j] * j / fade)
        write(os.path.join(out, f'{img}.wav'), seg)
        ch = []
        for ssay, stext in zip(sentences(say), sentences(text)):
            s0 = U.index(ssay, a0)
            idx = [c for c in range(s0, s0 + len(ssay)) if times[c]]
            al = {'characters': [U[c] for c in idx], 'character_start_times_seconds': [times[c][0] - c0 for c in idx], 'character_end_times_seconds': [times[c][1] - c0 for c in idx]}
            cs = chunks(ssay, al)
            if ssay != stext: cs = [{**cs[0], 't1': cs[-1]['t1'], 'text': stext}]
            ch += [{**c, 't0': round(max(0, c['t0']), 3), 't1': round(min(c['t1'], c1 - c0), 3)} for c in cs]
        res[img] = {'text': text, **({'say': say} if say != text else {}), 'dur': round(c1 - c0, 3), 'sentGap': SENT_GAP, 'mode': MODE, 'utt': key, 'checked': True, 'chunks': ch}
        print(f'{img}: {c1 - c0:.2f}s  {text}')
    json.dump({**old, **res}, open(manifest_p, 'w'), indent=1)
json.dump(res, open(manifest_p, 'w'), indent=1)
print('total speech', round(sum(r['dur'] for r in res.values()), 1), 's')
