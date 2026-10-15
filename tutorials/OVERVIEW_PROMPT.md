# Prompt: create a high-level Devin overview video (diagrams)

For a step-by-step walkthrough of one feature use [TUTORIAL_PROMPT.md](TUTORIAL_PROMPT.md) instead.

Copy everything below the line into a new Devin session. Fill in the fields at the top; leave the rest unchanged.

---

Create a short, high-level overview video that explains how one Devin capability works and what you can do with it, and open a PR that adds it to `dabit3/devin-tutorials` under `tutorials/<NN>-<slug>-overview/`.

- **Topic:** <e.g. "Managed Devins", "Automations", "Security Swarm">
- **The one idea the viewer should leave with:** <one sentence>
- **Docs:** <links>
- **Source tutorials to reuse shots from:** <e.g. 19, 23, 26; or "none, capture new">

## Scope and accuracy

- These are reusable production rules from tutorials 01–34. A per-video brief can add constraints for that deliverable, but they do not become shared defaults. Tutorial 35 / conference-reel directions stay confined to that reel: do not import its silent format, palette, layout, fresh-footage mandate, testing-hero story, chapter count, animation geometry, pace or lengths. Keep independently approved pre-conference light/minimal styling, caption placement, genuine footage reuse and restrained rings.
- Verify current official docs and product behavior before scripting. Use only supported features/primitives; omit deprecated features entirely, including migration notes. Do not invent features, settings, limits or guarantees, or claim complete scanner coverage. Use current Customize paths for plugins/MCPs and Customize → Memory. Users can ask Devin to remember/forget/change a preference; app memory files are read-only.
- Claims and demonstrations must be honest. A conceptual diagram is not a live feature run; simulation is not hardware proof; Android via an emulator in an Ubuntu session/blueprint is not an Android picker option. Use real citation/source links, disclose deliberately planted bugs in captions/narration, and never claim untested checks passed. Show failure/fix/retest only if it genuinely occurred.
- First Session / Introducing Devin-style examples need actual UI feature work and recorded browser testing before any authorized merge. Never hide a merged icon to imply false chronology. Explain the settled result/agent counts, not a plan that correction loops changed.

## What kind of video this is

A concept explainer, not a click-by-click walkthrough: "this is how it works and what you can do". Verified examples on main include `23-managed-devins-overview/scenes.js`, `26-sdlc-overview/scenes.js`, `28-multiplatform-overview/`, `31-hardware-test-triage-overview/`, `32-dynamic-workflows-overview/` and `34-devin-primitives-overview/`. Check actual folder availability before copying; do not depend on unmerged examples.

