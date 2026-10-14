# Voice script: Ship a mobile feature to iOS and Android at once (overview)

Narrated cut: `39-ios-android-one-pr-overview-nader.mp4` (voice `T8iHhGIWPm2GVYpQD1Am`). The whole script is generated as one ElevenLabs take (default voice settings) with `_kit/tools/vo.py` from the `vo` fields in `spec.js`, then cut into lines. Diagram beats are drawn live by `scenes.js`; every UI shot is a real frame from tutorial 38 (see `shots/SOURCES.json`).

## Sources

- macOS support: https://docs.devin.ai/onboard-devin/environment/macos-support
- Android emulation: https://docs.devin.ai/onboard-devin/environment/android-emulation
- Step-by-step version: [38-ios-android-one-pr](../38-ios-android-one-pr/)

## Lines

| Shot | Line | Spoken as |
|---|---|---|
| 0000 | Two Devin sessions can ship one mobile feature to iPhone and Android, each testing on its own platform, with both results on one pull request. |  |
| 0001 | First, a macOS session builds the feature, tests the iPhone app in the iOS Simulator, and opens the pull request. |  |
| 0002 | Here it plays the game in the Simulator, with the new counters under the high score. |  |
| 0003 | When it's done, it sends back a recording of the test. |  |
| 0004 | Next, an Ubuntu session checks out the same branch, sets up an Android emulator, and tests the Android app. |  |
| 0005 | On the emulator, the counters still read two games and five hops after a force stop. |  |
| 0006 | Both sessions post their recordings and test results on the same pull request, so one review covers both apps. |  |
| 0007 | In the pull request's discussion, the iOS test from the macOS session comes first. |  |
| 0008 | The Android test from the Ubuntu session sits right below it. |  |
| 0009 | Use it for features and bug fixes that touch both apps, with one review for both platforms, and a saved blueprint so the emulator is ready next time. |  |
| outro | One feature, two sessions, and one pull request to review. |  |
