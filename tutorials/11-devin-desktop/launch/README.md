# Devin Desktop launch video

30–40 s launch cut of the Devin Desktop tutorial: kinetic type over the real app screenshots in `../shots/`, cut to a 124 BPM music bed. No voiceover.

- `index.html`: the motion timeline (1920×1080 CSS, rendered at 2× = 3840×2160). Open it in Chrome with `?t=12.4` to preview any moment.
- `render.mjs`: renders every frame to JPEG with headless Chrome (uses `puppeteer-core` from `../../_kit/tools`).
- `music_raw.mp3`: generated instrumental (ElevenLabs Music). `build.sh` cuts it to length (jumps to the song's ending at the end card) and normalises it to −16 LUFS.
- `build.sh`: music → frames → `../11-devin-desktop-launch.mp4` (4K60, H.264 High, AAC 48 kHz) and `build/preview-1080p.mp4`.

## Rebuild

```bash
cd tutorials/_kit/tools && npm install          # once, for puppeteer-core
cd ../../11-devin-desktop/launch && ./build.sh  # ~3 GB of temporary frames, removed after encoding
```

Spot-check frames without a full build: `node render.mjs --out /tmp/stills --times 1.2,10.4,33.5`.
