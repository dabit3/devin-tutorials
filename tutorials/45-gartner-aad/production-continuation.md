# Historical production continuation: S2 corrections through S7

**Superseded finishing status:** see [production-final.md](production-final.md) and [the final story-order beat list](production-beat-list.md). The real browser upload subsequently succeeded, the MIME fix was published, the service race was fixed and regression-tested, and only the explicitly approved demo PRs #16 and #40 were merged through Desktop. Docs PR #39 remains open. Statements below about pending upload, no merges, or an unfixed race describe the earlier checkpoint, not the final state.

Authoritative continuation of `production-s3-s5.md`, whose blocked-auth and missing-capture sections describe the earlier handoff, not the current state. This is capture production, not a finished film or a production deployment. Narration and edit still need to match the recorded outcomes.

## Current finishing state

S2–S6 and the valid Codemap are captured and visually inspected. Local's real browser smoke uncovered a preexisting static MIME bug; Local fixed it and Node 22 tests pass 19/19. Final browser screenshot and publication of that fix to existing portal PR #40 are pending. No PR has been merged.

## Restored authentication and environment

- Filming account: eigenexplorer@gmail.com, `thequantexplorer`, displayed as **My account**. Chrome CDP 9333 and Desktop CDP 9335 restored. User explicitly approved weaker encryption for the throwaway VM; Desktop uses basic password storage and remains under `dbus-run-session`.
- Fullscreen 3840×2160, 125% zoom; native 1024×576 CSS/DPR 3.75 captures. Light theme, ACP enabled, both workspace roots retained.
- No new Desktop termination observed. Latest memory check: 7.8 GiB total, 5.1 GiB used, 2.2 GiB available, no swap. Prior exit 143 is not a confirmed OOM. Kernel inspection returned `dmesg: read kernel buffer failed: Operation not permitted`.
- Service runs PR #16's branch with Java 17 and the persistent Google Central Maven mirror after Central's 429. Portal runs Node 22; service and portal `/api/claims` returned 200 with two claims. CLM-1002 is IN_REVIEW; CLM-1001 is APPROVED.

## Captured beats

Paths below are beneath `shots/`. Every selected new final still was opened and visually reviewed, not approved from geometry metadata alone. Highlights remain `r.box`/`hlBox` metadata, not baked artwork.

| Beat IDs | Actual on-screen content | Highlight target / takes |
|---|---|---|
| S2-clean-01…12 | Real saved plan, acceptance criteria and numbered tasks in twelve unclipped cuts | Monaco plan editor, desktop/0058–0069 |
| S3-mixed-complete | Local Devin, Codex, OpenCode and cloud sessions in actual Agents list | Sessions list, desktop/0070 |
| S5-correction-continued | Local acknowledges correction and completes Upload file/hint UI work | Conversation, desktop/0071 |
| S4-real-edits-readable | Real portal HTML and proxy edits side by side | Editors, desktop/0073 |
| S3-cloud-web | Same service cloud session as CLI handoff | Web session, web/0008 |
| S5-btw-complete | Full answer: proxy injects fixed customer headers | Terminal answer, cli/0012 |
| S4-opencode-steering / corrected | Actual steering and help-page correction to Upload file | Composer / real documentation, desktop/0074–0075 |
| S5-portal-handoff-prompt / platform / retry | Desktop Local /handoff and actual Ubuntu choice | Composer / platform picker, desktop/0076–0077,0079 |
| S5-portal-cloud-pickup / PR-result | Cloud picks up existing branch and uncommitted changes, then reports PR #40 | Cloud conversation, desktop/0080–0081 |
| S6-marketplace / plugin-installed | DeepWiki installed from Marketplace for Myself in My account | Marketplace / Installed, desktop/0082–0083 |
| S6-mcps / hooks | Actual MCP and four existing hooks screens | Settings panes, desktop/0084–0085 |
| S6-rules-agents-clean | Both workspace AGENTS.md entries at This computer scope | Rules list, desktop/0090 |
| S6-create-skill-prompt / skill-file / skill-listed | Local creates real upload checklist and it appears in Skills | Prompt / SKILL.md / Skills, desktop/0088–0089,0091 |
| S7-codemap-final | Generated portal → proxy → AttachmentController → ClaimAccess → validation → storage diagram | Native diagram, desktop/0102 |

The original approval, CLI handoff, queue Edit→Update and Stop stills are retained as documented in the earlier report. The curated manifest replaces old clipped S2 criteria/task cuts with 0058–0069. Raw logs deliberately retain failed/superseded takes.

## Real outcomes

- Local implemented portal helpers/UI; Codex implemented streaming proxy and tests; OpenCode wrote customer help and corrected the label. Side-by-side capture shows actual saved edits after completion, not fabricated simultaneous activity.
- Service CLI handed S1–S6 to Ubuntu cloud. Service author reports 33 Maven tests; independent verify CI was green. Local Maven verification was not repeated during this capture continuation.
- Portal Desktop handoff succeeded on retry after one WebSocket failure. Eight transferred implementation/help files were independently byte-identical to cloud PR #40 before the later MIME fix. Release notes remain a separate non-overlapping cloud PR.
- DeepWiki plugin installed; **MCP screen says Not connected**. Installation is not evidence of an active MCP connection. Existing hooks were viewed, not newly configured.
- Skill: `~/.config/devin/skills/claim-upload-checklist/SKILL.md`, real 19-line file. Covers content/magic bytes, 10 MB/20-file caps, empty files, ClaimAccess ownership/404, escaped filenames and regression/API/proxy/UI tests. Its extra final Maven/npm gate is intentionally kept unchanged.

