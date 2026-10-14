# Conference production notes

## Editorial decisions

- Replace the rejected screenshot montage with thirteen selected new recordings covering ten distinct capabilities in 185.20 seconds. Orbit DeepWiki/Ask is explicitly a separate opening example.
- Show actual typing, pointer movement, clicks, code navigation and application state changes. Full-frame testing receives 72.4 seconds, including original and held-revision takes; native evidence playback adds four seconds of unmistakable Devin session context.
- Preserve the genuine failure: the original archive did not satisfy strict dialog Tab wrapping. Show its actual feedback before the fix/review/retest material.
- Show two real managed reviewers, live source navigation in Cloud IDE, and the release-check Skill's actual invocation, activation event and result. The README coverage table groups finding/retest as Computer Use and both Skill shots as one feature. Northstar's app functions are not counted as Devin features.
- Native Automation management and the capture login were scoped to different organizations; the demo organization showed zero Automations. Its native Context7 connector failed to list/call tools. A real direct-MCP fallback answered, but is not depicted as a working installed connector. Omit these examples rather than fabricate success or pad with settings. No unrelated Automation was touched.
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

Preflight hashes, crops, output-frame counts and highlight timing. Fully decode both outputs and verify one H.264 video stream, 60fps, exact dimensions, 185.20s/11,112 frames, no audio. Review the entire cut at normal speed, plus transition and highlight beginning/middle/end frames. Inspect camera easing and edge clipping separately. Export full-frame stills from the final master, not a mockup. Update PR 119 only, leave it unmerged, attach both videos and stills.

## Verification record

The revised source/hash/geometry preflight, JavaScript syntax, shell syntax and diff-whitespace checks pass. The held Northstar archive independently passed lint, typecheck, 48 unit tests and production build; the newly invoked Skill repeated these checks without changing the archive. Browser coverage and remaining gaps are recorded separately in the README and source manifest.

Both revised exports fully decode with FFmpeg: H.264, yuv420p, 3840×2160 / 1920×1080, 60fps, 185.20 seconds, 11,112 frames, exactly one video stream and no audio. All 11,112 preview frames passed the technical blank-frame scan (minimum luma range 214; zero black intervals).

Full-cut video review and normal-speed browser playback were completed, with additional opening, transition, retest, replay, Skill and highlight beginning/middle/end inspections. The browser reached 185.20 seconds at playbackRate 1 with zero corrupted frames, but the VM's Chromium player dropped approximately 10% of display frames; this is not a claim of frame-perfect playback on this host. Encoded-frame counts and full-decode checks pass independently. Check playback on the actual conference machine before projection.

Six representative full-frame stills were exported from this final 4K master. The earlier evidence-document-only source is excluded from the production tree; thirteen selected recordings remain. Shared kit files and both tutorial prompt documents are unchanged.
