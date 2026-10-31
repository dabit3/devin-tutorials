# Tutorial 90: Devin can catch the bug a human reviewer missed and fix it

Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, model from `_kit/settings.json`), generated as one take and cut into lines by `_kit/tools/vo.py`.

The demo bug in Fernhouse was planted for this video; everything shown as Devin UI is from a live run in the thequantexplorer org (see `shots/SOURCES.json`).

| Beat | Shows | Narration |
|---|---|---|
| d01.png | Diagram: hero | Devin can catch the bug a human reviewer missed and fix it. |
| d02.png | Diagram: story | Approved doesn't always mean correct. The tests pass, a reviewer signs off, and an edge case still slips through. |
| 0000.png | Real UI | Here's a real pull request in Fernhouse, a demo plant shop. It adds gift cards at checkout, and we planted one bug in it for this video. |
| 0001.png | Real UI | A teammate reads it, sees the passing tests, and leaves a quick review. |
| 0015.png | Real UI | They approve it, and on a busy day, that's often where review ends. |
| 0020.png | Real UI | Then we ask Devin Review to review this pull request. |
| 0029.png | Real UI | In under two minutes, it reports one bug. Gift cards produce negative order totals. |
| 0033.png | Real UI | Clicking the finding opens the exact line. The total subtracts the whole card balance, so a hundred-dollar card on a sixty-four dollar order shows minus thirty-six dollars instead of zero. |
| 0036.png | Real UI | The same finding is posted to the Discussion tab, right under the teammate's approval. |
| d03.png | Diagram: autofix | Now the fix. Auto-fix hands the finding to a Devin session. Devin pushes a commit to the same pull request, and Devin Review checks it again. |
| 0037.png | Real UI | So I click Auto-fix with Devin, and a Devin session starts working on it right away. |
| 0053.png | Real UI | Devin takes over the pull request and caps the gift card credit at the order value. It adds two tests for oversized cards, runs the tests and the build, and pushes the fix. |
| 0046.png | Real UI | Devin Review checks the new commit and marks the bug resolved. |
| 0050.png | Real UI | The fix is a normal commit on the pull request, ready for a person to read before it merges. |
| d04.png | Diagram: recap | Your team still decides what ships. Devin Review gives each pull request a second, careful read, and Auto-fix turns its findings into fixes you can review. |
| outro | Outro card | Catch the bug before it ships. |
