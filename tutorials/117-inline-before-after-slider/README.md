# 117 · Inline before/after slider for a UI update

Silent screen recording of a real Devin session: Devin redesigns the two link lists on the new-portfolio home page as a themed card grid, takes real before and after screenshots at the same viewport and scroll position, opens a PR, and replies with an inline before/after drag slider with a tab per theme; the cut drags the slider back and forth on the Dark, Light and Hacker tabs.

- Prompt: "@thequantexplorer/product-demo-apps In new-portfolio/, give the two link lists under the hero a striking redesign as a polished card grid that fits the dark, light and hacker themes. Run it, take before and after screenshots at the same viewport and scroll, open a PR, and reply with an inline before/after drag slider (screenshots embedded, a tab per theme)."
- Session: https://app.devin.ai/sessions/a88fea080b084049a2b872ff15ff6bc1
- PR: https://github.com/thequantexplorer/product-demo-apps/pull/122 (demo copy of dabit3/new-portfolio)
- Files: `117-inline-before-after-slider-4k.mp4` (3840×2160, 60 fps, no audio), `117-inline-before-after-slider-1080p.mp4` (preview), `poster.png`, `before-after-slider.html` (the session's slider artifact, self-contained and offline)
- Provenance: [`shots/SOURCES.json`](shots/SOURCES.json); cut: [`edl.json`](edl.json)

## Rebuild

Takes are recorded from a signed-in Chrome on CDP port 9333 with `_kit/screenrec/take117.mjs` (repo mention, prompt + wait) and `_kit/screenrec/int117.mjs` (slider drags). Point `takes` in `edl.json` at the recorded take folders, then:

```sh
bash _kit/screenrec/prender.sh 117-inline-before-after-slider/edl.json 4
```
