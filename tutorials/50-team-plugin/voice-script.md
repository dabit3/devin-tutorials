# Voice script: Package your team's way of working as one plugin

Narrated in Nader's voice (ElevenLabs `T8iHhGIWPm2GVYpQD1Am`, one whole-script take, default voice settings).

## Intro

- A Devin plugin packages how your team works, its skills, rules, MCP servers and hooks, into one bundle that every Devin in your organization picks up, in the cloud and on your own machine.
## Create the plugin in Organization scope

- To make one, open Customize → Plugins.
- Pick the Organization tab, so the plugin applies to every cloud session in this organization, and to the CLI of everyone whose primary organization it is.
- Click Add plugin, choose Create plugin, and name it Orbit Team.
## Add a skill, a rule, an MCP server and a hook

- The editor has a section for each part: the manifest, skills, MCP servers, rules and hooks.
- First, a skill called ship-check, which tells Devin to run lint and build before it opens a pull request, and to list each check in a How I tested section.
- Next, a rule that's always on: every pull request title starts with orbit in square brackets, and each pull request holds one change.
- Then an MCP server, here DeepWiki, added as a short JSON config.
- And a hook: before Devin runs a shell command, it checks for a force push, and exit code two blocks it.
## Check what you built

- The Source tab shows the plugin as plain files: the manifest, the skill, the rule, and the MCP and hook configs.
- Back on the list, Orbit Team is installed and required for everyone in the organization.
- Its DeepWiki server is enabled and connects without credentials.
## Use it in a cloud session

- Now start a new session in Agent mode, and type slash orbit: the plugin's ship-check skill is right there in the menu.
- Pick it, mention the orbit demo repo, and ask for a Copy ID button in the issue dialog.

Prompt typed on screen (skill chip + repo chip + task):

> ship-check @thequantexplorer/orbit-demo Add a "Copy ID" button to the issue dialog that copies the issue ID (like KB-12) and shows a "Copied" toast.

- Devin activates the ship-check skill on its own, and the always-on rule is injected into the session.
- Following the skill, it runs npm ci, lint, build and the tests, then checks the button in a headless browser.
- It opens the pull request on its own, and the title starts with orbit in square brackets, just as the rule says.
- Its summary confirms the issue dialog now has a Copy ID button that copies the issue ID and shows a Copied toast.
- On GitHub, the pull request has the How I tested section the skill asked for, with each check and its result.
## Use it from the Devin CLI

- The same plugin reaches the Devin CLI: devin plugins update installs it on your machine, and devin plugins list shows Orbit Team.
- In the CLI, a plugin skill is named after its plugin, so typing slash orbit finds the ship-check skill.
- Finally, ask it to force-push, and the plugin's hook blocks the push before it runs.

Prompt typed in the CLI:

> Force-push this branch to origin with git push --force


## Outro

- Package how your team works once, and every Devin in your organization uses it.

## Plugin content entered on screen

See [`plugin.mjs`](plugin.mjs): skill `ship-check`, always-on rule `orbit-pr-style`, DeepWiki MCP (`https://mcp.deepwiki.com/mcp`), and a `PreToolUse` hook on `exec` that exits 2 on `push --force`.

## Sources

- Plugins: https://docs.devin.ai/product-guides/plugins
- Plugin ecosystem: https://docs.devin.ai/product-guides/plugin-ecosystem
- CLI plugins: https://docs.devin.ai/cli/extensibility/plugins/overview
- CLI plugin quickstart: https://docs.devin.ai/cli/extensibility/plugins/quickstart
- Hooks: https://docs.devin.ai/cli/extensibility/hooks/overview
- Pull request opened in the take: https://github.com/thequantexplorer/orbit-demo/pull/48 (closed after capture)
