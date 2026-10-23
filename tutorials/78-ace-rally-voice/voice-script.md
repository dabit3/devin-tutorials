# Tutorial 78: ACE RALLY, Devin Voice + GPT-Live-1, voice script

Narration (Nader, ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, model `eleven_multilingual_v2`, default settings, one take per set with `_kit/tools/vo.py`, cut locally). It plays only outside the Devin Voice calls and outside Chair's lines. When someone is talking in a call or in the game, you hear that real audio instead.

## What's real and what's synthesized

- Chair in the cold open: real GPT-Live-1 audio from ACE RALLY's Expo web build in Chrome, recorded from the app's WebRTC track (`intro/record-intro.mjs`; the take is kept outside the repo). The venue switch, the two character picks, the match start and the hype-style switch are real tool calls from that session. Both players are the game's read-only scripted drivers (`tools/driver.mjs`) pressing the normal keys; nothing writes game state.
- Nader's lines to Chair (`intro/g*.wav`) were played into the app's microphone during that recording, so Chair is replying to these exact takes.
- Devin's side of the calls: real Devin Voice audio, recorded from its WebRTC track. Nader's call lines (`call/c*.wav`) were played into Devin Voice as the microphone.
- Narration: ElevenLabs Nader voice (`eleven_multilingual_v2`).
- The base game (ACE RALLY, its Chair umpire and its ElevenLabs announcer) was built earlier with Devin in `dabit3/private-experiments` PR #148 and copied to `thequantexplorer/product-demo-apps/ace-rally` for the on-camera session.

## Cold open (live gameplay, Chrome)

- Teaser, game audio muted: Today I'll be building and testing a cross-platform mobile game just by using my voice. It's a tennis game that runs on iOS, Android, and the web, from one codebase.
- I built the base game earlier with Devin. Today I'll use Devin Voice. Devin Voice uses ChatGPT voice under the hood. And the game itself talks to players through OpenAI's GPT-Live-1 API.
- This is Chair, the live umpire. He talks and listens at the same time, and runs game actions as tools in the background.
- Then the real run plays with its own audio: Chair greets the players; Nader: "Chair, put us on the night court. Rex for player one, Mina for player two, and start a quick set." (the venue, both players and the match start run as tools); Chair commentates the rally; Nader, over him: "Wait, wait. Switch to hype mode." (Chair: "Wait, wait, switch to hype mode? Sure. Hype mode on", and carries on in the hype style); later Nader: "Chair, what's the score?" and Chair reads the live score ("Fifteen love, Mina leading").

## The calls (real)

### Call 1 (started from the home page, after picking macOS)

- Nader: Hey Devin. There's a tennis game called ACE RALLY in the product demo apps repo. It's an Expo app, so one codebase runs on iOS, Android, and the web. And it has a live voice umpire called Chair, built on OpenAI's GPT-Live-1 API.
- Nader: I want to add one thing. Let players ask Chair to call the match in another language, like Spanish or Japanese. Run that as a background tool, so he switches languages without stopping the game. How would you set that up?
- Nader: And show the current language in the Chair panel, so players can see it.
- Nader: Oh, wait, one more thing. Keep the OpenAI key on the small server that's already in the project. It's in your secrets. Nothing goes in the app bundle.  *(interrupts Devin)*
- Nader: Can you speak a little faster?
- Nader: Test it in your browser and on the iPhone simulator with Computer Use. Your Mac can't run Android, so start a second Devin on Ubuntu to test it on an Android emulator. For each platform, send me a test recording with pass fail checks. Then open a PR.
- Nader: Perfect. Go ahead and start building.

### Call 2 (rejoined from inside the session, mid-build)

- Nader: Hey Devin, how's it going with Chair?
- Nader: Nice. Thanks, Devin!  *(interrupts Devin mid-sentence)*

## Session narration

Call 1 and call 2 play as real audio where they fall in the session; the lines below play between them.

- `0003.png`: Here's how I did it. A new Devin session on macOS, then a voice call.
- `0001.png`: First, switch the virtual environment from Ubuntu to macOS, so Devin can run the iPhone simulator.
- `0008.png`: Then click the waveform button beside the message box to start a voice call.
- `0250.png`: Devin pulls the game, adds a set language tool to Chair, and shows the current language in his panel. The OpenAI key stays on the project's small server.
- `0292.png`: Soon the web build is running in the Computer tab. Mid-build, you can rejoin the call from inside the session and ask how it's going.
- `0340.png`: Then Devin tests it with Computer Use. In Chrome, he asks Chair to call the match in Spanish, then Japanese, while the match keeps going.
- `0400.png`: Your Mac can't run Android, so Devin starts a second Devin on Ubuntu for the emulator.
- `0413.png`: On the iPhone simulator, this Mac has no audio device, so Devin types to Chair instead of talking.
- `0646.png`: Every test comes with a recording and pass fail checks.
- `0649.png`: In Chrome, the badge starts in English, switches to Spanish and Japanese while the match keeps going, Japanese survives a reload, and nine checks pass.
- `0679.png`: On the iPhone, the same switches, the panel fix and the reconnect in Japanese pass: four checks in the final recheck.
- `0709.png`: The Ubuntu Devin ran it on an Android emulator. Spanish and Japanese pass, and it flags one dropped connection that came back with a tap.
- `0712.png`: Then it opens a pull request with the code, the reports, and the recordings.
- Outro: That's how you add and test a feature in a cross-platform game with your voice, using Devin Voice and GPT-Live-1.
