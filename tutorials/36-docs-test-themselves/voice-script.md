# Docs that test themselves: voice script

Voice: Nader (`T8iHhGIWPm2GVYpQD1Am`), one whole-script take with `_kit/tools/vo.py`, ElevenLabs `eleven_multilingual_v2`, default settings. Music: `2-upbeat.mp3`, ducked under the voice.

Video length: 02:34.5. Times are for the silent cut and the music-voiceover cut (same timeline).

**1. 00:03.4 to 00:11.5**

In this video, Devin tests our docs by following each walkthrough like a new user. When a step does not match the app, Devin fixes the walkthrough or the app.

**2. 00:12.2 to 00:19.7**

This works for any doc that people follow step by step. Examples are product walkthroughs, onboarding guides, help articles, and runbooks.

**3. 00:20.4 to 00:33.6**

Our demo is a small invoicing web app with five walkthroughs. We planted two problems on purpose. One walkthrough tells you to click a Mark as paid button that the app removed. The app also adds up the subtotal without the quantity.

**4. 00:34.4 to 00:46.4**

I give one Devin, the coordinator, the task in plain English. Start a new Devin for each walkthrough. It follows the steps in the browser like a new user. If a step does not match, fix the side that is wrong.

**5. 00:47.1 to 00:53.3**

The coordinator starts five Devins, one for each walkthrough page. Each one runs on its own fresh machine.

**6. 00:54.0 to 00:58.2**

Each Devin clones the repo, starts the app, and opens it in Chrome.

**7. 00:58.9 to 01:12.0**

In Getting started, the walkthrough adds two design sprints at twelve hundred dollars each. It adds forty-nine dollars for hosting. It expects a subtotal of twenty-four forty-nine. The app shows twelve forty-nine. The row itself says twenty-four hundred.

**8. 01:12.7 to 01:23.2**

The code says the subtotal multiplies quantity by price. So the app is wrong. Devin fixes the app, adds a test, and follows the walkthrough again. Now the subtotal is twenty-four forty-nine.

**9. 01:23.9 to 01:25.9**

Here is the pull request for the app fix.

**10. 01:27.5 to 01:37.4**

In Getting paid, the Mark as paid button is not there. The changelog says a Status menu replaced it on purpose. This time the walkthrough is wrong, so the pull request fixes the doc.

**11. 01:38.2 to 01:46.2**

The coordinator sends one summary. Three walkthroughs matched. One needed a doc fix, and one found an app bug. Each fix has its own pull request.

**12. 01:47.0 to 01:54.7**

Next, I ask Devin to save these steps as a playbook. I also ask for an automation. It runs when the walkthroughs change on main, and every Monday.

**13. 01:55.5 to 01:59.0**

Devin writes the playbook from the run it just did. I approve it.

**14. 01:59.7 to 02:06.4**

Then Devin sets up the automation. When a push changes a walkthrough, it tests only that page. Every Monday, it tests all of them.

**15. 02:07.2 to 02:11.2**

After I approve it, the automation is on. Its page shows both triggers.

**16. 02:13.7 to 02:33.1**

Here is the recap. Write your docs as plain-English walkthroughs. The coordinator starts a new Devin for each walkthrough. Each one follows every step in a browser. When a step fails, Devin finds out if the walkthrough or the app is wrong. It opens a pull request for the side that is wrong. With a playbook and an automation, this runs each time the walkthroughs change.
