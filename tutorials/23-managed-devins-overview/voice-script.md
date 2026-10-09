# Tutorial 23: Managed Devins, how it works (voice script)

Narrated in Nader's voice (ElevenLabs `T8iHhGIWPm2GVYpQD1Am`, default settings: stability 0.5, similarity 0.75, style 0, speed 1), generated as one take with `_kit/tools/vo_onetake.py` and cut locally at sentence boundaries.

1. With managed Devins, one Devin becomes a coordinator that breaks a big task into pieces and hands each piece to its own managed Devin, each running in an isolated VM, all in parallel.

2. The coordinator scopes the work, monitors each Devin's progress, resolves conflicts, and compiles everything into one summary for you.

3. Here's a real run, where I asked for one managed Devin per UI component in a kanban app.

4. The coordinator starts four of them, and the sidebar nests them under it.

5. Each one opens its own pull request, and the summary shows every component going from zero to one hundred percent test coverage.

6. The coordinator can message any of its Devins, and it's woken automatically when one finishes or needs your input.

7. You stay in control, too: tell the coordinator what you want mid-run, and it passes the instruction to the right Devin.

8. By default, managed Devins start without asking; turn off Auto-approve child sessions, under Settings, Preferences, to review each batch first.

9. Managed Devins can also start managed Devins of their own, so one task can grow into a tree several levels deep.

10. It shines on work that spans many files, modules, or repositories, like large migrations, test coverage module by module, one playbook across every service, and parallel research.

11. One task in, a team of Devins on it.

The UI shots are reused from tutorial 19's real run in `thequantexplorer/orbit-demo` (the coordinator prompt, the four managed Devins, the sidebar, the summary, the relayed message, the CardModal Devin's push, and Settings → Preferences). The diagrams are drawn live by `scenes.js`.

Source: [Managed Devins](https://docs.devin.ai/work-with-devin/advanced-capabilities#managed-devins) in the Devin docs. Nesting (managed Devins starting their own) follows tutorial 19's closing diagram.
