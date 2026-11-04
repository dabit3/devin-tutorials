# Voice script: Session replays to UX fixes

Narrated in Nader's voice (`T8iHhGIWPm2GVYpQD1Am`, `VO_NAME=nader`, `eleven_multilingual_v2`), one take via `_kit/tools/vo.py`, split into lines at sentence boundaries.
The narrated cut (`42-session-replays-ux-nader.mp4`) has no captions. Nader's upbeat track plays under the voice and ducks under speech; it is mixed with `42-session-replays-ux/tools/music_mix.py` (no kit music, no UI sounds).

| Beat | Caption (captioned cut) | Narration |
|---|---|---|
| 0000.png | From funnel drop-off to a flagged fix, with Devin | In this video, I point Devin at our checkout analytics. It finds where users drop off and watches those sessions. Then it ships a fix behind a feature flag. |
| 0009.png | The Metabase plugin from the marketplace | First, I installed the Metabase plugin from the marketplace. It gives Devin a Metabase MCP server. |
| 0016.png | API key and URL stored as write-only secrets | The API key and URL are saved as write-only secrets. |
| 0017.png | Demo setup: a planted bug and 320 simulated sessions | For this demo, we built a small checkout app called Pantry. We planted a bug in it on purpose. The traffic is simulated, from three hundred and twenty scripted browser sessions. |
| 0018.png | Every session recorded with rrweb | Each session is recorded with rrweb, the open-source recorder that PostHog uses. The funnel events go to Postgres, and Metabase reads them from there. |
| 0028.png | Mention the repo, give Devin the goal | Now the prompt. I mention the product demo apps repo. I give Devin the goal, not the answer. |
| 0045.png | Devin plans the work | Devin plans the work and starts with the Metabase MCP. |
| 0050.png | The MCP needed Node on the default path, so Devin fixed it | The MCP server did not start at first. Node was not on the machine's default path, so Devin fixed that. |
| 0055.png | Devin queries the funnel through Metabase | Then it queries the checkout funnel through Metabase. |
| 0061.png | Chrome blocked the tunnel link, so Devin copied the replay page locally | My replay viewer runs behind a tunnel, and Chrome blocked that link. Devin copied the replay page locally and opened it in its browser. |
| 0066.png | Replay: formatted phone, 5 clicks on Continue, no visible error | In its Computer tab, Devin watches a session that dropped at shipping. The phone number has parentheses and a dash. The user clicks Continue five times, and nothing changes on screen. |
| 0071.png | Hypothesis: formatted phone numbers fail at Shipping | Here is its hypothesis. Shipping loses fifty-five percent of sessions. All one hundred fifty-four sessions with a formatted phone number dropped there. Sessions with plain digits went on to order. |
| 0072.png | The fix ships behind forgiving_shipping_form, off by default | The fix goes behind a flag called forgiving shipping form, which is off by default. It accepts common phone formats. It shows the error on the field that failed, and it logs which fields failed. |
| 0081.png | Devin opens PR #58 in product-demo-apps | Devin runs the tests and opens a pull request. |
| 0090.png | It flags the two setup issues and offers a browser test | It also lists the two setup problems and offers to test the change in its browser. |
| 0100.png | I click Test: Devin runs checkout with the flag on | I click Test, and Devin goes through checkout with the flag on. |
| 0109.png | Flag on: a formatted phone number gets to Order placed | With a formatted phone number, the order goes through. |
| 0115.png | A wrong field now shows its error on the field | When a field is wrong, the error now shows on that field. |
| 0160.png | Testing found small issues, so Devin pushed a fix and tested again | Testing found a few small issues. Devin pushed a follow-up commit and tested again on a phone-sized screen. |
| 0162.png | PR branch locally, flag off: the same formatted number | Last, here is the pull request branch running locally. With the flag off, I type the same formatted number. Continue still does nothing visible. |
| 0174.png | Flag on: same number | With the flag on, the same number takes me to payment. |
| outro | From funnel drop-off to a flagged fix | That's how Devin turns a funnel drop-off into a flagged fix. |
