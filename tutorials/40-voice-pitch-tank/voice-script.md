# Tutorial 40: Pitch Tank (Devin Voice + GPT-Live-1), voice script

Narration (Nader, ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, model `eleven_v4`, the voice's default settings with no seed or `voice_settings`, one take cut locally with `VO_MODEL=eleven_v4 _kit/tools/vo.py`). It plays only outside the two calls and the game clips. During those, the real call audio and the real GPT-Live-1 investor audio play instead. `genspec.py` is the source of truth for the lines and where they land.

## Narration

- Intro (`0000.png`): Today I'll be building and testing a cross-platform mobile game just by using my voice. One codebase runs on iOS, Android, and the web.
- `0002.png`: I'll use Devin and Devin Voice, which uses ChatGPT voice under the hood. The game's investors talk through OpenAI's GPT-Live-1 API.
- `0101.png`: The investors talk and listen at the same time, and background tools pop offer cards while they talk.
- `0132.png`: You can cut them off mid-question.
- `0133.png`: End the pitch for a score.
- `0134.png`: Or switch to ruthless sharks.
- `0214.png`: Here's how I built it.
- `0217.png`: First, switch the environment to macOS for the iPhone simulator.
- `0222.png`: Then click the waveform button to start a voice call.
- Build (`0443.png`): Devin builds the game, plus a small server that keeps the OpenAI key private.
- Rejoin (`0531.png`): Mid-build, I rejoin the call from inside the session.
- `0561.png`: Then Devin tests the web build in Chrome. Its Mac has no microphone, so it feeds in a recorded pitch.
- `0569.png`: Then it runs the same test on the iPhone simulator.
- `1427.png`: When it's done, Devin opens a pull request.
- Chrome card (`1428.png`): Each test run comes with a recording and pass-fail checks. Chrome passes all seven.
- iPhone card (`1455.png`): The iPhone passes all six.
- Android recording (`1482.png`): A second Devin on Ubuntu tested Android in an emulator. It reports eight checks passing and two dropped. The emulator's mic was distorted, so some captions were wrong.
- Ending (`1486.png`): That's how you build and test a cross-platform game just by using your voice.

## The calls (real)

Nader's lines below were generated with his ElevenLabs voice and `eleven_v4` (default settings, one take, cut locally into `call/c*.wav`) and fed to Devin Voice as the microphone. Devin heard them live and answered by voice. Its replies in the video are its own WebRTC audio, recorded from the call and mixed with Nader's lines by wall-clock time (`mixcall.py`). Nader's lines were regenerated with `eleven_v4` after the take, word for word. The three that came out longer start slightly earlier, in the quiet before them (`call/shift.json`: c1 by 0.6 s, c2 by 1.68 s, c3 by 0.67 s). That way each still ends before Devin answers. The interruption and the "Nice" cut-in keep their original start times.

### Call 1 (started from the home page, macOS environment)

- Nader: Hey Devin. Let's build a game. It's called Pitch Tank, and it's built with Expo, so one codebase runs on iOS, Android, and the web.
- Nader: You pitch a startup idea out loud to a panel of three cartoon investors. They talk back with OpenAI's GPT-Live-1 API, so they listen while you talk, jump in with questions, and you can cut them off.
- Nader: Use background tools, so each investor's interest meter moves while they talk, and offer cards pop up, like two hundred K for ten percent. My OpenAI key is already in your secrets, so keep it on a small server. How would you set that up?
- Nader: Oh, wait, one more thing. Add a switch between friendly mentors and ruthless sharks, and give the pitch a score at the end. *(interrupts Devin mid-answer)*
- Nader: Can you speak a little faster? *(tip from the voice-mode docs)*
- Nader: Put it in the product demo apps repo. Test it in your browser and on the iPhone simulator, and feed it a recorded pitch, since your computer has no microphone. Your Mac can't run Android, so start a second Devin on Ubuntu to test it on an Android emulator. Send me a test recording with pass fail checks for each, then open a PR.
- Nader: Perfect. Go ahead and start building.

### Call 2 (rejoined from inside the running session)

- Nader: Hey Devin, how's the game coming along?
- Nader: Nice. Thanks, Devin! *(barges in while Devin is answering)*

## The game's voices (real GPT-Live-1)

The investors in Pitch Tank are three GPT-Live-1 sessions (`POST /v1/live/sessions` over WebRTC, with a small server doing the SDP exchange so the OpenAI key stays server-side). The opening clips were recorded in Chrome on the Mac with a pre-recorded founder pitch as the microphone. Every investor line you hear is the model's own audio. The founder lines in those clips are Nader's ElevenLabs voice, regenerated with `eleven_v4`. They replace the original pitch audio at the same start times, and the investor audio is untouched. Background tool calls move the interest meters, pop the offer cards and score the pitch.

GPT-Live-1 docs: [model](https://developers.openai.com/api/docs/models/gpt-live-1), [Live API guide](https://developers.openai.com/api/docs/guides/live), [delegation](https://developers.openai.com/api/docs/guides/live-delegation), [prompting](https://developers.openai.com/api/docs/guides/live-prompting), [conversations](https://developers.openai.com/api/docs/guides/live-conversations), [WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live).

## What's real

- Both calls, the build, the Chrome and iPhone test runs, and the PR ([thequantexplorer/product-demo-apps#82](https://github.com/thequantexplorer/product-demo-apps/pull/82)) happened in one real Devin session on a macOS VM. A second Devin session on Ubuntu ran the Android emulator test.
- The Mac has no microphone, so every test fed the game a recorded pitch. Chrome (ruthless sharks) passed all 7 of its checks and the iPhone 17 Pro Simulator (friendly mentors) passed all 6.
- On Android, the Ubuntu Devin reported 8 of 10 checks passing and 2 dropped. The emulator's microphone audio was distorted, so the founder captions were partly wrong, and the offer and score there are based on those captions. Real devices weren't tested.
- The test-run frames in the middle of the video are replayed from the session's Computer timeline. The live Computer view during the rest of the build is skipped, and it's blurred during the second call, because it showed a hover overlay.
