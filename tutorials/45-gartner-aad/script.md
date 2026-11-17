# Assisted Application Development — script v3 (final, matches captured footage)

Narrator: Nader, first person. Each line lists the beat(s) shown while it plays; the highlight goes on the named target.

## 1. Intro
1. [S2-02] In this video, I'm going to show you how I build a feature with Devin when I want to stay hands-on: working in the IDE and the terminal next to the agents, instead of handing the whole task off.
2. [PREP-ACP] I'll use Devin Desktop and the Devin CLI. Local agents, cloud agents, and other agents like Codex and OpenCode all run here, in one app, with one session list.

## 2. Setup: connect, index, first task
3. [S1-01] Setup is short. First, I connect GitHub to my Devin organization.
4. [S1-02-claims-portal, S1-02-claims-service, S1-02-adjuster-desktop, S1-02-field-adjuster-ios] Then Devin indexes my repositories in DeepWiki. These are the four repos for an insurance claims app: the Java claims service, the customer web portal, an adjuster desktop app, and an iOS app.
5. [S1-03-final] DeepWiki gives me, and the agent, an architecture view of each repo. This is the claims service, generated from the code.
6. [S1-04, S1-05] In Desktop I open the portal and the service in one workspace. DeepWiki is right here in the IDE too.

## 3. From issue to spec
7. [S2-01] Here's my first task. It's a GitHub issue: let customers upload photos and documents to an open claim. Two sentences, no acceptance criteria.
8. [S2-02, S2-03] I pick Devin Local as the agent and switch to Plan mode, so it plans before it writes any code.
9. [S2-04] For the model I pick Fusion, which pairs a frontier model with a faster one to keep the cost down.
10. [S2-05] I ask it to plan this issue across the service and the portal, with acceptance criteria and a task list that shows what can run in parallel.
11. [S2-05q] Before it writes the plan, it asks me questions: which statuses count as open, where files are stored, which file types and limits. I answer them.
12. [S2-clean-01, S2-clean-02, S2-clean-03] Now I have a spec. It has the context it found in both repos, the decisions we made, and twelve acceptance criteria. Each one is testable: status codes, ownership, file types, limits.
13. [S2-clean-06, S2-clean-07, S2-clean-08] And here's the task list. There's a service track and a portal track, and the plan says which tasks depend on each other and which can run at the same time.
14. [S2-08-before, S2-08] The spec is just a file, so I can edit it. I tighten one criterion: list responses contain attachment metadata only.
15. [S2-09-toolbar, S2-09-restored] Nothing is built until I approve the plan.

## 4. Split the work: local, cloud, and ACP agents
16. [S3-01-scoped-approval] I approve it, but I scope this local session to the portal screen only. Other agents get the rest.
17. [S3-CLI-ready, S3-CLI-plan] For the service track, I open the Devin CLI in the claims service and point it at the same plan file.
18. [S3-CLI-handoff-command, S3-CLI-ubuntu, S3-CLI-handoff-connected] Then I type slash handoff and pick Ubuntu. The CLI packages my conversation, my branch, and my uncommitted changes, and a cloud Devin picks it up in its own VM. My environment comes with me.
19. [S3-CLI-cloud-agent, S3-CLI-cloud-url-final] The cloud agent is building and testing the API while my laptop stays free.
20. [S3-03-cloud-docs] From Desktop I start a second cloud session for the release notes, so the docs are written alongside the code.
21. [S4-01-codex] For the portal's proxy, I use Codex, running inside Devin Desktop through the Agent Client Protocol. It owns the proxy change and its tests.
22. [S4-real-edits-readable] Here's the real work side by side: Codex's proxy change, and Devin Local's upload helpers.
23. [S3-mixed-complete] And this is what I mean by one surface. Devin Local, Codex, OpenCode, and my two cloud sessions are all in one session list, each with its status and pull request.
24. [S3-cloud-web] The same cloud session is also in the Devin web app, with its PR.

## 5. Interrupt and steer
25. [S5-02-edit-verified, S5-03-update-verified] While Devin Local is working, I can queue a message. I edit it before it sends: keep it vanilla JavaScript, no new dependencies.
26. [S5-05-stop-verified] I can also stop it outright.
27. [S5-correction-continued] Then I give one correction: the button says "Upload file", with a hint for the allowed types and size. It picks up from where it was and makes the change.
28. [S4-opencode-steering, S4-opencode-corrected] OpenCode wrote the customer help page, so I steer it the same way, and it updates the label.
29. [S5-btw-complete] In the CLI, I can ask a quick side question with slash btw, without disrupting the main task. Here I ask where the proxy adds the customer headers, and it answers from the code.

## 6. Move local work to the cloud
30. [S5-portal-handoff-prompt, S5-portal-platform] When the portal work is done, I hand it off from Desktop too. I pick Ubuntu again.
31. [S5-portal-cloud-pickup, S5-portal-PR-result] The cloud agent receives my uncommitted changes, checks all eight files, runs the tests, and opens the pull request.

## 7. Customize the harness
32. [S6-marketplace, S6-plugin-installed] Devin fits into my own harness. From Customizations, I open the plugin marketplace and install the official DeepWiki plugin.
33. [S6-mcps] MCP servers are listed here. Plugins can bring their own.
34. [S6-hooks] Hooks run my own scripts on agent events.
35. [S6-rules-agents-clean] And rules: both repos' AGENTS.md files are always on, so every agent follows the same conventions.
36. [S6-create-skill-prompt, S6-skill-file] I also want this upload checklist reused next time, so I ask Devin to turn it into a skill. It writes the SKILL.md.
37. [S6-skill-listed] And now it shows up in Skills for any future session.

## 8. Artifacts and testing
38. [S7-codemap-final] For context, I generate a Codemap of the upload flow: from the portal, through the proxy, to the controller, the ownership check, validation, and storage. It's built from the code, and each step links back to it.
39. [S7-browser-session-evidence] Then I ask Devin Local to test it on my computer. It opens a browser and uploads a real PNG through the file picker.
40. [S7-browser-upload-result] The file shows up on the open claim, with its size, and the request returned 201.

## 9. Review and merge
41. [S8-service-findings] The service pull request opens in Desktop's Review. Devin Review found no active bugs here.
42. [S8-service-review-chat-proposal, S8-service-commit-draft] But the author noted a race at the twenty-file limit, so I ask Review chat to fix it. It drafts a lock and a concurrency test, and I commit it from here.
43. [S8-service-ready, S8-service-merged] Checks pass, and I merge the pull request from Desktop.
44. [S8-portal-review] On the portal PR, Review flags a critical issue: the demo proxy uses a fixed customer identity. That's a real finding, and it's the kind of thing I'd fix before production.

## 10. Cost and governance
45. [S9-model-picker] Cost control starts with the model. Adaptive routes each request to the right model, and Fusion keeps frontier quality at a lower cost.
46. [S9-cli-stats] In the CLI, slash session-stats shows the messages and tokens for the session.
47. [S9-desktop-usage-home] Desktop shows my daily and weekly usage.
48. [S9-web-model-allowlist, S9-web-mcp-registry] Admins control Desktop from organization settings: which models are allowed, and which MCP servers can be used.
49. [S9-web-acp-registry, S9-web-agent-hooks] The ACP agent registry, and agent hooks for the whole organization.
50. [S9-web-usage-limits] And usage limits.

## 11. Close
51. [S3-mixed-complete] So that's assisted development with Devin: a spec I can read and edit, local, cloud, and ACP agents working in parallel, steering in real time, and review and merge, all from one app and one session list.
