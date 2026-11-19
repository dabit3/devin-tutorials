# Gartner CQA v11: human-looking screen recording

A real recording of the whole Chrome window (URL bar included) at 100% zoom, with the real OS cursor. It has no intro cards, highlights or zooms. The narration is the v10 voice-over, one WAV per script line.

1. Build the virtual 4K display: `swiftc -O -import-objc-header vd.h main.swift -o vd -framework CoreGraphics`, then `nohup ./vd &`. This gives a 1920x1080 pt (3840x2160 px) display at x=1600. In Swift, the private `applySettings:` is called `apply(_:)`.
2. Build the mouse/keyboard daemon: `swiftc -O mouse.swift -o mouse`. Every key event sets its flags explicitly, so Cmd never sticks.
3. Start Chrome on that display: `--user-data-dir=~/chrome-cdp --remote-debugging-port=9333 --window-position=1600,30 --window-size=1920,1050`. If `puppeteer.connect` hangs, quit Chrome and relaunch it.
4. Put per-line VO in `~/gartner/v11/vo/<line>.wav` and `durations.json`, built from the v10 clips.
5. Record each take with `node takes/sN.mjs`. It writes `raw/sN.mov` (HEVC, `-q:v 62`) and `sN.marks.json`, which marks line starts and page-load cuts.
6. Edit each take with `python3 edit.py sN`. It removes load waits and places each line's VO at its mark.
7. Build the final file. Concatenate the video, then re-encode it with `setpts=N/(60*TB)`, because the concat demuxer leaves about 0.2 s gaps at each join. Mux in PCM audio padded to each segment's frame count, and pad 1.8 s of tail at the end.

Takes and the lines they cover: s1 1-3, s2 4-6b, s3 7-12, s4 13-14 (trimmed), s4c 15 (web, then Devin Desktop), s5 16-20 (trimmed), s5b 21, s6 22-28, s7 29-38.
