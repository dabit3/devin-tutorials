# Voice script: Build and test native iPhone + iPad apps on Mac VMs

Narrated cut: `18-ios-ipad-mac-vms-nader.mp4` (voice `T8iHhGIWPm2GVYpQD1Am`). The whole script is generated as one ElevenLabs take (default voice settings) with `_kit/tools/vo_onetake.py` from the `vo` fields in `spec.js`, then cut into whole sentences locally and checked with speech-to-text; "Spoken as" is the `voSay` spelling sent to the voice where it differs.

## Typed prompt

> Build a universal SwiftUI app for iPhone and iPad called Stargazer, a guide to the 8 planets. On iPad, show a sidebar of planets next to the selected planet's details; on iPhone, a list that opens the details. Give each planet a colorful header, a few stats and a Favorite button. Test it on an iPhone and an iPad simulator and record both.

Platform: **macOS**, picked from the platform menu below the prompt box.

Follow-up typed on camera after Devin asked where to push the app:

> Add it to product-demo-apps and open a PR.

## Lines

| Shot | Line | Spoken as |
|---|---|---|
| 0000 | Devin can also run on a macOS virtual machine, so it can build and test native iPhone and iPad apps. |  |
| 0001 | To set your environment, open the platform menu below the prompt box and pick macOS. |  |
| 0006 | Every macOS session comes with Xcode, the iOS Simulator and Homebrew already installed. |  |
| 0007 | Ask for a universal SwiftUI app, and to test it on an iPhone and an iPad simulator. | Ask for a universal Swift UI app, and to test it on an iPhone and an iPad simulator. |
| 0011 | In the Computer tab, you can watch Devin's Mac live as it builds the app with xcodebuild and boots the simulators. | In the Computer tab, you can watch Devin's Mac live as it builds the app with x code build and boots the simulators. |
| 0076 | A few minutes later, the app is built and tested, and Devin shares screenshots and the project. |  |
| 0080 | Devin asks whether to push it to GitHub, so tell it to add the app to the demo repo and open a pull request. |  |
| 0102 | Devin adds the app to the repo, and relaunches both simulators to take fresh screenshots for the README. |  |
| 0130 | Then it opens the pull request on its own. |  |
| 0131 | It also suggests a blueprint change, so XcodeGen is ready next time. | It also suggests a blueprint change, so x code gen is ready next time. |
| 0143 | Every test run comes with a recording. |  |
| 0147 | On the iPhone, Devin taps through the planets, favorites Earth, and checks that it's still saved after a relaunch. |  |
| 0172 | On the iPad, it checks the sidebar and the Favorite button in landscape and portrait, and all eleven checks pass. |  |
| 0205 | And when you're ready to ship, Devin can also upload builds to TestFlight. |  |
| outro | One prompt, and a native app tested on iPhone and iPad. | |

## Sources

- macOS support: https://docs.devin.ai/onboard-devin/environment/macos-support
- iOS app tutorial: https://docs.devin.ai/tutorial-library/ios-app
- Computer Use: https://docs.devin.ai/work-with-devin/computer-use
- TestFlight (mentioned, not shown): https://docs.devin.ai/onboard-devin/environment/testflight
