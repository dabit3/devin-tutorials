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
      "hold": 6.0,
      "cap": "Viral AI claims, checked against primary sources",
      "vo": "Claim Check watches X for viral AI posts that make technical claims, then finds the primary sources and checks each claim against them."
    },
    "0001.png": {
      "cursor": false,
      "capPos": "bottom",
      "scene": "why",
      "hold": 5.4,
      "cap": "A checker that shows its links earns trust",
      "vo": "Claims like these spread fast, and checking them takes real sources, so a checker that shows its links is easier to trust."
    },
    "modal.png": {
      "cursor": false,
      "capPos": "bottom",
      "scene": "modal",
      "hold": 5,
      "cap": "Modal runs it on a schedule, no server to keep on",
      "vo": "Modal is where it all runs. A scheduled function wakes up every hour, so there's no server to keep running. Calling .map() spreads the claim checks across containers, so they run in parallel. A Modal Dict stores the results, a web endpoint serves the page at a public modal.run URL, and a Modal Secret keeps the xAI key out of the code. Between runs it scales to zero and bills by the second, which beats leaving a laptop script or a server on all day.",
      "voSay": "Modal is where it all runs. A scheduled function wakes up every hour, so there's no server to keep running. Calling dot map spreads the claim checks across containers, so they run in parallel. A Modal Dict stores the results, a web endpoint serves the page at a public modal dot run URL, and a Modal Secret keeps the ex A I key out of the code. Between runs it scales to zero and bills by the second, which beats leaving a laptop script or a server on all day."
    },
    "modal-2.png": {
      "scene": "modal2",
      "fade": 0,
      "cursor": false,
      "capPos": "bottom",
      "hold": 5,
      "cap": "Parallel .map() checks the claims across containers"
    },
    "modal-3.png": {
      "scene": "modal3",
      "fade": 0,
      "cursor": false,
      "capPos": "bottom",
      "hold": 5,
      "cap": "A modal.Dict keeps results, a Secret holds the xAI key"
    },
    "modal-4.png": {
      "scene": "modal4",
      "fade": 0,
      "cursor": false,
      "capPos": "bottom",
      "hold": 7.40282,
      "cap": "A public modal.run page that scales to zero"
    },
    "0002.png": {
      "cursor": false,
      "capPos": "bottom",
      "scene": "pipe1",
      "hold": 6.3,
      "cap": "X posts come in through the xAI API, on a schedule",
      "vo": "Here's the path a claim takes. Posts on X come in through the xAI API, where Grok runs X Search on the hourly schedule.",
      "voSay": "Here's the path a claim takes. Posts on X come in through the ex A I API, where Grok runs X Search on the hourly schedule."
    },
    "0003.png": {
      "cursor": false,
      "capPos": "bottom",
      "scene": "pipe2",
      "hold": 6.0,
      "cap": ".map() checks every claim in parallel",
      "vo": "Then check claim dot map fans the posts out, so the claims are checked in parallel, with Grok searching the web for primary sources."
    },
    "0004.png": {
      "cursor": false,
      "capPos": "bottom",
      "scene": "pipe3",
      "hold": 4,
      "cap": "Results in a modal.Dict, served by a web endpoint",
      "vo": "The verdicts land in the Modal Dict, and the page running on Modal shows them."
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
      "hold": 10.3,
      "cap": "Four ways to extend it",
      "vo": "You can take it further. Let people paste a post to check it on demand. Send unclear verdicts to a person for review. Add filings and press releases as sources for funding claims. Or send a Slack alert when a claim is not supported."
    }
  }
};
