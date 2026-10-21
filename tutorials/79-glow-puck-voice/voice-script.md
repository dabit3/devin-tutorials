# Tutorial 79: Glow Puck, a GPT-Live-1 referee built and tested by voice

Narration (Nader, ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, model `eleven_multilingual_v2`, default settings, one take for all lines with `_kit/tools/vo_onetake.py`, cut locally).

## What's real and what's synthesized

- The referee in the cold open: real GPT-Live-1 audio from Glow Puck's web build in Chrome, recorded from the app's WebRTC track (`coldopen.mjs`, take 21 → `live/live.mp4`). `set_best_of 7`, `grant_power Tide/fireball` and `set_style hype` are real background tool calls from that session (`live/live.json` holds the data-channel events). Both players press the normal keys from a script that only reads the app's read-only `window.__gp` state; the game rules are unchanged.
- Nader's lines to the referee (`call/k1..k4.wav`) and in the Devin Voice call (`call/c1..c7.wav`): ElevenLabs Nader voice (`eleven_multilingual_v2`). They were played into the apps' microphone during the takes, so the referee and Devin are answering these exact takes.
- Devin's side of the call: real Devin Voice audio, recorded from its WebRTC track.
- Narration: ElevenLabs Nader voice (`eleven_multilingual_v2`).
- The base game (Glow Puck, PR dabit3/private-experiments#150) was built earlier with Devin; the call adds one feature to it.

## Cold open (live gameplay, Chrome)

- Teaser, intro audio muted: Today I'll be building and testing a cross-platform mobile game just by using my voice. It runs on iOS, Android, and the web, from one codebase.
- I'll build it with Devin and Devin Voice, which uses ChatGPT voice under the hood. And the game talks to its players through OpenAI's GPT-Live-1 API.
- This is Glow Puck, a two-player neon air hockey game Devin built for me earlier. The referee is GPT-Live-1, live: it calls the rally, listens while it talks, and runs match changes as background tools.
- Then the real run plays with its own audio: the referee greets the players, "change this match to best of seven" (best-of 9 → 7 while it talks), "give blue a fireball" (Tide's next hit), "what's the score?", "wait, wait, switch to hype mode" said over its answer, then hype commentary.

## Session narration (in order)

- Here's how I built the new feature, starting from a new Devin session.
- First, switch the virtual environment to macOS, so Devin can run the iPhone simulator.
- Then click the waveform button beside the message box to start a voice call.
- Devin reads the game, adds a time out tool to the referee's server and client, and wires the ten second countdown into the match.
- About fifteen minutes in, the pull request is already open, and Devin is setting up a virtual microphone so it can talk to the referee. You can rejoin the call from inside the session at any point.
- In Chrome, Devin says time out to the referee through the virtual microphone. The tool fires, the table freezes, and the countdown runs.
- Then the same test on the iPhone simulator, with the referee connected over the dev build.
- Devin's report: three time outs on each platform, each one with the countdown, the freeze, the announcement, and play back in. It also caught one try where the referee said time out but never called the tool, and fixed the prompt.
- The pull request has the code and both recordings. The repo has no CI, so nothing ran on it.
- The recordings are real time and silent; the referee's lines show up as captions.
- Not tested: saying resume during a countdown, and calling a second time out while one is running.
- On the iPhone, the same three time outs.
- Android I checked on a Linux emulator. The countdown, the frozen table and the ten-second auto-resume work there too.
- But I had to fire it from a debug hook: the emulator's mic didn't reach the referee this time, and sound and frame rate can't be judged on that machine.
- Outro: That's how you add a feature to a cross-platform game with your voice, using Devin Voice and GPT-Live-1.

## Devin Voice call

- Call 1 (`call/c1..c5.wav`, real Devin Voice audio, 106 s): Glow Puck in product-demo-apps, add a "time out" referee tool (10 s pause, countdown on the table, auto-resume), barge-in mid-answer ("...hook it into the— Oh, and have the referee announce the timeout..."), test on web + iPhone simulator with recordings, open a PR.
- Call 2 (`call/c6..c7.wav`, 19.5 s): rejoin mid-build ("how's the time out feature coming along?").
- Result: https://github.com/thequantexplorer/product-demo-apps/pull/86 (5 files, +48 −9). Devin's Chrome and iPhone recordings are real-time and silent; the referee's announcements are shown as captions there.
- Not tested by Devin: saying "resume" during a countdown; a second time out while one is running.

## Android (separate Linux child session, API 35 emulator, Mesa llvmpipe software GL)

- Verified: match loop, pause/resume, referee connection, audio-track allocation (earlier phases); for the new feature, the countdown overlay, frozen puck/mallets and the 10.7 s auto-resume, with the referee captions "Timeout on, ten-second breather." / "And we're back, play on now." (`android/`).
- Not verified: the time out by voice (three TTS attempts reached the emulator mic but GPT-Live did not react this time; it was fired from a client-side debug hook, i.e. the GPT-Live → `call_timeout` round-trip is verified on web and iPhone only), audible audio, and smooth frame rate (~3.7 fps on software GL). The narration says so.
