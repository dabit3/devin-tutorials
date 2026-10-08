# Secrets & Site Cookies: launch video

A 34.5 s, 4K / 60 fps launch video with no voiceover, built from the real screenshots in `../shots/`.

- `index.html` + `timeline.js`: the motion timeline. `window.renderFrame(t)` draws the frame at time `t` (cards, camera moves, spotlight, kinetic type, end card).
- `assets/bg.jpg`: blurred final screenshot, used behind the title card.
- `music/music.mp3`: generated instrumental track (about 117 BPM). Cuts land on its beat grid (`B(n) = 0.05 + 0.5 n` s in `timeline.js`).
- `build.mjs`: renders JPEG frames with Puppeteer, normalizes the music to −16 LUFS, encodes the 4K MP4 and a 1080p preview, then deletes the frames.

## Rebuild

Needs Node, ffmpeg, Google Chrome and `puppeteer-core` (resolved from `../../_kit/tools`, same as the tutorial kit; run `npm install` there once).

```sh
cd tutorials/04-secrets-cookies/launch
node build.mjs                     # -> ../04-secrets-cookies-launch.mp4 + build/04-secrets-cookies-launch-1080p.mp4
node build.mjs --stills 4.5,15.4   # review stills only -> build/stills/
```

Options: `--workers N` (parallel browsers, default 4), `--from s --to s` (render a range), `--keep` (keep the frame dir).
