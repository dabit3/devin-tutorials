window.SPEC = {
  "title": "Docs that test themselves",
  "subtitle": "How it works, and what you can do with it",
  "outro": "Walkthroughs that test themselves",
  "voOutro": "So, three takeaways. Write your docs as plain-English walkthroughs. Let a fresh Devin follow each one, the way a new user would. And when a step breaks, Devin fixes whichever is wrong, the walkthrough or the product.",
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.3,
  "edit": {
    "0000.png": {
      "scene": "intro",
      "cursor": false,
      "capPos": "bottom",
      "hold": 7,
      "cap": "In this video: walkthroughs that test themselves",
      "vo": "In this video, you'll learn how docs that test themselves work. You'll see how Devin follows every plain-English walkthrough step by step on a fresh machine, how it decides whether the walkthrough or the product is wrong, and how to make it run on its own."
    },
    "0001.png": {
      "scene": "fanout",
      "cursor": false,
      "capPos": "bottom",
      "hold": 6,
      "cap": "One coordinator, one managed Devin per walkthrough",
      "vo": "One Devin coordinates the run. It starts a managed Devin for each walkthrough, each on its own fresh machine, all in parallel."
    },
    "0002.png": {
      "cursor": false,
      "hold": 3,
      "ring": {
        "x": 721,
        "y": 405,
        "w": 857,
        "h": 174
      },
      "ringFor": 2.6,
      "cap": "Real run: two broken examples planted on purpose",
      "vo": "Here's a real run on a small invoicing SDK, where we planted two broken examples on purpose."
    },
    "0003.png": {
      "cursor": false,
      "hold": 3,
      "ring": {
        "x": 713,
        "y": 280,
        "w": 863,
        "h": 418
      },
      "ringFor": 2.6,
      "cap": "Five managed Devins, one per page",
      "vo": "The coordinator starts five managed Devins, one per page."
    },
    "0004.png": {
      "cursor": false,
      "hold": 3.5,
      "ring": {
        "x": 932,
        "y": 189,
        "w": 670,
        "h": 113
      },
      "ringFor": 3,
      "cap": "Each one runs every snippet on its page",
      "vo": "Each one installs the SDK from scratch and runs every snippet, and here the invoices page fails."
    },
    "0005.png": {
      "scene": "decide",
      "cursor": false,
      "capPos": "bottom",
      "hold": 6,
      "cap": "Docs wrong, or SDK wrong?",
      "vo": "When a snippet fails, Devin works out whether the page is stale or the SDK has a bug, and the answer decides what the pull request fixes."
    },
    "0006.png": {
      "cursor": false,
      "hold": 3,
      "ring": {
        "x": 1001,
        "y": 690,
        "w": 824,
        "h": 49
      },
      "ringFor": 2.6,
      "cap": "Stale page: the PR fixes the docs",
      "vo": "That page still used a parameter name the SDK had renamed, so its pull request fixes the docs."
    },
    "0007.png": {
      "cursor": false,
      "hold": 3,
      "ring": {
        "x": 1001,
        "y": 779,
        "w": 824,
        "h": 50
      },
      "ringFor": 2.6,
      "capPos": "top",
      "cap": "Real bug: the PR fixes the SDK, plus a test",
      "vo": "The quickstart exposed a real bug in the SDK, so that pull request fixes the code and adds a test."
    },
    "0008.png": {
      "cursor": false,
      "hold": 2.6,
      "ring": {
        "x": 283,
        "y": 397,
        "w": 516,
        "h": 491
      },
      "ringFor": 2.0,
      "cap": "One summary of every page",
      "vo": "The coordinator collects the results into one summary."
    },
    "0009.png": {
      "scene": "repeat",
      "cursor": false,
      "capPos": "bottom",
      "hold": 6,
      "cap": "A playbook, run by an automation",
      "vo": "To keep it that way, save the procedure as a playbook, and create an automation that runs it whenever the walkthroughs change, and on a schedule."
    },
    "0010.png": {
      "cursor": false,
      "hold": 3,
      "ring": {
        "x": 1177,
        "y": 374,
        "w": 381,
        "h": 96
      },
      "ringFor": 2.6,
      "cap": "The real automation, with both triggers",
      "vo": "Here's the automation Devin created, with both triggers."
    },
    "0011.png": {
      "scene": "uses",
      "cursor": false,
      "capPos": "bottom",
      "hold": 5,
      "cap": "Walkthroughs, onboarding, help articles, runbooks",
      "vo": "It works for product walkthroughs, onboarding guides, help center articles, and runbooks."
    }
  }
};
