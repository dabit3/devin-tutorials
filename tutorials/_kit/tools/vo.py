"""Generate ElevenLabs narration for a tutorial from the `vo` lines in its spec.js.
usage: ELEVEN_LABS_API_KEY=... python3 vo.py <video-dir> <voice-id>
  -> <video-dir>/vo/<voice-id>/<img>.wav (48 kHz mono) + lines.json (durations and subtitle chunks)"""
import base64, json, os, re, subprocess, sys, urllib.request

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

res = {}
for i, (img, text) in enumerate(order):
    wav = os.path.join(out, f'{img}.wav')
    if old.get(img, {}).get('text') == text and os.path.exists(wav):
        res[img] = old[img]; continue
    body = {'text': text, 'model_id': MODEL,
            'previous_text': ' '.join(t for _, t in order[max(0, i - 2):i]),
            'next_text': ' '.join(t for _, t in order[i + 1:i + 2]),
            'voice_settings': {'stability': 0.5, 'similarity_boost': 0.8, 'style': 0.15, 'use_speaker_boost': True}}
    req = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE}/with-timestamps?output_format=mp3_44100_192',
                                 data=json.dumps(body).encode(), headers={'xi-api-key': KEY, 'Content-Type': 'application/json'})
    d = json.load(urllib.request.urlopen(req, timeout=120))
    mp3 = wav[:-4] + '.mp3'
    open(mp3, 'wb').write(base64.b64decode(d['audio_base64']))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', mp3, '-ac', '1', '-ar', '48000', wav], check=True); os.remove(mp3)
    al = d['alignment']; ch = chunks(text, al)
    res[img] = {'text': text, 'dur': round(al['character_end_times_seconds'][-1], 3), 'chunks': ch}
    print(f'{img}: {res[img]["dur"]:.2f}s  {text}')
json.dump(res, open(manifest_p, 'w'), indent=1)
print('total speech', round(sum(r['dur'] for r in res.values()), 1), 's')
