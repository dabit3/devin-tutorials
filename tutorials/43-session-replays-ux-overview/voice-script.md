# Voice script: Session replays to UX fixes (overview)

Narrated in Nader's voice (`T8iHhGIWPm2GVYpQD1Am`, `VO_NAME=nader`), one take via `_kit/tools/vo_onetake.py`.

| Beat | Caption | Narration |
|---|---|---|
| 0000.png | Conversion drops, and the chart can’t say why | A funnel chart can tell you where users drop off, but not why. Here, more than half of the checkouts that reach shipping never get to payment. |
| 0001.png | Funnel, drop-off step, replays, hypothesis, flagged PR | Devin can close that loop. It reads the funnel, finds the step that loses people, watches the replays from that step, forms a hypothesis, and ships a fix behind a flag. |
| 0002.png | Demo: a planted bug and 320 simulated sessions | In this demo, we planted a phone-field bug on purpose in a sample checkout, and simulated three hundred and twenty sessions, recorded with rrweb. |
| 0003.png | Metabase plugin, keys as secrets | Devin reaches Metabase through the marketplace plugin. |
| 0004.png | Devin watches a replay in its own browser | In its own browser, it watches a session stall on shipping, with five clicks on Continue. |
| 0005.png | Its hypothesis, backed by the numbers | Then it states its hypothesis: every session with a formatted phone number dropped at shipping. |
| 0006.png | The fix ships behind forgiving_shipping_form | It ships the fix behind a flag that's off by default, so you can roll it out gradually. |
| 0007.png | A real PR, tested in Devin’s browser | It opens a pull request and tests checkout in its browser. |
| 0008.png | Flag off: Continue does nothing visible | With the flag off, the formatted number still gets stuck. |
| 0009.png | Flag on: straight to Payment | With it on, the same number goes straight to payment. |
| 0010.png | Point Devin at your own funnel | Point Devin at your own funnel: signup drop-off, checkout errors, onboarding steps, or mobile-only bugs. |
| outro | Analytics in, a flagged fix out | Analytics in, a flagged fix out. |
