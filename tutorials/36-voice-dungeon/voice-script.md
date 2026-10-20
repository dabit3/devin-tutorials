# Tutorial 36: Dungeon Voice, voice script

Narration (Nader, ElevenLabs `eleven_multilingual_v2`, voice `T8iHhGIWPm2GVYpQD1Am`, default settings, one take cut locally with `_kit/tools/vo.py`). It plays only outside the two calls and the app demo. During those, the real audio plays instead. `genspec.py` is the source of these lines. Every Nader line in this tutorial (narration, call lines and the in-app player lines) uses `eleven_multilingual_v2`. Both cuts have no background music. Devin's replies and the dungeon master's audio are live recordings, unchanged.

## Narration

- Intro (app demo, gate): Today I'll be building and testing a cross-platform mobile game just by using my voice. It runs on iOS, Android, and the web, from one codebase.
- Intro (bridge): I'll talk to Devin with Devin Voice, which uses ChatGPT voice under the hood. And the game's dungeon master talks to players through OpenAI's GPT-Live-1 API.
- Intro (troll): It listens while it talks, handles interruptions, and runs tools in the background. Each move plays out on screen before the dungeon master tells you what happened.
- *(the real app demo plays: the player talks, interrupts, and the dungeon master answers)*
- `0000.png`: Here's how I built it. First, I switch the virtual environment from Ubuntu to macOS, so Devin can run the iPhone simulator.
- `0009.png`: Then I click the waveform button beside the message box to start a voice call.
- *(call 1 plays)*
- Build (`0292.png`): Devin sets up the Expo app, a small server that keeps the OpenAI key private, the pixel-art screens, and the game tools.
- Rejoin (`0362.png`): Mid-build, I rejoin the call from inside the session and ask how it's going.
- *(call 2 plays)*
- `0416.png`: When the build is ready, Devin opens a pull request, and starts a second Devin on Ubuntu to test Android.
- Web recording: Devin tests the web version in Chrome first.
- Web recording: A typed action rolls the die, the room card updates, and the dungeon master narrates it.
- iPhone recording: On the iPhone Simulator, the Mac has no microphone, so Devin adds a virtual one, and the dungeon master starts narrating.
- iPhone recording: The comedic narrator and saved progress pass on iPhone too.
- Android (Ubuntu session): On Android, the second Devin runs the same app on an emulator, typing actions instead of talking.
- Android recording: The troll roll, the map, the comedic narrator, and resuming a saved game all pass.
- Test summary: Every check passes on all three. The test machines have no speakers, so the voice you heard at the start is from my own run in Chrome.
- Outro: And that's how you build and test a cross-platform game, just by talking to Devin, with a dungeon master that talks back.

## The app demo (real)

The opening demo is Dungeon Voice running in Chrome against `gpt-live-1`. The player's lines are Nader's ElevenLabs voice fed in as the microphone (`eleven_multilingual_v2`). The dungeon master's lines are GPT-Live-1's own audio from the WebRTC session, not TTS. The room card, map, hearts, inventory and d20 change through the app's background tools (`roll_d20`, `move_on_map`, `update_room`, `update_inventory`, `change_hearts`) while it keeps talking. When a roll starts, the app animates the hero's attempt (a sneak, a fight with the troll) and returns the roll to the dungeon master only after the animation, so the result is narrated after you see it. When the hero leaves a room, it walks off the painting before the next room fades in. This demo was recorded after the take with the animated version of the app (product-demo-apps#81); the Devin in the call built the version before the animations were added.

- Player: I sneak past the troll.
- Dungeon master: The die clatters across the stone. A plank whines underfoot. A snort cuts the air, and a hungry-
- Player: Wait, actually, I attack the troll. *(interrupts)*
- Dungeon master: The die spins. Your blade bites the dark. The troll bellows and lurches aside, leaving the way open, but the cold feels sharper now. What will you do?
- *(narrator switched to comedic)* Dungeon master: Oh, splendid choice. I'll try not to drop the mood in that chasm.
- Player: I run across the bridge and head north.
- Dungeon master: The die twirls. You sprint like a caffeinated ferret. Somehow upright, you land in the Mushroom Grotto, disco-lit by fungi. It smells like wizard salad and the floor giggles. North or south, sprinter?

## The calls (real)

Nader's lines below were generated with his ElevenLabs voice (`eleven_multilingual_v2`, one take, cut locally into `call/c*.wav`) and fed to Devin Voice as the microphone. Devin heard them live and answered by voice. Its replies in the video are its own WebRTC audio, recorded during the call, not re-synthesized.

### Call 1 (started from the home page, macOS environment)

- Nader: Hey Devin. Let's build a game. A voice-first fantasy adventure called Dungeon Voice, with Expo, so one codebase runs on iOS, Android, and the web.
- Nader: The dungeon master is OpenAI's GPT-Live-1 voice model. You just talk to it, like, I sneak past the troll, and it narrates what happens. While it talks, tools update the room card, the map, your inventory, your hearts, and roll a twenty-sided die on screen.
- Nader: Make it look great, with rich pixel art. Use the GPT-Live docs on OpenAI's developer site. How would you set that up?
- Devin: I put the live session behind a small server that-
- Nader: Oh, wait, one more thing. Add a narrator style switch, spooky or comedic. *(interrupts Devin mid-answer)*
- Nader: Can you speak a little faster? *(tip from the voice-mode docs)*
- Nader: Put it in the product demo apps repo, and keep the OpenAI key on a small server. Test it in your browser and on the iPhone simulator. Your Mac can't run Android, so start a second Devin on Ubuntu to test it on an Android emulator. Send me a test recording with pass fail checks for each, then open a PR.
- Nader: Perfect. Go ahead and start building.

### Call 2 (rejoined from inside the running session)

- Nader: Hey Devin, how's the game coming along?
- Devin: It's coming along. I'm getting the first playable loop set up with narration choices and state updates.
- Nader: Nice. Thanks, Devin!

## What's real

- Both calls, the build, and the web and iPhone test recordings happened in one real Devin session on a macOS VM. The Android test ran in a second, real Devin session on Ubuntu.
- The iPhone Simulator had no audio input at first, so the dungeon master stayed silent. Devin installed a virtual input device and re-ran the test, and the narration started. None of the test machines has speakers, so the dungeon master's voice was only heard in the Chrome demo at the start. Speaking real voice commands was not tested on any test machine; the tests typed actions instead.
- The Android emulator runs on software rendering. The recording doesn't visibly catch the d20 spin there.
- Real phones weren't tested.
