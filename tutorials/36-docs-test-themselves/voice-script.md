# Docs that test themselves: voice script

Voice: Nader (`T8iHhGIWPm2GVYpQD1Am`), generated as one whole-script take with `_kit/tools/vo.py`, ElevenLabs `eleven_multilingual_v2`, default settings.

- In this video, you'll learn how to build docs that test themselves. You'll see how Devin follows every plain-English walkthrough step by step on a fresh machine, how it decides whether the walkthrough or the app is wrong, and how to make it run on its own whenever your docs change.
- This works for any doc a person follows step by step: product walkthroughs, onboarding guides, help center articles, and runbooks.
- Our demo is a small invoicing web app with five plain-English walkthroughs, and we planted two problems on purpose. One walkthrough still tells you to click a Mark as paid button that the app removed, and the app's subtotal ignores quantity.
- I give one Devin the goal: start a fresh Devin for every walkthrough, follow it in the browser like a new user, and when a step doesn't match, fix whichever side is wrong.
- It starts five Devins, one per walkthrough page, each on its own fresh machine.
- Each one clones the repo, starts the app, and opens it in Chrome on its own computer.
- In the Getting started walkthrough, two design sprints at twelve hundred dollars, plus forty-nine for hosting, should come to twenty-four forty-nine. The app shows twelve forty-nine, even though the row itself says twenty-four hundred.
- The code says the subtotal should multiply quantity by price, so the app is wrong. Devin fixes it, adds a test, and follows the walkthrough again. Now it's twenty-four forty-nine.
- That's its pull request.
- In Getting paid, there's no Mark as paid button. The changelog says a Status menu replaced it on purpose, so this time the walkthrough is wrong, and the pull request fixes the doc.
- The coordinator sends one summary. Three walkthroughs matched, one needed a doc fix, and one found a real app bug, each with its pull request.
- To make it repeatable, I ask Devin to save this as a playbook, and to create an automation that runs it whenever the walkthroughs change on main, and every Monday.
- Devin writes the playbook from the run it just did, and I approve it.
- Then it sets up the automation. A push that changes a walkthrough tests just that page, and every Monday it tests them all.
- Once I approve it, the automation is live, with both triggers on its page.

## Outro

- So, the main takeaways. Write your docs as plain-English walkthroughs. Give one coordinator Devin the goal, and it starts a fresh Devin per walkthrough that follows every step in a real browser. When a step breaks, Devin works out whether the walkthrough or the app is wrong, and opens a pull request for the right one. And with a playbook and an automation, it happens every time the walkthroughs change.
