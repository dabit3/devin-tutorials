#!/usr/bin/env python3
# Hold the frame just before each detected address-bar focus run over the whole run (no timing change).
import subprocess, sys, shutil
F = sys.argv[1]; runs = eval(sys.argv[2])
wins = [(max(0, round((a - 0.1) * 60)), round((b + 0.15) * 60)) for a, b in runs]
n = len(wins)
fc = f'[0:v]split={n + 1}[m]' + ''.join(f'[r{k}]' for k in range(n)) + ';'
prev = 'm'
for k, (f1, f2) in enumerate(wins):
    fc += f'[{prev}][r{k}]freezeframes=first={f1}:last={f2}:replace={max(0, f1 - 3)}[x{k}];'; prev = f'x{k}'
tmp = F.replace('.mp4', '_fz.mp4')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', F, '-filter_complex', fc.rstrip(';'), '-map', f'[{prev}]', '-map', '0:a', '-c:v', 'h264_videotoolbox', '-q:v', '70', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-movflags', '+faststart', tmp], check=True)
shutil.move(tmp, F); print('OMNIFREEZEDONE')
