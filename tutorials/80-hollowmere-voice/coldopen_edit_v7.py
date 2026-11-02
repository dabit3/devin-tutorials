"""v7 cold-open edit of the live take 13 (live/v13/take-1080.mp4, conform.py-synced, real GPT-Live-1 Eira + Brann's ElevenLabs lines + Nader's lines).
No interruptions: director opening -> walk to Brann -> Brann greets aloud, Eira answers him -> real voice change (marin -> willow) -> Brann on the barrow
(Eira muted) -> pack -> move_to the shrine under the end crane. Dead air cut; the in-take subtitles are masked behind the frosted band and re-rendered by subs.mjs.
usage: python3 coldopen_edit_v7.py  -> build/coldopen-v7.mp4 (4K60) + build/coldopen-v7-1080.mp4"""
import json, os, subprocess
D = os.path.dirname(os.path.abspath(__file__)); B = os.path.join(D, 'build'); SRC = os.path.join(D, 'live', 'v13', 'take-1080.mp4')
S = os.path.join(B, 'subs7'); os.makedirs(S, exist_ok=True)
YOU = {'m1': "Eira, let's go talk to Brann at the watchpost.", 'm2': "Change your voice. Try a soft Irish one.", 'm3': "Ask him about the barrow.",
       'm4': "What's in my pack?", 'm5': "Alright, take us to the shrine."}
E = {'g1': "Friend, that shrine's gone dark, but there's smoke from the watchpost.", 'g2': "Let's see who's keeping that fire.",
     'w1': "You got it. I'll take us there.", 'w2': "We're off, boots crunching through snow toward Brann's fire.", 'w3': "I'll mind the talk when we reach him, hero.",
     'r1': "He's tougher than he looks.", 'r2': "We're fresh, and I've a good recollection of those tomb drafts.", 'r3': "Let's shoulder what he can't.",
     'v1': "Sure, just a breath.", 'v2': "Soft it is, friend. Go on. I'm here.",
     'a1': "Yeah, let's hear what he'll say.", 'a2': "Then there's our trail. We'll go fetch what was stolen.",
     'p1': "Let me have a look for you.", 'p2': "You've an iron sword and two health potions, and a full breath in your chest.",
     's1': "Right, I'll get us moving.", 's2': "Our boots crunch toward the standing stones, snow gathering on the old shoulders."}
BR = {'b1': "You're alive then. Good. Brann, warden of what's left.", 'b2': "The shrine-fire went out three nights back when the barrow cracked open.",
      'b3': "I'm too old to go in after the ember-stone. You're not.", 'b4': "Take this potion. You'll want it.",
      'b5': "The barrow was sealed before my grandmother was born.", 'b6': "Three nights ago the lintel cracked and the shrine-fire went out the same hour.",
      'b7': "Whatever walked out of there took the ember-stone with it."}
spec, idx = [], {}
def sub(kind, text, speaker=None):
    k = (kind, text)
    if k not in idx: idx[k] = len(spec); spec.append({'kind': kind, 'text': text, 'speaker': speaker})
    return idx[k]
L = lambda k, t0, t1: ('line', 'Eira', E[k], t0, t1)
Bn = lambda k, t0, t1: ('line', 'Brann', BR[k], t0, t1)
Y = lambda k, t0, t1: ('you', None, YOU[k], t0, t1)
P = lambda text, t0, t1: ('pill', None, text, t0, t1)
# (name, video ss, video to, audio offset (audio = video - off), subs [(kind, speaker, text, t0, t1) in AUDIO time], zoom (z0, z1) or None, band, lift)
CUT = os.path.join(D, 'live', 'cut7b', 'cut-1080.mp4')  # cutaways.mjs: cold shrine brazier, then a low dolly on the barrow doorway (conformed to real time)
CB, CW = 8.2, 15.4  # cutaway start times inside CUT (brazier shot, barrow shot); set from the scene-change probe
segs = [
  ('shrine', 5.2, 10.2, 3.8, [L('g1', 1.4, 5.6), L('g2', 5.8, 7.6)], None, True, False),     # J-cut: picture after the title fade, her greeting from 1.4 s
  ('vista', 10.2, 12.4, 3.8, [], None, False, False),
  ('watch', 12.4, 15.5, 3.8, [], None, False, False),
  ('settle', 17.0, 19.5, 0, [], None, True, True),
  ('walk', 19.5, 33.5, 0, [Y('m1', 20.4, 22.6), P('talk_to → Brann', 23.3, 27.0), L('w1', 23.8, 25.5), L('w2', 26.4, 29.5), L('w3', 29.9, 32.0)], None, True, True),
  ('arrive', 39.5, 42.3, 0, [], None, True, True),
  ('two1', 42.3, 47.0, 0, [Bn('b1', 42.3, 46.6)], (1.0, 1.06), True, False),
  ('cutbr', CB, CB + 4.0, CB - 47.0, [Bn('b2', 46.9, 50.9)], None, True, False, 'CUT'),   # cold brazier under "the shrine-fire went out"
  ('two1b', 51.0, 57.2, 0, [Bn('b3', 51.1, 54.6), Bn('b4', 54.8, 57.0)], (1.06, 1.12), True, False),
  ('two2', 57.2, 64.6, 0, [L('r1', 57.6, 59.0), L('r2', 59.2, 62.4), L('r3', 62.6, 64.4)], (1.12, 1.04), True, False),
  ('voice', 66.4, 75.8, 0, [Y('m2', 67.0, 68.9), L('v1', 70.0, 71.4), P('change_voice → willow', 71.2, 75.2), L('v2', 73.1, 75.6)], None, True, False),
  ('barrow', 77.0, 83.6, 0, [Y('m3', 77.4, 78.5), L('a1', 79.6, 80.3), P('ask_about → the barrow', 79.8, 83.2), Bn('b5', 80.3, 83.4)], (1.04, 1.10), True, False),
  ('cutbw', CW, CW + 8.3, CW - 83.6, [Bn('b6', 83.6, 88.2), Bn('b7', 88.4, 91.8)], None, True, False, 'CUT'),   # the barrow doorway under his answer
  ('barrowb', 91.9, 97.0, 0, [L('a2', 92.6, 96.6)], (1.10, 1.04), True, False),
  ('pack', 99.5, 110.4, 0, [Y('m4', 100.0, 100.9), P('open_pack', 101.5, 104.6), L('p1', 103.1, 104.3), L('p2', 104.8, 110.1)], (1.14, 1.04), True, False),
  ('shrine2', 112.6, 118.2, 0, [Y('m5', 113.0, 114.3), P('move_to → shrine', 114.8, 118.1), L('s1', 116.3, 117.6)], (1.04, 1.0), True, False),
  ('end', 118.2, 128.3, 0, [L('s2', 121.4, 127.4)], None, True, False),
]
for _, _, _, _, subs, *_ in segs:
    for kind, spk, text, *_ in subs: sub(kind, text, spk)
