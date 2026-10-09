# Tutorial 33: Dynamic Workflows, step by step (voice script)

Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, default settings: stability 0.5, similarity 0.75, style 0, speed 1). Generated as one take with `_kit/tools/vo_onetake.py` and cut locally at sentence boundaries.

Real run: https://app.devin.ai/sessions/b4ed85ba851045e1bf816ffec056959d (thequantexplorer org, repo thequantexplorer/orbit-demo). Five component pipelines, 20 agents (15 planned plus 5 in correction rounds for AddCardForm and CardModal), PRs #29 to #32 with green CI and passing browser checks, Dialog clean with no PR. The demo PRs were closed unmerged and their branches deleted after recording.

| Beat | Caption | Narration |
|---|---|---|
| 0000.png | Structured work becomes a script you can read, watch and resume | When your work has real structure, like many units or stages that feed into each other, you can ask Devin for a workflow, and the orchestration becomes a script you can read, watch and resume. |
| 0007.png | One pipeline per component: audit, fix and PR, verify | Here, I'm asking Devin to audit five Orbit components for accessibility issues, and to run each one through its own pipeline, from the audit to a fix with its own pull request, and then a check in the browser. |
| 0010.png | Devin plans the run first | Devin reads the repo and plans the run, with fifteen agents on separate VMs, three for each component. |
| 0052.png | register_workflow names the run and its three phases | Then it writes the workflow script, which registers the workflow and its three phases. |
| 0053.png | Each agent call has a schema for structured results | Each step is an agent call with a schema, so every agent returns structured results that the next stage can build on. |
| 0054.png | pipeline runs each component through all three stages | And pipeline runs every component through audit, fix and verify on its own. |
| 0055.png | The workflow panel: phases, agents and live status | The workflow panel shows each phase with its agents and their live status, starting with five audits running in parallel. |
| 0089.png | No barrier: Dialog is verifying while four are still fixing | There's no barrier between stages, so Dialog is already in browser verification while the other four are still fixing. |
| 0215.png | Each agent is a real Devin session | Any agent opens as a real Devin session, and this audit found two contrast issues in AddCardForm. |
| 0216.png | Structured output, validated against the schema | It hands them back as structured output that's validated against the schema. |
| 0243.png | Browser checks failed, so two fixes went back for another round | When the browser checks found more focus problems in AddCardForm and CardModal, the workflow sent them back to be fixed in the same pull requests and verified again. |
| 0492.png | 20 agents, 4 PRs with green CI and browser checks | After twenty agents the run is complete, with four pull requests that passed CI and the browser checks, and Dialog came back clean. |
| 0493.png | The roll-up: what was fixed and what needs manual attention | The roll-up lists what was fixed, and what still needs manual attention, like screen reader checks and a shared avatar contrast issue. |
| 0495.png | Each fix is a normal pull request | Each fix is a normal pull request that you can review and merge. |
| 0496.png | The workflow you just watched | So that's one script, five pipelines, and a roll-up at the end. |
| 0501.png | More ideas: migrations, research, loop until green | You can use the same pattern for migrations, for research and evaluations, or for loops that run until your tests are green. |
| outro | Structured work in, a workflow you can read and watch | Structured work in, a workflow you can read and watch. |
