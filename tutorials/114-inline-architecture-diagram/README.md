# 114 · Inline architecture diagram

Silent screen recording of a real Devin session: Devin reads the Flask source and replies with a clickable module diagram (application core, per-request state, app services, tooling); clicking AppContext and then Templating swaps the detail panel to that module's role, key names and source file.

- Prompt: "Map the architecture of github.com/pallets/flask as an interactive diagram (click a module to see what it does) and embed it inline in your reply."
- Session: https://app.devin.ai/sessions/a3bc802234a647e99b8d8c666264830e
- Files: `114-inline-architecture-diagram-4k.mp4` (3840×2160, 60 fps, no audio), `114-inline-architecture-diagram-1080p.mp4` (preview), `poster.png`
- Provenance: [`shots/SOURCES.json`](shots/SOURCES.json); cut: [`edl.json`](edl.json)

## Rebuild

Takes are recorded from a signed-in Chrome on CDP port 9333 with `_kit/screenrec/take.mjs` (prompt + wait) and `_kit/screenrec/int114.mjs` (artifact interaction). Point `takes` in `edl.json` at the recorded take folders, then:

```sh
bash _kit/screenrec/prender.sh 114-inline-architecture-diagram/edl.json 4
```
