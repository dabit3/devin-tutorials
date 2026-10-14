# Meet Devin — conference reel

A **177.30-second silent reel**, covering **ten distinct Devin capabilities** with new real product captures made during this production on 14 October 2026. Orbit supplies DeepWiki/Ask; Northstar supplies the request → test → finding → steering → review → retest story. No earlier tutorial media is used.

- [4K master](35-conference-overview.mp4): 3840×2160, 60fps, H.264/yuv420p.
- [1080p preview](35-conference-overview-1080p.mp4): 1920×1080, 60fps, H.264/yuv420p.
- Both: one video stream, **no audio**, 10,638 frames.
- Full-frame stills: [opening](poster.png), [introduction](stills/feature-introduction.png), [expanded interface](stills/expanded-demo.png), [aligned emphasis](stills/highlight-alignment.png), [testing hero](stills/testing-hero.png), [testing action](stills/testing-action.png), [native evidence](stills/testing-evidence.png), [keyboard retest](stills/keyboard-retest.png), [Skill activation](stills/skill-activation.png).

## Design and framing

Each capability receives a readable large-type introduction **before** the demonstration. Its title docks into the header before the complete interface fades into place. Pure white, near-black, neutral grayscale and blue only; no cream or yellow. Blue is the only editorial accent. Source footage is graded grayscale, without replacing authentic product text or behavior.

Every product shot preserves the **complete encoded interface**, without camera cropping or stretching. Standard 2880×1620 sources fill the 3456×1944 product viewport. The 1440×900 request source is contained with equal side margins at its original aspect ratio. New fixed-revision testing captures use a 125%-scale logical viewport rather than clipping CSS zoom. All editorial copy is at least 90px on the 4K canvas; no chapter numbers, tiny metadata, progress strips, filler slogans, decorative shapes, gradients or audio.

The live **Devin conversation and Computer panel** occupy 53 seconds, with another six seconds in Devin's actual recorded-test viewer. This is not an app-only testing montage. All selected footage plays at **1×**; idle waits between sessions are omitted.

## Chapters

| Introduction | Demo | Capability / action |
|---|---|---|
| 0:00.00 | — | Devin branding |
| 0:03.80 | 0:07.00 | DeepWiki — architecture and diagram navigation |
| 0:17.00 | 0:20.20 | Ask — follow an answer's source citation |
| 0:28.70 | 0:31.90 | Delegation — type the Northstar request |
| 0:39.90 | 0:43.10 | Computer Use — real live testing inside Devin |
| — | 1:21.10 | The genuine keyboard-focus finding |
| 1:26.60 | 1:29.80 | Collaboration — revision-hold steering |
| 1:38.30 | 1:41.50 | Managed Devins — independent reviewers |
| 1:45.70 | 1:48.90 | Cloud IDE — open the held source file |
| 1:56.40 | 1:59.60 | Devin Review — inspect the real PR branch |
| 2:08.10 | 2:11.30 | Recorded tests — replay five-passed evidence |
| 2:17.30 | 2:20.10 | Verify the fix — forward/reverse Tab in Devin |
| 2:35.10 | 2:38.30 | Skills — invoke the release-check playbook |
| — | 2:45.30 | Skill activation and completed result |
| 2:53.80 | — | Devin branding and devin.ai |

## Capability coverage

The finding and retest belong to Computer Use. The two Skill shots are one capability. Northstar's search, conflicts and export are test scenarios, **not additional Devin capabilities**.

| # | Capability | Visible action → result | Selected source |
|---|---|---|---|
| 1 | DeepWiki | Open Core Architecture and expand its diagram → structure and citations | `35-deepwiki.mp4` |
| 2 | Ask | Open answer citations → actual referenced code | `10-code-proof.mp4` |
| 3 | Delegation | Type the brief → the session whose working result follows | `01-request.mp4` |
| 4 | Computer Use | Watch native live testing → genuine finding and focused fixed-revision retest | `38-testing-ui-original.mp4`, `28-real-finding.mp4`, `39-testing-ui-retest.mp4` |
| 5 | Collaboration | Send precise revision-hold instructions → verification stays on that revision | `21-steer.mp4` |
| 6 | Managed Devins | Open Agents → two completed reviewers and findings | `24-agents-and-changes.mp4` |
| 7 | Cloud IDE | Use the file picker → real source in the connected workspace | `36-live-workspace.mp4` |
| 8 | Devin Review | Navigate purpose-grouped changes → inspect the open PR before merge | `25-pr-review.mp4` |
| 9 | Recorded tests | Open the native evidence viewer → replay with five passed / zero failed assertions | `40-testing-evidence.mp4` |
| 10 | Skills | Invoke the playbook and expand its run → native activation and passing checks | `33-skill-invoke.mp4`, `37-skill-run.mp4` |

