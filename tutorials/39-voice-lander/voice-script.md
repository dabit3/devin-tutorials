# Tutorial 39: Mission Control, voice script

Narration (Nader, ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, default settings, one take cut locally with `_kit/tools/vo.py`). It plays only in the narrated cut and never over the call or game audio: during the calls the real call audio plays, and during the two game runs the game's real GPT-Live-1 audio plays. `genspec.py` is the source of these lines.

## Narration

- Intro, finished game (Calm NASA run) (`demo/calm3_s0.jpg`): Today I'll be building and testing a cross-platform mobile game just by using my voice. It's called Mission Control, and it runs on iOS, Android, and the web from one codebase.
- Intro, the stack (`demo/calm3_s1.jpg`): I'll build it by talking to Devin with Devin Voice, which uses ChatGPT voice under the hood. Inside the game, Mission Control talks to the pilot through OpenAI's GPT-Live-1 API, and runs tools in the background while it talks.
- Panicked Rookie run (`demo/rookie2_s0.jpg`): You can also switch its conversational style. Here's the panicked rookie.
- Devin home (`0000.png`): Let's build it.
- `0003.png` (`0003.png`): First, switch the virtual environment from Ubuntu to macOS, so Devin can run the iPhone simulator.
- `0008.png` (`0008.png`): Then click the waveform button beside the message box to start a voice call.
- Build (`0250.png`): Devin builds the game with Expo, plus a small server that starts the GPT-Live session, and starts a second Devin on Ubuntu for Android.
- Rejoin (`0311.png`): Mid-build, you can rejoin the call from inside the session, and ask how the lander's coming along.
- Chrome testing (`0358.png`): Then it tests the web build in Chrome with Computer Use, on its own Mac.
- iPhone simulator (`0430.png`): Then it switches to the iPhone simulator, and you can watch it fly live in the Computer tab.
- PR + Chrome card (`0732.png`): It opens a pull request, and every test run comes with a recording. In Chrome, Mission Control greets the pilot, its tools lower the gear and burn the engine, and seven checks pass. A real microphone couldn't be tested on the VM.
- iPhone card (`0773.png`): On the iPhone simulator, a spoken 'deploy the landing gear', played through a virtual mic, puts the gear down. Six checks pass. The first launch dropped back to the home screen once, and a retry recovered.
- Android card (Ubuntu Devin) (`0922.png`): For Android, the second Devin ran the game on an emulator. The styles, typed radio calls, touch controls, landing and crash all pass. Speech through the emulator's virtual mic didn't get through, so the game's voice was heard in Chrome.
- Ending (`1026.png`): And that's how you build and test a voice-controlled game on iOS, Android, and the web, just by talking to Devin.

## The game's voice (real GPT-Live-1 audio)

Both demo runs were played in Chrome against the real `gpt-live-1` model over WebRTC (`POST /v1/live/sessions` from the game's small server, key kept server-side). Mission Control's lines are its own audio, recorded from the remote WebRTC track. The pilot's lines are Nader's ElevenLabs voice, fed in as the microphone.

### Calm NASA controller (lands, score 924)

- Pilot: Mission Control, deploy the landing gear.
- Pilot: How much fuel do we have?
- Pilot: Burn the main engine.
- Pilot: Kill the engine!
- Mission Control (excerpts): Copy. ... 90%. ... 30 meters, descending at about five. Pad dead center. ... Rate's easing. Eight meters, descending at two. Hold it there. ... Touchdown. You're down. Soft landing on the pad. Score: 924.
- Background tools during the run: `set_landing_gear` (gear DEPLOYING -> DEPLOYED), `show_telemetry` (telemetry panel), `fire_main_engine` (burn / kill the engine), `trigger_outcome` (landing).

### Panicked Rookie (abort, crash)

- Pilot: Abort, abort! Full throttle!
- Mission Control (excerpts): Uh, gear down and locked. Uh, we're over the pad- *(pilot: abort, abort)* Okay. Oh, no, no, no. We hit too hard. That was 6.4 meters per second. Oh, that's a crash. I- I'm so sorry.

## The calls (real)

Nader's lines were generated with his ElevenLabs voice (one take, cut locally into `call/c*.wav`) and fed to Devin Voice as the microphone. Devin heard them live and answered by voice. Its replies are its own WebRTC audio, recorded during the call, not re-synthesized.

### Call 1 (started from the home page, macOS environment)

- Nader: Hey Devin. Let's build a game called Mission Control, with Expo, so one codebase runs on iOS, Android, and the web.
- Devin: Okay. ... Mm-hmm.
- Nader: It's a lunar lander you fly by voice. Mission Control talks you down in real time, using OpenAI's new GPT-Live-1 API. Starfield, particles, a satisfying landing, and touch controls too.
- Nader: Mission Control should use background tools to fire the thrusters, deploy the landing gear, show telemetry, and trigger the landing or crash. How would you set that up?
- Devin: Great. Pulling it together.
- Devin: I'd do it like this. The Expo app owns the actual simulation-
- Nader: Oh, wait, one more thing. Add a style switch, so Mission Control is either a calm NASA controller or a panicked rookie. *(interrupts Devin mid-answer)*
- Devin: Yep, no problem. I'll add that.
- Nader: Can you speak a little faster? *(tip from the voice-mode docs)*
- Devin: Sure, yeah. I'd add a pre-flight style switch with two controller profiles: calm NASA and panicked rookie. Same tools and safety rules, just different dialogue and pacing, not different control or outcomes.
- Nader: Put it in the product demo apps repo. The OpenAI key is in your secrets, and it's the new Live API, not Realtime, so check the docs first. Test it in your browser and on the iPhone simulator. Your Mac can't run Android, so start a second Devin on Ubuntu to test it on an Android emulator. Send me a test recording with pass and fail checks for each, then open a PR.
- Devin: Okay, got it. I'll pull the docs, start the builds, and spin up a second Devin for Android. ... I'll check the live API docs, build it in product demo apps, test web and iPhone here, hand off Android to an Ubuntu Devin, and open a PR with pass-fail recordings.
- Nader: Perfect. Go ahead and start building.

### Call 2 (rejoined from inside the running session)

- Nader: Hey Devin, how's the lander coming along?
- Devin: It's mostly there. Core game, GPT live session server, voice tools-
- Nader: Nice. Thanks, Devin! *(interrupts)*
- Devin: ... and web build. You got it. Handing it off now.

Devin's lines are from a speech-to-text pass over the recorded call audio.
