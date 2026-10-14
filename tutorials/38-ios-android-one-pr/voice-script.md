# Voice script: Ship a mobile feature to iOS and Android at once

Narrated cut: `38-ios-android-one-pr-nader.mp4` (voice `T8iHhGIWPm2GVYpQD1Am`). The whole script is generated as one ElevenLabs take (default voice settings) with `_kit/tools/vo.py` from the `vo` fields in `spec.js`, then cut into lines; "Spoken as" is the `voSay` spelling sent to the voice where it differs.

## Typed prompts

Session 1, platform **macOS** (picked from the platform menu below the prompt box), repo `@thequantexplorer/jumpy-otter`:

> Add lifetime stats to Jumpy Otter on both iOS and Android: under HI-SCORE on the title screen, show how many games have been played and the total hops, saved between launches. Build it for the iPhone simulator, play a run to check both numbers go up, send me a recording and post it on the PR.

Session 2, platform **Ubuntu** (picked from the same menu), same repo:

> PR #5 adds lifetime stats to the Jumpy Otter title screen on iOS and Android. Check out its branch, set up an Android emulator, build the Android app and play a run to check both numbers go up. Send me a recording and post it on the same PR. Push any Android fixes to that PR too.

## Sources

- macOS support: https://docs.devin.ai/onboard-devin/environment/macos-support
- Android emulation: https://docs.devin.ai/onboard-devin/environment/android-emulation
- Demo repo: thequantexplorer/jumpy-otter, PR #5

## Lines

| Shot | Line | Spoken as |
|---|---|---|
| 0000 | Let's ship one mobile feature to iOS and Android at the same time. |  |
| 0001 | A macOS session will test the iPhone app in the iOS Simulator, and an Ubuntu session will test the Android app in an emulator, with both results on one pull request. |  |
| 0003 | Open the platform menu below the prompt box and pick macOS, which comes with Xcode and the iOS Simulator installed. |  |
| 0007 | Mention the Jumpy Otter repo, a small game with an iPhone app and an Android app. |  |
| 0011 | Ask for lifetime stats on both apps, showing games played and total hops under the high score, saved between launches. Then ask Devin to test it in the iPhone simulator and post a recording on the pull request. |  |
| 0013 | Devin starts a macOS session and gets to work. |  |
| 0014 | In the Computer tab, you can watch it change both apps, build the iOS version, and play it in the Simulator. |  |
| 0035 | The new counters sit right under the high score, with games played on the left and total hops on the right. |  |
| 0099 | When it's done, Devin sends a recording of its test, and posts its results on the pull request. |  |
| 0104 | The counters go from zero to one, survive a relaunch, and reach two after a second run. |  |
| 0116 | Now for Android, which runs in an Ubuntu session. |  |
| 0119 | There's no Android option in the platform menu, so pick Ubuntu, and mention the same repo. |  |
| 0127 | Point Devin at the same pull request, and ask it to set up an Android emulator, play a run, and post its recording there too. |  |
| 0129 | The Ubuntu session checks out the branch, installs the Android tools, and starts an emulator. |  |
| 0144 | Then it builds the app and plays it with adb taps on the emulator. | Then it builds the app and plays it with A D B taps on the emulator. |
| 0168 | A fresh install starts at zero games and zero hops, and then Devin plays two runs. |  |
| 0192 | After two runs and a force stop, it still shows two games and five hops. |  |
| 0234 | Devin sends its own recording, and since the Android code worked as written, it pushes no fixes. |  |
| 0253 | It also suggests a blueprint update, so future Ubuntu sessions start with the Android SDK and emulator ready. |  |
| 0260 | Open the pull request's discussion, and both test results are there. |  |
| 0263 | First comes the iOS test from the macOS session, run in the iPhone simulator. |  |
| 0266 | Right below it is the Android test from the Ubuntu session, on the same pull request. |  |
| outro | One feature, tested on iPhone and Android, in one pull request. |  |
