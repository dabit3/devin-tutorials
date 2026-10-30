"""Conform a live take (MediaRecorder video.webm + audio.webm) into one synced 1080p60 mp4.
The recorder tags the video at 25 fps regardless of the real frame rate, so the video runs slow; the white flash
marks the audio start, and both recorders stop together, so the stretch factor is (video span after flash) / (audio span).
usage: python3 conform.py live/vN [out.mp4]"""
import json, os, subprocess, sys
d = sys.argv[1]; out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(d, 'take-1080.mp4')
v, a = os.path.join(d, 'video.webm'), os.path.join(d, 'audio.webm')
def last_pts(f, st): return float(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', st, '-show_entries', 'packet=pts_time', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout.strip().splitlines()[-1].split(',')[0])
pr = subprocess.run(['ffprobe', '-v', 'error', '-f', 'lavfi', f"movie={v},signalstats", '-show_entries', 'frame=pts_time:frame_tags=lavfi.signalstats.YAVG', '-of', 'json'], capture_output=True, text=True)
frames = json.loads(pr.stdout)['frames']
flash = next(float(f['pts_time']) for f in frames if float(f['tags']['lavfi.signalstats.YAVG']) > 225)
vend = last_pts(v, 'v'); aend = last_pts(a, 'a')
factor = (vend - flash) / aend
print(f'flash {flash:.2f}s video end {vend:.2f}s audio {aend:.2f}s stretch {factor:.4f}')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', v, '-i', a, '-filter_complex',
                f'[0:v]trim=start={flash + 0.2},setpts=(PTS-STARTPTS)/{factor},fps=60,scale=1920:1080:flags=lanczos[v];[1:a]atrim=start={0.2 / factor},asetpts=PTS-STARTPTS,aresample=48000[a]',
                '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-preset', 'fast', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], check=True)
print('wrote', out, subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', out], capture_output=True, text=True).stdout.strip())
