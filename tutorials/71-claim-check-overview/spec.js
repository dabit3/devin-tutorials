window.SPEC = {
  "title": "Claim Check",
  "subtitle": "How it works, and what you can build on it",
  "outro": "Every viral claim, checked against its sources",
  "voOutro": "Every viral claim, checked against its sources.",
  "dark": true,
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.3,
  "edit": {
    "0000.png": {
      "cursor": false,
      "capPos": "bottom",
      "scene": "value",
      "hold": 6,
      "cap": "Viral AI claims, checked against primary sources",
      "vo": "Claim Check watches X for viral AI posts that make technical claims, then finds the primary sources and checks each claim against them.",
      "voHold": 6.6
    },
    "0001.png": {
      "cursor": false,
      "capPos": "bottom",
      "scene": "why",
      "hold": 6,
      "cap": "A checker that shows its links earns trust",
      "vo": "Claims like these spread fast, and checking them takes real sources, so a checker that shows its links is easier to trust.",
      "voHold": 6
    },
    "0002.png": {
      "cursor": false,
      "capPos": "bottom",
      "scene": "pipe1",
      "hold": 6,
      "cap": "X posts, the xAI API, and an hourly Modal Cron job",
      "vo": "Posts on X come in through the xAI API, where Grok runs X Search, and a Modal Cron job runs that search every hour.",
      "voSay": "Posts on X come in through the ex A I API, where Grok runs X Search, and a Modal Cron job runs that search every hour.",
      "voHold": 6.7
    },
    "0003.png": {
      "cursor": false,
      "capPos": "bottom",
      "scene": "pipe2",
      "hold": 6,
      "cap": ".map() checks every claim in parallel",
      "vo": "Then check claim dot map fans the posts out, so the claims are checked in parallel, with Grok searching the web for primary sources.",
      "voHold": 6.6
    },
    "0004.png": {
      "cursor": false,
      "capPos": "bottom",
      "scene": "pipe3",
      "hold": 6,
      "cap": "A modal.Dict, a web endpoint, a dark page",
      "vo": "The results are saved in a Modal Dict, and a web endpoint serves them as a dark page on a modal.run URL.",
      "voSay": "The results are saved in a Modal Dict, and a web endpoint serves them as a dark page on a modal dot run URL.",
      "voHold": 6
    },
    "0005.png": {
      "cursor": false,
      "capPos": "bottom",
      "hold": 3.5,
      "cap": "Built by Devin from one short prompt",
      "vo": "Devin built all of this from one short prompt in the product demo apps repo."
    },
    "0006.png": {
      "cursor": false,
      "capPos": "bottom",
      "hold": 3.5,
      "cap": "Tests, modal deploy, and a check of the URL",
      "vo": "It wrote the app and its tests, ran modal deploy, and checked the deployed URL."
    },
    "0007.png": {
      "cursor": false,
      "capPos": "bottom",
      "hold": 3,
      "ring": {
        "x": 393.3,
        "y": 443.9,
        "w": 670.7,
        "h": 29.7
      },
      "cap": "The .map() fan-out in the code Devin wrote",
      "vo": "Here's the fan out with dot map, in the code it wrote.",
      "ringFor": 2.6
    },
    "0008.png": {
      "cursor": false,
      "capPos": "bottom",
      "hold": 3.5,
      "cap": "Devin Review: three findings resolved, four open",
      "vo": "Devin then opened a pull request, where Devin Review shows three findings resolved and four still open."
    },
    "0009.png": {
      "cursor": false,
      "capPos": "bottom",
      "hold": 3.5,
      "ring": {
        "x": 720.0,
        "y": 265.9,
        "w": 985.6,
        "h": 110.6
      },
      "cap": "This run: 5 posts found, all 5 supported",
      "vo": "In this run, it found five posts on X, and all five claims were supported.",
      "ringFor": 2.6
    },
    "0010.png": {
      "cursor": false,
      "capPos": "bottom",
      "hold": 3.5,
      "ring": {
        "x": 720.0,
        "y": 455.4,
        "w": 939.4,
        "h": 67.1
      },
      "cap": "Every verdict links to its primary sources",
      "vo": "Each verdict links to its primary sources, like the arXiv paper behind a benchmark claim.",
      "voSay": "Each verdict links to its primary sources, like the archive paper behind a benchmark claim.",
      "ringFor": 2.6
    },
    "0011.png": {
      "cursor": false,
      "capPos": "bottom",
      "scene": "extend",
      "hold": 8,
      "cap": "Four ways to extend it",
      "vo": "You can take it further. Let people paste a post to check it on demand. Send unclear verdicts to a person for review. Add filings and press releases as sources for funding claims. Or send a Slack alert when a claim is not supported.",
      "voHold": 11.7
    }
  }
};
