# Voice script: Devin CLI, what's new (v3000.11.92)

Narrated by Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`), one whole-script take cut into lines by `_kit/tools/vo.py`. Where the spoken text differs from the subtitle, the spoken version (`voSay`) is shown below it.

**0000.png** (scene: themes): Let's look at what's new in the Devin CLI, starting with long-running goals, then models, plugins, and terminal features.

**0001.png**: Here in Ghostty, I've updated to the latest version of Devin, so let's dive in.

**0010.png**: The biggest addition is /goal, which keeps Devin working on an objective turn after turn until it's complete or blocked.
  - spoken: The biggest addition is slash goal, which keeps Devin working on an objective turn after turn until it's complete or blocked.

**0040.png**: I'll ask for a collapse toggle on each column, and tell it to finish when tests, lint and build all pass.

**0049.png**: Pressing Ctrl+C while it works now clears what I've typed, without stopping the task.
  - spoken: Pressing Control C while it works now clears what I've typed, without stopping the task.

**0055.png**: A message sent while it works now goes straight to the running turn, so you can steer it without cancelling anything.

**0096.png**: Devin reads it at its next step.

**0216.png**: When all the checks pass, it reports the goal complete.

**0218.png**: Typing /goal on its own shows the status.
  - spoken: Typing slash goal on its own shows the status.

**0219.png** (scene: goalcmds): If a run gets interrupted, /goal resume picks it back up, /goal clear drops it, and a run pauses itself after 50 turns.
  - spoken: If a run gets interrupted, slash goal rezoom picks it back up, slash goal clear drops it, and a run pauses itself after fifty turns.

**0220.png**: That covers goals, so let's move on to the rest of the release, starting with the model picker.

**0221.png**: Alt+Enter now switches models for this session only, while Enter still saves your pick as the default.
  - spoken: Alt Enter now switches models for this session only, while Enter still saves your pick as the default.

**0223.png** (scene: billing): If you pay for a provider plan like ChatGPT, the picker now marks the models it can cover with an asterisk, and /billing turns that on or off.
  - spoken: If you pay for a provider plan like ChatGPT, the picker now marks the models it can cover with an asterisk, and slash billing turns that on or off.

**0224.png** (scene: config): Two new settings let you turn off the typewriter effect so text appears instantly, and pick the model your subagents use.

**0243.png**: Next, let's look at plugins and MCP servers.

**0252.png**: Running devin mcp list now shows a Source line, naming the configuration file or plugin each server came from.

**0253.png** (scene: ext): Plugin installs also accept repos that only ship skills, new hooks run around context compaction, and remote MCP servers from Devin Cloud are in private preview.

**0254.png**: The last group is the terminal and cloud, where running devin cloud on its own now opens a Devin Cloud session.

**0268.png** (scene: terminal): Your terminal can now show which sessions need you, cloud sessions can copy files to and from your machine, and you can let a trusted command always run outside the sandbox.

**0269.png** (scene: fixes): On top of that, smart mode asks for approval less often, startup is faster, and session history works on network drives.

**outro**: Run devin update, and give Devin a goal.
