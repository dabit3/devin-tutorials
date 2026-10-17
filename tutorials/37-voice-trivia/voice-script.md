# Tutorial 37: Trivia Night Live, voice script

Narration (Nader, ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, default settings, one take cut locally with `_kit/tools/vo_onetake.py`). It plays only outside the two calls and the three app clips. During those, the real audio plays instead. `genspec.py` is the source of these lines.

## Narration

- Intro (`i1.jpg`, the finished app mid-streak): Today I'll be building and testing a cross-platform mobile game just by using my voice. It runs on iOS, Android, and the web, from one codebase.
- `i2.jpg`: I'll talk to Devin through Devin Voice, which uses ChatGPT voice under the hood. And the game's host talks to players through OpenAI's GPT-Live-1 API.
- `i3.jpg` (before app clip 1): The host handles interruptions, so I can shout out an answer while it's still reading.
- `i4.jpg` (before app clip 2): Tools run in the background, flipping cards, running the clock, and keeping score while it talks.
- `i5.jpg` (before app clip 3): And you can change its style. Here's the pirate host.
- `0003.png`: First, switch the virtual environment from Ubuntu to macOS, so Devin can run the iPhone simulator.
- `0008.png`: Then click the waveform button beside the message box to start a voice call.
- Build (`0285.png`): Devin sets up the Expo app, a small server that keeps the OpenAI key, and the GPT-Live-1 host with its game tools.
- Rejoin (`0367.png`): Mid-build, you can rejoin the call from inside the session and ask how it's going.
- `0570.png`: Once it's built, a first live test passes in Chrome, and Devin starts a second Devin on Ubuntu to test Android.
- `0948.png`: Then it plays the game on the iPhone simulator, live in the Computer tab.
- Web + iPhone card (`1054.png`): Every test run comes with a recording and pass-fail checks. In Chrome, a spoken answer cut in while the host was reading, and it scored.
- `1080.png` (the recording reaches the iPhone part): On the iPhone simulator, the game checks pass. The simulator has no working audio on this Mac, so the voice was tested in Chrome.
- Android card (`1102.png`): For Android, the second Devin ran the app on an emulator. Confetti, auto-advance and the phone layout pass. Voice was blocked by the emulator's audio.
- `1167.png`: Then it adds every result to its pull request.
- Ending (`1169.png`): And that's how you build and test a cross-platform voice game, just by talking to Devin.

## App clips (real GPT-Live-1 audio)

Recorded off camera in Chrome from the finished app (`demo-capture.mjs`, branch `devin/1792198448-trivia-night-live` of thequantexplorer/product-demo-apps). The host's voice is the app's real GPT-Live-1 WebRTC audio. The player's answers ("Mars", "The Pacific", "Three hearts", and "Mars" for the pirate) are Nader's ElevenLabs voice played into the app's microphone. Score, streak, card, countdown and confetti changes come from the host's tool calls.

## The calls (real)

Nader's lines were generated with his ElevenLabs voice (one take, cut locally into `call/c*.wav`) and fed to Devin Voice as the microphone. Devin heard them live and answered by voice. Its replies in the video are its own WebRTC audio, recorded during the call, not re-synthesized. Each call is shown uncut up to its last spoken line. Only the silent stretch after that line, while the call stayed open and Devin worked, is trimmed (`call/trim.json`: call 1 at 159.6 s, call 2 at 34.6 s).

### Call 1 (started from the home page, macOS environment)

- Nader: Hey Devin. Let's build a trivia game show app called Trivia Night Live, with Expo, so one codebase runs on iOS, Android, and the web.
- Nader: The host is a voice character that uses OpenAI's GPT-Live-1 API. It reads each question out loud and listens for my answer, and I can blurt out an answer while it's still talking.
- Nader: Give the host background tools that flip the question card, run a countdown, update the scoreboard, and fire confetti on a streak. Make it look like a bright TV game show, with big type. How would you set that up?
- Nader: Oh, wait, one more thing. Add a host switch, so I can pick a classic game show host or a pirate. *(interrupts Devin mid-answer)*
- Nader: Can you speak a little faster? *(tip from the voice-mode docs)*
- Nader: The OpenAI key is already saved as a secret, so keep it on a small server. Your VM has no microphone, so play a recorded answer into a fake mic when you test.
- Nader: Put it in the product demo apps repo. Test it in your browser and on the iPhone simulator. Your Mac can't run Android, so start a second Devin on Ubuntu to test it on an Android emulator. Send me a test recording with pass and fail checks for each, then open a PR.
- Nader: Perfect. Go ahead and start building.

### Call 2 (rejoined from inside the running session)

- Nader: Hey Devin, how's the game show coming along?
- Nader: Nice. Thanks, Devin! *(interrupts)*

## What's real

- Both calls, the build, and every test recording happened in one real Devin session on a macOS VM ([session](https://app.devin.ai/sessions/15073e1992984f2f9104abb2dd0259df)), with a second Devin session on Ubuntu for the Android emulator ([session](https://app.devin.ai/sessions/3288dff648fe4321829e090665bd0645)). The app's PR: [thequantexplorer/product-demo-apps#84](https://github.com/thequantexplorer/product-demo-apps/pull/84).
- Web: the in-app voice (spoken answer cutting in while the host reads, then scoring) was verified in headless Chrome; the visible-Chrome fake-mic run is the one failed check on the card.
- iPhone simulator: UI, host switch, manual scoring, timeout and confetti checks pass. The simulator can't open audio on this VM, so the in-app voice wasn't verified there.
- Android emulator (Ubuntu): build, host switch, manual scoring, confetti, auto-advance and phone layout pass. Live host audio and voice answers were blocked by the emulator's audio I/O, so they're untested. Real devices weren't tested.