json.dump(spec, open(os.path.join(S, 'spec.json'), 'w'))
if not os.environ.get('REUSE_SUBS'): subprocess.run(['node', os.path.join(D, 'subs.mjs'), S, os.path.join(S, 'spec.json')], check=True)
X264 = ['-c:v', 'libx264', '-profile:v', 'high', '-preset', 'medium', '-crf', '18', '-g', '120', '-bf', '2', '-pix_fmt', 'yuv420p', '-r', '60',
        '-x264-params', 'colorprim=bt709:transfer=bt709:colormatrix=bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709']
AAC = ['-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-ac', '2']
outs = []
TWO = ('two1', 'two1b', 'two2', 'voice', 'barrow', 'barrowb', 'pack', 'shrine2')  # in-take Brann/Eira text sits higher in the dialogue shot
for name, vs, ve, off, subs, zoom, band, lift, *rest in segs:
    vsrc = CUT if rest and rest[0] == 'CUT' else SRC
    dur = ve - vs; out = os.path.join(B, f'co-{name}.mp4'); outs.append(out)
    cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', str(vs), '-to', str(ve), '-i', vsrc, '-ss', str(vs - off), '-to', str(ve - off), '-i', SRC, '-i', os.path.join(B, 'band-mask7-tall.png' if name in TWO else 'band-mask7.png')]
    for kind, spk, text, t0, t1 in subs: cmd += ['-loop', '1', '-t', str(dur), '-i', os.path.join(S, f"s{sub(kind, text, spk)}.png")]
    f = '[0:v]scale=3840:2160:flags=lanczos,setsar=1,fps=60'
    if lift: f += ",curves=master='0/0 0.25/0.33 0.6/0.66 1/1',eq=saturation=1.08"
    if zoom:
        z0, z1 = zoom; z = f"({z0}+({z1}-{z0})*(3*pow(min(t/{dur},1),2)-2*pow(min(t/{dur},1),3)))"
        f += f",crop=w='iw/{z}':h='ih/{z}':x='(iw-ow)/2':y='(ih-oh)/2',scale=3840:2160:flags=lanczos"
    f += '[v0]'
    vi = 'v0'
    if band:
        blur = 'boxblur=lr=220:lp=3:cr=110:cp=3' if name in TWO else 'boxblur=lr=170:lp=3:cr=85:cp=3'  # chroma radius must stay < strip/4
        bt, bh = (1700, 460) if name in TWO else (1800, 360)  # just the in-take subtitle strip (y 897-1020 / 943-1020 at 1080p)
        f += f';[v0]split[vb][vc];[vc]crop=3840:{bh}:0:{bt},{blur},eq=brightness=-0.26:saturation=0.85,format=rgba[bl];[2:v]format=gray[m];[bl][m]alphamerge[blm];[vb][blm]overlay=0:{bt}:format=auto[v1]'
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
final = os.path.join(B, 'coldopen-v7.mp4')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c:v', 'copy', '-af', 'loudnorm=I=-16:TP=-2:LRA=11', *AAC, '-movflags', '+faststart', final], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', final, '-vf', 'scale=1920:1080', '-c:v', 'libx264', '-crf', '21', '-preset', 'fast', '-pix_fmt', 'yuv420p', '-c:a', 'copy', os.path.join(B, 'coldopen-v7-1080.mp4')], check=True)
print('done', sum(e - s for _, s, e, *_ in segs))
