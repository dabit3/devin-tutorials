# 116 · Inline Higher or Lower game

Silent screen recording of a real Devin session: Devin fetches live star counts for 20 popular repos and ships a playable Higher or Lower game inside its reply; the cut plays four correct guesses in a row (score 4).

- Prompt: "Make a playable Higher or Lower game from the real GitHub star counts of 20 popular open-source repos (fetch them live) and embed it inline in your reply."
- Session: https://app.devin.ai/sessions/d68c925121dd44899f19faa225b35428
- Files: `116-inline-stars-game-4k.mp4` (3840×2160, 60 fps, no audio), `116-inline-stars-game-1080p.mp4` (preview), `poster.png`
- Provenance: [`shots/SOURCES.json`](shots/SOURCES.json); cut: [`edl.json`](edl.json)

## Rebuild

Takes are recorded from a signed-in Chrome on CDP port 9333 with `_kit/screenrec/take.mjs` (prompt + wait) and `_kit/screenrec/int116.mjs` (artifact interaction). Point `takes` in `edl.json` at the recorded take folders, then:

```sh
bash _kit/screenrec/prender.sh 116-inline-stars-game/edl.json 4
```
