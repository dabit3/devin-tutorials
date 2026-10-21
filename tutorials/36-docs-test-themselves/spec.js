window.SPEC = {
  "title": "Docs that test themselves",
  "subtitle": "Every walkthrough, followed step by step on a fresh machine",
  "outro": "Walkthroughs that test themselves",
  "voOutro": "So, the main takeaways. Write your docs as plain-English walkthroughs. Give one coordinator Devin the goal, and it starts a fresh Devin per walkthrough that follows every step in a real browser. When a step breaks, Devin works out whether the walkthrough or the product is wrong and opens a pull request for the right one. And with a playbook and an automation, it happens every time the walkthroughs change.",
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
      "vo": "In this video, you'll learn how to build docs that test themselves. You'll learn how to have Devin follow every plain-English walkthrough step by step on a fresh machine, how it decides whether the walkthrough or the product is wrong, and how to make it repeat on its own whenever your docs change."
    },
    "s001.png": {
      "scene": "uses",
      "hold": 5,
      "cap": "SDK docs, quickstarts, API guides, tutorials",
      "vo": "It works for SDK docs, README quickstarts, API guides, and step-by-step tutorials."
    },
    "0007.png": {
      "hold": 3,
      "cap": "Demo SDK: two broken examples, planted on purpose",
      "vo": "Our demo is a small Python invoicing SDK with five docs pages, and we planted two broken examples on purpose."
    },
    "0008.png": {
      "hold": 3.5,
      "ring": {
        "x": 721,
        "y": 405,
        "w": 857,
        "h": 174
      },
      "ringFor": 3,
      "cap": "One managed Devin per docs page",
      "vo": "I ask Devin to start a managed Devin for each page, on its own fresh machine, run every snippet exactly as written, and open a pull request that fixes whichever side is wrong."
    },
    "0020.png": {
      "hold": 3,
      "badge": "Sped up",
      "cap": "The coordinator reads the SDK and the docs first",
      "vo": "The coordinator reads the SDK, the docs, and the changelog first, so it can brief each Devin."
    },
    "0027.png": {
      "hold": 3.5,
      "badge": null,
      "ring": {
        "x": 713,
        "y": 280,
        "w": 863,
        "h": 418
      },
      "ringFor": 3,
      "cap": "Five managed Devins, one per page",
      "vo": "Then it starts five managed Devins, one per docs page, each on its own fresh VM."
    },
    "0035.png": {
      "hold": 3.5,
      "ring": {
        "x": 321,
        "y": 234,
        "w": 459,
        "h": 303
      },
      "ringFor": 3,
      "cap": "Each one installs the SDK and runs its page",
      "vo": "Each one makes a fresh virtual environment, installs the SDK, and runs every snippet on its page, comparing the output with what the docs say."
    },
    "0222.png": {
      "hold": 3.5,
      "ring": {
        "x": 932,
        "y": 189,
        "w": 670,
        "h": 113
      },
      "ringFor": 3,
      "cap": "A snippet fails: the old keyword is gone",
      "vo": "In the invoices Devin's shell, the first snippet fails, because the page still passes a keyword that the SDK has since renamed."
    },
    "0223.png": {
      "hold": 3.5,
      "ring": {
        "x": 806,
        "y": 206,
        "w": 412,
        "h": 150
      },
      "ringFor": 3,
      "cap": "The docs were stale; after the fix, both pass",
      "vo": "The changelog shows the rename was deliberate, so the docs are wrong, and after the fix both snippets print exactly what the page says."
    },
    "0226.png": {
      "hold": 2.6,
      "ring": {
        "x": 1001,
        "y": 690,
        "w": 824,
        "h": 49
      },
      "ringFor": 2.0,
      "cap": "Docs PR: a one-line fix",
      "vo": "So its pull request is a one-line docs fix."
    },
    "0229.png": {
      "hold": 3.5,
      "ring": {
        "x": 1001,
        "y": 779,
        "w": 824,
        "h": 50
      },
      "ringFor": 3,
      "capPos": "top",
      "cap": "SDK PR: subtotal now counts quantity, plus a test",
      "vo": "The quickstart printed the wrong total, because the subtotal ignored each line's quantity, against its own docstring, so that pull request fixes the SDK and adds a regression test."
    },
    "0050.png": {
      "hold": 3.5,
      "ring": {
        "x": 283,
        "y": 397,
        "w": 516,
        "h": 491
      },
      "ringFor": 3,
      "cap": "One summary: 3 passed, 1 docs bug, 1 SDK bug",
      "vo": "The coordinator collects everything into one summary: three pages passed as written, one had a docs bug, and one found an SDK bug, each with its pull request."
    },
    "0051.png": {
      "hold": 3,
      "ring": {
        "x": 282,
        "y": 606,
        "w": 501,
        "h": 80
      },
      "ringFor": 2.6,
      "cap": "Both fixes together: every test and snippet passes",
      "vo": "It also tried both fixes together, and all eight tests and every snippet passed."
    },
    "0101.png": {
      "hold": 3.5,
      "ring": {
        "x": 288,
        "y": 706,
        "w": 540,
        "h": 150
      },
      "ringFor": 3,
      "cap": "Make it repeatable",
      "vo": "To make it repeatable, I ask Devin to save this as a playbook, and to create an automation that runs it whenever the docs change on main, and every Monday."
    },
    "0159.png": {
      "hold": 3.5,
      "ring": {
        "x": 1003,
        "y": 437,
        "w": 830,
        "h": 742
      },
      "ringFor": 3,
      "cap": "Devin writes the playbook",
      "vo": "Devin writes the playbook from the run it just did, and I approve it."
    },
    "0186.png": {
      "hold": 3.5,
      "ring": {
        "x": 251,
        "y": 252,
        "w": 398,
        "h": 248
      },
      "ringFor": 3,
      "cap": "Automation: docs changes on main, plus Mondays",
      "vo": "Then it drafts the automation, with a push trigger for changes to the docs folder on main, and a weekly schedule on Mondays."
    },
    "0190.png": {
      "hold": 3,
      "ring": {
        "x": 282,
        "y": 416,
        "w": 500,
        "h": 236
      },
      "ringFor": 2.6,
      "cap": "Approve, and the automation is live",
      "vo": "Once I approve it, the automation is created, and its next run is already scheduled."
    },
    "0220.png": {
      "hold": 3.5,
      "ring": {
        "x": 1177,
        "y": 374,
        "w": 381,
        "h": 96
      },
      "ringFor": 3,
      "cap": "Both triggers and every run on one page",
      "vo": "The automation's page shows both triggers, and every run it starts."
    },
    "0225.png": {
      "hold": 4,
      "ring": {
        "x": 310,
        "y": 250,
        "w": 445,
        "h": 400
      },
      "ringFor": 3,
      "cap": "A manual run fans out to five fresh Devins",
      "vo": "I started one manual run, and it followed the playbook and started five fresh Devins again."
    }
  }
};
