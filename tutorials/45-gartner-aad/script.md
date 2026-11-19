# Assisted Application Development — script v3 (final, matches captured footage)

Narrator: Nader, first person. Each On Screen tag describes the accepted native live-recording sources. Full windows, real cursor, straight cuts; no added highlights, captions, cards or masks. Historical actions are retained evidence, not repeated work.

## 1. Intro
1. [On Screen: Native Desktop IDE: readable claims spec and acceptance criteria, both repositories, terminal and retained agent pane] In this video, I'm going to show you how I build a feature with Devin when I want to stay hands-on: working in the IDE and the terminal next to the agents, instead of handing the whole task off.
2. [On Screen: Desktop IDE, original Devin CLI transcript in Konsole, then native six-session list and Devin Local/Codex/OpenCode chooser] I'll use Devin Desktop and the Devin CLI. Local agents, cloud agents, and other agents like Codex and OpenCode all run here, in one app, with one session list.

## 2. Setup: connect, index, first task
3. [On Screen: Full Chrome organization Connections page with GitHub Connected] Setup is short. First, I connect GitHub to my Devin organization.
4. [On Screen: Full Chrome DeepWiki index; cursor rests on claims-service, claims-portal, adjuster-desktop, field-adjuster-ios in narration order] Then Devin indexes my repositories in DeepWiki. These are the four repos for an insurance claims app: the Java claims service, the customer web portal, an adjuster desktop app, and an iOS app.
5. [On Screen: Full Chrome claims-service DeepWiki architecture overview generated from repository code] DeepWiki gives me, and the agent, an architecture view of each repo. This is the claims service, generated from the code.
6. [On Screen: Desktop Explorer shows claims-portal and claims-service roots, then settled cached in-IDE DeepWiki explanation] In Desktop I open the portal and the service in one workspace. DeepWiki is right here in the IDE too.

## 3. From issue to spec
7. [On Screen: Full Chrome original GitHub issue 38: customer attachments request] Here's my first task. It's a GitHub issue: let customers upload photos and documents to an open claim. Two sentences, no acceptance criteria.
8. [On Screen: Native Devin Local and Plan controls in Desktop; no new task submitted] I pick Devin Local as the agent and switch to Plan mode, so it plans before it writes any code.
9. [On Screen: Native Fusion model picker in Desktop] For the model I pick Fusion, which pairs a frontier model with a faster one to keep the cost down.
10. [On Screen: Original submitted Devin Local cross-repository planning request; no fresh draft typing] I ask it to plan this issue across the service and the portal, with acceptance criteria and a task list that shows what can run in parallel.
11. [On Screen: Original expanded clarification questions and submitted answers in Devin Local] Before it writes the plan, it asks me questions: which statuses count as open, where files are stored, which file types and limits. I answer them.
12. [On Screen: Readable retained spec with cross-repository decisions and twelve acceptance criteria] Now I have a spec. It has the context it found in both repos, the decisions we made, and twelve acceptance criteria. Each one is testable: status codes, ownership, file types, limits.
13. [On Screen: Retained parallelism prose and service/portal dependency graph] And here's the task list. There's a service track and a portal track, and the plan says which tasks depend on each other and which can run at the same time.
14. [On Screen: Explorer-opened scratch plan copy: edited AC8 metadata-only criterion; original source plan unchanged] The spec is just a file, so I can edit it. I tighten one criterion: list responses contain attachment metadata only.
15. [On Screen: Original retained approval controls and scoped-plan context; no new approval] Nothing is built until I approve the plan.

## 4. Split the work: local, cloud, and ACP agents
16. [On Screen: Original submitted portal-only scoped approval in Devin Local] I approve it, but I scope this local session to the portal screen only. Other agents get the rest.
17. [On Screen: Full Konsole original submitted Devin CLI service-track request referencing the plan] For the service track, I open the Devin CLI in the claims service and point it at the same plan file.
18. [On Screen: Full Konsole slash-handoff command, native Ubuntu chooser, then original retained transfer history; chooser escaped, no duplicate transfer] Then I type slash handoff and pick Ubuntu. The CLI packages my conversation, my branch, and my uncommitted changes, and a cloud Devin picks it up in its own VM. My environment comes with me.
19. [On Screen: Full Konsole retained cloud agent build/test context and original session URL] The cloud agent is building and testing the API while my laptop stays free.
20. [On Screen: Desktop original completed docs-only cloud task and PR39; no new cloud task] From Desktop I start a second cloud session for the release notes, so the docs are written alongside the code.
21. [On Screen: Desktop native Codex ACP identity followed by trusted proxy.js and proxy.test.js; root trust refused, not inaccessible ACP chat] For the portal's proxy, I use Codex, running inside Devin Desktop through the Agent Client Protocol. It owns the proxy change and its tests.
22. [On Screen: Trusted proxy/test files and Devin Local upload helpers side by side in Desktop editor] Here's the real work side by side: Codex's proxy change, and Devin Local's upload helpers.
23. [On Screen: Native six-session list with local/ACP/cloud status and PR icons plus readable Devin Local/Codex/OpenCode chooser] And this is what I mean by one surface. Devin Local, Codex, OpenCode, and my two cloud sessions are all in one session list, each with its status and pull request.
24. [On Screen: Full Chrome original cloud session and current native PR16 merged event; older Not merged prose is historical] The same cloud session is also in the Devin web app, with its PR.

