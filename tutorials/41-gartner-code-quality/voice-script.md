# Code Quality Assurance with Devin: narration script

Record one paragraph per line; each paragraph matches one shot in the video.

Software quality is not one step at the end of a sprint. It is decided in hundreds of small moments: when a bug is diagnosed, when code is reviewed, when a test is written, and when something breaks in production.

Devin, from Cognition, takes part in every one of those moments. Not as a linter that flags problems, but as an engineer that investigates them, fixes them, proves the fix, and hands the result back to your team.

In this video we follow one product through the whole loop. Fairshare is a small expense-splitting app, with a TypeScript API, a web dashboard, and an iOS app.

A pull request is reviewed. A failing build is debugged and refactored. The change is tested like a user would test it. And a crash in production is investigated on a Mac. Review, debugging, refactoring and testing, with people in control of every merge.

Chapter one: code review.

In the organization's Review settings, review effort is a dial. Normal effort gives an in-depth review with great price-performance. Ultra is the most thorough review, at a higher cost.

Here, Devin Review runs automatically on every push to this repository, at Ultra effort.

Here is the pull request: a CSV export for receipts. It looks small. Devin Review starts with a plain-language analysis of what the change does.

Then it lists what it found: three vulnerabilities and four bugs.

The first vulnerability is critical. Any signed-in user can export someone else's receipts. Devin classifies it as broken access control, CWE-862, points to the exact lines, and recommends checking the receipt's owner against the signed-in user.

Bugs get the same treatment. For one receipt, the exported shares add up to a cent less than the total, and Devin points to the existing helper the export should have used. Every finding is also posted on the GitHub pull request, where the team already works.

When you want to understand a change before you approve it, you can ask.

Here we ask how a CSV gets from the button to the download, and which finding should block the merge.

Devin traces the request from the button, through the route, to the file it writes, with a link to every line it cites.

Then it names the missing ownership check as the primary blocker, and the incorrect share math as the second, and lists what can wait for a follow-up.

Chapter two: debugging and refactoring.

Meanwhile, CI has failed. We hand it to Devin: read the failing logs, reproduce the failure, fix the root cause, address the review findings, and refactor the export to stream the file instead of writing it to disk.

Devin reads the failing check, reproduces it locally, and works through the fixes: ownership checks, shares that add back up to the total, CSV escaping, and a 404 instead of a 500 for unknown receipts.

Each fix comes with a regression test, and Devin runs lint, the type checker and the test suite before it pushes.

When it is done, it reports back. The original CI failure was a type error: the export route passed a receipt that could be undefined straight to the CSV writer, and a share test failed from rounding. Devin reproduced both locally before fixing them.

It also proposes a setup for the repository, so future sessions start with dependencies installed and know how to run lint and tests.

The push triggers a second review. All seven earlier findings are resolved, and Devin Review catches one new edge case: two participants with the same name would overwrite each other's shares.

We pass it back to the same session.

Devin writes a regression test that fails on the old code, fixes the export, and pushes. Lint, the type checker and all 24 tests pass, and CI is green.

While it worked, Devin also noticed a problem outside its task: the auth middleware accepted unsigned tokens. It flagged it instead of quietly changing it.

So we ask for the fix.

Devin now verifies every token's signature, and returns a 401 for unsigned, forged, tampered and expired tokens. Six new rejection tests fail on the old code, and all 31 tests pass. It even raises the next question for a person: should the server refuse to start in production without a real secret?

Devin Review checks that push too. The pull request now shows zero open vulnerabilities and zero open bugs, with every finding resolved.

Chapter three: testing like a user.

Unit tests prove the logic. Devin also tests the change the way a user would: it starts the app, signs in as a demo user, and clicks Export CSV.

The browser test is recorded, so a reviewer can replay exactly what Devin clicked and checked.

It opens the downloaded file and checks the numbers. The dinner receipt's three shares now add back up to its exact total, to the cent. It posts the results, with screenshots, to the pull request, so the reviewer sees evidence, not just a claim.

Chapter four: production debugging on macOS.

Not every bug is caught before release. A crash monitor reports a new fatal crash in the iOS app: hundreds of crashes an hour, a division by zero.

In Oncall, we create a responder for these alerts. It triggers from a webhook.

It follows a runbook: reproduce the crash, fix the root cause, add tests, and open a pull request with evidence.

And it investigates on a macOS machine, with Xcode and the iOS Simulator.

We choose the Alerts responder type and Ultra investigation mode.

The alert arrives, and Oncall opens an investigation.

The triage agent reads the stack trace and the breadcrumbs and writes up the likely cause. It also reports that it could not reach the iOS repository yet, so it does not guess at a fix.

So we escalate: a Devin session on macOS, with the iOS repository attached, and the alert and runbook pasted in.

Devin finds the crashing code first. Removing a participant could leave a receipt with nobody on it, and the split view then divided the total by zero.

Then it proves it. It builds the app, opens the same receipt in the iOS Simulator, removes Maya, removes Omar, and the app crashes, exactly as the alert described.

It attaches a debugger to the crashed process and confirms the division by zero in SplitCalculator.

The fix goes where the bad state starts: a receipt can no longer lose its last participant, the Remove button is disabled for that last person, and the calculator no longer traps on empty input.

Devin adds unit tests and a UI test for the exact breadcrumb flow. Against the old code, they fail with the same crash. On the fix, the full simulator suite passes: six unit tests and two UI tests.

On the fixed build, the same steps leave one person on the receipt, and the app keeps running.

Devin opens a pull request with the reproduction steps, before and after screenshots, the test results, and a recording of the fixed flow.

The recording plays right in the session.

Its report covers the root cause, the fix, and how it reproduced the crash, with links to the changed code.

It even flags a separate rounding issue it noticed along the way, without folding it into this fix.

The pull request is ready, with Devin Review one click away, and the merge decision stays with a person.

Review on every push. Debugging from the failing log to the root cause. Refactoring, with tests that lock in the behavior. Testing in a real browser and a real simulator. And a person approving every merge. That is how Devin keeps code quality high across the whole development lifecycle.

