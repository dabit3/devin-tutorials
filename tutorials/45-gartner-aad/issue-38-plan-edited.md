# Issue #38: Customer photo/document uploads on open claims

Add attachment upload, list and download endpoints to claims-service, reusing the existing ownership checks, and add a small upload UI plus a proxy that forwards request bodies in claims-portal, so customers can attach photos and receipts to open claims and adjusters can view them.

## Source

GitHub issue thequantexplorer/claims-portal#38: *"Customers need to attach photos and receipts to an open claim from the portal. Adjusters need to see the attached photos and documents."* The issue has no comments and no labels.

## Current state (from local code)

- **claims-service** (Spring Boot 4.1.2, Java 17, H2, JPA). It has no attachment or upload code. `ClaimController` exposes only `GET /api/claims` and `GET /api/claims/{id}`. `ClaimAccess.findVisible` returns 404 for other customers' claims. `CurrentUser.canSeeAllClaims()` is true for ADJUSTER and FINANCE. Spring's default multipart limit is 1 MB, so the limit has to be configured.
- **claims-portal** (Node 22, no build step).
  - `src/server.js` proxies `/api/*` with `fetch(api + req.url, { headers })`. It always sends a GET with no body and copies back only `Content-Type`, so **uploads and downloads cannot go through it today**.
  - `public/index.html` renders rows with `innerHTML`. File names are user-controlled, so rendering them that way would be an XSS hole.
  - `public/format.js` is a hand-kept copy of `src/format.js`. Tests import `src/`.
- `SeedData` has two claims for `cust-ana`: CLM-1002 (IN_REVIEW) and CLM-1001 (APPROVED). CLM-2001 (APPROVED) belongs to `cust-ben`.

## Assumptions (need your approval)

| # | Assumption | Why this choice |
|---|---|---|
| A1 | An **open** claim is `SUBMITTED` or `IN_REVIEW`. Uploads to APPROVED, DENIED or PAID claims return **409**. | Strictest reading of "open". Allowing APPROVED later (for example, for receipts) is a one-line change. |
| A2 | Only the **owning CUSTOMER** can upload. ADJUSTER and FINANCE get **403** on upload. | The ticket only asks for customer uploads. |
| A3 | **Viewing** (list and download) uses the existing `ClaimAccess.findVisible` rules: the owning customer, ADJUSTER and FINANCE can view; any other customer gets 404. | Reuses the rule AGENTS.md requires. FINANCE can already read whole claims. |
| A4 | Allowed types are **JPEG, PNG and PDF**, detected from the file's magic bytes. The client's Content-Type and file extension are ignored. Limits: **10 MB per file**, **20 attachments per claim**, at least 1 byte. | Covers photos and receipts with a small attack surface. HEIC and Office files are excluded. |
| A5 | File bytes are stored **in the database** in a new JPA entity (`@Lob byte[]`, H2). There is no external object store. | No new dependencies, and it fits the in-memory H2 setup. Flagged as a scaling risk for production. |
| A6 | Attachments are **append-only**: no delete, rename or replace in this issue. | Keeps the scope minimal. Deletion is a follow-up. |
| A7 | **Minimal portal UI**: each open claim row gets a file input and an Upload button, plus a list of the claim's attachment names with download links. Closed claims show their attachment list without an upload control. | This is the smallest UI a customer can use to confirm their upload. |
| A8 | **Adjuster viewing** is delivered as the service API (list and download, ADJUSTER role). The adjuster UIs (`adjuster-desktop`, `field-adjuster-ios`) are separate repos and out of scope. | Only these two repos are in scope. |
| A9 | **No new dependencies** in either repo. Type detection is a small hand-written magic-byte check. | Keeps the dependency policy trivially satisfied. |

## API contract (claims-service)

All endpoints require `X-User-Id` and `X-User-Role` (enforced by the existing `AuthFilter`). Every endpoint first loads the claim with `ClaimAccess.findVisible`.

| Method and path | Who | Success | Errors |
|---|---|---|---|
| `POST /api/claims/{id}/attachments` (multipart, field `file`) | Owning CUSTOMER | `201` with `AttachmentDto` and a `Location` header | `404` claim not visible · `403` not a customer · `409` claim not open · `400` missing or empty file · `413` over 10 MB or over 20 files · `415` type not JPEG, PNG or PDF |
| `GET /api/claims/{id}/attachments` | Anyone who can see the claim | `200` with `AttachmentDto[]`, oldest first, no file bytes | `404` |
| `GET /api/claims/{id}/attachments/{attachmentId}` | Anyone who can see the claim | `200` with the bytes. Headers: stored `Content-Type`, `Content-Disposition: attachment; filename*=UTF-8''<sanitized>`, `X-Content-Type-Options: nosniff` | `404` if the claim is not visible **or the attachment belongs to a different claim** |

`AttachmentDto` = `{ id, claimId, fileName, contentType, sizeBytes, uploadedBy, uploadedAt }`. `id` is a UUID. `fileName` is sanitized: path components and control characters are stripped and it is cut to 255 characters.

## Acceptance criteria

