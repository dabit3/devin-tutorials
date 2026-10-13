# Meet Devin — silent conference overview

A 65.6-second product reel covering 12 capabilities. Designed for conference screens: large feature headlines, cropped real UI examples, light backgrounds and Devin branding. No narration, music, effects, or audio stream.

- `35-conference-overview.mp4`: 3840×2160, 60 fps, H.264.
- `35-conference-overview-1080p.mp4`: 1920×1080, 60 fps, H.264.
- `poster.png`: opening title card.

## Chapters

| Time | Capability | What the audience sees |
|---|---|---|
| 0:00 | Opening | Meet Devin · Your AI software engineer |
| 0:03 | DeepWiki + Ask | An answer grounded in repository code, alongside the cited source |
| 0:08.5 | Agent sessions | A repository-tagged task, followed by the resulting pull request |
| 0:14 | Computer Use testing | Devin’s browser exercising the card-starring feature |
| 0:20 | Test recordings | The replay and its check summary |
| 0:24.5 | Devin Review | A diff analysis and categorized findings |
| 0:29 | Slack | A real task addressed to @Devin and its thread reply |
| 0:33.5 | Automations | A scheduled automation with its run history |
| 0:38 | Skills | Reusable testing instructions in the skill editor |
| 0:42.5 | MCP + Plugins | An installed Context7 plugin with its MCP enabled |
| 0:47 | Managed Devins | A coordinator’s four managed sessions |
| 0:51.5 | Dynamic Workflows | Connected stages and agents in the live workflow panel |
| 0:56.5 | Multiplatform | A Windows desktop app and iPhone/iPad simulators on macOS |
| 1:02 | Closing | Build. Test. Review. Repeat. · app.devin.ai |

The sequence is a montage of separate real examples. It does not present them as one continuous session. The Review example comes from a tutorial with a deliberately planted bug. Mobile examples use iPhone and iPad simulators on macOS; the desktop app runs on a Windows VM. Windows availability is limited, as labeled in the video.

## Sources

`shots/SOURCES.json` maps every copied screenshot to its original tutorial and source revision. `prepare.mjs` reproduces the copies from the existing tutorial captures. The only image transformations are presentation crops, scaling, gentle movement and crossfades. Product text and results are not altered.

## Rebuild

Requires the existing kit’s Puppeteer dependency, Chrome and FFmpeg. No additional npm packages are needed.

```sh
node tutorials/35-conference-overview/prepare.mjs
node tutorials/35-conference-overview/render.mjs --count
bash tutorials/35-conference-overview/build.sh
```

The per-video renderer uses the unchanged kit’s HTML and `engine.js`, with a readiness gate for the scene images. The encoding path uses `-an` throughout; do not use the standard kit audio build for this video.

Sample selected 4K frames:

```sh
node tutorials/35-conference-overview/render.mjs --frames 100,290,630,1110,1380,1650,1920,2190,2460,2730,3000,3270,3550,3710,3890 --out qa
```

Verify there are no audio streams (both commands must print nothing):

```sh
ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 tutorials/35-conference-overview/35-conference-overview.mp4
ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 tutorials/35-conference-overview/35-conference-overview-1080p.mp4
```
