# Secrets & Site Cookies: launch video

A 39.4 s, 4K / 60 fps, light-mode launch video with no voiceover, built from the real screenshots in `../shots/`.

- `index.html` + `timeline.js`: the motion timeline. `window.renderFrame(t)` draws the frame at time `t` (cards, camera moves, spotlight, kinetic type, end card).
- `assets/bg.jpg`: blurred final screenshot, used behind the title card.
- `music/music.mp3`: generated instrumental track (about 105 BPM). The timeline is written on a 120 BPM grid (`B(n) = 0.05 + 0.5 n`) and plays back `TS = 1.1428` times slower, so every cut lands on the music's beat. If you change the music, set `TS = 0.5 / beat period`.
- `build.mjs`: renders JPEG frames with Puppeteer, normalizes the music to −16 LUFS, encodes the 4K MP4 and a 1080p preview, then deletes the frames.

## Rebuild

Needs Node, ffmpeg, Google Chrome and `puppeteer-core` (resolved from `../../_kit/tools`, same as the tutorial kit; run `npm install` there once).

```sh
cd tutorials/04-secrets-cookies/launch
node build.mjs                     # -> ../04-secrets-cookies-launch.mp4 + build/04-secrets-cookies-launch-1080p.mp4
node build.mjs --stills 5,17.5     # review stills only -> build/stills/ (real seconds)
```

Options: `--workers N` (parallel browsers, default 4), `--from s --to s` (render a range), `--keep` (keep the frame dir).