1. **AC1** A customer can upload a JPEG, PNG or PDF of 10 MB or less to their own SUBMITTED or IN_REVIEW claim. The response is 201 with the metadata, and the file then appears in the list.
2. **AC2** A customer cannot upload to, list, or download another customer's claim. All three return 404, the same as `GET /api/claims/{id}`.
3. **AC3** Uploads to APPROVED, DENIED or PAID claims return 409, and nothing is stored.
4. **AC4** Files that are not JPEG, PNG or PDF by content (for example, a renamed `.exe` called `x.jpg`) return 415. Empty files return 400. Files over 10 MB return 413. A 21st attachment returns 413. Nothing is stored in any of these cases.
5. **AC5** An ADJUSTER can list and download the attachments on any claim. The downloaded bytes match the upload exactly, with the stored Content-Type, `Content-Disposition: attachment` and `nosniff`.
6. **AC6** ADJUSTER and FINANCE upload attempts return 403. Requests without identity headers return 401.
7. **AC7** Downloading an attachment through a different claim's URL returns 404.
8. **AC8** List responses never include file bytes. They contain attachment metadata only.
9. **AC9** In the portal, open claims show an upload control. A successful upload adds the file name to that claim's list without a page reload. Errors (409, 413, 415) show a readable message. Closed claims show no upload control.
10. **AC10** The portal proxy forwards the request method, body and `Content-Type` upstream. On responses it passes through status, `Content-Type` and `Content-Disposition`, so multipart uploads and file downloads work through `http://localhost:3000/api/...`. Existing GETs behave as before.
11. **AC11** File names and other user-supplied text are HTML-escaped in the portal, so a file named `<img src=x onerror=alert(1)>.png` renders as plain text.
12. **AC12** `./mvnw -B verify` passes in claims-service and `npm test` passes in claims-portal. New behaviour has tests, per both AGENTS.md files.

## Task list

Track S is claims-service and track P is claims-portal. **T0 gates everything else.**

0. **T0: Approve this plan**, including assumptions A1 to A9 and the API contract above. The contract is the interface the two tracks share.

**Track S: claims-service** (new package `com.northwind.claims.attachments`)

1. **S1: `AttachmentRules`**, a pure static helper like `DocumentChecklist` and `Money`.
   - `isOpen(ClaimStatus)`.
   - `detectContentType(byte[])` using magic bytes: JPEG `FF D8 FF`, PNG `89 50 4E 47 0D 0A 1A 0A`, PDF `%PDF-`. Anything else returns `Optional.empty()`.
   - `sanitizeFileName(String)`.
   - Constants `MAX_BYTES = 10 * 1024 * 1024` and `MAX_PER_CLAIM = 20`.
   - Unit tests in `src/test/java/com/northwind/claims/attachments/AttachmentRulesTest.java`: each status, each magic signature, a renamed non-image, an empty array, and path traversal, control characters and long names in file names.
2. **S2: Persistence.**
   - `Attachment` `@Entity`: UUID `id`, `claimId`, `fileName`, `contentType`, `sizeBytes`, `uploadedBy`, `uploadedAt` (`Instant`), and `@Lob @Basic(fetch = LAZY) byte[] data`.
   - `AttachmentRepository extends JpaRepository<Attachment, String>` with:
     - a metadata-only projection query `findByClaimIdOrderByUploadedAtAsc`, which returns the DTO or an interface projection so blobs never load for lists,
     - `countByClaimId`,
     - `findByIdAndClaimId`.
3. **S3: `AttachmentController`**, with the three endpoints above. Error handling:
   - Each endpoint calls `ClaimAccess.findVisible` first, then checks the role (403), `isOpen` (409), count (413), size and empty (413/400), and detected type (415), in that order.
   - Uses `ResponseStatusException`, like the existing code.
   - In `application.properties`, set `spring.servlet.multipart.max-file-size=10MB` and `max-request-size=11MB`.
   - Add a small `@ExceptionHandler(MaxUploadSizeExceededException.class)` that maps oversize requests to 413.
   - Sets the download headers from the contract.
   - Depends on S1 and S2.
4. **S4: API integration tests** in `src/test/java/com/northwind/claims/web/ClaimAttachmentApiTest.java` (`@SpringBootTest` + `@AutoConfigureMockMvc` + `@Transactional`, so seeded data stays clean across tests). Use MockMvc `multipart(...)`. Cover AC1 to AC8:
   - CLM-1002 as `cust-ana` for the happy path,
   - CLM-1001 for 409,
   - CLM-2001 as `cust-ana` for 404,
   - ADJUSTER list and download with a byte-for-byte comparison,
   - ADJUSTER upload for 403,
   - an 11 MB payload for 413,
   - a 21st file for 413,
   - a renamed `.exe` for 415,
   - an empty file for 400,
   - a cross-claim attachment ID for 404,
   - no headers for 401.

   Test fixtures use tiny synthetic byte arrays only. Depends on S3.
5. **S5: Docs.** Add an `attachments` row to the package table in `README.md` and document the endpoints. Independent of the other tasks.
6. **S6: Gate.** `./mvnw -B verify` must be green before opening the service PR.

**Track P: claims-portal**

