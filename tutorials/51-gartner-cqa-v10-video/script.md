# How we keep code quality high with Devin — script v10 (first person)

**Format (follows "Requirements and planning in Devin Cloud"):** a title card, then real screen recordings of me using the product in 4K, with a visible cursor. The camera stays still; light highlight boxes mark the thing each line names. Section cards name the product ("Devin Oncall", "Devin Review", "Devin Security"). When a line says Devin tests or reproduces something in a running app, the screen shows Devin's own computer from that session. A session's right panel is open only when it shows something relevant. The narration is first person, in Nader's voice, with no music or sound effects.

**Demo setup:** our insurance claims platform has four repos: claims-service (Java), a customer web portal, adjuster-desktop (Windows WPF) and field-adjuster-ios (iOS). We add an Android app for the emulator section.

| # | Narration | On screen (recorded live) |
|---|---|---|
| | **Title card:** "Code quality assurance with Devin" / "From a production alert or a pull request to tested, reviewed code" | Title card |
| 1 | Today, I'll walk through how we use Devin to keep code quality high across the development life cycle. | Devin home |
| 2 | We'll cover debugging, testing, refactoring, security and code review, using three of Devin's specialized agents: Devin Oncall, Devin Security and Devin Review. | I open Oncall, Security and Review in the sidebar |
| 3 | Each one is built for a single job. Oncall is a site reliability agent with its own harness. Security uses agentic MapReduce to scan a whole codebase. Review uses adversarial agents, where some agents find problems and others try to disprove them. | Each agent's page as it's named |
| 4 | Our example is an insurance claims platform with four repositories: a Java service, a web portal, a Windows desktop app and an iOS app. Devin works across all of them in one session. | Repositories settings, then the session that read all four repos (right panel closed, its summary line highlighted) |
| 5 | Before any work starts, Devin pulls in our context. That includes the AGENTS.md file in each repository, our runbooks, and tools like Slack that we connect through MCP. | AGENTS.md in claims-service, Oncall's MCP and runbook settings, then Connections with Slack |
| 6 | One rule in AGENTS.md is that every bug fix ships with a regression test. You'll see that rule come up throughout this video. | The rule in AGENTS.md |
| 6a | Devin also writes our documentation. DeepWiki generates architecture docs and diagrams for each repository, with links back to the source code. | claims-service DeepWiki: the architecture diagram and its source links |
| 6b | When I have a question, I ask in chat. Here I ask how a claim moves from submission to approval, and Devin answers with links to the code. | I type the question in Ask Devin; the answer with code links |
| | **Section card:** "Devin Oncall" / "Production crashes on macOS and Windows" | |
| 7 | Our story starts in production, where a bug has slipped through. When our iOS app crashes, it sends a crash report to a webhook, and that webhook triggers Devin Oncall. | Oncall responder: webhook trigger and its URL |
| 8 | Here's the alert. It has the stack trace and the breadcrumbs, which are the last steps the user took before the crash. | The alert payload, scrolled through |
| 9 | Oncall starts a session on its own. Because this is an iOS bug, it runs on a macOS VM with the iOS Simulator. | The session with its macOS badge, then its Computer tab: the macOS desktop with the Simulator |
| 10 | On its own computer, it follows the breadcrumbs in the Simulator, removes the last line item, and gets the same crash. The cause is a division by zero when an estimate has no line items. | Devin's computer: the estimate in the Simulator as the line items are removed, then the root cause in chat |
| 11 | It fixes the root cause and adds three regression tests: two unit tests and a UI test that removes the last line item. | The diff and the tests |
| 12 | Then it writes a report: what happened, how it reproduced it, what it changed, and how confident it is in the fix. | I scroll the report |
| 13 | The same flow works on Windows. Here an adjuster's desktop app crashes when approving a claim. | Windows Oncall alert |
| 14 | Oncall runs this one on a Windows VM. It reproduces the exception, finds a missing claim type in the approval rules, and adds unit tests and a UI test. | The Windows session and patch |
| 15 | I can review either fix wherever I work: in Devin's web app or in Devin Desktop. | Oncall's PR in the web app, then Review in Devin Desktop |
| | **Section card:** "Testing with Devin" / "Generated suites, UI tests, recordings" | |
| 16 | Next, testing. Our claims service has thin test coverage, so I ask Devin to write a test suite for it. | My prompt in the session |
| 17 | Devin writes unit tests for the business rules, integration tests for the API, and an end-to-end test over HTTP. | The suite PR, grouped by test type |
| 18 | It runs the whole suite, reads any failures, fixes them, and runs it again until it passes. | The test run output in the session |
| 19 | For apps with a UI, Devin tests in the running app on its own computer. On Windows it drives our desktop app, and on Linux it runs our Android app in an emulator. | Devin's computer on the Windows VM driving the claims app, then its computer running the Android app in the emulator |
| 20 | It attaches the recording and screenshots to the pull request, so the reviewer can see the test run without running it. | field-adjuster-android PR #1 with the emulator screenshot and a frame from Devin's test recording |
| 21 | Devin can run tests on Linux, macOS and Windows VMs, in the iOS Simulator and in Android emulators. | The session host picker |
| | **Section card:** "Devin Review" / "Code review on every pull request" | |
| 22 | Devin Review is a specialized review agent, and every pull request opens in it. As an admin, I choose which repositories it covers and how deep it goes. Here it's set to the highest review tier for all four. | Review pull request list, then Review settings: repos and tier |
| 23 | On this pull request, Review found an issue and labeled it with its CWE, the standard ID for the type of weakness. | Review PR #9 findings list, the CWE-tagged finding highlighted |
| 24 | I can ask Review about it in chat. Here I ask how a user could exploit it, and it explains with references to the code. | I type the question and read the answer |
| 25 | This pull request also has a failing build. Devin reads the CI logs, reproduces the failure on a VM, fixes it, and adds a regression test. | The fix session on macOS: the CI failure, then the regression tests |
| 26 | Then it reruns the build, and the checks pass. | The session reports the build passing and Review green |
| 27 | Large changes are easier to review in small steps. Here Devin splits a refactor into a stack of three pull requests, each one building on the last. | The stack of three PRs |
| 28 | Along the way, Devin adds comments to the code it changed and updates the module's README. Each pull request passes CI and has no open Review findings, so the team can merge them in order. | A doc comment in PR #12, the README diff in #14, then #14 in Review |
| | **Section card:** "Devin Security" / "Whole-codebase vulnerability scans" | |
| 29 | Devin Security is a specialized adversarial agent: it reads our code the way an attacker would. Some problems only show up across the whole codebase, so it scans the full repository, and it asks about our threat model first. | Security overview, then scan setup with its questions |
| 30 | Here it found a chained vulnerability. One service trusts a header that another service never checks, so a user can read other customers' claims. | The finding |
| 31 | Security writes down its reasoning, then verifies that the attack works before it reports it. | The reasoning and verification |
| 32 | One click on Fix with Devin starts a session that fixes it, adds tests, and opens a pull request, which Review then checks like any other change. | The Fix with Devin button, the fix session, the PR, then Review on it |
| | **Section card:** "Dynamic workflows and governance" / "Running agents at scale" | |
| 33 | For bigger jobs, we use dynamic workflows. A workflow combines fixed steps, like running coverage tools, with steps where agents decide what to do. | The workflow script |
| 34 | Here a workflow finds the packages with low coverage, then starts one agent for each package to write and run tests. Each agent has its own session and context. | The workflow running, then the child sessions in the sidebar |
| 35 | We manage all of these agents from one place. I can see every session, and the same agents run from Slack, Devin Desktop and the API. | Sessions list, Slack, Desktop, API page |
| 36 | As an admin, I control which repositories each agent can access, what they can spend, and I can see usage across the team. | Review settings repos, usage policies, then the usage dashboard |
| 37 | Devin opens pull requests, and a person on our team approves every merge. | GitHub merge box |
| 38 | So we went from a production alert to a tested fix, from thin coverage to a full test suite, and from a pull request to a reviewed, secure change, all with Devin's specialized agents. | Review list with every PR from the video |

**Length:** under 9:00.
