# Tutorial 81 — Devin Security 2.0: voice script

Two narrated cuts share the same footage, script and subtitles. Both use ElevenLabs model `eleven_v4`, with one whole-script request per voice through `_kit/tools/vo.py` (no seed or voice settings), cut locally into lines.

- `81-devin-security-2-harper.mp4`: voice `c1uwEpPUcC16tq1udqxk` (Harper)
- `81-devin-security-2-nader.mp4`: voice `T8iHhGIWPm2GVYpQD1Am` (Nader)

Nothing is typed on screen. Every scan, finding, session and pull request shown is real, from the `thequantexplorer` organization. `ledger-api` is a small demo invoicing API written for this video with a few realistic security bugs.

## Overview

- `0126.png`: Devin Security 2.0 finds real vulnerabilities in your code, ranks them against a threat model, and opens pull requests that fix them.
- `0127.png`: The Overview shows the pull requests Devin has opened for findings, and how findings trend over time.
- `0128.png`: Below, findings are broken down by severity and by repository.

## Connections

- `0009.png`: Connections bring findings from other security tools into Devin to triage and fix. Snyk, Wiz, GitHub, SonarQube and others are in enterprise beta.
- `0012.png`: You can also upload a CSV export from any tool.
- `0013.png`: Devin pulls in the findings, investigates each one to confirm it's valid, and writes the results back.
- `0016.png`: Or pick Custom, and describe where your findings live, like an API or a report in the repo.

## Repositories

- `0111.png`: The Repositories view lists each scanned repository with its findings by severity, its pull requests, and when it was last scanned.
- `0124.png`: Click a repository to see its findings.

## Start a scan

- `0019.png`: To start a scan, I pick a repository. ledger-api is a small invoicing API I built with a few realistic security bugs.
  - spoken as: To start a scan, I pick a repository. Ledger A P I is a small invoicing A P I I built with a few realistic security bugs.
- `0027.png`: Basic setup only needs a repository. Advanced adds the scan type, a profile, and an optional connection.
- `0030.png`: I leave Scan with a threat model on, so Devin writes one, runs the scan, and reranks findings against it.

## Threat model and scan run

- `0036.png`: Devin drafts the threat model from the code, then asks four optional questions. I accept its draft answers.
- `0055.png`: Then the scan runs. Devin splits the work across parallel machines, and checks each finding against the code.

## Findings

- `0075.png`: When it finishes, there are five findings: one critical and two high.
- `0077.png`: You can filter them by status and by severity.

## Finding detail

- `0081.png`: Let's open the SQL injection.
- `0082.png`: Each finding says who can exploit it, what they get, and how the attack works, line by line.
- `0084.png`: It also recommends a fix, and the tests to add.
- `0090.png`: From here, you can mark a finding Reviewed or Dismissed.
- `0092.png`: References show the affected code.

## Assign to Devin and the remediation session

- `0093.png`: To fix it, I click Assign to Devin, which starts a remediation session.
- `0096.png`: Devin confirms the bug in the handler, binds the customer filter as a query parameter, and limits sort to an allowlist.
- `0097.png`: It adds tests that fail on the old code, and the full suite of ten tests passes.
- `0099.png`: Then it opens a pull request, and the CI check passes.
- `0105.png`: Here's the diff.

## Pull request state

- `0107.png`: Back on the finding, the pull request is linked and waiting for review. Once it merges, Devin marks the finding resolved.
- `0109.png`: The findings list shows it too.
- `0110.png`: Across all repositories, Findings are split into Open, Reviewed and Dismissed, with filters and quick actions on every row.

## Outro

- Connect your tools, run a scan, and let Devin fix what it finds.

## Sources

- https://docs.devin.ai/work-with-devin/security-2-0
- https://devin.ai/blog/devin-security-2
- https://cognition.com/blog/devin-security
