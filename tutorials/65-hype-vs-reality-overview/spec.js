window.SPEC = {
  "title": "Hype vs. Reality",
  "subtitle": "How a prediction tracker on Modal and the xAI API works",
  "dark": true,
  "outro": "Bold predictions, checked later, with a source for every verdict",
  "voOutro": "Bold predictions, checked later, with a source for every verdict.",
  "outroVoDelay": 0.2,
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.3,
  "noZoom": [
    [
      "0003.png",
      "0007.png"
    ]
  ],
  "edit": {
    "0000.png": {
      "scene": "intro",
      "hold": 4.5,
      "cursor": false,
      "capPos": "bottom",
      "cap": "Find predictions on X, then check them later",
      "vo": "Tech predictions on X are easy to post and rarely checked later. This app keeps the exact quote and a link to each post, then checks back when each one comes due."
    },
    "0001.png": {
      "scene": "pipeline",
      "hold": 7,
      "cursor": false,
      "capPos": "bottom",
      "cap": "X posts, xAI search, Modal functions, storage, page",
      "vo": "It runs as one Modal app. Grok, through the xAI API, searches X for recent posts from a few public accounts. Modal extracts them in parallel with map, and stores the results in a Modal Dict. A daily Cron job re-checks the pending ones, and a web endpoint serves the leaderboard.",
      "voSay": "It runs as one Modal app. Grok, through the ex A I API, searches X for recent posts from a few public accounts. Modal extracts them in parallel with map, and stores the results in a Modal Dict. A daily cron job re-checks the pending ones, and a web endpoint serves the leaderboard."
    },
    "0002.png": {
      "scene": "rules",
      "hold": 5,
      "cursor": false,
      "capPos": "bottom",
      "cap": "Pending until a check date, verdicts only with sources",
      "vo": "To stay factual, every quote is checked against the original post. Each prediction stays pending until its check date, and it's only marked right or wrong when a cited source backs it up."
    },
    "0003.png": {
      "hold": 3.4,
      "cursor": false,
      "hl": true,
      "cap": "Devin built it from one plain-language prompt",
      "vo": "Devin built the whole thing from one plain-language prompt in the product demo apps repo."
    },
    "0004.png": {
      "hold": 3,
      "cursor": false,
      "ring": {
        "x": 487.6,
        "y": 599,
        "w": 246,
        "h": 20
      },
      "cap": "Deployed with modal deploy",
      "vo": "It shipped the app with modal deploy, then tested the deployed page."
    },
    "0005.png": {
      "hold": 3.4,
      "cursor": false,
      "ring": true,
      "cap": "A pull request, with review findings fixed",
      "vo": "It opened a pull request, and fixed the five issues Devin Review flagged."
    },
    "0006.png": {
      "hold": 3.6,
      "cursor": false,
      "ring": true,
      "cap": "Counts of posts found so far",
      "vo": "On the deployed page, it has found six predictions so far, with one marked right and five still pending."
    },
    "0007.png": {
      "hold": 3,
      "cursor": false,
      "ring": true,
      "cap": "Each pending prediction shows its check date",
      "vo": "Each pending one shows the date it can be checked."
    },
    "0008.png": {
      "scene": "extend",
      "hold": 5,
      "cursor": false,
      "capPos": "bottom",
      "cap": "More accounts, alerts, account pages, dashboards",
      "vo": "To extend it, you could track more accounts and topics, or send an alert when a check date arrives. You could also add a page for each account, or feed the JSON into your own dashboard."
    }
  }
};
