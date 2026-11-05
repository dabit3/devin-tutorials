# 112 · Devin can coordinate a team of Devins on one app

Overview, one narrated cut (Nader, voice `T8iHhGIWPm2GVYpQD1Am`, `eleven_multilingual_v2`, one take cut into lines). Music: Nader's `2-upbeat.mp3`, ducked under the voice.

Real run in the thequantexplorer org: coordinator session "Build dc112 weekend trip planner app" started three managed Devins (`dc112-itinerary`, `dc112-budget`, `dc112-packing`) on thequantexplorer/product-demo-apps; their PRs #115, #117 and #114 merged into the `dc112-trip-planner` branch, then the coordinator ran an end-to-end test (11 passed).

| Beat | Shows | Narration |
|---|---|---|
| title | "Devin can coordinate a team of Devins on one app" | |
| 0000.png | Diagram: split | Devin can coordinate a team of Devins on one app. A coordinator splits the app into parts and hands each part to a managed Devin on its own isolated VM, so they all work in parallel. |
| 0001.png | Real UI: prompt | Here's a real run, where I asked for a weekend trip planner built by a team of Devins. |
| 0002.png | Real UI: coordinator shell + pushed branch | The coordinator sets up the app shell and the shared trip data first, and pushes them to a shared branch. |
| 0003.png | Real UI: three managed Devins started | Then it starts three managed Devins, one each for the itinerary, the budget, and the packing list. |
| 0004.png | Real UI: sidebar tree (sibling rows hidden) | The sidebar nests all three under the coordinator. |
| 0005.png | Real UI: budget child PR #117 | Each one builds its own panel and opens a pull request into the shared branch. |
| 0006.png | Real UI: budget child browser check | First, it tests its panel in its own browser, like the budget Devin checking that a negative limit is rejected. |
| 0007.png | Diagram: merge | Once all three pull requests are in, the coordinator merges them, runs the whole app, and tests it end to end. |
| 0008.png | Real UI: coordinator summary | Its summary lists the three merged pull requests, with no conflicts, and every test and the build passing. |
| 0009.png | Real UI: test run opened | The end-to-end test run is recorded, with eleven checks passed and none failed. |
| 0010.png | Real UI: merged app running | And here's the merged app, running. |
| 0011.png | Real UI: activity added | Add an activity with a cost, and the budget picks it up. |
| 0012.png | Real UI: item packed | Pack an item, and the packing count updates. |
| outro | "One app, a team of Devins" | One app, built by a team of Devins. |
