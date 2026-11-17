# Gartner assisted application development — final film

**Final script:** `script.md` is the unchanged Gartner-AAD-script-v3.md: 51 narration lines and 11 sections. `film-lines.json` maps every line to exactly its tagged captured beats. `shots/beats.json`, `spec.js`, `cards.json`, and `scenes.js` are the final film assembly, not the older provisional 38-line version.

**Master:** `45-gartner-aad-master.mp4`, 3840×2160 at 60 fps, caption-free, **6:11.417 (371.417000 seconds)**. `qa/contact-sheet.jpg` is the 51-line midpoint overview; `qa/contact-sheet-01.jpg` through `13.jpg` provide detailed four-frame pages. `qa/samples.json` records exact sampling times and narration. See [final QA results](film-qa.md) for visual review, corrected targets, and technical checks.

The assembly uses 76 cuts from 74 unique live-product stills. Multi-beat lines divide their duration into equal whole-frame holds. Each still stays at native framing; the cursor parks instantly inside the metadata highlight target, and the kit animates its highlight. Both caption systems are disabled. The 11 section cards are nominally 2.5 seconds each. CLI capture masks the account email; an independent OCR scan of all 74 film sources found no remaining email matches (`email-masks.json`).

```sh
python3 tutorials/45-gartner-aad/assemble.py
# Only to regenerate VO (not needed for the checked-in per-line clips):
VO_SEED=none python3 tutorials/_kit/tools/vo_onetake.py tutorials/45-gartner-aad T8iHhGIWPm2GVYpQD1Am
python3 tutorials/45-gartner-aad/assemble.py
bash tutorials/45-gartner-aad/build-film.sh
python3 tutorials/45-gartner-aad/qa-film.py frames
python3 tutorials/45-gartner-aad/verify-film.py
python3 -m unittest discover -s tutorials/45-gartner-aad -p test_assemble.py
```

Nader's voice uses the kit's default TTS model/settings and one continuous take, split into 51 checked 48 kHz mono clips. The old 38-line VO and its provisional timing file are not used. Per-line WAVs and `lines.json` follow the existing CQA tutorial's committed-asset convention; the full-take WAV and build directories remain ignored. No music; standard kit intro/outro sounds remain. The local build adapter calls the unmodified kit renderer/audio tools with the kit's 4K60, CRF18/slow H.264 and AAC settings. It uses FFmpeg 4.4's equivalent `-vsync cfr` because this VM does not support the newer `-fps_mode cfr`, and resumes complete cached segments. Optional `REBUILD_BEATS=id,id` repairs geometry-only changes in affected segments; it rejects changes to scenes, still images, voice, or beat timing and requires snapshots from a completed build.

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
