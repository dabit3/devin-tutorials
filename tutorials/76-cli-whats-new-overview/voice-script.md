# Voice script: Devin CLI what's new (v3000.11.92), narrated by Nader

ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, model `eleven_multilingual_v2`, one whole-script take cut into lines by `_kit/tools/vo.py`. Where the spoken text differs from the subtitle, the spoken version (`voSay`) is shown below it.

**0000.png**  
Let's look at what's new in the Devin CLI, starting with new cloud features, then long-running goals, then models, plugins, and other terminal features.

**0001.png**  
Here in Ghostty, I've updated to the latest version of Devin, so let's dive in.

**0254.png**  
Let's start with the cloud, where running devin cloud on its own now opens a Devin Cloud session.

**0268.png**  
Cloud sessions can also view images and copy files on your machine through devin connect, and remote MCP servers configured in Devin Cloud are in private preview.

**0010.png**  
Next up is /goal, which keeps Devin working on an objective turn after turn until it's complete or blocked.

*spoken:* Next up is slash goal, which keeps Devin working on an objective turn after turn until it's complete or blocked.

**0040.png**  
I'll ask for a collapse toggle on each column, and tell it to finish when tests, lint and build all pass.

**0049.png**  
Pressing Ctrl+C while it works now clears what I've typed, without stopping the task.

*spoken:* Pressing Control C while it works now clears what I've typed, without stopping the task.

**0055.png**  
A message sent while it works now goes straight to the running turn, so you can steer it without cancelling anything.

**0096.png**  
Devin reads it at its next step.

**0216.png**  
When all the checks pass, it reports the goal complete.

**0218.png**  
Typing /goal on its own shows the status.

*spoken:* Typing slash goal on its own shows the status.

**0219.png**  
If a run gets interrupted, /goal resume picks it back up, /goal clear drops it, and a run pauses itself after 50 turns.

*spoken:* If a run gets interrupted, slash goal rezoom picks it back up, slash goal clear drops it, and a run pauses itself after fifty turns.

**0220.png**  
That covers goals, so let's move on to the rest of the release, starting with the model picker.

**0221.png**  
Alt+Enter now switches models for this session only, while Enter still saves your pick as the default.

*spoken:* Alt Enter now switches models for this session only, while Enter still saves your pick as the default.

**0223.png**  
If you pay for a provider plan like ChatGPT, the picker now marks the models it can cover with an asterisk, and /billing turns that on or off.

*spoken:* If you pay for a provider plan like ChatGPT, the picker now marks the models it can cover with an asterisk, and slash billing turns that on or off.

**0224.png**  
Two new settings let you turn off the typewriter effect so text appears instantly, and pick the model your subagents use.

**0243.png**  
Next, let's look at plugins and MCP servers.

**0252.png**  
Running devin mcp list now shows a Source line, naming the configuration file or plugin each server came from.

**0253.png**  
Plugin installs also accept repos that only ship skills, and new hooks run before and after context compaction.

**0242.png**  
To wrap up the new features, supported terminals can now show which Devin sessions need you, and you can let a trusted command always run outside the sandbox.

**0269.png**  
On top of that, smart mode asks for approval less often, startup is faster, and session history works on network drives.

**outro**  
That's it, and I'll link to the full changelog below.
