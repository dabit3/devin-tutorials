# Meet Devin — rebuilt conference reel

A **176.20-second silent reel** covering **ten distinct Devin capabilities**, built from entirely new product recordings captured on 14 October 2026. Orbit's DeepWiki and Ask introduce repository understanding. One Northstar engineering story then moves from a real request through browser testing, a genuine finding, steering, independent review, a live workspace, recorded retesting and an explicitly invoked release-check Skill.

- [4K master](35-conference-overview.mp4): 3840×2160, 60fps, H.264.
- [1080p preview](35-conference-overview-1080p.mp4): 1920×1080, 60fps, H.264.
- Both contain exactly one video stream and **no audio stream**.
- Full-frame stills: [opening](poster.png), [expanded demo](stills/expanded-demo.png), [highlight alignment](stills/highlight-alignment.png), [testing hero](stills/testing-hero.png), [feature introduction](stills/feature-introduction.png), [DeepWiki](stills/deepwiki.png), [Skill activation](stills/skill-activation.png), [keyboard retest](stills/keyboard-retest.png).

## Chapters

Each capability is introduced **before** its demonstration. The title contracts into the demo header while the footage expands below it. All editorial copy is at least 90px on the 4K canvas; native product text is authentic footage, enlarged through deliberate crops rather than replaced.

| Introduction | Demo | Capability / action |
|---|---|---|
| 0:00.00 | — | Devin branding |
| 0:03.20 | 0:06.40 | DeepWiki — navigate architecture and expand its diagram |
| 0:16.40 | 0:19.60 | Ask — follow a code citation into its source |
| 0:28.10 | 0:31.30 | Delegation — type the Northstar request |
| 0:39.30 | 0:42.50 | Computer Use — search, filter, switch days, expose/resolve an overlap and export |
| — | 1:22.00 | Computer Use — the genuine keyboard-focus finding |
| 1:27.50 | 1:30.70 | Collaboration — precise steering and revision-hold instructions |
| 1:39.20 | 1:42.40 | Managed Devins — completed independent reviewers |
| 1:46.60 | 1:49.80 | Cloud IDE — find and open the live source file |
| 1:57.30 | 2:00.50 | Devin Review — inspect the real PR branch |
| 2:09.00 | 2:12.20 | Recorded tests — play evidence in the actual Devin conversation |
| 2:16.20 | 2:19.00 | Verify the fix — forward/reverse Tab wrapping and Escape |
| 2:34.00 | 2:37.20 | Skills — invoke the release-check playbook |
| — | 2:44.20 | Skills — inspect activation, then the completed result |
| 2:52.70 | — | Devin branding and devin.ai |

Full-frame browser interaction occupies **54.5 seconds**, plus four seconds of native recording-playback context. Product shots use a **3456×1944** viewport inside the 3840×2160 frame. Large supporting copy stays above the demo. Source-coordinate emphasis follows the same camera transform as the footage, with equal padding on all sides. No progress strips, chapter numbers, tiny metadata, filler slogans, decorative shapes, presentation gradients or audio.

## Capability coverage

These are product capabilities, not a count of chapters or Northstar app features. The finding and retest belong to Computer Use; the two Skill shots are one capability. Search, conflict detection and calendar export are test scenarios, not additional Devin capabilities.

| # | Devin capability | Visible action → result | Selected source |
|---|---|---|---|
| 1 | DeepWiki | Open Core Architecture and expand the real diagram → repository structure and source citations | `35-deepwiki.mp4` |
| 2 | Ask | Open answer citations → the actual referenced source code | `10-code-proof.mp4` |
| 3 | Natural-language delegation | Type the Northstar brief → the session whose working result follows | `01-request.mp4` |
| 4 | Computer Use | Exercise the working app → a real finding, fix and keyboard retest | `hero-northstar-852411d.mp4`, `28-real-finding.mp4`, `retest-northstar-3dbd344.mp4` |
| 5 | Steering and collaboration | Send precise revision-hold instructions → the subsequent review and verification stay on that revision | `21-steer.mp4` |
| 6 | Managed Devins | Open Agents → inspect two completed independent reviewers and their findings | `24-agents-and-changes.mp4` |
| 7 | Cloud IDE | Use the live file picker → open real held source in the connected workspace | `36-live-workspace.mp4` |
| 8 | Devin Review / PR workflow | Open the PR and navigate purpose-grouped changes → inspect the real branch before merging | `25-pr-review.mp4` |
| 9 | Recorded test evidence | Click Play in the Devin conversation → replay the actual independent retest | `30-recording-replay.mp4` |
| 10 | Skills | Invoke `northstar-release-check`; expand its run → actual activation and passing checks with an evidence artifact | `33-skill-invoke.mp4`, `37-skill-run.mp4` |

