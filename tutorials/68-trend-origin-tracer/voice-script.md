# Tutorial 68: Trend Origin Tracer, built on Modal with the xAI API (voice script)

Narrated in Nader's voice (ElevenLabs `T8iHhGIWPm2GVYpQD1Am`, default settings: stability 0.5, similarity 0.75, style 0, speed 1), generated as one take with `_kit/tools/vo_onetake.py` (`VO_SEED=none`) and cut locally at sentence boundaries. Spoken spellings (`voSay`): "xAI" is said "ex A I", "ASGI" is said "A S G I".

1. In this tutorial, Devin builds a trend origin tracer. You paste a phrase like vibe coding, and it shows the earliest post it can find on X, who amplified it, and how it spread over time.

2. By the end, it'll be deployed on Modal and pulling real posts from X through the xAI API. Here's the whole prompt.

3. Grok's X search finds the posts, and Modal does the rest. It runs the searches in parallel, stores the results and serves a dark page, and it refreshes saved phrases once a day.

4. Edges in the graph have to come from real quotes, replies, reposts or mentions. Then Devin should deploy it, test it and open a pull request.

5. Devin confirms the plan and starts by looking around the repo.

6. It plans to call X search as a tool through the xAI Responses API.

7. Here's the xAI call. Each search sends a prompt to Grok with the X search tool, and asks for structured JSON back.

8. On Modal, run search dot map fans out one search per time window, so they all run in parallel.

9. The daily refresh is a Modal cron on the refresh function, set for six every morning.

10. And the ASGI app decorator serves the page and its API from one web function.

11. Devin deploys it with modal deploy. This workspace had no free schedule slots, so it turns the cron off and the page starts the daily refresh instead.

12. Then it runs a real trace for vibe coding against the deployed endpoint, and waits for it to finish.

13. With the pull request open, Devin switches to test mode and clicks through the live page itself.

14. Devin Review flags five bugs and two security findings on the pull request, and Devin works through them before redeploying.

15. When it's done, Devin reports the live URL and the pull request. It also notes that a plain modal deploy turns the real schedule on once a slot is free.

16. And here's the deployed app on Modal. For vibe coding, the earliest post it found is from May twenty twenty-two. That's the oldest post the search returned, not proof of where it started.

17. It found sixty-nine posts with the phrase, which is a sample of X, not a total. The graph shows how they connect, with Karpathy as the top amplifier.

18. Every line is backed by a real reply, quote or mention, and this table lists the post behind each one, so you can check it on X.

19. Paste a phrase, and see how it spread.