### Omitted capabilities

Automation management and the capture account belong to different organizations; the demo org showed zero Automations. No unrelated Automation was created or triggered. The native Context7 connector failed to list/call tools. Its direct public MCP fallback worked but is **not** presented as a working installed connector. Dynamic Workflows, Slack and multiplatform are omitted rather than fabricated, padded with settings cards or shown through old footage.

## Authentic evidence and limits

Northstar is [product-demo-apps PR 38](https://github.com/thequantexplorer/product-demo-apps/pull/38), shown open, not merged. Completed conversation/review panels were genuinely recaptured; they do not imply live code generation. The new original-archive test returned **six passed / three failed** assertions. Its genuine finding is followed by steering, review and an independent focused retest of the held fixed revision.

- Original: `852411d08b18fee18fa532e99f49eca23f39e213`; archive SHA256 `552d3025ef1454919e0583d39193a91e58ef7de81200ad1eae574c43f07a29bc`.
- Held: `3dbd344a03ae8c60decc841b192e011a07d3f7b1`; archive SHA256 `117e4b3445427dbe0c8ec430c3b24ebe43ffcf089438ec2db65b85ebf24170e7`.

The new held-build retest returned **five passed / zero failed** assertions: a real one-talk ICS download, retained Export focus, repeated Tab/Shift–Tab containment, and Escape restoring both existing openers. The selected live excerpt claims only visible Tab behavior; the native evidence viewer documents the full focused result. The recording viewer and following live capture are separately edited views of that test, not a purported seamless continuation.

That focused pass did not retest Remove focus, a disappeared-opener fallback, two-talk export or broader search/filter/save behavior. Earlier independent runs covered wider app scenarios and two-tab synchronization. Actual screen-reader speech, failed-storage-write recovery, lone-CR browser fixtures, external calendar import, mobile, other engines and exhaustive permutations remain untested. Source/lint checks are not browser observations.

The visible Skill invocation repeated archive/source checks, lint, typecheck, 48 tests and build without changing the held revision. It did not add browser coverage. No source fix, failure seeding, production deployment or merge occurred during the fresh read-only tests.

[SOURCES.json](shots/SOURCES.json) pins **thirteen selected videos** by SHA256 and records dates, frame logs, URLs, repositories, available revisions, archive hashes, in/out, speed and geometry. DeepWiki exposed indexed commit `26145cfd`; Ask did not expose its indexed commit. Media bytes are pinned either way. Only branding/font assets are reused.

## Rebuild and verify

Requires Node, Chrome, FFmpeg/ffprobe and the kit's existing `puppeteer-core`; no new packages.

```sh
node --test tutorials/35-conference-overview/motion.test.mjs
bash tutorials/35-conference-overview/build.sh
```

Preflight rejects incomplete source framing, invalid source geometry, changed measured-target geometry, unsafe highlight padding, bad intro ordering and non-integral frame counts. The renderer decodes source ranges at 60fps and uses one source-to-destination transform for footage and emphasis. Verification fully decodes both exports and checks dimensions, H.264/yuv420p, limited range, duration, 60fps, 10,638 frames, one stream and no audio. Both exports passed; all 10,638 preview frames passed the low-luma scan. Final 4K 1× playback, full-cut review and beginning/middle/end highlight inspections are recorded in the production notes.

For iteration: `render.mjs --draft` (1080p30, not delivery), `--draft --samples wiki-intro:1.4,retest:7.8`, or `--only code,test-session`. Use `--assemble` only after every current segment is rendered. `sources.mjs` deliberately repins provenance; the normal build does not. Capture frame logs are retained; raw capture JPEGs are discarded after encoding. Edit-frame caches live in ignored `build/` and regenerate from committed MP4s.

See [PRODUCTION.md](PRODUCTION.md). Shared kit and both tutorial prompt documents are unchanged. Check the actual conference machine/projector before playback.
