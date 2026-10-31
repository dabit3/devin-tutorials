window.SPEC = {
  "title": "Docs that test themselves",
  "subtitle": "Every walkthrough, followed step by step on a fresh machine",
  "outro": "Walkthroughs that test themselves",
  "voOutro": "So, the main takeaways. Write your docs as plain-English walkthroughs. Give one coordinator Devin the goal, and it starts a fresh Devin per walkthrough that follows every step in a real browser. When a step breaks, Devin works out whether the walkthrough or the app is wrong, and opens a pull request for the right one. And with a playbook and an automation, it happens every time the walkthroughs change.",
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.3,
  "noZoom": [
    [
      "0007.png"
    ]
  ],
  "edit": {
    "s000.png": {
      "scene": "intro",
      "hold": 7,
      "cursor": false,
      "cap": "In this video: walkthroughs that test themselves",
      "vo": "In this video, you'll learn how to build docs that test themselves. You'll see how Devin follows every plain-English walkthrough step by step on a fresh machine, how it decides whether the walkthrough or the app is wrong, and how to make it run on its own whenever your docs change."
    },
    "s001.png": {
      "scene": "uses",
      "hold": 5,
      "cap": "Product walkthroughs, onboarding guides, help articles, runbooks",
      "vo": "This works for any doc a person follows step by step: product walkthroughs, onboarding guides, help center articles, and runbooks."
    },
    "s002.png": {
      "scene": "decide",
      "hold": 6,
      "cap": "Planted on purpose: a stale step and an app bug",
      "vo": "Our demo is a small invoicing web app with five plain-English walkthroughs, and we planted two problems on purpose. One walkthrough still tells you to click a Mark as paid button that the app removed, and the app's subtotal ignores quantity."
    },
    "0007.png": {
      "hold": 3.5,
      "ring": {
        "x": 721,
        "y": 405,
        "w": 858,
        "h": 200
      },
      "ringFor": 3,
      "cap": "The goal, not the steps",
      "vo": "I give one Devin the goal: start a fresh Devin for every walkthrough, follow it in the browser like a new user, and when a step doesn't match, fix whichever side is wrong."
    },
    "0079.png": {
      "hold": 3.5,
      "ring": {
        "x": 284,
        "y": 165,
        "w": 506,
        "h": 220
      },
      "ringFor": 3,
      "cap": "Five Devins, one per walkthrough",
      "vo": "It starts five Devins, one per walkthrough page, each on its own fresh machine."
    },
    "0029.png": {
      "hold": 3.5,
      "ring": {
        "x": 1009,
        "y": 399,
        "w": 842,
        "h": 632
      },
      "ringFor": 3,
      "cap": "Each one runs the app and opens it in Chrome",
      "vo": "Each one clones the repo, starts the app, and opens it in Chrome on its own computer."
    },
    "0050.png": {
      "hold": 4,
      "ring": {
        "x": 1262,
        "y": 550,
        "w": 215,
        "h": 94
      },
      "ringFor": 3.5,
      "cap": "Step 5 expects $2,449.00. The app shows $1,249.00",
      "vo": "In the Getting started walkthrough, two design sprints at twelve hundred dollars, plus forty-nine for hosting, should come to twenty-four forty-nine. The app shows twelve forty-nine, even though the row itself says twenty-four hundred."
    },
    "0072.png": {
      "hold": 3.5,
      "ring": {
        "x": 1262,
        "y": 550,
        "w": 215,
        "h": 94
      },
      "ringFor": 3,
      "cap": "The app was wrong: fixed, and the step now matches",
      "vo": "The code says the subtotal should multiply quantity by price, so the app is wrong. Devin fixes it, adds a test, and follows the walkthrough again. Now it's twenty-four forty-nine."
    },
    "0085.png": {
      "hold": 3,
      "ring": {
        "x": 1004,
        "y": 207,
        "w": 831,
        "h": 120
      },
      "ringFor": 2.5,
      "cap": "App PR: subtotal multiplies quantity by unit price",
      "vo": "That's its pull request."
    },
    "0084.png": {
      "hold": 3.5,
      "ring": {
        "x": 1004,
        "y": 207,
        "w": 831,
        "h": 120
      },
      "ringFor": 3,
      "cap": "The walkthrough was wrong: Mark as paid is gone",
      "vo": "In Getting paid, there's no Mark as paid button. The changelog says a Status menu replaced it on purpose, so this time the walkthrough is wrong, and the pull request fixes the doc."
    },
    "0080.png": {
      "hold": 4,
      "ring": {
        "x": 282,
        "y": 349,
        "w": 509,
        "h": 230
      },
      "ringFor": 3.5,
      "cap": "Summary: 3 match, 1 doc fix, 1 app fix",
      "vo": "The coordinator sends one summary. Three walkthroughs matched, one needed a doc fix, and one found a real app bug, each with its pull request."
    },
    "0139.png": {
      "hold": 3,
      "ring": {
        "x": 288,
        "y": 536,
        "w": 493,
        "h": 93
      },
      "ringFor": 2.5,
      "cap": "Make it repeatable",
      "vo": "To make it repeatable, I ask Devin to save this as a playbook, and to create an automation that runs it whenever the walkthroughs change on main, and every Monday."
    },
    "0170.png": {
      "hold": 3.5,
      "ring": {
        "x": 256,
        "y": 412,
        "w": 448,
        "h": 337
      },
      "ringFor": 3,
      "cap": "Devin writes the playbook",
      "vo": "Devin writes the playbook from the run it just did, and I approve it."
    },
    "0189.png": {
      "hold": 3.5,
      "ring": {
        "x": 296,
        "y": 358,
        "w": 482,
        "h": 156
      },
      "ringFor": 3,
      "cap": "Docs changes on main, plus every Monday",
      "vo": "Then it sets up the automation. A push that changes a walkthrough tests just that page, and every Monday it tests them all."
    },
    "0190.png": {
      "hold": 3.5,
      "ring": {
        "x": 1180,
        "y": 374,
        "w": 395,
        "h": 96
      },
      "ringFor": 3,
      "cap": "The automation is live",
      "vo": "Once I approve it, the automation is live, with both triggers on its page."
    }
  }
};
