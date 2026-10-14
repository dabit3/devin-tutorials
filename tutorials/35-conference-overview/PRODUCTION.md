# Conference production notes

## Editorial redesign

The 176.20-second silent film introduces ten distinct capabilities individually, rather than dropping the audience into unexplained product screens. Each section has a large capability name and one meaningful benefit, followed by a title-to-header move and expansion of the real demo. The opening is only Devin branding; the closing is branding and devin.ai. No filler slogans, technical title metadata, chapter numbers, tiny labels, progress lines or decorative shapes.

The Computer Use hero is cut into search, filtering/day switching, conflict and resolution/export actions. These remain app test scenarios, not extra Devin capabilities. Original and held-revision interaction receive 54.5 seconds, with another four seconds of real Devin recording context. The actual keyboard-focus finding remains between testing and steering/fix/review/retest. No failure was planted.

All thirteen source files were captured during this production on 14 October 2026. This design revision recuts that fresh footage; it does not use any earlier tutorial media. Orbit is a separate DeepWiki/Ask example, then Northstar supplies a coherent engineering workflow. Historical conversation, Skill and PR panels were genuinely recaptured after completion, not manufactured to imply live code generation. Every selected source range plays at 1×. Waits between sessions are removed, not blindly sped up.

## Visual hierarchy and motion

- One flat warm-white surface, `#fafaf8`, with near-black Inter and restrained cobalt. No presentation gradients.
- Capability names: 268px; benefit copy: 120px; docked feature headers: 100px; action labels: 90px. No smaller editorial copy.
- Viewport: `[192,198,3456,1944]` on the 3840×2160 canvas, exactly 16:9. The demo uses 90% of the canvas width.
- A 3.2-second feature introduction gives the title a readable hold, then contracts it to the header over 0.95 seconds. The demo rises/scales into place underneath. During the transition it is clipped below the moving title, never overprinted behind it.
- Eased source-aware camera moves enlarge the actual action. Product motion remains the primary action; camera keys do not generate UI behavior.
- Cobalt rounded rectangles have equal source-space padding, a restrained perimeter reveal and a soft outside wash. They do not replace native UI focus rings or imply clicks.

## Alignment and timing

For source box `(x,y,w,h)`, padding `p`, camera crop `(cx,cy,cw,ch)` and destination `(dx,dy,dw,dh)`, `s=dw/cw=dh/ch`. The emphasis rectangle is `(dx+(x-p-cx)s, dy+(y-p-cy)s, (w+2p)s, (h+2p)s)`. Video and emphasis use that same per-frame transform. Padding is 12 source pixels for the inline citation and 14 for app controls/banners; the output stroke is 6px.

Preflight checks each highlight interval at the delivery frame rate and rejects a padded target leaving the crop. It checks every camera key against the encoded source dimensions, rather than the intended browser viewport. Unit tests cover transform/padding, interpolation, easing endpoints and exact title-to-header docking.

Retest highlights are timed against the decoded presentation frames, not just input-event timestamps. VFR recordings can hold a previous visible state across a capture gap. A direct single-frame seek can instead pick the next future frame; that is not a safe guide for overlay timing. Decode the entire selected range, resample at 60fps without changing duration, and inspect the actual output sequence. This is why the renderer uses FFmpeg-decoded frames, not browser MP4 seeking.

## Authenticity and access limits

`shots/SOURCES.json` pins source bytes, dates, ranges, repositories, available revisions, archive hashes, camera geometry and workflow linkage. No product text, response, result, PR status or merge ordering is invented.

Original archive: `852411d08b18fee18fa532e99f49eca23f39e213`, SHA256 `552d3025ef1454919e0583d39193a91e58ef7de81200ad1eae574c43f07a29bc`.

Held archive: `3dbd344a03ae8c60decc841b192e011a07d3f7b1`, SHA256 `117e4b3445427dbe0c8ec430c3b24ebe43ffcf089438ec2db65b85ebf24170e7`.

The Skill reran source/archive checks, lint, typecheck, 48 tests and build without changing the held archive. It did not add browser coverage. The independent retest and its limits remain credited separately.

Native Automation management and the capture login belong to different organizations; the demo org showed zero Automations. Its Context7 connector failed to list/call tools. A direct public MCP fallback answered, but is not depicted as a working installed connector. Dynamic Workflows were not added to pad the count. No unrelated Automation, production deployment or merge occurred.

## Reusable production lessons

1. Keep the capture compositor session attached until recording stops.
2. Probe encoded dimensions; do not rely on intended viewport geometry or multiply encoded coordinates twice.
3. Preserve presentation timing for variable-frame-rate sources; input timestamps alone are not sufficient for overlay timing.
4. Use one transform for footage and emphasis. Validate padded bounds for every highlight frame.
5. Introduce each capability before its demo. Conference copy must earn its space and be large enough to read.
6. Keep revision hashes and test metadata in provenance, not audience-facing headlines.
7. Retest a held archive; distinguish source checks from actual browser observations.
8. JPEG frame pipes carry full-range pixels. Convert to limited range explicitly before H.264 encoding; merely requesting yuv420p can still produce a yuvj420p stream. Assembly also normalizes older full-range segment caches.

## Release gates

Both delivery exports must be H.264/yuv420p, 3840×2160 / 1920×1080, 60fps, 176.20 seconds, 10,572 frames, one video stream and no audio. Fully decode both; scan every preview frame for blank/low-luma intervals. Review the full cut and normal-speed playback, then separately inspect intro-to-demo transitions, camera edges and highlight beginning/middle/end frames. Extract stills from the final master. Keep PR 119 unmerged; shared kit files and both tutorial prompt documents stay unchanged.

## Verification record

Both final exports pass full FFmpeg decode and stream checks: H.264, yuv420p/limited range, 60fps, 10,572 frames, 176.20 seconds, one video stream, no audio. Every preview frame passed the low-luma scan: minimum average luma 174.684, zero frames below 20.

Full-cut video review found no visual defects. Native QuickTime playback at 1× reached 176.20 seconds and stopped normally. Twenty-one beginning/middle/end highlight frames were separately inspected; targets, native focus states and symmetric padding are aligned. Feature transitions and final-master stills were reviewed. This is not a claim that every encoded frame was visually inspected; the decode/luma checks cover every frame. Check the actual conference machine/projector before playback.

4K SHA256: `0d0321f85b1d03b5673fab710d0cce1cad917bcb3f073f1b5addf500bab1da16`.
1080p SHA256: `3b58d90b67b8be27a3d7f19009326a8ca3bdaf146460205c53bed9de52ebf110`.
