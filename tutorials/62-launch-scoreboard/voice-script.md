# Launch Scoreboard (in-depth): voice script

Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`), one-request full-script take via `_kit/tools/vo.py`. Spoken spellings (`voSay`) are noted where they differ from the subtitle text.

1. **0000.png** Every big launch starts an argument about who won it. In this tutorial, Devin builds a live scoreboard that compares launches side by side, using real posts from X, and deploys it to Modal.
   - Spoken as: Every big launch starts an argument about who won it. In this tutorial, Devin builds a lyve scoreboard that compares launches side by side, using real posts from X, and deploys it to Modal.
2. **0007.png** I pick the product demo apps repo and describe the app in plain language. Grok samples posts from each launch's first seventy-two hours with X Search, and Modal refreshes the results every six hours.
3. **0012.png** Devin plans the build, then tests the xAI key with a real X Search call before it writes any code.
   - Spoken as: Devin plans the build, then tests the ex A I key with a real X Search call before it writes any code.
4. **0047.png** Next it writes the Modal app, with one module for the Grok call and one for the page.
5. **0119.png** Then it deploys with modal deploy and runs the first refresh on Modal.
6. **0168.png** When it's done, Devin opens a pull request in the demo apps repo.
7. **0456.png** Here's that pull request in Devin, with the code on the right.
8. **0457.png** The analyzer calls the xAI Responses API with the X Search tool, limited to each launch's first seventy-two hours.
   - Spoken as: The analyzer calls the ex A I Responses API with the X Search tool, limited to each launch's first seventy-two hours.
9. **0458.png** A Modal cron schedule runs refresh every six hours.
10. **0459.png** Refresh uses map to analyze every launch in its own container, in parallel.
11. **0460.png** And a web endpoint serves the page from the results that refresh saved in a Modal Dict.
12. **0180.png** Devin then opens the live URL in a browser, checks the posts and their links, and records the test.
   - Spoken as: Devin then opens the lyve URL in a browser, checks the posts and their links, and records the test.
13. **0207.png** Devin Review flagged four issues on the pull request.
14. **0346.png** Devin fixes them, reruns the tests and redeploys.
15. **0413.png** Its summary is upfront. On the first try, Grok skipped X Search and made up posts, so now the app keeps only posts the search returns.
16. **0461.png** Here's the live app on Modal. In this run, Claude Opus 5.5 netted plus fifty-eight from fifty sampled posts. GPT-6 Sol landed at plus four, and Gemini 4 Argon at plus twenty-two.
   - Spoken as: Here's the lyve app on Modal. In this run, Claude Opus five point five netted plus fifty-eight from fifty sampled posts. G P T six Sol landed at plus four, and Gemini four Argon at plus twenty-two.
17. **0462.png** Counts are sampled posts, not total volume, and Grok classifies each post's sentiment.
18. **0463.png** Each column shows the top praise for that launch.
19. **0464.png** Then the top complaints.
20. **0465.png** And the posts that shaped the conversation link straight back to X.
21. **Outro** Who won the launch? Now there's data.
All numbers come from one refresh of the deployed app (refreshed 2026-10-15 05:31–05:32 UTC): Claude Opus 5.5, 50 sampled posts, net +58; GPT-6 Sol, 55, +4; Gemini 4 Argon, 54, +22. Counts are posts returned by Grok's X Search and classified by Grok, not total post volume. The Devin session ran in `thequantexplorer/product-demo-apps` (PR #73).
