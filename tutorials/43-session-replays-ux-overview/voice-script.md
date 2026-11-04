# Voice script: Session replays to UX fixes: how it works

Narrated in Nader's voice (`T8iHhGIWPm2GVYpQD1Am`, `VO_NAME=nader`, `eleven_multilingual_v2`), one take via `_kit/tools/vo.py`, split into lines at sentence boundaries.
The narrated cut (`43-session-replays-ux-overview-nader.mp4`) has no captions. Nader's upbeat track plays under the voice and ducks under speech; it is mixed with `42-session-replays-ux/tools/music_mix.py` (no kit music, no UI sounds).

| Beat | Caption (captioned cut) | Narration |
|---|---|---|
| 0000.png | Conversion drops, and the chart can’t say why | In this video, Devin finds out why users leave a checkout flow. The funnel shows where they leave. More than half of the checkouts that reach shipping never get to payment. |
| 0001.png | Funnel, drop-off step, replays, hypothesis, flagged PR | Devin reads the funnel and finds the step that loses people. It watches the replays from that step and forms a hypothesis. Then it ships a fix behind a flag. |
| 0002.png | Demo: a planted bug and 320 simulated sessions | For this demo, we planted a phone-field bug in a sample checkout on purpose. We also simulated three hundred and twenty sessions and recorded them with rrweb. |
| 0003.png | Metabase plugin, keys as secrets | Devin connects to Metabase through the marketplace plugin. |
| 0004.png | Devin watches a replay in its own browser | In its browser, it watches a session get stuck on shipping. The user clicks Continue five times. |
| 0005.png | Its hypothesis, backed by the numbers | Then it states its hypothesis. Every session with a formatted phone number dropped at shipping. |
| 0006.png | The fix ships behind forgiving_shipping_form | It ships the fix behind a flag that is off by default. You turn it on when you are ready. |
| 0007.png | A PR, tested in Devin’s browser | It opens a pull request and tests checkout in its browser. |
| 0008.png | Flag off: Continue does nothing visible | With the flag off, the formatted number still gets stuck. |
| 0009.png | Flag on: the same number reaches Payment | With the flag on, the same number goes to payment. |
| 0010.png | Point Devin at your own funnel | Signup drop-off, checkout errors, and mobile-only bugs work the same way. Point Devin at your own funnel to try it. |
| outro | From funnel drop-off to a flagged fix | That's how Devin turns a funnel drop-off into a flagged fix. |
