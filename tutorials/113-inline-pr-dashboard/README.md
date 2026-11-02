# 113 · Inline PR dashboard

Silent screen recording of a real Devin session: Devin builds a live dashboard of all 148 open Express pull requests (summary cards, PRs-by-year chart, top labels, filterable and sortable table) and it renders inside its reply; the cut hovers the 2026 bar, filters by review status, searches `res.send` and sorts by age.

- Prompt: "Build an interactive dashboard of the open pull requests in github.com/expressjs/express and embed it inline in your reply."
- Session: https://app.devin.ai/sessions/afda9d74a4ef41e9ab695deaeedd287c
- Files: `113-inline-pr-dashboard-4k.mp4` (3840×2160, 60 fps, no audio), `113-inline-pr-dashboard-1080p.mp4` (preview), `poster.png`
- Provenance: [`shots/SOURCES.json`](shots/SOURCES.json); cut: [`edl.json`](edl.json)

## Rebuild

Takes are recorded from a signed-in Chrome on CDP port 9333 with `_kit/screenrec/take.mjs` (prompt + wait) and `_kit/screenrec/int113.mjs` (artifact interaction). Point `takes` in `edl.json` at the recorded take folders, then:

```sh
bash _kit/screenrec/prender.sh 113-inline-pr-dashboard/edl.json 4
```
