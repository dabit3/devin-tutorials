#!/usr/bin/env bash
# Tutorial 106: render from LEAD (skips the kit's window entrance, opens on the title scene), no title chime,
# VO+SFX bed with MUSIC_GAIN=0, Nader's 2-upbeat track extended in 8-bar joins, ducked under narration, faded out, loudnorm -16 LUFS, muxed with -c:v copy.
# usage: MUSIC=<2-upbeat.mp3> bash tutorials/106-devin-can-hand-off-to-the-cloud/tools/make106.sh
set -euo pipefail
VD=$(cd "$(dirname "$0")/.." && pwd); T=$(dirname "$VD"); V=106-devin-can-hand-off-to-the-cloud; TOOLS=$VD/tools; W=$VD/build/mix; mkdir -p $W
: "${MUSIC:?set MUSIC to 2-upbeat.mp3}"
export VOICE=T8iHhGIWPm2GVYpQD1Am
LEAD=${LEAD:-108}; SEG=${SEG:-1000}; SHIFT=${SHIFT:-1.8}
TOTAL=$(cd $T/_kit/tools && node render.mjs $V --count)
echo "frames $TOTAL"
encode() {
  ffmpeg -v error -y -framerate 60 -start_number "$2" -i "$1/%05d.jpg" \
    -vf "scale=in_range=full:out_range=tv:out_color_matrix=bt709:flags=lanczos+accurate_rnd+full_chroma_int,format=yuv420p" \
    -c:v libx264 -profile:v high -preset slow -crf 18 -tune animation -g 120 -bf 2 \
    -x264-params colorprim=bt709:transfer=bt709:colormatrix=bt709 -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv -r 60 -fps_mode cfr "$3"
}
if [ "${SKIP_RENDER:-0}" != 1 ]; then
  rm -rf $VD/build/seg; mkdir -p $VD/build/seg; : > $VD/build/seg/list.txt
  for ((a = LEAD; a < TOTAL; a += SEG)); do
    b=$(( a + SEG < TOTAL ? a + SEG : TOTAL )); rm -rf $VD/build/frames
    (cd $T/_kit/tools && node render.mjs $V --from $a --to $b --workers ${WORKERS:-6})
    encode $VD/build/frames $a $VD/build/seg/$a.mp4
    echo "file '$a.mp4'" >> $VD/build/seg/list.txt
    echo "segment $b/$TOTAL"
  done
  rm -rf $VD/build/frames
  ffmpeg -v error -y -f concat -safe 0 -i $VD/build/seg/list.txt -c copy $W/video.mp4
  rm -rf $VD/build/seg
fi
cd $T
MUSIC_GAIN=0 POP_FROM=0 python3 $TOOLS/audio106.py _kit/tools/audio.py $V && cp $VD/build/audio.wav $W/bed.wav
python3 $TOOLS/mix106.py $VD $MUSIC $W/bed.wav $W/mix.wav $SHIFT full
ffmpeg -v error -y -i $W/mix.wav -af "atrim=start=$(python3 -c "print($LEAD/60)"),asetpts=PTS-STARTPTS,acompressor=threshold=-20dB:ratio=3:attack=4:release=150:makeup=2,loudnorm=I=-16:TP=-2:LRA=11" -ar 48000 $W/mix-n.wav
ffmpeg -v error -y -i $W/video.mp4 -i $W/mix-n.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -ar 48000 -movflags +faststart -shortest $VD/$V-nader.mp4
ffmpeg -v error -y -i $VD/$V-nader.mp4 -vf scale=1920:1080:flags=lanczos -c:v libx264 -preset slow -crf 20 -c:a copy -movflags +faststart $VD/$V-nader-1080p.mp4
ffmpeg -v error -y -ss "${POSTER_AT:-3.2}" -i $VD/$V-nader.mp4 -frames:v 1 -vf "drawbox=x=0:y=ih*0.86:w=iw:h=ih*0.12:color=0xFCFCFC@1:t=fill,scale=1920:-1" $VD/poster.png
for f in $VD/*.mp4; do echo $f $(ffprobe -v error -show_entries format=duration -of csv=p=0 $f); done
echo MAKEDONE
