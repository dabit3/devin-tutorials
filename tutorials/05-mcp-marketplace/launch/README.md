# MCP Servers & Marketplace — launch video

32 s, 3840×2160, 60 fps, no voiceover. Output: `../05-mcp-marketplace-launch.mp4`.

All UI is the real capture in `../shots/` (same frames as the tutorial), animated with
CSS transforms: camera zooms/pans, popout cards cropped from the screenshots, highlight
rings on the control that matters, kinetic Inter headlines, and the Devin lockup from
`../../_kit/brand/` on the end card.

## Files
- `index.html` — 1920×1080 stage, styles: light mode (very light gray stage, near-black Inter text, black Devin lockup via `filter: brightness(0)`), Devin blue only for highlight rings.
- `timeline.js` — the whole edit; `window.film.renderFrame(f)` poses every element for frame `f`.
  Cuts land on the 120 BPM grid of `music.mp3` (one beat = 0.5 s).
- `render.mjs` — Puppeteer (from `../../_kit/tools/node_modules`) renders JPEG frames at 2× scale.
  `--times 1,5.5,12` renders single stills for review; `--from/--to` render a frame range.
- `build.sh` — renders all frames, masters the music (−16 LUFS, −1.5 dBTP, 48 kHz), encodes the
  4K MP4 and a 1080p preview into `build/` (git-ignored), then deletes the frames.
- `music.mp3` — generated instrumental (ElevenLabs Music): upbeat electronic pop, ~120 BPM, no vocals.

## Rebuild
```sh
cd tutorials/_kit/tools && npm install   # once, for puppeteer-core
bash tutorials/05-mcp-marketplace/launch/build.sh
```
Needs Google Chrome at `/Applications/Google Chrome.app` and ffmpeg.
Review stills: `node tutorials/05-mcp-marketplace/launch/render.mjs --out /tmp/stills --times 1,8,16,24,30`.
