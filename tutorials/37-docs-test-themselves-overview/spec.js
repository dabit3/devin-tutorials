window.SPEC = {
  "title": "Docs that test themselves",
  "subtitle": "How it works, and what you can do with it",
  "outro": "Walkthroughs that test themselves",
  "voOutro": "Here is the recap. Write your docs as plain-English walkthroughs. A new Devin follows each one, like a new user. When a step breaks, Devin fixes the walkthrough or the app, whichever is wrong.",
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
      "vo": "In this video, we look at how Devin tests the walkthroughs in your docs. It follows each one like a new user and fixes what does not match."
    },
    "0001.png": {
      "scene": "fanout",
      "cursor": false,
      "capPos": "bottom",
      "hold": 6,
      "cap": "One coordinator, one Devin per walkthrough",
      "vo": "One Devin coordinates the work. It starts a new Devin for each walkthrough. Each one runs on its own machine, at the same time."
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
      "vo": "Here is a run on a small invoicing app. We planted two problems on purpose. One walkthrough step uses a Mark as paid button that the app removed. The app subtotal also leaves out the quantity."
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
      "vo": "The coordinator starts five Devins, one for each walkthrough."
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
      "vo": "Each one follows its page in Chrome. In Getting started, the subtotal is twelve hundred dollars too low."
    },
    "0005.png": {
      "scene": "decide",
      "cursor": false,
      "capPos": "bottom",
      "hold": 6,
      "cap": "Walkthrough wrong, or app wrong?",
      "vo": "When a step does not match, Devin finds out which side is wrong. The walkthrough can be out of date, or the app can have a bug. The answer tells it what to fix in the pull request."
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
      "vo": "The Mark as paid button was removed on purpose. So that pull request fixes the walkthrough."
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
      "vo": "The subtotal was a bug. So that pull request fixes the app and adds a test."
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
      "vo": "The coordinator puts the results in one summary."
    },
    "0009.png": {
      "scene": "repeat",
      "cursor": false,
      "capPos": "bottom",
      "hold": 6,
      "cap": "A playbook, run by an automation",
      "vo": "To keep the docs correct, save the steps as a playbook. Then create an automation that runs it when the walkthroughs change, and on a schedule."
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
      "vo": "Here is the automation that Devin created. It shows both triggers."
    },
    "0011.png": {
      "scene": "uses",
      "cursor": false,
      "capPos": "bottom",
      "hold": 5,
      "cap": "Walkthroughs, onboarding, help articles, runbooks",
      "vo": "This works for product walkthroughs, onboarding guides, help articles, and runbooks."
    }
  }
};
