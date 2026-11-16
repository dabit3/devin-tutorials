# Code Quality Assurance with Devin — script v5 (life-cycle order, covers the criteria list)

The "On screen" column is the shot list for the reshoot. Every shot is real Devin UI.

## Opening

| # | Narration | On screen |
|---|---|---|
| 1 | This video shows how Devin supports code quality across the software development life cycle. It covers code review, security, debugging, refactoring, and testing. | Intro slide |
| 2 | The demo goes through each stage in order. It starts with writing code and opening a pull request. Then it covers security, a failing build, a refactor, new tests, and production bugs. | Devin home: the prompt box |
| 3 | Our example is the claims platform of an insurance company. It has four repositories: a Java claims service, a web portal for customers, a Windows desktop app for adjusters, and an iOS app for field adjusters. | Review settings: the four repositories |
| 4 | The team keeps its rules in a file called AGENTS.md. One rule is that every bug fix needs a regression test, which is a test that proves the bug stays fixed. Devin follows this rule when it writes code, and Devin Review flags pull requests that break it. Devin opens pull requests, and a person on the team approves every merge. | Same view |
| 5 | Devin includes specialized agents, which are agents built for one job. Each one runs in its own session, with its own context, and the team manages them from the web app, Devin Desktop, Slack, or the API. | Review settings |
| 6 | This video uses three. Devin Review uses adversarial agents. Some agents look for problems, and other agents try to prove each problem is wrong. Devin Security uses agentic MapReduce to scan a whole codebase. Devin Oncall is a site reliability agent with its own harness. | Review settings: trigger row |

## While you write code

| # | Narration | On screen |
|---|---|---|
| 7 | Review can start before the code is finished. A developer is adding a fraud score to the claim page, and the pull request is still a draft. | Draft PR #10 in Devin Review |
| 8 | Devin Review does not review drafts automatically, so the developer starts a review from the pull request menu. | "Review draft" in the pull request menu |
| 9 | The change is not finished yet. Devin Review flags one thing to look into: older claims can push a claim over the investigation threshold, because the code counts all of the customer's past claims. | Finding expanded |
| 10 | Its summary also checks access: the new fields are shown only to users who can see all claims, so customers never get them. | Devin's analysis |
| 11 | The developer can ask questions in Review chat while writing the code. Here they ask how the score should count prior claims. | Review chat: question |
| 12 | Devin Review explains which claims to count: the same customer, only claims filed before this one, and only in the same year. It also suggests tests for the edge cases. | Review chat: answer |
| 13 | The developer can also review in Devin Desktop. The same findings and chat are there, next to the local code. | Same PR in Devin Desktop's Review |

## When you open a pull request

| # | Narration | On screen |
|---|---|---|
| 14 | When a pull request is ready, Devin Review runs on its own. An admin picks the repositories, when the review runs, and the review effort. Here it covers all four repositories at Ultra effort. | Review settings: four repos, Ultra effort |
| 15 | The admin also sets controls, such as a spend limit for each pull request. Devin Review reads the team's rule files, such as REVIEW.md and AGENTS.md, on every review. | Settings: spend limit and Context (REVIEW.md) |
| 16 | A developer opens a pull request on the claims service. It adds a payout export for the finance team. Devin Review starts with a summary of what the change does. | PR #9: Devin's analysis |
| 17 | Then it lists its findings by type and by severity. | PR #9: findings panel |
| 18 | The most serious finding is that a signed-in customer can read the payout details of another customer. Devin labels it as broken access control, CWE-639, shows the lines of code, and recommends a fix. | Finding popover |
| 19 | A second finding is a rounding bug. It is tagged as a repo rule, because AGENTS.md says money must be split with the team's own helper. This is how the team's coding standards are enforced. | Popover with "Repo rule" tag |
| 20 | The reviewer asks which findings must be fixed before the merge. Devin Review names the blockers and links each one to the code and to the rule it breaks. | Review chat: "Must fix before merge" |

