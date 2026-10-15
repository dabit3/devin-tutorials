# Prompt: create a high-level Devin overview video (diagrams)

For a step-by-step walkthrough of one feature use `TUTORIAL_PROMPT.md` instead.

Copy everything below the line into a new Devin session. Fill in the fields at the top; leave the rest unchanged.

---

Create a short, high-level overview video that explains how one Devin capability works and what you can do with it, and open a PR that adds it to `dabit3/devin-tutorials` under `tutorials/<NN>-<slug>-overview/`.

- **Topic:** <e.g. "Managed Devins", "Automations", "Security Swarm">
- **The one idea the viewer should leave with:** <one sentence>
- **Docs:** <links>
- **Source tutorials to reuse shots from:** <e.g. 19, 07 + 16; or "none, capture new">

## What kind of video this is

A concept explainer, not a walkthrough: "this is how it works and what you can do". Examples on main: 23 (Managed Devins overview). Others in review: 24 Automations, 25 Security Swarm, 26 SDLC, 27 Code Scans, 28 Multiplatform.

- **Length:** about 55–90 s per cut. Shorter than a step-by-step tutorial; use judgment. A good shape is 4–5 diagram scenes alternating with 4–6 real UI shots, one sentence per beat (≈55 s captioned / ≈70 s narrated).
- **Structure:** (1) one plain sentence on what it does; (2) how it works, as an animated diagram that builds up step by step; (3) "here's what that looks like": a real UI shot after each diagram step, with a ring on the one element that matters; (4) 3–5 highest-value use cases from the docs, each with its own small card or diagram; (5) one crisp closing line, then the Devin end card.
- **Diagrams:** clean animated `scene:` beats drawn live by the kit engine so they really animate (nodes appearing level by level, a signal travelling along a connector, results flowing back). Visual language from tutorial 19's ending (`19-managed-devins/diagram/`) and 20's `scenes.js`: light `#fafafa` radial background, white rounded cards with soft shadows, Inter, thin connector curves, Devin avatar icons, one thin blue accent. No serif fonts, no purple, no dark backgrounds.
- **Reusable scene factories:** a `flow(step)` factory (each beat adds one card of the same diagram, alternating with the real shot for that step, as in 27) and a `stage(i)` factory (top row + focus card + chips, as in 26) keep scenes consistent. Copy them from the closest example instead of drawing each scene from scratch.
- **Real UI only:** every UI shot is a real screenshot. Reuse the step-by-step tutorial's shots first, and capture new UI only for a missing proof. Record the mapping in `shots/SOURCES.json` (shot → source tutorial and file) so "real UI only" is auditable. Pick proof shots from a contact sheet of captured frames; many frames only show Chrome or setup. Old 110%/sidebar-open shots can be cropped to the 125% framing instead of recaptured: `ffmpeg … -vf crop=3312:1863:1008:0,scale=4320:2430`.
- **Accuracy:** every claim must match the docs. Don't invent features, limits, guarantees or settings, and check the docs for anything the brief asks you to show (nesting appears in tutorial 19 but not in the Managed Devins docs; keep it only if Nader asks). No full-coverage claims for scanners. If a capability isn't in the product UI (e.g. no Android option in the platform menu), show only what really exists and use the docs' wording.
- **Tone:** calm, Apple-minimal explainer. No launch-video or marketing style (no music-video cuts, no hype text slams); Nader rejected those.

## Standing layout rules (every real UI shot)

Light mode, Chrome at 125% zoom (`ZOOM=1.25`), left sidebar collapsed unless the step uses it, an empty or unused right panel hidden, and a thin animated blue ring with a soft shadow around whatever the line talks about, with the caption beside it, never over the control or text being described. Masks over the account email.

## Narration

Two cuts by default: the captioned cut (no voice) and a cut narrated in Nader's voice (`T8iHhGIWPm2GVYpQD1Am`, `VO_NAME=nader`).

