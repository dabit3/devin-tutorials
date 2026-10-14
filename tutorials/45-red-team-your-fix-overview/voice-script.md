# Red team your own fix: how it works (overview), voice script

Narrated by Nader (ElevenLabs voice T8iHhGIWPm2GVYpQD1Am, default settings, no seed), generated as one whole-script take with `vo_onetake.py` and cut at sentence boundaries. No within-sentence audio edits.

Proof shots are reused from tutorial 44 (see `shots/SOURCES.json`): a real Dynamic Workflow run on `thequantexplorer/orbit-demo` with phases `fix` and `break`, at most four rounds, which finished after two rounds when the second breaker found no breaks. Docs: https://docs.devin.ai/work-with-devin/dynamic-workflows

Red teaming your own fix means one Devin writes the patch, a second Devin tries to break it, and the loop keeps going until the breaker fails.

It matters because an agent checking its own patch shares its blind spots, while a separate breaker starts fresh, has to reproduce every break, and hands each one back to be fixed.

Here, I ask Devin for that loop on a real bug in a kanban demo app, with at most four rounds.

As a dynamic workflow, it's a short script: each round runs a fixer, gives its branch to a breaker, and stops as soon as the breaker comes back empty.

This is the loop Devin wrote, with the breaker getting the fixer's branch.

The workflow panel shows the fix and break phases, with every agent's live status.

In the real run, round one's breaker found a card that vanished on reload, round two fixed it, and the second breaker came up empty.

That first break was real, and the breaker reproduced it in tests before reporting it.

The result is one pull request, and it still gets a normal review before you merge.

Use it for fixes where edge cases matter, like input validation, parsers, permission checks and data migrations.

Let one Devin write the fix, and let another one try to break it.