### Unavailable and omitted capabilities

- **Automation:** the authenticated capture account belongs to `thequantexplorer`, while native Automation management was scoped to a different organization. The demo UI had zero Automations. No unrelated Automation was created, triggered or changed; no settings list stands in for a run.
- **Configured MCP integration:** the demo session's native Context7 connector returned `Error listing tools` and `Error calling resolve-library-id`. A direct HTTP JSON-RPC request to the real public Context7 MCP server succeeded, but this workaround is **not** presented as a working installed integration. That capture is excluded.
- **Dynamic Workflows:** not added merely to increase the count; the coherent example already has real independent managed reviews. Slack and multiplatform are also omitted rather than fabricated or shown through old media.

## Evidence and limitations

Northstar is [product-demo-apps PR 38](https://github.com/thequantexplorer/product-demo-apps/pull/38). The film shows an open PR, not a merge. Conversation and review panels were recaptured after work completed: genuine messages and changes, not simulated live code generation.

The first hero uses `852411d08b18fee18fa532e99f49eca23f39e213`. It is **not** presented as passing strict dialog Tab wrapping. The genuine failure is followed by feedback, fixes and the independent Chrome retest of `3dbd344a03ae8c60decc841b192e011a07d3f7b1` (archive SHA256 `117e4b3445427dbe0c8ec430c3b24ebe43ffcf089438ec2db65b85ebf24170e7`).

Verified UI coverage: forward/reverse Tab wrap after export, Escape opener restoration, K1–K3 focus recovery, search/filter/day/save/conflict/reload, two-real-tab synchronization and actual `.ics` downloads. Repeated live-region DOM updates passed; actual screen-reader speech was not tested. Lone-CR browser fixtures, failed-storage-write browser recovery, external calendar import, mobile, other engines and exhaustive permutations remain untested. K5 is a source/lint check, not a browser scenario.

[SOURCES.json](shots/SOURCES.json) pins all **thirteen selected source videos** by SHA256 and records capture timestamps, frame logs, URLs, repositories, available revisions, archive hashes, clip in/out, speed and geometry. The Ask UI did not expose its indexed commit; its exact captured media is pinned instead. DeepWiki's source links exposed abbreviated indexed commit `26145cfd`; the film shows new navigation, not a claim that indexing occurred during the take. All clips play at **1×**. The retest source has variable frame timing; the film resamples it to 60fps without changing speed. The recording-context shot is followed by a full-resolution replay from the beginning, not a purported seamless live continuation. Only branding/font assets are reused.

The final Skill sequence explicitly shows a new invocation, the native **Activated skill: northstar-release-check** event, and its completed result. That run repeated source/archive checks, lint, typecheck, 48 tests and the production build. It did not claim new browser coverage; its report credits the independent retest and preserves its untested cases.

## Rebuild and verify

Requires Node, Chrome, FFmpeg/ffprobe and the existing kit's `puppeteer-core` dependency. No new packages.

```sh
bash tutorials/35-conference-overview/build.sh
```

`prepare.mjs` checks source hashes, every camera crop, 16:9 geometry, all highlight frames, intro-to-demo ordering and integral output frame counts. `render.mjs` decodes selected source ranges through FFmpeg at 60fps, then renders each frame through the same Canvas2D camera/highlight transform. Decoded-frame caches are keyed by pinned source hash and range. `verify.mjs` fully decodes both exports and checks codec, resolution, 60fps, 10,572 frames, duration and no audio. `node --test tutorials/35-conference-overview/motion.test.mjs` covers camera interpolation, symmetric padding, title docking and easing.

For a quick design draft: `render.mjs --draft` (1080p30, not a delivery export). For still samples: `render.mjs --draft --samples wiki-intro:1.4,retest:7.8`. For selective iteration: `render.mjs --only code,hero-search`, then `render.mjs --assemble` **only after every current segment has been rendered**. `sources.mjs` deliberately repins provenance; the normal build does not run it. Frame logs retain timing evidence. Original capture JPEGs were discarded after source encoding; decoded edit frames are generated locally under the ignored build directory. The edit rebuild uses only committed MP4 sources.

See [PRODUCTION.md](PRODUCTION.md) for alignment math and production lessons. Shared kit files and tutorial prompt documents are unchanged.
