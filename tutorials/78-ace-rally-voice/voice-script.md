# Tutorial 78: ACE RALLY, Devin Voice + GPT-Live-1, voice script

Narration (Nader, ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, model `eleven_multilingual_v2`, default settings, one take per set with `_kit/tools/vo.py`, cut locally). It plays only outside the Devin Voice calls and outside Chair's lines. When someone is talking in a call or in the game, you hear that real audio instead.

## What's real and what's synthesized

- Chair in the cold open: real GPT-Live-1 audio from ACE RALLY's Expo web build in Chrome, recorded from the app's WebRTC track (`intro/record-intro.mjs`). The venue switch, the two character picks, the match start and the hype-style switch are real tool calls from that session. Both players are the game's read-only scripted drivers (`tools/driver.mjs`) pressing the normal keys; nothing writes game state.
- Nader's lines to Chair (`intro/g*.wav`) were played into the app's microphone during that recording, so Chair is replying to these exact takes.
- Devin's side of the calls: real Devin Voice audio, recorded from its WebRTC track. Nader's call lines (`call/c*.wav`) were played into Devin Voice as the microphone.
- Narration: ElevenLabs Nader voice (`eleven_multilingual_v2`).
- The base game (ACE RALLY, its Chair umpire and its ElevenLabs announcer) was built earlier with Devin in `dabit3/private-experiments` PR #148 and copied to `thequantexplorer/product-demo-apps/ace-rally` for the on-camera session.

## Cold open (live gameplay, Chrome)

- Teaser, game audio muted: Today I'll be building and testing a cross-platform mobile game just by using my voice. It's a tennis game that runs on iOS, Android, and the web, from one codebase.
- I built the base game earlier with Devin. Today I'll use Devin Voice, which uses ChatGPT voice under the hood. And the game itself talks to players through OpenAI's GPT-Live-1 API.
- This is Chair, the live umpire. He talks and listens at the same time, and runs game actions as tools in the background.
- Then the real run plays with its own audio: Chair greets the players; Nader: "Chair, put us on the night court. Rex for player one, Mina for player two, and start a quick set." (the venue, both players and the match start run as tools); Chair commentates the rally; Nader, over him: "Wait, wait. Switch to hype mode." (he repeats the request and carries on in the hype style); later Nader: "Chair, what's the score?" and Chair reads the live score ("15 all, no games on the board, Rex to serve").

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

(filled in from the final spec.js once the session is captured)
