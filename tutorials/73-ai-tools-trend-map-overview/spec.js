window.SPEC = {
  "title": "AI Tools Trend Map",
  "subtitle": "How it works and what you can do with it",
  "outro": "Let the data show what's catching on",
  "voOutro": "Let the data show what's catching on.",
  "tailHold": 0.5,
  "outroVoDelay": 0.3,
  "introHold": 3.4,
  "pace": 1,
  "speed": 3,
  "capMin": 3,
  "voSentGap": 0.5,
  "maxZoom": 1.3,
  "dark": true,
  "noZoom": [
    [
      "0010.png",
      "0040.png"
    ],
    [
      "0080.png",
      "0080.png"
    ]
  ],
  "edit": {
    "0010.png": {
      "hold": 9,
      "cap": "Which AI coding tools are people actually using?",
      "vo": "Which AI coding tools are people actually using, and which ones are they only talking about? This app answers that with real posts from X, so founders, investors and developers can see what's catching on.",
      "scene": "intro",
      "cursor": false
    },
    "0020.png": {
      "hold": 12,
      "cap": "X posts, the xAI API, Modal, storage, a public page",
      "vo": "Here's how it works. Grok searches posts on X through the xAI API. Modal runs those searches and keeps the results in a Modal Dict. A web endpoint on the same app serves the page.",
      "scene": "pipeline",
      "voSay": "Here's how it works. Grok searches posts on X through the ex A I API. Modal runs those searches and keeps the results in a Modal Dict. A web endpoint on the same app serves the page."
    },
    "0025.png": {
      "hold": 1.5,
      "cap": "Why Modal: schedule, parallel searches, storage, a public URL",
      "vo": "So why Modal? A laptop script can't keep running on a timer, and it has no public URL. A server you manage would sit idle and cost money between refreshes. On Modal, a scheduled function does the daily pull, and .map() runs the searches in parallel across containers. A Modal Dict keeps the results, and a web endpoint serves the page at a modal.run URL. The xAI key lives in a Modal Secret. The app scales to zero when nobody is using it, and you only pay for the seconds it runs.",
      "scene": "modal",
      "voSay": "So why Modal? A laptop script can't keep running on a timer, and it has no public URL. A server you manage would sit idle and cost money between refreshes. On Modal, a scheduled function does the daily pull, and dot map runs the searches in parallel across containers. A Modal Dict keeps the results, and a web endpoint serves the page at a modal dot run URL. The ex A I key lives in a Modal Secret. The app scales to zero when nobody is using it, and you only pay for the seconds it runs."
    },
    "0030.png": {
      "hold": 8,
      "cap": "40 searches in parallel with .map()",
      "vo": "That's ten tools across four weeks, so each refresh runs forty searches in parallel with .map(). Every search has its own date range.",
      "scene": "fanout",
      "voSay": "That's ten tools across four weeks, so each refresh runs forty searches in parallel with dot map. Every search has its own date range."
    },
    "0040.png": {
      "hold": 8.2,
      "cap": "Usage report or hype: counts are a sample, not totals",
      "vo": "Each post that Grok finds gets a label, real usage report or hype. The counts are posts found in the X search sample, not totals.",
      "scene": "classify"
    },
    "0041.png": {
      "hold": 4,
      "cap": "The real run: one plain-language prompt",
      "vo": "In the real run, Devin built the whole app from this one prompt."
    },
    "0051.png": {
      "hold": 3.5,
      "cap": "Deployed with modal deploy",
      "ring": {
        "x": 488,
        "y": 117,
        "w": 356,
        "h": 30
      },
      "ringFor": 2.6,
      "vo": "It deployed the app to Modal with modal deploy."
    },
    "0052.png": {
      "hold": 4,
      "cap": "Schedule off for this run: the workspace was at its limit",
      "ring": {
        "x": 814,
        "y": 313,
        "w": 196,
        "h": 26
      },
      "ringFor": 3,
      "vo": "The daily schedule is in the code, but this run deployed with it switched off, because the workspace had hit its limit of scheduled functions."
    },
    "0061.png": {
      "hold": 4,
      "cap": "Public URL checked, pull request #76",
      "ring": {
        "x": 572,
        "y": 459,
        "w": 584,
        "h": 24
      },
      "ringFor": 3,
      "vo": "Devin checked the public URL again after a small color fix, and the code is in a pull request."
    },
    "0071.png": {
      "hold": 6,
      "cap": "The app on Modal, with real data from X",
      "vo": "Here's the page running on Modal with real data. In this sample, Codex and Cursor have the highest share of usage reports."
    },
    "0080.png": {
      "hold": 9,
      "cap": "Ways to extend it",
      "vo": "To take it further, add a weekly digest, or alerts when a new tool starts to emerge. You could also track more categories, or add a second source to check the X sample against.",
      "scene": "extend"
    }
  }
};
