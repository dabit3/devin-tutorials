# Tutorial 34: Devin Primitives, when to use what (voice script)

Narrated in Nader's voice (ElevenLabs `T8iHhGIWPm2GVYpQD1Am`, default settings: stability 0.5, similarity 0.75, style 0, speed 1), generated as one take with `_kit/tools/vo_onetake.py` and cut locally at sentence boundaries.

1. Devin gets better the more you teach it. Each primitive is a different way to do that.

2. They fall into three groups. There's always-on context, reusable procedures, and ways to reach new tools and share what you've built.

3. For context every session needs, like build commands and conventions, commit a short agents file at the root of your repo, and Devin includes it automatically.

4. You can also write a rule under Customize, Rules, and set its trigger to always on.

5. Memory is different, because Devin writes it as you work. You can change it too by asking Devin to remember or forget something. It's personal to you, and you'll find it under Customize, Memory.

6. When a task should be done the same way every time, like testing before a pull request, write it as a skill file in your repo, and Devin uses it automatically when it's relevant.

7. You can create one under Customize, Skills, or let Devin suggest one after it learns something new about your setup.

8. Playbooks are prompts for tasks that apply across repos or teams, and you attach one to a session with its macro.

9. MCP servers give Devin tools beyond its built-in ones, like Datadog, and the recommended way to add one is from the plugin marketplace.

10. Plugins bundle skills, rules, hooks, and MCP servers, and you can install them just for you or for your whole organization.

11. Add one from a repository, upload a zip, or create your own.

12. So repeatable steps become a skill, conventions go in your agents file or a rule, preferences live in memory, shared prompts are playbooks, tools are MCP servers, and plugins share it all.

13. Teach it once, and every session starts smarter.

