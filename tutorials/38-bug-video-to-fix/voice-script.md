# Tutorial 38: How to fix bugs from customer videos (voice script)

Narrated in Nader's voice (ElevenLabs `T8iHhGIWPm2GVYpQD1Am`, model `eleven_multilingual_v2`, the voice's saved defaults: the request sends only the text and `model_id`), generated as one take with `_kit/tools/vo.py` and cut locally at sentence boundaries.

Disclosure: the Fernhouse checkout bug was planted on purpose, and the customer screen recording (`fernhouse-checkout.mp4`) was recorded by us playing the customer. Everything Devin does on screen is a real session in the thequantexplorer org.

## Lines

1. In this video, we'll hand Devin a customer's screen recording of a bug. Devin replays the clicks in its own browser until it sees the bug, and then it fixes it.

2. Fernhouse is a small demo shop, and we planted a checkout bug in it on purpose. I recorded this clip myself, playing the customer.

3. A couple of Monsteras and a Pothos go in the cart.

4. Then the customer applies a promo code.

5. But once both Monsteras come out, the total goes negative.

6. To hand it to Devin, start a new session.

7. Click the plus button, choose upload files, and pick the recording.

8. The video is now attached to your message.

9. Then paste in what the customer said, mention the repo, and ask Devin to replay the clicks in its browser, fix the bug, check it again, and open a PR.

10. Open the Computer tab to watch Devin's own machine.

11. Devin reads the video first, then finds the fernhouse app and starts it.

12. From the recording, it works out the exact clicks the customer made, in the same order.

13. Then it replays them, one by one, in its own browser.

14. And there it is: the total goes negative, the same bug the customer saw.

15. Devin finds the cause. The discount was saved as a fixed amount when the code was applied, so removing items never changed it.

16. So it changes the cart to work out the discount from the current subtotal, and adds a test for this case.

17. Then it replays the customer's clicks again to check the fix.

18. This time the discount shrinks with the cart, and the total stays positive.

19. When it's done, Devin explains what was wrong and what it changed, and links the pull request.

20. In the PR tab, you can review the change without leaving Devin.

21. And here is the new test, which removes items after applying a promo.

22. That's how you turn a customer's bug video into a tested fix. Try it with the next one a customer sends you.

## Prompt typed on screen

With `fernhouse-checkout.mp4` attached (+ → Upload files):

> A customer sent us this screen recording with the message: "Hi, something is wrong with your checkout. After I used a promo code the total went negative." The store is the fernhouse app in @thequantexplorer/product-demo-apps. Watch the recording, then replay the customer's clicks yourself in the browser on your computer until you see the bug. Fix it, replay the clicks to confirm the fix, and open a PR.

## What really happened

- Session: Devin read the attached video, started the fernhouse dev server, and replayed the clicks in Chrome on its own machine (Computer tab): 2× Monstera, 1× Golden Pothos, FERN20, then − twice on Monstera. Total: −$4.80.
- Fix in `fernhouse/src/cart.ts`: the cart stores only the promo code and the discount is recalculated from the current subtotal; `main.ts` renders the computed discount; new test in `cart.test.ts`.
- Re-check: the same clicks give a −$3.60 discount and a $14.40 total.
- PR: [thequantexplorer/product-demo-apps#52](https://github.com/thequantexplorer/product-demo-apps/pull/52) (the `[orbit]` title prefix comes from an always-on PR style rule in the capture org).

## Sources

- Your first session (attachments, @ mentions): https://docs.devin.ai/get-started/first-run
- Devin's computer / testing: https://docs.devin.ai/work-with-devin/computer-use
