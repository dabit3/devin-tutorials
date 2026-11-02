"""Split-screen calls and a gameplay ending for the kit cut of tutorial 78.
usage: python3 compose.py <kit.mp4> <take-dir> <out.mp4> [--vo <recap.wav>] [--cap]
Calls: the left 55 % of the frame is the kit's chat column (genspec frames it with BASE1/BASE2: x 864-2976 for call 1, x 0-2112
for call 2), the right 45 % is live take footage from windows the cold open never uses, its game audio ducked under the call.
Ending: kit[0:uiEnd] + a sharp full-frame gameplay clip (recap narration with --vo, a caption pill with --cap) + the kit's end card."""
import json, os, subprocess, sys
D = os.path.dirname(os.path.abspath(__file__))
kit, take, out = sys.argv[1:4]
vo = sys.argv[sys.argv.index('--vo') + 1] if '--vo' in sys.argv else None
cap = '--cap' in sys.argv
src = os.path.join(take, 'intro.mp4')
W = os.path.join(D, 'build', 'compose'); os.makedirs(W, exist_ok=True)
X264 = ['-c:v', 'libx264', '-profile:v', 'high', '-preset', 'medium', '-crf', os.environ.get('CRF', '20'), '-tune', 'animation', '-g', '120', '-bf', '2', '-pix_fmt', 'yuv420p',
        '-x264-params', 'colorprim=bt709:transfer=bt709:colormatrix=bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-r', '60']
AAC = ['-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-ac', '2']
run = lambda cmd: subprocess.run(cmd, check=True)
dur = lambda p: float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout)

c = json.load(open(os.environ.get('CUES') or os.path.join(D, 'build', 'cues.json')))  # CUES=<copy>: the next build rewrites build/cues.json
CUT = (c['intro'] + 72) / 60   # the kit's title card (introHold 0) and its 1.2 s window entrance are cut: the cut opens on the environment menu
st = {s['img']: s['t0'] / 60 - CUT for s in c['steps']}
B = json.load(open(os.path.join(D, 'shots', 'beats.json')))
T = lambda m: st[next(b['img'] for b in B if b.get('mark') == m)]
R1 = (st[next(b['img'] for b in B if b.get('call') == 'call1' and b['img'] in st)], T('call1-ended'))   # first kept call still: the blank "Calling…" stills before Devin's greeting are trimmed by shots/call1.json t0
done2 = next(b['img'] for b in B if b.get('call') == 'call2' and b.get('phase') == 'done')
R2 = (T('call2-start'), st[done2])   # the split ends when call 2 is done; the "End the call" beat shows the session itself
UI_END = c['uiEnd'] / 60 - CUT
D1, D2 = R1[1] - R1[0], R2[1] - R2[0]
print(f'call 1 {R1[0]:.2f}-{R1[1]:.2f} ({D1:.1f} s)  call 2 {R2[0]:.2f}-{R2[1]:.2f} ({D2:.1f} s)  ui end {UI_END:.2f}')

# take windows the cold open does not use (splice2: A 61.4-71.9, B 84.1-91.2 / 101.8-114.1 / 133.7-143.5 / 155.7-163.5 / 201.6-211.8, C 225-248)
# and none of the replays (REPLAY badge ~1-14 s after a Winner!: 72-84, 167-180, 212-225), plus BROLL, a second scripted take on the night court
BROLL = os.environ.get('BROLL')  # <mp4> already cropped to the game viewport
REEL = [(src, 248.5, 290.3), (src, 181.5, 201.6), (src, 114.1, 133.7), (src, 143.5, 155.7), (src, 91.2, 101.8), (src, 46.5, 61.4)]
# red-pill scan of the b-roll (top-centre band, 2 fps): REPLAY badge 70.75-83.25 s (fade-in to fade-out), so that window is out
if BROLL: REEL = [(BROLL, float(a), float(b)) for a, b in (w.split('-') for w in os.environ.get('BROLL_WINDOWS', '14.0-69.5,84.2-107.5').split(','))] + REEL
OUTRO = (290.3, 297.4)   # "Mina sends a rocket" … point 10 Winner!, out before its replay
import hashlib
reel = os.path.join(W, 'reel-%s.mp4' % hashlib.md5(repr(REEL).encode()).hexdigest()[:8])   # cache keyed on the windows: a stale reel kept a replay in once
if not os.path.exists(reel):
    # one clip per window (input seeking), then a concat: trimming seven windows out of one decode queues hundreds of frames
    lst = os.path.join(W, 'reel.txt'); parts = []
    for i, (f, a, b) in enumerate(REEL):
        part = os.path.join(W, f'reel{i}.mp4'); parts.append(part)
        run(['ffmpeg', '-v', 'error', '-y', '-ss', str(a), '-to', str(b), '-i', f, '-vf', 'scale=3840:2160:flags=lanczos,crop=1728:2160:1600:0,fps=60',  # crop starts past the Chair card (x 36-1596)
             *X264, *AAC, part])
    open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts))
    run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', reel])
    print('reel', dur(reel))
avail = sum(b - a for _, a, b in REEL) - 0.3
if D1 + D2 > avail:   # end the second split early rather than show any footage twice
    R2 = (R2[0], R2[0] + avail - D1); D2 = R2[1] - R2[0]; print(f'call 2 split shortened to {D2:.1f} s (footage budget)')
