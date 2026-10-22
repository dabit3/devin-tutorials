"""v2 cold-open edit of the take-9 live draft (build/coldopen-draft.mp4, flash-aligned, real GPT-Live-1 audio), per Devin Bot's approved edit notes:
shrine 5 s, vista 3 s, watchpost 3.5 s, settle, the walk (move_to / barge-in / bard) minus the rock-over-Eira beat, a <=18 s two-shot with eased punch-ins,
and the crane end beat landing on the composed forge frame. The in-take subtitles are masked behind a frosted lower band and re-rendered larger by subs.mjs.
The two-shot runs its audio 2.7 s behind the picture (a J-cut over the dropped rock beat; nobody is lip-synced).
usage: python3 coldopen_edit.py  -> build/coldopen-v2.mp4 (4K60) + build/coldopen-v2-1080.mp4"""
import json, os, subprocess
D = os.path.dirname(os.path.abspath(__file__)); B = os.path.join(D, 'build'); SRC = os.path.join(B, 'coldopen-draft.mp4')
S = os.path.join(B, 'subs'); os.makedirs(S, exist_ok=True)
YOU = json.load(open(os.path.join(B, 'you-lines.json')))
E = {'greet1': "See that black smoke curling over the watchpost, friend?", 'greet2': "Let's find who's keeping that fire alive.",
     'bear': "Hang on. I'm getting my bearings.", 'stop1': "Aye, stopping now. Let's go have a word with Brann.",
     'stop2': "Right, we turned off for the forge. Brann's fire's the only one with a heartbeat left.",
     'bard1': "As you wish, traveler. My tongue slips back to older songs, the kind sung by firelight.",
     'bard2': "Ah, he names the barrow and the ember-stone, and the old fear walks again.",
     'ans': "He murmurs the barrow cracked the very hour the shrine's fire died, and something cold carried the ember-stone away.",
     'pack': "Your pack holds an iron sword and two health potions, friend."}
spec, idx = [], {}
def sub(kind, text, speaker=None):
    k = (kind, text)
    if k not in idx: idx[k] = len(spec); spec.append({'kind': kind, 'text': text, 'speaker': speaker})
    return idx[k]
# (name, video ss, video to, audio offset (audio = video - off), subs [(png, t0, t1) absolute AUDIO time], zoom (z0, z1) or None, band, lift)
segs = [
  ('shrine', 0.0, 5.0, 0, [('line', 'Eira', E['greet1'], 2.9, 5.0)], None, True, False),
  ('vista', 5.0, 8.0, 0, [('line', 'Eira', E['greet1'], 5.0, 5.7), ('line', 'Eira', E['greet2'], 5.8, 8.0)], None, True, False),
  ('watch', 12.0, 15.5, 0, [], None, False, False),
  ('settle', 17.0, 19.5, 0, [], None, True, True),
  ('walk', 19.5, 45.9, 0, [('you', None, YOU['k1'], 20.4, 23.7), ('line', 'Eira', E['bear'], 23.8, 25.4), ('pill', None, 'move_to → shrine', 23.6, 27.4),
                           ('you', None, YOU['k2'], 25.5, 28.7), ('line', 'Eira', E['stop1'], 28.8, 32.5), ('pill', None, 'stop → talk_to Brann', 29.0, 33.0),
                           ('line', 'Eira', E['stop2'], 32.6, 38.8), ('you', None, YOU['k3'], 39.0, 41.5), ('line', 'Eira', E['bard1'], 41.6, 45.9)], None, True, True),
  ('two1', 50.3, 53.4, 2.7, [('line', 'Eira', E['bard2'], 47.6, 50.7)], None, True, False),
  ('two2', 58.1, 59.8, 2.7, [('you', None, YOU['k4'], 55.4, 57.1)], None, True, False),
  ('two3', 63.6, 71.1, 2.7, [('pill', None, 'ask_about → the barrow', 60.9, 64.0), ('line', 'Eira', E['ans'], 61.0, 68.4)], (1.0, 1.14), True, False),
  ('two4', 74.5, 75.8, 2.7, [('you', None, YOU['k5'], 71.8, 73.1)], (1.14, 1.14), True, False),
  ('two5', 79.9, 84.0, 2.7, [('pill', None, 'open_pack', 77.2, 80.0), ('line', 'Eira', E['pack'], 77.3, 81.3)], (1.14, 1.04), True, False),
  ('end', 98.5, 101.8, 0, [], None, False, False),  # the in-take pack subtitle persists until 98.4 s, so the crane joins there
]
for _, _, _, _, subs, *_ in segs:
    for kind, spk, text, *_ in subs: sub(kind, text, spk)
