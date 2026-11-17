# Final live-product capture: S1–S9

Capture completed at approximately 13:33 UTC, before the 14:30 deadline. This is a capture-ready still/beat package, not a finished video, rewritten narration, or production deployment. The existing audio and assembled scenes remain provisional. Use the final selected manifest, not every raw take.

- [Full curated beat list in story order](production-beat-list.md): every beat ID, frame path, on-screen content, and highlight target.
- `shots/production-beats.json`: matching machine-readable selection in story order.
- Source PNGs are 3840×2160. Camera is steady; cursor disabled. Ring highlights remain `r.box`/`hlBox` metadata, never baked into source images.
- Every selected final frame was opened and visually inspected during capture. Geometry, metadata and helper tests are separate technical checks; they do not establish visual quality or PR lifecycle state.

## Final PR states and narrowly approved mutations

| Repository / PR | Authoritative final state | Outcome |
|---|---|---|
| [claims-service #16](https://github.com/thequantexplorer/claims-service/pull/16) | GitHub `State: closed (merged)` and actual Desktop `Merged` | Attachment API, content validation, access checks, persistence, tests and docs; later race fix committed through Desktop Review |
| [claims-portal #40](https://github.com/thequantexplorer/claims-portal/pull/40) | GitHub `State: closed (merged)` and actual Desktop `Merged` | Streaming proxy, helpers/UI/tests, customer help and static MIME fix |
| [claims-portal #39](https://github.com/thequantexplorer/claims-portal/pull/39) | GitHub `State: open` | Separate rollout/release notes; deliberately not merged |

Only #16 and #40 were merged, using the actual Desktop Merge button under the lead's explicit exception to the earlier no-merge rule. No tutorial commit/push or local command-line source commit/push was made. Authorized cloud authors published their PR work; the race-fix commit was published through Desktop Review's Commit Changes UI. No production deployment was performed.

**Production blocker remains:** PR #40's actual Desktop Review displayed **Critical · Broken Access Control · CWE-306 — Unauthenticated uploads to customer claims**, at `proxy.js:4`. The demo proxy injects fixed `cust-ana` / `CUSTOMER` identity for unauthenticated portal callers. This was not fixed, invalidated, or made production-safe. The approved demo merge proceeded with that finding still visible. Use desktop/0110.png before merge and desktop/0112.png after merge; never narrate this as a clean security review.

## What actually shipped and what each agent did

- Devin Local handled P2/P3 helpers and attachment UI. A real queue Edit → Update imposed the vanilla-JS/no-dependencies constraint; Stop reached awaiting instructions; the subsequent correction produced **Upload file** and **JPEG, PNG or PDF, up to 10 MB**.
- Codex implemented P1's streaming proxy and regression tests. OpenCode wrote customer help and was visibly steered to correct its label to **Upload file**. The side-by-side shot shows actual saved edits after completion, not fabricated simultaneous typing.
- CLI handed service S1–S6 to Ubuntu cloud and opened #16. A separate Desktop Cloud task produced non-overlapping portal rollout documentation in #39. The same service cloud identity is visible in CLI and the web session.
- Desktop Local handed existing uncommitted portal work to Ubuntu cloud. The first attempt had a real WebSocket failure; retry succeeded and the cloud session picked up the branch/changes, opening #40.
- DeepWiki was installed from Marketplace for Myself in My account. **MCP remains Not connected**; plugin installation and registry controls are not evidence of a connected MCP. Existing local hooks were viewed, not newly created. Both workspace AGENTS.md rules were shown.
- Local created the real `~/.config/devin/skills/claim-upload-checklist/SKILL.md`; it appeared in Skills. The checklist covers magic bytes/content type, 10 MB/20-file caps, empty files, ClaimAccess ownership/404, escaping and regression/API/proxy/UI tests. The file's additional final Maven/npm gate was intentionally left unchanged.

## S2 correction and S7 artifacts

The final manifest replaces clipped acceptance/task cuts with desktop/0058–0069 (`S2-clean-01` through `12`), each opened and checked by eye. The saved original/edited plan artifacts retain the real AC8 metadata-only sentence edit. Final approval controls were captured before implementation; the later scoped approval is a separate S3 beat.

The first generated Mermaid diagram genuinely failed. A real retry with quoted labels/plain edge labels produced the native Codemap **Claim upload: portal to service**, desktop/0102.png. Complete graph/core component names are visible; some long node descriptions truncate in the native boxes. No diagram was drawn manually.

Open Preview opened, but Local explicitly could not drive its file chooser or take screenshots. Instead Local used its offered fresh-profile installed Chrome/CDP harness, `~/work/inventory/upload-clm-1002.mjs`, with an actual file input and pointer click, not a direct upload API or fabricated UI. This is **not integrated Preview automation**.

The first genuine browser attempt exposed a preexisting missing static MIME header: Chrome rejected the imported ES module, so claims/upload controls never rendered. Healthy API/open status checks tried to disprove a backend explanation. Local added `src/mime.js`, server wiring and two regression tests; Node 22 passed 19 tests, and the cloud author published the fix in #40 at `298881cd977637468f20250ce5fc993063085609`.

The real retry uploaded `demo-claim.png` (800×450, approximately 3.9 KB) to IN_REVIEW claim CLM-1002. Actual browser evidence recorded:

```text
200 http://localhost:3000/ content-type=text/html; charset=utf-8
200 http://localhost:3000/format.js content-type=text/javascript; charset=utf-8
201 http://localhost:3000/api/claims/CLM-1002/attachments
Uploaded demo-claim.png.
demo-claim.png (3.9 KB)
```

`shots/web/0009.png` is an **unmodified imported browser artifact**, copied from `~/work/inventory/clm-1002-upload.png`, not a filming-Chrome recapture. The session shows the result/report in desktop/0103.png. The attempted editor display instead showed the Codemap (desktop/0104.png); that wrong-editor take is rejected. The browser smoke preceded the later concurrency fix; it was not rerun against a post-merge deployment.

## S8 Review, real race fix, checks and merges

Service Review initially showed **zero active findings and two invalidated findings**. The count-then-insert race was author-disclosed and verified in the actual upload source, not claimed as an active automated Review finding. The overview frame 0105 establishes the counters; one lower invalidated title is clipped, so do not use it as a readable detail shot.

Review chat proposed a pessimistic write lock on the claim row before the count/insert, plus a five-concurrent-upload test starting from 19 files. It explicitly said it **could not run Maven or push**. Frame 0106 preserves that limitation. We did not pretend it executed either operation.

The exact proposed three-file draft was copied only into detached verification worktree `~/work/inventory/service-review-verify`, checked with Java 17 and the external Maven Central mirror, and then applied/published through native Desktop Review **Commit Changes** (0107). Commit: `bff8ce85e4b41aadcd3b5a10b9bbe02967e4e1d8`. Repository and controller bytes matched verification exactly; the new test differed only by an absent final newline in the committed version, with identical trimmed content. No semantic draft changes were made.

Verification command:

```sh
./mvnw -s /home/ubuntu/work/inventory/maven-central-mirror.xml -B verify
```

The mirror is the documented substitute after Central returned 429; no shared build/CI configuration was changed. Preserved output at `~/work/inventory/service-review-verify.log`:

```text
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.133 s -- in com.northwind.claims.attachments.ConcurrentUploadCapTest
[INFO] Tests run: 34, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

The concurrent test asserts exactly one 201, four 413s, and final count 20. Portal's preserved Node 22 result (`~/work/inventory/portal-mime-tests.log`):

```text
# tests 19
# pass 19
# fail 0
# cancelled 0
# skipped 0
```

Independent pre-merge checks on the changed heads:

```text
claims-service #16
Summary: 2 passed, 0 failed, 0 pending, 0 skipped
✅ verify
✅ Devin Review

claims-portal #40
Summary: 2 passed, 0 failed, 0 pending, 0 skipped
✅ test
✅ Devin Review
```

CI green does not mean the portal security finding was resolved. Native Ready to merge was observed before either click; actual Merged states and independent GitHub closed/merged states establish lifecycle, not task progress or checkmarks. Service: 0108 → 0109. Portal: 0110 → 0112. No broader load test, full committed browser suite or post-merge production test was performed.

## S9: actual model, usage and governance UI

- desktop/0114.png: real Local model picker lists **Adaptive** and **Fusion**, with Fusion checked. No model was changed and Adaptive was not invoked.
- cli/0014.png: actual `/session-stats` after completed turns — five agent messages; input 33639, output 656, cached input 29056; SWE-2 High and 63k total displayed. This is not the earlier no-turns response.
- desktop/0115.png: Home account usage popover, **Daily quota**, **Weekly quota**, **Extra usage balance**, **Manage usage**. No billing action was taken.
- web/0010.png: Settings → Devin Desktop → Models, model routing and provider allowlists. The org screen has Fusion on and Adaptive off; the native picker nevertheless listed both. These are observations only: no policy was changed and Adaptive execution/enforcement was not tested.
- web/0011.png: actual MCP registry control, Configure 0. **Not connected**, not a working server demonstration.
- web/0012.png: actual ACP registry **configuration entry point only**; registry contents were not opened or claimed. Local Codex/OpenCode operation is separate evidence.
- web/0013.png: Agent hooks dialog. Textarea value was empty; the visible JSON is the product's **example placeholder**, not installed organization hooks. Closed with Cancel; did not Save.
- web/0014.png: real **Usage limits**, **Batch limit**, **Message usage limit** in organization Devin settings. No dedicated **Usage Policies** label was found in the checked Usage & limits and Devin pages. **The named Usage Policies shot was not captured; these actual controls are the truthful substitute.** This is not proof the feature is absent everywhere or unavailable on a particular tier.

## Rejected, superseded and deliberately omitted

The raw manifests retain these for provenance; the final curated manifest excludes them:

- Old S2 criteria/task cuts, including 0009 and 0043–0052: sticky/breadcrumb/bottom clipping. Use 0058–0069. Pre-edit approval card is redundant; final post-edit restored approval is selected.
- desktop/0056–0057: mixed list clips Codex; use 0070. desktop/0072: less readable edits; use 0073.
- desktop/0078: actual failed handoff, not a success. Platform chooser/retry and successful pickup remain in final story order.
- desktop/0087: clipped Rules heading; use 0090.
- desktop/0093–0101: partial/error/undersized/zoom-clipped Codemap takes, including genuine Mermaid error 0094; use 0102.
- desktop/0104: wrong editor, not the browser screenshot; use web/0009 plus session 0103.
- desktop/0111: genuine merged celebration with confetti; use steady 0112 instead. desktop/0113: usage on Review background; use Home 0115.
- cli/0006: wrong synthetic window title; cli/0010–0011: incomplete/folded side answer; use 0012. cli/0005 is a local-directory list, not an account-wide cloud list; exact cloud identity is CLI0009/web0008.
- cli/0013: pre-resize chart/footer wrapping; use freshly rendered 0014.
- Dedicated Usage Policies UI and integrated Preview file automation were not obtained. Saved edits are not portrayed as simultaneous live typing. No fake MCP connection, active Review race finding, automatic chat push, clean portal security result or production deployment is claimed.

## Environment and remaining work

Chrome CDP 9333 and Desktop 9335 are authenticated to thequantexplorer (**My account**), with the approved throwaway-VM weaker encryption. Desktop remains under `dbus-run-session`; fullscreen/125% zoom/two roots/ACP setup retained. No further Desktop death was observed. Earlier exit 143 was not a verified OOM, and kernel inspection was denied: `dmesg: read kernel buffer failed: Operation not permitted`.

Remaining editorial work: rewrite narration to these actual outcomes, choose holds/transitions/rings from final metadata, replace provisional assembled scenes, and render/review the film. No final video render or rewritten narration is delivered by this capture handoff.

Final technical commands (run after the last capture/metadata edits; output reported in the handoff):

```sh
node --check tutorials/45-gartner-aad/curate-production.mjs
node tutorials/45-gartner-aad/curate-production.mjs
node tutorials/45-gartner-aad/verify-implementation.mjs
```
