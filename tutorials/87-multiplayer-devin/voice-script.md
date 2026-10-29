# Multiplayer development with Devin: voice script (Nader)

Voice: Nader (`T8iHhGIWPm2GVYpQD1Am`), generated with `python3 _kit/tools/vo.py 87-multiplayer-devin T8iHhGIWPm2GVYpQD1Am` (kit default model).

1. With Devin, one person can steer a whole team of Devins building the same app. Here I ask Devin for three Orbit features at once, each with its own pull request.
2. It starts three managed Devins in parallel, one per feature.
3. Each one builds its feature and records itself testing it in the browser.
4. From one chat, I tell the coordinator to have each Devin open its PR and fix what Devin Review flags.
5. The sidebar nests all three under the coordinator.
6. Devin Review caught a real bug on the rail PR, and that Devin reproduced it and pushed a fix.
7. Then the coordinator combines all three into one pull request, with green CI and all 85 tests passing.
8. Here's the combined app, with a collapsed column rail.
9. Issues now have comments.
10. And deleting a card shows a five second Undo toast that brings it back.

Outro: One chat, a team of Devins, one app.
