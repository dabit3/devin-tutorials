# What Devin can build and test — conference reel

A **10:45 silent 4K reel** walking through eleven Devin demo sessions, each filmed in **Google Chrome on a real Mac** (macOS, light mode, 3840×2160 HiDPI). Every section shows the session's prompt and conversation, Devin's Computer tab, Devin's own test recording with its chapters, and the artifacts, reports and PRs the session produced. A light title names each section; a small "Devin's test recording" tag marks the test-viewer footage.

- 4K master: 3840×2160, 30fps, H.264/yuv420p, no audio, 19,362 frames. Too large for git (177 MB); delivered as an attachment and rebuilt with `build.mjs`.
- 1080p preview: `121-conference-reel-1080p.mp4` (same cut, H.264, no audio).

## Chapters

| Start | Section | Source session |
|---|---|---|
| 0:00.0 | Opening card: "What Devin can build and test" | — |
| 0:05.0 | Devin building and testing a native iOS app | [Pocket Garden, SwiftUI on the iPhone 17 Simulator](https://app.devin.ai/sessions/94af5bbe2ed44d4ea6173dc16ed4e4b0) |
| 1:21.4 | Devin designing and testing three landing pages | [Brewbot](https://app.devin.ai/sessions/98cd6a6bd6e4454a995db090f040f7ea) |
| 2:18.6 | Devin running exploratory QA on a Kanban app | [Kanban QA](https://app.devin.ai/sessions/14a4911218f8420e8eafc47499c26fd4) |
| 3:18.1 | Devin building and testing a 3D solar system | [Solar system](https://app.devin.ai/sessions/e96d80bff2784ba8a0de8c3f924e52c0) |
| 4:18.2 | Devin building and testing three Expo mobile apps | [Expo apps](https://app.devin.ai/sessions/7c5183a0e26b441787f99398e171661a) |
| 5:14.3 | Devin building and playtesting a Breakout game | [Neon Breakout](https://app.devin.ai/sessions/08ef127b08f34d86ac8702d4e4be8911) |
| 6:01.4 | Devin shipping a feature PR and testing it | [Orbit confetti](https://app.devin.ai/sessions/9db820c01c5b4b5a89756a9d37df7e5a) |
| 6:53.5 | Devin mapping a codebase's architecture | [Architecture map](https://app.devin.ai/sessions/d264786ed6f54788961825610b297419) |
| 7:39.5 | Devin building and testing an earthquake globe | [Earthquake globe](https://app.devin.ai/sessions/5a7f1059e4a94280b0e91bc3930bdc2a) |
| 8:39.6 | Devin and three child sessions building an arcade | [Devin Arcade](https://app.devin.ai/sessions/d59e1646c02a442bb237e78c806578b2) |
| 9:40.3 | Devin building and testing a drum machine | [Drum machine](https://app.devin.ai/sessions/3e1edf3ef407495fb8fe0c65c628109c) |
| 10:40.4 | Closing card: devin.ai | — |

## How it is cut

Each section follows the same arc: prompt (1×), conversation and Computer-tab replay (2–3× to compress scrolling), Devin's test-recording viewer (1×, zoomed to the viewer so chapters and pass counts read on a big screen), then the artifact, report or PR (1–1.5×). Sections crossfade internally and dip to white between sections. The architecture-map session has no test recording; its section shows the HTML artifact instead.

## Footage and limits

All footage is a real capture of the Devin web app in Chrome on macOS, recorded by a macOS Devin session for this reel; nothing is recreated or framed. The 10 web demos themselves ran on Devin's Linux computer and the native iOS session ran on a macOS computer; the reel shows each one's real Computer tab. See [footage-manifest.md](footage-manifest.md) for per-clip timestamps.

- The Devin Arcade capture dropped about 6% of frames and missed the Memory Match click, so that section shows Snake and Typing Racer.
- Neon Breakout and Earthquake Globe were re-filmed after their first takes showed blank artifact panels.

## Rebuild

```bash
python3 plan.py                     # timings -> sections.json
CHROME=google-chrome node titles.mjs  # title PNGs (Inter, 3840x2160)
REEL_SRC=/path/to/mac/clips node build.mjs   # sections, cards, concat -> 121-conference-reel.mp4
```

`ONLY=1,2` renders selected sections; `ONLY=0 CONCAT=1` only re-concatenates. Requires ffmpeg and the raw clips named as in `footage-manifest.md`.