json.dump(spec, open(os.path.join(S, 'spec.json'), 'w'))
if not os.environ.get('REUSE_SUBS'): subprocess.run(['node', os.path.join(D, 'subs.mjs'), S, os.path.join(S, 'spec.json')], check=True)
X264 = ['-c:v', 'libx264', '-profile:v', 'high', '-preset', 'medium', '-crf', '18', '-g', '120', '-bf', '2', '-pix_fmt', 'yuv420p', '-r', '60',
        '-x264-params', 'colorprim=bt709:transfer=bt709:colormatrix=bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709']
AAC = ['-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-ac', '2']
outs = []
for name, vs, ve, off, subs, zoom, band, lift in segs:
    dur = ve - vs; out = os.path.join(B, f'co-{name}.mp4'); outs.append(out)
    cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', str(vs), '-to', str(ve), '-i', SRC, '-ss', str(vs - off), '-to', str(ve - off), '-i', SRC, '-i', os.path.join(B, 'band-mask-tall.png' if name.startswith('two') else 'band-mask.png')]
    for kind, spk, text, t0, t1 in subs: cmd += ['-loop', '1', '-t', str(dur), '-i', os.path.join(S, f"s{sub(kind, text, spk)}.png")]
    f = '[0:v]scale=3840:2160:flags=lanczos,setsar=1,fps=60'
    if lift: f += ",curves=master='0/0 0.25/0.33 0.6/0.66 1/1',eq=saturation=1.08"
    if zoom:
        z0, z1 = zoom; z = f"({z0}+({z1}-{z0})*(3*pow(min(t/{dur},1),2)-2*pow(min(t/{dur},1),3)))"
        f += f",crop=w='iw/{z}':h='ih/{z}':x='(iw-ow)/2':y='(ih-oh)/2',scale=3840:2160:flags=lanczos"
    f += '[v0]'
    vi = 'v0'
    if band:
        bt, bh = (1280, 880) if name.startswith('two') else (1560, 600)  # the two-shot's in-take Brann box sits higher, so its frosted band starts higher
        f += f';[v0]split[vb][vc];[vc]crop=3840:{bh}:0:{bt},boxblur=110:3,eq=brightness=-0.24:saturation=0.85,format=rgba[bl];[2:v]format=gray[m];[bl][m]alphamerge[blm];[vb][blm]overlay=0:{bt}:format=auto[v1]'
        vi = 'v1'
    for k, (kind, spk, text, t0, t1) in enumerate(subs):
        a0, a1 = t0 - (vs - off), t1 - (vs - off)   # subtitle windows are audio-time, the band is picture-time: same clock within a segment
        a0, a1 = max(0, a0), min(dur, a1)
        f += f';[{3 + k}:v]format=rgba,fade=in:st={a0:.2f}:d=0.2:alpha=1,fade=out:st={a1 - 0.2:.2f}:d=0.2:alpha=1[s{k}];[{vi}][s{k}]overlay=0:0:shortest=1:enable=\'between(t,{a0:.2f},{a1:.2f})\'[v{k + 2}]'
        vi = f'v{k + 2}'
    if name == 'end': f += f';[{vi}]fade=out:st={dur - 0.6}:d=0.6[vo]'
    else: f += f';[{vi}]copy[vo]'
    f += f';[1:a]atrim=0:{dur},asetpts=PTS-STARTPTS,aresample=48000' + (f',afade=out:st={dur - 0.8}:d=0.8' if name == 'end' else '') + '[ao]'
    subprocess.run(cmd + ['-filter_complex', f, '-map', '[vo]', '-map', '[ao]', *X264, *AAC, '-t', str(dur), out], check=True); print('seg', name, round(dur, 1))
lst = os.path.join(B, 'co-list.txt'); open(lst, 'w').write(''.join(f"file '{p}'\n" for p in outs))
final = os.path.join(B, 'coldopen-v2.mp4')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c:v', 'copy', '-af', 'loudnorm=I=-16:TP=-2:LRA=11', *AAC, '-movflags', '+faststart', final], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', final, '-vf', 'scale=1920:1080', '-c:v', 'libx264', '-crf', '21', '-preset', 'fast', '-pix_fmt', 'yuv420p', '-c:a', 'copy', os.path.join(B, 'coldopen-v2-1080.mp4')], check=True)
print('done', sum(e - s for _, s, e, *_ in segs))
