# 37 · One bug, three operating systems (overview): voice script

Narrated in Nader's voice (`T8iHhGIWPm2GVYpQD1Am`), generated as one ElevenLabs take with default voice settings and cut locally (`_kit/tools/vo_onetake.py`). Diagram beats are drawn by `scenes.js`; every UI shot is a real frame from tutorial 36 (see `shots/SOURCES.json`).

- **0000.png** (diagram `idea`): In this video, one Devin reproduces a desktop app bug on Linux, macOS and Windows at the same time, then verifies a single fix on all three.
- **0001.png** (proof: 36/shots/0007.png): To get a snapshot for each operating system, you just ask Devin in plain English. It proposes a multi-platform blueprint, and you approve it.
- **0002.png** (diagram `fan`): The coordinator scopes the work and starts three managed Devins, one per operating system, each in its own isolated VM.
- **0003.png** (proof: 36/shots/0882.png): Here are the three children, one per system, and each one is done.
- **0004.png** (diagram `record`): Each child runs the app, reproduces the bug, and sends back a recording of what it saw.
- **0005.png** (proof: 36/shots/0908.png): The recording plays the run step by step, with the failing check that proves the bug.
- **0006.png** (proof: 36/shots/0997.png): Windows reproduces the same bug in its own recording.
- **0007.png** (diagram `verify`): The coordinator writes one fix in one pull request, then sends the branch back so every child tests it again and records the result.
- **0008.png** (proof: 36/shots/1030.png): The pull request is small. Reset now clears the history, and a new unit test covers it.
- **0009.png** (proof: 36/shots/1027.png): The coordinator's summary closes the loop, with the fix verified on all three systems.
- **0010.png** (diagram `usecases`): Use it for bugs reported on one platform, for desktop app releases, and for any fix your reviewers need to see working everywhere.

**Outro:** That's how one Devin turns a single bug report into a fix that's verified on Linux, macOS and Windows.

## Sources

- Blueprint reference (`runs-on`, multi-platform documents): https://docs.devin.ai/onboard-devin/environment/blueprint-reference
- Windows support (limited availability): https://docs.devin.ai/onboard-devin/environment/windows-support
- Managed Devins: https://docs.devin.ai/work-with-devin/managed-devins
- Testing and recordings: https://docs.devin.ai/work-with-devin/testing-and-recordings
