# Devin across the SDLC — expanded introduction

Nader voice (eleven_multilingual_v2, default settings). The whole script is one continuous ElevenLabs take (one request, no seed), cut locally at sentence boundaries. Two narrated cuts share this script: one with the kit's light music bed and one with the upbeat music track.

## overview

Devin is more than a coding assistant. It connects every stage of the software lifecycle, from understanding the code to production feedback. Your team directs the whole process.

## deepwiki

DeepWiki turns your repositories into documentation, architecture diagrams, and source-linked explanations. That gives you and Devin a clear picture of the system before anyone makes a change.

## Proof — Real architecture documentation, grounded in the source

This repository wiki shows generated architecture diagrams with links back to the source.

## plan

Ask Devin uses that context to answer questions and plan changes. Devin can also analyze and scope connected Jira and Linear tickets.

## Proof — The plan points to the files that need to change

Here, the plan points to the exact files that need to change.

## build

When you delegate a task, Devin works asynchronously in its own virtual machine, with code, a shell, and a browser. Those machines can run Linux, macOS, or Windows. Repository blueprints prepare the tools and dependencies. The result is a pull request that follows your conventions.

## Proof — The work lands in a normal pull request

This session opened a pull request in the demo repository, ready for review.

## fusion

Devin Cloud offers many model options, and Fusion is one of the most important. Fusion runs two agents in parallel: a frontier lead and a cost-effective sidekick. The lead makes the key decisions, like the plan and the final review, and delegates the rest. Each agent keeps its own context, and Devin can switch models mid-session as the task changes. On Cognition's coding benchmark, that kept frontier-level performance at up to sixty percent lower cost.

## managed

For work that spans modules or repositories, a coordinator can delegate to managed Devins, each in its own virtual machine. It monitors their progress, resolves conflicts, and combines the results.

## test

Testing is part of the implementation loop. Devin can write new tests in your team's style, run your suites, lint, and type checks, and fix failures. Then it reports what it actually checked.

## Proof — The PR explains the checks that were run

The pull request lists the test commands and browser checks that verified this change.

## computer

Then Devin verifies the change the way a user would. With Computer Use, it can operate a browser or desktop application, interact with the running interface, and visually verify the result. It also captures screenshots and recordings you can inspect.

## Proof — UI testing produces visible evidence

Here, the session includes a recording of the app being tested.

## review

Devin Review gives every pull request a first pass for correctness and team standards. With Auto-Fix enabled, review comments, flagged bugs, and failing checks flow back into the same pull request as fixes.

## Proof — Review findings appear next to the diff

This review found two bugs, each shown right next to the code.

## secure

Security fits the same workflow. Devin can fix findings from scanners like SonarQube, Fortify, and Veracode. It can also make compliance changes across repositories, within your existing security policies.

## Proof — A flagged finding links to its fix pull request

This security finding links to its fix, ready to review as a pull request.

## ship

Devin's pull requests follow the same branch protections as a human engineer's. Your team reviews and decides what to merge. Existing applications ship through your own delivery pipeline.

## mcp

MCP extends Devin beyond the repository. Install an integration's plugin and authorize its connection. Devin can then use the tools that server makes available.

## Proof — A plugin can supply an enabled MCP server

This installed plugin includes an enabled MCP server, so its tools are available to Devin.

## services

With Datadog and Sentry connected, Devin can investigate logs and errors. Metabase adds analytics context. Together, they help connect a production symptom to the code and the users it affects.

## data

For data questions, Devin's Data Analyst can query connected sources, analyze metrics and trends, and create visualizations. You can ask from Slack, the web app, or the mobile app. It works anywhere Devin is accessible, so engineering decisions can draw on more than code.

## automation

Automations decide when work starts. You can create one just by describing it in natural language. A trigger detects an event or a schedule, and conditions narrow what should run. The action starts or messages a Devin session, with the event payload included as context.

## Proof — A failing GitHub check starts a session with defined instructions

This automation watches for a failing GitHub check. It starts a session with instructions to fix that branch.

## triggers

That could mean fixing a CI failure, sweeping Sentry errors every day, or updating dependencies each week. A webhook can also start an investigation from a Datadog alert, with connected MCP tools inside the session.

## Proof — The automation’s event history links to the work it started

The event history shows completed runs, with links to the sessions they started.

## incident

Here's how it fits together in production. An alert starts an investigation, and MCP tools supply runtime evidence. Devin uses codebase context to investigate and test a fix. Your team reviews the pull request before it ships through your pipeline.

## practices

Skills and playbooks make your team's procedures reusable. Personal memory carries your preferences and project lessons into future sessions. Automation-started sessions don't use personal memory, so shared workflows belong in reusable instructions.

## uses

The highest-value work often spans several stages. Think of shipping a feature, coordinating a migration, raising test coverage, or reducing a security backlog. Context, verification, and review are built into each one.

## system

Here's the whole system. DeepWiki and Ask Devin explain the code, sessions do the work, and MCPs bring in outside context. Automations keep the loop moving, and your engineering process decides what ships.

## outro

Devin supports the entire software lifecycle. Your team stays in control of the priorities, the process, and what ships.
