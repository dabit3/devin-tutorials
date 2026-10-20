# Voice script: How Devin fits into your SDLC

Narrated by Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, default settings, one take cut locally with `_kit/tools/vo_onetake.py`).

Real workflow: Ask Devin plan → Devin session builds [Orbit PR #11](https://github.com/thequantexplorer/orbit-demo/pull/11) → Devin Review first pass → `/devin` comment in Devin Review → fix → browser verification → human merge. The new sections show the real MCP marketplace and Automation template editor. Sentry, Datadog and Metabase are examples of available integrations, not connected services in this demo. The automation draft was discarded; nothing was enabled or run.

Sources: [SDLC](https://docs.devin.ai/essential-guidelines/sdlc-integration), [MCPs](https://docs.devin.ai/work-with-devin/mcp), [Automations](https://docs.devin.ai/product-guides/automations).

1. This is how Devin fits into the way your team already builds software.  <!-- 0000.png -->
2. Writing code is less than a fifth of an engineer's time. The rest goes to understanding code, planning, review, and testing.  <!-- 0001.png -->
3. Devin helps with planning, building, testing, review, and security. That covers every phase of the lifecycle.  <!-- 0002.png -->
4. It works inside your process. Its pull requests follow the same branch protections as anyone's, and a human reviews them before anything merges.  <!-- 0003.png -->
5. Two connections make this bigger than a coding assistant. MCPs give Devin tools and context, and automations decide when work starts.  <!-- 0285.png -->
6. Let's follow one change to Orbit, a kanban app, all the way through. First, plan it in Ask mode.  <!-- 0006.png -->
7. Ask how to add a Clear done button to the Done column, and which files are involved.  <!-- 0011.png -->
8. Devin reads the repo and answers with a short plan.  <!-- 0023.png -->
9. Each step cites the exact files and lines, and the code shows up next to the answer.  <!-- 0024.png -->
10. Before building, turn on automatic reviews for the repo in Settings → Devin Review.  <!-- 0029.png -->
11. Now every new pull request on Orbit gets a first-pass review.  <!-- 0045.png -->
12. Back in Ask mode, hand the plan to a Devin session with one click.  <!-- 0046.png -->
13. Devin builds the feature on its own. Before it opens the PR, it runs lint and the build, which includes the type check.  <!-- 0050.png -->
14. Orbit has no test suite, so it also runs the flow in a browser and checks that it survives a reload.  <!-- 0051.png -->
15. When every check passes, it opens a pull request.  <!-- 0052.png -->
16. The pull request opens in Devin Review.  <!-- 0053.png -->
17. The description follows the repo's PR template, including exactly how it was tested.  <!-- 0106.png -->
18. Devin Review makes a first pass on its own. It found no vulnerabilities and two bugs.  <!-- 0058.png -->
19. One is that keyboard focus gets lost after you clear the column.  <!-- 0059.png -->
20. To fix it, comment right here in Devin Review. Start with /devin and say what to change.  <!-- 0060.png -->
21. Devin pushes a fix commit and replies with what it changed and how it checked it.  <!-- 0110.png -->
22. Devin Review runs again on the new commit and marks the focus bug resolved.  <!-- 0102.png -->
23. Then ask the same session to fix the other bug and test the flow in its browser.  <!-- 0141.png -->
24. Devin fixes it, then tests the fixed case and the full flow again.  <!-- 0171.png -->
25. It sends back a recording of the test, with eight checks passed.  <!-- 0172.png -->
26. Each check is listed next to the video.  <!-- 0176.png -->
27. Back in Devin Review, both findings are now resolved.  <!-- 0201.png -->
28. Merging is still your call.  <!-- 0202.png -->
29. So you merge it.  <!-- 0252.png -->
30. For security, Devin can scan your repos and fix what it finds, again as pull requests you review.  <!-- 0253.png -->
31. To get started, connect your repos and team tools. Then connect runtime data through MCPs.  <!-- 0254.png -->
32. MCP stands for Model Context Protocol. It lets a Devin session use tools and data from services you authorize.  <!-- 0286.png -->
33. Open Customize, then MCPs, to choose your connections.  <!-- 0255.png -->
34. Browse the plugin marketplace to find the tools your team already uses.  <!-- 0257.png -->
35. With Sentry connected, Devin can inspect errors and stack traces before tracing a failure back to code.  <!-- 0263.png -->
36. Datadog adds logs, metrics, and traces, so an investigation can start from production evidence, not guesswork.  <!-- 0267.png -->
37. Metabase connects analytics data and dashboards, useful for investigating changes in product or business metrics.  <!-- 0271.png -->
38. These are available integrations, not connections in this account. Install the plugin, then authorize its MCP with only the access it needs.  <!-- 0289.png -->
39. Automations handle the other half: when to start. A schedule or event can trigger a session, with optional conditions and checks before it runs.  <!-- 0287.png -->
40. Open Automations to see ready-made workflows for recurring work and incoming events.  <!-- 0272.png -->
41. For example, Fix Sentry Errors Daily is a scheduled error sweep that can investigate issues and open fix pull requests.  <!-- 0273.png -->
42. Investigate Alerts Triggered uses an alert in Slack and Datadog context to produce a root-cause analysis.  <!-- 0274.png -->
43. The Fix CI Failures template shows how this is wired. Choose a repository; the trigger matches a completed check run whose conclusion is failure.  <!-- 0279.png -->
44. The action starts a session. Its instructions tell Devin to read the logs, fix the cause, and run the tests again.  <!-- 0280.png -->
45. Choose which MCP connections that automation can use. The monitoring templates need the relevant services connected first.  <!-- 0281.png -->
46. Set spend and rate limits before enabling it. This is a preview only; nothing is being created or turned on.  <!-- 0282.png -->
47. Now the loop is connected: a signal starts work, MCPs provide context, and Devin investigates and tests. Any proposed fix still goes through your pull requests and human review.  <!-- 0288.png -->
48. From planning to production feedback, Devin works across the lifecycle. You stay in control of what ships.  <!-- outro -->
