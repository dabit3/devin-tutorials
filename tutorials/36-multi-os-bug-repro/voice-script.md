# 36 · One bug, three operating systems: voice script

Narrated in Nader's voice (`T8iHhGIWPm2GVYpQD1Am`), generated as one ElevenLabs take with default voice settings and cut locally (`_kit/tools/vo.py`).

## Intro

- Some bugs only show up on one operating system. With a multi-platform blueprint and managed Devins, one coordinator sends the same bug to Linux, macOS and Windows, each Devin records a repro, and one fix gets verified on all three.

## Multi-platform blueprint

- First, open the repo's blueprint in Settings → Environment, and add a second YAML document for macOS and Windows, after three dashes.

- Save it, and Devin builds one snapshot for each platform.

- When the builds finish, the active snapshots show Ubuntu, macOS and Windows, all from the same blueprint.

## Platform picker

- The platform picker under the prompt box offers the same three. I'm leaving it on Ubuntu for the coordinator, because it starts the other platforms itself.

## Coordinator prompt

- Now the prompt. I describe the bug in the Tally desktop app, and ask for three managed Devins, one each on Linux, macOS and Windows, to reproduce it and send a recording. Then one fix in one PR, verified on all three.

## Managed Devins

- The coordinator reads the code, finds the cause, and starts three managed Devins, one for each operating system, each in its own VM.

- While they reproduce the bug, it writes the fix and opens a pull request with a new unit test.

- Each child reports back what it saw. On Linux, the old history entries are still there after Reset.

## Children and recordings

- The Agents tab lists all three children, and each one is done.

- Open a child to see its work. Each Devin attaches a recording of the repro to its message.

- The recording viewer plays the run and lists each check. The precondition passes, and the Reset check fails, which is the bug.

- Once the fix is up, the coordinator sends the branch back to each child. Linux tests it on the same machine and records again, and this time every check passes.

- macOS shows the same bug on main, and passes on the fix branch.

- Windows does the same, with the bug on main and every check passing on the fix.

## One fix, verified on all three

- Back in the coordinator, the diff shows the fix: one new line in Reset that clears the history.

- Its summary confirms it. The bug reproduced on all three systems, the fix passed on all three, and CI is green.

**Outro:** One bug, three operating systems, one verified fix.

## Prompt typed on screen

In the `thequantexplorer` org, Agent mode, platform picker on Ubuntu, with `@thequantexplorer/product-demo-apps` mentioned:

> Bug in desktop/tally: after you click Reset, the History list still shows the old entries. Start three managed Devins, one each on Linux, macOS and Windows. Each one runs the app, reproduces the bug and sends me a recording. Then fix it in one PR, and have all three verify the fix on their OS with a new recording.

## Blueprint saved on screen

See [`blueprint.yaml`](blueprint.yaml): the existing Linux block (`runs-on: default`), then a second YAML document after `---` with `runs-on: [macos, windows]` that installs Node 24 with `actions/setup-node` and runs `npm install` in `desktop/tally`.

## Sources

- Blueprints: https://docs.devin.ai/onboard-devin/environment/blueprints
- Blueprint reference (`runs-on`, multi-platform documents): https://docs.devin.ai/onboard-devin/environment/blueprint-reference
- macOS support: https://docs.devin.ai/onboard-devin/environment/macos-support
- Windows support (limited availability): https://docs.devin.ai/onboard-devin/environment/windows-support
- Managed Devins: https://docs.devin.ai/work-with-devin/managed-devins
- Testing and recordings: https://docs.devin.ai/work-with-devin/testing-and-recordings
