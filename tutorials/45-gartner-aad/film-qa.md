# Final film QA

Master: `45-gartner-aad-master.mp4` — **371.417000 seconds (6:11.417)**, 3840×2160, H.264 at 60 fps, 22,285 frames, AAC audio. File size: 102,291,386 bytes. There is one video stream and one audio stream; no subtitle stream. Both kit caption systems are disabled.

The supplied v3 script was copied byte-for-byte. Its 51 narration lines use fresh Nader one-take clips, voice `T8iHhGIWPm2GVYpQD1Am`. Only the specified beat IDs appear in the film: 76 cuts from 74 unique captured stills, plus 11 short section cards. Multi-beat holds are equal within each line. Camera zoom is fixed at one, travel is zero, and every cursor is inside its metadata highlight box.

## Visual review

All 51 encoded-master narration midpoint frames were extracted and viewed on the 13 detailed pages, `qa/contact-sheet-01.jpg` through `qa/contact-sheet-13.jpg`. `qa/contact-sheet.jpg` is the overview; `qa/samples.json` records exact timestamps, text, and beat IDs. The labels on the contact sheets are QA annotations, not film captions.

Five metadata targets were corrected, affecting six narration lines:

| Line | Beat | Correction |
|---|---|---|
| 20 | S3-03-cloud-docs | Highlight the submitted release-notes task, not the empty composer. |
| 21 | S4-01-codex | Highlight Codex's actual proxy implementation/test plan, not the empty composer. |
| 23, 51 | S3-mixed-complete | Highlight all five relevant pinned sessions, not just the Codex row. |
| 26 | S5-05-stop-verified | Highlight the stopped/awaiting-instructions status, not the empty composer. |
| 41 | S8-service-findings | Highlight all three bug counters, including zero needing attention, not only invalidated findings. |

The affected segments were re-rendered and the master rebuilt. All 51 midpoint samples were refreshed from that master. Pages 05, 06, 07, 11, and 13 were viewed again to verify the corrections. No remaining highlight, visible-email, or narration/screen correspondence problems were found in the reviewed samples. All 11 section cards were also viewed in `qa/contact-sheet-cards.jpg`; their sample times are in `qa/card-samples.json`.

The CLI recorder masks the filming account email. An independent OCR scan of all 74 unique film sources found zero remaining email matches (`email-masks.json`); the visual midpoint review found none either. Original live-product screenshots remain unchanged by the highlight fixes. Existing live UI focus outlines are preserved.

## Checks

`python3 -m unittest discover -s tutorials/45-gartner-aad -p test_assemble.py`:

```text
Ran 3 tests in 0.257s

OK
```

`python3 tutorials/45-gartner-aad/verify-film.py`:

```text
PASS: exact 51-line narration; 11 cards; 76 script-tagged cuts; equal per-line split holds
PASS: one-take Nader clips; parked on-target cursors; metadata highlights; no camera motion; both caption systems disabled
PASS: encoded master 3840x2160 60fps, 22285 frames, video+audio only; duration 371.417000s <= 540s
PASS: all 51 encoded-master midpoint samples exist; visual review must be recorded separately
```

The local build adapter passed `bash -n`. `spec.js` and `scenes.js` passed `node --check`. No active pre-commit hook or configured hooks directory exists in this checkout. Build directories, full-take VO caches, Python caches, and decoded per-line QA PNGs are ignored; per-line WAVs follow tutorial 44's committed-asset convention.

The VM's FFmpeg 4.4 does not support `-fps_mode cfr`; the tutorial-local adapter uses its equivalent `-vsync cfr` without changing shared kit files. Capture limitations and the unresolved demo authentication finding are documented in [production-final.md](production-final.md) and retained truthfully in the final script.
