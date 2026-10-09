# Tutorial 21 — Devin Voice: voice script

Narration (Nader, ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, default settings, one take cut locally with `_kit/tools/vo_onetake.py`). It plays only outside the two calls; during the calls the real call audio plays instead.

## Narration

- `0000.png`: This is Devin Voice. You can talk an app into existence, and then watch Devin build it and test it.
- `0001.png`: First, open Configuration and switch the virtual environment from Ubuntu to macOS, so Devin can run the iPhone and iPad simulators.
- `0008.png`: Then click the waveform button beside the message box to start a voice call.
- `0201.png`: Devin scaffolds the Expo app, writes the six recipes and Cook Mode, and runs lint, typecheck and the web and iOS builds.
- `0255.png`: Mid-build, you can rejoin the call from inside the session and just ask how it's going.
- `0296.png`: Then it tests Mise with Computer Use: first in Chrome, then on the iPhone and iPad simulators, recording each run.
- `0404.png`: Devin opens a pull request in the product demo apps repo, and suggests a blueprint update for next time.
- `0444.png`: The first iPhone run came back as a plain video, so I ask for a real test recording with pass and fail checks.
- `0458.png`: In the Computer tab, you can watch Devin tap through Cook Mode on the iPhone Simulator, timer and all.
- `0484.png`: Every test run comes with a recording. In Chrome, the wide layout puts the steps in their own column, and all five checks pass.
- `0501.png`: On the iPhone, the list opens the recipe, and all eight checks pass.
- `0518.png`: And on the iPad, the recipes sit in a sidebar next to the recipe, and all three checks pass.
- `0535.png`: One conversation, one codebase, tested on the web, the iPhone and the iPad.

## The calls (real)

Nader's lines below were generated with his ElevenLabs voice (one take, cut locally) and fed to Devin Voice as the microphone. Devin heard them live and answered by voice; its replies in the video are its own WebRTC audio, recorded during the call, not re-synthesized.

### Call 1 (started from the home page)

- Nader: Hey Devin. Let's build a recipe app called Mise, with Expo, so one codebase runs on the web, on iPhone and on iPad.
- Nader: It should have six recipes, and a Cook Mode that shows one big step at a time, so I can cook without touching the screen. Add a timer when a step needs one.
- Nader: On iPad, put the recipe list in a sidebar next to the recipe. On iPhone, the list opens the recipe. How would you set that up?
- Nader: Oh, wait, one change. On the web, make it a wide layout with the steps in their own column, and use a tomato red accent.  *(interrupts Devin)*
- Nader: Can you speak a little faster?
- Nader: Put it in the product demo apps repo. Test it in your browser, then on the iPhone and iPad simulators, and send me a recording of each. Then open a PR.
- Nader: Perfect. Go ahead and start building.

### Call 2 (rejoined from inside the session, mid-build)

- Nader: Hey Devin, how's it going?
- Nader: Nice. Thanks, Devin!  *(interrupts Devin mid-sentence)*
