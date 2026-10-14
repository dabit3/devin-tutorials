# Red team your own fix (tutorial), voice script

Narrated by Nader (ElevenLabs voice T8iHhGIWPm2GVYpQD1Am, default settings, no seed), generated as one whole-script take with `vo_onetake.py` and cut at sentence boundaries. No within-sentence audio edits.

Real run: one Devin session in the thequantexplorer org on `thequantexplorer/orbit-demo`. The bug is real and was not planted: `isBoardState` in `src/storage.ts` only checked the top-level shape of the saved board. Devin wrote the `redteam-board-storage` workflow (phases `fix` and `break`, `for round_index in range(MAX_ROUNDS)` with `MAX_ROUNDS = 4`, the loop returns when the breaker reports no breaks). It ran four agents: fix-r1, break-r1 (one confirmed break: a valid card numbered KB-1000000000 or higher was dropped on load because the first fix capped card numbers at 1e9), fix-r2 (limit raised to `Number.MAX_SAFE_INTEGER` plus an add-card guard), break-r2 (no breaks). Devin opened thequantexplorer/orbit-demo#41 with passing checks; Devin Review flagged two bugs on it, which the video says. Docs: https://docs.devin.ai/work-with-devin/dynamic-workflows

When a fix really matters, you can have one Devin write the patch, and a second Devin try to break it, in a loop that runs until the breaker fails.

I start a new session and add Orbit, a small kanban board demo repo.

The bug is real: the board trusts whatever is saved in local storage, because its check only looks at the top-level shape. So I ask for a workflow where a fixer writes the patch and a breaker attacks it, for at most four rounds.

Devin plans the loop. Each agent is its own Devin session on its own machine, and the breaker only reports breaks it actually reproduces.

The workflow panel shows the fix and break phases, with every agent's live status. Round one's breaker found a break, so round two is already running.

In round two, the breaker came up empty, so the loop stopped after four agents.

Here is the script Devin wrote.

It registers the workflow with its two phases.

Then it loops for up to four rounds.

Each round, the breaker gets the fixer's branch, and returns structured results that match a schema.

When the breaker finds no breaks, the loop stops. Otherwise, its breaks go to the next fixer.

You can open any agent's session from the panel.

In round one, the breaker found a real break: a valid card numbered one billion or higher vanished on reload, because the first fix capped card numbers.

The second fixer raised that limit and added a guard, and the round two breaker attacked the new patch.

It loaded bad saves in the browser, ran the tests, lint and build, and found no breaks.

The result is one pull request with passing checks. Devin Review still flagged two bugs on it, so review it like any other pull request before you merge.

Let one Devin write the fix, and let another one try to break it.
