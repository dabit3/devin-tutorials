# Tutorial 92 — Devin can run a codebase-wide migration as a fleet of Devins

Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, model from `_kit/settings.json`), generated as one take with `_kit/tools/vo.py` and cut per beat.

| Beat | Shows | Narration |
|---|---|---|
| 0000.png | diagram: why | Devin can run a codebase-wide migration as a fleet of Devins. A migration like CommonJS to ES modules touches every service, and by hand that means one service after another. |
| 0001.png | diagram: fanout | With managed Devins, you send one request, and a coordinator splits it into independent pieces, starting one managed Devin per service, each on its own VM. |
| 0002.png | diagram: prs | Each one works on its own branch, keeps that service's tests passing, and opens its own pull request, while the coordinator tracks them and compiles one summary. |
| 0003.png | real UI: Real run: four Node services, one request | Here's a real run on a small store backend with four Node services, asking for exactly that. |
| 0004.png | real UI: The coordinator reads the repo | The coordinator reads the repo, then starts four managed Devins, one each for orders, payments, inventory, and notifications. |
| 0006.png | real UI: Each one opens its own PR | A couple of minutes later, every one of them has a pull request open. |
| 0007.png | real UI: Nested under the coordinator in the sidebar | In the sidebar, all four sit nested under the coordinator. |
| 0008.png | real UI: The orders Devin: PR open, 3 tests pass | Open any of them to see its own work, like the orders Devin reporting its pull request with all three tests still passing. |
| 0009.png | real UI: Four PRs, one per service, tests passing | Then the coordinator reports back with four pull requests, one per service, each with its tests passing. |
| 0010.png | diagram: uses | The same pattern fits any change that splits cleanly, like swapping a legacy REST client for GraphQL, adding tests module by module, or running one skill in every session. |
| outro | outro card | One request in, one pull request per service out. |
