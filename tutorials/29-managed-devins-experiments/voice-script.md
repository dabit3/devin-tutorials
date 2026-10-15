# Tutorial 29: Managed Devins for experiments (voice script)

Narrated in Nader's voice (ElevenLabs `T8iHhGIWPm2GVYpQD1Am`, default settings), generated as one take with `_kit/tools/vo_onetake.py` and cut locally at sentence boundaries.

1. When you don't know which approach is best, don't guess. Let several Devins try them in parallel, and compare real results.
2. Orbit's board is slow with five thousand cards, so I'm asking Devin to start managed Devins that each try a different fix, run the benchmark, and open a draft pull request.
3. First, the coordinator measures main, so every experiment is compared against the same baseline.
4. Then it starts four managed Devins, one per approach, each on its own branch in its own isolated VM.
5. You can still steer the experiment. I'm asking the coordinator to have each Devin also time the first keystroke in search.
6. In the sidebar, the four experiments are nested under the coordinator.
7. Inside the memoization Devin, the coordinator's message arrives, with one shared definition of the measurement.
8. It benchmarks its branch against main, and its first keystroke drops from about nine hundred seventy-five milliseconds to about seven hundred thirty-four.
9. Back in the coordinator, it reruns all five builds on one machine and compares them in one table. With virtualization, the first keystroke shows results in fifty-eight milliseconds, compared with nine hundred ninety on main.
10. It recommends virtualization, and lists what to review before you ship it, like offscreen focus and find-in-page.
11. I open the winning pull request in Devin Review and merge it.
12. Then I ask the coordinator to close the other three.
13. It closes them without merging, and deletes their branches.
14. With Auto-approve child sessions on, under Settings, Preferences, Devin starts managed Devins without asking you first.
15. One question went to the coordinator, which started four experiments in parallel.
16. Each one was measured the same way, and the results came back into one table.
17. You keep the winner, and close the rest.
18. You can use the same pattern for other research, like evaluating libraries before you adopt one, prototyping several UI designs, reproducing a bug across versions, or comparing approaches for a migration.
19. Four real experiments, one prompt, one winner.
