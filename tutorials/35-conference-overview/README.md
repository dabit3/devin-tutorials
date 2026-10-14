# Meet Devin — rebuilt conference reel

A **185.20-second silent reel** covering **ten distinct Devin capabilities**, built from entirely new product recordings captured on 14 October 2026. Orbit's DeepWiki and Ask introduce repository understanding. One Northstar engineering story then moves from a real request through browser testing, a genuine finding, steering, independent review, a live workspace, recorded retesting and an explicitly invoked release-check Skill.

- [4K master](35-conference-overview.mp4): 3840×2160, 60fps, H.264.
- [1080p preview](35-conference-overview-1080p.mp4): 1920×1080, 60fps, H.264.
- Both contain exactly one video stream and **no audio stream**.
- Full-frame stills: [opening](poster.png), [expanded demo](stills/expanded-demo.png), [highlight alignment](stills/highlight-alignment.png), [testing hero](stills/testing-hero.png), [DeepWiki](stills/deepwiki.png), [Skill activation](stills/skill-activation.png).

## Chapters

| Start | Chapter | Actual action shown |
|---|---|---|
| 0:00.00 | Opening | Unified ivory surface and Devin branding |
| 0:04.50 | DeepWiki · Orbit | Navigate to Core Architecture and expand its reducer-flow diagram |
| 0:15.50 | Ask · Orbit | Open code citations in a fresh repository answer |
| 0:27.50 | Delegate | Type the original Northstar request |
| 0:36.50 | Testing title | Test like a user |
| 0:40.00 | Computer Use | Search, filter, switch days, save talks, expose/resolve an overlap and export |
| 1:30.00 | Computer Use · finding | The actual Tab-escape finding and builder acknowledgement |
| 1:38.50 | Collaborate | Precise steering and revision-hold instructions |
| 1:48.30 | Managed Devins | Inspect two completed independent read-only reviews |
| 1:54.70 | Cloud IDE | Search for and open the live `ScheduleDialog.tsx` source |
| 2:04.50 | Review | Open the PR and scroll its purpose-grouped diff |
| 2:16.30 | Recorded tests | Click Play on the retest evidence inside the real Devin session |
| 2:20.30 | Computer Use · retest | Verify the fix: forward/reverse Tab wrapping and Escape |
| 2:42.70 | Skills · invocation | Type and send a request to run `northstar-release-check` |
| 2:50.20 | Skills · result | Show the actual Skill activation and passing release-check result |
| 3:00.70 | Closing | Build. Test. Review. |

Full-frame browser interaction occupies **72.4 seconds**, plus four seconds of native recording-playback context. Product shots use a 3552×1998 viewport inside the 3840×2160 frame. Copy stays above the demo. Two measured emphasis rectangles use equal padding; the modal zoom runs outside the highlight interval. No presentation gradients or reused product screenshots/recordings.

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

`prepare.mjs` checks source hashes, crop aspect/bounds, timings, integral output frame counts and highlight/camera separation. `render.mjs` renders local Canvas2D graphics, composites footage, concatenates the 4K master and encodes the preview. `verify.mjs` fully decodes both and checks codec, resolution, 60fps, 11,112 frames, duration and no audio.

For selective iteration: `render.mjs --only code,hero`, then `render.mjs --assemble` **only after every current segment has been rendered**. `sources.mjs` deliberately repins provenance; the normal build does not run it. Frame logs retain timing evidence; intermediate JPEGs are discarded after source encoding. The edit rebuild uses only committed MP4 sources.

See [PRODUCTION.md](PRODUCTION.md) for alignment math and production lessons. Shared kit files and tutorial prompt documents are unchanged.
