# Automations launch video

34 s, 3840×2160, 60 fps, H.264 High + AAC 48 kHz, no voiceover. Output: `../07-automations-launch.mp4` (and `build/07-automations-launch-1080p.mp4`).

- `index.html` — the motion timeline (1920×1080 CSS stage, rendered at 2× for 4K). Footage is the real tutorial screenshots in `../shots/`; brand assets and Inter come from `../../_kit/`. `window.film.renderAt(t)` draws any time `t`.
- `render.mjs` — Puppeteer (system Chrome) frame-by-frame renderer; workers stream JPEG frames straight into ffmpeg segments, so no frame dirs hit disk.
- `devin-lockup-black.png` — the white `_kit` lockup recolored to black for the light end card.
- `music.mp3` — generated instrumental (ElevenLabs Music, prompt in `music-prompt.json`), ~120 BPM; cuts land on the 0.5 s beat grid.
- `build.sh` — render, trim/fade music, two-pass loudnorm to −16 LUFS, mux, 1080p preview.

## Rebuild

```sh
(cd tutorials/_kit/tools && npm install)   # once, for puppeteer-core
cd tutorials/07-automations/launch && ./build.sh
```

Stills for review: `node render.mjs --stills 4.5,12.6,20.0,31.5 --out /tmp/st`. Remux audio only: `SKIP_RENDER=1 ./build.sh` (needs `build/seg*.mp4` from a prior render).
