# Tutorial 95 voice script

Devin can build and test an iPhone app on a real Mac. One narrated cut, Nader's voice (`T8iHhGIWPm2GVYpQD1Am`, model `eleven_multilingual_v2` from `_kit/settings.json`), voiced as one whole-script take with `_kit/tools/vo_onetake.py` and cut into lines locally; every line passed the kit's sentence and transcript checks.

Real UI comes from a fresh live macOS session in thequantexplorer (see `shots/SOURCES.json`); `scene` beats are animated diagrams from `scenes.js`.

| Beat | Shows | Narration |
|---|---|---|
| 0000.png | Diagram: title | Devin can build and test an iPhone app on a real Mac. |
| 0001.png | Diagram: model | Every Devin session runs on its own machine. On macOS, that machine has Xcode and the iOS Simulator, so Devin can build, run, and test Apple-platform apps. |
| 0002.png | Home composer, platform button | You choose the platform from the menu below the prompt box. |
| 0005.png | Hover macOS | Pick macOS, and the next session runs on a macOS machine. |
| 0008.png | The Comet Catch prompt in the composer | Then describe the app in plain English. Here, it's a SwiftUI game called Comet Catch: tap the falling comets, keep your three lives, and play again. |
| 0009.png | New session started on macOS | Open the Computer tab to watch the Mac's desktop live. |
| 0012.png | Diagram: build | On that Mac, Devin writes the Swift code, builds the app for the iPhone Simulator, and runs its tests. |
| 0013.png | Chat: Simulator build, format check and 10 game-state tests pass; Simulator on the macOS desktop | In this session, the Simulator build and all ten game-state tests passed. |
| 0014.png | Comet Catch start screen in the Simulator (Computer tab) | Then it launches Comet Catch in the Simulator and plays it. |
| 0015.png | Devin playing: comets falling, lives shown | It taps the comets as they fall, and every miss costs a life. |
| 0016.png | Round over: score 1, Play again | When the round ends, the Play again button appears, just as the prompt asked. |
| 0017.png | Diagram: evidence | Devin records the playtest. Each check it makes is marked passed or failed, right next to the video. |
| 0019.png | Hover the recording card | The recording opens right from the session. |
| 0021.png | Recording 0:20: comets falling during the replay | Here, a tapped comet scores a point. |
| 0022.png | Recording 0:25: "Falling comet caught" step passed | The step list confirms the catch, the final score, and the personal best. |
| 0023.png | Recording end: 6 passed, 0 failed | All six checks passed, and none failed. |
| 0024.png | Session header with PR #118 (thequantexplorer/product-demo-apps) | And the code lands in a pull request, ready for your review. |
| 0025.png | Diagram: recap | So one prompt gets you a native iPhone app, built on macOS, played in the Simulator, and backed by a recording and a pull request. |
| outro | End card: Pick macOS. Devin builds and tests it there. | Pick macOS, describe your app, and Devin builds and tests it there. |

Music: Nader's `2-upbeat.mp3`, extended with bar-aligned joins, ducked under the voice, faded out and loudness-normalized to -16 LUFS (`tools/mix95.py`, `tools/make95.sh`). The kit's title chime and swell are removed in `tools/audio95.py`.
