# Gartner assisted application development — final film

**Final script:** `script.md` describes the native human re-film: 51 narration lines and 11 sections, with the approved replacement line 27. Its `On Screen` labels are descriptions, not capture IDs. The old still manifests (`film-lines.json`, `shots/beats.json`, `spec.js`, `cards.json`, `scenes.js`) are historical and are not inputs to the current master.

**Master:** `45-gartner-aad-master.mp4`, native 3840×2160 at 30 fps, **5:48.556 (348.556 seconds)**, H.264 slow/CRF16/yuv420p and AAC 48 kHz. Audio is the ordered narration only. No cards, intro/outro effects, music, added highlights, captions or masks. `film-qa.md` describes the superseded still master, not this file.

## Rebuild the human recut

See [human-recut/README.md](human-recut/README.md) for the rig, dependencies and recording provenance. Restore the external production package to `/home/ubuntu/work/aad-human`: `final-accepted-inventory.json`, `final-source-table.md`, the selected native MP4 takes and JSON sidecars. These large/private source assets are deliberately not in this repository. The drivers currently expect this checkout at `/home/ubuntu/repos/devin-tutorials`; VO metadata and the approved line-27 WAV live under `vo/T8iHhGIWPm2GVYpQD1Am/`. Other narration clips may be restored individually or exported from the original external `_full-take.wav` using their metadata ranges. Do not regenerate narration with TTS for a rebuild.

The renderer uses accepted source windows at unchanged speed, straight cuts and real outgoing handles for 0.4-second gaps (1 second at section boundaries). It budgets current per-line WAV durations when present, rather than stale full-take timing. Run from the repository root:

```sh
python3 tutorials/45-gartner-aad/human-recut/render-master.py --prepare-only
python3 tutorials/45-gartner-aad/human-recut/render-master.py
python3 tutorials/45-gartner-aad/human-recut/qa-master.py
python3 tutorials/45-gartner-aad/human-recut/final-clause-qa.py
python3 tutorials/45-gartner-aad/human-recut/freeze-review.py
python3 tutorials/45-gartner-aad/human-recut/verify-source-holds.py
python3 -m unittest discover -s tutorials/45-gartner-aad/human-recut -p 'test_*.py'
python3 -m unittest discover -s tutorials/45-gartner-aad -p test_assemble.py
```

Output: `/home/ubuntu/work/aad-human/45-gartner-aad-human-master.mp4`. QA evidence is generated under that production directory, including `qa/human-contact-sheet.jpg`. Machine QA is not visual approval: personally inspect the line/clause/cut frames and classify source holds before copying an approved master to `45-gartner-aad-master.mp4`. The delivered master passed this protocol; full real-time audiovisual playback was not performed. `assemble.py` and `build-film.sh` are compatibility entry points to the same human renderer; neither reads capture IDs from `script.md` nor invokes the retired still/card pipeline.

**Capture provenance and limitations:** [production-final.md](production-final.md), [full captured beat list](production-beat-list.md), and `shots/production-beats.json` preserve the broader capture package. Unlisted beats are not in the film. Only approved demo PRs service #16 and portal #40 were merged in Desktop. Portal's Critical demo-auth finding remains unresolved; docs PR #39 is open. Earlier prep/continuation instructions below are historical and must not be replayed against the completed sessions.

## Historical capture instructions: prep, S1 and S2

`capture-web.mjs` and `capture-desktop.mjs` use the shared `DeskRec` still/beat recorder and `r.box` highlight coordinates. `direct-page.mjs` supplies a small CDP transport because Puppeteer's target initialization timed out on this VM. Electron captures clear device emulation; Chrome uses a 1024×576 CSS viewport at DPR 3.75. Both produce 3840×2160 PNGs and 1440×810 kit-space highlight metadata. Highlights are rendered from beat metadata, not baked into the raw PNGs.

Run phases against the corresponding live state; these scripts capture the real UI, not a mock or reconstruction. `SELECTOR`, `FILTER` and `ID` optionally refine a shot. `URL` navigates web captures. The planning prompt is inserted only when `ISSUE_URL` is provided, and sent only with `SEND=1`. No phase approves implementation.

```sh
PHASE=indexed URL=https://app.devin.ai/org/thequantexplorer/settings/deepwiki node tutorials/45-gartner-aad/capture-web.mjs
PHASE=architecture URL=https://app.devin.ai/org/thequantexplorer/wiki/thequantexplorer/claims-service node tutorials/45-gartner-aad/capture-web.mjs
PHASE=issue URL=https://github.com/thequantexplorer/claims-portal/issues/38 node tutorials/45-gartner-aad/capture-web.mjs
PHASE=workspace node tutorials/45-gartner-aad/capture-desktop.mjs
PHASE=agent node tutorials/45-gartner-aad/capture-desktop.mjs
PHASE=mode node tutorials/45-gartner-aad/capture-desktop.mjs
PHASE=fusion node tutorials/45-gartner-aad/capture-desktop.mjs
PHASE=prompt ISSUE_URL=https://github.com/thequantexplorer/claims-portal/issues/38 SEND=1 node tutorials/45-gartner-aad/capture-desktop.mjs
```

Raw capture metadata lives in `shots/web/beats.json`, `shots/desktop/beats.json`, and `shots/cli/beats.json`; the root `shots/beats.json` is the final script-specific film assembly. `S1-03-final` supersedes the first architecture frame, whose diagram was obscured by the expanded Ask Devin composer.

`production-notes.md` records the real flow and beat inventory. `issue-38-plan-original.md` and `issue-38-plan-edited.md` preserve the actual generated plan before and after the visible AC8 edit. `shots/production-beats.json` is the validated live-footage manifest; it excludes superseded `S1-03` and `S2-09`, where fixed composers obscured the target. Use `S1-03-final` and `S2-09-restored` instead.

```sh
node tutorials/45-gartner-aad/verify-captures.mjs
```

The live plan remains at `~/.devin/plans/plan-b41cf1a9a02d84eb.md`. Its custom Plan Editor was blank on this VM, so this one file is associated with Text Editor in local Desktop settings. Open/read it with the installed CLI wrapper (not the app executable):

```sh
DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus ~/work/desktop/Devin/bin/devin-desktop --reuse-window --goto ~/.devin/plans/plan-b41cf1a9a02d84eb.md:53:1
PHASE=edit ID=S2-08-before SELECTOR=.view-line FILTER=AC8 node tutorials/45-gartner-aad/capture-desktop.mjs
# Only from the original criterion, with the cursor on its line:
PHASE=edit EDIT_TEXT=' They contain attachment metadata only.' SELECTOR=.view-line FILTER=They node tutorials/45-gartner-aad/capture-desktop.mjs
```

The edit phase moves to line end, types the supplied text and saves through the real editor. Do not rerun `EDIT_TEXT` against the already-edited plan. The approval captures only hover/park and screenshot: neither the editor's **Implement** nor **Yes, implement plan and accept edits** is clicked.
