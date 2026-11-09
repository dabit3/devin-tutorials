# Four VMs, four sessions, one screen

A **26.8-second silent clip** of the real Devin web app with four sessions open at once in a 2×2 split view, each with its Computer tab on the right. A cursor clicks into each pane in turn and that session's VM becomes the main Computer view. Filmed live on 9 November 2026; no intro, outro, captions or audio.

- [4K master](four-vms.mp4): 3840×2160, 30fps, H.264/yuv420p, no audio.
- [1080p preview](four-vms-1080p.mp4): 1920×1080, 30fps, no audio.
- [Poster](poster.png)

## The four sessions

| Pane | VM | What's running on the Computer |
|---|---|---|
| Top left | macOS | Two-player neon air hockey on two iPhone simulators side by side, synced over a local server, both paddles on autopilot |
| Top right | Ubuntu | SkyTrace: a Three.js 3D globe with live flight arcs, airport list, departures feed and a day/night line sweeping at 1h/s |
| Bottom left | Windows | A WPF Mandelbrot explorer doing an infinite spiral deep zoom with cycling palettes |
| Bottom right | macOS | An animated SwiftUI weather app on an iPhone simulator, auto-swiping between rain, snow, sun and night scenes |

Click order: globe → fractal → weather → air hockey, about 6 seconds each.

## Rebuild

1. Sign in to app.devin.ai in the capture Chrome (`_kit/tools/devin-login-import.mjs`, CDP on port 9333).
2. Start the four sessions with `start.mjs` (`PLAT=macOS|Ubuntu|Windows TASK="..." node 36-four-vms/start.mjs`), then open them in a 2×2 split view with a Computer tab on the right.
3. Set Chrome's zoom for app.devin.ai to 250% and record: `node 36-four-vms/capture-live.mjs` (writes `live/` frames plus `frames.json`; `live/` is git-ignored).
4. Encode: `node 36-four-vms/encode.mjs`. It cuts the white "Connecting to Devin's computer" frames after each click so every switch lands on the live VM, then writes the 4K MP4.
5. 1080p: `ffmpeg -i four-vms.mp4 -vf scale=1920:1080:flags=lanczos -c:v libx264 -crf 18 -an four-vms-1080p.mp4`.
