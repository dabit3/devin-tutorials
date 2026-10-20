#!/usr/bin/env bash
# Tutorial 26 with the intro: render from frame 72 (skips the kit's window entrance), no title chime, upbeat track on the intro grid.
# usage: MUSIC=<upbeat.mp3> HANDOFF=<film s of beat 0010> SHIFT=<film s where the music starts> bash tutorials/26-sdlc-overview/tools/make26.sh
# current values: HANDOFF=11.27 SHIFT=1.9
set -euo pipefail
VD=$(cd "$(dirname "$0")/.." && pwd); T=$(dirname "$VD"); V=26-sdlc-overview; TOOLS=$VD/tools; W=$VD/build/mix; mkdir -p $W
: "${MUSIC:?set MUSIC to the upbeat track}"
export VOICE=T8iHhGIWPm2GVYpQD1Am
LEAD=72; SEG=1500
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
    (cd $T/_kit/tools && node render.mjs $V --from $a --to $b --workers 6)
    encode $VD/build/frames $a $VD/build/seg/$a.mp4
    echo "file '$a.mp4'" >> $VD/build/seg/list.txt
    echo "segment $b/$TOTAL"
  done
  rm -rf $VD/build/frames
  ffmpeg -v error -y -f concat -safe 0 -i $VD/build/seg/list.txt -c copy $W/video.mp4
  rm -rf $VD/build/seg
fi
cd $T
BED_START=$(python3 -c "print($HANDOFF+0.5)") POP_FROM=$(python3 -c "print($HANDOFF-0.1)") python3 $TOOLS/audio26.py _kit/tools/audio.py $V && cp $VD/build/audio.wav $W/bed-plain.wav
MUSIC_GAIN=0 POP_FROM=$(python3 -c "print($HANDOFF-0.1)") python3 $TOOLS/audio26.py _kit/tools/audio.py $V && cp $VD/build/audio.wav $W/bed-music.wav
python3 $TOOLS/mix26.py $VD $MUSIC $W/bed-plain.wav $W/mix-plain.wav $SHIFT $(python3 -c "print($HANDOFF+2.5)")
python3 $TOOLS/mix26.py $VD $MUSIC $W/bed-music.wav $W/mix-music.wav $SHIFT full
for n in plain music; do
  ffmpeg -v error -y -i $W/mix-$n.wav -af "atrim=start=$(python3 -c "print($LEAD/60)"),asetpts=PTS-STARTPTS,acompressor=threshold=-20dB:ratio=3:attack=4:release=150:makeup=2,loudnorm=I=-16:TP=-2:LRA=11" -ar 48000 $W/mix-$n-n.wav
done
ffmpeg -v error -y -i $W/video.mp4 -i $W/mix-plain-n.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -ar 48000 -movflags +faststart -shortest $VD/$V-nader.mp4
ffmpeg -v error -y -i $W/video.mp4 -i $W/mix-music-n.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -ar 48000 -movflags +faststart -shortest $VD/$V-nader-music.mp4
for n in nader nader-music; do ffmpeg -v error -y -i $VD/$V-$n.mp4 -vf scale=1920:1080:flags=lanczos -c:v libx264 -preset slow -crf 20 -c:a copy -movflags +faststart $VD/$V-$n-1080p.mp4; done
for f in $VD/*.mp4; do echo $f $(ffprobe -v error -show_entries format=duration -of csv=p=0 $f); done
echo MAKEDONE
