# Launch video: Devin Automations event triggers (CI failure auto-fix)

33.6 s, 3840x2160, 60 fps, H.264 High + AAC 48 kHz, music only (no voiceover).

Rebuild from the repo root (needs Chrome, ffmpeg, and `npm install` in `tutorials/_kit/tools`):

```bash
bash tutorials/16-automation-triggers/launch/build.sh
```

- Light mode throughout (light backgrounds, near-black text, dark logo).
- `index.html`: the whole edit as one timeline (`window.seek(t)`). Footage is the real tutorial captures in `../shots/`; scene times are on the music's beat grid (128 BPM, beat 32 is the drop).
- `render.mjs`: frame-by-frame Puppeteer render piped to ffmpeg. `node render.mjs --stills 1 /tmp/stills` writes 1080p review frames every second.
- `build.sh`: masters `music.mp3` to -16 LUFS / -1.5 dBTP, renders `../16-automation-triggers-launch.mp4`, and writes a 1080p preview to `/tmp`.
- `music.mp3`: generated instrumental (ElevenLabs Music, composition plan in `music-prompt.json`).
