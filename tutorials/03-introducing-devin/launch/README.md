# Introducing Devin — launch video

34.5 s, no voiceover, 3840×2160 @ 60 fps, H.264 High + AAC 48 kHz. Output: `../03-introducing-devin-launch.mp4`.

All footage is the real Devin UI from this tutorial's capture (`../shots/`): home composer → session working → PR → browser test → test recording → merge.

## Rebuild

```sh
cd tutorials/03-introducing-devin/launch
./build.sh            # WORKERS=3 by default; KEEP_FRAMES=1 keeps build/frames for review
```

Needs Google Chrome, ffmpeg, python3 + numpy, and `tutorials/_kit/tools` deps (`npm install` there; build.sh does it if missing).
Also writes a 1080p preview to `build/03-introducing-devin-launch-1080p.mp4`.

## Files

- `index.html` + `timeline.js` — the motion timeline. Every frame is a pure function of time, authored in beats of the 120 BPM track (`kf()` keyframes, image schedule `SCHED`, camera `CAM`, highlights `SPOTS`, cursor `MOVES`).
- `render.mjs` — serves `tutorials/` locally and screenshots each frame with headless Chrome (1920×1080 CSS at DPR 2 → 4K JPEGs), one browser per worker.
- `mix.sh` — cuts `music/track.mp3` from its first downbeat (2.0 s), adds two soft UI clicks (send, merge), fades out, two-pass loudnorm to −16 LUFS / −1.5 dBTP.
- `music/track.mp3` — generated instrumental (ElevenLabs Music, 120 BPM); `music/plan.json` is the composition plan it was generated from.
