# Voice script: Devin on every platform (overview)

Narrated cut: `28-multiplatform-overview-nader.mp4` (voice `T8iHhGIWPm2GVYpQD1Am`). The whole script is generated as one ElevenLabs take (default voice settings) with `_kit/tools/vo_onetake.py` from the `vo` fields in `spec.js`, then cut locally into sentence-aligned lines. The STT check passed on the first take.

This is a concept overview, not a walkthrough: most beats are animated diagrams (`scenes.js`), with real UI proof shots in between.

## Lines

| Shot | Visual | Line |
|---|---|---|
| 0000 | Diagram: Devin, then Linux, macOS, Windows, Android | Every Devin session runs on its own machine: Linux by default, or macOS or Windows, and it can build and test Android apps too. |
| 0001–0004 | Real UI: the platform menu below the prompt box (Ubuntu, macOS, Windows), then picking Windows | You pick the platform from the menu below the prompt box. |
| 0005 | Diagram: prompt → platform → machine and toolchain → build and test → recording and PR | From one prompt, Devin starts that machine with its toolchain, builds your app, tests it like a user with Computer Use, and sends back a recording and a pull request. |
| 0006 | Real UI: a WPF app Devin built, running on a Windows session | Here it is on Windows, testing a native WPF app it just built. |
| 0007 | Real UI: iPhone and iPad Simulators on a macOS session (from tutorial 18) | On macOS, it tests a SwiftUI app in the iPhone and iPad Simulators. |
| 0008 | Real UI: a Kotlin/Compose app on the Android emulator | And with an Android emulator, it installs and tests an Android app. |
| 0009 | Diagram: one card per platform | Each platform brings its own tools: Xcode and the iOS Simulator on macOS, native desktop apps on Windows, which is available on a limited basis, and a full emulator for Android that you set up in your blueprint. |
| 0010 | Diagram: four use-case cards | Use it for native iPhone and iPad apps, Windows desktop apps, Android apps, or one cross-platform app checked on each platform. |
| 0011 | Real UI: the Windows session's test recording ("6 passed") and its PR | Every run ends the same way, with a recording of the test and a pull request to review. |
| outro | Ending card | Pick the machine your work needs, and Devin builds and tests it there. |

## Sources

- Environment (Linux by default): https://docs.devin.ai/onboard-devin/environment
- macOS support: https://docs.devin.ai/onboard-devin/environment/macos-support
- Windows support (limited availability): https://docs.devin.ai/onboard-devin/environment/windows-support
- Android emulator: https://docs.devin.ai/onboard-devin/environment/android-emulation
- Computer Use: https://docs.devin.ai/work-with-devin/computer-use
