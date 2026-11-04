# Tutorial 81 — Devin Security 2.0: voice script

Three narrated cuts share the same footage and script. The script is written in simple English. All three use ElevenLabs model `eleven_multilingual_v2`, with one whole-script request per voice through `_kit/tools/vo.py` (no seed or voice settings), cut locally into lines. Run it through the tutorial-local wrapper: `VO_MODEL=eleven_multilingual_v2 python3 81-devin-security-2/tools/vo.py 81-devin-security-2 <voice-id>` from `tutorials/`. The wrapper starts each cut search just after the aligned end of the line, because this model's alignment ends the last word early and the kit's boundary check then rejected every take.

- `81-devin-security-2-harper.mp4`: voice `c1uwEpPUcC16tq1udqxk` (Harper)
- `81-devin-security-2-nader.mp4`: voice `T8iHhGIWPm2GVYpQD1Am` (Nader)
- `81-devin-security-2-harper-no-captions.mp4`: the Harper cut with no subtitles or badges overlaid (`NOSUBS=1`)

Music: `2-upbeat.mp3`, supplied by Nader, passed to the build as `MUSIC_FILE` (it replaces the kit's synthesized bed and is ducked under the narration). The track is not committed.

Nothing is typed on screen. Every scan, finding, session and pull request shown is real, from the `thequantexplorer` organization. `ledger-api` is a small demo invoicing API written for this video with a few security bugs.

## Overview

- `0126.png`: Devin Security 2.0 finds vulnerabilities in your code and fixes them. A vulnerability is a bug that an attacker can use. Devin scans your repositories, checks each finding against the code, and ranks it by risk. Then it opens pull requests that fix the problems.
- `0127.png`: The Overview page shows the pull requests that Devin opened for findings, and how the number of findings changes over time.
- `0128.png`: Below that, you see the findings for each severity level and for each repository.

## Connections

- `0009.png`: Connections bring findings from your other security tools into Devin, so that Devin can sort and fix them. Snyk, Wiz, GitHub, SonarQube, and other tools are in enterprise beta.
- `0012.png`: You can also upload a CSV export from any tool.
- `0013.png`: Devin imports the findings and investigates each one to find out if it is valid. Then it writes the results back.
- `0016.png`: You can also pick Custom. Then you tell Devin where your findings are, for example an API or a report in the repository.

## Repositories

- `0111.png`: The Repositories page shows each repository that Devin scanned. For each one, you see the findings by severity, the pull requests, and the date of the last scan.
- `0124.png`: Click a repository to see its findings.

## Start a scan

- `0019.png`: To start a scan, I pick a repository. ledger-api is a small invoicing API that I made for this demo. It has a few security bugs.
  - spoken as: To start a scan, I pick a repository. Ledger A P I is a small invoicing A P I that I made for this demo. It has a few security bugs.
- `0027.png`: Basic setup needs only a repository. Advanced setup adds the scan type, a profile, and a connection if you want one.
- `0030.png`: I keep Scan with a threat model on. A threat model describes who can attack the app, and how. Devin writes one, runs the scan, and then uses the threat model to rank the findings.

## Threat model and scan run

- `0036.png`: Devin writes the threat model from the code. Then it asks four optional questions. I accept the answers that it suggests.
- `0055.png`: Then the scan runs. Devin splits the work across many machines that run at the same time. It checks each finding against the code.

## Findings

- `0075.png`: When the scan is done, there are five findings. One is critical and two are high.
- `0077.png`: You can filter the findings by status and by severity.

## Finding detail

- `0081.png`: I open the SQL injection. In this attack, user input changes a database query.
- `0082.png`: Each finding tells you who can use the bug, what they get, and how the attack works, step by step.
- `0084.png`: It also recommends a fix and the tests to add.
- `0090.png`: Here, you can mark a finding as Reviewed or Dismissed.
- `0092.png`: References show the affected code.

## Assign to Devin and the remediation session

- `0093.png`: To fix the bug, I click Assign to Devin. This starts a remediation session, which is a Devin session that fixes the finding.
- `0096.png`: Devin first confirms the bug in the handler. Then it passes the customer filter as a query parameter. It also accepts only a fixed list of values for sort.
- `0097.png`: It adds tests that fail on the old code. All ten tests pass.
- `0099.png`: Then it opens a pull request, and the CI check passes.
- `0105.png`: Here is the code change.

## Pull request state

- `0107.png`: Back on the finding, the pull request is linked and waits for review. When the pull request merges, Devin marks the finding as resolved.
- `0109.png`: The findings list shows this too.
- `0110.png`: The Findings page shows the findings from all repositories in three groups: Open, Reviewed, and Dismissed. You can filter the list, and each row has quick actions.

## Outro

- Connect your tools, run a scan, and let Devin fix what it finds.

## Sources

- https://docs.devin.ai/work-with-devin/security-2-0
- https://devin.ai/blog/devin-security-2
- https://cognition.com/blog/devin-security
