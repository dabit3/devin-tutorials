window.SPEC = {
  "title": "Session replays to UX fixes",
  "subtitle": "Funnel drop-off, replays, a hypothesis and a flagged PR with Devin",
  "outro": "Analytics in, a flagged fix out",
  "voOutro": "Analytics in, a flagged fix out.",
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.6,
  "pollRunMax": 1,
  "noZoom": [
    [
      44
    ]
  ],
  "edit": {
    "0000.png": {
      "hold": 5,
      "cursor": false,
      "cap": "From funnel drop-off to a flagged fix, with Devin",
      "vo": "Devin can turn product analytics into a shipped fix. It finds where users drop off, watches those sessions, forms a hypothesis, and opens a pull request behind a feature flag."
    },
    "0003.png": {
      "skip": true
    },
    "0004.png": {
      "skip": true
    },
    "0005.png": {
      "skip": true
    },
    "0006.png": {
      "skip": true
    },
    "0007.png": {
      "skip": true
    },
    "0008.png": {
      "skip": true
    },
    "0009.png": {
      "cap": "The Metabase plugin from the marketplace",
      "vo": "First, I installed the Metabase plugin from the marketplace, which gives Devin a Metabase MCP server."
    },
    "0010.png": {
      "skip": true
    },
    "0011.png": {
      "skip": true
    },
    "0012.png": {
      "skip": true
    },
    "0014.png": {
      "skip": true
    },
    "0016.png": {
      "hold": 3,
      "ring": {
        "x": 934,
        "y": 484,
        "w": 930,
        "h": 210
      },
      "ringFor": 2.6,
      "cap": "API key and URL stored as write-only secrets",
      "vo": "Its API key and URL are saved as write-only secrets."
    },
    "0017.png": {
      "hold": 5,
      "cursor": false,
      "cap": "Demo setup: a planted bug and 320 simulated sessions",
      "vo": "For this demo, we built a small checkout app called Pantry, and we planted a UX bug on purpose. The traffic is simulated too: three hundred and twenty scripted browser sessions."
    },
    "0018.png": {
      "hold": 3,
      "cap": "Every session recorded with rrweb",
      "vo": "Each session is recorded with rrweb, the open-source recorder PostHog uses, and its funnel events go to Postgres, where Metabase reads them."
    },
    "0019.png": {
      "skip": true
    },
    "0021.png": {
      "skip": true
    },
    "0023.png": {
      "skip": true
    },
    "0025.png": {
      "skip": true
    },
    "0028.png": {
      "cap": "Mention the repo, give Devin the goal",
      "vo": "Now the prompt. I mention the product demo apps repo, and I give Devin the goal, not the answer."
    },
    "0043.png": {
      "hold": 3,
      "cap": "Find the drop-off, watch the replays, ship behind a flag"
    },
    "0045.png": {
      "badge": "Sped up",
      "cap": "Devin plans the work",
      "vo": "Devin plans the work and reaches for the Metabase MCP.",
      "cursor": false
    },
    "0046.png": {
      "cursor": false
    },
    "0047.png": {
      "cursor": false
    },
    "0048.png": {
      "cursor": false
    },
    "0049.png": {
      "cursor": false
    },
    "0050.png": {
      "cap": "The MCP needed Node on the default path; Devin fixed it",
      "vo": "The MCP server didn't start at first, because Node wasn't on the machine's default path, so Devin fixed that and kept going.",
      "cursor": false
    },
    "0051.png": {
      "cursor": false
    },
    "0052.png": {
      "cursor": false
    },
    "0053.png": {
      "cursor": false
    },
    "0054.png": {
      "cursor": false
    },
    "0055.png": {
      "cap": "Devin queries the funnel through Metabase",
      "vo": "Then it queries the checkout funnel through Metabase.",
      "cursor": false
    },
    "0056.png": {
      "cursor": false
    },
    "0057.png": {
      "cursor": false
    },
    "0058.png": {
      "cursor": false
    },
    "0059.png": {
      "cursor": false
    },
    "0060.png": {
      "cursor": false
    },
    "0061.png": {
      "cap": "Chrome blocked the tunnel link; Devin copied the replay page locally",
      "vo": "My replay viewer runs behind a tunnel, and Chrome blocked that link, so Devin copied the replay page locally and opened it in its own browser.",
      "cursor": false
    },
    "0062.png": {
      "cursor": false
    },
    "0063.png": {
      "cursor": false
    },
    "0064.png": {
      "cursor": false
    },
    "0065.png": {
      "cursor": false
    },
    "0066.png": {
      "hold": 4.5,
      "ring": {
        "x": 987,
        "y": 411,
        "w": 560,
        "h": 365
      },
      "ringFor": 3.5,
      "cap": "Replay: formatted phone, 5 clicks on Continue, no visible error",
      "vo": "In its Computer tab, Devin watches a session that dropped at shipping. The phone number is formatted, the user clicks Continue five times, and nothing on screen changes.",
      "cursor": false
    },
    "0067.png": {
      "cursor": false
    },
    "0068.png": {
      "cursor": false
    },
    "0069.png": {
      "cursor": false
    },
    "0070.png": {
      "cursor": false
    },
    "0071.png": {
      "hold": 6,
      "ring": {
        "x": 291,
        "y": 303,
        "w": 530,
        "h": 90
      },
      "ringFor": 3,
      "cap": "Hypothesis: formatted phone numbers fail at Shipping",
      "vo": "Here's its hypothesis. Shipping loses fifty-five percent of sessions. All one hundred fifty-four sessions with a formatted phone number dropped there, while sessions with bare digits went on to order.",
      "cursor": false
    },
    "0072.png": {
      "hold": 5,
      "cap": "The fix ships behind forgiving_shipping_form, off by default",
      "vo": "The fix goes behind a flag called forgiving shipping form, off by default. It accepts common phone formats, shows the error on the field that failed, and logs which fields failed.",
      "cursor": false
    },
    "0073.png": {
      "skip": true,
      "cursor": false
    },
    "0074.png": {
      "cursor": false
    },
    "0075.png": {
      "skip": true,
      "cursor": false
    },
    "0076.png": {
      "cursor": false
    },
    "0077.png": {
      "skip": true,
      "cursor": false
    },
    "0078.png": {
      "cursor": false
    },
    "0079.png": {
      "skip": true,
      "cursor": false
    },
    "0080.png": {
      "cursor": false
    },
    "0081.png": {
      "hold": 3,
      "cap": "Devin opens PR #58 in product-demo-apps",
      "vo": "Devin runs the tests and opens a pull request.",
      "cursor": false
    },
    "0082.png": {
      "cursor": false
    },
    "0083.png": {
      "cursor": false
    },
    "0084.png": {
      "skip": true,
      "cursor": false
    },
    "0085.png": {
      "skip": true,
      "cursor": false
    },
    "0086.png": {
      "skip": true,
      "cursor": false
    },
    "0087.png": {
      "skip": true,
      "cursor": false
    },
    "0088.png": {
      "cursor": false
    },
    "0089.png": {
      "cursor": false
    },
    "0090.png": {
      "hold": 3.5,
      "cap": "It flags the two setup issues and offers a browser test",
      "vo": "It also lists the two setup issues, and offers to test the change in its browser.",
      "cursor": false
    },
    "0091.png": {
      "cursor": false
    },
    "0092.png": {
      "cursor": false
    },
    "0093.png": {
      "skip": true,
      "cursor": false
    },
    "0094.png": {
      "cursor": false
    },
    "0095.png": {
      "skip": true,
      "cursor": false
    },
    "0096.png": {
      "cursor": false
    },
    "0097.png": {
      "skip": true,
      "cursor": false
    },
    "0098.png": {
      "cursor": false
    },
    "0099.png": {
      "skip": true,
      "cursor": false
    },
    "0100.png": {
      "badge": "Sped up",
      "cap": "I click Test: Devin runs checkout with the flag on",
      "vo": "I click Test, and Devin walks through checkout with the flag on.",
      "cursor": false
    },
    "0101.png": {
      "cursor": false
    },
    "0102.png": {
      "cursor": false
    },
    "0103.png": {
      "cursor": false
    },
    "0104.png": {
      "cursor": false
    },
    "0105.png": {
      "cursor": false
    },
    "0106.png": {
      "cursor": false
    },
    "0107.png": {
      "cursor": false
    },
    "0108.png": {
      "cursor": false
    },
    "0109.png": {
      "hold": 2,
      "cap": "Flag on: a formatted phone number gets to Order placed",
      "vo": "With a formatted phone number, the order goes through.",
      "cursor": false
    },
    "0110.png": {
      "cursor": false
    },
    "0111.png": {
      "cursor": false
    },
    "0112.png": {
      "cursor": false
    },
    "0113.png": {
      "cursor": false
    },
    "0114.png": {
      "cursor": false
    },
    "0115.png": {
      "hold": 2,
      "cap": "A real mistake now shows its error on the field",
      "vo": "And when a field really is wrong, the error now shows right on that field.",
      "cursor": false
    },
    "0116.png": {
      "cursor": false
    },
    "0117.png": {
      "skip": true,
      "cursor": false
    },
    "0118.png": {
      "skip": true,
      "cursor": false
    },
    "0119.png": {
      "skip": true,
      "cursor": false
    },
    "0120.png": {
      "cursor": false
    },
    "0121.png": {
      "skip": true,
      "cursor": false
    },
    "0122.png": {
      "skip": true,
      "cursor": false
    },
    "0123.png": {
      "skip": true,
      "cursor": false
    },
    "0124.png": {
      "cursor": false
    },
    "0125.png": {
      "skip": true,
      "cursor": false
    },
    "0126.png": {
      "skip": true,
      "cursor": false
    },
    "0127.png": {
      "skip": true,
      "cursor": false
    },
    "0128.png": {
      "cursor": false
    },
    "0129.png": {
      "skip": true,
      "cursor": false
    },
    "0130.png": {
      "skip": true,
      "cursor": false
    },
    "0131.png": {
      "skip": true,
      "cursor": false
    },
    "0132.png": {
      "cursor": false
    },
    "0133.png": {
      "skip": true,
      "cursor": false
    },
    "0134.png": {
      "skip": true,
      "cursor": false
    },
    "0135.png": {
      "skip": true,
      "cursor": false
    },
    "0136.png": {
      "cursor": false
    },
    "0137.png": {
      "skip": true,
      "cursor": false
    },
    "0138.png": {
      "skip": true,
      "cursor": false
    },
    "0139.png": {
      "skip": true,
      "cursor": false
    },
    "0140.png": {
      "cursor": false
    },
    "0141.png": {
      "skip": true,
      "cursor": false
    },
    "0142.png": {
      "skip": true,
      "cursor": false
    },
    "0143.png": {
      "skip": true,
      "cursor": false
    },
    "0144.png": {
      "cursor": false
    },
    "0145.png": {
      "skip": true,
      "cursor": false
    },
    "0146.png": {
      "skip": true,
      "cursor": false
    },
    "0147.png": {
      "skip": true,
      "cursor": false
    },
    "0148.png": {
      "cursor": false
    },
    "0149.png": {
      "skip": true,
      "cursor": false
    },
    "0150.png": {
      "skip": true,
      "cursor": false
    },
    "0151.png": {
      "skip": true,
      "cursor": false
    },
    "0152.png": {
      "cursor": false
    },
    "0153.png": {
      "skip": true,
      "cursor": false
    },
    "0154.png": {
      "skip": true,
      "cursor": false
    },
    "0155.png": {
      "skip": true,
      "cursor": false
    },
    "0156.png": {
      "cursor": false
    },
    "0157.png": {
      "skip": true,
      "cursor": false
    },
    "0158.png": {
      "skip": true,
      "cursor": false
    },
    "0159.png": {
      "cursor": false
    },
    "0160.png": {
      "hold": 3.5,
      "cap": "Testing found polish issues: Devin pushed a fix and retested",
      "vo": "Testing turned up a few polish issues, so Devin pushed a follow-up commit and retested on a phone-sized screen.",
      "cursor": false
    },
    "0161.png": {
      "skip": true,
      "cursor": false
    },
    "0162.png": {
      "cap": "PR branch locally, flag off: the same formatted number",
      "vo": "Finally, here's the pull request branch running locally. With the flag off, I type the same formatted number, and Continue still does nothing visible."
    },
    "0173.png": {
      "hold": 2,
      "cap": "Flag off: Continue does nothing visible"
    },
    "0174.png": {
      "cap": "Flag on: same number",
      "vo": "With the flag on, the same number takes me straight to payment."
    },
    "0183.png": {
      "hold": 3.5,
      "cap": "Flag on: on to Payment"
    }
  }
};
