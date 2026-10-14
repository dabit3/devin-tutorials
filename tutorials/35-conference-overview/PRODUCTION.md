# Conference production notes

## Editorial decisions

- Replace the rejected screenshot montage with nine new recordings and a Northstar engineering cycle. Orbit Ask is explicitly a separate opening example.
- Show actual typing, pointer movement, clicks, code navigation and application state changes. Testing receives 80.15 seconds, including original and held-revision takes.
- Preserve the genuine failure: the original archive did not satisfy strict dialog Tab wrapping. Show its actual feedback before the fix/review/retest material.
- Show two real managed reviewers and a real release-check skill's evidence artifact. Omit optional Slack, scheduling, integration and multiplatform examples rather than reuse old media or pad with static settings.
- All clips remain at 1×. Session waits are omitted. Historical panels were recaptured after completion; no live-generation claim is made. No merge or production deployment.

## Visual system and alignment

One flat warm-white surface (`#f6f6f3`), near-black Inter and restrained cobalt. No presentation gradients or arbitrary split backgrounds. Compact chapter copy sits above the demo. Viewport `[144,128,3552,1998]` in a 3840×2160 canvas is exactly 16:9.

A 1.22× modal zoom eases in at hero seconds 33–33.8 and out at 49–49.8. Most motion comes from the actual UI. Opening/closing branding is visible from frame zero, avoiding an all-white entrance.

For source box `(x,y,w,h)`, padding `p`, crop `(cx,cy,cw,ch)` and destination `(dx,dy,dw,dh)`, scale is `s=dw/cw=dh/ch`. The emphasis rectangle is `(dx+(x-p-cx)s, dy+(y-p-cy)s, (w+2p)s, (h+2p)s)`. Source padding is 10px on the citation and 12px on the conflict banner; stroke is 4 output pixels. No circles. The hero highlight ends at 30.8s, before the camera move. Preflight rejects overlap.

## Provenance

Every included product source was captured in this production session on 2026-10-14 UTC. `shots/SOURCES.json` records exact bytes, dates, clip ranges, archives and workflow linkage. Both test sources retain detailed geometry/input logs. Product text, results, replies, PR state and UI are not fabricated.

Original archive: `852411d08b18fee18fa532e99f49eca23f39e213`, SHA256 `552d3025ef1454919e0583d39193a91e58ef7de81200ad1eae574c43f07a29bc`.

Held archive: `3dbd344a03ae8c60decc841b192e011a07d3f7b1`, SHA256 `117e4b3445427dbe0c8ec430c3b24ebe43ffcf089438ec2db65b85ebf24170e7`.

README lists coverage limits. Release evidence distinguishes export from external calendar import and credits browser observations to the independent testing agent, not the source-checking builder.

## Reusable lessons

1. Keep Chrome's emulation CDP session attached until screencast capture stops. Early detachment can reset the compositor and silently change dimensions.
2. Probe every source, not its intended viewport. Native fullscreen and ordinary page captures need different emulation scales. Exclude invalid/outtake media entirely.
3. Preserve actual timestamps. Nominal 60fps does not guarantee constant timing; resample VFR sources without changing duration.
4. Measure emphasis after layout settles. Never reuse geometry from another viewport or multiply encoded geometry twice.
5. Retest a held commit and archive SHA256. Separate source checks from browser observations.
6. Crop transparent header overlays to their 128px strip before composition; decoding full transparent 4K frames wastes resources.

## Release gates

Preflight hashes, crops, output-frame counts and highlight timing. Fully decode both outputs and verify one H.264 video stream, 60fps, exact dimensions, 172.35s/10,341 frames, no audio. Review the entire cut at normal speed, plus transition and highlight beginning/middle/end frames. Inspect camera easing and edge clipping separately. Export four full-frame stills from the final master, not a mockup. Update PR 119 only, leave it unmerged, attach both videos and stills.

## Completed verification — 2026-10-14

- Source/hash/geometry preflight, JavaScript syntax, shell syntax and diff-whitespace checks passed.
- Both delivery files passed full FFmpeg decode and exact stream/frame/duration checks, including no audio.
- Full-duration video review and 1× browser playback completed. Individual full-resolution frames were also inspected for both highlight intervals (beginning/middle/end), modal zoom entrance/exit, chapter transitions, retest focus states and the close.
- A technical scan covered all 10,341 preview frames: no black intervals, minimum per-frame luma range 214/255. This is a blank-frame check, not a claim of manual visual inspection of every frame.
- The held Northstar archive independently passed lint, typecheck, 48 unit tests and production build. Browser coverage and remaining gaps are recorded separately in the README and source manifest.
