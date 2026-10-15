# Launch Scoreboard (overview): voice script

Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`), one-request full-script take via `_kit/tools/vo.py`. Spoken spellings (`voSay`) are noted where they differ from the subtitle text.

1. **0000.png** Every big launch starts an argument about who won it. This app answers it with posts from the first seventy-two hours on X, side by side.
2. **0001.png** Here's how it works. Grok samples posts from X through the xAI API, with X Search. Modal runs the functions, stores the results, and serves a live page.
   - Spoken as: Here's how it works. Grok samples posts from X through the ex A I API, with X Search. Modal runs the functions, stores the results, and serves a lyve page.
3. **0002.png** Inside Modal, a cron schedule calls refresh every six hours. Refresh uses map to analyze each launch in its own container, in parallel. Results land in a Modal Dict, and a web endpoint reads them.
4. **0003.png** The numbers are honest about what they are. Counts are sampled posts, Grok classifies each one, and every quote links back to X.
5. **0004.png** Devin built all of this from one short prompt in the product demo apps repo.
6. **0005.png** It deployed the app with modal deploy, then ran the first refresh.
7. **0006.png** Then it opened a pull request, with the code and a screenshot of the live page.
   - Spoken as: Then it opened a pull request, with the code and a screenshot of the lyve page.
8. **0007.png** Here's the real run. Claude Opus 5.5 netted plus fifty-eight from fifty sampled posts, and GPT-6 Sol came in at plus four.
   - Spoken as: Here's the real run. Claude Opus five point five netted plus fifty-eight from fifty sampled posts, and G P T six Sol came in at plus four.
9. **0008.png** Each column links the posts that shaped the conversation.
10. **0009.png** To extend it, add a launch with one new row, track a longer window, or chart sentiment over time. You could even post a daily recap.
11. **Outro** Who won the launch? Now you can check.
The UI shots are reused from tutorial 62's real run (see `shots/SOURCES.json`); the diagrams are drawn by `scenes.js`. Numbers come from the same refresh as tutorial 62 (2026-10-15 05:31–05:32 UTC).
