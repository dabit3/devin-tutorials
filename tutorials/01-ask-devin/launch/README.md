# Ask Devin launch video

37 s, 3840×2160 @ 60 fps, H.264 High + AAC 48 kHz, no voiceover, light mode. Built only from the real captures in `../shots/`.

Rebuild (from the repo root, macOS with Chrome, Node, ffmpeg, Python 3 + NumPy/SciPy; kit deps in `tutorials/_kit/tools/node_modules`):

```sh
sh tutorials/01-ask-devin/launch/build.sh
```

Writes `tutorials/01-ask-devin/01-ask-devin-launch.mp4` and the 1080p preview `launch/build/01-ask-devin-launch-1080p.mp4`, then deletes the frames (`KEEP_FRAMES=1` keeps them).

- `index.html`: the motion timeline (shot schedule, camera moves, highlight rings, cursor, kinetic text, end card). `window.film.renderFrame(f)` draws frame `f`; open `index.html?t=12.5` from a server rooted at `tutorials/` to preview one moment.
- `render.mjs`: headless Chrome, renders frames to JPEG (`--from/--to/--every/--times/--workers`).
- `music.py`: generates the 120 BPM music bed and UI sounds, beat grid at 0.42 s + 0.5 s; cuts and word hits sit on it. `build.sh` loudness-normalizes it to −16 LUFS (two-pass, linear) into `music.wav`.
