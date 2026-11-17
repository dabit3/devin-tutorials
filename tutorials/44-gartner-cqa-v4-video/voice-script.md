# Code Quality Assurance with Devin (v4): narration script

This video shows how Devin supports code quality across the software development life cycle. It covers code review, security, debugging, refactoring, and testing.

The demo goes through each stage in order.

It starts with writing code and opening a pull request.

Then it covers security, a failing build, a refactor, new tests, and production bugs.

Our example is the claims platform of an insurance company. It has four repositories: a Java claims service, a web portal for customers, a Windows desktop app for adjusters, and an iOS app for field adjusters.

The team keeps its rules in a file called AGENTS.md. One rule is that every bug fix needs a regression test, which is a test that proves the bug stays fixed.

Devin follows this rule when it writes code, and Devin Review flags pull requests that break it.

Devin opens pull requests, and a person on the team approves every merge.

Devin includes specialized agents, which are agents built for one job.

Each one runs in its own session, with its own context, and the team manages them from the web app, Devin Desktop, Slack, or the API.

This video uses three.

Devin Review uses adversarial agents. Some agents look for problems, and other agents try to prove each problem is wrong.

Devin Security uses agentic MapReduce to scan a whole codebase.

Devin Oncall is a site reliability agent with its own harness.

Review can start before the code is finished. A developer is adding a fraud score to the claim page, and the pull request is still a draft.

Devin Review does not review drafts automatically, so the developer starts a review from the pull request menu.

The change is not finished yet. Devin Review flags one thing to look into: older claims can push a claim over the investigation threshold, because the code counts all of the customer's past claims.

Its summary also checks access: the new fields are shown only to users who can see all claims, so customers never get them.

The developer can ask questions in Review chat while writing the code. Here they ask how the score should count prior claims.

Devin Review explains which claims to count: the same customer, only claims filed before this one, and only in the same year. It also suggests tests for the edge cases.

The developer can also review in Devin Desktop.

The same finding is there, and they can ask Devin Review questions in chat.

When a pull request is ready, Devin Review runs on its own. An admin picks the repositories, when the review runs, and the review effort. Here it covers all four repositories at Ultra effort.

The admin also sets controls, such as a spend limit for each pull request.

Devin Review reads the team's rule files, such as REVIEW.md and AGENTS.md, on every review.

A developer opens a pull request on the claims service. It adds a payout export for the finance team. Devin Review starts with a summary of what the change does.

Then it lists its findings by type and by severity.

The most serious finding is that a signed-in customer can read the payout details of another customer. Devin labels it as broken access control, CWE-639, shows the lines of code, and recommends a fix.

A second finding is a rounding bug. It is tagged as a repo rule, because AGENTS.md says money must be split with the team's own helper. This is how the team's coding standards are enforced.

The reviewer asks which findings must be fixed before the merge. Devin Review names the blockers and links each one to the code and to the rule it breaks.

Devin Security is a specialized agent that scans whole repositories for security problems.

Before it scans, it asks a few questions to build a threat model, such as who the attackers are and how the service is reached.

Here it finds a chain of problems. The claims service trusts the user ID and role in the request headers, and never checks that they came from the gateway. So anyone who can reach the service can claim to be an adjuster and read every customer's claims.

Devin documents its reasoning step by step through the code. Then it verifies the finding on a running build: a request that claims to be an adjuster gets back every customer's claims. It labels the finding CWE-290 and marks it critical.

One click on Fix with Devin starts a fix.

Devin makes the service require a signed header from the gateway, adds tests, and opens a pull request. Devin Review reviews it like any other change.

The payout pull request also fails in CI, the automatic build and test system. The developer asks Devin to fix it. This session runs on a macOS VM.

Devin reads the CI logs, runs the failing test on its VM, and finds the root cause. The export rounded each installment, so one million cents became 999,999.

It fixes the failure and the review findings in the same pull request. Each new regression test fails on the old code and passes on the fix.

Before it pushes, Devin runs the full build and test suite. Then CI passes.

Large refactors are hard to review as one pull request. Devin can split a refactor into stacked pull requests, where each one builds on the one below it.

Here, Devin moves the payout math into one shared module in three pull requests. The first adds the new module, the second switches the callers, and the third deletes the old code.

Each pull request is small, so Devin Review and the reviewer check one change at a time.

Devin Review found no problems in any of the three.

Devin can write a whole test suite. Here, the developer asks for tests of the claims API at three levels, and asks Devin to run them all.

Unit tests check one class at a time. Devin writes tests for the fraud rules and the coverage calculator, with a test on each side of every limit.

Integration tests check the API with the database. They use MockMvc, which sends requests to the API inside the test, and the seed data.

The end-to-end test starts the whole service and calls it over HTTP, as a customer and as an adjuster. It checks that a customer cannot read another customer's claim.

Then Devin runs the whole suite with one command. The unit and integration tests pass, then the five end-to-end tests pass, and the build succeeds.

Devin reports the count for each type: 31 unit, 19 integration, and 5 end-to-end tests.

CI passes, and Devin Review finds no issues.

Devin can also write tests from a requirement. Here, claims over ten thousand dollars must go to a supervisor. This session runs on a Windows VM.

Devin finds that the code compared dollars to a limit in cents.

It writes unit, integration, and UI tests, and all fourteen pass on Windows and in CI.

Some test work is too large for one session. For this, Devin writes a Dynamic Workflow, a Python script that runs many Devin agents.

The workflow runs the same steps in the same order every time. Inside each step, an agent decides how to do the work.

It starts one agent for each of the six packages.

Each agent runs in its own session, with its own context.

It writes unit and integration tests, runs them, and pushes a branch.

A final step merges the branches, runs the full build, and opens one pull request with 170 new tests for the team to review.

Some bugs still reach production. A Devin Oncall responder watches one source of alerts. This one gets crash alerts for the iOS app from a webhook.

The responder can use the team's tools through MCP, such as Slack, and it follows the team's runbook.

It runs on a macOS VM with Xcode and the iOS Simulator.

A crash monitor sends an alert, and Devin Oncall starts a session. The alert has the stack trace and the breadcrumbs, which are the last steps the user took.

Devin follows the breadcrumbs in the iOS Simulator and gets the same crash.

The cause is a division by zero when an estimate has no line items.

It fixes the root cause and adds three regression tests: two unit tests for an empty estimate, and a UI test that removes the last item.

The report gives the root cause, the confidence, and the affected app versions, with the test logs and a patch attached.

Here the alert comes from a Windows desktop app.

Oncall starts a session on a Windows virtual machine and reports that it reproduced the crash.

It finds the cause, a missing claim type in the approval rules, writes a fix with unit tests and a UI test, and reports its confidence.

A developer opens the pull request from the patch. Like every other change, it goes through Devin Review, and a person approves the merge.

To recap: Devin Review checked code while it was written and when each pull request opened, with the team's rules. Devin Security found and fixed a chained vulnerability.

Devin fixed a failing build, split a refactor into small pull requests, wrote and ran a whole test suite, and fixed production crashes on macOS and Windows.

This works on Linux, macOS, and Windows VMs, with the iOS Simulator and Android emulators.

So the demo showed code quality at each stage of the life cycle: writing code, opening a pull request, security, a failing build, a refactor, testing, and production.

