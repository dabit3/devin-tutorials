# Voice script: Quickstart on three OSes, an overview

Narrated cut: `57-quickstart-three-os-overview-nader.mp4` (voice `T8iHhGIWPm2GVYpQD1Am`). The whole script is generated as one ElevenLabs take (default voice settings) with `_kit/tools/vo_onetake.py` from the `vo` fields in `spec.js`, then cut into lines at sentence boundaries and checked with Speech-to-Text; "Spoken as" is the `voSay` spelling sent to the voice where it differs.

Diagram-led overview. Every UI shot is a real frame from tutorial 56's take (mapped in `shots/SOURCES.json`); the diagrams are drawn live by `scenes.js` (`idea`, `flow`, `found`, `when`). The findings in `found` are the ones the three tutorial 56 sessions reported for thequantexplorer/orbit-demo's README.

## Lines

| Shot | Line | Spoken as |
|---|---|---|
| 0000 | Your quickstart works on your own machine, because that machine already has everything the README forgets to mention. Devin can follow it on a clean Linux, Mac and Windows machine instead, exactly as a new contributor would. | Your quickstart works on your own machine, because that machine already has everything the read me forgets to mention. Devin can follow it on a clean Linux, Mac and Windows machine instead, exactly as a new contributor would. |
| 0001 | Pick the platform from the menu below the prompt box, and start one session for each. |  |
| 0002 | Each one gets the same prompt: follow the README literally, write down every failure, and send a recording. | Each one gets the same prompt: follow the read me literally, write down every failure, and send a recording. |
| 0003 | Each Devin starts on a fresh machine, runs every step in order, and replies with where it got stuck, and then one session turns all of it into a pull request that fixes the docs. |  |
| 0004 | On Ubuntu, the first command pointed at a folder that doesn't exist, and the README never said Node was needed. | On Ubuntu, the first command pointed at a folder that doesn't exist, and the read me never said Node was needed. |
| 0005 | On Windows, npm failed in Git Bash on that machine, and its Node 20 was too old for the project's test tools. | On Windows, N P M failed in Git Bash on that machine, and its Node twenty was too old for the project's test tools. |
| 0006 | Every run comes with a recording, so you can watch exactly what a newcomer would see. |  |
| 0007 | Across the three machines, it found a missing folder, a missing Node version, install warnings nobody explains, and a shell quirk that only showed up on Windows. |  |
| 0008 | Then the Ubuntu session read the other two and opened one pull request with a quickstart that works on all three. |  |
| 0009 | It followed the new steps again from a fresh clone, and CI passed. |  |
| 0010 | Run it before a release, after a dependency upgrade, or whenever you change your setup steps, so new contributors never get stuck on the first command. |  |

## Sources

- Windows support: https://docs.devin.ai/onboard-devin/environment/windows-support
- macOS support: https://docs.devin.ai/onboard-devin/environment/macos-support
- Computer Use (Linux, Windows and macOS desktops): https://docs.devin.ai/work-with-devin/computer-use
- Testing and recordings: https://docs.devin.ai/work-with-devin/testing-and-recordings
