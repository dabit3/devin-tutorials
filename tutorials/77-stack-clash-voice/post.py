"""Post-processes a built kit cut before splice.py: split-screen call sections (chat column left 60 %, unused take footage right 40 %,
game audio ducked) and a live game clip in place of the outro still. usage: python3 post.py <kit.mp4> <cues.json> <out.mp4>
Footage (all VOLT vs BLUSH, none of it in the cold open): call 1 = take8 40-61 + 131.5-200.5, call 2 = take8 61-84.2, outro = take6 76.5-87."""
import json, os, subprocess, sys
kit, cues, out = sys.argv[1], json.load(open(sys.argv[2])), sys.argv[3]
R = os.path.expanduser('~/tools/expo/rec'); FPS = 60
B = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'build', 'post'); os.makedirs(B, exist_ok=True)
X264 = ['-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', '60', '-x264-params', 'colorprim=bt709:transfer=bt709:colormatrix=bt709',
        '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709']
AAC = ['-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-ac', '2']
def dur(p): return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout)
total = dur(kit)
c1 = cues['clips'][0]['t'] / FPS; c2 = cues['clips'][1]['t'] / FPS
L1, L2 = 89.34 + 0.6, 23.2 + 0.6                                   # audio/call1.wav, audio/call2.wav + settle
ui_end = cues['uiEnd'] / FPS
outro = (cues['caps'][-1] if cues.get('caps') else cues['vo'][-1]['t']) / FPS
print('call1', round(c1, 2), 'call2', round(c2, 2), 'outro', round(outro, 2), 'uiEnd', round(ui_end, 2), 'total', round(total, 2))
def game(segs, need, dst):
    """concat take segments (whip joints) and trim to `need` seconds"""
    F, C = [], []
    for i, (f, a, b) in enumerate(segs):
        F.append(f'[{i}:v]trim=start={a}:end={b},setpts=PTS-STARTPTS,fps=60[v{i}]'); F.append(f'[{i}:a]atrim=start={a}:end={b},asetpts=PTS-STARTPTS[a{i}]'); C.append(f'[v{i}][a{i}]')
    fc = ';'.join(F) + ';' + ''.join(C) + f'concat=n={len(segs)}:v=1:a=1[v][a]'
    ins = sum((['-i', os.path.join(R, f)] for f, _, _ in segs), [])
    subprocess.run(['ffmpeg', '-v', 'error', '-y', *ins, '-filter_complex', fc, '-map', '[v]', '-map', '[a]', '-t', str(need), '-c:v', 'libx264', '-preset', 'fast', '-crf', '16', '-c:a', 'aac', '-b:a', '256k', dst], check=True)
    return dst
def split(ss, length, footage, dst, layout):
    """layout 'chat': left = kit chat column UI 275-1167 (4K x 733..3113, 1:1) | right 1460: game 848x900 (x=384) -> 1460x1550 over blur fill.
       layout 'pane': left = kit left pane UI x0-540,y202.5-810 scaled to 1920x2160 | right 1920: game -> 1920x2038 over blur fill.
       Call audio + game audio at -16 dB. The game's small event ticker is masked (delogo) before scaling."""
    if layout == 'chat':
        L = 'crop=2380:2160:733:0'; RW, GH, GY = 1460, 1550, 305
    else:
        L = 'crop=1440:1620:0:540,scale=1920:2160:flags=lanczos'; RW, GH, GY = 1920, 2038, 61
    fc = (f'[0:v]trim=start={ss}:end={ss + length},setpts=PTS-STARTPTS,{L}[L];'
          f'[1:v]crop=848:900:384:0,delogo=x=176:y=864:w=480:h=32:show=0,split[g1][g2];'
          f'[g1]scale={RW}:2160:flags=lanczos,boxblur=40:8,eq=brightness=-0.18[bg];[g2]scale={RW}:{GH}:flags=lanczos[fg];'
          f'[bg][fg]overlay=0:{GY}[Rr];[L][Rr]hstack=inputs=2,format=yuv420p[v];'
          f'[0:a]atrim=start={ss}:end={ss + length},asetpts=PTS-STARTPTS[ka];[1:a]volume=0.16,apad[ga];[ka][ga]amix=inputs=2:duration=first:normalize=0[a]')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', kit, '-i', footage, '-filter_complex', fc, '-map', '[v]', '-map', '[a]', '-t', str(length), *X264, *AAC, dst], check=True)
    return dst
def plain(ss, to, dst):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(ss), '-to', str(to), '-i', kit, *X264, *AAC, dst], check=True); return dst
def outro_clip(ss, to, dst):
    """take6 K.O. moment (full frame) with the kit's outro caption/subtitles (rendered over black) keyed on top, kit audio"""
    n = to - ss
    fc = (f'[1:v]trim=start=76.5:end={76.5 + n},setpts=PTS-STARTPTS,scale=3840:2160:flags=lanczos,fps=60,drawbox=x=0:y=1850:w=3840:h=310:color=black@0.45:t=fill[g];'
          f'[0:v]trim=start={ss}:end={to},setpts=PTS-STARTPTS,colorkey=0x000000:0.25:0.1[k];[g][k]overlay=0:0:shortest=1,fade=out:st={n - 0.4}:d=0.4,format=yuv420p[v];'
          f'[0:a]atrim=start={ss}:end={to},asetpts=PTS-STARTPTS[a]')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', kit, '-i', os.path.join(R, 'take6.mp4'), '-filter_complex', fc, '-map', '[v]', '-map', '[a]', '-t', str(n), *X264, *AAC, dst], check=True); return dst
g1 = game([('take8.mp4', 40.0, 61.0), ('take8.mp4', 131.5, 200.5)], L1, os.path.join(B, 'g1.mp4'))
g2 = game([('take8.mp4', 61.0, 84.2)], L2, os.path.join(B, 'g2.mp4'))
NARR = bool(cues.get('vo'))
T0 = cues['intro'] / FPS + (2.7 if NARR else 0.8)     # title + first beat (with its VO in the narrated cut)
T1 = 0.8 if NARR else 2.2                              # tail of the pick: the punch-in on the voice-call button
def pick(dst):
    """macOS pick <= 3 s: keep the title + first beat, jump to the call-button punch-in (kit audio crossfaded)"""
    fc = (f'[0:v]trim=start=0:end={T0},setpts=PTS-STARTPTS[v0];[0:v]trim=start={c1 - T1}:end={c1},setpts=PTS-STARTPTS[v1];[v0][v1]concat=n=2:v=1:a=0[v];'
          f'[0:a]atrim=start=0:end={T0},asetpts=PTS-STARTPTS[a0];[0:a]atrim=start={c1 - T1}:end={c1},asetpts=PTS-STARTPTS[a1];[a0][a1]acrossfade=d=0.08[a]')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', kit, '-filter_complex', fc, '-map', '[v]', '-map', '[a]', *X264, *AAC, dst], check=True); return dst
parts = [pick(os.path.join(B, 'p0.mp4')), split(c1, L1, g1, os.path.join(B, 's1.mp4'), 'chat'), plain(c1 + L1, c2, os.path.join(B, 'p1.mp4')),
         split(c2, L2, g2, os.path.join(B, 's2.mp4'), 'pane'), plain(c2 + L2, outro, os.path.join(B, 'p2.mp4')), outro_clip(outro, ui_end, os.path.join(B, 'o.mp4')), plain(ui_end, total, os.path.join(B, 'p3.mp4'))]
lst = os.path.join(B, 'list.txt'); open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', '-movflags', '+faststart', out], check=True)
print('post', out, round(dur(out), 2))
