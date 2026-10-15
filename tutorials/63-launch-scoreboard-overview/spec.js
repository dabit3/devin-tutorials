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
      "hold": 8.5,
      "cursor": false,
      "capPos": "bottom",
      "cap": "X posts, Grok with X Search, Modal, a live page",
      "vo": "Here's how it works. Grok samples posts from X through the xAI API, with X Search. Modal runs the functions, stores the results, and serves a live page.",
      "voSay": "Here's how it works. Grok samples posts from X through the ex A I API, with X Search. Modal runs the functions, stores the results, and serves a lyve page."
    },
    "0002.png": {
      "scene": "fanout",
      "hold": 8,
      "cursor": false,
      "capPos": "bottom",
      "cap": "A schedule, a parallel .map(), a Dict and a web endpoint",
      "vo": "Inside Modal, a cron schedule calls refresh every six hours. Refresh uses map to analyze each launch in its own container, in parallel. Results land in a Modal Dict, and a web endpoint reads them.",
      "voSay": "Inside Modal, a kron schedule calls refresh every six hours. Refresh uses map to analyze each launch in its own container, in parallel. Results land in a Modal Dict, and a web endpoint reads them."
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
      "cap": "Deployed with modal deploy",
      "vo": "It deployed the app with modal deploy, then ran the first refresh."
    },
    "0006.png": {
      "hold": 3,
      "cursor": false,
      "subPos": {
        "x": 0.2,
        "y": 0.5
      },
      "cap": "A pull request in product-demo-apps",
      "vo": "Then it opened a pull request, with the code and a screenshot of the live page.",
      "voSay": "Then it opened a pull request, with the code and a screenshot of the lyve page."
    },
    "0007.png": {
      "hold": 3,
      "cursor": false,
      "subPos": "bottom",
      "cap": "The live app on Modal, from a real run",
      "vo": "Here's the real run. Claude Opus 5.5 netted plus fifty-eight from fifty sampled posts, and GPT-6 Sol came in at plus four.",
      "voSay": "Here's the real run. Claude Opus five point five netted plus fifty-eight from fifty sampled posts, and G P T six Sol came in at plus four."
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
