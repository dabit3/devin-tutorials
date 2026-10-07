# Voice script: Devin Automations: events

Voice: ElevenLabs `T8iHhGIWPm2GVYpQD1Am`. Captions in the original cut come from the same beats.

Each section is said as a few long, whole sentences rather than one short line per UI step. A sentence starts as its section appears and the visuals (pans, the Datadog/Sentry/Notion cards, form steps) play underneath it, so no take sounds like it continues the one before. No line opens with "Or" or "And", and lines that open a new section get a longer `voGap` in spec.js.

Generated as one ElevenLabs take of the whole script, cut back into lines afterwards (`VO_WHOLE=1`), with ElevenLabs' default voice settings (stability 0.5, similarity 0.75, style 0, speed 1.0): `VO_STABILITY=0.5 VO_STYLE=0 VO_SIMILARITY=0.75 VO_SPEED=1.0 VO_WHOLE=1 python3 _kit/tools/vo.py 16-automation-triggers T8iHhGIWPm2GVYpQD1Am`.

## Ways an automation can run

- Automations let Devin start work without anyone prompting it, and there are a few ways they can run.
- They can fire on events, like a new message in a Slack channel or a failing GitHub check, or they can run on a schedule.

## MCP integrations

- The sessions they start can use your MCP integrations, like Datadog, Sentry, Notion, or any other MCP server you connect.

## Natural language

- You can also create an automation in natural language. Just describe what you want, and Devin drafts it for you to review.

## Create the automation

- Now let's build one step by step, and watch it fire.
- Create a new automation and give it a name.
- For the trigger, pick GitHub, then Check run, which fires whenever CI reports a result.
- Choose the private repo to watch, and add a condition so it only fires when the check fails.
- Each failure starts a new Devin session with these instructions.
- Cap how much each session can spend, and how often the automation can run.
- Save it, and it waits for CI to fail.

## CI fails on a pull request

- This new pull request shows how many issues are left, but it also has a type error.
- Open the pull request, and CI runs on it, but the check fails.

## The automation fires

- The automation sees the failure and starts this session on its own, with no one prompting it.
- Devin looks at why CI failed, finds the type error, and pushes a one-line fix to the same branch.

## Green

- The fix passed, the check is green, and the new header shows how many issues are left.

## Outro

- Set up an event trigger once, and Devin picks up the work whenever it happens.

## Typed on screen

- Natural-language description (typed, not sent): "When a CI check fails on a pull request in thequantexplorer/orbit-ci-demo, have Devin read the logs, fix it, and push to the same branch."
- Automation name: `Fix failing CI`
- Instructions (pasted): "Fix the failing check and push to the same branch. A CI check just failed on a pull request in thequantexplorer/orbit-ci-demo. Read the check's logs, find the root cause, fix it, and push the fix to the PR's branch. You're done when the check passes."

## Sources

- https://docs.devin.ai/product-guides/automations
