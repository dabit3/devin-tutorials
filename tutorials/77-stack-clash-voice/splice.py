"""Puts the live gameplay intro (real GPT-Live-1 Coach audio, captured from the Chrome build) in front of a kit cut.
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
        "RIVET: a live ringside announcer on GPT-Live-1", "Talk to it: “start a best-of-one match against the CPU on hard”",
        "A background tool starts the match while RIVET keeps talking", "“Switch the stage to Ember Fields”: another tool runs, the stage changes live",
        "Interrupt mid-sentence: “actually, hold on…”", "Change its style: calm commentary"]
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
        f += ';' + ''.join(f'[w{k}]' for k in range(len(wavs))) + f'amix=inputs={len(wavs)}:normalize=0,apad,atrim=0:{dur},loudnorm=I=-16:TP=-2:LRA=11,aresample=48000[ao]'
    elif isinstance(audio, tuple):
        f += f';[{1 + len(caps)}:a]apad,atrim=0:{dur},aresample=48000[ao]'
    else:
        f += f';anullsrc=r=48000:cl=stereo,atrim=0:{dur}[ao]'
    subprocess.run(cmd + ['-filter_complex', f, '-map', '[vo]', '-map', '[ao]', *X264, *AAC, '-t', str(dur), out], check=True)
    return out
# real Coach run (segment time = intro time): STT of the intro audio sets these windows
S0 = 1.0  # take3.mp4 (real RIVET run): title, click TALK TO RIVET at 2.5 s, greeting to 12.3, c1b 12.9, match 21.5, c2 39.8 (stage ~44), c6 57.1, interrupt 64.5, c8 calm 79.5, reply ends 86.9
live = seg(os.path.join(B, 'live.mp4'), S0, 96.0,
           [(i, a - S0, b - S0) for i, a, b in [(2, 3.0, 12.0), (3, 12.6, 20.5), (4, 21.0, 32.0), (5, 39.5, 50.0), (6, 56.8, 66.0), (7, 79.2, 88.0)]], 'intro')
TS = 45.0  # title/teaser footage: Ember Fields gameplay
parts = [live]
if mode == 'cap':  # title card: the captioned cut has no narration, so pills 0-1 carry the intro line and the stack (Devin Voice = ChatGPT voice)
    MB = os.path.join(B, 'music'); os.makedirs(os.path.join(MB, 'build'), exist_ok=True)
    json.dump({'fps': 60, 'frames': 480, 'intro': 15, 'uiEnd': 440, 'clicks': [], 'typing': [], 'clips': [], 'caps': [], 'vo': [], 'voLate': []}, open(os.path.join(MB, 'build', 'cues.json'), 'w'))
    subprocess.run(['python3', os.path.join(D, '..', '_kit', 'tools', 'audio.py'), MB], check=True)
    music = os.path.join(B, 'music.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(MB, 'build', 'audio.wav'), '-t', '8', '-af', 'afade=t=out:st=7.3:d=0.7,loudnorm=I=-18:TP=-2:LRA=11', '-ar', '48000', '-ac', '2', music], check=True)
    parts = [seg(os.path.join(B, 'title.mp4'), TS, TS + 8, [(0, 0.3, 3.8), (1, 4.0, 7.6)], ('music', music)), live]
name = '77-stack-clash-voice'
if mode in ('nader', 'nomusic'):
    I = json.load(open(os.path.join(D, 'intro', 'lines.json')))
    t, wavs, caps = 0.5, [], []
    for k, ci in zip(['i0.png', 'i1.png', 'i2.png'], [0, 1, 2]):
        wavs.append((os.path.join(D, 'intro', k + '.wav'), t)); caps.append((ci, t, t + I[k]['dur'] + 0.3)); t += I[k]["dur"] + 0.35
    parts = [seg(os.path.join(B, 'teaser.mp4'), TS, TS + t + 0.6, caps, wavs), live]
    name += '-nader' + ('-nomusic' if mode == 'nomusic' else '')
kit = os.path.join(D, name + '.mp4')
norm = os.path.join(B, 'kit.mp4')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', kit, '-c:v', 'copy', *AAC, norm], check=True)
lst = os.path.join(B, 'list.txt'); open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts + [norm]))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', '-movflags', '+faststart', kit], check=True)
print('spliced', kit)
fit(kit)
