# Devin Security Swarm: launch video

A 37 s launch cut of the Security Swarm tutorial: no voiceover, a 120 BPM synthesized music bed, and the real captured UI from `../shots/` animated with kinetic type.

- `index.html`: the motion timeline. Each scene is a time range with a `build` (DOM) and `update(t)` (pure function of time). Screenshot regions are shown in `Card`s whose view (centre + zoom), spotlight and position are keyframed. Scene cuts land on the beat (every 0.5 s).
- `render.mjs`: renders `index.html` frame by frame at 3840×2160, 60 fps, to JPEGs with headless Chrome (uses `puppeteer-core` from `../../_kit/tools`).
- `music.py`: synthesizes the music and hits (numpy + scipy, no samples), timed to the same scene cuts.
- `build.sh`: music → frames → `../17-security-swarm-launch.mp4` (H.264 High, AAC 48 kHz, loudnorm −16 LUFS) and `build/17-security-swarm-launch-1080p.mp4`.

Rebuild:

```sh
(cd tutorials/_kit/tools && npm ci)
tutorials/17-security-swarm/launch/build.sh
```

Spot-check frames without a full render: `node render.mjs --out build/stills --times 2.5,10,20`.
