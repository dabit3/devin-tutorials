# Overview 53: Explore design options in parallel (voice script)

Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, `VO_NAME=nader`, default voice settings). Generated as one whole-script take with `python3 _kit/tools/vo.py 53-five-designs-overview T8iHhGIWPm2GVYpQD1Am`, cut locally at sentence boundaries, and every line passed the STT check.

Diagram-led overview. Proof shots are reused from tutorial 52 (see `shots/SOURCES.json`). Real run: https://app.devin.ai/sessions/69d5d42c3aa64dfba240a070f7485741 (thequantexplorer org, repo thequantexplorer/orbit-demo). One Dynamic Workflow, `orbit-board-five-directions`: five design agents in parallel (calm minimal, dense power-user, bold high-contrast, playful, dark editorial), each with a PR (#49 to #53), a live preview at https://thequantexplorer.github.io/orbit-demo/<direction>/ and a recorded walkthrough of that preview; then one audit agent ran axe and Lighthouse on all five live URLs. All five tied at a composite of 97.85 (Lighthouse 100/99/100/100), so the report leaves the pick to a team vote. No Slack is shown or claimed. The demo PRs were closed unmerged and their branches deleted after recording.

| Beat | Caption | Narration |
|---|---|---|
| 0000.png | Five Devins, five directions, one screen | Let Devin explore design options for a screen in parallel. Five Devins each build a different direction and publish a live preview. Each one also records a walkthrough. |
| 0001.png | Working builds, videos and scores, not mockups | Your team gets to compare working builds, walkthrough videos and real scores. Nobody has to argue over mockups. |
| 0002.png | Five agents in parallel, an audit, then a vote | One prompt starts a workflow. Five design agents run in parallel. Then an audit agent scores every preview and hands the team a shortlist to vote on. |
| 0003.png | The example: Orbit's board screen | In our example, the screen is the board in our Orbit demo app. The previews go to GitHub Pages. |
| 0007.png | One prompt names all five directions | The whole run starts from one prompt that names the five directions. |
| 0008.png | Five design agents running | The workflow panel tracks the five design agents as they work. |
| 0009.png | One session and one PR per direction | Each one finishes with its own pull request. |
| 0010.png | Live preview: calm-minimal | Every direction gets a live preview, from calm and minimal to dark and editorial. |
| 0012.png | A walkthrough recorded on each preview | Each agent also records a walkthrough of its preview. It shows that the board still works. |
| 0006.png | axe and Lighthouse check every preview | Then axe and Lighthouse check every preview. Anything inaccessible or slow is out before anyone weighs in. |
| 0013.png | This run: all five tie at 97.85 | In this run, all five passed with the same scores. So, the whole shortlist went to the team to pick on taste. |
| 0004.png | Real design choices: yes. Fixed specs: skip | Use it when a screen has real design choices and you want options in front of people. Skip it for fixed specs or tiny tweaks. |
| 0005.png | Onboarding, pricing, settings, empty states, dashboards | It works for other screens too, like onboarding, pricing pages, settings and dashboards. Anywhere taste matters, your team gets real options. |
| outro | Five real options, scored, then your team decides | Five real options, scored, then your team decides. |
