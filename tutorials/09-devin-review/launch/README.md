# Devin Review launch video

37 s, 3840x2160, 60 fps, H.264 High + AAC 48 kHz, no voiceover. Light mode. Built from the real tutorial screenshots in `../shots/`.

- `index.html` + `timeline.js`: the motion timeline (shots, camera moves, spotlights, cursor, lifted cards, headlines, logo). `window.film.seek(t)` draws any moment, so frames are deterministic.
- `render.mjs`: renders every frame at 4K (1920x1080 CSS at 2x) as JPEGs with headless Chrome through `tutorials/_kit/tools/node_modules/puppeteer-core`.
- `music-source.mp3`: ElevenLabs Music track (120 BPM instrumental). `build.sh` cuts it to 37 s (0–31 s, then the outro from 46.98 s) and normalizes to -16 LUFS.
- `build.sh`: music, frames, encode, 1080p preview, then deletes the frames.

Rebuild (from the repo root):

```sh
tutorials/09-devin-review/launch/build.sh
```

Output: `tutorials/09-devin-review/09-devin-review-launch.mp4`, plus `launch/build/preview-1080p.mp4` (gitignored). Beats land every 0.5 s; the drop is at 4.0 s and every cut sits on a beat. Preview single frames with `node render.mjs --frames 240,600 --out build/stills`.
