# Devin Code Scans launch video

36 s, 3840×2160, 60 fps, no voiceover. Footage is the real Devin UI from `../shots/`; the music bed is a generated instrumental (`music/track_a.mp3`, ~120 BPM).

- `index.html`: the whole motion timeline (1920×1080 CSS stage, one `render(t)` function, Inter from `../../_kit/fonts/`). Open it in Chrome and call `film.render(seconds)` in the console to scrub.
- `render.mjs`: serves `tutorials/` locally and screenshots every frame with Puppeteer at DPR 2 (4K JPEGs). Uses `puppeteer-core` from `../../_kit/tools/node_modules` (`cd ../../_kit/tools && npm install` if missing) and the system Chrome (`CHROME=` to override).
- `build.sh`: renders all frames, cuts and normalizes the music to −16 LUFS, encodes `../14-devin-code-scans-launch.mp4` and a 1080p preview, then deletes the frames.

Rebuild:

```sh
./build.sh                 # WORKERS=4 WORK=/tmp/cs-launch KEEP_FRAMES=0 by default
```

Spot-check frames without a full render:

```sh
node render.mjs --out /tmp/cs/st --every 30 --workers 4   # one frame every 0.5 s
node render.mjs --out /tmp/cs/fx --frames 1400,1560        # specific frames
```

A full render needs about 2 GB of free disk for the JPEG frames.
