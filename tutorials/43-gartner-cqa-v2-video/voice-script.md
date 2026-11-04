# Code Quality Assurance with Devin: narration script

Record one paragraph per line; each paragraph matches one shot in the video.

This video covers Code Quality Assurance with Devin. It shows how Devin helps teams debug, refactor, test, and review code at each step of software development.

Devin is an AI software engineer made by Cognition. Devin also includes specialized agents. A specialized agent is an agent that is built for one job.

This video uses two of them. Devin Review is a specialized agent for code review. Devin Oncall is a specialized agent for site reliability engineering, which is the work of keeping production systems running.

Every Devin session runs on its own virtual machine, or VM. A VM is a full computer in the cloud. Teams can choose Linux, macOS, or Windows VMs. On macOS, Devin can use Xcode and the iOS Simulator. Devin can also run Android emulators.

Everything in this video works the same way on all of these VMs. Most of this demo uses macOS. One part uses Windows for a desktop app.

Our example is the claims platform of an insurance company. It has four repositories: a Java claims service that calculates and pays claims, a web portal where customers file claims, a Windows desktop app that adjusters use to approve claims, and an iOS app that field adjusters use to file damage reports.

The team has strict rules. A person reviews every change. Every bug fix needs a regression test, which is a test that proves the bug stays fixed. Only people merge pull requests.

Code review.

Code review is the first quality check on every change. Devin Review is a specialized code review agent. It uses adversarial agents. Some agents look for problems, and other agents try to prove each finding wrong. Devin Review reports only the findings that hold up.

An admin turns on automatic review in the Review settings. The admin chooses the repositories, when the review runs, and the review effort. Normal effort balances cost and depth. Ultra effort gives the most complete review, at a higher cost.

Here, Devin Review covers all four repositories, at Ultra effort.

It reviews the pull requests from each repository with the same rules, and it shows them in one place.

A developer opens a pull request on the claims service. It adds a payout export for the finance team. Devin Review starts with a short summary of what the change does.

Then it lists its findings by type and by severity.

The most serious finding is that a signed-in customer can read the payout details of another customer. Devin labels it as broken access control, CWE-862. It shows the lines of code and recommends an ownership check.

A second finding is a rounding bug. The installments do not add up to the claim total.

Reviewers can ask questions in Review chat. Here the reviewer asks which findings must be fixed before the merge.

Devin names the blockers and links to the code.

Debugging a failing build.

CI, the automatic build and test system, fails on the same pull request. The developer asks Devin to fix it. This session runs on a macOS VM.

Devin reads the CI logs, reproduces the failure on its VM, and finds the root cause.

It fixes the failure and the review findings: an ownership check, installments that add up to the exact total, safe CSV values, and a 404 for an unknown claim. It adds a regression test for each bug.

Before it pushes the code, Devin runs the full build and test suite. Then CI passes.

Refactoring.

A refactor changes the structure of code but not its behavior. A large refactor is hard to review as one pull request. Devin can split it into stacked pull requests. Each pull request targets the branch of the one below it, so a reviewer reads one small change at a time.

Here, Devin moves the payout calculations into one shared module, in three stacked pull requests: the new module, the change to the callers, and the removal of the old code. Devin Review shows where each pull request sits in the stack.

Test generation.

Devin writes tests that follow the existing test patterns of the team. In this example, it writes three types of tests: unit tests, integration tests, and end-to-end tests that use the app as a person does.

This session runs on a Windows VM. Adjusters report that a twenty thousand dollar claim was approved without a supervisor. The approval limit is ten thousand dollars.

Devin finds the root cause. The code compared the claim amount in dollars to a limit stored in cents.

It adds unit tests below, at, and above the limit, an integration test for the claim queue, and an end-to-end test that opens the Windows app, approves the claim, and checks that it goes to a supervisor.

It also records a check of the app, so a reviewer can watch each step.

All fourteen tests pass on Windows and in CI, and Devin opens a pull request.

Testing at scale.

Some test work is large and repetitive. An example is to add tests to every package in a service. For this work, Devin can write a Dynamic Workflow. A Dynamic Workflow is a Python script that runs many Devin agents.

The workflow is deterministic. It runs the same steps in the same order every time, and each step returns structured results. In each step, an agent decides how to write the tests.

Here is the workflow. The list of packages is in the code: one agent for each of the six packages in the claims service.

Each agent writes unit tests and integration tests for its package, runs them, and pushes a branch.

A final step merges the branches, runs the full build, and opens one pull request. It adds one hundred twenty four unit tests and forty six integration tests, and all of the tests pass.

A normal Devin session is not deterministic. Devin decides the next step while it works. Use a session for one task. Use a Dynamic Workflow when the steps must be the same every time.

Production debugging.

Devin Oncall is the specialized agent for site reliability engineering. You set up a responder, which watches one source of alerts.

This responder gets crash alerts for the iOS app from a webhook.

It follows the runbook of the team: reproduce the crash, fix the root cause, add tests, and open a pull request.

And it runs on a macOS VM, with Xcode and the iOS Simulator.

A crash monitor reports a new crash in the iOS app for field adjusters. The responder starts an investigation.

Devin Oncall reads the alert. It has the stack trace and the breadcrumbs, which are the last steps the user took before the crash.

It posts a first update with the severity and the likely cause: a division by zero when an estimate has no line items.

On the macOS VM, Devin follows the breadcrumbs in the iOS Simulator. It removes the line items from an estimate, and the app crashes with the same stack trace.

Devin fixes the root cause. It adds a unit test for an estimate with no items, and a UI test that removes the last item. Then it runs the full test suite on the simulator.

The final report gives the root cause, the confidence, and the app versions that are affected.

It attaches a write-up, the test logs, and a patch file. This responder did not have permission to push code, so a developer opens the pull request from the patch.

Devin Review reviews the pull requests in each repository. Devin finds root causes from CI logs and production alerts. Devin splits large refactors into small stacked pull requests. Devin writes unit, integration, and end-to-end tests, and Dynamic Workflows run large test jobs the same way every time. All of this works on Linux, macOS, and Windows VMs, with the iOS Simulator and Android emulators. A person approves every merge.

