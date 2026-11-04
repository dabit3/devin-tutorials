# Voice script: Have Devin follow your quickstart on a clean Linux, Mac and Windows machine

Narrated cut: `56-quickstart-three-os-nader.mp4` (voice `T8iHhGIWPm2GVYpQD1Am`). The whole script is generated as one ElevenLabs take (default voice settings) with `_kit/tools/vo_onetake.py` from the `vo` fields in `spec.js`, then cut into lines at sentence boundaries and checked with Speech-to-Text; "Spoken as" is the `voSay` spelling sent to the voice where it differs.

## Typed prompts

Same prompt in three sessions, each started from the home page with its platform picked on camera from the platform menu below the prompt box (**Ubuntu**, then **macOS**, then **Windows**):

> Pretend you're a brand-new contributor on this clean machine. Clone thequantexplorer/orbit-demo into a fresh folder and follow the README's Run it steps literally, in order, using nothing that isn't in the README. Every time a step fails or is unclear, write down the command, the error, and what got you past it. Once the app runs, open it in the browser and send me a recording. Don't open a PR yet; reply with a list of the places you got stuck.

Follow-up in the Ubuntu session (session links shortened here):

> The macOS session https://app.devin.ai/sessions/… and the Windows session https://app.devin.ai/sessions/… ran the same quickstart. Read where they got stuck, then open one PR that fixes the README so the quickstart works on Linux, macOS and Windows.

## What really happened in the take

- All three sessions failed on the README's first command, `cd kanban-board`: the app lives at the repository root.
- Ubuntu: `npm: command not found`; the README names no Node version, so Devin installed Node 22 from nodejs.org. Recording "Orbit board walkthrough", 4 passed.
- macOS: `npm install` printed 9 high severity vulnerabilities (dev-only `puppeteer`); Node 24.21 worked. Recording "Orbit local app walkthrough", 4 passed.
- Windows: npm failed in Git Bash on that machine (`C:/hostedtoolcache/node/20.19.0/x64/npm: No such file or directory`), PowerShell worked; `EBADENGINE` because vitest needs Node ^22.12 or ^24 and the machine had 20.19. Recording "Orbit runs from fresh clone", 2 passed.
- The Ubuntu session read both other sessions, opened thequantexplorer/orbit-demo#47 ("[orbit] README: fix the Run it quickstart for Linux, macOS and Windows", README.md +18 −3), re-ran the new steps from a fresh clone, and CI (`lint-test-build`) passed. The PR was closed unmerged and its branch deleted after capture.

## Lines

| Shot | Line | Spoken as |
|---|---|---|
| 0000 | Devin can follow your README's quickstart on a clean Linux, Mac and Windows machine, write down every place it gets stuck, and open a pull request that fixes the docs. | Devin can follow your read me's quickstart on a clean Linux, Mac and Windows machine, write down every place it gets stuck, and open a pull request that fixes the docs. |
| 0001 | Run it before a release, after a big dependency upgrade, or when a new contributor says setup didn't work. |  |
| 0003 | Each session runs on its own fresh machine, and the platform menu below the prompt box lets you pick Ubuntu, macOS or Windows. |  |
| 0083 | Start on Ubuntu, and ask Devin to clone the repo into a fresh folder, follow the README's steps literally, write down every failure, open the app in the browser, and send a recording. | Start on Ubuntu, and ask Devin to clone the repo into a fresh folder, follow the read me's steps literally, write down every failure, open the app in the browser, and send a recording. |
| 0085 | Then send the same prompt from two more sessions, one on macOS and one on Windows. |  |
| 0170 | Windows sessions are available on a limited basis, and their desktop comes with Git Bash and PowerShell. |  |
| 0255 | Each Devin clones the repo, runs the steps in order and opens the app in its own browser, then replies with a list of the places it got stuck. |  |
| 0257 | On Ubuntu, the very first step fails because there's no kanban-board folder, and the README never says that Node is needed, or which version. | On Ubuntu, the very first step fails because there's no kanban board folder, and the read me never says that Node is needed, or which version. |
| 0261 | Every run also comes with a recording you can play back, with each check Devin made marked as passed or failed. |  |
| 0279 | On macOS, the same missing folder breaks the first step, and npm install prints nine high severity vulnerabilities that the README never explains. | On macOS, the same missing folder breaks the first step, and N P M install prints nine high severity vulnerabilities that the read me never explains. |
| 0285 | The macOS recording shows the same board running, with all four checks passed. |  |
| 0301 | On Windows, npm also fails in Git Bash on this machine, so Devin switches to PowerShell, and it flags that Node 20 is too old for the project's test tools. | On Windows, N P M also fails in Git Bash on this machine, so Devin switches to PowerShell, and it flags that Node twenty is too old for the project's test tools. |
| 0307 | The Windows recording shows the board loading from a fresh clone, and both checks pass. |  |
| 0323 | Back in the Ubuntu session, paste the links to the other two sessions, and ask for one pull request that fixes the README on all three. | Back in the Ubuntu session, paste the links to the other two sessions, and ask for one pull request that fixes the read me on all three. |
| 0380 | Devin reads where both sessions got stuck, rewrites the quickstart, and follows the new steps from a fresh clone again before it opens the pull request. |  |
| 0435 | It sums up what it changed and what it left out on purpose, and CI passes on the new pull request. |  |
| 0437 | In the PR tab, the new quickstart states the Node version, drops the missing folder, works in any terminal, and explains the install warnings. |  |
| outro | Try it on your own quickstart, and see exactly where a new contributor would get stuck. |  |

## Sources

- Windows support: https://docs.devin.ai/onboard-devin/environment/windows-support
- macOS support: https://docs.devin.ai/onboard-devin/environment/macos-support
- Computer Use (Linux, Windows and macOS desktops): https://docs.devin.ai/work-with-devin/computer-use
- Testing and recordings: https://docs.devin.ai/work-with-devin/testing-and-recordings
