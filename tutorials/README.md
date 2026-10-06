# Devin tutorials

4K (3840×2160, 60 fps) tutorial videos built from real, signed-in captures of the Devin web app, the Devin CLI and Devin Desktop.

| # | Video | Folder |
|---|-------|--------|
| 1 | Ask Devin | `01-ask-devin/` |
| 2 | Your First Session | `02-first-session/` |
| 3 | Introducing Devin | `03-introducing-devin/` |
| 4 | Secrets & Site Cookies | `04-secrets-cookies/` |
| 5 | MCP Servers & Marketplace | `05-mcp-marketplace/` |
| 6 | DeepWiki | `06-deepwiki/` |
| 7 | Automating Tutorials with Devin | `07-automations/` |
| 8 | Testing Apps with Devin | `08-computer-use-testing/` |
| 9 | Devin Review | `09-devin-review/` |
| 10 | Devin CLI | `10-devin-cli/` |
| 11 | Devin Desktop | `11-devin-desktop/` |
| 12 | Devin in Slack | `12-devin-slack/` |
| 16 | Devin Automations: events | `16-automation-triggers/` |

Each folder contains the final MP4, a poster frame, the `capture.mjs` script that drove the live app, the captured `shots/` (with `beats.json` describing cursor targets, clicks, typing, and captions), and `spec.js`, which edits those beats into the final film (holds, camera moves, captions, speed badges).

## How it works

1. **Capture** (`_kit/capture/`): `capture.mjs` connects to a signed-in Chrome over CDP, drives the UI, and records a screenshot per beat. The account email is masked in the DOM before every screenshot (`MASK_TEXT=<email name>`).
2. **Render** (`_kit/src/`, `_kit/tools/render.mjs`): a deterministic Canvas engine composites the screenshots at 4K with the Devin title card, animated cursor, click ripples, camera zoom/pan, subtitles, and outro, rendered frame by frame in headless Chrome.
3. **Audio + encode** (`_kit/tools/audio.py`, `_kit/tools/build.sh`): synthesized music and UI sound effects are generated from the timeline and muxed with H.264 High / AAC.
4. **Narration** (optional, `_kit/tools/vo.py`): ElevenLabs reads the `vo` lines in `spec.js`; `VOICE=<id> VO_NAME=<name> bash _kit/tools/build.sh <folder>` paces the timeline to the voice, swaps captions for subtitles of the spoken words, ducks the music, and writes `<folder>-<name>.mp4`.

## Rebuild a video

```sh
cd tutorials/_kit/tools && npm install && cd ../..
python3 -m pip install --user numpy scipy
bash _kit/tools/build.sh 01-ask-devin
```

Re-capture (needs a signed-in Chrome with remote debugging on `127.0.0.1:9333`):

```sh
cd tutorials/01-ask-devin
MASK_TEXT=<email name> node capture.mjs
```

Native apps (macOS):

- **Devin CLI** (`10-devin-cli/`): `_kit/capture/term/termrec.mjs` runs the real `devin` command in a tmux session and renders the pane with xterm.js at 3× in Chrome, so terminal text stays sharp at 4K. `app.mjs` then captures the result in the Orbit app at `http://localhost:5173`. Needs `brew install tmux`, a signed-in `devin` CLI and Chrome CDP on `127.0.0.1:9333`.
- **Devin Desktop** (`11-devin-desktop/`): `_kit/capture/desktop.mjs` attaches to the Electron app over CDP. Launch it with `open -a /Applications/Devin.app --args --remote-debugging-port=9335`, sign in, and keep it frontmost while capturing (screenshots stall when the window is in the background).
- **Slack** (`12-devin-slack/`): the same recorder attaches to the Slack desktop app. Launch it with `open -a /Applications/Slack.app --args --remote-debugging-port=9336`, open a channel with Devin invited, and run `PHASE=1 node capture.mjs` (the `!ask` and session parts), then `PHASE=3 SESSION=<session url>` (web app, Chrome CDP) and `PHASE=4` (archive).

All credentials shown in the Secrets video are fake demo values.
