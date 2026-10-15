# Tutorial 41: Nightly TestFlight builds with "What to Test" notes, how it works (voice script)

Narrated cut: `41-nightly-testflight-overview-nader.mp4` (voice `T8iHhGIWPm2GVYpQD1Am`, ElevenLabs default settings). The whole script is generated as one take with `_kit/tools/vo.py` from the `vo` fields in `spec.js` and cut locally at sentence boundaries; every line passed the speech-to-text check.

Every UI shot is a real frame from tutorial 40 (see `shots/SOURCES.json`). The TestFlight upload and the Slack post are stub scripts in `thequantexplorer/product-demo-apps`, and the narration says so; no TestFlight or Slack screen is shown.

## Lines

| Shot | Shows | Line |
|---|---|---|
| 0000 | diagram: pain | Many iOS teams still cut test builds by hand, so testers get them late and have to guess what changed. |
| 0001 | diagram: flow | With Devin, a nightly schedule starts a session on a macOS machine that archives the app and writes What to Test notes from the day's merged pull requests. |
| 0002 | 40-nightly-testflight/shots/0045.png | Here it is: one automation that runs every day at two in the morning. |
| 0003 | 40-nightly-testflight/shots/0041.png | Its virtual environment is macOS, so every run gets a Mac with Xcode. |
| 0004 | diagram: notes | The notes come from the pull requests that actually landed, so each line tells testers what changed and what to try. |
| 0005 | 40-nightly-testflight/shots/0068.png | In the real run, Devin found the four pull requests merged that day and checked each one against the code on main. |
| 0006 | 40-nightly-testflight/shots/0071.png | Then it wrote one note per pull request. |
| 0007 | diagram: stubs | In this demo, the TestFlight upload and the Slack post are stub scripts. To go live, you save your App Store Connect keys as Devin secrets and connect Slack. |
| 0008 | 40-nightly-testflight/shots/0066.png | Devin says so plainly: the archive built, and nothing reached TestFlight or Slack. |
| 0009 | 40-nightly-testflight/shots/0074.png | The build log ends with archive succeeded. |
| 0010 | diagram: why | Testers start each day with a fresh build and know exactly what to try, and nobody on the team has to cut it by hand. |
| outro | outro card | A fresh build every morning, with notes your testers can use. |

## Sources

- TestFlight: https://docs.devin.ai/onboard-devin/environment/testflight
- Automations: https://docs.devin.ai/product-guides/automations
- Scheduled sessions: https://docs.devin.ai/product-guides/scheduled-sessions
- macOS support: https://docs.devin.ai/onboard-devin/environment/macos-support
