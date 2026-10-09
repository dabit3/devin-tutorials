# Voice script: Devin Automations, how they work (overview)

Narrated by Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, default settings, one take cut locally with `_kit/tools/vo_onetake.py`).

A concept overview: animated diagrams (`scenes.js`) between real UI shots reused from tutorial 07 (scheduled, plain-English and by-hand setup) and tutorial 16 (GitHub Check run trigger with Conclusion = Failure on thequantexplorer/orbit-ci-demo). Docs: https://docs.devin.ai/product-guides/automations

1. An automation is a trigger plus instructions: when the trigger fires, Devin starts a session and does the work, with no one prompting it.  <!-- 0000.png -->
2. The trigger can be a schedule, a GitHub or GitLab event, a Slack message, a Linear or Jira update, a PagerDuty incident or a webhook, and every match starts a session with your prompt and the event's details.  <!-- 0001.png -->
3. In the editor, you pick the trigger, like a schedule or a GitHub event.  <!-- 0002.png -->
4. This one fires whenever a check run on our demo repo completes with a failure.  <!-- 0003.png -->
5. When CI failed, it fired on its own and started a Devin session.  <!-- 0004.png -->
6. Devin found the cause and pushed a fix to the pull request branch.  <!-- 0005.png -->
7. The check went green, and no one prompted Devin.  <!-- 0006.png -->
8. There are three ways to create one: in plain English, from a template, or by hand.  <!-- 0007.png -->
9. You can describe it to Devin in plain English, and it drafts the automation for you to review.  <!-- 0008.png -->
10. You can start from a template.  <!-- 0010.png -->
11. Or you can build it by hand in the editor.  <!-- 0011.png -->
12. Teams use automations to fix failing CI, triage bug reports from Slack, investigate alerts with the Datadog MCP, and open weekly dependency updates.  <!-- 0012.png -->
13. Every automation lives on the Automations page, with its activity over the last thirty days.  <!-- 0013.png -->
14. Put the recurring work on autopilot, and let Devin handle each event as it arrives.  <!-- outro -->
