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
def seg(out, ss, to, caps, audio, source=None):
    if os.environ.get('REUSE') and os.path.exists(out) and os.path.getsize(out) > 0: return out
    """caps: [(png index, t0, t1)] in segment time; audio: 'intro' or [(wav, t0)] or ('music', wav) or None"""
    dur = to - ss
    cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', str(ss), '-to', str(to), '-i', source or src]
    for i, _, _ in caps: cmd += ['-loop', '1', '-t', str(dur), '-i', cap(i)]
    wavs = audio if isinstance(audio, list) else []
    for w, _ in wavs: cmd += ['-i', w]
    if isinstance(audio, tuple): cmd += ['-i', audio[1]]
    f = f'[0:v]scale=3840:2160:flags=lanczos,setsar=1,fps=60,tpad=stop_mode=clone:stop_duration=60[v0]'
    for k, (i, t0, t1) in enumerate(caps):
        f += f';[{k + 1}:v]format=rgba,fade=in:st={t0}:d=0.25:alpha=1,fade=out:st={t1 - 0.25}:d=0.25:alpha=1[c{k}];[v{k}][c{k}]overlay=0:0:shortest=1[v{k + 1}]'
    vlast = f'[v{len(caps)}]'
    f += f';{vlast}fade=out:st={dur - 0.4}:d=0.4[vo]'
    if audio == 'intro':
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
# live/stt.json windows for the Hollowmere take: k1 9.3 s, "wait, wait, stop" 13.1, bard 19.6, barrow 39.1, pack 44.7
S0 = 1.0
live = seg(os.path.join(B, 'live.mp4'), S0, 53.4,
           [(i, a - S0, b - S0) for i, a, b in [(2, 2.4, 8.8), (3, 9.2, 12.9), (4, 13.1, 16.2), (5, 16.4, 19.3), (6, 19.6, 24.2), (7, 24.5, 35.7), (8, 38.9, 44.3), (9, 44.7, 52.6)]], 'intro')
TEST = os.path.join(D, 'live', 'test.mp4')
# beam appears at 21.0 s and goes out at 30.0 s in live/test.mp4 (seg 12.5 / 21.5); the last frame is held for the wrapped disclosure pill
TD = 29.0
test = seg(os.path.join(B, 'test.mp4'), 8.5, 8.5 + TD, [(10, 0.3, 12.2), (11, 12.5, 21.2), (12, 21.5, 23.6), (13, 23.9, TD - 0.3)], 'intro', source=TEST)
TS = 12.0  # title/teaser footage: the redirect and the bard walk
parts = [live]
if mode == 'cap':  # title card: the captioned cut has no narration, so pills 0-1 carry the intro line and the stack (Devin Voice = ChatGPT voice)
    MB = os.path.join(B, 'music'); os.makedirs(os.path.join(MB, 'build'), exist_ok=True)
    json.dump({'fps': 60, 'frames': 480, 'intro': 15, 'uiEnd': 440, 'clicks': [], 'typing': [], 'clips': [], 'caps': [], 'vo': [], 'voLate': []}, open(os.path.join(MB, 'build', 'cues.json'), 'w'))
    subprocess.run(['python3', os.path.join(D, '..', '_kit', 'tools', 'audio.py'), MB], check=True)
    music = os.path.join(B, 'music.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(MB, 'build', 'audio.wav'), '-t', '8', '-af', 'afade=t=out:st=7.3:d=0.7,loudnorm=I=-18:TP=-2:LRA=11', '-ar', '48000', '-ac', '2', music], check=True)
    parts = [seg(os.path.join(B, 'title.mp4'), TS, TS + 8, [(0, 0.3, 3.8), (1, 4.0, 7.6)], ('music', music)), live]
name = '80-hollowmere-voice'
if mode in ('nader', 'nomusic'):
    I = json.load(open(os.path.join(D, 'intro', 'lines.json')))
    t, wavs, caps = 0.5, [], []
    for k, ci in zip(['i0.png', 'i1.png', 'i2.png'], [0, 1, 2]):
        wavs.append((os.path.join(D, 'intro', k + '.wav'), t)); caps.append((ci, t, t + I[k]['dur'] + 0.3)); t += I[k]["dur"] + 0.35
    parts = [seg(os.path.join(B, 'teaser.mp4'), TS, TS + t + 0.6, caps, wavs), live]
    # our live check of the feature, narrated (i3 over the ask, i4 over the beam / clear / native notes), real Eira audio under it
    tw = [(os.path.join(D, 'intro', 'i3.png.wav'), 0.3), (os.path.join(D, 'intro', 'i4.png.wav'), 8.0)]
    t4 = 8.0 + I['i4.png']['dur'] + 0.6
    test = seg(os.path.join(B, 'test-n.mp4'), 8.5, 8.5 + max(TD, t4), [(10, 0.3, 12.2), (11, 12.5, 21.2), (12, 21.5, 23.6), (13, 23.9, max(TD, t4) - 0.3)], tw, source=TEST)
    name += '-nader' + ('-nomusic' if mode == 'nomusic' else '')
kit = os.path.join(D, name + '.mp4')
norm = os.path.join(B, 'kit.mp4')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', kit, '-c:v', 'copy', *AAC, norm], check=True)
lst = os.path.join(B, 'list.txt'); open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts + [norm, test]))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', '-movflags', '+faststart', kit], check=True)
print('spliced', kit)
fit(kit)
