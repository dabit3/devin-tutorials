# Human recut recording and render drivers

Production archive for the native 3840×2160, 30 fps Assisted Application Development re-film. These are stateful, session-specific recording drivers, not an unattended tutorial generator. Historical unsuccessful drivers are retained for provenance; do not run all scripts in sequence. In particular, live steering drivers were superseded by the `history-*` cursor/scroll-only recordings.

## Environment and dependencies

- Existing signed-in Desktop on CDP 9335, Chrome on 9333, Konsole, X11 display :0, KWin and a 4K display with matching 2× native UI scaling.
- Node.js, `xdotool`, `wmctrl`, FFmpeg/ffprobe; Python with NumPy, Pillow and SciPy (the last is used by the heuristic cursor audit).
- The original production paths remain `/home/ubuntu/work/aad-human` for takes, inventories, QA and render intermediates, and `/home/ubuntu/repos/devin-tutorials/tutorials/45-gartner-aad` for tutorial/VO inputs. Raw takes and QA images are deliberately not committed. Restore those external assets to reproduce the render. Scripts can contain original session IDs/window IDs/PIDs and must be preflighted against actual current state before use.
- `Capture` is the final guarded one-thread recorder; `Rig.start` is the earlier base recorder retained for provenance. `section-health.mjs` checks five GiB combined RAM/swap reserve and records process RSS; capture aborts below two GiB combined reserve. Native cursor motion is implemented by `human-input.mjs` and `direct-page.mjs`.

## Final master workflow

1. Review `final-accepted-inventory.json` and `final-source-table.md` in the external production directory. They, not all archived drivers, define accepted source windows. The final repairs use `master-konsole-retakes.mjs` (`stats` mode with Ctrl+L) and `master-mcps-retake.mjs`; line 28 starts four source frames later.
2. `python render-master.py` builds the frame-quantized timeline, original ordered narration (including the replacement line 27), real outgoing handles, normalized VO-only mix and H.264 slow/CRF16 master. `--prepare-only` writes plans/audio without encoding.
3. `python qa-master.py` probes streams, detects black/holds, extracts final line/cut frames and a contact sheet. Its status intentionally requires separate human review; the program never claims visual approval.
4. `python final-clause-qa.py`, `python freeze-review.py`, `python verify-source-holds.py` and optionally `python cursor-cut-audit.py` generate additional evidence. The cursor matcher frequently selects UI icons instead of the pointer; its flags are not a visual verdict. Human inspection remains mandatory.
5. `node --test *.test.mjs` runs the focused recorder/input/gating health tests without starting recordings.

The final review accepted the native gray CLI session label. The OpenCode-name hover lasts 43 frames (1.433 seconds) after trimming. All 49 detected holds were source-matched and reviewed as settled readable content; the agent chooser is intentional UI, not a blank loading pane. Line 51 uses line-local chunk times added to its final timeline start (336.600 seconds), not the obsolete full-take narration offsets. There is no new cloud task, transfer, commit or merge performed for the historical evidence footage.
