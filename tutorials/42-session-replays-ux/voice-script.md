# Voice script: Session replays to UX fixes

Narrated in Nader's voice (`T8iHhGIWPm2GVYpQD1Am`, `VO_NAME=nader`), one take via `_kit/tools/vo_onetake.py`.

| Beat | Caption | Narration |
|---|---|---|
| 0000.png | From funnel drop-off to a flagged fix, with Devin | Devin can turn product analytics into a shipped fix. It finds where users drop off, watches those sessions, forms a hypothesis, and opens a pull request behind a feature flag. |
| 0009.png | The Metabase plugin from the marketplace | First, I installed the Metabase plugin from the marketplace, which gives Devin a Metabase MCP server. |
| 0016.png | API key and URL stored as write-only secrets | Its API key and URL are saved as write-only secrets. |
| 0017.png | Demo setup: a planted bug and 320 simulated sessions | For this demo, we built a small checkout app called Pantry, and we planted a UX bug on purpose. The traffic is simulated too: three hundred and twenty scripted browser sessions. |
| 0018.png | Every session recorded with rrweb | Each session is recorded with rrweb, the open-source recorder PostHog uses, and its funnel events go to Postgres, where Metabase reads them. |
| 0028.png | Mention the repo, give Devin the goal | Now the prompt. I mention the product demo apps repo, and I give Devin the goal, not the answer. |
| 0045.png | Devin plans the work | Devin plans the work and reaches for the Metabase MCP. |
| 0050.png | The MCP needed Node on the default path; Devin fixed it | The MCP server didn't start at first, because Node wasn't on the machine's default path, so Devin fixed that and kept going. |
| 0055.png | Devin queries the funnel through Metabase | Then it queries the checkout funnel through Metabase. |
| 0061.png | Chrome blocked the tunnel link; Devin copied the replay page locally | My replay viewer runs behind a tunnel, and Chrome blocked that link, so Devin copied the replay page locally and opened it in its own browser. |
| 0066.png | Replay: formatted phone, 5 clicks on Continue, no visible error | In its Computer tab, Devin watches a session that dropped at shipping. The phone number is formatted, the user clicks Continue five times, and nothing on screen changes. |
| 0071.png | Hypothesis: formatted phone numbers fail at Shipping | Here's its hypothesis. Shipping loses fifty-five percent of sessions. All one hundred fifty-four sessions with a formatted phone number dropped there, while sessions with bare digits went on to order. |
| 0072.png | The fix ships behind forgiving_shipping_form, off by default | The fix goes behind a flag called forgiving shipping form, off by default. It accepts common phone formats, shows the error on the field that failed, and logs which fields failed. |
| 0081.png | Devin opens PR #58 in product-demo-apps | Devin runs the tests and opens a pull request. |
| 0090.png | It flags the two setup issues and offers a browser test | It also lists the two setup issues, and offers to test the change in its browser. |
| 0100.png | I click Test: Devin runs checkout with the flag on | I click Test, and Devin walks through checkout with the flag on. |
| 0109.png | Flag on: a formatted phone number gets to Order placed | With a formatted phone number, the order goes through. |
| 0115.png | A real mistake now shows its error on the field | And when a field really is wrong, the error now shows right on that field. |
| 0160.png | Testing found polish issues: Devin pushed a fix and retested | Testing turned up a few polish issues, so Devin pushed a follow-up commit and retested on a phone-sized screen. |
| 0162.png | PR branch locally, flag off: the same formatted number | Finally, here's the pull request branch running locally. With the flag off, I type the same formatted number, and Continue still does nothing visible. |
| 0174.png | Flag on: same number | With the flag on, the same number takes me straight to payment. |
| outro | Analytics in, a flagged fix out | Analytics in, a flagged fix out. |
