# Tutorial 21: Devin Voice + GPT-Live-1, voice script

Narration (Nader, ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, model `eleven_multilingual_v2`, default settings (no seed, no voice_settings), one take for all lines with `_kit/tools/vo.py` (`VO_MODEL=eleven_multilingual_v2`), cut locally). A third cut, `21-devin-voice-nader-nomusic.mp4`, has the same picture and voices with no music bed or UI sounds (`voiceonly.py`). It plays only outside the two Devin Voice calls and outside Coach Otter's lines. When someone is talking in a call or in the game, you hear that real audio instead. `genspec.py` holds the kit lines, and `splice.py` places the three intro lines (`intro/`) over the live gameplay intro.

## What's real and what's synthesized

- Devin's side of both calls: real Devin Voice audio, recorded from its WebRTC track.
- Coach Otter in the intro: real GPT-Live-1 audio from the web build in Chrome, recorded from the app's WebRTC track. The creatine boost, night mode and chill style are real tool calls from that same session. The gameplay under it is played off camera by a hazard-aware autoplayer that reads the live game state and presses the normal arrow keys; the game rules are unchanged.
- Nader's lines in the calls and to Coach: ElevenLabs Nader voice (`eleven_multilingual_v2`, one take per set, cut locally), placed in the slots where the original lines were played into the mic. A few start slightly earlier so each ends before Devin's real reply (`call/shift.json`). His lines to Coach were played into the app's mic during the recording, so Coach is replying to these exact takes.
- Narration: ElevenLabs Nader voice (`eleven_multilingual_v2`).

## Intro (live gameplay, Chrome)

- Teaser, intro audio muted: Today I'll be building and testing a cross-platform mobile game just by using my voice. It runs on iOS, Android, and the web, from one codebase.
- I'll build it with Devin and Devin Voice, which uses ChatGPT voice under the hood. And the game itself talks to players through OpenAI's GPT-Live-1 API.
- This is Coach Otter. He talks and listens at the same time, and runs game actions as tools in the background.
- Then the real run plays with its own audio: Coach greets the player, "give me a creatine boost" (bottles drop while he talks), "wait, wait, make it night time" said over him while he talks (the city goes dark), "switch to chill surfer mode", and "what's my best score?".

## Session

- `0000.png`: Here's how I built it, starting from a new Devin session.
- `0001.png`: First, switch the virtual environment from Ubuntu to macOS, so Devin can run the iPhone simulator.
- `0008.png`: Then click the waveform button beside the message box to start a voice call.
- Call 1 (real audio): pitch Jumpy Otter, add Coach Otto on GPT-Live-1, interrupt to add the game tools and style switch, ask Devin to speak a little faster, then the server, testing and PR asks.
- `0255.png`: Devin sets up the Expo project, builds the voxel city, and connects Coach Otter to GPT-Live-1 through a small server that keeps the API key.
- `0332.png` (hover on the call button, the game on the iPhone simulator in the Computer tab): Soon the game is running on the iPhone simulator, live in the Computer tab. Mid-build, you can rejoin the call from inside the session and ask how the game's coming along.
- Call 2 (real audio): "Hey Devin, how's the game coming along?", with a barge-in while Devin answers.
- `0514.png`: Devin starts a second Devin on Ubuntu to test Android. Its update says Coach Otter already talks on the web, and runs tools while he talks.
- `0636.png`: Then it plays the web build in Chrome with Computer Use.
- `0700.png`: On the iPhone simulator, audio doesn't work on this Mac, so Devin types to Coach instead of talking.
- `1094.png` (Chrome card): Every test comes with a recording and pass fail checks.
- `1097.png`: In Chrome, Coach connects, runs the boost, night, and best score tools, and switches style. Eleven checks pass, and one is left untested.
- `1127.png` (iPhone card): On the iPhone, the tools, both styles, and reconnecting all work, and eight checks pass. The voice you heard at the start ran in Chrome.
- `1160.png` (Ubuntu Devin's page): The Ubuntu Devin ran the game on an Android emulator with software rendering. All twelve checks pass, Coach tools included.
- `1202.png` (PR tab): Then it opens a pull request with the code, the reports, and the recordings.
- Outro: That's how you build and test a cross-platform game with your voice, using Devin Voice and GPT-Live-1.