## S7 truth and smoke-test blocker

The first native generated Codemap failed Mermaid parsing at an edge label containing `{claimId}` (desktop/0094). A real retry prompt (0095) requested one compact upload-only trace, quoted node labels and plain-word edges. The retry generated the valid seven-step map **Claim upload: portal to service**. Native list/diagram toggling after closing both sidebars reinitialized the fit for 0102. Long descriptions are truncated by native node boxes; the complete graph and core component names are visible. No replacement diagram was drawn manually.

Local opened Open Preview at http://127.0.0.1:44757 but explicitly said it could not drive it, choose a file or take a screenshot. Used its offered equivalent: a real fresh-profile installed Chrome controlled by a small external Node CDP script, `~/work/inventory/upload-clm-1002.mjs`. The script uses actual DOM file-input selection and trusted pointer events on **Upload file**, never curl/direct upload API or simulated UI. It targets the actual 800×450 PNG `~/work/inventory/demo-claim.png`, CLM-1002, and a 3840×2160 result screenshot. This is **not integrated Preview automation** and must not be narrated as such.

The first real browser run could not find a claim upload control. To disprove a backend/status explanation, Local checked the actual API data and open-status helper: API was healthy and CLM-1002 was IN_REVIEW. Runtime diagnostics then showed both `/` and `/format.js` returning 200 without Content-Type, and Chrome's actual error:

```text
[log:error] Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "". Strict MIME type checking is enforced for module scripts per HTML spec. http://localhost:3000/format.js
```

This verifies the causal chain: actual index module import → requested JS returned without MIME → Chrome rejected module → table/upload controls never rendered. Checked `origin/main`: both module import and header omission preexist this feature. Full browser diagnostic is preserved at `~/work/inventory/portal-browser-mime-diagnostic.log`.

Necessary scope call: authorized Local to fix only static MIME response types and add a regression test so the requested real smoke test can run, without dependencies or unrelated changes. Local added `src/mime.js`, wired it in `src/server.js`, and added `test/mime.test.js`. The two new unit tests cover JS and HTML/PNG/unknown mapping; live Chrome verifies actual delivery separately. No capture-agent source commit/push was made. The same cloud author must publish this fix to existing PR #40, not open a duplicate.

Node 22 test output (preserved verbatim in `~/work/inventory/portal-mime-tests.log`):

```text
v22.23.5
# tests 19
# suites 0
# pass 19
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 510.356135
```

## PRs and limitations

- Service: https://github.com/thequantexplorer/claims-service/pull/16
- Portal feature: https://github.com/thequantexplorer/claims-portal/pull/40
- Separate release notes: https://github.com/thequantexplorer/claims-portal/pull/39

All three independently observed OPEN, mergeable, with `Summary: 2 passed, 0 failed, 0 pending, 0 skipped` before the MIME fix. Service has verify + Devin Review; portal PRs have test + Devin Review. New portal fix publication/CI must be checked separately; do not reuse the older green result as evidence for new source.

No merges. Service count-then-insert attachment-cap race remains disclosed. PR #40 review also identifies demo proxy auth: unauthenticated callers inherit fixed cust-ana identity and can upload to that customer's open claims. This is triaged as a demo-auth limitation, not fixed or production-safe. No concurrency/load test, full committed browser suite, or production deployment was performed.

## Superseded or rejected footage

- desktop/0009 and other old S2 acceptance/task cuts: sticky/breadcrumb/bottom clipping; replace with 0058–0069.
- desktop/0043–0052: alignment script labels did not guarantee no clipping.
- desktop/0056–0057: mixed list clipped Codex. Use 0070.
- desktop/0072: less readable real-edits layout. Use 0073.
- desktop/0078: real first handoff WebSocket failure; keep as failure evidence, not success.
- desktop/0087: Rules section title partly clipped. Use 0090.
- desktop/0093: partial Codemap tree; 0094: real Mermaid error; 0097–0101: partial/undersized/zoom-clipped layouts. Use 0102 for final graph.
- cli/0006 and0010–0011: wrong synthetic title or incomplete/folded answer. Use0012. CLI0005 is a local-directory list, not an account-wide cloud-session list; exact same-cloud identity is in CLI0009 and web0008.

## Reproduction and final validation

`curate-production.mjs` selects only reviewed final live-product takes from raw manifests. It intentionally requires final browser result/session-evidence IDs before promotion. `verify-implementation.mjs` validates raw 4K geometry/metadata and click-helper normal/empty/hidden cases; it does not certify visual quality. Do not rerun the prep-only clean-working-tree gate against the deliberately uncommitted implementation.

Final finishing command (after missing browser captures and last edits):

```sh
node --check tutorials/45-gartner-aad/curate-production.mjs
node --check tutorials/45-gartner-aad/verify-implementation.mjs
node tutorials/45-gartner-aad/curate-production.mjs
node tutorials/45-gartner-aad/verify-implementation.mjs
```
