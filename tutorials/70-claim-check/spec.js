window.SPEC = {
  "title": "Claim Check on Modal",
  "subtitle": "Devin builds and deploys a claim checker with the xAI API, step by step",
  "outro": "Viral claims in, verdicts with primary sources out",
  "voOutro": "Viral claims in, verdicts with primary sources out.",
  "dark": true,
  "speed": 3,
  "cps": 90,
  "maxZoom": 1.3,
  "pollRunMax": 1,
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
      "vo": "Here, Devin builds a claim checker that uses the xAI API to find those posts on X, and shows a verdict for each claim with its primary sources.",
      "voSay": "Here, Devin builds a claim checker that uses the ex A I API to find those posts on X, and shows a verdict for each claim with its primary sources.",
      "cap": "Goal: a deployed page of claims, verdicts and sources"
    },
    "modal.png": {
      "cursor": false,
      "scene": "modal",
      "capPos": "bottom",
      "hold": 5,
      "vo": "It runs on Modal. A scheduled function pulls new posts every hour, so there's no server to keep running. Calling .map() checks the claims in parallel across containers. A Modal Dict stores the results, a web endpoint serves the page at a public modal.run URL, and a Modal Secret holds the xAI key. Between runs it scales to zero, and you pay by the second, instead of leaving a laptop script or a server on all day.",
      "voSay": "It runs on Modal. A scheduled function pulls new posts every hour, so there's no server to keep running. Calling dot map checks the claims in parallel across containers. A Modal Dict stores the results, a web endpoint serves the page at a public modal dot run URL, and a Modal Secret holds the ex A I key. Between runs it scales to zero, and you pay by the second, instead of leaving a laptop script or a server on all day.",
      "cap": "Modal runs it on a schedule, no server to keep on"
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
      "hold": 5.45,
      "cap": "A public modal.run page that scales to zero"
    },
    "0002.png": {
      "cursor": false,
      "hold": 1.2
    },
    "0003.png": {
      "cursor": false,
      "hold": 5,
      "vo": "In the prompt, I ask for an hourly scan with X Search and parallel claim checks, with results saved in a Modal Dict and shown on a dark web page. It must never post to X, and it labels counts as posts found, not totals.",
      "cap": "The prompt: hourly scan, parallel checks, dark page"
    },
    "0005.png": {
      "cursor": false,
      "hold": 3,
      "vo": "Devin replies with a short plan that matches the prompt, and then it writes the app and its tests.",
      "cap": "Devin's plan, then the app and its tests"
    },
    "0011.png": {
      "cursor": false,
      "hold": 3,
      "vo": "Then it runs modal deploy, and calls the public URL to check that the page responds.",
      "cap": "modal deploy, then a check of the public URL"
    },
    "0016.png": {
      "cursor": false,
      "hold": 2,
      "vo": "Next, Devin pushes a branch and opens a pull request.",
      "cap": "Devin opens a pull request"
    },
    "0018.png": {
      "cursor": false,
      "hold": 3,
      "vo": "Devin Review checks the pull request. Three findings are resolved, and four are still open.",
      "cap": "Devin Review: three resolved, four still open"
    },
    "0028.png": {
      "cursor": false,
      "hold": 3.5,
      "vo": "When it's done, Devin reports the deployed URL and how it tested the app, and notes that every verdict so far was supported.",
      "cap": "Devin reports the URL and how it tested"
    },
    "0029.png": {
      "cursor": false,
      "hold": 2.2,
      "vo": "Here's the page running on Modal.",
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
