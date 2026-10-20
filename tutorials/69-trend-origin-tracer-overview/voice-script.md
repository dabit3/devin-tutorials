# Tutorial 69: Trend Origin Tracer overview, how it works and what you can do (voice script)

Narrated in Nader's voice (ElevenLabs `T8iHhGIWPm2GVYpQD1Am`, saved default voice settings), generated as one whole-script request with `_kit/tools/vo.py` and cut locally at sentence boundaries. Spoken spelling (`voSay`): "xAI" is said "ex A I".

1. How did this blow up? It's one of the internet's favourite questions. Paste a phrase like vibe coding, and this app shows the earliest post it can find on X, who amplified it, and how it spread over time. Modal is what makes this possible. Anyone can paste a phrase into a public page, and Modal runs the searches in parallel, with no server to keep running.

2. It starts with real posts on X. The app asks Grok, through the xAI API, with X search turned on.

3. Modal does the rest. It splits each trace into searches, one per time window, and runs them in parallel. For vibe coding, that was twenty-five searches.

4. It keeps the results, and serves the page at a public URL that anyone can use.

5. Modal can also refresh saved phrases every morning. This workspace had no free schedule slot, so for now the page starts that refresh itself.

6. So why Modal? A laptop script would run the searches one at a time, with no public URL. Your own server would sit there idle, and you'd pay for it anyway. On Modal, it scales to zero between traces, and you pay by the second while it runs.

7. The labels stay honest. The earliest post found isn't proof of origin. Counts are posts found in a sample, not totals. And every edge comes from a real reply, quote or mention in the data.

8. Devin built the whole thing from one short prompt, in a single session.

9. It deployed the app with modal deploy, which printed the public URL. Then it tested the deployed endpoint with a real trace.

10. Here's the page running on Modal. For vibe coding, the earliest post it found is from May twenty twenty-two.

11. It found sixty-nine posts with the phrase, and the graph shows who passed it to whom, with Karpathy as the top amplifier.

12. There's plenty to build on top. You could alert when a saved phrase starts climbing, compare two phrases side by side, or export the graph for a write-up. You could also trace a product launch from its very first post.

13. Paste a phrase, and watch how it spread.
