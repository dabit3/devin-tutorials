# Launch video: iPhone and iPad apps on Mac VMs

36 s, 3840×2160, 60 fps, H.264 High + AAC 48 kHz, music only (no voice).
Output: `../18-ios-ipad-mac-vms-launch.mp4` (4K) and `build/preview-1080p.mp4`.

## Rebuild

```sh
cd tutorials/18-ios-ipad-mac-vms/launch
./build.sh            # WORKERS=4 by default
```

Needs Google Chrome, ffmpeg, Node with `tutorials/_kit/tools` installed (`npm ci` there), and Python 3 with numpy + scipy.

## Files

- `index.html`: the whole film as a canvas timeline (`window.film.renderFrame(f)`). Footage is the real captures in `../shots/`; scenes, camera moves, highlights and type all live in the `scenes` array. Open it through any static server at `tutorials/` and add `#12.5` to the URL to see the frame at 12.5 s.
- `render.mjs`: renders every frame at 4K in headless Chrome and pipes JPEGs straight into ffmpeg per worker segment (no frame folders on disk). `node render.mjs --at 5,12.5 --out build/stills` writes single frames for review.
- `music.py`: synthesises `music.wav` (120 BPM; section hits on the cuts at 4, 8, 12, 17, 22, 28, 31.5 s).
- `build.sh`: music, render, concat, two-pass loudnorm to −16 LUFS / −1.5 dBTP, mux, 1080p preview.

## Footage

| Time | Shot | Moment |
|---|---|---|
| 0–4 s | — | Launch message |
| 4–6 s | `0004.png` | macOS in the platform menu |
| 6–8 s | `0006.png` | macOS selected |
| 8–12 s | `0065.png` | The finished prompt, then send |
| 12–17 s | `0086.png` | Computer tab: xcodebuild, then the iPad Simulator |
| 17–22 s | `0105–0114`, `0147–0156` | Devin's iPhone and iPad test runs, side by side |
| 22–28 s | `0164–0175` | iPad recording, 6/6 checks |
| 28–31.5 s | `0199.png` | Summary with the PR link |
| 31.5–36 s | brand lockup | Try it today at devin.ai |
