# Voice script: Port an iOS screen to Android and prove parity

Narrated cut: `58-ios-to-android-parity-nader.mp4` (voice `T8iHhGIWPm2GVYpQD1Am`, `VO_NAME=nader`). The whole script is generated as one ElevenLabs take (default voice settings) with `_kit/tools/vo_onetake.py` from the `vo` fields in `spec.js`, then cut locally into sentence-aligned lines and checked with Speech-to-Text. "Spoken as" is the `voSay` spelling sent to the voice where it differs.

Two real sessions in the `thequantexplorer` org, both on `thequantexplorer/product-demo-apps` (the existing SwiftUI app `wisp/`), ending in one pull request (product-demo-apps#45).

## Typed prompts

Session 1, platform **macOS** (picked from the platform menu below the prompt box):

> In thequantexplorer/product-demo-apps, run the wisp iOS app in the iPhone Simulator and screenshot its onboarding screen (OnboardingView, shown before an API key is saved). Write a parity spec of that screen (layout, copy, fonts, colors, spacing) to wisp-android/PARITY.md with the screenshot in wisp-android/parity/ios.png, push it to a branch named parity/wisp-onboarding and open a PR.

Session 2, platform **Ubuntu** (switched back on camera; Android has no menu option, so the Ubuntu session sets up the emulator):

> In thequantexplorer/product-demo-apps, check out the parity/wisp-onboarding branch and port the wisp onboarding screen to Android with Kotlin and Jetpack Compose under wisp-android/, matching PARITY.md and parity/ios.png. Set up an Android emulator, run the app, screenshot the same screen to wisp-android/parity/android.png, push to the same branch, and update the PR with the iOS and Android screenshots side by side. Send me the side-by-side image too.

## Lines

| Shot | Line | Spoken as |
|---|---|---|
| 0000 | Here's how to port an iOS screen to Android with Devin, and prove that both versions match. |  |
| 0001 | Start with the original app. Open the platform menu below the prompt box. |  |
| 0003 | Pick macOS, so the session runs on a Mac with Xcode and the iOS Simulator. |  |
| 0005 | Ask Devin to run the app in the iPhone Simulator, screenshot the screen, and write a parity spec of its layout, copy, fonts and colors. |  |
| 0007 | In the Computer tab, you can watch Devin's Mac build the app and launch it. |  |
| 0010 | Here's the onboarding screen, running in the iPhone Simulator. |  |
| 0016 | Devin pushes the spec and the iOS screenshot to a branch, and opens a pull request. |  |
| 0018 | Now for the port. In a new session, switch the platform back to Ubuntu. |  |
| 0022 | There's no Android option in the menu. Instead, ask an Ubuntu session to set up an Android emulator, port the screen with Jetpack Compose, and screenshot the same screen. |  |
| 0025 | Devin builds the Android app with Gradle, boots the emulator and installs the app on it. |  |
| 0033 | Here's the port, running on the Android emulator. |  |
| 0037 | Then it sends you the iOS and Android screens side by side. |  |
| 0040 | Open the pull request to review the port. |  |
| 0044 | The description explains how the port follows the parity spec. |  |
| 0045 | Below it, the iOS and Android screenshots sit side by side, at the same size. |  |
| 0046 | It also lists the known differences, like fonts and icons, so reviewers know what to expect. |  |
| outro | Run the original on macOS, port it on Android, and prove they match in one pull request. |  |

## Sources

- macOS support: https://docs.devin.ai/onboard-devin/environment/macos-support
- Android emulator support: https://docs.devin.ai/onboard-devin/environment/android-emulation
