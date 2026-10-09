window.SPEC = {
  "title": "The review loop closes itself",
  "subtitle": "Devin Review flags a bug, Devin fixes it, you read the final diff",
  "outro": "Devin closes the loop. You read the final diff",
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.6,
  "pollRunMax": 2.5,
  "edit": {
    "0000.png": {
      "cap": "Automatic review on every push",
      "vo": "Code review usually takes a few round trips. With Auto-Fix, Devin closes that loop on its own, and you only read one final diff. Orbit is enrolled for automatic review, so Devin Review runs when a pull request opens, and again on every push.",
      "hold": 3.4,
      "capPos": "bottom"
    },
    "0001.png": {
      "cap": "By default, Devin ignores bot comments",
      "vo": "By default, Devin ignores comments from bots, including Devin Review.",
      "capPos": "bottom"
    },
    "0005.png": {
      "cap": "Responding to bots → Selected only",
      "vo": "So set Responding to bots to Selected only.",
      "voSay": "So set Responding to bots to Selected only.",
      "capPos": "bottom"
    },
    "0008.png": {
      "cap": "Allow devin-ai-integration[bot]",
      "vo": "Then allow Devin Review's bot. That one setting closes the loop.",
      "capPos": "bottom"
    },
    "0009.png": {
      "cap": "Ask Devin for a real feature",
      "vo": "Now I ask Devin for a real feature: optional due dates on issues, with chips for due today and overdue, plus tests and a pull request.",
      "capPos": "bottom"
    },
    "0086.png": {
      "badge": "Sped up"
    },
    "0087.png": {
      "badge": "Sped up"
    },
    "0088.png": {
      "badge": "Sped up"
    },
    "0089.png": {
      "badge": "Sped up"
    },
    "0090.png": {
      "badge": "Sped up"
    },
    "0091.png": {
      "badge": "Sped up"
    },
    "0092.png": {
      "badge": "Sped up"
    },
    "0093.png": {
      "badge": "Sped up"
    },
    "0094.png": {
      "badge": "Sped up"
    },
    "0095.png": {
      "badge": "Sped up"
    },
    "0096.png": {
      "badge": "Sped up"
    },
    "0097.png": {
      "badge": "Sped up"
    },
    "0098.png": {
      "badge": "Sped up"
    },
    "0099.png": {
      "badge": "Sped up"
    },
    "0100.png": {
      "badge": "Sped up"
    },
    "0101.png": {
      "badge": "Sped up"
    },
    "0102.png": {
      "badge": "Sped up"
    },
    "0103.png": {
      "badge": "Sped up"
    },
    "0104.png": {
      "badge": "Sped up"
    },
    "0105.png": {
      "badge": "Sped up"
    },
    "0106.png": {
      "badge": "Sped up"
    },
    "0107.png": {
      "badge": "Sped up"
    },
    "0108.png": {
      "badge": "Sped up"
    },
    "0109.png": {
      "cap": "Devin opens the pull request",
      "vo": "Devin builds it and opens the pull request. From here, no human touches it.",
      "capPos": "bottom",
      "hl": null
    },
    "0110.png": {
      "skip": true
    },
    "0111.png": {
      "skip": true
    },
    "0112.png": {
      "skip": true
    },
    "0113.png": {
      "skip": true
    },
    "0114.png": {
      "skip": true
    },
    "0115.png": {
      "skip": true
    },
    "0116.png": {
      "skip": true
    },
    "0117.png": {
      "cap": "Devin Review finds 2 bugs in the new code",
      "vo": "Devin Review analyzes it right away, and finds two real bugs in the code Devin just wrote."
    },
    "0120.png": {
      "cap": "Past midnight, “Due today” never turns “Overdue”",
      "vo": "Here's the first, on the diff line. If the board stays open past midnight, a card due today never turns overdue."
    },
    "0121.png": {
      "cap": "Auto-fix: the owning session is on it",
      "vo": "The Auto-fix section shows the session that owns this pull request is already on it."
    },
    "0122.png": {
      "skip": true
    },
    "0123.png": {
      "cap": "No human prompt: Devin reads the findings",
      "vo": "Nobody typed anything. The session read the findings by itself, and started fixing them.",
      "capPos": "bottom",
      "hl": [
        {
          "x": 720,
          "y": 401,
          "w": 865,
          "h": 326
        }
      ]
    },
    "0124.png": {
      "badge": "Sped up"
    },
    "0125.png": {
      "badge": "Sped up"
    },
    "0126.png": {
      "badge": "Sped up"
    },
    "0127.png": {
      "badge": "Sped up"
    },
    "0128.png": {
      "badge": "Sped up"
    },
    "0129.png": {
      "badge": "Sped up"
    },
    "0130.png": {
      "badge": "Sped up"
    },
    "0131.png": {
      "badge": "Sped up"
    },
    "0132.png": {
      "badge": "Sped up"
    },
    "0133.png": {
      "badge": "Sped up"
    },
    "0134.png": {
      "badge": "Sped up"
    },
    "0135.png": {
      "badge": "Sped up"
    },
    "0136.png": {
      "badge": "Sped up"
    },
    "0137.png": {
      "badge": "Sped up"
    },
    "0138.png": {
      "badge": "Sped up"
    },
    "0139.png": {
      "badge": "Sped up"
    },
    "0140.png": {
      "badge": "Sped up"
    },
    "0141.png": {
      "badge": "Sped up"
    },
    "0142.png": {
      "badge": "Sped up"
    },
    "0143.png": {
      "badge": "Sped up"
    },
    "0144.png": {
      "badge": "Sped up"
    },
    "0145.png": {
      "cap": "Review is clean, CI passed",
      "vo": "Every push gets a fresh review. Review even caught new bugs in Devin's own fixes, and Devin fixed those too, until the latest round came back clean.",
      "capPos": "bottom",
      "hl": [
        {
          "x": 699,
          "y": 525,
          "w": 824,
          "h": 115
        }
      ]
    },
    "0148.png": {
      "cap": "Three fix commits, all from Devin",
      "vo": "Three fix commits, all pushed by Devin.",
      "hl": [
        {
          "x": 486,
          "y": 559,
          "w": 773,
          "h": 297
        }
      ]
    },
    "0149.png": {
      "cap": "5 bugs found, 5 resolved",
      "vo": "Five bugs found, five resolved."
    },
    "0152.png": {
      "cap": "CI green: all checks passed",
      "vo": "And CI is green. All checks passed."
    },
    "0155.png": {
      "cap": "The final diff: chips follow the current day",
      "vo": "Now the human's only job: read the final diff. The card now reads the current day from a shared hook, so the chip moves to overdue after midnight.",
      "hl": [
        {
          "x": 483,
          "y": 469,
          "w": 856,
          "h": 50
        },
        {
          "x": 1196,
          "y": 588,
          "w": 445,
          "h": 349
        }
      ]
    },
    "0156.png": {
      "cap": "Merge from Devin Review",
      "vo": "It looks right, so I merge it from Devin Review."
    },
    "0160.png": {
      "cap": "Merged",
      "vo": "Merged. The loop closed itself."
    }
  },
  "voOutro": "Devin closes the review loop, and you only read the final diff."
};