## Security

| # | Narration | On screen |
|---|---|---|
| 21 | Devin Security is a specialized agent that scans whole repositories for security problems. Before it scans, it asks a few questions to build a threat model, such as who the attackers are and how the service is reached. | Security scan setup and threat-model questions |
| 22 | Here it finds a chain of problems. The claims service trusts the user ID and role in the request headers, and never checks that they came from the gateway. So anyone who can reach the service can claim to be an adjuster and read every customer's claims. | Finding: References across claims-service and claims-portal |
| 23 | Devin documents its reasoning step by step through the code. Then it verifies the finding on a running build: a request that claims to be an adjuster gets back every customer's claims. It labels the finding CWE-290 and marks it critical. | How it works, then Sandbox validation: Confirmed |
| 24 | One click on Fix with Devin starts a fix. Devin makes the service require a signed header from the gateway, adds tests, and opens a pull request. Devin Review reviews it like any other change. | Fix with Devin → claims-service PR #8 in Devin Review |

## When the build fails

| # | Narration | On screen |
|---|---|---|
| 25 | The payout pull request also fails in CI, the automatic build and test system. The developer asks Devin to fix it. This session runs on a macOS VM. | CI-fix session, macOS badge |
| 26 | Devin reads the CI logs, runs the failing test on its VM, and finds the root cause. The export rounded each installment, so one million cents became 999,999. | Failing test output |
| 27 | It fixes the failure and the review findings in the same pull request. Each new regression test fails on the old code and passes on the fix. | Chat: fixes and tests |
| 28 | Before it pushes, Devin runs the full build and test suite. Then CI passes. | 15 tests, BUILD SUCCESS |

## During a refactor

| # | Narration | On screen |
|---|---|---|
| 29 | Large refactors are hard to review as one pull request. Devin can split a refactor into stacked pull requests, where each one builds on the one below it. | Review page for PR #3 |
| 30 | Here, Devin moves the payout math into one shared module in three pull requests. The first adds the new module, the second switches the callers, and the third deletes the old code. | Stack menu, three PRs highlighted |
| 31 | Each pull request is small, so Devin Review and the reviewer check one change at a time. Devin Review found no problems in any of the three. | "Needs your attention · 0" |

## When you add tests

| # | Narration | On screen |
|---|---|---|
| 32 | Devin can write a whole test suite. Here, the developer asks for tests of the claims API at three levels, and asks Devin to run them all. | Suite session: the request |
| 33 | Unit tests check one class at a time. Devin writes tests for the fraud rules and the coverage calculator, with a test on each side of every limit. | Unit test diff |
| 34 | Integration tests check the API with the database. They use MockMvc, which sends requests to the API inside the test, and the seed data. | ClaimApiTest with MockMvc |
| 35 | The end-to-end test starts the whole service and calls it over HTTP, as a customer and as an adjuster. It checks that a customer cannot read another customer's claim. | End-to-end test diff |
| 36 | Then Devin runs the whole suite with one command. The unit and integration tests pass, then the five end-to-end tests pass, and the build succeeds. | ./mvnw -B verify output, BUILD SUCCESS |
| 37 | Devin reports the count for each type: 31 unit, 19 integration, and 5 end-to-end tests. CI passes, and Devin Review finds no issues. | Table by test type; PR #11 in Devin Review |
| 38 | Devin can also write tests from a requirement. Here, claims over ten thousand dollars must go to a supervisor. This session runs on a Windows VM. | Windows session: the request, Windows badge |
| 39 | Devin finds that the code compared dollars to a limit in cents. It writes unit, integration, and UI tests, and all fourteen pass on Windows and in CI. | Chat: root cause and new tests; PR #2 |
| 40 | Some test work is too large for one session. For this, Devin writes a Dynamic Workflow, a Python script that runs many Devin agents. | Workflow session chat |
| 41 | The workflow runs the same steps in the same order every time. Inside each step, an agent decides how to do the work. | Workflow script |
| 42 | It starts one agent for each of the six packages. Each agent runs in its own session, with its own context. It writes unit and integration tests, runs them, and pushes a branch. | Agents view: package-tests 6/6 |
| 43 | A final step merges the branches, runs the full build, and opens one pull request with 170 new tests for the team to review. | PR #6 and per-package table |

