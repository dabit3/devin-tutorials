# Tutorial 31: Hardware and simulation test triage, how it works (voice script)

Narrated in Nader's voice (ElevenLabs `T8iHhGIWPm2GVYpQD1Am`, default settings: stability 0.5, similarity 0.75, style 0, speed 1), generated as one take with `_kit/tools/vo_onetake.py` and cut locally at sentence boundaries.

1. Robotics teams often run simulation suites on powerful devboxes by hand, so failures pile up and get triaged a day late.

2. With Devin, a nightly schedule or a Slack message starts the run, and one managed Devin per failure triages them all in parallel.

3. Here is a simulation demo: a small robot simulator with a test suite, and an automation that runs it every night at two.

4. From Slack, tagging Devin in a channel starts the same kind of session.

5. I ran it right away instead of waiting for tonight.

6. It started a session on its own and ran the suite.

7. Four tests failed, so it started one managed Devin for each.

8. Each one checks for a known issue and tests a root cause against the output, so you get one report instead of a pile of logs.

9. This one traced a spin failure to the wrong constant in the turn-rate math.

10. The report flags the known issue and leaves it alone.

11. For the two new root causes, Devin opened one fix pull request.

12. In Slack, Devin replies in the thread where the work started.

13. Your team can triage together: replies in one Slack thread show who sent each message, and anyone can open the shared session link.

14. The same session is open in the web app, too.

15. A triage playbook one engineer writes is shared with the whole team.

16. Teams use this for nightly hardware and simulation triage, Slack-reported issues, crash reports turned into Jira tickets and fixes, moving bench tests to simulation, and playbooks for each subsystem.

17. Every failure, triaged before the team logs on.

The live proof is a **simulation demo**, not hardware: a small 2D differential-drive robot simulator with an 8-test suite in `thequantexplorer/product-demo-apps` (`robot-sim/`), four of which genuinely fail (two new root causes, one known issue, SIM-12). The automation, auto-started session, four managed Devins, triage report and fix PR are new captures from a real run in the thequantexplorer org. Slack is not connected in that org, so the Slack shots are reused from tutorial 12's real run, and the Slack trigger and multiplayer behavior are shown as diagrams. Shot-by-shot sources are in `shots/SOURCES.json`; the diagrams are drawn live by `scenes.js`.

Sources: [Automations](https://docs.devin.ai/product-guides/automations), [Slack](https://docs.devin.ai/integrations/slack) (multi-user threads show each participant's name), [Managed Devins](https://docs.devin.ai/work-with-devin/advanced-capabilities#managed-devins), [Playbooks](https://docs.devin.ai/product-guides/creating-playbooks), and Cognition's blog *How to Automate Failure Triages and 10x Test Generation: What We've Learned Deploying AI Across HIL/SIL Workflows* (the use cases, and the attributed numbers on the last diagram).
