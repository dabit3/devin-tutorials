# Tutorial 26 intro prototype: Split second

Seven lifecycle stages wait as loose handoff cards. One blue pulse leaves the Devin card,
sweeps through every stage in a single motion, snaps each card into the connected row, and
returns home, landing on the exact layout of Tutorial 26's `overview` scene.

All visuals are live canvas graphics (no screenshots). Timing is locked to `2-upbeat.mp3`
(~117.5 BPM, first onset 2.07 s): the pulse leaves on beat 4, hits one stage per half-beat
from beat 5, and lands home on beat 9.

The kit adds a 72-frame spacer before the first beat, so render from frame 72 at 30 fps:

```sh
node tutorials/_kit/tools/render.mjs 26-intro-10-split-second --from 72 --to 687 --every 2 --out /tmp/f
ffmpeg -framerate 30 -pattern_type glob -i '/tmp/f/*.jpg' -i 2-upbeat.mp3 \
  -filter_complex "[0:v]scale=1920:1080,format=yuv420p[v];[1:a]atrim=0:10.2667,afade=t=out:st=9.47:d=0.8[a]" \
  -map "[v]" -map "[a]" -c:v libx264 -crf 16 -c:a aac -shortest intro.mp4
```

To drop into Tutorial 26, copy `splitSecond` (and its helpers) into `26-sdlc-overview/scenes.js`
and add a `scene: "splitSecond"` beat before the `overview` beat.
