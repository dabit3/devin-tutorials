"""Puts the live Glow Puck cold open (live/live.mp4: real GPT-Live-1 referee audio + real tool calls, captured from the web build in Chrome by coldopen.mjs) in front of a kit cut.
usage: python3 splice.py cap|nader|nomusic <intro.mp4>   (or: splice.py fit <mp4> to just squeeze a file under 95 MB)
  cap:   an 8 s title (live 34 s on, kit music bed, caption pills 0-1), then live 2-64.6 s with its real audio + caption pills, then 79-glow-puck-voice.mp4
  nader: live 34-64 s muted under Nader's three intro lines (intro/i*.png.wav), then the same 2.5-67.6 s, then 79-glow-puck-voice-nader.mp4
  nomusic: same as nader, onto 79-glow-puck-voice-nader-nomusic.mp4 (kit video + voiceonly.py audio: narration and real call audio, no music or SFX)
Caption pills come from caps.mjs (CAPPOS=top keeps them clear of the referee captions at the bottom). Output overwrites the kit cut."""
import glob, json, os, subprocess, sys
D = os.path.dirname(os.path.abspath(__file__))
mode, src = sys.argv[1], sys.argv[2]
B = os.path.join(D, 'build', 'splice'); os.makedirs(B, exist_ok=True)
CAPS = ["Today: a cross-platform game, built and tested by voice", "Built with Devin + Devin Voice, which uses ChatGPT voice under the hood",
        "Hollowmere's companion, Eira: a live voice on GPT-Live-1", "“Eira, walk us to the shrine” → a background move_to while she talks",
        "Interrupt her mid-sentence: “wait, wait, stop — go talk to Brann instead”", "She reroutes: stop, then a new move_to",
        "Change her style: “talk like an old bard from now on”", "She stays in character while the hero walks",
        "“Ask him about the barrow” → ask_about", "“What's in my pack?” → open_pack",
        "Our own check, live on GPT-Live-1: “Eira, mark the barrow”", "mark_waypoint fires: a beam of light at the barrow, a pin on the compass",
        "“Clear the marker” → clear_waypoint", "iPhone simulator: Devin saw the beam + pin at ~1 frame/min\nAndroid emulator: valley rendered (~1 fps), but the typed command stalled the app, so the marker was not checked\nNo physical devices were tested"]
subprocess.run(['node', os.path.join(D, 'caps.mjs'), B, *CAPS], env={**os.environ, 'CAPPOS': 'top'}, check=True)
cap = lambda i: os.path.join(B, f'cap{i}.png')
X264 = ['-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', '18', '-tune', 'animation', '-g', '120', '-bf', '2', '-pix_fmt', 'yuv420p',
        '-x264-params', 'colorprim=bt709:transfer=bt709:colormatrix=bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-r', '60']
AAC = ['-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-ac', '2']
def fit(path, mb=float(os.environ.get('MAXMB', 95))):
    """GitHub rejects files over 100 MB: two-pass re-encode to fit when the crf-18 splice is too big."""
    if os.path.getsize(path) <= mb * 1e6: return
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path], capture_output=True, text=True).stdout)
    kbps = int(mb * 8e3 / dur * 0.97) - 192
    tmp, log = path + '.fit.mp4', os.path.join(B, 'x264pass')
    v = ['-c:v', 'libx264', '-profile:v', 'high', '-preset', 'medium', '-b:v', f'{kbps}k', '-tune', 'animation', '-g', '120', '-bf', '2', '-pix_fmt', 'yuv420p', '-passlogfile', log]
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', path, *v, '-pass', '1', '-an', '-f', 'null', '-'], check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', path, *v, '-pass', '2', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', tmp], check=True)
    os.replace(tmp, path); print('fit', path, kbps, 'kbps', round(os.path.getsize(path) / 1e6, 1), 'MB')
    for f in glob.glob(log + '*'): os.remove(f)
