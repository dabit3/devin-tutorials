window.SPEC = {
  "title": "Docs that test themselves",
  "subtitle": "How it works, and what you can do with it",
  "outro": "Walkthroughs that test themselves",
  "voOutro": "So, three takeaways. Write your docs as plain-English walkthroughs. Let a fresh Devin follow each one, the way a new user would. And when a step breaks, Devin fixes whichever is wrong, the walkthrough or the app.",
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
      "vo": "In this video, you'll learn how docs that test themselves work. You'll see how Devin follows every plain-English walkthrough step by step on a fresh machine, how it decides whether the walkthrough or the app is wrong, and how to make it run on its own."
    },
    "0001.png": {
      "scene": "fanout",
      "cursor": false,
      "capPos": "bottom",
      "hold": 6,
      "cap": "One coordinator, one Devin per walkthrough",
      "vo": "One Devin coordinates the run. It starts a fresh Devin for each walkthrough, each on its own machine, all in parallel."
    },
    "0002.png": {
      "cursor": false,
      "hold": 3,
      "ring": {
        "x": 721,
        "y": 405,
        "w": 858,
        "h": 200
      },
      "ringFor": 2.6,
      "cap": "Real run: two problems planted on purpose",
      "vo": "Here's a real run on a small invoicing app, where we planted two problems on purpose: a walkthrough step for a Mark as paid button the app removed, and a subtotal that ignores quantity."
    },
    "0003.png": {
      "cursor": false,
      "hold": 3,
      "ring": {
        "x": 284,
        "y": 165,
        "w": 506,
        "h": 220
      },
      "ringFor": 2.6,
      "cap": "Five Devins, one per walkthrough",
      "vo": "The coordinator starts five Devins, one per walkthrough."
    },
    "0004.png": {
      "cursor": false,
      "hold": 3.5,
      "ring": {
        "x": 1262,
        "y": 550,
        "w": 215,
        "h": 94
      },
      "ringFor": 3,
      "cap": "Step 5 expects $2,449.00. The app shows $1,249.00",
      "vo": "Each one follows its page in Chrome, and in Getting started, the subtotal comes out twelve hundred dollars short."
    },
    "0005.png": {
      "scene": "decide",
      "cursor": false,
      "capPos": "bottom",
      "hold": 6,
      "cap": "Walkthrough wrong, or app wrong?",
      "vo": "When a step doesn't match, Devin works out whether the walkthrough is stale or the app has a bug, and the answer decides what the pull request fixes."
    },
    "0006.png": {
      "cursor": false,
      "hold": 3,
      "ring": {
        "x": 1003,
        "y": 207,
        "w": 831,
        "h": 120
      },
      "ringFor": 2.6,
      "cap": "Stale walkthrough: the PR fixes the doc",
      "vo": "The Mark as paid button was removed on purpose, so that pull request fixes the walkthrough."
    },
    "0007.png": {
      "cursor": false,
      "hold": 3,
      "ring": {
        "x": 1003,
        "y": 207,
        "w": 831,
        "h": 120
      },
      "ringFor": 2.6,
      "cap": "Real bug: the PR fixes the app, plus a test",
      "vo": "The subtotal was a real bug, so that pull request fixes the app and adds a test."
    },
    "0008.png": {
      "cursor": false,
      "hold": 2.6,
      "ring": {
        "x": 282,
        "y": 349,
        "w": 509,
        "h": 230
      },
      "ringFor": 2.0,
      "cap": "One summary of every walkthrough",
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
        "x": 1180,
        "y": 374,
        "w": 395,
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
