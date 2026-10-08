# Devin CLI launch video

37 s, 3840×2160 @ 60 fps, no voiceover. Output: `../10-devin-cli-launch.mp4` (plus `build/preview-1080p.mp4`, not committed).

- `index.html` + `timeline.js`: deterministic DOM motion timeline. `window.film.seek(t)` poses every element for time `t`. All footage is the real CLI / Orbit captures in `../shots/` (1440×810 capture space), framed with a per-window camera (`[x, y, zoom]`) and layouts keyed to the 120 BPM beat grid.
- `render.mjs`: headless Chrome (puppeteer-core from `_kit/tools/node_modules`) at 1920×1080 CSS × DPR 2, JPEG frames piped straight into ffmpeg in parallel segments (no frame dirs on disk). `--stills dir --frames 120,600 --scale 0.5` dumps review stills.
- `music.mp3`: generated instrumental (ElevenLabs music, prompt/plan in `music-plan.json`), 120 BPM. `build.sh` trims 36 ms so beats land on 0.5 s, fades the tail and two-pass loudnorms to −16 LUFS / −1.5 dBTP, AAC 48 kHz.

Rebuild (macOS, Google Chrome installed, `_kit/tools` npm deps installed):

```sh
bash tutorials/10-devin-cli/launch/build.sh   # WORKERS=4 by default
```
