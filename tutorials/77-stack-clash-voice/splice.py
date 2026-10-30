"""Puts the live gameplay cold open (take 8) (real GPT-Live-1 Coach audio, captured from the Chrome build) in front of a kit cut.
usage: python3 splice.py cap|nader|nomusic <intro.mp4>   (or: splice.py fit <mp4> to just squeeze a file under 95 MB)
  cap:   an 8 s title (intro 42.5 s on, kit music bed, caption pills 0-1), then intro 2.5-67.6 s with its real audio + caption pills, then 21-devin-voice.mp4
  nader: intro 42.5-66.9 s muted under Nader's three intro lines (intro/i*.png.wav), then the same 2.5-67.6 s, then 21-devin-voice-nader.mp4
  nomusic: same as nader, onto 21-devin-voice-nader-nomusic.mp4 (kit video + voiceonly.py audio: narration and real call audio, no music or SFX)
Caption pills come from caps.mjs (CAPPOS=top keeps them clear of the Coach panel). Output overwrites the kit cut."""
import glob, json, os, subprocess, sys
D = os.path.dirname(os.path.abspath(__file__))
mode, src = sys.argv[1], sys.argv[2]
B = os.path.join(D, 'build', 'splice'); os.makedirs(B, exist_ok=True)
CAPS = ["Today: a cross-platform game, with a new feature added by voice", "Built with Devin + Devin Voice, which uses ChatGPT voice under the hood",
        "RIVET: a live ringside announcer on GPT-Live-1", "\u201cSwitch the stage to Ember Fields\u201d: a background tool runs, the stage changes mid-match",
        "A scripted player vs the CPU; the voice lines are pre-recorded", "\u201cHow\u2019s the score?\u201d: RIVET answers from live match state",
        "Interrupt mid-sentence: \u201cactually, hold on\u2026\u201d", "Change its style: calm commentary",
        "Devin built the base game earlier; RIVET runs the game\u2019s tools in the background"]
subprocess.run(['node', os.path.join(D, 'caps.mjs'), B, *CAPS], env={**os.environ}, check=True)
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
def seg(out, ss, to, caps, audio):
    """caps: [(png index, t0, t1)] in segment time; audio: 'intro' or [(wav, t0)] or ('music', wav) or None"""
    dur = to - ss
    cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', str(ss), '-to', str(to), '-i', src]
    for i, _, _ in caps: cmd += ['-loop', '1', '-t', str(dur), '-i', cap(i)]
    wavs = audio if isinstance(audio, list) else []
    for w, _ in wavs: cmd += ['-i', w]
    if isinstance(audio, tuple): cmd += ['-i', audio[1]]
    f = f'[0:v]scale=3840:2160:flags=lanczos,setsar=1,fps=60[v0]'
    for k, (i, t0, t1) in enumerate(caps):
        f += f';[{k + 1}:v]format=rgba,fade=in:st={t0}:d=0.25:alpha=1,fade=out:st={t1 - 0.25}:d=0.25:alpha=1[c{k}];[v{k}][c{k}]overlay=0:0:shortest=1[v{k + 1}]'
    vlast = f'[v{len(caps)}]'
    f += f';{vlast}fade=out:st={dur - 0.4}:d=0.4[vo]'
    if audio == 'intro':
        f += f';[0:a]loudnorm=I=-16:TP=-2:LRA=11,afade=out:st={dur - 0.5}:d=0.5,aresample=48000[ao]'
    elif wavs:
        n0 = 1 + len(caps)
        f += ''.join(f';[{n0 + k}:a]adelay={int(t * 1000)}:all=1[w{k}]' for k, (_, t) in enumerate(wavs))
        f += f';[0:a]volume=0.2[g0]' + ';' + ''.join(f'[w{k}]' for k in range(len(wavs))) + f'[g0]amix=inputs={len(wavs) + 1}:normalize=0,apad,atrim=0:{dur},loudnorm=I=-16:TP=-2:LRA=11,aresample=48000[ao]'
    elif isinstance(audio, tuple):
        f += f';[{1 + len(caps)}:a]apad,atrim=0:{dur},aresample=48000[ao]'
    else:
        f += f';anullsrc=r=48000:cl=stereo,atrim=0:{dur}[ao]'
    subprocess.run(cmd + ['-filter_complex', f, '-map', '[vo]', '-map', '[ao]', *X264, *AAC, '-t', str(dur), out], check=True)
    return out
# take8 (real RIVET run, cut by ~/tools/expo/coldfinal.py): 0 QUAD slam, c2 stage 2.0, K.O. 5.8, ROUND 2 9.0, whip 14.5, c6 score 17.95,
# barge-in 24.65, c8 calm 31.45, calm reply ends 36.95, whip 37.8, K.O. 42.1, ROUND 3 45.0, round-3 play to 64.1 (intro narration goes here)
SPLIT = 37.8
live1 = seg(os.path.join(B, 'live1.mp4'), 0.0, SPLIT,
            [(2, 0.3, 5.5), (3, 5.8, 12.0), (4, 12.3, 17.5), (5, 17.9, 23.8), (6, 24.6, 30.6), (7, 31.4, 37.4)], 'intro')
END = 64.1
name = '77-stack-clash-voice'
if mode == 'cap':  # the captioned cut has no narration, so pills 0/1/8 carry the intro line and the stack (Devin Voice = ChatGPT voice)
    live2 = seg(os.path.join(B, 'live2.mp4'), SPLIT, END, [(0, 0.6, 8.6), (1, 9.0, 17.6), (8, 18.0, 25.6)], 'intro')
if mode in ('nader', 'nomusic'):  # Nader's three intro lines over the round-3 footage, game audio ducked under them
    I = json.load(open(os.path.join(D, 'intro', 'lines.json')))
    t, wavs, caps = 0.6, [], []
    for k, ci in zip(['i0.png', 'i1.png', 'i2.png'], [0, 1, 8]):
        wavs.append((os.path.join(D, 'intro', k + '.wav'), t)); caps.append((ci, t, t + I[k]['dur'] + 0.3)); t += I[k]["dur"] + 0.35
    live2 = seg(os.path.join(B, 'live2.mp4'), SPLIT, END, caps, wavs)
    name += '-nader' + ('-nomusic' if mode == 'nomusic' else '')
parts = [live1, live2]
kit = os.path.join(D, name + '.mp4')
norm = os.path.join(B, 'kit.mp4')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', kit, '-c:v', 'copy', *AAC, norm], check=True)
lst = os.path.join(B, 'list.txt'); open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts + [norm]))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', '-movflags', '+faststart', kit], check=True)
print('spliced', kit)
fit(kit)
