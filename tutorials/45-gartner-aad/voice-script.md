# Final narration — 51 lines

In this video, I'm going to show you how I build a feature with Devin when I want to stay hands-on: working in the IDE and the terminal next to the agents, instead of handing the whole task off.

I'll use Devin Desktop and the Devin CLI. Local agents, cloud agents, and other agents like Codex and OpenCode all run here, in one app, with one session list.

Setup is short. First, I connect GitHub to my Devin organization.

Then Devin indexes my repositories in DeepWiki. These are the four repos for an insurance claims app: the Java claims service, the customer web portal, an adjuster desktop app, and an iOS app.

DeepWiki gives me, and the agent, an architecture view of each repo. This is the claims service, generated from the code.

In Desktop I open the portal and the service in one workspace. DeepWiki is right here in the IDE too.

Here's my first task. It's a GitHub issue: let customers upload photos and documents to an open claim. Two sentences, no acceptance criteria.

I pick Devin Local as the agent and switch to Plan mode, so it plans before it writes any code.

For the model I pick Fusion, which pairs a frontier model with a faster one to keep the cost down.

I ask it to plan this issue across the service and the portal, with acceptance criteria and a task list that shows what can run in parallel.

Before it writes the plan, it asks me questions: which statuses count as open, where files are stored, which file types and limits. I answer them.

Now I have a spec. It has the context it found in both repos, the decisions we made, and twelve acceptance criteria. Each one is testable: status codes, ownership, file types, limits.

And here's the task list. There's a service track and a portal track, and the plan says which tasks depend on each other and which can run at the same time.

The spec is just a file, so I can edit it. I tighten one criterion: list responses contain attachment metadata only.

Nothing is built until I approve the plan.

I approve it, but I scope this local session to the portal screen only. Other agents get the rest.

For the service track, I open the Devin CLI in the claims service and point it at the same plan file.

Then I type slash handoff and pick Ubuntu. The CLI packages my conversation, my branch, and my uncommitted changes, and a cloud Devin picks it up in its own VM. My environment comes with me.

The cloud agent is building and testing the API while my laptop stays free.

From Desktop I start a second cloud session for the release notes, so the docs are written alongside the code.

For the portal's proxy, I use Codex, running inside Devin Desktop through the Agent Client Protocol. It owns the proxy change and its tests.

Here's the real work side by side: Codex's proxy change, and Devin Local's upload helpers.

And this is what I mean by one surface. Devin Local, Codex, OpenCode, and my two cloud sessions are all in one session list, each with its status and pull request.

The same cloud session is also in the Devin web app, with its PR.

While Devin Local is working, I can queue a message. I edit it before it sends: keep it vanilla JavaScript, no new dependencies.

I can also stop it outright.

Then I give one correction: the button says "Upload file", with a hint for the allowed types and size. It picks up from where it was and makes the change.

OpenCode wrote the customer help page, so I steer it the same way, and it updates the label.

In the CLI, I can ask a quick side question with slash btw, without disrupting the main task. Here I ask where the proxy adds the customer headers, and it answers from the code.

When the portal work is done, I hand it off from Desktop too. I pick Ubuntu again.

The cloud agent receives my uncommitted changes, checks all eight files, runs the tests, and opens the pull request.

Devin fits into my own harness. From Customizations, I open the plugin marketplace and install the official DeepWiki plugin.

MCP servers are listed here. Plugins can bring their own.

Hooks run my own scripts on agent events.

And rules: both repos' AGENTS.md files are always on, so every agent follows the same conventions.

I also want this upload checklist reused next time, so I ask Devin to turn it into a skill. It writes the SKILL.md.

And now it shows up in Skills for any future session.

For context, I generate a Codemap of the upload flow: from the portal, through the proxy, to the controller, the ownership check, validation, and storage. It's built from the code, and each step links back to it.

Then I ask Devin Local to test it on my computer. It opens a browser and uploads a real PNG through the file picker.

The file shows up on the open claim, with its size, and the request returned 201.

The service pull request opens in Desktop's Review. Devin Review found no active bugs here.

But the author noted a race at the twenty-file limit, so I ask Review chat to fix it. It drafts a lock and a concurrency test, and I commit it from here.

Checks pass, and I merge the pull request from Desktop.

On the portal PR, Review flags a critical issue: the demo proxy uses a fixed customer identity. That's a real finding, and it's the kind of thing I'd fix before production.

Cost control starts with the model. Adaptive routes each request to the right model, and Fusion keeps frontier quality at a lower cost.

In the CLI, slash session-stats shows the messages and tokens for the session.

Desktop shows my daily and weekly usage.

Admins control Desktop from organization settings: which models are allowed, and which MCP servers can be used.

The ACP agent registry, and agent hooks for the whole organization.

And usage limits.

So that's assisted development with Devin: a spec I can read and edit, local, cloud, and ACP agents working in parallel, steering in real time, and review and merge, all from one app and one session list.
