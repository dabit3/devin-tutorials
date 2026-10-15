# Devin across the SDLC — expanded introduction

Nader voice. One continuous take, cut locally at sentence boundaries. ElevenLabs defaults; no seed.

## overview

Devin is more than a coding assistant; it connects code understanding, implementation, testing, review, security, and production feedback into a software development lifecycle your team can direct.

## deepwiki

DeepWiki turns connected repositories into documentation, architecture diagrams, and source-linked explanations, giving both you and Devin a clearer understanding of the system before anyone makes a change.

## Proof — Real architecture documentation, grounded in the source

This repository wiki shows generated architecture diagrams alongside links back to the source.

## plan

Ask Devin uses that codebase context to answer questions and help plan changes, while connected Jira and Linear tickets give Devin another way to analyze and scope the work.

## Proof — The plan points to the files that need to change

The plan here identifies the relevant files, so the handoff starts with a concrete approach.

## build

Once you delegate a task, Devin works asynchronously in its own environment with code, a shell, and a browser; repository blueprints prepare the tools and dependencies, and the result is a pull request following your conventions.

## Proof — The work lands in a normal pull request

This completed session opened a pull request in the demo repository, ready for review.

## fusion

In Devin CLI and Desktop, Fusion pairs a frontier lead model that plans, investigates, and checks correctness with an efficient sidekick that implements the plan and runs builds and tests, while you interact with a single Devin.

## adaptive

Fusion is model collaboration rather than a single model router; Adaptive is the separate option that evaluates each request and selects an underlying model, balancing the complexity of the task with efficiency.

## managed

For work spanning modules or repositories, a coordinator can delegate to managed Devins in separate virtual machines, monitor progress, resolve conflicts, and combine their results into a coordinated outcome.

## test

Testing is part of the implementation loop: Devin can write new tests using your team's patterns, run existing suites, lint, and type checks, fix failures, and report what it actually checked.

## Proof — The PR explains the checks that were run

The pull request records the test commands and the browser checks used to verify this change.

## computer

Computer Use adds behavioral testing by letting Devin operate a browser or desktop, interact with the running interface, visually verify the result, and produce recordings or screenshots you can inspect.

## Proof — UI testing produces visible evidence

Here, the session includes a recording of the application being exercised in the browser.

## review

Devin Review provides a first pass for correctness and team standards; when Auto-Fix is enabled, review comments, flagged bugs, and failing checks can flow back into the same pull request as fixes.

## Proof — Review findings appear next to the diff

This review found two bugs, with each finding available alongside the code under review.

## secure

Security fits the same workflow: Devin can address findings from scanners such as SonarQube, Fortify, and Veracode, and implement compliance-related changes across repositories without replacing your existing security policies.

## Proof — A flagged finding links to its fix pull request

This security finding has a linked change, so the proposed fix can be reviewed through a pull request.

## ship

Devin's pull requests follow the same branch protections as a human engineer's; your team reviews and decides what to merge, and existing applications ship through your own delivery pipeline.

## mcp

MCP, the Model Context Protocol, extends Devin beyond the repository by exposing tools from external systems; install an integration's plugin, authorize its connection, and Devin can use the tools that server makes available.

## Proof — A plugin can supply an enabled MCP server

This installed plugin includes an enabled MCP server, making its tools available to Devin.

## services

Datadog and Sentry connections let Devin investigate logs and errors, while Metabase brings analytics context; together, connected observability and data tools can help relate a production symptom to the code and the users it affects.

## data

For data-focused questions, Devin's Data Analyst can query connected sources, analyze metrics and trends, and create visualizations from Slack or the web app, giving engineering decisions more than code alone to work with.

## automation

Automations supply the timing: a trigger detects an event or schedule, conditions narrow what should run, and an action starts or messages a Devin session with the event payload included as context.

## Proof — A failing GitHub check starts a session with defined instructions

This automation watches for a failing GitHub check and starts a session with instructions to fix that branch.

## triggers

That can mean fixing a CI failure, sweeping Sentry errors every day, updating dependencies each week, or investigating a Datadog alert through a webhook, using connected MCP tools inside the resulting session.

## Proof — The automation’s event history links to the work it started

The event history here shows completed automation runs and links to the sessions they started.

## incident

In a production-feedback workflow, an alert can start an investigation, MCP tools supply runtime evidence, Devin uses codebase context to investigate and test a fix, and your team reviews the pull request before releasing through its pipeline.

## practices

Skills and playbooks make your team's procedures reusable, while personal memory carries preferences and project lessons into your future sessions; automation-started sessions do not use that personal memory, so shared workflows belong in reusable instructions.

## uses

The highest-value work often connects several stages: shipping a feature, coordinating a migration, raising test coverage, or reducing a security backlog, with context, verification, and review built into the outcome.

## system

The pieces fit together: DeepWiki and Ask Devin explain the system, sessions execute the work, MCPs bring outside context, automations keep the loop moving, and your engineering process determines what ships.

## Closing

Devin supports the entire software lifecycle, while your team stays in control of the priorities, the process, and what ships.
