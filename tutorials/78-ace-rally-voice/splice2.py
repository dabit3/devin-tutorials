"""Revised cold open for tutorial 78 (storyboard approved 2026-10-22): one continuous real take (intro/record-intro.mjs), cut as
  A  mid-rally on grass -> POWER SHOT / Winner! (the highlight point the script waited for)
  B  g1 "night court, Rex and Mina, quick set" -> live swap -> night rally -> g2 barge-in (hype) -> rally -> g3 score
  C  fresh points under Nader's intro narration (game audio ducked), then the kit cut (-nader / -nomusic / captioned)
Punch-ins on the Chair card (hard cut to a 1.6x crop of the top-left) while Nader's lines land and the tool chips appear.
usage: python3 splice2.py cap|nader|nomusic <take-dir with intro.mp4 + marks.json> [--dry]
Time overrides: env A0 A1 B0 B1 C0 (take seconds)."""
import json, os, subprocess, sys
D = os.path.dirname(os.path.abspath(__file__))
mode, take = sys.argv[1], sys.argv[2]
dry = '--dry' in sys.argv
src = os.path.join(take, 'intro.mp4'); M = json.load(open(os.path.join(take, 'marks.json')))
marks = M['marks']; plays = {p['name']: p for p in M['plays']}
def mark(prefix, after=0):
    for m in marks:
        if m['name'].startswith(prefix) and m['t'] >= after: return m
    return None
def env(k, v): return float(os.environ[k]) if k in os.environ else v
# ---- window selection from the marks ---------------------------------------------------------------------------
g1, g2, g3 = plays['g1']['rel'], plays['g2']['rel'], plays['g3']['rel']
hl = mark('match1 highlight')
# the highlight point: last point mark before the highlight mark that has a grade
pts = [m for m in marks if m['name'].startswith('point ') and m['t'] < (hl['t'] if hl else g1)]
hp = [m for m in pts if ('POWER SHOT' in m['name'] or 'Winner' in m['name'] or 'PERFECT' in m['name'])][-1] if pts else None
A1 = env('A1', (hp['t'] if hp else g1 - 8) + 1.9)  # end on the Winner! banner, before the replay (its far-end camera passes a light pole on grass)
A0 = env('A0', A1 - 10.5)
B0 = env('B0', g1 - 0.6)
g3ans = mark('g3 answered')
B1 = env('B1', (g3ans['t'] if g3ans else g3 + 6) + 5.5)
C0 = env('C0', 225.0)  # after the night highlight and its replay (ends ~224.6): no footage appears twice, no REPLAY badge
print(f'A {A0:.1f}-{A1:.1f}  B {B0:.1f}-{B1:.1f}  C from {C0:.1f}', 'highlight', hp['name'] if hp else None)
B = os.path.join(D, 'build', 'splice2'); os.makedirs(B, exist_ok=True)
CAPS = ["Chair, a live GPT-Live-1 umpire, is calling the match", "One sentence changes the court, the players and the format",
        "Three tools run while play continues", "Interrupt him any time", "A style tool runs, and he keeps talking", "Ask for the score: a tool reads it live",
        "Built with Devin + Devin Voice, which uses ChatGPT voice under the hood", "Chair talks and listens at the same time, on GPT-Live-1"]
if not dry and not os.environ.get('REUSE'):
    subprocess.run(['node', os.path.join(D, 'caps.mjs'), B, *CAPS], env={**os.environ, 'CAPPOS': 'top', 'CAPSIZE': '76'}, check=True)
    subprocess.run(['node', os.path.join(D, 'caps.mjs'), os.path.join(B, 'bottom'), *CAPS], env={**os.environ, 'CAPSIZE': '76'}, check=True)
# captions shown during a punch-in sit at the bottom, clear of the zoomed scoreboard and Chair card
BOTTOM = {1, 3, 5}
cap = lambda i: os.path.join(B, 'bottom' if i in BOTTOM else '', f'cap{i}.png')
X264 = ['-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', '18', '-tune', 'animation', '-g', '120', '-bf', '2', '-pix_fmt', 'yuv420p',
        '-x264-params', 'colorprim=bt709:transfer=bt709:colormatrix=bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-r', '60']
