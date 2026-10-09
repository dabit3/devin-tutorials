# Voice script: How Devin fits into your SDLC

Narrated by Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, default settings, one take cut locally with `_kit/tools/vo_onetake.py`).

Real workflow: Ask Devin plan → Devin session builds [thequantexplorer/orbit-demo#11](https://github.com/thequantexplorer/orbit-demo/pull/11) → Devin Review first pass → `/devin` comment in Devin Review → fix → browser test recording → human merge. Docs: https://docs.devin.ai/essential-guidelines/sdlc-integration

1. This is how Devin fits into the way your team already builds software.  <!-- 0000.png -->
2. Writing code is less than a fifth of an engineer's time. The rest goes to understanding code, planning, review, and testing.  <!-- 0001.png -->
3. Devin helps in every phase: planning, building, testing, review, and security.  <!-- 0002.png -->
4. It works inside your process. Its pull requests follow the same branch protections as anyone's, and a human reviews them before anything merges.  <!-- 0003.png -->
5. Let's follow one change to Orbit, a kanban app, all the way through. First, plan it in Ask mode.  <!-- 0006.png -->
6. Ask how to add a Clear done button to the Done column, and which files are involved.  <!-- 0011.png -->
7. Devin reads the repo and answers with a short plan.  <!-- 0023.png -->
8. Each step cites the exact files and lines, and the code shows up next to the answer.  <!-- 0024.png -->
9. Before building, turn on automatic reviews for the repo in Settings → Devin Review.  <!-- 0029.png -->
10. Now every new pull request on Orbit gets a first-pass review.  <!-- 0045.png -->
11. Back in Ask mode, hand the plan to a Devin session with one click.  <!-- 0046.png -->
12. Devin builds the feature on its own. Before it opens the PR, it runs lint and the build, which includes the type check.  <!-- 0050.png -->
13. Orbit has no test suite, so it also runs the flow in a browser and checks that it survives a reload.  <!-- 0051.png -->
14. Then it opens a pull request.  <!-- 0052.png -->
15. The pull request opens in Devin Review.  <!-- 0053.png -->
16. The description follows the repo's PR template, including exactly how it was tested.  <!-- 0106.png -->
17. Devin Review makes a first pass on its own. It found no vulnerabilities and two bugs.  <!-- 0058.png -->
18. One is that keyboard focus gets lost after you clear the column.  <!-- 0059.png -->
19. To fix it, comment right here in Devin Review. Start with /devin and say what to change.  <!-- 0060.png -->
20. Devin pushes a fix commit and replies with what it changed and how it checked it.  <!-- 0110.png -->
21. Devin Review runs again on the new commit and marks the focus bug resolved.  <!-- 0102.png -->
22. Then ask the same session to fix the other bug and test the flow in its browser.  <!-- 0141.png -->
23. Devin fixes it, then tests the fixed case and the full flow again.  <!-- 0171.png -->
24. It sends back a recording of the test, with eight checks passed.  <!-- 0172.png -->
25. Each check is listed next to the video.  <!-- 0176.png -->
26. Back in Devin Review, both findings are now resolved.  <!-- 0201.png -->
27. Merging is still your call.  <!-- 0202.png -->
28. So you merge it.  <!-- 0252.png -->
29. For security, Devin can scan your repos and fix what it finds, again as pull requests you review.  <!-- 0253.png -->
30. To get started, connect your repos here, then add tools like Jira, Linear, and Slack.  <!-- 0254.png -->
31. Devin works across the whole lifecycle, and you stay in control of what ships.  <!-- outro -->
