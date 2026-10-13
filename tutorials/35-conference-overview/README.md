# Meet Devin — silent conference overview

A 101.5-second product reel covering 12 capabilities. Designed for conference screens: large feature headlines, flat white and light-gray surfaces, restrained blue highlights, animated focus rings and gentle zooms. Real UI state changes and a browser-test recording give the audience visible action, with longer holds for reading. No gradients, narration, music, sound effects, or audio stream.

- `35-conference-overview.mp4`: 3840×2160, 60 fps, H.264.
- `35-conference-overview-1080p.mp4`: 1920×1080, 60 fps, H.264.
- `poster.png`: opening title card.

## Chapters

| Time | Capability | What the audience sees |
|---|---|---|
| 0:00 | Opening | Meet Devin · Your AI software engineer |
| 0:03.5 | DeepWiki + Ask | An answer grounded in repository code, followed by the cited source |
| 0:10.5 | Agent sessions | A repository-tagged prompt progressing into the resulting pull request |
| 0:18.5 | Computer Use testing | Original browser footage: open an editor, duplicate a card, inspect copied fields |
| 0:30.5 | Test recordings | The real replay viewer, 11 passed / 0 failed, then a zoom into the assertions |
| 0:37.5 | Devin Review | A diff analysis, then a detailed finding linked to the code |
| 0:44.5 | Slack | A real task addressed to @Devin, followed by its thread reply |
| 0:51.5 | Automations | A schedule and instructions, each highlighted in turn |
| 0:58.5 | Skills | Testing instructions and the automatic-use option in the skill editor |
| 1:05.5 | MCP + Plugins | Context7 in the marketplace, then its installed plugin and enabled MCP |
| 1:12.5 | Managed Devins | A coordinator’s four managed sessions, highlighted in sequence |
| 1:20.5 | Dynamic Workflows | Connected stages and agents in the workflow panel, then the completed report |
| 1:29.5 | Multiplatform | A Windows desktop app, then iPhone/iPad simulators on macOS |
| 1:37.5 | Closing | Build. Test. Review. Repeat. · app.devin.ai |

The sequence is a montage of separate real examples. It does not present them as one continuous session. The Review example comes from a tutorial with a deliberately planted bug. Mobile examples use iPhone and iPad simulators on macOS; the desktop app runs on a Windows VM. Windows availability is limited, as labeled in the video.

## Sources

`shots/SOURCES.json` maps every copied screenshot to its original tutorial and source revision. It also identifies the downloaded original Computer Use recording and the fresh screenshot of its viewer. The testing chapter uses seconds 2–14 of that recording at its original speed, with a half-second initial hold during the chapter entrance. `prepare.mjs` reproduces the image copies and extracts the recording frames at 24 fps; the presentation renders at 60 fps. Crops, scaling, focus outlines, camera moves and transitions are presentation effects. Product text and results are not altered.

## Rebuild

Requires the existing kit’s Puppeteer dependency, Chrome and FFmpeg. No additional npm packages are needed.

```sh
node tutorials/35-conference-overview/prepare.mjs
node tutorials/35-conference-overview/render.mjs --count
bash tutorials/35-conference-overview/build.sh
```

The per-video renderer uses the unchanged kit’s HTML and initialization, then replaces its frame renderer with conference-local scenes, opening and closing cards. This bypasses the kit’s gradient background. A readiness gate waits for every source image, and each recording frame is decoded before capture. The encoding path uses `-an` throughout; do not use the standard kit audio build for this video.

Sample selected 4K frames:

```sh
node tutorials/35-conference-overview/render.mjs --frames 120,480,960,1530,2100,2490,2940,3420,3780,4200,4560,5040,5340,5610,6000 --out qa
```

Verify there are no audio streams (both commands must print nothing):

```sh
ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 tutorials/35-conference-overview/35-conference-overview.mp4
ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 tutorials/35-conference-overview/35-conference-overview-1080p.mp4
```
