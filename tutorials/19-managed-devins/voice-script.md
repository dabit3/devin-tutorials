# Voice script: Managed Devins

Narrated cut: `19-managed-devins-nader.mp4` (voice `T8iHhGIWPm2GVYpQD1Am`). The whole script is generated as one ElevenLabs take (default voice settings) with `_kit/tools/vo_onetake.py` from the `vo` fields in `spec.js`, then cut into lines; "Spoken as" is the `voSay` spelling sent to the voice where it differs.

## Typed prompts

Coordinator session, repo `thequantexplorer/orbit-demo`:

> Find the 4 UI components with the least test coverage. Start a managed Devin for each one to add tests in its own PR, then send me a summary.

Follow-up while the managed Devins were running:

> Tell the AddCardForm Devin to also test that a blank title is rejected.

## Lines

| Shot | Line | Spoken as |
|---|---|---|
| 0000 | Managed Devins let one Devin split a big task into pieces and hand each piece to its own Devin, all running in parallel. It's great for big migrations, adding tests module by module, running one playbook across every service, and parallel research. |  |
| 0007 | Here, I asked Devin to find the four UI components in Orbit with the least test coverage, and start a managed Devin for each one. |  |
| 0010 | The coordinator measures coverage, ranks the components, and pushes one shared test setup, so the pull requests won't conflict. |  |
| 0034 | Then it starts four managed Devins, each in its own isolated machine. |  |
| 0055 | While they work, I can still steer. I ask the coordinator to have the AddCardForm Devin also test a blank title. |  |
| 0090 | The coordinator passes that message straight to the child session. |  |
| 0095 | In the AddCardForm Devin, you can see it working in its own VM, and it pushes the new test to its pull request. |  |
| 0130 | Meanwhile, the coordinator monitors every child, then merges all four branches to check that they pass together. |  |
| 0148 | When they're done, it sends one summary: four pull requests, each component from zero to one hundred percent coverage, and a hundred and eight passing tests. |  |
| 0170 | Devin starts managed Devins on its own when it makes sense. You control the approval step in Settings → Preferences. | Devin starts managed Devins on its own when it makes sense. You control the approval step in Settings, Preferences. |
| 0173 | Turn on Auto-approve child sessions, and Devin starts them without asking first. |  |
| outro | One task in, a team of Devins on it. |  |

## Sources

- Managed Devins: https://docs.devin.ai/work-with-devin/advanced-capabilities#managed-devins
- Setting: Settings → Preferences → "Auto-approve child sessions" (verified on screen)
