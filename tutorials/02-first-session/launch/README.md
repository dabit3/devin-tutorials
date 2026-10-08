# Launch video: Your First Session

34 s, 3840×2160, 60 fps, light mode, no voiceover. Built from the real captures in `../shots/`.

- `index.html` + `timeline.js`: the motion timeline. `window.renderAt(t)` draws the frame at `t` seconds (scenes, camera keyframes, headlines, cursor, rings, end card).
- `render.mjs`: renders JPEG frames at 4K with Puppeteer (uses `../../_kit/tools/node_modules`, Google Chrome).
- `music.mp3`: generated 120 BPM instrumental (ElevenLabs Music, plan in `music-plan.json`). Cuts sit on its 0.5 s beat grid.
- `build.sh`: renders, muxes, writes `../02-first-session-launch.mp4` and `preview-1080p.mp4`, then deletes the frames.

Rebuild:

```sh
cd tutorials/_kit/tools && npm install   # once, for puppeteer-core
cd ../../02-first-session/launch && ./build.sh
```

Preview a single moment: `node render.mjs --out /tmp/f --from 9.5 --to 9.52 --workers 1`.
