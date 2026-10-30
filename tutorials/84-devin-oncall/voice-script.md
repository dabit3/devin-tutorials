# Devin Oncall: set up a responder and watch it handle a real alert

Narration for both cuts (Nader `T8iHhGIWPm2GVYpQD1Am`, Harper `c1uwEpPUcC16tq1udqxk`), generated with ElevenLabs `eleven_multilingual_v2` through `_kit/tools/vo.py`. Each line is keyed to the captured frame it plays over.

- `0000.png` — *Oncall in thequantexplorer*: Devin Oncall investigates your alerts, finds the root cause, and opens the fix. Let's set it up from scratch, then watch it handle a real alert.
- `0001.png` — *Set up*: On the Oncall page, click Set up.
- `0003.png` — *Connect tools*: First, connect your telemetry tools, like Datadog, Sentry, or Grafana. Devin learns your systems from them and writes skills that every Oncall session uses.
- `0004.png` — *Keep learned skills up to date*: It can keep those skills up to date, here every month.
- `0005.png` — *Set up without tools*: Our demo service posts its errors straight to Slack, so we'll choose Set up without tools.
- `0007.png` — *Sped up: Devin learns your systems*: Now Devin learns your systems. That usually takes one to two hours.
- `0008.png` — *Ready to go oncall*: When it's done, Create responder unlocks.
- `0011.png` — *A responder watches one source*: A responder watches one source, and investigates whatever arrives there.
- `0012.png` — *Name it*: Give it a name.
- `0022.png` — *Add trigger*: Then add a trigger.
- `0025.png` — *Slack*: Choose Slack. It fires on a message, in a channel, equal to checkout alerts.
- `0033.png` — *Select channel*: That's the channel our monitor posts to.
- `0037.png` — *Alerts, or Support + Bugs*: Pick the responder type. Alerts focuses on impact and a fast mitigation. Support and Bugs focuses on reproducing the problem and fixing it in code.
- `0038.png` — *Create responder*: Create it, and the responder is active.
- `0041.png` — *A bug we planted for this demo*: Now for a real alert. We planted a bug in this checkout API for the demo. Promo percentages were changed to whole numbers, but the pricing code still treats them as fractions.
- `0042.png` — *Sped up*: A monitor posts here when checkout errors spike.
- `0101.png` — *5xx error rate 31%*: Thirty-one percent of checkout requests are failing with a server error.
- `0102.png` — *Devin replies in the thread*: Within minutes, Devin replies in the thread.
- `0104.png` — *Root cause: commit a32c8fe*: It names the commit that caused it, explains how a ten percent coupon became a thousand percent discount, and attaches a full write-up.
- `0124.png` — *Ask for the fix in the thread*: It offers to revert, or to open a fix. We reply in the thread and ask for the fix, with tests.
- `0205.png` — *Fix PR opened, tests pass 6/6*: A minute later, it opens a pull request. The new tests fail on the old code, and all six pass with the fix.
- `0206.png` — *One issue, every occurrence grouped*: Back in Oncall, the responder tracks this as one issue, with every occurrence grouped under it.
- `0209.png` — *Summary, findings, priority*: The issue holds the summary, the findings, the priority, and each investigation.
- `0210.png` — *The fix PR*: Here's the fix. Discount now divides by one hundred, and the pull request adds promo tests.
- `0212.png` — *Overview, Alerts & Bugs, Incidents, Reports*: The Oncall page tracks all of this, across Alerts and Bugs, Incidents, and Reports.
- `0224.png` — *A recurring report, on your schedule*: Reports send a recurring summary of your oncall, on the schedule you choose.
- `0231.png` — *Enable incidents*: For bigger outages, turn on Incidents.
- `0249.png` — *Slack channel prefix*: Devin joins Slack channels that start with a prefix, like incident dash.
- `0258.png` — *Devin joins and posts a likely root cause*: Open an incident channel, and Devin joins on its own, posts a likely root cause, and keeps investigating.
- `0259.png` — *Mitigation: merge PR #100*: Here it found the open fix and recommended merging it as the mitigation.
- `0264.png` — *A live incident report*: It also keeps a live incident report up to date, with the root cause and a timeline.

- Outro: Set up Oncall once, and Devin investigates each alert, finds the root cause, and opens the fix for your team to review.
