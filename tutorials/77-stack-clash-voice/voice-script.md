# Tutorial 77 — Stack Clash voice: voice script

Nader's voice throughout is ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, model `eleven_multilingual_v2`: the narration, his lines to RIVET in the cold open, and his lines on both Devin Voice calls. Everything RIVET says is live GPT-Live-1 audio, and everything Devin says is live Devin Voice audio; neither is re-voiced.

## Cold open (real RIVET run in Chrome, captured with the game's audio)

Nader's lines were played into Chrome as the microphone (`voice-hook.js` style WebAudio hook); RIVET heard them over its real WebRTC session and ran the tools itself (`start_match`, `set_stage`, `set_style`).

- Nader: Hey Rivet, start a best-of-one match against the CPU on hard.
- Nader: Rivet, switch the stage to Ember Fields.
- Nader: Rivet, how's the score looking?
- Nader: Actually, hold on. Just tell me who's ahead.  *(interrupts RIVET mid-sentence)*
- Nader: Rivet, switch to a calm commentary style.

## Intro narration (narrated cut only, over a muted gameplay teaser)

- `i0`: Today I'll be building and testing a cross-platform mobile game just by using my voice. It runs on iOS, Android, and the web, from one codebase.
- `i1`: I'll talk to Devin with Devin Voice, which uses ChatGPT voice under the hood. And the game's ringside announcer, Rivet, talks to players through OpenAI's GPT-Live-1 API.
- `i2`: Devin built the base game earlier. Rivet listens while it talks, takes interruptions, and runs the game's tools in the background.

## Narration (kit cut)

- `0000.png`: Here's how I added a feature to it, just by talking. First, I switch the virtual environment from Ubuntu to macOS, so Devin can run the iPhone simulator.
- `0009.png`: Then I click the waveform button beside the message box to start a voice call.
- `0262.png`: Devin reads how Rivet is wired up, adds a tool that inspects the player's board, and draws the tip under the board in the player's color.
- `0343.png`: Mid-build, I rejoin the call from inside the session and ask how it's going.
- `0368.png`: Devin opens a pull request, then tests the feature itself: in Chrome, on the iPhone Simulator, and through a second Devin on Ubuntu for Android. The first run caught two iPhone layout failures, so Devin fixed them and ran it again.
- `1002.png`: Here's Devin's recording. In Chrome, Rivet reads the board, speaks a tip, and the caption shows under the right board, in the player's color, for about six seconds.
- `1018.png`: On the iPhone Simulator the Mac has no microphone, so Devin triggers the same tool calls directly, and checks the layout, color and timing.
- `1134.png`: On Android, the second Devin talks to Rivet for real on an emulator, and the tip lands in portrait and landscape. It also noted one intermittent connection drop in the PR as a known issue.
- `1074.png`: The pull request has the tool, the caption, and the tests: thirty-three pass, with typecheck and lint.
- `1155.png`: Every check passes on web and iPhone, and on Android, except that one known issue.
- `outro-ember.jpg`: And that's how you add a feature to a cross-platform game just by talking to Devin, with an announcer that talks back.

## The calls (real)

Nader's lines were fed to Devin Voice as the microphone; Devin heard them live and answered by voice. Its replies in the video are its real audio (`audio/call1.wav`, `audio/call2.wav`, mixed by `mixcall.py`).

### Call 1 (started from the home page, macOS environment)

- Nader: Hey Devin. There's a game in the product demo apps repo called Stack Clash.
- Nader: It's a two-player falling-block game built with Expo, so one codebase runs on iOS, Android, and the web. It has a ringside announcer called Rivet, and Rivet runs on OpenAI's GPT-Live-1. I want to add one feature. When I ask Rivet for advice, it should look at my board and give me a short coaching tip. That tip should also show up as a caption under my board for a few seconds.
- Nader: How would you wire that up?
- Nader: Oh, wait, one more thing. Make the tip caption use the player's color.  *(interrupts Devin)*
- Nader: Can you speak a little faster?
- Nader: Test it in your browser and on the iPhone simulator. Your Mac can't run Android, so start a second Devin on Ubuntu to test it on an Android emulator. Send me a test recording with pass fail checks for each, then open a PR.
- Nader: Perfect. Go ahead and start building.

### Call 2 (rejoined from inside the session, mid-build)

- Nader: Hey Devin, how's the feature coming along?
- Nader: Nice. Thanks, Devin!  *(interrupts Devin mid-sentence)*

## Off camera

Two short typed messages to the session are not in the cut: one after the thequantexplorer GitHub app was re-granted access to `product-demo-apps` (the session had been blocked on fetching the repo), and one asking it to wrap up instead of chasing the Android reconnect issue further. The result is [product-demo-apps#88](https://github.com/thequantexplorer/product-demo-apps/pull/88).
