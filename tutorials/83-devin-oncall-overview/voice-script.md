# Devin Oncall: overview

Narration for both cuts (Nader `T8iHhGIWPm2GVYpQD1Am`, Harper `c1uwEpPUcC16tq1udqxk`), generated with ElevenLabs `eleven_v4` through `_kit/tools/vo.py`. Each line is keyed to the shot it plays over: **[REAL]** is a real capture from the tutorial run in `84-devin-oncall`, **[DIAGRAM]** is an animated diagram from `scenes.js`. The blog's statistics are left out on purpose.

- `0001.png` [REAL] 0101.png: An alert fires. Checkout errors jump to thirty-one percent.
- `0002.png` [REAL] 0104.png: Minutes later, Devin replies in the alert thread with the root cause: one commit that broke promo-code pricing.
- `0003.png` [REAL] 0205.png: Then it opens the fix, with tests, for the team to review.
- `0010.png` [DIAGRAM]: This is Devin Oncall. It investigates and fixes your alerts, bug reports, and incidents. It has three parts. Responders handle alerts and bug reports as they arrive. Incidents puts Devin in your incident channel to help drive the fix. And Reports give you a recurring summary of your oncall.
- `0011.png` [REAL] 0212.png: All three live on the Oncall page.
- `0020.png` [REAL] 0003.png: Setup happens once per organization. You connect telemetry like Datadog, Sentry, or Grafana, and Devin learns your systems. It writes skills that every Oncall session uses, and keeps them up to date.
- `0030.png` [DIAGRAM]: A responder watches one source: a Slack or Microsoft Teams channel, or PagerDuty incidents. A parent Devin reads each new alert and decides whether it's a new issue. If it is, a child Devin starts a fresh investigation. If not, the alert is grouped with the known issue, so a repeating alert is investigated once.
- `0031.png` [REAL] 0040.png: Here's a responder watching a Slack alerts channel.
- `0032.png` [REAL] 0209.png: It tracks the problem as one issue, with the summary, findings, and every occurrence.
- `0040.png` [DIAGRAM]: There are two responder types. Alerts focuses on impact, severity, and a fast mitigation. Support and Bugs focuses on reproducing the problem and fixing it in code.
- `0042.png` [REAL] 0211.png: Devin uses your telemetry, code, and deployments to find the cause. When the fix belongs in code, it opens a pull request.
- `0050.png` [DIAGRAM]: A second review agent checks Devin's reasoning as it works. It catches mistakes, like blaming a recent deploy before the evidence shows it.
- `0060.png` [DIAGRAM]: Oncall also gets better over time. Each responder has its own memory, your organization gets generated skills, and every investigation is saved for future ones to search.
- `0070.png` [REAL] 0258.png: For bigger outages, Incidents works with teams that open a Slack channel per incident. Devin joins the channel, posts a likely root cause, and recommends a mitigation.
- `0071.png` [REAL] 0264.png: And it keeps an incident report up to date while the team works.
- `0072.png` [REAL] 0224.png: Reports run on the schedule you choose. They cover incidents, alerts, issues, and fixes shipped, with Devin's insights on what's driving them.

- Outro: Devin Oncall investigates the alert, finds the root cause, and opens the fix, so your engineers review the result instead of starting from scratch.

Reports: the shot is the real Create report form, unconfigured. No report was created for this video.
