# Voice script: Devin Automations: events

Voice: ElevenLabs `T8iHhGIWPm2GVYpQD1Am` (Nader), default voice settings. Captions in the original cut come from the same beats.

The whole script is generated as ONE ElevenLabs take and cut back into lines locally, whole sentences only, with a speech-to-text check of every cut:

```sh
python3 tutorials/_kit/tools/vo_onetake.py tutorials/16-automation-triggers T8iHhGIWPm2GVYpQD1Am
```

## Ways an automation can run

- Automations let Devin start work without anyone prompting it. You define a trigger once, and Devin handles each event as it arrives.
- An automation can run on an event, like a message in a Slack channel or a failing GitHub check, or on a schedule.

## MCP integrations

- The sessions it starts can use your MCP integrations, like Datadog, Sentry, and Notion, to pull in logs, errors, and docs.

## Natural language

- You can also describe an automation in plain English, and Devin builds it with you.

## Create the automation

- Now let's build one by hand, and watch it fire.
- Create a new automation and give it a name.
- For the trigger, pick GitHub, then Check run, which fires whenever CI reports a result.
- Choose the private repo to watch.
- Then add a condition, so it only fires when the check's conclusion is failure.
- Now it ignores passing checks and only runs when one fails.
- Each failure starts a new Devin session, with the event's details added to its prompt.
- The instructions tell Devin to read the logs, fix the root cause, and push to the same branch.
- Limits cap what each session can spend, and how often the automation can run.
- Create it, and it waits for CI to fail.

## CI fails

- This pull request adds an issues left count to the header, but it passes a string where the function expects a number.
- CI runs on it, and the check fails.

## The automation fires

- The automation sees the failure and starts a session on its own, with no one prompting Devin.
- The session starts with the check run that triggered it. Devin reads the logs, finds the type error, and pushes a fix to the same branch.
- Then it reports the root cause and the one-line fix.

## Green

- Back on the pull request, Devin's commit is on the branch, and the check is green.

## Outro

- Set up a trigger once, and Devin picks up the work whenever it happens.
