# Tutorial 38: Sketch Buddy, voice script

Narration (Nader, ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, default settings, one take cut locally with `_kit/tools/vo_onetake.py`). It plays only outside the two calls and the app clips. During those, the real audio plays instead. `genspec.py` is the source of these lines.

## Narration

- Intro (`intro-0.jpg`): Today I'll be building and testing a cross-platform mobile app just by using my voice. It's called Sketch Buddy, and one codebase runs on iOS, Android, and the web.
- `intro-1.jpg`: I'll build it with Devin and Devin Voice, which uses ChatGPT voice under the hood. And the app's art buddy talks back through OpenAI's GPT-Live-1 API.
- `intro-2.jpg`: You describe a scene, and the buddy keeps talking while tools in the background draw it.
- `0003.png`: Now let's build it. First, switch the virtual environment from Ubuntu to macOS, so Devin can run the iPhone simulator.
- `0008.png`: Then click the waveform button beside the message box to start a voice call.
- Build (`0223.png`): Devin sets up the Expo app, adds a small server that keeps the OpenAI key private, and wires GPT-Live-1 to the drawing tools.
- Rejoin (`0299.png`): Mid-build, you can rejoin the call from inside the session and ask how it's coming along.
- `0523.png`: It tests the app in Chrome and on the iPhone simulator with Computer Use, and writes up a report.
- Chrome + iPhone card (`0720.png`): Every test run comes with a recording. In Chrome and on the iPhone simulator, the buddy answers each scene, draws it step by step, switches styles both ways, and all nineteen checks pass.
- Android report (`0684.png`): For Android, a second Devin on Ubuntu ran the app on an emulator. The buddy talks out loud and draws the scene, though its replies are slow on the software emulator.
- PR (`0769.png`): Then it opens a pull request in the product demo apps repo, ready to review.
- Finished app (`tail-0.jpg`): Here's the finished app. You can change your mind while it's drawing, or switch the buddy to a deadpan critic.
- Ending (`outro.jpg`): And that's how you build and test a cross-platform app with your voice. One call with Devin, one codebase, and an app that talks back through GPT-Live-1.

## The app clips (real)

The finished-app clips are screen captures of Sketch Buddy in Chrome. The buddy's voice is the app's own GPT-Live-1 WebRTC audio, recorded during the capture (teacher voice `gleam`, critic voice `vesper`). The prompts spoken to it ("a cat in a top hat on the moon", "make the moon bigger", "no, purple", "a robot eating spaghetti") are Nader's ElevenLabs voice fed in as the microphone. Shapes appear as the background drawing tool returns them.

## The calls (real)

Nader's lines were generated with his ElevenLabs voice (one take, cut locally into `call/c*.wav`) and fed to Devin Voice as the microphone. Devin heard them live and answered by voice. Its replies in the video are its own WebRTC audio, recorded during the call, not re-synthesized.

### Call 1 (started from the home page, macOS environment)

- Nader: Hey Devin. Let's build an app called Sketch Buddy, with Expo, so one codebase runs on iOS, Android, and the web.
- Nader: You describe a scene out loud, like a cat in a top hat on the moon, and an art buddy talks back while it draws shapes on a canvas in real time. The art buddy's voice should use OpenAI's GPT-Live-1 API. The key is in your secrets.
- Nader: How would you set up the voice part?
- Devin: Okay, I'll check the live voice setup and our secrets pattern. Then-
- Nader: Oh, wait, one more thing. Add a style switch, an enthusiastic art teacher or a deadpan critic. And a surprise me button for a random doodle. *(interrupts Devin mid-answer)*
- Devin: Sure thing. I'll include that too. …
- Nader: Can you speak a little faster? *(tip from the voice-mode docs)*
- Nader: Put it in the product demo apps repo. Test it in your browser and on the iPhone simulator, and make sure the art buddy really talks and draws. Your Mac can't run Android, so start a second Devin on Ubuntu to test it on an Android emulator. Send me a test recording with pass fail checks for each, then open a PR.
- Nader: Perfect. Go ahead and start building.
- Devin: Yep, building now in product demo apps. One correction: instead of client tokens, our server will proxy the WebRTC offer to OpenAI's live sessions endpoint, so the key never leaves the server.

### Call 2 (rejoined from inside the running session)

- Nader: Hey Devin, how's Sketch Buddy coming along?
- Devin: Checking. I'm still working on it. The app is built, and I'm getting the final browser and iPhone recordings.
- Nader: Nice. Thanks, Devin! *(interrupts)*
- Devin: Yeah, and the Ubuntu Android emulator test is underway. I'll open the PR after those pass/fail results are in.
