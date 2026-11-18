# How we keep code quality high with Devin (v10): narration script

Today, I'll walk through how we use Devin to keep code quality high across the development life cycle.

We'll cover debugging, testing, refactoring, security and code review, using three of Devin's specialized agents: Devin Oncall, Devin Security and Devin Review.

Each one is built for a single job. Oncall is a site reliability agent with its own harness. Security uses agentic MapReduce to scan a whole codebase. Review uses adversarial agents, where some agents find problems and others try to disprove them.

Our example is an insurance claims platform with four repositories: a Java service, a web portal, a Windows desktop app and an iOS app. Devin works across all of them in one session.

Before any work starts, Devin pulls in our context. That includes the AGENTS.md file in each repository, our runbooks, and tools like Slack that we connect through MCP.

One rule in AGENTS.md is that every bug fix ships with a regression test. You'll see that rule come up throughout this video.

Devin also writes our documentation. DeepWiki generates architecture docs and diagrams for each repository, with links back to the source code.

When I have a question, I ask in chat. Here I ask how a claim moves from submission to approval, and Devin answers with links to the code.

Our story starts in production, where a bug has slipped through. When our iOS app crashes, it sends a crash report to a webhook, and that webhook triggers Devin Oncall.

Here's the alert. It has the stack trace and the breadcrumbs, which are the last steps the user took before the crash.

Oncall starts a session on its own. Because this is an iOS bug, it runs on a macOS VM with the iOS Simulator.

On its own computer, it follows the breadcrumbs in the Simulator, removes the last line item, and gets the same crash. The cause is a division by zero when an estimate has no line items.

It fixes the root cause and adds three regression tests: two unit tests and a UI test that removes the last line item.

Then it writes a report: what happened, how it reproduced it, what it changed, and how confident it is in the fix.

The same flow works on Windows. Here an adjuster's desktop app crashes when approving a claim.

Oncall runs this one on a Windows VM. It reproduces the exception, finds a missing claim type in the approval rules, and adds unit tests and a UI test.

I can review either fix wherever I work: in Devin's web app or in Devin Desktop.

Next, testing. Our claims service has thin test coverage, so I ask Devin to write a test suite for it.

Devin writes unit tests for the business rules, integration tests for the API, and an end-to-end test over HTTP.

It runs the whole suite, reads any failures, fixes them, and runs it again until it passes.

For apps with a UI, Devin tests in the running app on its own computer. On Windows it drives our desktop app, and on Linux it runs our Android app in an emulator.

It attaches the recording and screenshots to the pull request, so the reviewer can see the test run without running it.

Devin can run tests on Linux, macOS and Windows VMs, in the iOS Simulator and in Android emulators.

Devin Review is a specialized review agent, and every pull request opens in it. As an admin, I choose which repositories it covers and how deep it goes. Here it's set to the highest review tier for all four.

On this pull request, Review found an issue and labeled it with its CWE, the standard ID for the type of weakness.

I can ask Review about it in chat. Here I ask how a user could exploit it, and it explains with references to the code.

This pull request also has a failing build. Devin reads the CI logs, reproduces the failure on a VM, fixes it, and adds a regression test.

Then it reruns the build, and the checks pass.

Large changes are easier to review in small steps. Here Devin splits a refactor into a stack of three pull requests, each one building on the last.

Along the way, Devin adds comments to the code it changed and updates the module's README. Each pull request passes CI and has no open Review findings, so the team can merge them in order.

Devin Security is a specialized adversarial agent: it reads our code the way an attacker would. Some problems only show up across the whole codebase, so it scans the full repository, and it asks about our threat model first.

Here it found a chained vulnerability. One service trusts a header that another service never checks, so a user can read other customers' claims.

Security writes down its reasoning, then verifies that the attack works before it reports it.

One click on Fix with Devin starts a session that fixes it, adds tests, and opens a pull request, which Review then checks like any other change.

For bigger jobs, we use dynamic workflows. A workflow combines fixed steps, like running coverage tools, with steps where agents decide what to do.

Here a workflow finds the packages with low coverage, then starts one agent for each package to write and run tests. Each agent has its own session and context.

We manage all of these agents from one place. I can see every session, and the same agents run from Slack, Devin Desktop and the API.

As an admin, I control which repositories each agent can access, what they can spend, and I can see usage across the team.

Devin opens pull requests, and a person on our team approves every merge.

So we went from a production alert to a tested fix, from thin coverage to a full test suite, and from a pull request to a reviewed, secure change, all with Devin's specialized agents.