if mode == 'fit': fit(src); sys.exit(0)
def seg(out, ss, to, caps, audio, source=None, dip=True, zoom=None):
    if os.environ.get('REUSE') and os.path.exists(out) and os.path.getsize(out) > 0: return out
    """caps: [(png index, t0, t1)] in segment time; audio: 'intro' or [(wav, t0)] or ('music', wav) or None"""
    dur = to - ss
    cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', str(ss), '-to', str(to), '-i', source or src]
    for i, _, _ in caps: cmd += ['-loop', '1', '-t', str(dur), '-i', cap(i)]
    wavs = audio if isinstance(audio, list) else []
    for w, _ in wavs: cmd += ['-i', w]
    if isinstance(audio, tuple): cmd += ['-i', audio[1]]
    f = f'[0:v]scale=3840:2160:flags=lanczos,setsar=1,fps=60'
    if zoom:  # eased punch-in (smoothstep between t0 and t1), framed on the upper-middle of the picture (the beam and the compass)
        z0, z1, t0, t1 = zoom; u = f'min(max((t-{t0})/{t1 - t0},0),1)'; z = f'({z0}+({z1}-{z0})*(3*pow({u},2)-2*pow({u},3)))'
        f += f",crop=w='iw/{z}':h='ih/{z}':x='(iw-ow)/2':y='(ih-oh)*0.3',scale=3840:2160:flags=lanczos"
    f += ',tpad=stop_mode=clone:stop_duration=60[v0]'
    for k, (i, t0, t1) in enumerate(caps):
        f += f';[{k + 1}:v]format=rgba,fade=in:st={t0}:d=0.25:alpha=1,fade=out:st={t1 - 0.25}:d=0.25:alpha=1[c{k}];[v{k}][c{k}]overlay=0:0:shortest=1[v{k + 1}]'
    vlast = f'[v{len(caps)}]'
    f += f';{vlast}fade=out:st={dur - 0.4}:d=0.4[vo]' if dip else f';{vlast}copy[vo]'
    if audio == 'copy':
        f += f';[0:a]apad,atrim=0:{dur},aresample=48000[ao]'
    elif audio == 'intro':
        f += f';[0:a]apad,atrim=0:{dur},loudnorm=I=-16:TP=-2:LRA=11,afade=out:st={dur - 0.5}:d=0.5,aresample=48000[ao]'
    elif wavs:
        n0 = 1 + len(caps)
        f += ''.join(f';[{n0 + k}:a]adelay={int(t * 1000)}:all=1[w{k}]' for k, (_, t) in enumerate(wavs))
        f += ';' + ''.join(f'[w{k}]' for k in range(len(wavs))) + f'amix=inputs={len(wavs)}:normalize=0,apad,atrim=0:{dur},loudnorm=I=-16:TP=-2:LRA=11,aresample=48000[ao]'
    elif isinstance(audio, tuple):
        f += f';[{1 + len(caps)}:a]apad,atrim=0:{dur},aresample=48000[ao]'
    else:
        f += f';anullsrc=r=48000:cl=stereo,atrim=0:{dur}[ao]'
    subprocess.run(cmd + ['-filter_complex', f, '-map', '[vo]', '-map', '[ao]', *X264, *AAC, '-t', str(dur), out], check=True)
    return out
# The cold open is build/coldopen-v2.mp4: coldopen_edit.py's cut of the take-9 live draft (real GPT-Live-1 audio, director opening,
# its own large subtitles), already 4K60 + loudnormed with the same x264/AAC settings, so it concatenates as-is.
live = os.path.join(B, '..', 'coldopen-v2.mp4')
# Intro teasers come from live/broll/video.webm (broll.mjs: no GPT-Live, typed commands + director camera) so nothing in the
# cold open is shown twice: valley flight, the cold shrine, the walk to the barrow, the frost hit, the relit brazier, the ending.
BROLL = os.path.join(D, 'live', 'broll', 'video.webm')
TEASE = [(10.5, 13.5), (112.5, 115.5), (20.5, 24.5), (68.0, 74.0), (87.5, 91.0), (94.5, 97.5), (136.8, 140.3), (58.5, 66.6)]  # the ending's white flash runs 135.8-136.6 s
def montage(name, wins):
    outs = [seg(os.path.join(B, f'{name}-{i}.mp4'), a, b, [], None, source=BROLL, dip=False) for i, (a, b) in enumerate(wins)]
    lst = os.path.join(B, f'{name}.txt'); open(lst, 'w').write(''.join(f"file '{p}'\n" for p in outs))
    out = os.path.join(B, f'{name}-v.mp4')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', out], check=True)
    return out
