# Tutorial 68: Trend Origin Tracer, built on Modal with the xAI API (voice script)

Narrated in Nader's voice (ElevenLabs `T8iHhGIWPm2GVYpQD1Am`, saved default voice settings), generated as one whole-script request with `_kit/tools/vo.py` and cut locally at sentence boundaries. Spoken spelling (`voSay`): "xAI" is said "ex A I".

1. In this tutorial, Devin builds a trend origin tracer. You paste a phrase like vibe coding, and it shows the earliest post it can find on X, who amplified it, and how it spread over time.

2. Here's where Modal fits. Grok's X search, through the xAI API, finds the posts. Modal runs the searches in parallel, stores the results in a Modal Dict, and serves the page at a public modal dot run URL.

3. That beats a laptop script, which runs one search at a time, and a server you'd pay for while it sits idle. On Modal, the key stays in a Modal Secret, and the app scales to zero, so you pay by the second while it runs.

4. Now for the prompt. It's short, and written in plain language.

5. It asks for Grok's X search to find the posts, and Modal for everything else, from the parallel searches to the public page on Modal.

6. Graph edges must come from real quotes, replies, reposts or mentions. Once it's built, Devin should deploy it, test the public URL, and open a pull request for review.

7. Devin confirms the plan, then gets to work in the repo.

8. About fifteen minutes in, Devin deploys it with modal deploy, which prints the public URL. The workspace had no free schedule slot, so it deploys with the daily cron turned off.

9. Then it tests the deployed endpoint with a real trace for vibe coding, and waits for it to finish.

10. With the pull request open, Devin also clicks through the page in a browser to test it.

11. When it's done, Devin reports the public URL and the pull request. It also notes that the daily refresh moves to a Modal schedule once a slot is free.

12. And here's the deployed app, running on Modal. For vibe coding, the earliest post it found is from May twenty twenty-two. That's the oldest post the search returned, not proof of where it started.

13. It found sixty-nine posts with the phrase, which is a sample of X, not a total. The graph shows how they connect, with Karpathy as the top amplifier.

14. Every line is backed by a real reply, quote or mention, and this table lists the post behind each one, so you can check it on X.

15. Paste a phrase, and see how it spread.
