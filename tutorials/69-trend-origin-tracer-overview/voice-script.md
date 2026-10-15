# Tutorial 69: Trend Origin Tracer overview, how it works and what you can do (voice script)

Narrated in Nader's voice (ElevenLabs `T8iHhGIWPm2GVYpQD1Am`, default settings: stability 0.5, similarity 0.75, style 0, speed 1), generated as one take with `_kit/tools/vo_onetake.py` (`VO_SEED=none`) and cut locally at sentence boundaries. Spoken spellings (`voSay`): "xAI" is said "ex A I", "ASGI" is said "A S G I".

1. How did this blow up? It's one of the internet's favourite questions. Paste a phrase like vibe coding, and this app shows the earliest post it can find on X, who amplified it, and how it spread over time.

2. It starts with real posts on X. The app asks Grok through the xAI API, with the X search tool turned on, and gets structured JSON back.

3. On Modal, one function fans out the searches with dot map, one per time window, so they all run at once. For vibe coding, that was twenty-five searches.

4. The results go into a Modal Dict, and a web endpoint serves the page and its API from that storage.

5. A Modal cron can refresh saved phrases every morning. This workspace had no free schedule slot, so for now the page starts that refresh itself.

6. The labels stay honest. The earliest post found isn't proof of origin. Counts are posts found in a sample, not totals. And every edge comes from a real reply, quote or mention in the data.

7. Devin built the whole thing from one short prompt, in a single session.

8. It deployed the app with modal deploy, then tested the deployed endpoint with a real trace.

9. Here's the deployed app. For vibe coding, the earliest post it found is from May twenty twenty-two.

10. It found sixty-nine posts with the phrase, and the graph shows who passed it to whom, with Karpathy as the top amplifier.

11. There's plenty to build on top. You could alert when a saved phrase starts climbing, compare two phrases side by side, or export the graph for a write-up. You could also trace a product launch from its very first post.

12. Paste a phrase, and watch how it spread.