AAC = ['-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-ac', '2']
def seg(out, ss, to, caps, audio, punch=(), fade_in=False, push=None, fades=True, mask_you=False, hide_card=None):
    """caps: [(png index, t0, t1)] segment time; punch: [(t0, t1)] 1.6x crops of the top-left (Chair card); audio: 'take' | [(wav, t0)] with ducked game"""
    if os.environ.get('REUSE') and os.path.exists(out): return out
    dur = to - ss
    caps = [(i, max(0.0, round(t0, 3)), max(0.3, round(t1, 3))) for i, t0, t1 in caps]
    punch = [(max(0.0, round(t0, 3)), max(0.5, round(t1, 3))) for t0, t1 in punch]
    cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', f'{ss:.3f}', '-to', f'{to:.3f}', '-i', src]
    for i, _, _ in caps: cmd += ['-loop', '1', '-t', str(dur), '-i', cap(i)]
    wavs = audio if isinstance(audio, list) else []
    for w, _ in wavs: cmd += ['-i', w]
    f = '[0:v]scale=3840:2160:flags=lanczos,setsar=1,fps=60[v0]'
    n = 0
    if mask_you:
        # the off-cut setup line sits in the card's "You:" row: paint it out with the card colour
        f += f';[v{n}]drawbox=x=48:y=500:w=1540:h=78:color=0x0b1120@1:t=fill[v{n + 1}]'; n += 1
    if hide_card is not None:
        # Chair has gone quiet: take the frozen card out of the frame (delogo blends it into the stands) from hide_card s on
        f += f";[v{n}]delogo=x=36:y=372:w=1560:h=330:enable='gte(t,{hide_card})'[v{n + 1}]"; n += 1
    if push:
        # eased slow push-in: crop shrinks to 1/1.14 over the window, centred a little above the court middle
        p0, p1 = push
        k = f'(1+0.14*(0.5-0.5*cos(PI*clip((n/60-{p0})/({p1}-{p0}),0,1))))'
        f += f";[v{n}]crop=w='iw/{k}':h='ih/{k}':x='(iw-ow)/2':y='(ih-oh)',scale=3840:2160:flags=lanczos[v{n + 1}]"; n += 1
    for (t0, t1) in punch:
        f += f';[v{n}]split[p{n}a][p{n}b];[p{n}b]crop=2400:1350:0:0,scale=3840:2160:flags=lanczos,format=rgba,fade=in:st={t0}:d=0.5:alpha=1,fade=out:st={t1 - 0.5}:d=0.5:alpha=1[p{n}z]'
        f += f";[p{n}a][p{n}z]overlay=0:0:enable='between(t,{t0},{t1})'[v{n + 1}]"; n += 1
    for k, (i, t0, t1) in enumerate(caps):
        f += f';[{k + 1}:v]format=rgba,fade=in:st={t0}:d=0.25:alpha=1,fade=out:st={t1 - 0.25}:d=0.25:alpha=1[c{k}];[v{n}][c{k}]overlay=0:0:shortest=1[v{n + 1}]'; n += 1
    f += f';[v{n}]' + (f'fade=in:st=0:d=0.3,' if fade_in else '') + (f'fade=out:st={dur - 0.4}:d=0.4[vo]' if fades else 'null[vo]')
    if audio == 'take':
        f += f';[0:a]loudnorm=I=-16:TP=-2:LRA=11,' + (f'afade=in:st=0:d=0.3,afade=out:st={dur - 0.5}:d=0.5,' if fades else '') + 'aresample=48000[ao]'
    else:
        n0 = 1 + len(caps)
        f += ''.join(f';[{n0 + k}:a]adelay={int(t * 1000)}:all=1[w{k}]' for k, (_, t) in enumerate(wavs))
        f += f';[0:a]volume=0.22,apad[g];' + ''.join(f'[w{k}]' for k in range(len(wavs))) + f'[g]amix=inputs={len(wavs) + 1}:normalize=0,atrim=0:{dur},loudnorm=I=-16:TP=-2:LRA=11,afade=out:st={dur - 0.5}:d=0.5,aresample=48000[ao]'
    cmd += ['-filter_complex', f, '-map', '[vo]', '-map', '[ao]', *X264, *AAC, '-t', str(dur), out]
    if dry: print(' '.join(cmd)[:400]); return out
    subprocess.run(cmd, check=True); return out
# A: the highlight rally; caption after 3 s
segA = seg(os.path.join(B, 'a.mp4'), A0, A1, [(0, 3.0, A1 - A0 - 0.3)], 'take', fade_in=True, fades=False, mask_you=True)
# B: swap, barge-in, score, as short windows around the voice beats (dead rally time cut), joined with 0.4 s crossfades
r0 = B0
tools1 = mark('tool TOOL · VENUE: HARD', g1) or mark('match2', g1)
m2 = mark('match2', g1)
hyp = mark('tool TOOL · STYLE', g2)
sc = mark('tool TOOL · ', g3)
# the night-court highlight after the barge-in (long rally with a POWER SHOT / Winner), for the slow push-in
nite = [m for m in marks if m['name'].startswith('point ') and m['t'] > hyp['t'] + 4 and ('POWER SHOT' in m['name'] or 'Winner' in m['name'])
        and not (g3 - 12 < m['t'] < sc['t'] + 10)]  # not overlapping the score question
hp2 = nite[0] if nite else None
def win(a, b, caps=(), punch=(), push=None, tag=''):
    rr = lambda t: t - a
    return dict(a=a, b=b, caps=[(i, rr(t0), rr(t1)) for i, t0, t1 in caps], punch=[(rr(t0), rr(t1)) for t0, t1 in punch], push=(rr(push[0]), rr(push[1])) if push else None, tag=tag)
