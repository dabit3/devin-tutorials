window.SPEC = {
  "title": "Claim Check on Modal",
  "subtitle": "Devin builds and deploys a claim checker with the xAI API, step by step",
  "outro": "Viral claims in, verdicts with primary sources out",
  "voOutro": "Viral claims in, verdicts with primary sources out.",
  "dark": true,
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.3,
  "pollRunMax": 1,
  "noZoom": [
    [
      "0004.png"
    ]
  ],
  "edit": {
    "0000.png": {
      "cursor": false,
      "hold": 3,
      "vo": "Viral AI posts often make technical claims, like a benchmark record or a funding round, and few people check the sources behind them.",
      "cap": "Viral AI claims rarely get checked against sources"
    },
    "0001.png": {
      "cursor": false,
      "hold": 2,
      "vo": "Here, Devin builds a claim checker on Modal that uses the xAI API to find those posts on X, and shows a verdict for each claim with its primary sources.",
      "voSay": "Here, Devin builds a claim checker on Modal that uses the ex A I API to find those posts on X, and shows a verdict for each claim with its primary sources.",
      "cap": "Goal: a deployed page of claims, verdicts and sources"
    },
    "0002.png": {
      "cursor": false,
      "hold": 1.5
    },
    "0003.png": {
      "cursor": false,
      "hold": 5,
      "vo": "In the prompt, I ask for an hourly scan with X Search and parallel claim checks, with results saved in a Modal Dict and shown on a dark web page. It must never post to X, and it labels counts as posts found, not totals.",
      "cap": "The prompt: hourly scan, parallel checks, dark page"
    },
    "0004.png": {
      "cursor": false,
      "hold": 1.2,
      "vo": "Devin starts by reading the xAI docs and running a small X Search probe, and then it writes the app, its tests and a README.",
      "voSay": "Devin starts by reading the ex A I docs and running a small X Search probe, and then it writes the app, its tests and a README.",
      "cap": "Devin reads the docs and probes X Search"
    },
    "0005.png": {
      "cursor": false,
      "hold": 0.8,
      "badge": "Sped up"
    },
    "0006.png": {
      "cursor": false,
      "hold": 0.8,
      "badge": "Sped up"
    },
    "0007.png": {
      "cursor": false,
      "hold": 0.8,
      "badge": "Sped up"
    },
    "0008.png": {
      "cursor": false,
      "hold": 0.8,
      "badge": "Sped up"
    },
    "0009.png": {
      "cursor": false,
      "hold": 0.8,
      "badge": "Sped up"
    },
    "0010.png": {
      "cursor": false,
      "hold": 0.8,
      "badge": "Sped up"
    },
    "0011.png": {
      "cursor": false,
      "hold": 1.2,
      "badge": "Sped up",
      "vo": "It runs the tests, deploys with modal deploy, and checks that the page and the JSON endpoint both respond.",
      "cap": "Tests, modal deploy, then a check of the URL"
    },
    "0012.png": {
      "cursor": false,
      "hold": 1,
      "badge": "Sped up"
    },
    "0013.png": {
      "cursor": false,
      "hold": 1,
      "badge": "Sped up"
    },
    "0014.png": {
      "cursor": false,
      "hold": 1.2,
      "badge": "Sped up",
      "vo": "Then it runs the hourly job on the deployed app to test it with real posts from X.",
      "cap": "The hourly job runs on the deployed app"
    },
    "0015.png": {
      "cursor": false,
      "hold": 1,
      "badge": "Sped up"
    },
    "0016.png": {
      "cursor": false,
      "hold": 2,
      "badge": null,
      "vo": "Next, Devin pushes a branch and opens a pull request.",
      "cap": "Devin opens a pull request"
    },
    "0017.png": {
      "cursor": false,
      "hold": 2,
      "vo": "Devin Review checks the pull request and flags a few bugs and security findings.",
      "cap": "Devin Review flags bugs and security findings"
    },
    "0018.png": {
      "cursor": false,
      "hold": 3,
      "vo": "In Devin Review, three findings are resolved, and two bugs and two warnings are still open.",
      "cap": "Three resolved, four still open"
    },
    "0019.png": {
      "cursor": false,
      "hold": 2.5,
      "ring": {
        "x": 290.3,
        "y": 333.9,
        "w": 464.7,
        "h": 29.7
      },
      "vo": "The find posts function calls the xAI Responses API with the X Search tool.",
      "voSay": "The find posts function calls the ex A I Responses API with the X Search tool.",
      "cap": "find_posts: xAI Responses API with X Search",
      "ringFor": 2.5
    },
    "0020.png": {
      "cursor": false,
      "hold": 2.5,
      "ring": {
        "x": 207.2,
        "y": 333.9,
        "w": 298.4,
        "h": 29.7
      },
      "vo": "Each post goes to check claim, where Grok searches for primary sources and returns a verdict.",
      "cap": "check_claim: Grok looks for primary sources",
      "ringFor": 2.5
    },
    "0021.png": {
      "cursor": false,
      "hold": 2.5,
      "ring": {
        "x": 393.3,
        "y": 443.9,
        "w": 670.7,
        "h": 29.7
      },
      "vo": "The hourly job fans the posts out with check claim dot map, so the claims are checked in parallel.",
      "cap": ".map() checks the claims in parallel",
      "ringFor": 2.5
    },
    "0022.png": {
      "cursor": false,
      "hold": 2.5,
      "ring": {
        "x": 357.7,
        "y": 333.9,
        "w": 599.4,
        "h": 29.7
      },
      "vo": "A Modal Cron schedule runs that job at the top of every hour.",
      "cap": "modal.Cron runs it every hour",
      "ringFor": 2.5
    },
    "0023.png": {
      "cursor": false,
      "hold": 2.5,
      "ring": {
        "x": 322.0,
        "y": 333.9,
        "w": 528.1,
        "h": 29.7
      },
      "vo": "The results go into a Modal Dict, which keeps the latest run and a short history.",
      "cap": "Results are saved in a modal.Dict",
      "ringFor": 2.5
    },
    "0024.png": {
      "cursor": false,
      "hold": 2.5,
      "ring": {
        "x": 131.9,
        "y": 333.9,
        "w": 147.8,
        "h": 29.7
      },
      "vo": "And a FastAPI app behind modal asgi app serves the page.",
      "cap": "@modal.asgi_app serves the page",
      "ringFor": 2.5
    },
    "0025.png": {
      "cursor": false,
      "hold": 1,
      "badge": "Sped up",
      "vo": "Devin works through the review comments, pushes fixes and deploys again.",
      "cap": "Devin fixes review comments and redeploys"
    },
    "0026.png": {
      "cursor": false,
      "hold": 1,
      "badge": "Sped up"
    },
    "0027.png": {
      "cursor": false,
      "hold": 1,
      "badge": "Sped up"
    },
    "0028.png": {
      "cursor": false,
      "hold": 3.5,
      "badge": null,
      "vo": "When it's done, Devin reports the deployed URL and how it tested the app, and notes that every verdict so far was supported.",
      "cap": "Devin reports the URL and how it tested"
    },
    "0029.png": {
      "cursor": false,
      "hold": 2.5,
      "vo": "Here's the deployed page at its modal dot run URL.",
      "voSay": "Here's the deployed page at its modal dot run URL.",
      "cap": "The deployed page on modal.run"
    },
    "0030.png": {
      "cursor": false,
      "hold": 3,
      "ring": {
        "x": 720.0,
        "y": 265.9,
        "w": 985.6,
        "h": 110.6
      },
      "vo": "This run found five posts, and all five claims were supported by their sources.",
      "cap": "5 posts found this run, all 5 supported",
      "ringFor": 2.5
    },
    "0031.png": {
      "cursor": false,
      "hold": 2.5,
      "ring": {
        "x": 1125.4,
        "y": 61.6,
        "w": 124.0,
        "h": 41.8
      },
      "vo": "Each card shows the post, the claim Grok pulled out, and the verdict.",
      "cap": "Each card: post, claim and verdict",
      "ringFor": 2.5
    },
    "0032.png": {
      "cursor": false,
      "hold": 3,
      "ring": {
        "x": 720.0,
        "y": 455.4,
        "w": 939.4,
        "h": 67.1
      },
      "vo": "Below that are the primary source links, like the arXiv paper behind this benchmark claim.",
      "voSay": "Below that are the primary source links, like the archive paper behind this benchmark claim.",
      "cap": "Primary sources link to the evidence",
      "ringFor": 2.5
    },
    "0033.png": {
      "cursor": false,
      "hold": 1.2
    },
    "0034.png": {
      "cursor": false,
      "hold": 3.5,
      "ring": {
        "x": 720.0,
        "y": 700.2,
        "w": 985.6,
        "h": 60.5
      },
      "vo": "X Search returns a sample of posts, so the page labels its counts as posts found by each search, not totals.",
      "cap": "Counts are posts found, not totals",
      "ringFor": 2.5
    }
  }
};
