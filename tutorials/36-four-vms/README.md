# Eight sessions across macOS, Ubuntu and Windows VMs, one screen

A **46.4-second silent clip** of the real Devin web app with eight sessions open at once in a 4×2 split view, with the Computer tab on the right. A cursor clicks into each pane in turn and that session's VM becomes the main Computer view: the original four first, in the same order as the four-pane cut, then the four new ones. Filmed live on 9 November 2026; no intro, outro, captions or audio.

- [4K master](four-vms.mp4): 3840×2160, 30fps, H.264/yuv420p, no audio.
- [1080p preview](four-vms-1080p.mp4): 1920×1080, 30fps, no audio.
- [Poster](poster.png)

## The eight sessions

| Pane | VM | What's running on the Computer |
|---|---|---|
| Row 1, col 1 | macOS | Two-player neon air hockey on two iPhone simulators side by side, synced over a local server, both paddles on autopilot |
| Row 1, col 2 | Ubuntu | SkyTrace: a Three.js 3D globe with live flight arcs, airport list, departures feed and a day/night line sweeping at 1h/s |
| Row 2, col 1 | Windows | Mandelbrot Explorer, a WPF app in a normal window on the Windows 11 desktop (menus, toolbar, palette/iteration/speed controls, navigator minimap, bookmark gallery, status bar). An autopilot moves the real cursor every 1.5-2 s: zooming into the canvas, dragging sliders, picking palettes, jumping to bookmarks |
| Row 2, col 2 | macOS | [Dream Stage](https://github.com/dabit3/unity-apps/tree/main/dream-stage), a Unity idol rhythm game, playing a song on auto play on the iPhone Duo in Xcode 27.1 Device Hub (iOS 27.1), folding and unfolding mid-song |
| Row 1, col 3 | Ubuntu | [Jumpy Otter](https://github.com/dabit3/jumpy-otter) (Kotlin/OpenGL ES voxel arcade game) on autopilot in the Android Emulator: a KVM-accelerated Pixel 7 AVD, android-35 x86_64, `-gpu swiftshader_indirect` |
| Row 1, col 4 | Ubuntu | MuJoCo native viewer: a Franka Panda arm (mujoco_menagerie) picking colored cubes and stacking them into a tower, then knocking it down and repeating |
| Row 2, col 3 | Windows | Falling Sand Sandbox, a C# desktop app in a normal window (material toolbar, brush slider, status bar). An autopilot paints sand, water, lava, fire, plants, oil and stone with the cursor; lava ignites oil and plants, water cools lava into stone |
| Row 2, col 4 | macOS | Neon Loom, a SwiftUI drawing app on an iPad Pro 13-inch simulator in landscape, auto-drawing glowing kaleidoscope mandalas with changing brushes, colors and symmetry |

Click order: globe → fractal → Duo → air hockey (as in the four-pane cut), then Android → MuJoCo → falling sand → Neon Loom, about 5 seconds each (about 9 on the Duo so a full fold plays).

## Rebuild

1. Sign in to app.devin.ai in the capture Chrome (`_kit/tools/devin-login-import.mjs`, CDP on port 9333).
2. Start the eight sessions with `start.mjs` (`PLAT=macOS|Ubuntu|Windows TASK="..." node 36-four-vms/start.mjs`), then open them in a 4×2 split view with a Computer tab on the right (drag a session from the sidebar onto the bottom half of a pane to split it vertically, or the right edge of a pane to add a column; if a pane's right panel shows Changes, use Add tab → Computer). The Duo pane needs Xcode 27.1 (`gh release download duo-toolchain-xcode-27.1 -R dabit3/private-app-demos-1`, then `sudo xcodebuild -runFirstLaunch`). Dream Stage installs from its prebuilt simulator release: `gh release download dream-stage-sim -R dabit3/unity-apps -p DreamStage-sim.zip`, unzip, then `xcrun simctl install <duo-udid> DreamStage.app` and launch `com.dabit3.dreamstage`.
3. Set Chrome's zoom for app.devin.ai to 250% and record: `START=0 FIRST=4200 ORDER=1,4,5,2,3,6,7 HOLD=4200 HOLD_5=8500 HOLD_7=5000 node 36-four-vms/capture-live.mjs` from `tutorials/` (panes are numbered row-major from the top left; `START` is the pane focused when recording begins and `FIRST` how long it holds, `ORDER` is the click order after it, `HOLD_<pane>` lengthens one pane's hold so the Duo plays a full fold) (writes `live/` frames plus `frames.json`; `live/` is git-ignored).
4. Encode: `node 36-four-vms/encode.mjs`. It cuts the white "Connecting to Devin's computer" frames after each click so every switch lands on the live VM, then writes the 4K MP4.
5. 1080p: `ffmpeg -i four-vms.mp4 -vf scale=1920:1080:flags=lanczos -c:v libx264 -crf 18 -an four-vms-1080p.mp4`.
