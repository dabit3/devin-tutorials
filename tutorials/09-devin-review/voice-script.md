# Devin Review — voice script

Narrated by Nader Dabit (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`). Each line plays over the shot named on the left. The opening is spoken as "This, is Devin Review." (`voSay`) for a deliberate pause.

| Shot | Narration |
| --- | --- |
| Home | This is Devin Review. It lays out a pull request so it's easy to follow, catches bugs before they merge, and fixes them right from the review. |
| Review in the sidebar | Open Review from the sidebar. |
| Review inbox | It lists your open pull requests, including the ones Devin opened. |
| Opening the PR | Open a pull request. |
| PR view | You get the description, the files, and the diff, all in one view. |
| Run Devin's AI analysis | Now click Run Devin's AI analysis. |
| Analysis running | Devin reads the diff, with context from the rest of the codebase, and hunts for bugs. |
| Analysis results | It sums up the change, and sorts what it finds into bugs, flags and security issues. |
| Two bugs found | Here, it found two bugs in this pull request. |
| Clicking a finding | Click a finding to jump to the code. |
| Ask Devin | Then ask Devin about it. |
| Typing a follow-up | Ask a follow-up question about the diff. |
| Devin's answer | Devin explains the bug, cites the code in this pull request, and offers to fix it. |
| Asking for the fix | Ask Devin to make the fix. |
| Proposed edit | Devin proposes the edit in the chat. Nothing is committed yet. |
| Review button | Click Review to check it. |
| Commit Changes dialog | Look over the diff and the commit message, |
| Commit | then commit it to the pull request branch. |
| Fix committed | The fix is now a commit on the branch. |
| Refresh | Refresh to load the new commit. |
| Updated diff | The diff now uses the live board counts. |
| Merge button | Merge when you're ready, right from here. |
| Settings | To have Devin review pull requests on its own, open Settings, |
| Review card | and go to Review. |
| Settings → Review | These settings apply to the whole organization, like which findings get posted as comments on GitHub. |
| Automatic review | Under Automatic review, Devin reviews new pull requests by itself, and again whenever new commits are pushed. |
| Add | Click Add, |
| Add repo / Add user / Add advanced rule | and choose the repos or the authors to review automatically. |
| Outro | Catch bugs before they merge. |

## Prompts typed on screen

1. Why does the empty array freeze the label?
2. Yes, make that fix

## Sources

- https://docs.devin.ai/work-with-devin/devin-review
