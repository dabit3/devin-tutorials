"""Puts the live gameplay intro (real GPT-Live-1 Coach audio, captured from the Chrome build) in front of a kit cut.
usage: python3 splice.py cap|nader <intro.mp4>
  cap:   intro 0-55 s with its real audio + caption pills, then 21-devin-voice.mp4
  nader: intro 50.5-78.4 s muted under Nader's three intro lines (intro/i*.png.wav), then the same 0-55 s, then 21-devin-voice-nader.mp4
Caption pills come from caps.mjs (CAPPOS=top keeps them clear of the Coach panel). Output overwrites the kit cut."""
import json, os, subprocess, sys
D = os.path.dirname(os.path.abspath(__file__))
mode, src = sys.argv[1], sys.argv[2]
B = os.path.join(D, 'build', 'splice'); os.makedirs(B, exist_ok=True)
CAPS = ["Today: a cross-platform game, built and tested by voice", "Devin + Devin Voice build it. GPT-Live-1 voices the coach.",
        "Coach Otter: a live voice sidekick on GPT-Live-1", "Talk back: “give me a creatine boost”",
        "A background tool drops creatine while he keeps talking", "Interrupt him: “make it night time”",
        "Another tool runs, and the city goes dark", "Change his style: chill surfer"]
subprocess.run(['node', os.path.join(D, 'caps.mjs'), B, *CAPS], env={**os.environ, 'CAPPOS': 'top'}, check=True)
cap = lambda i: os.path.join(B, f'cap{i}.png')
X264 = ['-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', '18', '-tune', 'animation', '-g', '120', '-bf', '2', '-pix_fmt', 'yuv420p',
        '-x264-params', 'colorprim=bt709:transfer=bt709:colormatrix=bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-r', '60']
AAC = ['-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-ac', '2']
def seg(out, ss, to, caps, audio):
    """caps: [(png index, t0, t1)] in segment time; audio: 'intro' or [(wav, t0)] or None"""
    dur = to - ss
    cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', str(ss), '-to', str(to), '-i', src]
    for i, _, _ in caps: cmd += ['-loop', '1', '-t', str(dur), '-i', cap(i)]
    wavs = audio if isinstance(audio, list) else []
    for w, _ in wavs: cmd += ['-i', w]
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
    else:
        f += f';anullsrc=r=48000:cl=stereo,atrim=0:{dur}[ao]'
    subprocess.run(cmd + ['-filter_complex', f, '-map', '[vo]', '-map', '[ao]', *X264, *AAC, '-t', str(dur), out], check=True)
    return out
# real Coach run (segment time = intro time): STT of the intro audio sets these windows
live = seg(os.path.join(B, 'live.mp4'), 0, 55.0,
           [(2, 0.3, 4.9), (3, 9.6, 12.6), (4, 12.7, 21.0), (5, 37.8, 40.6), (6, 40.8, 48.5), (7, 50.2, 55.0)], 'intro')
parts = [live]
name = '21-devin-voice'
if mode == 'nader':
    I = json.load(open(os.path.join(D, 'intro', 'lines.json')))
    t, wavs, caps = 0.5, [], []
    for k, ci in zip(['i0.png', 'i1.png', 'i2.png'], [0, 1, 2]):
        wavs.append((os.path.join(D, 'intro', k + '.wav'), t)); caps.append((ci, t, t + I[k]['dur'] + 0.3)); t += I[k]['dur'] + 0.45
    parts = [seg(os.path.join(B, 'teaser.mp4'), 50.5, 50.5 + t + 0.6, caps, wavs), live]
    name += '-nader'
kit = os.path.join(D, name + '.mp4')
norm = os.path.join(B, 'kit.mp4')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', kit, '-c:v', 'copy', *AAC, norm], check=True)
lst = os.path.join(B, 'list.txt'); open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts + [norm]))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', '-movflags', '+faststart', kit], check=True)
print('spliced', kit)
