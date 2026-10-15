# Voice script: Package your team's way of working as one plugin (overview)

Narrated in Nader's voice (ElevenLabs `T8iHhGIWPm2GVYpQD1Am`, one whole-script take, default voice settings). Proof shots are reused from [tutorial 50](../50-team-plugin/) (see `shots/SOURCES.json`).

- A Devin plugin packages how your team works, its skills, rules, MCP servers and hooks, into one bundle that every Devin in your organization picks up.
- Under the hood it's plain files: a manifest, folders for skills and rules, and JSON files for MCP servers and hooks.
- Installed in Organization scope, it applies to every cloud session in the organization, and to the CLI and Desktop of everyone whose primary organization it is, starting with their next new session.
- On the Plugins page, Orbit Team shows as required for the whole organization.
- On a laptop, the same plugin shows up in the Devin CLI.
- Inside a session, the skill runs on request or when it's relevant, the rule is always on, the MCP server adds its tools, and the hook checks tool calls before they run.
- In a real cloud session, the rule is injected and Devin activates the skill.
- Its pull request lists every check the skill asked for, with the result of each one.
- In the CLI, the hook stops a force-push before it runs.
- Package your pre-PR checklist, your house conventions, the tools your team shares, and the guardrails that stop risky commands.
- Package it once, and every Devin works your way.

Docs: https://docs.devin.ai/product-guides/plugins · https://docs.devin.ai/product-guides/plugin-ecosystem · https://docs.devin.ai/cli/extensibility/plugins/overview · https://docs.devin.ai/cli/extensibility/hooks/overview
