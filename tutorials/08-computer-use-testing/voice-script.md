# Testing Apps with Devin — voice script

Narrated by Nader Dabit (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`). Each line plays over the shot named on the left.

| Shot | Narration |
| --- | --- |
| Home screen | This is testing with Devin. After Devin makes a change, it tests your app end to end on its own computer, and sends you a recording of every check. |
| Configuration menu | This app is an iPhone game, so open the configuration menu. |
| Virtual environment → macOS | Pick a macOS machine. It comes with Xcode and the iOS Simulator. |
| Tagging the repo | Mention the repo, |
| Prompt in the composer | and describe a small feature: a hops count on the game-over card. |
| Session working (sped up) | Devin finds the code, makes the change, and builds the app for the Simulator. |
| PR panel | Then it opens a pull request on its own. |
| Test offer | With the PR up, Devin offers to test the change for you. |
| Test game-over card button | Click the test button to approve it. |
| Testing approved | Or turn on Pre-approve testing in Settings → Preferences, and Devin tests without asking. |
| Test mode log | In testing mode, Devin reads the diff, checks the Simulator, and plans one focused test of the flow that matters. |
| Computer tab | Watch it live in the Computer tab. |
| iPhone Simulator run | Devin starts a recording, and plays a real run in the iPhone Simulator. |
| Retry | Then it taps retry, to check that the count resets. |
| Game-over card with HOPS | Game over. The new hops line sits right under the best score. |
| Recording in the chat | When it's done, the recording lands in the chat, with a pass and fail summary. |
| Playing the recording | Play it back to see exactly what Devin did. |
| Annotated checks | Annotations mark each check as it happens. |
| 4 passed, 0 failed | Four passed, zero failed. Now you can merge with confidence. |
| PR ready | Devin can also save how it tested your app as a skill, so the next test starts faster. |
| Outro | Ship changes you've seen work. |

## Prompt typed on screen

1. @thequantexplorer/jumpy-otter On the iOS game-over card, add a line under BEST that shows how many hops the otter made this run, like "HOPS 23".

## Sources

- https://docs.devin.ai/work-with-devin/testing-and-recordings
- https://docs.devin.ai/work-with-devin/computer-use
- https://docs.devin.ai/onboard-devin/environment/macos-support
