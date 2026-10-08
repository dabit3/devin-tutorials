# Launch video: Testing Apps with Devin (Computer Use)

36 s, 3840x2160, 60 fps, H.264 High + AAC 48 kHz, no voiceover. Output: `../08-computer-use-testing-launch.mp4`.

- `index.html` + `film.js`: a deterministic canvas timeline. Every frame is a pure function of time; all UI is the real screenshots in `../shots/` (cropped, zoomed and spotlit, never redrawn). Inter from `../../_kit/fonts/`, logo from `../../_kit/brand/`.
- `render.mjs`: serves `tutorials/` locally and renders every frame to JPEG with headless Chrome (puppeteer-core from `_kit/tools`).
- `music/track.mp3`: generated instrumental (~124 BPM). `build.sh` starts it at 4.85 s so the drop lands on the first cut; scene changes in `film.js` sit on bar lines (`bar(n)`).
- `build.sh`: render, trim and loudness-normalise the music to -16 LUFS (two-pass loudnorm, -1.5 dBTP), encode the 4K master and `build/preview-1080p.mp4`, then delete the frames.

## Rebuild

```sh
cd tutorials/_kit/tools && npm install   # once, for puppeteer-core
cd ../../08-computer-use-testing/launch && ./build.sh
```

Needs Google Chrome (override with `CHROME=/path/to/chrome`), ffmpeg and ~6 GB free disk for the frames. `WORKERS=4` and `JPEG_QUALITY=92` are the defaults. Preview single frames with `node render.mjs --out /tmp/stills --times 2.5,12,30`.
