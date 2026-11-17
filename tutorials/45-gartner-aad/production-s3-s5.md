# S3–S5: implementation outcomes and capture limitations

## Real outcomes

- Local Devin: approved the scoped plan with **Yes, implement plan and accept edits** after instructing it to own P2/P3 only. Changed `src/format.js`, identical `public/format.js`, `test/format.test.js`, and `public/index.html`. Helpers escape text, identify open claims, format sizes and map upload errors. UI lists/downloads attachments and uploads with inline errors. No new dependencies, commits or pushes.
- Codex: P1 only, creating `src/proxy.js`, `test/proxy.test.js` and wiring `src/server.js`. Preserves method, streams request/response bytes, forwards multipart content headers and download disposition, and retains fixed customer identity. Completed in the shared portal worktree.
- OpenCode: wrote `docs/customer-uploads.md`. **Outstanding consistency fix:** it still describes a button named Upload, whereas the subsequent Local correction changed it to Upload file.
- Portal is on `devin/1794909959-claim-attachments-portal`, with all implementation/help work uncommitted. Local explicitly reported that another session changed the branch; it did not. No portal implementation PR was opened.
- CLI supplied the full saved plan and handed service S1–S6 to **Ubuntu**. Session: https://app.devin.ai/sessions/33f68659f9d0495fb2a7a4a424c834af . PR: https://github.com/thequantexplorer/claims-service/pull/16 . Adds validation, persistence, upload/list/download API, tests and README/API documentation. Local service checkout remains clean.
- Desktop Cloud used non-overlapping portal release/rollout docs because S5 service docs belonged to the service track. Session: https://app.devin.ai/sessions/197b0b18ce7f4844a07f7e9aea4d91cd . PR: https://github.com/thequantexplorer/claims-portal/pull/39 . Adds `docs/upload-release-notes.md`, marked PENDING until both application tracks ship.
- Both PRs are **open**, mergeable, and had **2 passed, 0 failed, 0 pending, 0 skipped** checks. Neither was merged. Service verify and Devin Review passed; docs test and Devin Review passed.
- Final shared portal `npm test`: **17 tests, 17 pass, 0 fail**, duration 259.155688 ms. This was run after Local's final correction, with Codex/OpenCode finished.
- Service PR reports `./mvnw -B verify`: **33 tests, 0 failures**, using a temporary Maven mirror after Central returned 429; no build-file changes. Its independent verify CI is green. I did not run Maven against the unchanged local service checkout.
- Service author disclosed a **count-then-insert race** at the 20-attachment cap under concurrent uploads. Do not describe this as all acceptance criteria proven; no concurrency/load test or cross-repository browser E2E was performed here.

## Steering evidence

- `desktop/0053.png`, S5-02-edit-verified: actual queued-message editor, new text including vanilla JS/no new dependencies, and Update button. Update was clicked; subsequent DOM showed the changed queued text.
- `desktop/0054.png`, S5-03-update-verified: updated queued constraint. Earlier 0027/0028 takes are not proof of a successful update and should not be used for that claim.
- Cleared the pending queue before Stop so it would not auto-resume immediately. `desktop/0055.png`, S5-05-stop-verified, shows **Devin is awaiting instructions**. Then sent the correction to use **Upload file** with **JPEG, PNG or PDF, up to 10 MB** beside each picker, keep errors inline, and continue P2/P3 only. Local acknowledged it, edited the HTML, and finished. Disk inspection confirms both exact strings at lines 22–23.
- CLI `/btw where does the proxy add the customer headers?` answered from `src/proxy.js`: `X-User-Id: cust-ana`, `X-User-Role: CUSTOMER`, with only content type/length copied from the incoming request. This was an auxiliary portal CLI, not the handed-off service session. The first capture's synthetic terminal title incorrectly says claims-service; don't use it as directory evidence. Later `cli/0010.png` has the correct derived title but the answer is partially folded/scrolled, so it is not an approved complete-answer frame.

## Capture inventory and unfinished requirements

Raw beat metadata is in each surface's `shots/*/beats.json`. Captures use real UI and r.box/hlBox or terminal ring metadata, not baked overlays.

| Takes | Actual surface / target |
|---|---|
| desktop/0024 | Scoped Local approval |
| desktop/0025 | Codex P1 working |
| desktop/0026 | Desktop Cloud release-notes task |
| desktop/0053–0055 | Successful queue editing, updated constraint, genuinely stopped state |
| cli/0000–0004 | CLI start, service request, handoff/platform selection, connection |
| cli/0005 | /list-sessions, but not an account-wide cloud list |
| cli/0007–0009 | Cloud agent and exact service session URL; 0009 is the later identity take |
| desktop/0043–0052 | Attempted plan recaptures; **not approved** |
| desktop/0056–0057 | Attempted mixed session list; **not approved** |

**Plan recapture remains incomplete.** Sticky scroll was disabled, but reinspection of 0044 shows AC1 partly clipped under breadcrumbs and AC12 cut at the bottom. Other cuts need the same full visual review and a properly aligned recapture. The current alignment script incorrectly takes the first DOM .view-line instead of sorting visible lines geometrically; do not trust its aligned label. The previous report's claim that 0044 showed all criteria fully was incorrect.

**Mixed view remains incomplete.** 0057 shows Local, both new cloud PR sessions and OpenCode, but Codex is clipped at the bottom. It does not meet the all-agents-at-once requirement. No satisfactory side-by-side edits frame, final continuation screenshot, or same-session web frame was completed. Exact session identity is authoritative in the CLI URL and both PR descriptions, not a substitute for the missing requested web capture.

## Environment interruption

Desktop and Chrome disappeared during final capture work; the original Desktop shell exited **143 / Terminated**. Cause was not established. A restart exposed a lost session bus:

`Failed to connect to the bus: Failed to connect to socket /run/user/1000/bus: No such file or directory`

Restarted Desktop with `dbus-run-session` rather than the missing bus, restored fullscreen 1024×576 CSS/DPR3.75, but the visible UI now says **Log in to Devin**. CLI remains authenticated to eigenexplorer@gmail.com / My account. Chrome 9333 is down. Further authenticated capture is blocked until Desktop/browser authentication is restored. No new secrets were requested or printed. Persistent logs: `~/work/inventory/production-desktop-restart.log` and `production-desktop-private-bus.log`.

`verify-implementation.mjs` checks raw frame geometry/metadata offline and the click helper's normal/empty/hidden cases. It does not certify visual usability or authentication. The old S1/S2 clean-working-tree validator is intentionally not the post-implementation gate. The old production-beats manifest has not been promoted to a final S3–S5 edit selection.
