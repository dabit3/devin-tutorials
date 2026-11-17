# Production handoff: prep + S1 + S2

No implementation was started. Both claims working trees remain clean. No commit or push was made. The production Local session is **Plan GitHub issue #38 across claims-service and claims-portal**, local session `acp/devin-cli/balanced-anemone`, with Plan and Fusion. It remains **Waiting for approval**.

## Prep

- Native Desktop capture: 1024×576 CSS, DPR 3.75, producing 3840×2160 PNGs. Window manager state includes `_NET_WM_STATE_FULLSCREEN`; this is not just maximized. Zoom is 1.25.
- Workspace file: `~/demo/claims-demo.code-workspace`, containing `claims-portal` and `claims-service`. The composer reports **2 folders**.
- Codex and OpenCode are enabled and present alongside Devin Local. An OpenCode composer loaded with **build** and **OpenAI/GPT-4.1 mini** after restart. No additional ACP answer prompts were sent in this handoff.
- Earlier activation errors said `npx` and `opencode` were not found. Both agents' settings were later found disabled. Exposed the installed binaries under `~/.local/bin`, re-enabled both and restarted Desktop with the normal shell PATH and `DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus`. The final selector and settings show both enabled.
- Issue: https://github.com/thequantexplorer/claims-portal/issues/38 . The cloud helper reported the issue already existed, so it updated that issue rather than creating a duplicate. The helper session was archived.
- Exact body: **Customers need to attach photos and receipts to an open claim from the portal. Adjusters need to see the attached photos and documents.**

## Real flow / deviations

1. DeepWiki settings has other indexed repositories too. Four separate steady frames show the requested repositories, without hiding other repos or implying these are the only four.
2. Desktop DeepWiki is its real **Welcome to DeepWiki** panel, not a populated repository architecture view. The real architecture diagram is captured on the claims-service web DeepWiki page.
3. The planner needed approval for read-only shell commands. GitHub CLI issue output was empty, so the verified two-sentence body was supplied through the planner's clarification flow. An extra combined history/network lookup was rejected as unnecessary.
4. Before drafting, Devin asked four questions: open statuses, byte storage, file types/limits, and portal scope. Responses asked it to make conservative draft recommendations explicitly marked as assumptions requiring approval, not final product decisions. `S2-05q` records the file-types question.
5. The real plan is much longer than one frame. Acceptance criteria and the numbered task list were captured across multiple readable cuts.
6. Opening the generated file raised Desktop's untrusted-file dialog; **Open** was selected for this known generated plan. Its custom **Plan Editor** was blank. **Text Editor** rendered the file correctly, and only this plan file was associated with Text Editor in local settings.
7. The real approval labels are **Implement** in the file editor and **Yes, implement plan and accept edits** / **No, plan needs changes** in the session's **Exit plan mode** card. None was clicked. The last capture leaves the production session waiting for approval.
8. `S1-03` and `S2-09` are rejected raw takes because fixed composers obscured part of the target. The validated manifest excludes them. Their replacements are `S1-03-final` and `S2-09-restored`.
9. No CLI filming, implementation, tests of new upload functionality, new PR, review or merge was attempted; those belong to S3 onward.

## Capture inventory

Paths below are relative to `shots/`. The shared DeskRec recorder writes `hlBox` from `r.box` in 1440×810 kit coordinates, for ring rendering. Rings are metadata overlays, not baked into the raw stills. All beats use a steady camera and parked/hidden overlay cursor.

| Beat | Frame | Screen / ring target |
|---|---|---|
| PREP-ACP | desktop/0021.png | Agent menu: Devin Local, Codex, OpenCode / menu |
| S1-01 | web/0000.png | Settings > Connections, GitHub Connected / GitHub + status |
| S1-02-adjuster-desktop | web/0001.png | Indexed repository / adjuster-desktop row |
| S1-02-claims-portal | web/0002.png | Indexed repository / claims-portal row |
| S1-02-claims-service | web/0003.png | Indexed repository / claims-service row |
| S1-02-field-adjuster-ios | web/0004.png | Indexed repository / field-adjuster-ios row |
| S1-03-final | web/0007.png | claims-service DeepWiki / high-level architecture diagram |
| S1-04 | desktop/0000.png | Multi-root workspace / Explorer with both root folders |
| S1-05 | desktop/0001.png | Desktop DeepWiki welcome / DeepWiki pane |
| S2-01 | web/0006.png | GitHub issue #38 and its two-sentence body / issue title |
| S2-02 | desktop/0002.png | Local composer / Devin Local |
| S2-03 | desktop/0003.png | Local composer / Plan |
| S2-04 | desktop/0004.png | Local composer / Fusion |
| S2-05 | desktop/0005.png | Planning prompt before submission / prompt text |
| S2-05q | desktop/0006.png | Clarification question / Which file types and size limit? |
| S2-06a | desktop/0008.png | Plan acceptance criteria, AC1–AC4 / editor |
| S2-06b | desktop/0009.png | Plan acceptance criteria, AC5–AC12 / editor |
| S2-07a | desktop/0010.png | T0, service S1–S2 / editor |
| S2-07b | desktop/0011.png | Service S3–S4 / editor |
| S2-07b2 | desktop/0015.png | Service S4–S6 / editor |
| S2-07c | desktop/0012.png | Portal P1–P2 / editor |
| S2-07c2 | desktop/0016.png | Portal P3–P4 / editor |
| S2-07d | desktop/0013.png | Cross-repo X1–X2 / editor |
| S2-07e | desktop/0014.png | Parallelism and dependency diagram / editor |
| S2-08-before | desktop/0017.png | Original AC8 / AC8 line |
| S2-08 | desktop/0018.png | Edited and saved AC8 / edited line |
| S2-09-before-edit | desktop/0007.png | Exit plan mode / Yes, implement plan and accept edits |
| S2-09-toolbar | desktop/0019.png | Real plan editor / Implement |
| S2-09-restored | desktop/0022.png | Final post-edit, post-restart approval state / Yes, implement plan and accept edits |

## Plan artifacts

- `issue-38-plan-original.md`: verbatim generated plan, including 12 acceptance criteria, numbered tasks T0/S1–S6/P1–P4/X1–X2, the dependency diagram and assumptions A1–A9.
- `issue-38-plan-edited.md`: same plan, only AC8 changed through the editor.
- Exact edit: **List responses never include file bytes.** → **List responses never include file bytes. They contain attachment metadata only.**
- `shots/production-beats.json`: validated live capture manifest, separate from the older audio-placeholder `shots/beats.json`.
- `prep-evidence.json`: final native dimensions, fullscreen state, zoom, enabled-agent settings and workspace roots.

The recommendations remain unapproved: SUBMITTED/IN_REVIEW uploads only; customer-only uploads; existing visibility rules for reads; JPEG/PNG/PDF checked by content; 10 MB per file and 20 per claim; DB storage; no deletion/replacement; minimal portal upload/list/download; adjuster API only; no new dependencies. They are not implementation decisions made on the user's behalf.
