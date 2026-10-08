# DeepWiki launch video

34.6 s, 3840×2160, 60 fps, H.264 High + AAC 48 kHz, music only (no voiceover). Output: `../06-deepwiki-launch.mp4`.

- `launch.html`: the whole motion timeline (1920×1080 stage, rendered at 2× = 4K). Every UI frame is a real capture from `../shots/`; `window.seek(t)` draws time `t`. Open it in Chrome with `?t=12.5` to check a single moment.
- `render.mjs`: headless Chrome (puppeteer-core from `../../_kit/tools/node_modules`) → JPEG frames piped into x264, split across workers. No frame directories on disk.
- `music.mp3`: generated instrumental, 120 BPM, first downbeat at 0.12 s; cuts and text land on the beat grid (`OFF` + n × 0.5 s in `launch.html`).
- `build.sh`: trims + loudness-normalises the music (−16 LUFS, −1.5 dBTP), renders, muxes, and writes a 1080p preview to `build/`.

## Rebuild

```bash
cd tutorials/_kit/tools && npm install        # once (puppeteer-core)
cd ../../06-deepwiki/launch && ./build.sh     # ~10 min on an M-series Mac; WORKERS=4 ./build.sh to use more cores
```

Review stills without encoding: `node render.mjs --stills /tmp/stills --every 1` (or `--times 3.8,7.9`).