## 5. Interrupt and steer
25. [On Screen: Original Devin Local transcript: retained edited constraint keep it vanilla JavaScript, no new dependencies; not a new live queue edit] While Devin Local is working, I can queue a message. I edit it before it sends: keep it vanilla JavaScript, no new dependencies.
26. [On Screen: Original Devin Local Canceled due to user interrupt marker; no fabricated Stopped label or new interruption] I can also stop it outright.
27. [On Screen: Original Upload file label and allowed-types/size correction, then retained resulting change; historical cursor-and-scroll sources] Then I give one correction: the button should say "Upload file", with a hint for the allowed types and size.
28. [On Screen: Retained OpenCode steering, label diff and acknowledgement; no fresh task] OpenCode wrote the customer help page, so I steer it the same way, and it updates the label.
29. [On Screen: Full Konsole genuine completed slash-btw proxy customer-header question and code-based answer] In the CLI, I can ask a quick side question with slash btw, without disrupting the main task. Here I ask where the proxy adds the customer headers, and it answers from the code.

## 6. Move local work to the cloud
30. [On Screen: Native Desktop handoff Ubuntu chooser, dismissed with Escape; original transfer continues in next line] When the portal work is done, I hand it off from Desktop too. I pick Ubuntu again.
31. [On Screen: Original retained cloud pickup, eight-file checks, tests and pull-request result; no new transfer] The cloud agent receives my uncommitted changes, checks all eight files, runs the tests, and opens the pull request.

## 7. Customize the harness
32. [On Screen: Actual DeepWiki customization/plugin evidence and settled cached in-IDE content; no new installation] Devin fits into my own harness. From Customizations, I open the plugin marketplace and install the official DeepWiki plugin.
33. [On Screen: Actual native MCP server configuration list; no configuration change] MCP servers are listed here. Plugins can bring their own.
34. [On Screen: Actual native Hooks on this machine list and local event configuration; no hook executed] Hooks run my own scripts on agent events.
35. [On Screen: Both repositories actual AGENTS.md rule configuration/files; no rule changes] And rules: both repos' AGENTS.md files are always on, so every agent follows the same conventions.
36. [On Screen: Original skill-creation request/history followed by actual SKILL.md file; no new prompt or generation] I also want this upload checklist reused next time, so I ask Devin to turn it into a skill. It writes the SKILL.md.
37. [On Screen: Actual native Skills list with the retained upload skill] And now it shows up in Skills for any future session.

## 8. Artifacts and testing
38. [On Screen: Actual retained upload-flow Codemap with portal, proxy, controller, ownership, validation and storage links] For context, I generate a Codemap of the upload flow: from the portal, through the proxy, to the controller, the ownership check, validation, and storage. It's built from the code, and each step links back to it.
39. [On Screen: Retained real browser-test transcript/evidence in Desktop; no new browser or E2E execution] Then I ask Devin Local to test it on my computer. It opens a browser and uploads a real PNG through the file picker.
40. [On Screen: Retained real upload receipt with PNG, size and HTTP201 evidence; no new test claim] The file shows up on the open claim, with its size, and the request returned 201.

## 9. Review and merge
41. [On Screen: Native service PR16 Desktop Review with no active findings] The service pull request opens in Desktop's Review. Devin Review found no active bugs here.
42. [On Screen: Original author race limitation and submitted Review request, then retained lock/concurrency-test edits and applied published commit bff8ce8; no new commit/test] But the author noted a race at the twenty-file limit, so I ask Review chat to fix it. It drafts a lock and a concurrency test, and I commit it from here.
43. [On Screen: Native retained PR16 passed-checks and merged state; no new merge] Checks pass, and I merge the pull request from Desktop.
44. [On Screen: Native PR40 active Critical fixed-customer-identity finding and actual proxy.js; finding remains unfixed] On the portal PR, Review flags a critical issue: the demo proxy uses a fixed customer identity. That's a real finding, and it's the kind of thing I'd fix before production.

## 10. Cost and governance
45. [On Screen: Native Adaptive/Fusion model picker and hover descriptions; no model changes] Cost control starts with the model. Adaptive routes each request to the right model, and Fusion keeps frontier quality at a lower cost.
46. [On Screen: Full Konsole genuine slash-session-stats receipt with message and token counts] In the CLI, slash session-stats shows the messages and tokens for the session.
47. [On Screen: Native Desktop daily/weekly Usage and Limits view] Desktop shows my daily and weekly usage.
48. [On Screen: Full Chrome organization Models controls, then actual MCP controls; no policy edits] Admins control Desktop from organization settings: which models are allowed, and which MCP servers can be used.
49. [On Screen: Full Chrome native ACP agent registry and organization Agent hooks controls; no populated-registry or executed-hook claim] The ACP agent registry, and agent hooks for the whole organization.
50. [On Screen: Full Chrome real organization Usage and Limits page reached through native navigation] And usage limits.

## 11. Close
51. [On Screen: Existing spec, mixed-agent session list/chooser, original steering correction, retained PR16 merged Review, then original result and six-session list; no new work] So that's assisted development with Devin: a spec I can read and edit, local, cloud, and ACP agents working in parallel, steering in real time, and review and merge, all from one app and one session list.
