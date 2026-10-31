# Tutorial 108: Devin can raise test coverage, narration

Voice: Nader (`T8iHhGIWPm2GVYpQD1Am`), model from `_kit/settings.json`, generated as one take with `_kit/tools/vo_onetake.py` and cut into lines.

| Shot | Line |
|---|---|
| Title card, then the opener slide (diagram) | Devin can write the missing tests and prove coverage went up in real CI. |
| Baseline coverage per file (diagram) | A coverage report shows which lines no test ever runs, but someone still has to write those tests. |
| How Devin does it (diagram, docs.devin.ai) | Devin works like the code coverage guide in the Devin docs: measure a baseline, find the gaps, write tests, then measure again. |
| Prompt in the composer (real) | Here I asked Devin to raise coverage on a small ledger API, with the baseline taken in real CI and no app code changed. |
| Devin plans the change (real session) | It read the code and the CI workflow, and planned to use the coverage built into Node. |
| CI-only push, PR #3 opened (real session) | First it pushed only the CI change and opened a pull request, so the first run measures the code as it is. |
| Baseline CI coverage log (real session) | That baseline run shows the gaps, like the reports routes at fifty-eight percent of lines. |
| Writing the tests (real session) | Then it wrote tests for auth, invoices, workspaces, reports and the server entry point. |
| Tests pushed, CI checked (real session) | It pushed the tests to the same branch and checked the new CI run. |
| Post-test CI coverage log (real session) | This time every file reports full line coverage, and branches reach ninety-three percent. |
| GitHub Actions run, Success (real) | Both runs passed in GitHub Actions. |
| PR before/after table (real) | The pull request lists before and after for every file, with links to both runs. |
| Devin summary totals (real session) | Devin's summary has the totals and confirms no app code changed. |
| Security bugs reported (real session) | The new tests also turned up three security bugs, which Devin reported instead of locking them in. |
| Before and after (diagram) | Lines went from eighty-six to one hundred percent, branches from fifty-eight to ninety-three, and six tests became fifty-four. |
| Outro card | Missing tests written, and the proof is in CI. |

Prompt sent to Devin (live, thequantexplorer org, session `dc108-Add ledger-api coverage tests`):

> Find the untested code and write the missing tests. First turn on coverage reporting in CI and push only that, so a real CI run gives the baseline. Then push the tests and put the before and after coverage from both CI runs in the PR. Use the branch dc108-test-coverage and don’t change app code.