- ElevenLabs default settings only (stability 0.5, similarity 0.75, style 0, speed 1); no tuning, seed, context or `next_text`.
- Generate the whole script as ONE take with `_kit/tools/vo_onetake.py`, cut locally at sentence boundaries. Never send lines to ElevenLabs one by one. The STT check must pass. Run it from `tutorials/` with relative paths.
- Write fewer, longer, whole sentences: one per scene, each standing alone (no lines starting with "And"/"Or", no lead-ins). Open with what it does, not "This is Devin X".
- Don't say file names or numbers that need respelling (spelling out `auth.js` made an 11.7 s subtitle); keep names in the diagram.
- Animated diagrams need their own timings for the narrated cut, because lines run 1.5–2.5× longer than captioned holds. Sync scene builds to the line's word timings in `vo/<voice>/lines.json`, and set each scene's hold at least as long as its line.
- Give every proof shot its own short line or a matching hold: a short scene line followed by silent proof shots leaves gaps.
- Run `VOICE=<id> node _kit/tools/render.mjs <dir> --count` before building; keep every "narration waits on visuals" under ~1 s by trimming or lengthening scene holds.
- After the build, check the opening: STT hears the intro chime as "[on-hold music]", so check the first word's time and the waveform.

## Kit gotchas

- A diagram-only `scene:` beat still needs a placeholder PNG in `shots/` (blank 4320×2430 `#FCFCFC`) and a `beats.json` row.
- Bottom captions cover y ≈ 715–770 of the 810 frame: keep diagram content above ~700. Diagram eyebrow and subtitle text at least ~13 px in the 1440 layout so it reads at 1080p.
- Kit `hl`/ring boxes are 1440×810 units, and `x/y` is the box centre. Render 2–4 frames (`render.mjs <dir> --frames … --out build/fix`) before the full build. On session pages never use `capPos: 'bottom'` (it covers the composer); on wide Simulator shots bottom is right.
- Builds from existing shots render ~100 ms/frame, ~25 min per 4K cut. Captioned and narrated builds of one folder share `build/`, so run them one after the other.

## Sign-in (only if you need new real UI shots)

Record in the `thequantexplorer` Devin org. Demo repos are `thequantexplorer/*`, never `dabit3/*`. If `DEVIN_WEB_LOGIN_EIGENEXPLORER` is in your environment, start a CDP Chrome and run `CDP=http://127.0.0.1:<port> DEVIN_WEB_LOGIN="$DEVIN_WEB_LOGIN_EIGENEXPLORER" node tutorials/_kit/tools/devin-login-import.mjs`; it should land on https://app.devin.ai/org/thequantexplorer. Never print or commit the secret. If it's missing or expired, ask Nader to sign in through your Desktop tab. If a proof needs an account state the org doesn't have, stop and ask. Your own git token can't reach `thequantexplorer/*` repos: close demo PRs and delete branches through a short off-camera Devin session there. Clean up everything you create and list it in the PR description.

## Rules for parallel sessions

- `tutorials/_kit` must stay byte-identical to main's. One-off helpers go in your tutorial folder. A kit change needs approval, must be tiny and additive, and must keep older videos rendering the same.
- Don't edit `TUTORIAL_PROMPT.md` or `OVERVIEW_PROMPT.md`; report prompt lessons in your final message instead.
- Never commit `vo/<voice>/_full-take.wav` (`git add vo` picks it up).

## Deliverables (one PR to dabit3/devin-tutorials from a branch off main)

- `<folder>.mp4` (captioned, no voice) and `<folder>-nader.mp4` (narrated), each a 4K60 master plus a 1080p preview, a hand-picked `poster.png` (a diagram or proof frame, not the default middle frame), `voice-script.md`, `shots/SOURCES.json`.
- README rows in `tutorials/README.md` and the root `README.md`, marked as an overview. The root README is a numbered list that GitHub renumbers: put a blank line plus `<!-- -->` before a row whose number doesn't follow the previous one, and check it renders right. Fetch and merge main right before opening the PR.
- Push commit by commit (`git push origin <sha>:refs/heads/<branch>`), each MP4 on its own: big pushes return 504 or "remote unpack failed".
- Before you finish: frame sheets of both cuts (diagram legible at 1080p, nothing overlapping, captions never over what they describe), STT passed, opening checked.
- Final message: PR link, durations, the 1080p previews and voice script attached, 3–4 key stills (diagrams plus a UI proof shot), and a short list of prompt lessons. Don't merge the PR.
