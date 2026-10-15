# Launch Scoreboard (in-depth): voice script

Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`), one-request full-script take via `_kit/tools/vo.py`. Spoken spellings (`voSay`) are noted where they differ from the subtitle text.

1. **0000.png** Every big launch starts an argument about who won it. In this tutorial, Devin builds a scoreboard that compares launches side by side, using real posts from X, and deploys it to Modal.
2. **0001.png** So where does Modal fit? It runs the whole back end. A cron schedule refreshes the data every six hours, and map runs one Grok call per launch in parallel. Results go into a Modal Dict, and the xAI key lives in a Modal Secret. A web endpoint serves the public page.
   - Spoken as: So where does Modal fit? It runs the whole back end. A kron schedule refreshes the data every six hours, and map runs one Grok call per launch in parallel. Results go into a Modal Dict, and the ex A I key lives in a Modal Secret. A web endpoint serves the public page.
3. **0004.png** Why not a laptop script or your own server? A script stops when the laptop sleeps, and a server sits idle between refreshes. Modal scales to zero between runs and bills by the second.
4. **0007.png** I pick the product demo apps repo and describe the app in plain language. The Modal and xAI keys are already saved as org secrets.
   - Spoken as: I pick the product demo apps repo and describe the app in plain language. The Modal and ex A I keys are already saved as org secrets.
5. **0012.png** Devin replies with a short plan, then starts building.
6. **0119.png** It deploys with modal deploy, and the page answers on its public modal.run URL.
   - Spoken as: It deploys with modal deploy, and the page answers on its public modal dot run URL.
7. **0168.png** When it's done, Devin opens a pull request in the demo apps repo.
8. **0180.png** It opens the public URL in a browser to test the page.
9. **0207.png** Devin Review flagged four issues on the pull request.
10. **0413.png** Its summary says it fixed all four and redeployed. It's also upfront that Grok skipped X Search on the first try and made up posts, so the app now keeps only posts the search returns.
11. **0461.png** Here's the page running on Modal. In this run, Claude Opus 5.5 netted plus fifty-eight from fifty sampled posts. GPT-6 Sol landed at plus four, and Gemini 4 Argon at plus twenty-two.
   - Spoken as: Here's the page running on Modal. In this run, Claude Opus five point five netted plus fifty-eight from fifty sampled posts. G P T six, Sole, landed at plus four, and Gemini four Argon at plus twenty-two.
12. **0462.png** Counts are sampled posts, not total volume, and Grok classifies each post's sentiment.
13. **0463.png** Each column shows the top praise for that launch.
14. **0464.png** Then the top complaints.
15. **0465.png** And the posts that shaped the conversation link straight back to X.
16. **Outro** Who won the launch? Now there's data.

All numbers come from one refresh of the deployed app (refreshed 2026-10-15 05:31–05:32 UTC): Claude Opus 5.5, 50 sampled posts, net +58; GPT-6 Sol, 55, +4; Gemini 4 Argon, 54, +22. Counts are posts returned by Grok's X Search and classified by Grok, not total post volume. The Modal pieces named in the narration (a `modal.Cron` schedule, `.map()` fan-out, `modal.Dict`, a Modal Secret for the xAI key, `@modal.asgi_app` web endpoint) are the ones in the app's `app.py`; the two Modal scenes are drawn by `scenes.js`. The Devin session ran in `thequantexplorer/product-demo-apps` (PR #73).