## Production bugs

| # | Narration | On screen |
|---|---|---|
| 44 | Some bugs still reach production. A Devin Oncall responder watches one source of alerts. This one gets crash alerts for the iOS app from a webhook. | Responder: Webhook trigger |
| 45 | The responder can use the team's tools through MCP, such as Slack, and it follows the team's runbook. It runs on a macOS VM with Xcode and the iOS Simulator. | MCPs list, runbook, macOS setting |
| 46 | A crash monitor sends an alert, and Devin Oncall starts a session. The alert has the stack trace and the breadcrumbs, which are the last steps the user took. | Alert payload |
| 47 | Devin follows the breadcrumbs in the iOS Simulator and gets the same crash. The cause is a division by zero when an estimate has no line items. | Reproduced on iOS 26.5 |
| 48 | It fixes the root cause and adds two regression tests. One is a unit test for an empty estimate, and one is a UI test that removes the last item. | xcodebuild test run |
| 49 | The report gives the root cause, the confidence, and the affected app versions, with the test logs and a patch attached. | Final report and files |
| 50 | Here the alert comes from a Windows desktop app. Oncall starts a session on a Windows virtual machine, runs the app, and reproduces the crash. It finds the cause, a missing claim type in the approval rules, writes a fix with a test, and reports its confidence. | Oncall session on a Windows VM |
| 51 | A developer opens the pull request from the patch. Like every other change, it goes through Devin Review, and a person approves the merge. | adjuster-desktop PR #3 (opened from the Oncall patch) in Devin Review |

## Closing

| # | Narration | On screen |
|---|---|---|
| 52 | To recap: Devin Review checked code while it was written and when each pull request opened, with the team's rules. Devin Security found and fixed a chained vulnerability. | Devin Review home |
| 53 | Devin fixed a failing build, split a refactor into small pull requests, wrote and ran a whole test suite, and fixed production crashes on macOS and Windows. | Same view |
| 54 | This works on Linux, macOS, and Windows VMs, with the iOS Simulator and Android emulators. | Same view |
| 55 | So the demo showed code quality at each stage of the life cycle: writing code, opening a pull request, security, a failing build, a refactor, testing, and production. | Same view |

## Criteria coverage
| Criteria item | Lines |
|---|---|
| Oncall alert → session → debugging; webhook; macOS (iOS) and Windows | 44-51 |
| Human review in Devin Cloud and Devin Desktop | 7-13, 20, 51 |
| Confidence and reporting | 49, 50 |
| Stacked PRs | 29-31 |
| Test generation and test types; whole test suite written and run; tests from requirements | 27, 32-39 |
| Review chat; CI logs, reproduce, rerun, tests | 11-12, 20, 25-28 |
| Vulnerability (CWE) | 18 |
| Devin Security chained vulnerability, reasoning, verification, one-click fix | 21-24 |
| Specialized agents: Review adversarial, Security agentic MapReduce, Oncall own harness | 5-6 |
| Multi-repo | 3, 14 |
| Dynamic Workflows, deterministic vs agent decisions | 40-43 |
| Context: rule files, repo rules, MCP | 15, 19, 45 |
| Code review: LLM review, summaries, standards, fixes, review-effort tier | 14-20 |
| Documentation: summaries and chat explanations | 12, 16, 20 |
| Governance: admin controls, spend limit, specialized agents managed from many places | 5, 14-15 |
| Custom specialized agents: isolated sessions and context | 5, 42 |
| Every platform | 38, 44-50, 54 |
| Code quality across SDLC stages | 1-2, 55 |
