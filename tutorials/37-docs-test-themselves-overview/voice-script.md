# Docs that test themselves: how it works: voice script

Voice: Nader (`T8iHhGIWPm2GVYpQD1Am`), one whole-script take with `_kit/tools/vo.py`, ElevenLabs `eleven_multilingual_v2`, default settings. Music: `2-upbeat.mp3`, ducked under the voice.

Video length: 01:38.9. Times are for the silent cut and the music-voiceover cut (same timeline).

**1. 00:03.4 to 00:11.1**

In this video, we look at how Devin tests the walkthroughs in your docs. It follows each one like a new user and fixes what does not match.

**2. 00:11.8 to 00:18.8**

One Devin coordinates the work. It starts a new Devin for each walkthrough. Each one runs on its own machine, at the same time.

**3. 00:19.6 to 00:31.3**

Here is a run on a small invoicing app. We planted two problems on purpose. One walkthrough step uses a Mark as paid button that the app removed. The app subtotal also leaves out the quantity.

**4. 00:32.0 to 00:35.3**

The coordinator starts five Devins, one for each walkthrough.

**5. 00:36.0 to 00:41.4**

Each one follows its page in Chrome. In Getting started, the subtotal is twelve hundred dollars too low.

**6. 00:42.1 to 00:51.4**

When a step does not match, Devin finds out which side is wrong. The walkthrough can be out of date, or the app can have a bug. The answer tells it what to fix in the pull request.

**7. 00:52.1 to 00:56.9**

The Mark as paid button was removed on purpose. So that pull request fixes the walkthrough.

**8. 00:57.7 to 01:02.2**

The subtotal was a bug. So that pull request fixes the app and adds a test.

**9. 01:02.9 to 01:05.3**

The coordinator puts the results in one summary.

**10. 01:06.1 to 01:13.9**

To keep the docs correct, save the steps as a playbook. Then create an automation that runs it when the walkthroughs change, and on a schedule.

**11. 01:14.7 to 01:18.2**

Here is the automation that Devin created. It shows both triggers.

**12. 01:18.9 to 01:23.5**

This works for product walkthroughs, onboarding guides, help articles, and runbooks.

**13. 01:26.9 to 01:37.5**

Here is the recap. Write your docs as plain-English walkthroughs. A new Devin follows each one, like a new user. When a step breaks, Devin fixes the walkthrough or the app, whichever is wrong.
