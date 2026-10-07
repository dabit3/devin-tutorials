# Automating Tutorials with Devin — voice script

Narrated by Nader Dabit (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`). Each line plays over the shot named on the left.

## Ask Devin to build it

| Shot | Narration |
| --- | --- |
| Home screen | This is Devin Automations. |
| Composer | Pick a trigger, like a schedule, a GitHub event, a Slack message or a Linear ticket, and Devin starts a session to handle it every time. The quickest way to set one up is to just tell Devin what to automate, and when. |
| Prompt pasted (zoomed) | Here, every morning at seven, Devin should check the changelog and turn each new feature into a tutorial. |
| Repo picker | Mention the repo it should work in. |
| Send button | Then send it. |
| Session working (sped up) | Devin works out the trigger and the instructions, and drafts the automation for you. |
| Automation card | Check the schedule and the instructions it wrote. Nothing is created until you approve it. |
| Create automation button | Click Create automation to approve it. |
| Created card | That's it. Your automation is live. |

## Automations page and the form

| Shot | Narration |
| --- | --- |
| Sidebar → Automations | Find it under Automations in the sidebar. |
| Automations list | Every automation you make lives here. |
| Create automation | Prefer a form? You can build one yourself. |
| Create automation menu → Create | Create automation also offers templates, and Generate with Devin. Pick Create for a blank editor. |
| Name field | Give it a name. |
| Add trigger | Triggers decide when it runs. One automation can have several triggers, and it fires when any of them match. |
| Trigger → Schedule | Run it on a schedule. |
| Every day at 07:00, Pacific | Every morning at seven, Pacific time. |
| Agent type: Start new session | Each run starts a fresh Devin session. |
| Instructions field | Then tell Devin what to do on every run. |
| `@` repo picker | Type an at sign to pick the repository. |
| Create automation | Save it. |
| Automation page | Now Devin checks the changelog every morning, and turns new features into tutorials. |
| Run automation | And you can test it anytime with Run automation. |
| Outro | Define the trigger once, and Devin handles every run for you. |

## Prompts typed on screen

1. Composer: Create an automation that runs every morning at 7:00am Pacific time. It should check the Devin changelog at docs.devin.ai/release-notes for features shipped since the last run and pick the ones that deserve a tutorial. For each one, record a short step-by-step tutorial and add it to the docs in @thequantexplorer/devin-docs
2. Automation name: Daily tutorials from the changelog
3. Instructions: Every morning, check the Devin changelog at docs.devin.ai/release-notes for features shipped since the last run and pick the ones that deserve a tutorial. For each one, record a short step-by-step tutorial and add it to the docs in @thequantexplorer/devin-docs

## Sources

- https://docs.devin.ai/product-guides/automations
- https://docs.devin.ai/product-guides/scheduled-sessions
