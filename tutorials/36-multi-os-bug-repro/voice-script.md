# 36 · One bug, three operating systems: voice script

Narrated in Nader's voice (`T8iHhGIWPm2GVYpQD1Am`), generated as one ElevenLabs take with default voice settings and cut locally (`_kit/tools/vo.py`).

## Intro

- In this video, one Devin sends the same desktop app bug to Linux, macOS and Windows. A managed Devin on each system records the bug, and one fix gets verified on all three.

## Environment setup in plain English

- First, the environment. I don't write any configuration. I just ask Devin, in plain English, to set up the repo and build a snapshot for Linux, macOS and Windows.

- Devin reads the repo, works out what the Tally app needs, and tries the setup on a Linux test machine.

- Before it tests macOS and Windows, it asks me to approve each test machine.

- Then it proposes the blueprint itself, with a Linux, macOS and Windows section. I review it and click Approve.

- The Windows build used Node 20, which is too old for this version of Electron. Devin offers to test a Node 22 fix, and I pick that option.

- The Windows test machine never comes up.

- So I reply in plain English, and ask it to check the fix with a managed Devin on Windows instead.

- It starts a managed Devin on Windows, which installs Node 22, runs the tests and clicks through the app.

- Then it proposes the Windows update, and I approve it. Approving it rebuilds the snapshots.

- After the rebuild, the active snapshots show Ubuntu, macOS and Windows, and I never typed a line of configuration.

## Platform picker

- The platform picker under the prompt box offers the same three. I'm leaving it on Ubuntu for the coordinator, because it starts the other platforms itself.

## Coordinator prompt

- Now the prompt. I describe the bug in the Tally desktop app, and ask for three managed Devins, one each on Linux, macOS and Windows, to reproduce it and send a recording. Then one fix in one PR, verified on all three.

## Managed Devins

- The coordinator finds the cause in Reset, and starts three managed Devins on main, one for each operating system.

- While they reproduce the bug, it writes the fix and opens a pull request with a new unit test.

## Children and recordings

- The Agents tab lists all three children, and each one is done.

- Open a child to see its work. On Linux, the count goes back to zero after Reset, but the old history entries are still there.

- Each Devin attaches a recording of the repro to its message.

- The recording viewer plays the run and lists each check. The precondition passes, and the Reset check fails, which is the bug.

- Once the fix is up, the coordinator sends the branch back to each child. Linux records again on the fix branch, and this time every check passes.

- macOS shows the same bug on main, and every check passes on the fix branch.

- Windows tells the same story, with the bug on main and every check passing on the fix.

## One fix, verified on all three

- Back in the coordinator, the diff shows the fix. Reset now clears the history, instead of adding an entry to it.

- Its summary confirms it. Linux, macOS and Windows each reproduced the bug on main, then confirmed the fix on the PR branch with a new recording.

**Outro:** That's how you set up three operating systems in plain English, and have Devin fix one bug on all of them.

## Prompts typed on screen

Environment setup, in the `thequantexplorer` org, Agent mode, with `@thequantexplorer/product-demo-apps` mentioned:

> Set up your environment for this repo. The Tally app in desktop/tally has to run and be tested on Linux, macOS and Windows sessions, so build a snapshot for each of those platforms.

Plain-English reply when the Windows test machine didn't start:

> Skip the test machine. Check the Node 22 step with a managed Devin on Windows, like last time, then send me the blueprint update.

Coordinator, platform picker on Ubuntu, with `@thequantexplorer/product-demo-apps` mentioned:

> Bug in desktop/tally: after you click Reset, the History list still shows the old entries. Start three managed Devins, one each on Linux, macOS and Windows. Each one runs the app, reproduces the bug and sends me a recording. Then fix it in one PR, and have all three verify the fix on their OS with a new recording.

## No configuration typed

Nothing in this video is configured by typing YAML or settings. Devin wrote the multi-platform blueprint from the plain-English request, proposed it as suggestion cards (the Linux, macOS and Windows sections, then a Windows Node 22 update), and the only actions on camera are Approve clicks, one option pick and plain-English replies.

## Sources

- Set it up by asking Devin: https://docs.devin.ai/onboard-devin/environment#set-it-up-by-asking-devin
- Blueprints: https://docs.devin.ai/onboard-devin/environment/blueprints
- Multi-platform blueprint: https://docs.devin.ai/onboard-devin/environment/macos-support#multi-platform-blueprint
- Windows support (limited availability): https://docs.devin.ai/onboard-devin/environment/windows-support
- Managed Devins: https://docs.devin.ai/work-with-devin/managed-devins
- Testing and recordings: https://docs.devin.ai/work-with-devin/testing-and-recordings
