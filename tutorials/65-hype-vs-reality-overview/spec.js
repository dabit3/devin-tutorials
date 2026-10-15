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
      "hold": 4,
      "cursor": false,
      "capPos": "bottom",
      "cap": "Where Modal fits: everything after the X search",
      "vo": "Here's where Modal fits. Grok searches X through the xAI API. It looks at posts from a few public accounts. Everything after that runs on Modal, right up to the page anyone can open.",
      "voSay": "Here's where Modal fits. Grok searches X through the ex A I API. It looks at posts from a few public accounts. Everything after that runs on Modal, right up to the page anyone can open."
    },
    "0001b.png": {
      "scene": "modal",
      "hold": 5,
      "cursor": false,
      "capPos": "bottom",
      "vo": "Why use Modal? The job comes in bursts: one big parallel search, then nothing until the next check. A laptop script stops when the lid closes, and a server of your own sits idle all day. On Modal, a schedule runs the re-checks with no server to maintain. Map spreads the xAI calls across many containers at once. A Dict stores the results, and a web endpoint serves the page at a public URL. The xAI key lives in a Modal Secret. When nothing is running, the app scales to zero, so you pay per second of work.",
      "cap": "Why Modal: no server to run, parallel calls, storage, a public URL",
      "voSay": "Why use Modal? The job comes in bursts: one big parallel search, then nothing until the next check. A laptop script stops when the lid closes, and a server of your own sits idle all day. On Modal, a schedule runs the re-checks with no server to maintain. Map spreads the ex A I calls across many containers at once. A Dict stores the results, and a web endpoint serves the page at a public URL. The ex A I key lives in a Modal Secret. When nothing is running, the app scales to zero, so you pay per second of work."
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
        "x": 693,
        "y": 550,
        "w": 670,
        "h": 116
      },
      "cap": "Devin's plan, then modal deploy",
      "vo": "It planned the Modal pieces, and shipped the app with modal deploy."
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
      "cap": "Counts of sampled posts found so far",
      "vo": "On the page running on Modal, it has found six predictions so far in sampled posts. One is marked right, and five are still pending."
    },
    "0007.png": {
      "hold": 3,
      "cursor": false,
      "ring": true,
      "cap": "Each pending prediction shows its check date",
      "vo": "Each pending one shows the date it can be checked. After filming, the daily schedule was switched off to save cost."
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
