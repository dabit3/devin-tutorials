# Tutorial 52: Five designs of the same screen, step by step (voice script)

Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, `VO_NAME=nader`, default voice settings). Generated as one whole-script take with `python3 _kit/tools/vo.py 52-five-designs T8iHhGIWPm2GVYpQD1Am`, cut locally at sentence boundaries, and every line passed the STT check.

Real run: https://app.devin.ai/sessions/69d5d42c3aa64dfba240a070f7485741 (thequantexplorer org, repo thequantexplorer/orbit-demo). One Dynamic Workflow, `orbit-board-five-directions`: five design agents in parallel (calm minimal, dense power-user, bold high-contrast, playful, dark editorial), each with a PR (#49 to #53), a live preview at https://thequantexplorer.github.io/orbit-demo/<direction>/ and a recorded walkthrough of that preview; then one audit agent ran axe and Lighthouse on all five live URLs. All five tied at a composite of 97.85 (Lighthouse 100/99/100/100), so the report leaves the pick to a team vote. No Slack is shown or claimed. The demo PRs were closed unmerged and their branches deleted after recording.

| Beat | Caption | Narration |
|---|---|---|
| 0000.png | Five designs of one screen, built, previewed and scored in parallel | When you can't decide how a screen should look, you can have five Devins each build a different design direction, publish a live preview and record a walkthrough, so your team compares real, working options. |
| 0003.png | Mention the repo: thequantexplorer/orbit-demo | Start a new session and mention the repo you want to redesign, here our Orbit demo app. |
| 0007.png | One agent per direction: PR, GitHub Pages preview, walkthrough | Then ask for a workflow with one agent per design direction, where each agent opens a pull request, deploys a preview to GitHub Pages and records a walkthrough of the live page. |
| 0009.png | Then axe and Lighthouse rank all five | A final step runs axe and Lighthouse on all five previews and ranks them for a team vote. |
| 0010.png | The plan: five design agents in parallel, then one audit agent | Devin plans the run first, with five design agents on separate machines and then one audit agent that weighs accessibility, performance, best practices and SEO. |
| 0011.png | Workflow panel: five design agents running | The workflow panel shows the design phase with five agents running in parallel, and the audit waits until they all finish. |
| 0013.png | Each agent: own branch, PR, CI, then its folder on gh-pages | Each agent builds its direction on its own branch, opens a pull request, waits for CI, and pushes its build to its own folder on the gh-pages branch. |
| 0014.png | GitHub Pages here; Devin deployments publish to devinapps.com | We're publishing to GitHub Pages here, but where Devin's own deployments are turned on, an agent can deploy a static site to devinapps.com once you approve it. |
| 0015.png | Design 5 of 5 done; the audit starts | When all five designs are done, the audit agent starts on the live preview URLs. |
| 0016.png | 6 of 6 agents settled | Once all six agents finish, every phase in the panel is complete. |
| 0017.png | One session and one PR per direction | Each design agent has its own session and its own pull request. |
| 0018.png | Every PR and live preview, linked | Devin's reply links every pull request and live preview, and points out that the scores came out the same, so the team will vote on design. |
| 0019.png | Live: thequantexplorer.github.io/orbit-demo/calm-minimal/ | Here are the five live previews on GitHub Pages: calm minimal, dense power-user, bold high-contrast, playful, and dark editorial. |
| 0024.png | A walkthrough recorded on each live preview | Each agent also recorded a walkthrough of its live preview, and you can play it right in the session. |
| 0026.png | Each check it ran, with the result | The recording steps through each check it ran, like dragging a card between columns, filtering issues and switching to the dark theme. |
| 0035.png | PR #49: Calm minimal, checks 2/2 | Every direction is a normal pull request with passing checks, ready to review in Devin Review. |
| 0036.png | Ranked results: all five tie at 97.85 | The audit report ranks all five on axe and Lighthouse, and in this run they tied, with identical scores across the board. |
| 0037.png | Tiebreak signals and shared fixes for the vote | So the report lists the small differences that do exist, plus the fixes every direction needs, and leaves the final pick to your team. |
| outro | Five real designs in, a scored shortlist out | Five real designs in, a scored shortlist out. |
