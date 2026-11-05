# Voice script: Devin can run an accessibility audit and fix it

Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, model from `_kit/settings.json`), generated as one take with `_kit/tools/vo.py` and cut per line.

| Beat | On screen | Line |
|---|---|---|
| `s00.png` | Title scene (diagram) | Devin can run an accessibility audit and fix it. |
| `s05.png` | How Devin does it: scan → findings → fix → PR → keyboard test (diagram) | In this video, Devin audits a real storefront, fixes the worst issue it finds, and then tests the fix using only the keyboard. |
| `s10.png` | What an accessibility scan looks for, source devin.ai/blog/introducing-code-scans (diagram) | An accessibility Code Scan looks for missing labels, broken keyboard interactions, and other gaps against the WCAG criteria you specify. |
| `0001.png` | Real: /scan in the composer, Accessibility in the scan-type menu | In the composer, type slash scan, and pick Accessibility. |
| `0006.png` | Real: the scan request and @product-demo-apps mention | Then describe what to check, mention the repo, and send it. |
| `0030.png` | Real: Code scan setup card | Devin fills in a setup card, and nothing runs until you click Start scan. |
| `0039.png` | Real: scan session, Findings tab while running | The scan reads the code in its own session. |
| `0066.png` | Real: 6 findings, 1 High | It comes back with six findings, ranked by severity. |
| `0070.png` | Real: the High finding (WCAG 2.4.3 focus order) | The high one says every cart action rebuilds the page, so keyboard focus drops back to the top. |
| `s20.png` | Assign → fix session → pull request (diagram) | Assign the finding to Devin, and it starts a session that fixes it and opens a pull request. |
| `0072.png` | Real: Assign to Devin, fix session linked on the finding | The finding now links to its own fix session. |
| `0093.png` | Real: product-demo-apps#119 linked on the finding | Minutes later, the fix is up as a pull request. |
| `0154.png` | Real: the PR diff in fernhouse/src/main.ts | The fix puts focus back on the control you just used, after every update. |
| `s30.png` | A keyboard-only test: focus ring moving with Tab (diagram) | Then ask Devin to test it the way a keyboard user would, tabbing to each control and checking where focus lands. |
| `0095.png` | Real: asking the fix session for a keyboard-only recorded test | Ask for a keyboard-only test, and a recording of it. |
| `0122.png` | Real: Devin starts the dev server and the browser test | Devin starts the app and tests it in its own browser, with keyboard input only. |
| `0138.png` | Real: recording card "Keyboard-only focus restoration · 5 passed" | The test comes back as a recording, with every check marked as passed. |
| `0141.png` | Real: the recording playing, 5 passed / 0 failed | You can watch the fix work without pulling the branch. |
| `s40.png` | Recap: audit, fix, re-test (diagram) | So Devin audits the app, fixes what it finds, and proves the fix with a keyboard test. |
| outro | Outro card: "Run an accessibility scan on your own app" | Try an accessibility scan on your own app. |
