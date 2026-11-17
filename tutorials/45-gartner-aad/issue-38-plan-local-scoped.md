# Issue #38: Customer photo/document uploads on open claims (this session: portal P2 + P3)

This session implements only the claims-portal UI helpers (P2) and the upload/list UI (P3) from the full plan below; other sessions own the proxy, the service and the docs.

## This session's scope (override, before approval)

**In scope (edit only these files in `/home/ubuntu/demo/claims-portal`):**
- `src/format.js`: add the P2 helpers.
- `public/format.js`: an exact mirror of `src/format.js`.
- `test/format.test.js`: helper tests, plus a test that fails if the two `format.js` files drift apart.
- `public/index.html`: the P3 upload and list UI.

**Out of scope (owned elsewhere; do not edit, do not revert):**
- P1 proxy (`src/server.js`, `src/proxy.js`, `test/proxy.test.js`): Codex.
- S1 to S6, the whole `claims-service` repo: Ubuntu cloud session.
- `docs/customer-uploads.md`: OpenCode.

**No commit, push or PR.** Run `git status` in the shared worktree before and after editing, and touch only the four files above. Finish by running `npm test` and reporting files and tests. If `test/proxy.test.js` (Codex's) fails while its work is in progress, report it and leave it alone.

### P2: helpers in `src/format.js`, mirrored to `public/format.js`
- `escapeHtml(value)` escapes `& < > " '`. `null` and `undefined` become `''`, and non-strings are converted with `String()`.
- `isOpenStatus(status)` is true only for `SUBMITTED` and `IN_REVIEW` (A1).
- `MAX_UPLOAD_BYTES = 10 * 1024 * 1024`, and `ACCEPTED_TYPES = ['image/jpeg','image/png','application/pdf']` (A4).
- `uploadError(status)` returns friendly text:
  - 400: the file was empty or missing
  - 403: not allowed
  - 404: claim not found
  - 409: claim no longer open
  - 413: file over 10 MB or too many files
  - 415: only JPEG, PNG or PDF
  - anything else: a generic message
- `formatBytes(n)` returns B, KB or MB with one decimal place, for example `1536` gives `1.5 KB`.
- Tests:
  - `escapeHtml` on `<img src=x onerror=alert(1)>.png` and on quotes (AC11)
  - `isOpenStatus` for all five statuses
  - each `uploadError` code and the fallback
  - `formatBytes` boundaries
  - `src/format.js` and `public/format.js` are byte-identical

### P3: `public/index.html`
- Add an **Attachments** column. Escape every rendered value with `escapeHtml`, including the existing `id` and `type`.
- For each claim, `GET /api/claims/{id}/attachments` and render the metadata only (AC8): each `fileName` is a link to `/api/claims/{id}/attachments/{attachmentId}`, followed by `formatBytes(sizeBytes)`. The UI never expects file bytes in the list.
- If a list request fails, show "Attachments unavailable" for that row and keep the page working.
- Open claims (`isOpenStatus`) get `<input type="file" accept="image/jpeg,image/png,application/pdf">` and an Upload button. Closed claims get no upload control (AC9).
- On upload:
  - check `file.size <= MAX_UPLOAD_BYTES` on the client, as a courtesy
  - POST `FormData` with field `file` to `/api/claims/{id}/attachments`
  - on 201, append the returned item to that row's list without reloading
  - otherwise show `uploadError(status)` in that row's status element (`role="status"`)
- Use event delegation on the table, with `data-claim-id` escaped. Keep the existing styles inline and the file under 200 lines.
- End-to-end behaviour through `:3000` needs P1 (proxy) and S3 (service). That is checked later in X1, not in this session.

### Verification for this session
- [ ] `npm test` in claims-portal
- [ ] Load `public/index.html` statically (no service) to confirm the existing table still renders. The real upload round trip is deferred to X1.

---

## Full cross-repo plan (reference)

### Assumptions (need approval)
- A1: Open = SUBMITTED or IN_REVIEW; uploads to other statuses return 409.
- A2: Only the owning CUSTOMER can upload; other roles get 403.
- A3: View and download follow `ClaimAccess.findVisible`.
- A4: JPEG, PNG and PDF only, detected by magic bytes; 10 MB per file; 20 files per claim.
- A5: Files are stored as a DB BLOB.
- A6: Attachments are append-only.
- A7: Minimal portal UI: upload control plus a list with download links.
- A8: Adjusters get the API only.
- A9: No new dependencies.

### API contract
| Method and path | Who | Success | Errors |
|---|---|---|---|
| `POST /api/claims/{id}/attachments` (multipart `file`) | Owning CUSTOMER | 201 with `AttachmentDto` | 404 · 403 · 409 · 400 · 413 · 415 |
| `GET /api/claims/{id}/attachments` | Anyone who can see the claim | 200 with `AttachmentDto[]` (metadata only) | 404 |
| `GET /api/claims/{id}/attachments/{attachmentId}` | Anyone who can see the claim | 200 with bytes; `Content-Disposition: attachment`; `nosniff` | 404 (including cross-claim IDs) |

`AttachmentDto` = `{ id, claimId, fileName, contentType, sizeBytes, uploadedBy, uploadedAt }`.

### Acceptance criteria
1. **AC1** A customer can upload a JPEG, PNG or PDF of 10 MB or less to their own open claim. The response is 201 and the file then appears in the list.
2. **AC2** Upload, list and download on another customer's claim all return 404.
3. **AC3** Uploads to APPROVED, DENIED or PAID claims return 409, and nothing is stored.
4. **AC4** Wrong type returns 415, an empty file returns 400, and a file over 10 MB or a 21st file returns 413. Nothing is stored in any of these cases.
5. **AC5** An ADJUSTER can list and download any claim's attachments, and the bytes match the upload exactly.
6. **AC6** ADJUSTER and FINANCE uploads return 403. Requests without identity headers return 401.
7. **AC7** An attachment requested through a different claim's URL returns 404.
8. **AC8** List responses never include file bytes. They contain attachment metadata only.
9. **AC9** Open claims show an upload control in the portal. A successful upload appears without a page reload, and errors show readable messages. Closed claims show no upload control.
10. **AC10** The portal proxy forwards the method, body and Content-Type, and passes through Content-Disposition.
11. **AC11** User-supplied text is HTML-escaped in the portal.
12. **AC12** `./mvnw -B verify` and `npm test` pass, with tests for the new behaviour.

### Tasks and owners
0. T0: approve the plan.
1. S1 `AttachmentRules` and tests: Ubuntu cloud session.
2. S2 entity and repository: Ubuntu cloud session.
3. S3 controller and multipart config: Ubuntu cloud session.
4. S4 API integration tests: Ubuntu cloud session.
5. S5 service README: Ubuntu cloud session.
6. S6 `./mvnw -B verify`: Ubuntu cloud session.
7. P1 proxy and tests: Codex.
8. **P2 helpers and tests: this session.**
9. **P3 `index.html` UI: this session.**
10. P4 `npm test`: this session (for its own changes).
11. Docs `docs/customer-uploads.md`: OpenCode.
12. X1 end-to-end check: after S3, P1, P2 and P3.
13. X2 PRs: the service PR first, then the portal PR, each with a Security section (PII yes, surface yes, deps none) and a Platform Security reviewer. Not part of this session.

### Parallelism
- After T0, the S track, P1, P2→P3 and the docs task all run in parallel.
- X1 needs all of them finished; X2 follows X1.
