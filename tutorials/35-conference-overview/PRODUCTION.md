# Conference production notes

## Current editorial direction

177.30 seconds, ten distinct capabilities. Every feature is introduced individually with a large capability name and one meaningful benefit. Branding opens and closes the reel without slogans or a split background. Product footage dominates a 3456×1944 viewport on the 3840×2160 canvas. All editorial copy is at least 90px; no tiny metadata, numbered chapters or decorative shapes.

Computer Use is rebuilt around the actual live Devin conversation/Computer surface, not the standalone Northstar app. There are 53 seconds of live testing context and six seconds of native recorded-test evidence. The original archive exposes real focus failures; the fixed archive receives a fresh independent focused five-passed retest. Orbit is a separate code-intelligence example. Historical conversation/review/Skill panels are genuine recaptures, not invented live generation. Every source plays at 1×.

## Framing, palette and motion

- Pure white `#fff`, near-black `#17191d`, neutral grayscale and blue `#2463eb`. Source footage receives grayscale treatment; blue is the only editorial accent. No cream, yellow or presentation gradients.
- Capability titles: 268px; benefit: 120px; header: 100px; action label: 90px.
- Every product crop equals the complete encoded source. No general-purpose camera crop or pan is used. Standard 2880×1620 sources fill the viewport; the 1440×900 request is centered and contained at its native aspect ratio, never stretched.
- 125% capture is implemented as a 1152×648 logical viewport with a 2.5× encoded coordinate scale and 2880×1620 visible surface. CSS zoom remains 1. Applying CSS zoom 1.25 had clipped the interface and was rejected; selected original-test ranges begin after that experiment was removed.
- The opening brand fades/departs before DeepWiki. Major view changes use a 0.92-second quintic-eased white dissolve. No abrupt opening jump remains.
- Feature titles dock over 0.8 seconds, ending 0.4 seconds before the demo. The complete interface fades in during the final 0.65 seconds, with only a contained 3.5% scale settle and 16px entrance offset. No title-relative wipe crops the interface. Feature-to-demo boundaries share the exact title and source frame, without a duplicate crossfade header.
- Action captions crossfade over 0.38 seconds. Blue outline emphasis has no broad wash or shadow.

## Alignment

For source box `(x,y,w,h)`, equal padding `p`, crop `(cx,cy,cw,ch)` and contained destination `(dx,dy,dw,dh)`, `s=dw/cw=dh/ch`. The outline is `(dx+(x-p-cx)s, dy+(y-p-cy)s, (w+2p)s, (h+2p)s)`. Footage and emphasis use the same transform. The output stroke is 6px.

Ask's citation uses 12 source pixels of padding. The native five-passed/zero-failed badge union uses 14, measured from the two actual badge bounds rather than their wider flex container; its geometry is retained alongside source 40. Preflight checks padded targets at every delivery frame. Unit tests cover transforms, easing, docking, complete per-source framing and aspect-preserving containment.

Variable-frame-rate capture requires decoded presentation frames for timing. An isolated video seek can choose a future frame across a capture gap and is not safe for highlight alignment. Selected ranges are decoded/resampled at 60fps without changing their speed.

## Provenance and access

`shots/SOURCES.json` pins thirteen selected source videos, available revisions, archive hashes, source bytes and edit ranges. Sources 38–40 are new real native testing/evidence captures from this revision. No UI replies, outcomes, PR states or merge ordering are fabricated. Original and held archive hashes and test limitations are in README and the manifest.

The original fresh test returned six passed/three failed. The new held-build focused retest returned five passed/zero failed for real ICS export, Export focus, Tab/Shift–Tab containment and Escape opener restoration. It did not repeat wider scenarios or Remove/disappeared-opener coverage. The Skill reran archive/source checks, lint, typecheck, 48 tests and build, not browser coverage. Held source/archive and PR 38 were unchanged.

Automation and the capture login belong to different organizations; the demo org showed zero Automations. Its native Context7 connector failed to list/call tools. Direct public MCP access worked but is not depicted as a working installed connector. No settings-only substitutes, unrelated Automation, production deployment or merge occurred.

## Reusable lessons

1. Keep the capture compositor session attached until recording stops.
2. Probe encoded geometry; do not multiply source coordinates twice.
3. Use a logical scaled viewport, not clipping CSS zoom.
4. Establish the full interface; only emphasize a bounded target after context is clear.
5. Contain non-16:9 sources without stretching or cutting off required UI.
6. Measure target unions, not oversized layout containers. Validate beginning/middle/end alignment.
7. Preserve VFR timing and use decoded frames for overlays.
8. Introduce every capability; put revision hashes in provenance, not conference headlines.
9. Separate source checks from browser observations and retest a held archive.
10. Explicitly convert full-range JPEG pipes to limited range before H.264; yuv420p alone does not guarantee range normalization.

## Release gates and verification

Required: H.264/yuv420p, limited range, 3840×2160 / 1920×1080, 60fps, 177.30 seconds, 10,638 frames, one video stream, no audio. Fully decode both and scan every preview frame for low luma. Review the entire cut at normal speed and inspect opening/title boundaries, full-context framing and beginning/middle/end emphasis. Extract stills from the final master. Keep PR 119 unmerged and both tutorial prompt documents unchanged.

Verified on 14 October 2026:

- Both exports fully decode with FFmpeg and match every stream gate: H.264/yuv420p, limited (`tv`) range, 60fps, 177.30 seconds, 10,638 frames, one video stream and no audio. Master: 3840×2160; preview: 1920×1080.
- The numeric luma scan covered all 10,638 preview frames. Minimum average luma was 208.152; zero frames fell below the low-luma threshold of 26.
- The final 4K master played at 1× in QuickTime from zero to 177.30 seconds, stopping at the endpoint. Full-cut video review used a downscaled, timing-preserving final-master review copy. Opening/title boundaries, complete request framing, final-master stills and both highlights at beginning/middle/end were additionally inspected. This is not a claim that every encoded frame was visually inspected.
- Syntax checks for every local JS/MJS file, shell syntax, six motion tests, source/hash/measured-geometry preflight and whitespace checks passed. No active repository pre-commit hook was installed; only sample hooks were present.
- Final-master production stills were regenerated. Shared kit and both tutorial prompt documents remain unchanged. No merge or deployment was performed. Check the actual conference playback machine/projector before projection.

| Export | SHA256 |
|---|---|
| 4K master | `a7e80c3966bc886a44b6840a279faf5d594d64b6980788209fa14173ae22c526` |
| 1080p preview | `9390b47255926ce8cd9edc9e99774c5c2f7e78227f578a3b735fea91f4266bd8` |
