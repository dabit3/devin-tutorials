# Voice script: Devin Desktop: a hands-on tour

One whole-script ElevenLabs `eleven_v4` take per voice (`T8iHhGIWPm2GVYpQD1Am`, Nader, and `c1uwEpPUcC16tq1udqxk`), cut into lines by `_kit/tools/vo.py`. Spoken text that differs from the subtitle is shown below it.

**0000.png**: This is the new Devin Desktop: a local Devin, a cloud Devin and Codex, side by side in one window.

**0001.png** (scene: whatsnew): Version 3.11.212 rebuilt the Agent Window on the same interface as the Devin web app. Let's tour it on a small reading-list app called Pagemark.
  - spoken: Version three eleven two twelve rebuilt the Agent Window on the same interface as the Devin web app. Let's tour it on a small reading-list app called Pagemark.

**0002.png**: Every session starts here. Cloud runs Devin on its own machine. Local runs it on yours.

**0004.png**: I'll pick Local,

**0006.png**: choose the pagemark folder,

**0011.png**: and keep the agent on Devin Local.

**0014.png**: The mode menu sets how much it does on its own. I'll use Smart.

**0018.png**: The model picker has Adaptive, Fusion, SWE-2 High, and models from Claude, GPT, Gemini and more.
  - spoken: The model picker has Adaptive, Fusion, swee two High, and models from Claude, G P T, Gemini and more.

**0021.png**: Fusion pairs a frontier lead model with a cheaper sidekick that writes the code. I'll pick it.

**0023.png**: Then I ask for a Mark as read toggle, an Unread only filter, and tests.

**0031.png**: Devin reads the code, makes the edits, and asks before it runs commands.

**0045.png**: I allow it, and it keeps going.

**0061.png**: It reports the files it changed and the tests it added.

**0064.png**: Next, I ask it to start the dev server.

**0071.png**: It asks again before starting the server, and I allow it.

**0085.png**: The Preview tab opens the running app right inside the session.

**0088.png**: Mark as read works, and the title dims.

**0092.png**: and Unread only hides the books I've read.

**0095.png**: Untick it, and every book comes back.

**0097.png**: After a reload, the read state is still there.

**0101.png**: And the Changes tab shows a diff for every file.

**0104.png**: Now Devin tests its own change. I ask it to run the full suite.

**0136.png**: All thirteen tests pass, across both test files.

**0137.png** (scene: acp): Desktop also speaks ACP, the Agent Client Protocol: an open standard for how editors talk to coding agents. So you can run agents like Codex, Claude Agent and Gemini CLI.

**0141.png**: You turn them on in Settings, under Agents.

**0144.png**: I'll search for Codex, and enable it.

**0156.png**: Back in a new Local session,

**0158.png**: Codex is now in the agent menu.

**0164.png**: I ask how the new filter works, without changing any files.

**0179.png**: Codex reads the code and explains it. No files changed.

**0182.png**: Now the cloud. A cloud Devin gets a virtual machine of its own.

**0186.png**: Configuration sets up that machine.

**0188.png**: Its environment can be Ubuntu, macOS or Windows,

**0190.png**: and which repositories it can use.

**0193.png**: The capability menu offers Fusion, Ultra, Normal and Lite, with SWE-2 in preview.
  - spoken: The capability menu offers Fusion, Ultra, Normal and Lite, with swee two in preview.

**0195.png**: I ask it to check out the branch, run the tests and build, and try the controls in a browser.

**0206.png**: It works on its own machine,

**0230.png**: and drives Chrome to test Pagemark itself.

**0233.png**: Its report: both controls work, all thirteen tests pass, and two small UX issues are worth a look.

**0237.png**: Now, arranging sessions.

**0238.png**: Drag one from the sidebar onto an open session,

**0244.png**: and they sit side by side, up to eight at once.

**0245.png**: I add the Codex session the same way.

**0254.png**: Properties sorts by last updated or last created,

**0258.png**: filters by session type, agent, status, pull requests and more,

**0260.png**: and groups sessions by workspace.

**0263.png**: Right-click a session to file it in a folder,

**0267.png**: or make a new one, like Pagemark launch.

**0273.png**: Pagemark launch now holds the Codex session,

**0275.png**: and I move the local session in too.

**0281.png** (scene: recap): So: local and cloud sessions, any model including Fusion and SWE-2, ACP agents, real tests, and sessions you can arrange however you like.
  - spoken: So: local and cloud sessions, any model including Fusion and swee two, ACP agents, real tests, and sessions you can arrange however you like.

**Outro**: Update Devin Desktop, and try it on your own project.
