# Tutorial 21: Devin Voice, voice script

Narration (Nader, ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, default settings, one take cut locally with `_kit/tools/vo_onetake.py`). It plays only outside the two calls. During the calls, the real call audio plays instead. `genspec.py` is the source of these lines; frame numbers for the test cards are filled in from `shots/beats.json`.

## Narration

- Intro (`0000.png`): Let's build a cross-platform mobile game, just by talking to Devin. One codebase that runs on iOS, Android, and the web.
- `0001.png`: And here's the big part: Devin Voice uses ChatGPT voice under the hood, so it feels like a real conversation.
- `0003.png`: First, switch the virtual environment from Ubuntu to macOS, so Devin can run the iPhone simulator.
- `0008.png`: Then click the waveform button beside the message box to start a voice call.
- Build (`0156.png`): Devin sets up the Expo project, builds the voxel city with three.js, and wires up the traffic, piers, creatine and combo meter.
- `0308.png`: Then it plays the web build in Chrome with Computer Use, on its own Mac.
- Rejoin (`0414.png`): Mid-build, you can rejoin the call from inside the session and ask how the game's coming along.
- `0490.png`: Then it switches to the iPhone simulator, and you can watch it play live in the Computer tab.
- `0846.png`: It opens a pull request. Devin Review flags a combo bug, and Devin fixes it and plays the game again.
- Chrome card: Every test run comes with a recording. In Chrome, the otter picks up creatine, rides the piers, and all nine checks pass.
- iPhone card: On the iPhone, the combo meter climbs, a creatine bottle gets picked up, and all eight checks pass.
- Android recording: For Android, a second Devin on Ubuntu ran the game on an Android emulator. Screen fill, the combo and swipes pass. Creatine wasn't verified there, and the software emulator runs at a low frame rate.
- Ending: One conversation, one codebase, tested on iOS, Android, and the web.

## The calls (real)

Nader's lines below were generated with his ElevenLabs voice (one take, cut locally into `call/c*.wav`) and fed to Devin Voice as the microphone. Devin heard them live and answered by voice. Its replies in the video are its own WebRTC audio, recorded during the call, not re-synthesized.

### Call 1 (started from the home page, macOS environment)

- Nader: Hey Devin. Let's build a game. An arcade game called Jumpy Otter, with Expo, so one codebase runs on iOS, Android, and the web.
- Nader: You play an otter hopping through San Francisco. Roads full of traffic, cable car tracks, and the bay, where you hop across floating piers. Blocky voxel art, bright and fun.
- Nader: Use my open-source Jumpy Otter repo on GitHub as the design reference. How would you set that up?
- Nader: Oh, wait, one more thing. Add creatine bottles to collect, and a combo meter when you hop forward fast. *(interrupts Devin mid-answer)*
- Nader: Can you speak a little faster? *(tip from the voice-mode docs)*
- Nader: Put it in the product demo apps repo. Test it in your browser and on the iPhone simulator. Your Mac can't run Android, so start a second Devin on Ubuntu to test it on an Android emulator. Send me a recording of each, then open a PR.
- Nader: Perfect. Go ahead and start building.

### Call 2 (rejoined from inside the running session)

- Nader: Hey Devin, how's the game coming along?
- Devin: I'm on it: I'm working through the iPhone and-
- Nader: Nice. Thanks, Devin! *(interrupts)*
- Devin: … Android recordings, for sure.

## What's real

- Both calls, the build, and every test recording happened in one real Devin session on a macOS VM, with a second Devin session on Ubuntu for the Android emulator.
- The Android emulator on that Ubuntu VM uses software rendering, so the game runs at about 9 to 13 FPS there. Creatine pickup was verified in Chrome and on the iPhone, not on Android. Real devices weren't tested.
