# Voice script: Devin Automations: events

Voice: ElevenLabs `T8iHhGIWPm2GVYpQD1Am`. Captions in the original cut come from the same beats.


## Create the automation

- Automations don't only run on a schedule. They can also start when something happens, like a GitHub check failing.
- Create a new automation.
- Give it a name.
- For the trigger, pick GitHub,
- then Check run. It fires whenever CI reports a result.
- Choose the private repo to watch.
- Add a condition, so it only fires when the check fails.
- Each failure starts a new Devin session,
- with instructions for what Devin should do.
- Cap how much each session can spend,
- and how often the automation can run.
- Save it. Now it waits for CI to fail.

## CI fails on a pull request

- Here's a new pull request that shows how many issues are left. It has a type error.
- Open the pull request.
- CI starts on the PR,
- and the check fails.

## The automation fires

- The automation sees the failure and fires on its own.
- It started a session. No one prompted it.
- Devin reads the check's logs, finds the type error, and fixes it.
- Then it pushes a one-line fix to the same branch.

## Green

- The first commit failed. Devin's fix passed, and the check is green.
- And the new header shows how many issues are left.

## Outro

- Set up an event trigger once, and Devin picks up the work whenever it happens.

## Typed on screen

- Automation name: `Fix failing CI`
- Instructions (pasted): "Fix the failing check and push to the same branch. A CI check just failed on a pull request in thequantexplorer/orbit-ci-demo. Read the check's logs, find the root cause, fix it, and push the fix to the PR's branch. You're done when the check passes."

## Sources

- https://docs.devin.ai/product-guides/automations
