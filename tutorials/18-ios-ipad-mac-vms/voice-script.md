# Voice script: Build and test native iPhone + iPad apps on Mac VMs

Narrated cut: `18-ios-ipad-mac-vms-nader.mp4` (voice `T8iHhGIWPm2GVYpQD1Am`). The whole script is generated as one ElevenLabs take (default voice settings) with `_kit/tools/vo.py` from the `vo` fields in `spec.js`, then cut into lines; "Spoken as" is the `voSay` spelling sent to the voice where it differs.

## Typed prompt

> Build a universal SwiftUI app for iPhone and iPad called Trailhead, a guide to 8 US national parks. On iPad, show a sidebar of parks next to the selected park's details; on iPhone, a list that opens the details. Give each park a colorful header, a few stats and a Favorite button. Test it on an iPhone and an iPad simulator and record both.

Platform: **macOS**, picked from the platform menu below the prompt box.

## Lines

| Shot | Line | Spoken as |
|---|---|---|
| 0000 | This is Devin on macOS. | This, is Devin on macOS. |
| 0001 | To set your environment, open the platform menu below the prompt box and pick macOS. |  |
| 0006 | Every macOS session comes with Xcode, the iOS Simulator and Homebrew already installed. |  |
| 0007 | Ask for a universal SwiftUI app, and to test it on an iPhone and an iPad simulator. | Ask for a universal Swift UI app, and to test it on an iPhone and an iPad simulator. |
| 0067 | In the Computer tab, you can watch Devin's Mac live as it creates the Xcode project, writes the Swift code, and builds and tests it with xcodebuild. | In the Computer tab, you can watch Devin's Mac live as it creates the Xcode project, writes the Swift code, and builds and tests it with x code build. |
| 0086 | On the iPad Simulator, the parks sit in a sidebar next to the details, and Devin opens a pull request on its own. |  |
| 0104 | Then it records a test run on the iPhone, tapping through the app with Computer Use, and even flags a small glitch where a header slides under the back button. |  |
| 0119 | Next comes the iPad, and Devin also suggests a blueprint change so XcodeGen is ready next time. | Next comes the iPad, and Devin also suggests a blueprint change so x code gen is ready next time. |
| 0137 | Here are both simulators side by side, and every test run comes with a recording. |  |
| 0159 | In the iPad run, it favorites Glacier, checks the button and the heart in the sidebar, and all six checks pass, in landscape too. |  |
| 0196 | Then Devin sums up what passed and what it fixed, and when you're ready to ship, it can also upload builds to TestFlight. |  |
| outro | One prompt, and a native app tested on iPhone and iPad. | |

## Sources

- macOS support: https://docs.devin.ai/onboard-devin/environment/macos-support
- iOS app tutorial: https://docs.devin.ai/tutorial-library/ios-app
- Computer Use: https://docs.devin.ai/work-with-devin/computer-use
- TestFlight (mentioned, not shown): https://docs.devin.ai/onboard-devin/environment/testflight
