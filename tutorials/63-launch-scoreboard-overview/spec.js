window.SPEC = {
  "title": "Launch Scoreboard",
  "subtitle": "How it works, and what you can do with it",
  "outro": "Who won the launch? Now you can check",
  "voOutro": "Who won the launch? Now you can check.",
  "dark": true,
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.3,
  "edit": {
    "0000.png": {
      "scene": "intro",
      "hold": 7,
      "cursor": false,
      "capPos": "bottom",
      "cap": "The first 72 hours of reaction on X, side by side",
      "vo": "Every big launch starts an argument about who won it. This app answers it with posts from the first seventy-two hours on X, side by side."
    },
    "0001.png": {
      "scene": "pipeline",
      "hold": 8,
      "cursor": false,
      "capPos": "bottom",
      "cap": "X posts, Grok with X Search, then Modal",
      "vo": "Here's how it works. Grok samples posts from X through the xAI API, with X Search. Everything after that runs on Modal.",
      "voSay": "Here's how it works. Grok samples posts from X through the ex A I API, with X Search. Everything after that runs on Modal."
    },
    "0002.png": {
      "scene": "fanout",
      "hold": 8,
      "cursor": false,
      "capPos": "bottom",
      "cap": "A schedule, a parallel .map(), a Dict and a web endpoint",
      "vo": "Inside Modal, a cron schedule calls refresh every six hours. Refresh uses map to analyze each launch in its own container, in parallel. Results land in a Modal Dict, and a web endpoint serves the public page.",
      "voSay": "Inside Modal, a kron schedule calls refresh every six hours. Refresh uses map to analyze each launch in its own container, in parallel. Results land in a Modal Dict, and a web endpoint serves the public page."
    },
    "0010.png": {
      "scene": "modalwhy",
      "hold": 10,
      "cursor": false,
      "capPos": "bottom",
      "cap": "Why Modal: no idle server, no laptop left open",
      "vo": "Why Modal? A laptop script stops when the laptop sleeps, and a server sits idle between refreshes. Modal scales to zero between runs and bills by the second. The xAI key stays in a Modal Secret.",
      "voSay": "Why Modal? A laptop script stops when the laptop sleeps, and a server sits idle between refreshes. Modal scales to zero between runs and bills by the second. The ex A I key stays in a Modal Secret."
    },
    "0003.png": {
      "scene": "honest",
      "hold": 6,
      "cursor": false,
      "capPos": "bottom",
      "cap": "Sampled, model-classified, linked",
      "vo": "The numbers are honest about what they are. Counts are sampled posts, Grok classifies each one, and every quote links back to X."
    },
    "0004.png": {
      "hold": 3,
      "cursor": false,
      "subPos": "top",
      "cap": "Devin built it from one short prompt",
      "vo": "Devin built all of this from one short prompt in the product demo apps repo."
    },
    "0005.png": {
      "hold": 3,
      "cursor": false,
      "subPos": "top",
      "cap": "modal deploy, and the public URL answers",
      "vo": "It deployed the app with modal deploy, and the page answered on its public URL.",
      "ring": {
        "x": 735,
        "y": 516,
        "w": 852,
        "h": 146
      },
      "ringFor": 3.5
    },
    "0006.png": {
      "hold": 3,
      "cursor": false,
      "subPos": "top",
      "cap": "A pull request in product-demo-apps",
      "vo": "Then it opened a pull request in the demo apps repo."
    },
    "0007.png": {
      "hold": 3,
      "cursor": false,
      "subPos": "bottom",
      "cap": "The page running on Modal, from a real run",
      "vo": "Here's the real run, on Modal. Claude Opus 5.5 netted plus fifty-eight from fifty sampled posts, and GPT-6 Sol came in at plus four.",
      "voSay": "Here's the real run, on Modal. Claude Opus five point five netted plus fifty-eight from fifty sampled posts, and G P T six, Sole, came in at plus four."
    },
    "0008.png": {
      "hold": 3,
      "cursor": false,
      "subPos": "bottom",
      "cap": "Posts that shaped the conversation, linked to X",
      "vo": "Each column links the posts that shaped the conversation."
    },
    "0009.png": {
      "scene": "extend",
      "hold": 7,
      "cursor": false,
      "capPos": "bottom",
      "cap": "Ways to extend it",
      "vo": "To extend it, add a launch with one new row, track a longer window, or chart sentiment over time. You could even post a daily recap.",
      "voSay": "To extend it, add a launch with one new row, track a longer window, or chart sentiment over time. You could even post a daily recap. <break time=\"1.0s\" />"
    }
  }
};
