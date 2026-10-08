# Devin in Slack: launch video

32.5 s, 3840×2160, 60 fps, music only, light mode (white/light-gray backgrounds, near-black text, dark logo). Output: `../12-devin-slack-launch.mp4`.

- `index.html` + `timeline.js`: the motion timeline (1920×1080 stage, rendered at 2× device scale). All UI is the real Slack/Devin footage in `../shots/`; `window.seek(t)` draws any frame deterministically.
- `render.mjs`: headless Chrome (Puppeteer from `../../_kit/tools`) screenshots every frame and streams it straight into ffmpeg, no frame directory on disk.
- `music_src.mp3`: generated with the ElevenLabs Music API (120 BPM, instrumental, one-beat drop-out at 15 s, final hit at 30 s). Cuts in `timeline.js` sit on its beats (0.5 s grid).
- `music.py`: adds a reverb tail after the final hit, trims to length, normalizes to −16 LUFS → `music.wav`.

## Rebuild

```sh
cd tutorials/12-devin-slack/launch
(cd ../../_kit/tools && npm install)        # once, for puppeteer
node render.mjs video build_video.mp4 --workers 5
python3 music.py 32.5                        # needs numpy + scipy
ffmpeg -y -i build_video.mp4 -i music.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -ar 48000 -shortest -movflags +faststart ../12-devin-slack-launch.mp4
ffmpeg -y -i ../12-devin-slack-launch.mp4 -vf scale=1920:1080:flags=lanczos -c:v libx264 -profile:v high -crf 20 -preset slow -pix_fmt yuv420p -c:a copy 12-devin-slack-launch-1080p.mp4
rm build_video.mp4 music.wav
```

Stills for review: `node render.mjs stills /tmp/l12 4.2,9,17.5,30.5`.
