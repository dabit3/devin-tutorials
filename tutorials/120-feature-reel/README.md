# 120 · Devin feature reel (silent)

A 10:01 reel of 21 Devin product features. Each segment is real UI footage from an earlier tutorial, re-rendered from that tutorial's raw `shots/` and `spec.js`. Because the source is the raw shots, no subtitles are burned in.

- No audio stream: no narration, music or sound effects.
- No captions, cursor labels or badges. The only on-screen text is the feature title above the UI card, plus the Devin lockup at the start and end.
- Files: `120-feature-reel.mp4` (3840×2160, 60 fps, H.264) and `120-feature-reel-1080p.mp4` (1920×1080 preview).

## Segments

| Time | Title | Source folder |
|---|---|---|
| 0:02.5 | Ask Devin | `01-ask-devin/` |
| 0:32.0 | DeepWiki | `06-deepwiki/` |
| 0:57.0 | Computer Use Testing | `08-computer-use-testing/` |
| 1:22.5 | Devin Review | `09-devin-review/` |
| 1:54.4 | Managed Devins | `19-managed-devins/` |
| 2:22.8 | Dynamic Workflows | `33-dynamic-workflows/` |
| 2:50.6 | Devin CLI | `76-cli-whats-new-overview/` |
| 3:16.6 | Devin Desktop | `118-devin-desktop-cloud/` |
| 3:47.7 | Devin in Slack | `12-devin-slack/` |
| 4:14.3 | Devin Voice | `21-devin-voice/` |
| 4:43.3 | Playbooks | `15-devin-playbooks/` |
| 5:09.3 | Memory | `13-devin-memory/` |
| 5:39.6 | Plugins | `50-team-plugin/` |
| 6:12.1 | MCP Marketplace | `05-mcp-marketplace/` |
| 6:43.3 | Secrets | `04-secrets-cookies/` |
| 7:10.2 | Automations | `16-automation-triggers/` |
| 7:41.6 | Code Scans | `14-devin-code-scans/` |
| 8:09.6 | Security Swarm | `17-security-swarm/` |
| 8:38.5 | iPhone and iPad on macOS | `18-ios-ipad-mac-vms/` |
| 9:09.3 | Linux, macOS and Windows | `56-quickstart-three-os/` |
| 9:36.4 | GPU Outposts | `42-gpu-outpost-profiling/` |

Folders 42, 50 and 56 are not on `main` yet. They come from PRs #131, #128 and #129.

## Files

- `segments.json`: the title of each feature and its source spans (`[folder, start s, end s]` on that tutorial's own timeline).
- `reel.js`: the frame layout. It draws the source UI on a light rounded card and adds the title. It plugs into the kit through `SPEC.frame` in `_kit/src/engine.js`. When `SPEC.frame` is set, the kit skips its normal captions, subtitles, cursor, badges and cards.
- `tools/render.mjs`: renders each span in headless Chrome, dissolves between spans, and encodes each part with `-an`. Then it joins the parts into the 4K master and makes the 1080p preview.
- `tools/timeline.mjs`: prints a source tutorial's beats and frame times. Use it to choose spans.

## Rebuild

```sh
ln -s ../../_kit/tools/node_modules tools/node_modules   # once (puppeteer-core from the kit)
# folders 42, 50 and 56 must exist under tutorials/ (check out their PR branches)
CHROME=/path/to/chrome CRF=26 node tools/render.mjs        # all parts -> both MP4s
node tools/render.mjs --check --parts p05                 # stills for one part in build/check/
ffprobe -v error -select_streams a -show_entries stream=index 120-feature-reel.mp4   # prints nothing: no audio
```

Intermediate frames and parts go to `build/`. Git ignores that folder.
