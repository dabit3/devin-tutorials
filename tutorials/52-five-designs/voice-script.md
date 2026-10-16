# Tutorial 52: Explore design options in parallel, step by step (voice script)

Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, `VO_NAME=nader`, default voice settings). Generated as one whole-script take with `python3 _kit/tools/vo.py 52-five-designs T8iHhGIWPm2GVYpQD1Am`, cut locally at sentence boundaries, and every line passed the STT check.

Real run: https://app.devin.ai/sessions/69d5d42c3aa64dfba240a070f7485741 (thequantexplorer org, repo thequantexplorer/orbit-demo). One Dynamic Workflow, `orbit-board-five-directions`: five design agents in parallel (calm minimal, dense power-user, bold high-contrast, playful, dark editorial), each with a PR (#49 to #53), a live preview at https://thequantexplorer.github.io/orbit-demo/<direction>/ and a recorded walkthrough of that preview; then one audit agent ran axe and Lighthouse on all five live URLs. All five tied at a composite of 97.85 (Lighthouse 100/99/100/100), so the report leaves the pick to a team vote. No Slack is shown or claimed. The demo PRs were closed unmerged and their branches deleted after recording.

| Beat | Caption | Narration |
|---|---|---|
| 0000.png | Five design directions, built, previewed and scored in parallel | Let Devin explore design options for a screen in parallel. Five Devins each build a different direction, publish a live preview, and record a walkthrough. Your team then compares real, working designs instead of mockups. |
| 0003.png | Mention the repo: thequantexplorer/orbit-demo | Start a new session and mention the repo you want to redesign. Here, that's our Orbit demo app. |
| 0007.png | One agent per direction: PR, GitHub Pages preview, walkthrough | Then ask for a workflow with one agent per design direction. Each agent opens a pull request and deploys a preview to GitHub Pages. Then it records a walkthrough of the live page. |
| 0009.png | Then axe and Lighthouse rank all five | A final step runs axe and Lighthouse on all five previews. It ranks them so the team can vote. |
| 0010.png | The plan: five design agents in parallel, then one audit agent | Devin plans the run first. Five design agents work on separate machines. Then one audit agent scores each preview on accessibility, performance and best practices. |
| 0011.png | Workflow panel: five design agents running | The workflow panel shows five design agents running in parallel. The audit waits until they all finish. |
| 0013.png | Each agent: own branch, PR, CI, then its folder on gh-pages | Each agent builds its direction on its own branch. It opens a pull request and waits for CI. Then it pushes its build to its own folder on the gh-pages branch. |
| 0014.png | GitHub Pages here; Devin deployments publish to devinapps.com | We're publishing to GitHub Pages here. Where Devin's own deployments are turned on, an agent can deploy a static site to devinapps.com once you approve it. |
| 0015.png | Design 5 of 5 done; the audit starts | Once all five designs are done, the audit agent starts on the live previews. |
| 0016.png | 6 of 6 agents settled | Soon all six agents are done, and every phase is complete. |
| 0017.png | One session and one PR per direction | Each design agent has its own session and its own pull request. |
| 0018.png | Every PR and live preview, linked | Devin's reply links every pull request and live preview. It also notes that the scores tied, so the team will vote on design. |
| 0019.png | Live: thequantexplorer.github.io/orbit-demo/calm-minimal/ | Here are the five live previews on GitHub Pages. There's calm minimal, dense power-user, bold high-contrast, playful, and dark editorial. Each one is the same board, designed a different way. |
| 0024.png | A walkthrough recorded on each live preview | Each agent also recorded a walkthrough of its live preview. You can play it right in the session. |
| 0026.png | Each check it ran, with the result | The recording steps through each check it ran. It drags a card, filters issues and switches to the dark theme. So you can see the board still works. |
| 0035.png | PR #49: Calm minimal, checks 2/2 | Every direction is a normal pull request with passing checks. It's ready to review in Devin Review. |
| 0036.png | Ranked results: all five tie at 97.85 | The audit report ranks all five on axe and Lighthouse. In this run they tied, with identical scores across the board. |
| 0037.png | Tiebreak signals and shared fixes for the vote | So, the report lists the small differences that do exist. It also lists the fixes every direction needs. Then it leaves the final pick to your team. |
| outro | Five real designs in, a scored shortlist out | Five real designs in, a scored shortlist out. |
