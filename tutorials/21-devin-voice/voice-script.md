# Tutorial 21: Devin Voice + GPT-Live-1, voice script

Narration (Nader, ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, model `eleven_multilingual_v2`, default settings (no seed, no voice_settings), one take for all lines with `_kit/tools/vo.py` (`VO_MODEL=eleven_multilingual_v2`), cut locally). A third cut, `21-devin-voice-nader-nomusic.mp4`, has the same picture and voices with no music bed or UI sounds (`voiceonly.py`). It plays only outside the two Devin Voice calls and outside Coach Otto's lines. When someone is talking in a call or in the game, you hear that real audio instead. `genspec.py` holds the kit lines, and `splice.py` places the three intro lines (`intro/`) over the live gameplay intro.

## What's real and what's synthesized

- Devin's side of both calls: real Devin Voice audio, recorded from its WebRTC track.
- Coach Otto in the intro: real GPT-Live-1 audio from the web build in Chrome, recorded from the app's WebRTC track. Creatine Rush, Freeze Time, Seagull Taxi and Surfboard are real tool calls from that same session, and each one changes the gameplay: the otter goes giant and smashes cars and cable cars, traffic freezes, a seagull flies him about ten rows ahead, and a surfboard lets him cross open bay water. The gameplay under it is played off camera by a hazard-aware autoplayer that reads the live game state and presses the normal arrow keys; the game rules are unchanged.
- Nader's lines in the calls and to Coach: ElevenLabs Nader voice (`eleven_multilingual_v2`, one take per set, cut locally), played into the mic during the recording, so Devin and Coach are replying to these exact takes.
- Narration: ElevenLabs Nader voice (`eleven_multilingual_v2`).

## Intro (live gameplay, Chrome)

- Teaser, intro audio muted: Today I'll be building and testing a cross-platform mobile game just by using my voice. It runs on iOS, Android, and the web, from one codebase.
- I'll build it with Devin and Devin Voice, which uses ChatGPT voice under the hood. And the game itself talks to players through OpenAI's GPT-Live-1 API.
- This is Coach Otto. He talks and listens at the same time. Ask him for a power-up, and he runs it in the game as a tool.
- Then the real run plays with its own audio: Coach greets the player, "Hey Otto, give me a creatine rush!" (the otter goes giant and smashes traffic), "Wait, wait. Freeze time." said over him while he talks (every car and cable car stops), "Call me a seagull taxi." (flown ten rows ahead), and "Surf's up. Give me a surfboard." (rides across open bay water).

## Session

- `0000.png`: Here's how I built it, starting from a new Devin session.
- `0001.png`: First, switch the virtual environment from Ubuntu to macOS, so Devin can run the iPhone simulator.
- `0008.png`: Then click the waveform button beside the message box to start a voice call.
- Call 1 (real audio): pitch Jumpy Otter, add Coach Otto on GPT-Live-1, interrupt to ask for the four power-ups as tools that change the gameplay, ask Devin to speak a little faster, then the server, testing and PR asks.
- `0270.png`: Devin sets up the Expo project, builds the San Francisco board, and turns each power-up into a tool Coach Otto can call through GPT-Live-1. A small server keeps the API key.
- `0428.png` (hover on the call button): Mid-build, you can rejoin the call from inside the session and ask how the game's coming along.
- Call 2 (real audio): "Hey Devin, how's the game coming along?", with "Nice. Thanks, Devin!" cutting in while Devin answers. (A first rejoin take, where the barge-in came too early, is not used.)
- `0500.png`: Then Devin plays the web build in Chrome with Computer Use.
- `0540.png`: On the iPhone simulator, it taps the power-up buttons, since there's no microphone to talk through.
- `0579.png` (Chrome card): Every test comes with a recording and pass fail checks.
- `0582.png`: In Chrome, all four power-ups work by voice. The first voice attempt stalled, so one check failed, and a fresh browser fixed it.
- `0632.png` (iPhone card): On the iPhone, gameplay and all four power-up buttons pass. Voice is left untested there.
- `0685.png` (Android card): A second Devin on Ubuntu ran the game on an Android emulator. Ten checks pass, and spoken voice is left untested.
- `0729.png` (PR tab): Then it opens a pull request with the code, the reports, and the recordings.
- Outro: That's how you build and test a cross-platform game with your voice, using Devin Voice and GPT-Live-1.