assert D2 > 10, 'not enough unused footage'

clip = os.path.join(W, 'outro.mp4')
od = OUTRO[1] - OUTRO[0]
cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', str(OUTRO[0]), '-to', str(OUTRO[1]), '-i', src]
f = f'[0:v]scale=3840:2160:flags=lanczos,setsar=1,fps=60,drawbox=x=48:y=500:w=1540:h=78:color=0x0b1120@1:t=fill,fade=in:st=0:d=0.3,fade=out:st={od - 0.4}:d=0.4[v0]'  # the stale "You:" row is painted out
n = 0
if cap:
    capdir = os.path.join(W, 'caps')
    if not os.path.exists(os.path.join(capdir, 'cap0.png')):
        subprocess.run(['node', os.path.join(D, 'caps.mjs'), capdir, "That's how you add and test a feature by voice"], env={**os.environ, 'CAPPOS': 'top', 'CAPSIZE': '76'}, check=True)
    cmd += ['-loop', '1', '-t', str(od), '-i', os.path.join(capdir, 'cap0.png')]
    f += f';[1:v]format=rgba,fade=in:st=0.6:d=0.25:alpha=1,fade=out:st={od - 1.2}:d=0.25:alpha=1[c];[v0][c]overlay=0:0:shortest=1[v1]'; n = 1
if vo:
    cmd += ['-i', vo]
    f += f';[{1 + int(cap)}:a]adelay=500:all=1[w];[0:a]volume=0.35,apad[g];[w][g]amix=inputs=2:normalize=0,atrim=0:{od}[a0]'
else:
    f += f';[0:a]volume=0.7,atrim=0:{od}[a0]'
f += f';[a0]loudnorm=I=-16:TP=-2:LRA=11,afade=in:st=0:d=0.3,afade=out:st={od - 0.5}:d=0.5,aresample=48000[ao]'
run(cmd + ['-filter_complex', f, '-map', f'[v{n}]', '-map', '[ao]', *X264, *AAC, '-t', str(od), clip])

fi = lambda a, b: f'format=rgba,fade=in:st={a}:d=0.3:alpha=1,fade=out:st={b - 0.3}:d=0.3:alpha=1'
f = (f'[0:v]trim=start={CUT},setpts=PTS-STARTPTS,split=3[base][l1][l2];[0:a]atrim=start={CUT},asetpts=PTS-STARTPTS[ka];'
     '[l1]crop=2112:2160:864:0[L1];[l2]crop=2112:2160:0:0[L2];'
     f'[1:v]split[r1][r2];[r1]trim=0:{D1},setpts=PTS-STARTPTS,tpad=start_duration={R1[0]}:start_mode=add,{fi(R1[0], R1[1])}[P1];'
     f'[r2]trim={D1}:{D1 + D2},setpts=PTS-STARTPTS,tpad=start_duration={R2[0]}:start_mode=add,{fi(R2[0], R2[1])}[P2];'
     f"[base][L1]overlay=0:0:enable='between(t,{R1[0]},{R1[1]})'[v1];[v1][P1]overlay=2112:0:eof_action=pass:enable='between(t,{R1[0]},{R1[1]})'[v2];"
     f"[v2][L2]overlay=0:0:enable='between(t,{R2[0]},{R2[1]})'[v3];[v3][P2]overlay=2112:0:eof_action=pass:enable='between(t,{R2[0]},{R2[1]})'[vm];"
     f'[1:a]asplit[ra1][ra2];[ra1]atrim=0:{D1},asetpts=PTS-STARTPTS,adelay={int(R1[0] * 1000)}:all=1,volume=0.12[A1];'
     f'[ra2]atrim={D1}:{D1 + D2},asetpts=PTS-STARTPTS,adelay={int(R2[0] * 1000)}:all=1,volume=0.12[A2];'
     '[ka][A1][A2]amix=inputs=3:normalize=0:duration=first[am];'
     f'[vm]split[vmA][vmB];[vmA]trim=0:{UI_END},setpts=PTS-STARTPTS[va];[vmB]trim={UI_END}:{UI_END + 3.0},setpts=PTS-STARTPTS,fade=in:st=0:d=0.3,fade=out:st=2.6:d=0.4[vb];'
     f'[am]asplit[amA][amB];[amA]afade=out:st={UI_END - 0.4}:d=0.4,atrim=0:{UI_END},asetpts=PTS-STARTPTS,aformat=sample_rates=48000:channel_layouts=stereo[aa];'
     f'[amB]atrim={UI_END}:{UI_END + 3.0},asetpts=PTS-STARTPTS,afade=in:st=0:d=0.4,afade=out:st=2.5:d=0.5,aformat=sample_rates=48000:channel_layouts=stereo[ab];'
     '[2:a]aformat=sample_rates=48000:channel_layouts=stereo[ac];'
     '[va][aa][2:v][ac][vb][ab]concat=n=3:v=1:a=1[vo][ao]')
run(['ffmpeg', '-v', 'error', '-y', '-i', kit, '-i', reel, '-i', clip, '-filter_complex', f, '-map', '[vo]', '-map', '[ao]', *X264, *AAC, '-movflags', '+faststart', out])
print('composed', out, dur(out))