- **Length:** about 55–90 s per cut as a starting point, not a mandatory limit. Shorter than a step-by-step tutorial; use judgment. A useful shape is 4–5 diagram scenes alternating with 4–6 real UI shots (roughly 55 s captioned / 70 s narrated), adjusted to explain the topic clearly.
- **Structure:** (1) a concise opening explaining both what it does and why it matters, with a plain-language mental model and value; (2) how it works, as a diagram building step by step; (3) "here's what that looks like": a relevant real proof shot, with one restrained ring; (4) 3–5 highest-value use cases from current docs, with small cards/diagrams; (5) a crisp closing line and Devin end card. If showing a demo prompt, first explain its objective and expected outcome.
- **Diagrams:** clean animated `scene:` beats drawn live by the kit (nodes appearing level by level, signals along connectors, results flowing back). Keep the approved visual language from `19-managed-devins/diagram/`, 23 and 26: light `#fafafa` radial background, white rounded cards with soft shadows, Inter, thin connector curves, Devin avatars and a thin blue accent. No serif, purple or dark backgrounds. This is the pre-conference overview recipe, not the conference reel's palette/layout.
- **Reusable scenes:** copy the closest verified main example (23's node/connector diagram, 26's staged focus-card layout, or 34's cue-timed list/recap) rather than drawing every scene from scratch. Adapt factories to the actual concept; do not impose a special chapter count or animation template.
- **Real UI and reuse:** every UI shot is genuine. Reuse relevant approved shots when they still match the current interface/task/claim; capture new UI when missing, stale or inaccurate. Record every proof shot in `shots/SOURCES.json`: reused shots map to their source tutorial/file; new captures record their source session/account and purpose (what claim/action they prove), without credentials. Choose proof shots from contact sheets, not setup/Chrome-only frames. Faithful crops may improve readability but cannot hide state/chronology or fabricate behavior. For matching older 4320×2430 shots, a crop such as `crop=3312:1863:1008:0,scale=4320:2430` can approximate the tighter framing; inspect the actual source rather than applying it blindly.
- **Tone:** calm, Apple-minimal explainer; no rejected launch/marketing-experiment recipe, music-video cuts, hype text slams or empty slogans.

## Standing layout and capture rules

- Prefer a macOS capture VM for new tutorials; the demonstrated session's platform must match the feature/brief. Use light mode and modest Chrome zoom around 125% (`ZOOM=1.25`) for legibility. Collapse the left sidebar unless the action uses it; hide an empty/unused right panel. Keep session/testing views wide enough to see the whole UI—do not keep zooming inside an active session. Mask the account email.
- Use a thin animated blue ring with gentle shadow around the relevant visible element, never before it appears. Measure the final settled rectangle (slide-in dialogs can move after `hlBox` is recorded), pad it correctly, limit its lifetime with `ringFor`, and avoid ringing adjacent items.
- Put captions beside relevant controls in clear empty space for setup/menu/terminal/dialog scenes. In running sessions, a safe bottom band is fine only if it avoids the composer, controls, helper/search text and described content. Use explicit placement when needed; narrated subtitles require `subPos`, not only `capPos`.
- Hold important menus, selected platform states and dialogs for roughly 2.5–3 s, or cut them if they add nothing. Keep real-work waits around 2–2.5 s, with roughly 3 s maximum inactivity; use eligible-poll compression (`pollRunMax: 2.2`) plus explicit hold edits where needed and an honest "Sped up" badge.
- Short prompt typing should be fast but readable (about `cps: 48`, roughly 3× the old 16 cps). If it would exceed about 3 s, show the completed prompt as a still with no typing SFX.
- Review camera transitions at least at 30 fps and at the final exported rate. `cam`/`cam: 'reset'` begins at the crossfade start; a tiny `camDur` can jump the outgoing shot. Prefer stable framing or properly timed gentle movement. Do not ship flashes, skeletons, setup banners, oversized text, popups or "Take control" overlays.

## Narration

Two cuts by default: captioned (no voice) and Nader-narrated. Nader is the only narrator (`T8iHhGIWPm2GVYpQD1Am`, output name `nader`), even on redos whose old briefs/templates name another voice. Do not regenerate other narrator cuts or alter unrelated legacy files/rows on main.

- With `ELEVEN_LABS_API_KEY` securely available, use the normal current path from `tutorials/`:
  ```sh
  python3 _kit/tools/vo.py <folder> T8iHhGIWPm2GVYpQD1Am
  VOICE=T8iHhGIWPm2GVYpQD1Am VO_NAME=nader SEG=1500 JPEG_QUALITY=85 bash _kit/tools/build.sh <folder>
  ```
  One whole-script ElevenLabs request, then local cuts/transcript checks; it sends `text`/`model_id`, no `seed` or `voice_settings`. Use saved/default voice behavior, never hard-coded stability/similarity/style/speed or `next_text`, and never per-sentence requests.
- Whole-take caching replaces old per-line assumptions. A text change regenerates the complete take; retries do not only redo failed lines. For an explicitly requested fresh take of identical text, preserve the approved files and remove the old `lines.json` cache before rerunning; current `vo.py` has no force flag.
- Rerecord the entire script for wording/punctuation/tone changes or a full-redo request. Selective retakes need explicit request/approval, matching voice/default request and seam checks. Listen end to end; STT cannot judge tone.
- Write fewer, fuller complete sentences over related actions. Do not split a sentence across beats, use dangling lead-ins, or cram distinct thoughts into run-on comma/colon lists. Fix odd comma pauses, repeated words, rushing, dull endings or rising/unfinished tone by rephrasing and rerecording, not just trimming silence. Preserve deliberate natural pauses rather than an identical gap after every sentence.
- Use `voSay` only for pronunciation/punctuation differences from displayed `vo`; keep sentence structure compatible, regenerate the take/subtitle chunks and verify words/timings. Display menu paths with arrows; speak them naturally. Avoid file paths/numbers/acronyms that distract or require long respellings.
- The Nader voice reads the heteronym "live" as "liv". Respelling it as "lyve" in `voSay` gave mixed results, so reword instead ("public URL", "the page running on Modal"). Say "xAI" as "ex A I". For dark-mode videos, never write "dark web" (say "dark page" or "public page").
- **Scene timing:** narrated lines often outlast captioned holds. Use narration-only scene holds/timing overrides, with `voSync`, `waitVo` and `voDelay` for real UI actions. Reveal cards, list/recap items, stats and attributions when the words name them, using actual spoken cues, not a fixed stagger. Proof shots need matching speech or a short deliberate hold; do not leave narration waiting silently on long proof shots.
- **All-gap audit:** run `VOICE=T8iHhGIWPm2GVYpQD1Am node _kit/tools/render.mjs <folder> --count` for duration/late-cue feedback, then audit actual `window.film.cues().vo` / generated `build/cues.json` against `vo/<voice-id>/lines.json`, listen and measure rendered voice-word gaps (STT if needed; music can mask silence detection). Ordinary narration gaps should be about 1.5 s or less, with waiting-on-visuals gaps around 1 s or less. Retain purposeful natural pauses; explicitly justify any longer deliberate pause or real-call exception. Include the last narrated line to the outro.
- **Current engine caveat:** `vo.py` emits `takeAt`, not the `at`/`end` fields tested by `voNatural`; do not claim original take pauses are automatically restored in the render. Verify actual cues and tune narration-only `hold`, `voGap`/`voSentGap`, `tailHold` and `outroVoDelay` where appropriate. The outro delay starts at UI end; earlier holds/tail also contribute. Do not unnecessarily rebuild an approved captioned cut.
- After moving/skipping beats, verify every intended line, correct WAV/manifest key and subtitle chunk, including intro/outro. Rename/remap consistently; `--count` alone does not prove coverage or every gap. For opening STT "[on-hold music]", inspect the first spoken word time/waveform.
- Verify the request and shared `take` value before claiming single-take provenance. Current `vo.py` removes temporary `_take.wav`; never commit it, `_full-take.wav` or other full-script scratch audio.

## Kit gotchas

- Style overrides from a per-video brief (e.g. "dark mode") use the kit's opt-in switches, such as `dark: true` in `spec.js` (`SPEC.dark`; scenes get `o.DARK`/`o.INK`/`o.BG`). Do not fork `_kit/src/engine.js` per video. If a batch needs a new kit option, the coordinator lands one shared kit PR before fanning out.
- Modal + xAI overviews: give Modal a labelled place in the pipeline diagram and a short scene on why it's used and what it runs for this app (schedule, parallel `.map()` calls, storage, web endpoint), with no code walkthrough. Label counts as sampled posts found, and use `modal deploy` output plus the public `*.modal.run` page as proof (Modal dashboard pages stayed on spinners). The workspace allows only 5 scheduled functions, shared by every sibling session, so say so if a schedule never ran.
- Use the latest main kit and its current options, not an old combine branch or obsolete byte-identity requirement. One-off helpers belong in the tutorial folder; coordinate necessary shared kit changes separately instead of making parallel video PRs diverge. No adapter/kit change is needed for the normal narration recipe.
- Current `vo.py` expects a strict JSON object after `window.SPEC =`, not arbitrary executable JS. Keep runtime narration-only layout code separate from that input and follow the chosen example's spec-generation workflow.
- A diagram-only `scene:` beat still needs a placeholder PNG in `shots/` and a `beats.json` row; follow the closest working example.
- Kit coordinates are 1440×810; `hl`/ring `x/y` is the box centre. Bottom captions/subtitles occupy roughly y 715–770: keep diagram content above about 690–700 where that band is used. Diagram eyebrow/subtitle text should be at least about 13 px in the 1440 layout for 1080p readability.
- Keep text, stats and attribution labels inside their cards with safe padding/shrink-to-fit. Do not let pills, rings or subtitles spill over or collide. Inspect narrated diagrams separately; a captioned frame cannot prove narrated layout.
- Before a full build, sample with `node _kit/tools/render.mjs <folder> --frames <frame-list> --out build/fix` from `tutorials/`; `--out` is relative to the tutorial folder. Then review frame sheets and transitions of both final cuts.
- Captioned/narrated builds share `build/`; run them sequentially. Use the bare folder name for `bash _kit/tools/build.sh`, check its final built message/output freshness, and budget several GB or use `SEG` for large renders.

## Sign-in and authorized cleanup (only for new captures)

Record in `thequantexplorer`, normally with `thequantexplorer/*` demo repos; an integration-specific account/repo needs explicit approval and verified access. Check existing login first. From `tutorials/`, import an available secret with `CDP=http://127.0.0.1:<port> DEVIN_WEB_LOGIN="$DEVIN_WEB_LOGIN_EIGENEXPLORER" node _kit/tools/devin-login-import.mjs`; expect https://app.devin.ai/org/thequantexplorer. Never print/commit credentials. If missing/expired, ask for sign-in through the Desktop tab. If required account/plan state is unavailable, ask rather than mock UI.

Inspect old demo sessions, PRs, automations/profiles and memory for stale work or answers before a take. Obtain permission before pushing a new repo, editing memory, archiving/closing demo work, reverting main, merging or deleting resources. Preserve memory before approved cleanup, and ask Devin to forget/update only demo-specific entries; app files are read-only. Never clean unrelated work or assume repo permissions. Record actual account changes and remaining authorized cleanup in the PR.

## Shared prompts and deliverables

- Children report reusable lessons to the parent; one coordinator updates these prompt files in a focused PR. Do not let every video child edit shared prompts or promote per-video experiments into global policy.
- One focused normal PR from latest main with `<folder>.mp4` (captioned) and `<folder>-nader.mp4` (narrated), 4K60 masters/1080p previews, a hand-picked settled `poster.png`, `voice-script.md`, capture/spec/scene sources and `shots/SOURCES.json`.
- Update `tutorials/README.md` and root README accurately, marked as overview; root narrated entries go in "Narrated tutorials". Preserve numbering; use a blank line and `<!-- -->` before nonconsecutive numbered entries where necessary. Anchor duration edits by title so neighboring rows stay untouched.
- Fetch main immediately before opening the PR and reconcile upstream changes without reverting newer kit work. Push large media in small targeted commits if needed; verify the remote head after a failed/ambiguous push. Leave the PR unmerged unless instructed.
- Final checks: current supported claims, honest proof/provenance, what/why and demo context, cue-timed reveals, both cuts at 1080p and transition speed, transcript/tone/coverage/all-gap audits including outro, accurate scoped README diff. No build frames, secrets, full-take audio or unrelated legacy-output changes.
- Final message: PR link, durations, 1080p previews/full Markdown voice script, 3–4 useful stills and any reusable lessons/authorized cleanup still needed. Keep the actual account-change inventory in the PR.
