# Devin Playbooks launch video

35 s, 3840×2160, 60 fps, music only. Output: `../15-devin-playbooks-launch.mp4`.

- `index.html` + `timeline.js`: the whole edit as a deterministic motion timeline (`window.film.render(t)`), built from the real captures in `../shots/` (1440×810 CSS space, 3x PNGs) and the brand assets in `../../_kit/brand/`. Inter from `../../_kit/fonts/`.
- `render.mjs`: headless Chrome (puppeteer-core from `../../_kit/tools/node_modules`) renders frames and pipes JPEGs straight into ffmpeg, one segment per worker, so no frame directories hit the disk.
- `music/music.mp3`: generated instrumental (ElevenLabs Music, 120 BPM). Cuts land on the bar grid: section changes every 2 s, the drop at 16 s is the playbook pill attaching, the final hit at 32 s brings in the logo.
- `build.sh`: render, trim + fade + two-pass loudnorm the music to −16 LUFS / −1.5 dBTP, mux AAC 48 kHz, encode H.264 High, and make a 1080p preview in `build/`.

Rebuild (from the repo root, ~5 min on the Mac):

```
bash tutorials/15-devin-playbooks/launch/build.sh
```

Quick stills for review: `node render.mjs --scale 0.5 --stills 1,5,9 --dir build/stills`. `SKIP_RENDER=1 bash build.sh` re-muxes audio onto an existing `build/video.mp4`.
