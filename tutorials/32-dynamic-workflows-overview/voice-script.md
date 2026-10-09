# Dynamic Workflows: how it works (overview), voice script

Narrated by Nader (ElevenLabs voice T8iHhGIWPm2GVYpQD1Am, default settings), generated as one take and cut at sentence boundaries.

With dynamic workflows, Devin writes a Python script that runs a whole team of Devin agents for you.

The script decides which agents run, in what order, and what each one is told, using earlier results to build later prompts.

Here, I ask for one accessibility reviewer per component, then one merged list.

Devin finds twelve files and plans twelve reviewers, plus a consolidation step.

The workflow panel shows each phase, its agents, and their live status.

The script Devin wrote is right there too, so you can read exactly how the run works.

A pipeline moves each item through its stages on its own, while parallel waits for every result before a merge step.

This run used parallel, so the consolidation agent only started once all twelve reviews were done.

Twelve reviews became one report of ten deduplicated findings, ordered by severity.

Every agent call is recorded, so an interrupted run replays its finished agents instantly, and only unfinished work runs again.

In Settings, under Preferences, Auto-approve workflows lets Devin run workflows without asking first.

Use a workflow for wide fan-out with a combine step, or staged work; for mechanical changes, a couple of sessions, or tightly coupled work, a plain session fits better.

Every agent is a session, so try a slice first, then save the working workflow as a skill.

Use it for migrations, research, code review, codebase-wide audits, or looping until tests pass.

Describe the work, and Devin writes the orchestration.
