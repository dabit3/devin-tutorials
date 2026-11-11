# Tutorial 38: How to Fix Bugs from Customer Videos (voice script)

Narrated in Nader's voice (ElevenLabs `T8iHhGIWPm2GVYpQD1Am`, model `eleven_multilingual_v2`; the request sends only the text and `model_id`). The whole script is one take made with `_kit/tools/vo.py`, cut at sentence boundaries and laid over each beat.

Disclosure: we put the Fernhouse checkout bug in the demo on purpose, and we recorded the customer clip ourselves, playing the customer.

## Lines

1. In this video, Devin fixes a bug from a customer's screen recording.

2. Fernhouse is a small demo shop. We put a checkout bug in it on purpose. I recorded this clip myself, playing the customer.

3. The customer adds two Monsteras and a Pothos to the cart.

4. Then the customer applies a promo code.

5. After they remove both Monsteras, the total goes negative.

6. To give the video to Devin, start a new session.

7. Click the plus button, choose upload files, and pick the recording.

8. The video is now attached.

9. Then paste in what the customer wrote and mention the repo. Ask Devin to repeat the clicks in its browser, fix the bug, check the fix, and open a PR.

10. Open the Computer tab to watch Devin's own machine.

11. Devin reads the video first. Then it finds the fernhouse app and starts it.

12. From the video, it works out each click the customer made, in order.

13. Then it repeats those clicks, one at a time, in its own browser.

14. The total goes negative, the same as in the customer's video.

15. Devin finds the cause. The app saved the discount as a fixed amount when the code was applied. Removing items did not change it.

16. Devin changes the cart to work out the discount from the current subtotal. It also adds a test for this case.

17. Then it repeats the customer's clicks to check the fix.

18. This time the discount gets smaller with the cart, and the total stays positive.

19. When it is done, Devin explains what was wrong and what it changed. It also links the pull request.

20. In the PR tab, you can review the change without leaving Devin.

21. Here is the new test. It applies a promo code and then removes items.

22. When a customer sends a bug video, attach it to a Devin session. Devin gives you back a tested fix. Try it with the next one you get.