W = []
# B1: the swap request through the match card and the first exchanges on the night court (the ~1 s venue load is cut out)
g1b = plays.get('g1b')
if g1b and g1b['rel'] < m2['t']:
    # Chair acknowledged the first ask without running the tools; the re-ask is what swapped the match. Keep both, cut the wait between them.
    g1e = g1 + plays['g1']['dur']
    W.append(win(g1 - 0.6, g1e + 1.6, caps=[(1, g1 + 0.4, g1e + 1.4)], punch=[(g1 + 1.2, g1e + 0.4)], tag='swap-ask'))
    W.append(win(g1b['rel'] - 0.2, m2['t'] - 0.15, punch=[(g1b['rel'] + 0.4, min(g1b['rel'] + 4.2, m2['t'] - 0.2))], tag='swap-re-ask'))
else:
    W.append(win(g1 - 0.6, m2['t'] - 0.15, caps=[(1, g1 + 0.4, m2['t'] - 0.3)], punch=[(g1 + 1.2, m2['t'] - 0.2)], tag='swap-ask'))
W.append(win(m2['t'] + 1.0, min(m2['t'] + 5.5, g2 - 2.5), caps=[(2, m2['t'] + 1.6, m2['t'] + 5.0)], tag='night-start'))
# B2: the barge-in
W.append(win(g2 - 1.4, hyp['t'] + 3.8, caps=[(3, g2 - 0.4, g2 + 2.6), (4, hyp['t'] + 0.3, hyp['t'] + 3.6)], punch=[(g2 - 0.2, hyp['t'] + 2.6)], tag='barge-in'))
# B3: the long rally with the power-shot finish, slow push-in, then its far-end replay
if hp2:
    W.append(win(hp2['t'] - 9.0, hp2['t'] + 1.2, push=(hp2['t'] - 8.5, hp2['t'] - 1.0), tag='night-highlight'))  # out before the replay badge
# B4: the score question
W.append(win(g3 - 1.0, sc['t'] + 3.0, caps=[(5, g3 - 0.4, sc['t'] + 3.5)], punch=[(g3 - 0.2, sc['t'] + 3.6)], tag='score'))
W = sorted([w for w in W if w['b'] - w['a'] > 2.5], key=lambda w: w['a'])
for w in W: print(f"  B {w['tag']}: {w['a']:.1f}-{w['b']:.1f} ({w['b'] - w['a']:.1f} s)")
segsB = [seg(os.path.join(B, f"b{k}.mp4"), w['a'], w['b'], w['caps'], 'take', punch=w['punch'], push=w['push'], fades=False) for k, w in enumerate(W)]
def xfade(out, files, d=0.4):
    """join clips with video+audio crossfades"""
    if dry: return out
    durs = [float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout) for f in files]
    cmd = ['ffmpeg', '-v', 'error', '-y'] + sum([['-i', f] for f in files], [])
    fv, fa, off, v, a = '', '', 0.0, '[0:v]', '[0:a]'
    for k in range(1, len(files)):
        off += durs[k - 1] - d
        fv += f"{v}[{k}:v]xfade=transition=fade:duration={d}:offset={off:.3f}[xv{k}];"; v = f'[xv{k}]'
        fa += f"{a}[{k}:a]acrossfade=d={d}[xa{k}];"; a = f'[xa{k}]'
    subprocess.run(cmd + ['-filter_complex', (fv + fa).rstrip(';'), '-map', v, '-map', a, *X264, *AAC, '-movflags', '+faststart', out], check=True)
    return out
segB = xfade(os.path.join(B, 'b.mp4'), segsB)
parts = [segA, segB]
name = os.path.basename(D)
if mode in ('nader', 'nomusic'):
    I = json.load(open(os.path.join(D, 'intro', 'narration-lines.json')))  # the exact-opener take (i0/i1/i2.png.wav)
    t, wavs, caps = 0.6, [], []
    for k, ci in zip(['i0.png', 'i1.png'], [6, 7]):
        wavs.append((os.path.join(D, 'intro', k + '.wav'), t)); caps.append((ci, t + 0.2, t + I[k]['dur'] + 0.2)); t += I[k]['dur'] + 0.5
    parts.append(seg(os.path.join(B, 'c.mp4'), C0, C0 + t + 0.4, caps, wavs, hide_card=2.5))
    parts = [xfade(os.path.join(B, 'abc.mp4'), parts)]
    name += '-nader' + ('-nomusic' if mode == 'nomusic' else '')
final = os.path.join(D, name + '.mp4')
kit = os.environ.get('KIT') or final  # KIT=<compose.py output>: splice the split-screen cut instead of the raw kit build
if dry: sys.exit(0)
if '--draft' in sys.argv:
    # cold-open draft for review: A + B + C only, as a 1080p mp4 next to the take
    lst = os.path.join(B, 'draft.txt'); open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts))
    draft = os.path.join(take, 'coldopen-draft-1080p.mp4')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-vf', 'scale=1920:1080:flags=lanczos', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-movflags', '+faststart', draft], check=True)
    print('draft', draft); sys.exit(0)
norm = os.path.join(B, 'kit.mp4')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', kit, '-c:v', 'copy', *AAC, norm], check=True)
lst = os.path.join(B, 'list.txt'); open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts + [norm]))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', '-movflags', '+faststart', final], check=True)
print('spliced', final)
