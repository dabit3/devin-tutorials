# Devin Primitives cheatsheet

A one-page companion to the [Devin Primitives overview](34-devin-primitives-overview.mp4): what each primitive is for, where it lives, and how to make one. Every row follows the linked docs.

| Primitive | Use it when | Where it lives | How to build one | Docs |
| --- | --- | --- | --- | --- |
| **AGENTS.md** | Every session in a repo needs the same short context: build and test commands, code style, conventions. | An `AGENTS.md` file in your repository. Devin automatically includes up to 16 KiB from the beginning of each file. | Commit a short `AGENTS.md` at the repo root. Keep it brief and move situational, step-by-step guidance into skills. | [AGENTS.md](https://docs.devin.ai/onboard-devin/agents-md) |
| **Rules** | You want standing guidance applied in every session without committing it to a repo. | **Customize → Rules** (Personal or Organization). | **Customize → Rules → Create rule**: give it a name, keep the trigger **Always on**, write the guidance in Markdown. | [Rules](https://docs.devin.ai/cli/extensibility/rules) |
| **Memory** | Devin should remember your preferences and project lessons across sessions. | **Customize → Memory**. Personal to you, not shared with your organization. | Devin saves memories automatically as you work, and you can change them too. Memory files are read-only in the app, so ask Devin, e.g. "remember that staging deploys need approval" or "forget that I prefer npm". | [Memory](https://docs.devin.ai/product-guides/memory) |
| **Skills** | A task tied to a repo (how to run, test or deploy it) should be done the same way every time. | `.agents/skills/<skill-name>/SKILL.md` in your repo (Devin discovers it across connected repos), or **Customize → Skills**, or inside a plugin. | Commit a `SKILL.md` with `name` and `description` frontmatter and the steps, or **Customize → Skills → Create skill**, or accept a skill Devin suggests in a session. Devin invokes it when relevant; you can also mention `@skills:<name>`. | [Skills](https://docs.devin.ai/product-guides/skills) |
| **Playbooks** | You have a general-purpose prompt that applies across repos or teams. | **Settings → Playbooks** (Organization, Enterprise and System tabs). | **Settings → Playbooks → Create playbook**, give it a macro (e.g. `!before-after`), then type the macro or pick the playbook when you start a session. | [Creating playbooks](https://docs.devin.ai/product-guides/creating-playbooks), [Using playbooks](https://docs.devin.ai/product-guides/using-playbooks) |
| **MCP servers** | Devin needs tools or data beyond its built-in ones, e.g. Datadog, Sentry, Linear. | **Customize → MCPs**. | **Customize → MCPs → Add MCP → From plugin marketplace (Recommended)**, or **New MCP** for a custom STDIO, SSE or HTTP server. Installing doesn't authorize access: connect it after you install. | [MCP](https://docs.devin.ai/work-with-devin/mcp) |
| **Plugins** | You want to package skills, rules, hooks and MCP servers and share them, for yourself or your whole organization. | **Customize → Plugins**, at Personal, Organization or Enterprise scope. | **Customize → Plugins → Add plugin**: Browse marketplace, From repository, Upload .zip, or Create plugin. | [Plugins](https://docs.devin.ai/product-guides/plugins), [Plugin ecosystem](https://docs.devin.ai/product-guides/plugin-ecosystem) |

## Which one should I use?

| The need | Use |
| --- | --- |
| "Run our test steps before every PR" | Skill |
| "Our staging URL and naming conventions" | AGENTS.md or a rule |
| "How I like status updates written" | Memory |
| "A task prompt we reuse across repos" | Playbook |
| "Connect Datadog" | MCP server, installed from the plugin marketplace |
| "Share a bundle across the whole org" | Plugin, installed at Organization scope |

From the Skills docs: "If your instructions are tied to a specific repo — how to run it, test it, or deploy it — use a skill. If your instructions are general-purpose prompts that apply across repos or teams, use a playbook." From the Memory docs: "a skill provides the procedure, and memory supplies the context for applying it to your work."
