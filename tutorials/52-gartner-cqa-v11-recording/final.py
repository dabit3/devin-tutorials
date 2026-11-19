#!/usr/bin/env python3
# Assemble final CQA v11: trims, exact-length PCM audio per segment, setpts re-encode, 1.8 s tail.
import subprocess, os
O = os.path.expanduser('~/gartner/v11/out'); os.chdir(O); os.makedirs(os.path.expanduser('~/gartner/v11/tmp'), exist_ok=True)
segs = [('s1', 0), ('s2', 5.0), ('s3', 0), ('s4', 0), ('s4c', 0), ('s5', 0), ('s5b', 0), ('s6', 0), ('s7', 0)]
run = lambda *a: subprocess.run(list(a), check=True)
parts = []
for s, trim in segs:
    src = s + '.mp4'
    if trim:
        run('ffmpeg', '-v', 'error', '-y', '-ss', str(trim), '-i', src, '-c:v', 'h264_videotoolbox', '-q:v', '70', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', s + '_t.mp4'); src = s + '_t.mp4'
    parts.append(src)
def nf(f): return int(subprocess.check_output(['ffprobe', '-v', 'error', '-count_packets', '-select_streams', 'v', '-show_entries', 'stream=nb_read_packets', '-of', 'csv=p=0', f]).decode().split()[0])
wavs = []
for p in parts:
    d = nf(p) / 60; w = f'/Users/devin/gartner/v11/tmp/{p}.wav'
    run('ffmpeg', '-v', 'error', '-y', '-i', p, '-vn', '-af', f'apad,atrim=0:{d:.6f}', '-ar', '48000', '-ac', '2', '-c:a', 'pcm_s16le', w); wavs.append(w)
open('/Users/devin/gartner/v11/tmp/alist.txt', 'w').write(''.join(f"file '{w}'\n" for w in wavs))
open('vlist.txt', 'w').write(''.join(f"file '{p}'\n" for p in parts))
run('ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', '/Users/devin/gartner/v11/tmp/alist.txt', '-c', 'copy', '/Users/devin/gartner/v11/tmp/full.wav')
out = os.path.expanduser('~/gartner/v11/Gartner-CQA-v11-4K-no-captions.mp4')
run('ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', 'vlist.txt', '-i', '/Users/devin/gartner/v11/tmp/full.wav', '-map', '0:v', '-map', '1:a',
    '-vf', 'setpts=N/(60*TB),tpad=stop_mode=clone:stop_duration=1.8', '-af', 'apad=pad_dur=1.8', '-r', '60', '-c:v', 'h264_videotoolbox', '-q:v', '70', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-movflags', '+faststart', out)
for w in wavs: os.remove(w)
os.remove('/Users/devin/gartner/v11/tmp/full.wav')
print(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'stream=codec_name,width,height,r_frame_rate,duration', '-of', 'compact', out]).decode())
