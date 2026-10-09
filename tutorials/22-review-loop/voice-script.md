# Tutorial 22: The review loop closes itself (voice script)

Voice: Nader (`T8iHhGIWPm2GVYpQD1Am`), ElevenLabs default settings, one take cut locally into whole sentences.

| Beat | Caption | Narration |
|---|---|---|
| 0000 | Automatic review on every push | Code review usually takes a few round trips. With Auto-Fix, Devin closes that loop on its own, and you only read one final diff. Orbit is enrolled for automatic review, so Devin Review runs when a pull request opens, and again on every push. |
| 0001 | By default, Devin ignores bot comments | By default, Devin ignores comments from bots, including Devin Review. |
| 0005 | Responding to bots → Selected only | So set Responding to bots to Selected only. |
| 0008 | Allow devin-ai-integration[bot] | Then allow Devin Review's bot. That one setting closes the loop. |
| 0009 | Ask Devin for a real feature | Now I ask Devin for a real feature: optional due dates on issues, with chips for due today and overdue, plus tests and a pull request. |
| 0109 | Devin opens the pull request | Devin builds it and opens the pull request. From here, no human touches it. |
| 0117 | Devin Review finds 2 bugs in the new code | Devin Review analyzes it right away, and finds two real bugs in the code Devin just wrote. |
| 0120 | Past midnight, “Due today” never turns “Overdue” | Here's the first, on the diff line. If the board stays open past midnight, a card due today never turns overdue. |
| 0121 | Auto-fix: the owning session is on it | The Auto-fix section shows the session that owns this pull request is already on it. |
| 0123 | No human prompt: Devin reads the findings | Nobody typed anything. The session read the findings by itself, and started fixing them. |
| 0145 | Review is clean, CI passed | Every push gets a fresh review. Review even caught new bugs in Devin's own fixes, and Devin fixed those too, until the latest round came back clean. |
| 0148 | Three fix commits, all from Devin | Three fix commits, all pushed by Devin. |
| 0149 | 5 bugs found, 5 resolved | Five bugs found, five resolved. |
| 0152 | CI green: all checks passed | And CI is green. All checks passed. |
| 0155 | The final diff: chips follow the current day | Now the human's only job: read the final diff. The card now reads the current day from a shared hook, so the chip moves to overdue after midnight. |
| 0156 | Merge from Devin Review | It looks right, so I merge it from Devin Review. |
| 0160 | Merged | Merged. The loop closed itself. |
| outro | | Devin closes the review loop, and you only read the final diff. |
