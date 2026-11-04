window.SPEC = {
  "title": "Docs that test themselves",
  "subtitle": "Every walkthrough, followed step by step on a fresh machine",
  "outro": "Walkthroughs that test themselves",
  "voOutro": "Here is the recap. Write your docs as plain-English walkthroughs. The coordinator starts a new Devin for each walkthrough. Each one follows every step in a browser. When a step fails, Devin finds out if the walkthrough or the app is wrong. It opens a pull request for the side that is wrong. With a playbook and an automation, this runs each time the walkthroughs change.",
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
      "vo": "In this video, Devin tests our docs by following each walkthrough like a new user. When a step does not match the app, Devin fixes the walkthrough or the app."
    },
    "s001.png": {
      "scene": "uses",
      "hold": 5,
      "cap": "Product walkthroughs, onboarding guides, help articles, runbooks",
      "vo": "This works for any doc that people follow step by step. Examples are product walkthroughs, onboarding guides, help articles, and runbooks."
    },
    "s002.png": {
      "scene": "decide",
      "hold": 6,
      "cap": "Planted on purpose: a stale step and an app bug",
      "vo": "Our demo is a small invoicing web app with five walkthroughs. We planted two problems on purpose. One walkthrough tells you to click a Mark as paid button that the app removed. The app also adds up the subtotal without the quantity."
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
      "vo": "I give one Devin, the coordinator, the task in plain English. Start a new Devin for each walkthrough. It follows the steps in the browser like a new user. If a step does not match, fix the side that is wrong."
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
      "vo": "The coordinator starts five Devins, one for each walkthrough page. Each one runs on its own fresh machine."
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
      "vo": "Each Devin clones the repo, starts the app, and opens it in Chrome."
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
      "vo": "In Getting started, the walkthrough adds two design sprints at twelve hundred dollars each. It adds forty-nine dollars for hosting. It expects a subtotal of twenty-four forty-nine. The app shows twelve forty-nine. The row itself says twenty-four hundred."
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
      "vo": "The code says the subtotal multiplies quantity by price. So the app is wrong. Devin fixes the app, adds a test, and follows the walkthrough again. Now the subtotal is twenty-four forty-nine."
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
      "vo": "Here is the pull request for the app fix."
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
      "vo": "In Getting paid, the Mark as paid button is not there. The changelog says a Status menu replaced it on purpose. This time the walkthrough is wrong, so the pull request fixes the doc."
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
      "vo": "The coordinator sends one summary. Three walkthroughs matched. One needed a doc fix, and one found an app bug. Each fix has its own pull request."
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
      "vo": "Next, I ask Devin to save these steps as a playbook. I also ask for an automation. It runs when the walkthroughs change on main, and every Monday."
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
      "vo": "Devin writes the playbook from the run it just did. I approve it."
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
      "vo": "Then Devin sets up the automation. When a push changes a walkthrough, it tests only that page. Every Monday, it tests all of them."
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
      "vo": "After I approve it, the automation is on. Its page shows both triggers."
    }
  }
};
