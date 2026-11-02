# 115 · Inline CI health report

Silent screen recording of a real Devin session: Devin pulls the last 200 GitHub Actions runs of astral-sh/uv and renders a CI health report inline (pass rate, failures, cancellations, median CI duration); the cut switches to CI only, hovers the duration bars, opens Outcomes by day and the Failed runs table.

- Prompt: "Chart the last 200 GitHub Actions runs of github.com/astral-sh/uv as a compact interactive CI health report (pass rate, duration by workflow, failures by day) and embed it inline in your reply."
- Session: https://app.devin.ai/sessions/9d886f0b919145b1958316f266f7ffb3
- Files: `115-inline-ci-report-4k.mp4` (3840×2160, 60 fps, no audio), `115-inline-ci-report-1080p.mp4` (preview), `poster.png`
- Provenance: [`shots/SOURCES.json`](shots/SOURCES.json); cut: [`edl.json`](edl.json)

## Rebuild

Takes are recorded from a signed-in Chrome on CDP port 9333 with `_kit/screenrec/take.mjs` (prompt + wait) and `_kit/screenrec/int115.mjs` (artifact interaction). Point `takes` in `edl.json` at the recorded take folders, then:

```sh
bash _kit/screenrec/prender.sh 115-inline-ci-report/edl.json 4
```
