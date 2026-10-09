# Voice script: Automating Tutorials with Devin

Nader voice `T8iHhGIWPm2GVYpQD1Am`, ElevenLabs default settings, generated as one take with `_kit/tools/vo_onetake.py` and cut per line.

## Intro

- `0000.png`: Automations let Devin handle recurring and event-driven work on its own. Pick a trigger, like a schedule, a GitHub event, a Slack message or a Linear ticket, and every time it fires, Devin starts a session to do the job.
## Ask Devin in plain English

- `0001.png`: The quickest way to set one up is to just tell Devin what to automate, and when.
- `0003.png`: Here, every morning at seven, Devin should check the changelog and turn each new feature into a tutorial.
- `0004.png`: Then mention the repository the tutorials go in.
- `0009.png`: And send it.
## Devin plans, asks and drafts

- `0011.png`: Devin reads the repository, works out the trigger and the instructions, and plans what each run should do.
- `0055.png`: Before it drafts anything, it asks about the choices that are yours to make, like how runs log in and who they run as.
- `0061.png`: Then it drafts the whole automation for you to review: the schedule, the instructions, who it runs as, and the sites it can reach.
- `0062.png`: Nothing is created until you approve it with Create automation.
- `0065.png`: And it's live, running every day at seven in the morning, Pacific time.
## Build one with the form

- `0068.png`: You'll find it under Automations, next to every other automation and when it last ran.
- `0069.png`: Prefer to build one yourself? Create automation also offers templates and Generate with Devin. Pick Create for a blank form.
- `0073.png`: Give it a name.
- `0081.png`: Triggers decide when it runs, and if you add several, any one of them can start it.
- `0083.png`: Pick Schedule, then every day.
- `0086.png`: Set it to seven o'clock. A schedule keeps its own time zone, here Pacific time.
- `0095.png`: Start new session gives every run its own fresh Devin session.
- `0096.png`: Then tell Devin what to do on every run.
- `0100.png`: Type @ to mention the repository.
- `0104.png`: Save it with Create automation.
## Saved

- `0106.png`: Now Devin checks the changelog every morning, and turns new features into tutorials.
- `0108.png`: You can turn it off anytime, and test it with Run automation.

## Outro

- Define the trigger once, and Devin handles every run for you.

## Typed on screen

1. Composer (pasted): Create an automation that runs every morning at 7:00am Pacific time. It should check the Devin changelog at docs.devin.ai/release-notes for features shipped since the last run and pick the ones that deserve a tutorial. For each one, record a short step-by-step tutorial and add it to the docs in @thequantexplorer/devin-docs
2. Devin's setup questions: "Skip the login: text-only tutorials with no recordings", then "Me (creator)"
3. Automation name: Daily tutorials from the changelog
4. Instructions (pasted): Every morning, check the Devin changelog at docs.devin.ai/release-notes for features shipped since the last run and pick the ones that deserve a tutorial. For each one, record a short step-by-step tutorial and add it to the docs in @thequantexplorer/devin-docs

## Sources

- https://docs.devin.ai/product-guides/automations
- https://docs.devin.ai/product-guides/scheduled-sessions
