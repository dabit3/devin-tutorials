# Tutorial 39: A customer's bug video becomes a fix, overview (voice script)

Narrated in Nader's voice (ElevenLabs `T8iHhGIWPm2GVYpQD1Am`, model `eleven_v4`, the voice's default settings: the request sends only the text and `model_id`), generated as one take with `_kit/tools/vo.py` and cut locally at sentence boundaries.

Disclosure: the Fernhouse checkout bug was planted on purpose, and the customer screen recording was recorded by us playing the customer. Every UI shot is reused from tutorial 38's real session (see `shots/SOURCES.json`).

## Lines

1. Hand Devin a customer's screen recording, and it reproduces the bug, fixes it, and opens a pull request.

2. It watches the video, replays the same clicks in its own browser until the bug shows up, and fixes the code. Then it replays the clicks again to prove the fix before it opens the PR.

3. In this demo we planted the bug on purpose, and I recorded the clip playing the customer. You just attach the video to a new session.

4. Devin reads the recording and starts the app on its own machine.

5. In the Computer tab, you watch it repeat the customer's clicks until the total goes negative, just like in the video.

6. After the fix, it runs the same clicks again, and the total is right.

7. Then it opens a pull request with the fix and a regression test.

8. Any screen recording of a bug works, like a clip from a support ticket or a QA run, along with whatever the customer wrote.

9. Send Devin the bug video, and get back a verified fix.

## Prompt (from tutorial 38, shown on screen)

With the customer recording attached:

> A customer sent us this screen recording with the message: "Hi, something is wrong with your checkout. After I used a promo code the total went negative." The store is the fernhouse app in @thequantexplorer/product-demo-apps. Watch the recording, then replay the customer's clicks yourself in the browser on your computer until you see the bug. Fix it, replay the clicks to confirm the fix, and open a PR.

Result: [thequantexplorer/product-demo-apps#52](https://github.com/thequantexplorer/product-demo-apps/pull/52).

## Sources

- Your first session (attachments, @ mentions): https://docs.devin.ai/get-started/first-run
- Computer Use: https://docs.devin.ai/work-with-devin/computer-use
- Full walkthrough: [tutorial 38](../38-bug-video-to-fix/voice-script.md)