7. **P1: Proxy.** Move the proxy logic from `src/server.js` into `src/proxy.js`. Export `toUpstreamInit(req)`, which returns `{ method, headers: identity + content-type/content-length, body: req (non-GET/HEAD), duplex: 'half' }`, and `responseHeaders(upstream)`, which passes through `content-type` and `content-disposition`. Unit tests in `test/proxy.test.js`:
   - a GET is unchanged,
   - a POST forwards method, body and content-type,
   - the gateway identity headers cannot be overridden by the client,
   - `Content-Disposition` is passed through.
8. **P2: UI helpers.**
   - Add `escapeHtml`, `isOpenStatus` (SUBMITTED or IN_REVIEW, matching A1), `uploadError(status)` (maps 400, 404, 409, 413 and 415 to friendly text), and `formatBytes` to `src/format.js`.
   - Mirror them into `public/format.js`.
   - Tests in `test/format.test.js`, plus a test that fails if `src/format.js` and `public/format.js` differ (they are served separately and there is no build step).
9. **P3: `public/index.html`.**
   - Add a per-claim attachments cell. For open claims it includes `<input type="file" accept="image/jpeg,image/png,application/pdf">` and an Upload button.
   - Upload by POSTing `FormData` to `/api/claims/{id}/attachments`.
   - Check the 10 MB limit on the client before uploading, as a courtesy; the server still enforces it.
   - Fetch each claim's attachment list and render names as download links using `escapeHtml`.
   - Also escape the existing row fields (`id`, `type`).
   - Depends on P2. Integration with the service depends on P1.
10. **P4: Gate.** `npm test` must be green.

**Cross-repo**

11. **X1: End-to-end check.**
    - Run `./mvnw spring-boot:run` and `npm start`.
    - In a browser on :3000, upload a JPEG and a PDF to CLM-1002 and confirm they are listed and download correctly.
    - Confirm CLM-1001 shows no upload control.
    - Through the proxy, confirm a renamed `.exe` gets 415 and an 11 MB file gets 413.
    - Verify the adjuster view with `curl -H 'X-User-Id: adj-1' -H 'X-User-Role: ADJUSTER' localhost:8080/api/claims/CLM-1002/attachments`, then download.
    - Depends on S3 and P1 to P3.
12. **X2: PRs.**
    - Open the claims-service PR first. The portal PR links to it and to #38 and depends on the service being deployed first.
    - Each PR description lists the ACs covered, the test commands with their results, and a **Security** section: PII **yes** (customer photos and receipts), network/API surface **yes** (new upload and download endpoints, proxy now forwards bodies), new dependencies **none**. Because of the "yes" answers, request a Platform Security reviewer.

## Parallelism

- **After T0, run the two tracks in parallel.** The API contract above is the only coupling.
- **Within Track S:** S1 and S2 can run in parallel. S5 can run any time. S3 needs S1 and S2. S4 needs S3. S6 runs last.
- **Within Track P:** P1 and P2 can run in parallel. P3 needs P2 and can be built against the contract, using `fetch` mocks or a running service. P4 runs last.
- **X1** needs both tracks finished. **X2** follows X1, with the service PR opened before the portal PR.

```
T0 ─┬─ S1 ─┐
    ├─ S2 ─┴─ S3 ─ S4 ─ S6 ─┐
    ├─ S5 ──────────────────┤
    ├─ P1 ──────────────────┼─ X1 ─ X2
    └─ P2 ─ P3 ─ P4 ────────┘
```

## Files to modify or create

**claims-service**
- new `src/main/java/com/northwind/claims/attachments/{AttachmentRules,Attachment,AttachmentRepository,AttachmentDto,AttachmentController}.java`
- `src/main/resources/application.properties` (multipart limits)
- new `src/test/java/com/northwind/claims/attachments/AttachmentRulesTest.java`
- new `src/test/java/com/northwind/claims/web/ClaimAttachmentApiTest.java`
- `README.md`

**claims-portal**
- new `src/proxy.js`
- `src/server.js` (use proxy.js)
- `src/format.js` and `public/format.js`
- `public/index.html`
- new `test/proxy.test.js`
- `test/format.test.js`

## Verification

- [ ] `./mvnw -B verify` in claims-service (required by its AGENTS.md before the PR)
- [ ] `npm test` in claims-portal
- [ ] X1 end-to-end browser and curl check covering AC1 to AC11

## Risks and considerations

- **DB blob storage (A5)** does not scale and is lost on restart with in-memory H2. It is acceptable for this repo's setup; production needs an object store behind the same controller.
- **No malware scanning.** Magic-byte checks block disguised executables but do not inspect PDF contents. Downloads are forced to `attachment` with `nosniff` to stop inline rendering, and this is flagged for Security review.
- **The proxy now streams request bodies.** The portal still hardcodes the `cust-ana` identity (this is existing demo behaviour and is not changed), and client-supplied `X-User-*` headers must never be forwarded.
- **Existing `innerHTML` rendering** is escaped as part of P3. This hardens the existing claim table as a side effect.
- **Deploy order:** the portal UI calls endpoints that only exist after the service PR is deployed.