TEST = os.path.join(D, 'live', 'test.mp4')
# live/test.mp4 (take 3, rig-facing fix): t1 at 11.3 s, beam appears at 16.25 s and goes out at 26.5 s (seg 5.45 / 15.7); the last frame is held for the wrapped disclosure pill
TS0 = 10.8
TD = 26.0
TS0, TD, TZ = 15.8, 5.0, (1.35, 1.5, 0.4, 3.4)  # the beam is up from 16.25 s; the frame is held on the beam + compass pin, not the standing pair
test = seg(os.path.join(B, 'test.mp4'), TS0, TS0 + TD, [(11, 0.3, TD - 0.3)], 'intro', source=TEST, zoom=TZ)
BR1 = os.path.join(D, 'live', 'broll', 'video.webm')
WALK = (116.0, 134.8)  # broll1: the walk back to the shrine with the ember-stone, seen from behind
walk = seg(os.path.join(B, 'walk.mp4'), WALK[0], WALK[1], [(13, 0.3, 6.5)], None, source=BR1)
parts = [live]
if mode == 'cap':  # title card: the captioned cut has no narration, so pills 0-1 carry the intro line and the stack (Devin Voice = ChatGPT voice)
    MB = os.path.join(B, 'music'); os.makedirs(os.path.join(MB, 'build'), exist_ok=True)
    json.dump({'fps': 60, 'frames': 480, 'intro': 15, 'uiEnd': 440, 'clicks': [], 'typing': [], 'clips': [], 'caps': [], 'vo': [], 'voLate': []}, open(os.path.join(MB, 'build', 'cues.json'), 'w'))
    subprocess.run(['python3', os.path.join(D, '..', '_kit', 'tools', 'audio.py'), MB], check=True)
    music = os.path.join(B, 'music.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(MB, 'build', 'audio.wav'), '-t', '8', '-af', 'afade=t=out:st=7.3:d=0.7,loudnorm=I=-18:TP=-2:LRA=11', '-ar', '48000', '-ac', '2', music], check=True)
    tv = montage('title', [(10.5, 14.5), (136.8, 140.8)])
    parts = [seg(os.path.join(B, 'title.mp4'), 0, 8, [(0, 0.3, 3.8), (1, 4.0, 7.6)], ('music', music), source=tv), live]
name = '80-hollowmere-voice'
if mode in ('nader', 'nomusic'):
    I = json.load(open(os.path.join(D, 'intro', 'lines.json')))
    t, wavs, caps = 0.5, [], []
    for k, ci in zip(['i0.png', 'i1.png', 'i2.png'], [0, 1, 2]):
        wavs.append((os.path.join(D, 'intro', k + '.wav'), t)); caps.append((ci, t, t + I[k]['dur'] + 0.3)); t += I[k]["dur"] + 0.35
    tv = montage('teaser', TEASE)
    parts = [seg(os.path.join(B, 'teaser.mp4'), 0, min(t + 0.6, sum(b - a for a, b in TEASE)), caps, wavs, source=tv), live]
    # our live check of the feature, narrated (i3 over the ask, i4 over the beam / clear / native notes), real Eira audio under it
    tw = [(os.path.join(D, 'intro', 'i3.png.wav'), 0.3)]
    test = seg(os.path.join(B, 'test-n.mp4'), TS0, TS0 + TD, [(11, 0.3, TD - 0.3)], tw, source=TEST, zoom=TZ)
    walk = seg(os.path.join(B, 'walk-n.mp4'), WALK[0], WALK[1], [(13, 0.3, 6.5)], [(os.path.join(D, 'intro', 'i4.png.wav'), 0.4)], source=BR1)
    name += '-nader' + ('-nomusic' if mode == 'nomusic' else '')
kit = os.path.join(D, name + '.mp4')
# v3 (review notes): the chat-UI stretch of the call runs as a split screen — the kit frame as a 55 % card on the left over
# gameplay with its own audio from live/broll2 (unused footage, never the cold open), a sharp centre slice on the right —
# and the video ends on a native-4K gameplay beat (live/broll3) before the kit's recap card.
BR2, BR3 = os.path.join(D, 'live', 'broll2'), os.path.join(D, 'live', 'broll3')
def probe(path): return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path], capture_output=True, text=True).stdout)
def card_start(path):
    """First time in the kit's last 25 s where the frame goes near-white (the recap card fading in)."""
    end = probe(path); t0 = end - 25
    r = subprocess.run(['ffmpeg', '-v', 'info', '-y', '-ss', str(t0), '-i', path, '-vf', 'fps=10,scale=96:54,signalstats,metadata=print:key=lavfi.signalstats.YAVG', '-f', 'null', '-'], capture_output=True, text=True).stderr
    import re as _re
    ts = _re.findall(r'pts_time:([0-9.]+)', r); ys = _re.findall(r'YAVG=([0-9.]+)', r)
    for t, y in zip(ts, ys):
        if float(y) > 215: return t0 + float(t) - 0.1
    raise SystemExit('no recap card found')
def aud(src, ss, dur, out):  # broll audio.webm starts ~8.6 s after its video (recording hooks after Begin): align and trim
    a0 = max(0.0, ss - 8.6)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(a0), '-t', str(dur), '-i', src, '-af', f'adelay={int(max(0, 8.6 - ss) * 1000)}:all=1,apad,atrim=0:{dur}', '-ar', '48000', '-ac', '2', out], check=True); return out
