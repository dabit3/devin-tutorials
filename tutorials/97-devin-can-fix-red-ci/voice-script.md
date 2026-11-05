# Voice script: Devin can fix a red CI build on its own (overview)

Nader voice (`T8iHhGIWPm2GVYpQD1Am`, `eleven_multilingual_v2` from `_kit/settings.json`, default settings). The whole script is one ElevenLabs take (one request, no seed), cut locally into lines by `_kit/tools/vo.py`. Music: Nader's `2-upbeat.mp3`, ducked under the voice (`tools/make97.sh`).

Diagram beats are drawn by `scenes.js`; every other beat is a real capture from a fresh run in the thequantexplorer org (see `shots/SOURCES.json`). Docs: https://docs.devin.ai/product-guides/automations#github-triggers

1. Devin can fix a red CI build on its own.  <!-- 0005.png, diagram: title -->
2. Here's how it works. A push breaks a check on a pull request. A GitHub automation sees the failure and starts a Devin session. Devin reads the logs, fixes the cause, and pushes to the same branch, so the check runs again.  <!-- 0010.png, diagram: flow -->
3. This automation watches one repository, and fires when the checkout API tests check completes with a failure.  <!-- 0020.png, real UI -->
4. Its instructions are plain English: read the logs, fix the root cause, and push to the same branch.  <!-- 0021.png, real UI -->
5. Now a teammate opens a pull request that adds free shipping, and the check goes red.  <!-- 0030.png, real UI -->
6. Nobody prompts Devin. The automation fires on its own and starts a session.  <!-- 0031.png, real UI -->
7. Inside the session, Devin works the way an engineer would. It reads the failing job, reproduces it, makes the fix, and confirms the tests pass before it pushes.  <!-- 0040.png, diagram: session -->
8. Here, it pulls the branch and opens the failed job's log.  <!-- 0041.png, real UI -->
9. It runs the tests, changes one line, runs them again, and pushes the fix.  <!-- 0042.png, real UI -->
10. Then it explains the cause. The subtotal is in cents, but the free-shipping threshold was written in dollars.  <!-- 0043.png, real UI -->
11. Back on the pull request, the same check is now green.  <!-- 0050.png, real UI -->
12. You stay in control. Conditions decide which failures start a session, the fix lands as a normal commit on the same pull request, and your team still reviews and merges.  <!-- 0060.png, diagram: control -->
13. When a push breaks the build, Devin can read the failure, fix it, and get the check back to green on its own.  <!-- outro -->
