# Code Scans, how it works (overview) — voice script

Narrated by Nader Dabit (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`), generated as one take at the voice's default settings and cut into lines locally. Each line plays over the scene or shot named on the left. The UI shots are real captures reused from tutorial 14.

| Scene / shot | Narration |
| --- | --- |
| Diagram: a repo is read by Devin and turned into findings | With Code Scans, you point Devin at a repository with one goal, and it reads the whole codebase and turns what it finds into findings you can fix. |
| Diagram: your request → Devin, then the real Code scan setup card | You describe what you want to find, Devin chooses the scan type from your request, and you confirm the repositories on its setup card. |
| Diagram: → Findings, then the real completed Findings tab | The scan runs unattended, reads through the code, and lists what it finds in the scan's Findings tab. |
| Diagram: → Assign to Devin → Pull request, then Fix with Devin and the real PR | Assign a finding to Devin, and it starts a session that fixes it and opens a pull request for you to review. |
| Diagram: Scan new commits loops back, then the real button | Once a scan completes, Scan new commits runs it again on only the commits added since the last run, and adds the new findings to the same scan. |
| Scan type cards | There are scan types for performance, database queries, test coverage, dead code, accessibility, compliance and more, plus a custom scan for anything else you describe. |
| Use case cards | Teams use them to fix inefficient or unsafe database queries, remove dead code that is safe to delete, cover untested flows, and find custom issues, like places that log personal data. |
| Outro | Scan for one goal, then let Devin fix what it finds. |

Source: [Code Scans docs](https://docs.devin.ai/work-with-devin/code-scans).
