# Devin Memory launch video

35 s launch film for Devin Memory, built from the real tutorial footage in `../shots/`.
Output: `../13-devin-memory-launch.mp4` (3840×2160, 60 fps, H.264 High, AAC 48 kHz, −16 LUFS).

- `index.html` + `film.js`: the motion timeline (Inter, monochrome). `window.film.renderFrame(n)` draws frame `n` deterministically.
- `render.mjs`: renders frames to JPEG with Puppeteer Core and the installed Chrome (deps from `tutorials/_kit/`).
- `music.py`: generates the 120 BPM backing track (NumPy + SciPy); cuts land on its bars.
- `build.sh`: full pipeline.

Rebuild from the repo root:

```sh
bash tutorials/13-devin-memory/launch/build.sh
```

Quick preview frames: `node tutorials/13-devin-memory/launch/render.mjs --out /tmp/prev --every 30 --scale 0.25`.
The 1080p preview is written to `launch/build/` (git-ignored).
