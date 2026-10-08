#!/usr/bin/env bash
# Rebuilds ../11-devin-desktop-launch.mp4 (4K60) and build/preview-1080p.mp4 from index.html + music_raw.mp3.
set -euo pipefail
cd "$(dirname "$0")"
OUT=../11-devin-desktop-launch.mp4
DUR=36.8          # window.film.duration in index.html
SPLICE=32.944     # B(17): end card starts; the music jumps to its last loud bar here
TAIL=46.494       # bar 24 of music_raw.mp3 (bar 25 is the final hit, landing on the CTA)
mkdir -p build
A_END=$(echo "$SPLICE+0.03" | bc); B_START=$(echo "$TAIL-0.03" | bc); FADE_AT=$(echo "$DUR-0.6" | bc)

# 1. Music: intro..B(17), then the song's ending, normalised to -16 LUFS / -1.5 dBTP, 48 kHz.
ffmpeg -loglevel error -y -i music_raw.mp3 -filter_complex "\
[0:a]atrim=0:${A_END},asetpts=PTS-STARTPTS[a];\
[0:a]atrim=${B_START},asetpts=PTS-STARTPTS[b];\
[a][b]acrossfade=d=0.06:c1=tri:c2=tri,atrim=0:${DUR},afade=t=out:st=${FADE_AT}:d=0.6,aresample=48000[o]" \
  -map "[o]" -c:a pcm_s16le build/music_cut.wav
M=$(ffmpeg -hide_banner -i build/music_cut.wav -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
j() { echo "$M" | python3 -c "import json,sys; print(json.load(sys.stdin)['$1'])"; }
ffmpeg -loglevel error -y -i build/music_cut.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$(j input_i):measured_TP=$(j input_tp):measured_LRA=$(j input_lra):measured_thresh=$(j input_thresh):offset=$(j target_offset):linear=true,aresample=48000" -c:a pcm_s16le build/music.wav

# 2. Frames: 3840x2160 JPEGs via headless Chrome.
rm -rf build/frames
node render.mjs --out build/frames --workers "${WORKERS:-6}"

# 3. Encode 4K60 H.264 High + AAC 48 kHz, then a 1080p preview.
ffmpeg -loglevel error -stats -y -framerate 60 -i build/frames/%05d.jpg -i build/music.wav \
  -c:v libx264 -profile:v high -preset slow -crf 16 -pix_fmt yuv420p -r 60 \
  -c:a aac -b:a 256k -ar 48000 -t "$DUR" -movflags +faststart "$OUT"
ffmpeg -loglevel error -stats -y -i "$OUT" -vf scale=1920:1080:flags=lanczos \
  -c:v libx264 -profile:v high -preset slow -crf 20 -pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 \
  -movflags +faststart build/preview-1080p.mp4
[ -n "${KEEP_FRAMES:-}" ] || rm -rf build/frames
ffprobe -v error -show_entries stream=codec_name,profile,width,height,r_frame_rate,sample_rate -show_entries format=duration -of compact "$OUT"
