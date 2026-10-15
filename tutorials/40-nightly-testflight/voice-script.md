# Voice script: Nightly TestFlight builds with "What to Test" notes

Narrated cut: `40-nightly-testflight-nader.mp4` (voice `T8iHhGIWPm2GVYpQD1Am`). The whole script is generated as one ElevenLabs take (default voice settings) with `_kit/tools/vo.py` from the `vo` fields in `spec.js`, then cut into lines; "Spoken as" is the `voSay` spelling sent to the voice where it differs.

## What is real and what is a stub

- Real: the automation (Every day at 02:00 schedule trigger, macOS virtual environment) created on camera in the thequantexplorer org, the Run now run, the macOS session, its `xcodebuild archive` log, the merged-PR list and the What to Test notes.
- Stub: `release/upload_testflight.sh` and `release/post_slack.sh` in `thequantexplorer/product-demo-apps` print `DEMO STUB: ... nothing was uploaded/posted` and exit 0, because the org has no App Store Connect secrets and no Slack connection. The narration and the session both say so; no TestFlight or Slack screen is shown.

## Automation instructions (pasted on camera)

> Every night, build a TestFlight candidate of the Trailhead iOS app (ios/Trailhead) on this macOS VM. List the pull requests merged into main in the last 24 hours that change ios/Trailhead, and archive the app with xcodebuild. Then write short "What to Test" notes for testers: one line per merged PR, saying what changed and what to try. Upload the archive with release/upload_testflight.sh and post the notes to #qa-builds with release/post_slack.sh. Repo: @thequantexplorer/product-demo-apps

Trigger: **Schedule → Every day at 02:00**. Virtual environment: **macOS**.

## Lines

| Shot | Line | Spoken as |
|---|---|---|
| 0001 | Devin can build your iOS app every night on a Mac, and write the What to Test notes for your testers from the day's merged pull requests. |  |
| 0002 | To set it up, open Automations, then Create automation, and pick Create manually. |  |
| 0014 | Add a Schedule trigger, and set it to run every day at two in the morning. |  |
| 0030 | The instructions say what each run does. It lists the pull requests merged into main in the last day. It archives the app with xcodebuild. Then it writes one tester note per pull request. | The instructions say what each run does. It lists the pull requests merged into main in the last day. It archives the app with x code build. Then it writes one tester note per pull request. |
| 0035 | Then it uploads the archive and posts the notes to Slack. In this demo, both of those are stub scripts in the repo, because this org has no App Store Connect keys or Slack connection. |  |
| 0036 | Under Virtual environment, pick macOS, so every run gets a Mac with Xcode. |  |
| 0045 | The automation is now active, with its schedule and instructions. |  |
| 0048 | To try it without waiting for the night, click Run now. It starts a new session with the same instructions. |  |
| 0053 | The run shows up under Events, with a link to its session. |  |
| 0059 | The session starts from the automation's instructions, on a macOS machine. |  |
| 0066 | In under two minutes the archive is built, and Devin says it plainly: the upload and Slack scripts are stubs, so nothing reached TestFlight or Slack. |  |
| 0068 | It found the four pull requests merged that day that change the app, and checked each one against the code on main. |  |
| 0071 | Here are the What to Test notes, one line per pull request, with what changed and what to try. |  |
| 0074 | The build log ends with archive succeeded. To go live, save your App Store Connect API key as Devin secrets and connect Slack. |  |
| outro | A fresh build every night, with notes your testers can use. | |

## Sources

- TestFlight: https://docs.devin.ai/onboard-devin/environment/testflight
- Automations: https://docs.devin.ai/product-guides/automations
- Scheduled sessions: https://docs.devin.ai/product-guides/scheduled-sessions
- macOS support: https://docs.devin.ai/onboard-devin/environment/macos-support
