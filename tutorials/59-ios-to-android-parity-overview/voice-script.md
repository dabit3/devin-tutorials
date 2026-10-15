# Voice script: Port an iOS screen to Android and prove parity (overview)

Narrated cut: `59-ios-to-android-parity-overview-nader.mp4` (voice `T8iHhGIWPm2GVYpQD1Am`, `VO_NAME=nader`). One whole-script ElevenLabs take with default voice settings (`_kit/tools/vo_onetake.py`), cut locally at sentence boundaries, STT check passed.

Diagram scenes are drawn live by `scenes.js`; every UI shot is a real capture from tutorial 58 (mapping in `shots/SOURCES.json`).

| Shot | Visual | Line |
|---|---|---|
| 0000 | diagram `idea` | To port an iOS screen to Android, run the original on a Mac, build the port on an Android emulator, and show both screens in one pull request. |
| 0001 | proof: tutorial 58 `shots/0003.png` | The first session runs on macOS, which you pick from the platform menu. |
| 0002 | proof: tutorial 58 `shots/0010.png` | It runs the original app in the iPhone Simulator and screenshots the screen. |
| 0003 | diagram `flow` | From that screenshot it writes a parity spec, and a second session on Ubuntu builds the port to match it, then screenshots the same screen. |
| 0004 | proof: tutorial 58 `shots/0033.png` | Here's the port, running on the Android emulator. |
| 0005 | proof: tutorial 58 `shots/0045.png` | The pull request shows the iOS and Android screens side by side, at the same size. |
| 0006 | diagram `why` | That's the point of the pattern: the spec gives the port a clear target, and the screenshots let a reviewer check the result instead of trusting it. |
| 0007 | proof: tutorial 58 `shots/0046.png` | Anything that can't match exactly, like system fonts and icons, is listed as a known difference. |
| 0008 | diagram `usecases` | Use it to port an app one screen at a time, check a redesign on both platforms, or catch drift between two apps. |
| 0009 | diagram `setup` | To set it up, pick macOS for the first session, then ask an Ubuntu session to set up an Android emulator. |
| 0010 | proof: tutorial 58 `shots/0022.png` | Here, one prompt asked for the emulator, the port and the side by side screenshots. |
| outro | end card | Run the original, build the port, and let the screenshots prove they match. |

## Sources

- macOS support: https://docs.devin.ai/onboard-devin/environment/macos-support (macOS sessions with Xcode and the iOS Simulator, picked from the platform menu)
- Android emulator support: https://docs.devin.ai/onboard-devin/environment/android-emulation (ask Devin to set up an Android emulator; Devin proposes a blueprint with the Android SDK, build tools and emulator configuration, which you review and approve)
- The parity run itself: tutorial 58, thequantexplorer/product-demo-apps#45
