# Docs that test themselves (overview): voice script

Voice: Nader (`T8iHhGIWPm2GVYpQD1Am`), generated as one whole-script take with `_kit/tools/vo.py`, ElevenLabs `eleven_multilingual_v2`, default settings.

- In this video, you'll learn how docs that test themselves work. You'll see how Devin follows every plain-English walkthrough step by step on a fresh machine, how it decides whether the walkthrough or the app is wrong, and how to make it run on its own.
- One Devin coordinates the run. It starts a fresh Devin for each walkthrough, each on its own machine, all in parallel.
- Here's a real run on a small invoicing app, where we planted two problems on purpose: a walkthrough step for a Mark as paid button the app removed, and a subtotal that ignores quantity.
- The coordinator starts five Devins, one per walkthrough.
- Each one follows its page in Chrome, and in Getting started, the subtotal comes out twelve hundred dollars short.
- When a step doesn't match, Devin works out whether the walkthrough is stale or the app has a bug, and the answer decides what the pull request fixes.
- The Mark as paid button was removed on purpose, so that pull request fixes the walkthrough.
- The subtotal was a real bug, so that pull request fixes the app and adds a test.
- The coordinator collects the results into one summary.
- To keep it that way, save the procedure as a playbook, and create an automation that runs it whenever the walkthroughs change, and on a schedule.
- Here's the automation Devin created, with both triggers.
- It works for product walkthroughs, onboarding guides, help center articles, and runbooks.

## Outro

- So, three takeaways. Write your docs as plain-English walkthroughs. Let a fresh Devin follow each one, the way a new user would. And when a step breaks, Devin fixes whichever is wrong, the walkthrough or the app.
