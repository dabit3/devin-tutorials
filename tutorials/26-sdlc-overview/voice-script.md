# Devin across the SDLC (overview) — voice script

Narrated by Nader Dabit (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, default settings: stability 0.5, similarity 0.75, style 0, speed 1). The whole script is one take, cut locally into these lines with `_kit/tools/vo_onetake.py`. Each line starts on the shot named on the left and can run over the real UI shot that follows it.

| Shot | Narration |
| --- | --- |
| One Devin, every stage | Devin isn't a single step in your process; it plugs into every stage of the software lifecycle. |
| Plan (then Ask Devin's plan with file citations) | To plan, Ask Devin and DeepWiki explain your codebase, and with Jira or Linear connected, Devin can analyze and scope your tickets. |
| Build (then the session opening the PR) | To build, you hand off the task, and Devin works in its own environment and opens a pull request that follows your team's template. |
| Test (then "How it was tested" in the PR) | Before that pull request opens, Devin runs your tests, lint, and type checks, and it can write new tests from your playbooks. |
| Review (then Devin Review's first pass) | On every pull request, Devin Review makes a first pass, catching bugs and checking the change against your team's standards. |
| Secure (then a finding with its fix PR) | To secure, Devin fixes what scanners like SonarQube, Fortify, or Veracode flag in your pipeline, and it can roll out compliance changes across repositories. |
| The stages feed each other | The stages feed each other: with Auto-Fix on, Devin answers review comments, fixes flagged bugs, and iterates on CI failures until the pull request is ready to merge. |
| `/devin` comment and Devin's reply | You can also comment slash devin with what to change, and Devin pushes the fix. |
| Where it pays off | That's where it pays off: delegating repetitive work across many sessions, migrating hundreds of repositories, raising test coverage, and clearing a backlog of security findings. |
| Inside your process | Through all of it, Devin's pull requests follow the same branch protections as anyone's, and a human reviews them before anything merges. |
| Outro | Devin works across the whole lifecycle, and you stay in control of what ships. |

Every claim is from https://docs.devin.ai/essential-guidelines/sdlc-integration. The UI shots are real captures reused from `20-sdlc-integration/` and `17-security-swarm/` (see `shots/SOURCES.json`).