PANE = [(os.path.join(BR2, 'video.mp4'), 10.0, 47.0), (os.path.join(BR2, 'video.mp4'), 62.0, 96.0), (os.path.join(BR2, 'video.mp4'), 106.0, 156.0),
        (os.path.join(D, 'live', 'broll', 'video.webm'), 24.5, 58.0)]  # unused footage only: flights, the mere walk, Brann, the barrow road + wight, the barrow walk
def pane(out):
    if os.environ.get('REUSE') and os.path.exists(out): return out
    outs = [seg(os.path.join(B, f'pane-{i}.mp4'), a, b, [], None, source=src, dip=False) for i, (src, a, b) in enumerate(PANE)]
    lst = os.path.join(B, 'pane.txt'); open(lst, 'w').write(''.join(f"file '{p}'\n" for p in outs))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', out], check=True); return out
def splitcall(kit, c0, c1, out, tp, g0=10.0):
    """Kit frame as a card filling the column height (chat column crop: UI x-centre 725 with the full-width chat, 300 once the Computer panel is open at tp),
    the right 42 % a sharp centre slice of unused gameplay, blurred/darkened copy behind, game audio -15 dB under the call."""
    if os.environ.get('REUSE') and os.path.exists(out): return out
    dur = c1 - c0; ga = aud(os.path.join(BR2, 'audio.webm'), g0, dur, os.path.join(B, 'split-game.wav')); pv = pane(os.path.join(B, 'pane-v.mp4'))
    S = 2060 / 810; CW = 2227
    f = ('[1:v]scale=3840:2160:flags=lanczos,fps=60,setsar=1,split[g1][g2];[g1]boxblur=40:2,eq=brightness=-0.28:saturation=0.8[bg];'
         f'[g2]crop={3840 - CW - 60}:2160:{(3840 - (3840 - CW - 60)) // 2 + 300}:0[slice];[bg][slice]overlay={CW + 60}:0[b1];'
         f"[0:v]scale={int(1440 * S)}:2060:flags=lanczos,fps=60,setsar=1,crop={CW}:2060:x='if(lt(t,{tp}),{int(725 * S) - CW // 2},{max(0, int(300 * S) - CW // 2)})':y=0,format=rgba[card];"
         f'[3:v]format=gray[m];[card][m]alphamerge[cardm];[b1][cardm]overlay=0:50:format=auto[vo];'
         f'[2:a]volume=0.18[gq];[0:a][gq]amix=inputs=2:normalize=0,atrim=0:{dur},aresample=48000[ao]')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(c0), '-to', str(c1), '-i', kit, '-ss', '0', '-t', str(dur), '-i', pv, '-i', ga,
                    '-i', os.path.join(B, '..', 'card-mask.png'), '-filter_complex', f, '-map', '[vo]', '-map', '[ao]', *X264, *AAC, '-t', str(dur), out], check=True)
    return out
cues = json.load(open(os.path.join(D, 'build', 'cues.json' if mode == 'cap' else 'cues-nader.json')))
cl = {c['file']: c['t'] / 60 for c in cues['clips']}
C0, C1 = cl['call1'] - 0.3, cl['call2'] + 24.6 + 1.0
SPLIT, KEND = card_start(kit), probe(kit)
k0 = seg(os.path.join(B, 'kit-a.mp4'), 0, C0, [], 'copy', source=kit, dip=False)
ks = splitcall(kit, C0, C1, os.path.join(B, 'kit-split.mp4'), tp=cl['call1'] + 110.7 - C0)
k1 = seg(os.path.join(B, 'kit-b.mp4'), C1, SPLIT, [], 'copy', source=kit)
outro = seg(os.path.join(B, 'kit-outro.mp4'), SPLIT, KEND, [], 'copy', source=kit)
BEAT = (19.0, 24.5)  # broll3: the forge, then out over the valley (earlier frames have the hero walking toward the lens)
beat = seg(os.path.join(B, 'outro-beat.mp4'), BEAT[0], BEAT[1], [], ('music', aud(os.path.join(BR3, 'audio.webm'), BEAT[0], BEAT[1] - BEAT[0], os.path.join(B, 'beat.wav'))), source=os.path.join(BR3, 'video.mp4'))
lst = os.path.join(B, 'list.txt'); open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts + [k0, ks, k1, test, walk, beat, outro]))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', '-movflags', '+faststart', kit], check=True)
print('kit', round(C0, 1), round(C1, 1), round(SPLIT, 1), round(KEND, 1))
print('spliced', kit)
fit(kit)
