# Tutorial 22: The review loop closes itself (voice script)

Voice: Nader (`T8iHhGIWPm2GVYpQD1Am`). One continuous ElevenLabs request for the entire script, with no seed and no voice-setting overrides. Clips are cut locally at whole-sentence boundaries. Subtitles never combine separate sentences. In beat 0123 the take is sent "The session red the findings" (voSay), so it is spoken as past-tense "read" while the subtitle still shows "read".

| Beat | Caption | Narration |
|---|---|---|
| overview | Review → Auto-Fix → CI → your final diff | Devin Review checks pull requests for bugs. Auto-Fix lets the owning session fix them without a new prompt. Here's the loop. Devin opens a pull request. Review flags a bug. Devin pushes a fix, and Review runs again. Once CI passes, you read the final diff and decide whether to merge. |
| 0000 | Automatic review on every push | First, enroll the repo for automatic review. Orbit is already enrolled here. Devin Review runs when a pull request opens, and again on every push. |
| 0001 | By default, Devin ignores bot comments | By default, Devin ignores comments from bots, including Devin Review. |
| 0005 | Responding to bots → Selected only | So, set Responding to bots to Selected only. |
| 0008 | Allow devin-ai-integration[bot] | Then allow Devin Review's bot. That one setting closes the loop. |
| 0009 | Ask Devin for a real feature | Now I ask Devin to add due dates to issues. The cards should show due today and overdue chips. I also ask for tests and a pull request. |
| 0109 | Devin opens the pull request | Devin builds it and opens the pull request. These bugs weren't planted. From here, no human touches the code until the final diff. |
| 0117 | Devin Review finds 2 bugs in the new code | Devin Review analyzes it right away, and finds two real bugs in the code Devin just wrote. |
| 0120 | Past midnight, “Due today” never turns “Overdue” | Here's the first, on the diff line. If the board stays open past midnight, a card due today never turns overdue. |
| 0121 | Auto-fix: the owning session is on it | The Auto-fix section shows the session that owns this pull request is already on it. |
| 0123 | No human prompt: Devin reads the findings | Nobody typed anything. The session read the findings by itself and started fixing them. |
| 0145 | Review is clean, CI passed | Every push gets a fresh review. Review even caught new bugs in Devin's own fixes. Devin fixed those too. The latest round came back clean. |
| 0148 | Three fix commits, all from Devin | Devin pushed all three fix commits. |
| 0149 | 5 bugs found, 5 resolved | Review found five bugs. All five are resolved. |
| 0152 | CI green: all checks passed | CI is green. All checks passed. |
| 0155 | The final diff: chips follow the current day | Now I read the final diff. The card gets the current day from a shared hook. That keeps the chip up to date after midnight. |
| 0156 | Merge from Devin Review | It looks right, so I merge it from Devin Review. |
| 0160 | Merged | Merged. The loop closed itself. |
| outro | | Devin closes the review loop, and you only read the final diff. |

## Variant: `22-review-loop-nader-with_outro.mp4`

The same script, re-recorded as its own one-take (no seed, saved voice defaults) into `vo/T8iHhGIWPm2GVYpQD1Am-with_outro/`, with one more sentence on the outro line:

> Devin closes the review loop, and you only read the final diff. If you'd like to learn more about Devin Review, I'll share some links below.

Build: `SEG=1200 VOICE=T8iHhGIWPm2GVYpQD1Am-with_outro VO_NAME=nader-with_outro bash tutorials/_kit/tools/build.sh 22-review-loop`. The original `22-review-loop-nader.mp4` and its `vo/T8iHhGIWPm2GVYpQD1Am/` clips are unchanged.
