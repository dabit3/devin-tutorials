window.SPEC = {
  "title": "Build a Developer Pain Index on Modal",
  "subtitle": "Devin, Modal and the xAI API, step by step",
  "outro": "A monthly developer report, built from real posts",
  "voOutro": "Describe the report you want, and Devin builds it and ships it to Modal.",
  "dark": true,
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.3,
  "pollRunMax": 2.2,
  "noZoom": [
    [
      "0009.png"
    ]
  ],
  "edit": {
    "0000.png": {
      "hold": 5.5,
      "cursor": false,
      "vo": "The Developer Pain Index ranks what developers complain about on X each month, and it groups similar complaints so you can follow each trend over time."
    },
    "0002.png": {
      "cursor": true,
      "vo": "It works like an industry survey people can cite, except it's built from real posts, so every chart has to say how many posts it used and which dates they cover."
    },
    "0004.png": {
      "vo": "The goal is a live report page on Modal with real data from X, plus a pull request in the demo repo.",
      "voSay": "The goal is a lyve report page on Modal with real data from X, plus a pull request in the demo repo."
    },
    "0007.png": {
      "hold": 4,
      "cursor": false,
      "cap": "Plain-language prompt in @thequantexplorer/product-demo-apps",
      "vo": "The prompt asks for a Modal app that finds the posts with the xAI API's X search. It also asks for a monthly schedule, a parallel search per category and a backfill of earlier months, so every trend line has real data points.",
      "voSay": "The prompt asks for a Modal app that finds the posts with the ex A I A P I's X search. It also asks for a monthly schedule, a parallel search per category and a backfill of earlier months, so every trend line has real data points."
    },
    "0008.png": {
      "cursor": true
    },
    "0010.png": {
      "cursor": false
    },
    "0011.png": {
      "hold": 2.5,
      "cap": "Devin starts with a plan",
      "vo": "Devin replies with its plan, then reads the repo to see how the existing Modal app is set up."
    },
    "0015.png": {
      "badge": "Sped up",
      "cap": "Devin writes and runs the app on its own",
      "vo": "From there it works on its own, writing the search, grouping and report code, and running a real backfill against X."
    },
    "0140.png": {
      "badge": "",
      "hold": 6,
      "cap": "Modal's scheduled-function limit: Devin asks first",
      "ring": {
        "x": 720,
        "y": 583,
        "w": 900,
        "h": 130
      },
      "ringFor": 5,
      "vo": "The first deploy fails because the Modal workspace already uses all five of its scheduled functions, so Devin asks how to handle it instead of stopping someone else's app."
    },
    "0141.png": {
      "skip": true
    },
    "0142.png": {
      "skip": true
    },
    "0143.png": {
      "skip": true
    },
    "0144.png": {
      "skip": true
    },
    "0145.png": {
      "skip": true
    },
    "0146.png": {
      "skip": true
    },
    "0147.png": {
      "skip": true
    },
    "0148.png": {
      "skip": true
    },
    "0149.png": {
      "skip": true
    },
    "0150.png": {
      "skip": true
    },
    "0151.png": {
      "skip": true
    },
    "0152.png": {
      "cursor": true,
      "vo": "I tell it to leave the cron off for now, which keeps the schedule in the code and ships the web page with the backfilled data."
    },
    "0154.png": {
      "cap": "Leave the cron off for now"
    },
    "0155.png": {
      "cursor": false,
      "badge": "Sped up",
      "vo": "Devin redeploys with the schedule turned off and tests the live URL.",
      "voSay": "Devin redeploys with the schedule turned off and tests the lyve URL."
    },
    "0195.png": {
      "badge": "",
      "hold": 3,
      "cap": "Devin opens PR #75 in product-demo-apps",
      "ring": {
        "x": 720,
        "y": 411,
        "w": 872,
        "h": 150
      },
      "vo": "Then it opens a pull request in the demo repo with the whole dev-pain-index folder."
    },
    "0196.png": {
      "skip": true
    },
    "0197.png": {
      "skip": true
    },
    "0198.png": {
      "skip": true
    },
    "0199.png": {
      "skip": true
    },
    "0200.png": {
      "skip": true
    },
    "0201.png": {
      "skip": true
    },
    "0202.png": {
      "skip": true
    },
    "0203.png": {
      "skip": true
    },
    "0204.png": {
      "skip": true
    },
    "0205.png": {
      "skip": true
    },
    "0206.png": {
      "skip": true
    },
    "0207.png": {
      "skip": true
    },
    "0208.png": {
      "skip": true
    },
    "0209.png": {
      "skip": true
    },
    "0210.png": {
      "skip": true
    },
    "0211.png": {
      "skip": true
    },
    "0212.png": {
      "skip": true
    },
    "0213.png": {
      "skip": true
    },
    "0214.png": {
      "skip": true
    },
    "0215.png": {
      "skip": true
    },
    "0216.png": {
      "skip": true
    },
    "0217.png": {
      "skip": true
    },
    "0218.png": {
      "skip": true
    },
    "0219.png": {
      "skip": true
    },
    "0220.png": {
      "skip": true
    },
    "0221.png": {
      "skip": true
    },
    "0222.png": {
      "skip": true
    },
    "0223.png": {
      "skip": true
    },
    "0224.png": {
      "skip": true
    },
    "0225.png": {
      "skip": true
    },
    "0226.png": {
      "skip": true
    },
    "0227.png": {
      "skip": true
    },
    "0228.png": {
      "skip": true
    },
    "0229.png": {
      "skip": true
    },
    "0230.png": {
      "badge": "Sped up",
      "cap": "Review fixes, tests, redeploy",
      "vo": "An automated review flags three issues, so Devin fixes them, reruns the tests and redeploys."
    },
    "0269.png": {
      "badge": "",
      "hold": 4,
      "cap": "704 posts kept across six months",
      "ring": {
        "x": 728,
        "y": 224,
        "w": 856,
        "h": 78
      },
      "vo": "When it finishes, the summary says the backfill kept 704 posts across six months, for about $24.50 of xAI usage. All 14 unit tests pass, and the cron stays off until a scheduled slot is free.",
      "voSay": "When it finishes, the summary says the backfill kept seven hundred and four posts across six months, for about twenty four dollars and fifty cents of ex A I usage. All fourteen unit tests pass, and the cron stays off until a scheduled slot is free."
    },
    "0270.png": {
      "skip": true
    },
    "0271.png": {
      "skip": true
    },
    "0272.png": {
      "skip": true
    },
    "0273.png": {
      "skip": true
    },
    "0274.png": {
      "skip": true
    },
    "0275.png": {
      "skip": true
    },
    "0276.png": {
      "skip": true
    },
    "0277.png": {
      "skip": true
    },
    "0278.png": {
      "skip": true
    },
    "0279.png": {
      "skip": true
    },
    "0280.png": {
      "skip": true
    },
    "0281.png": {
      "skip": true
    },
    "0282.png": {
      "skip": true
    },
    "0283.png": {
      "skip": true
    },
    "0284.png": {
      "skip": true
    },
    "0285.png": {
      "skip": true
    },
    "0286.png": {
      "skip": true
    },
    "0287.png": {
      "skip": true
    },
    "0288.png": {
      "skip": true
    },
    "0289.png": {
      "skip": true
    },
    "0290.png": {
      "skip": true
    },
    "0291.png": {
      "skip": true
    },
    "0292.png": {
      "skip": true
    },
    "0293.png": {
      "skip": true
    },
    "0294.png": {
      "skip": true
    },
    "0295.png": {
      "skip": true
    },
    "0296.png": {
      "skip": true
    },
    "0297.png": {
      "skip": true
    },
    "0298.png": {
      "skip": true
    },
    "0299.png": {
      "skip": true
    },
    "0300.png": {
      "skip": true
    },
    "0301.png": {
      "skip": true
    },
    "0302.png": {
      "skip": true
    },
    "0303.png": {
      "skip": true
    },
    "0304.png": {
      "skip": true
    },
    "0305.png": {
      "skip": true
    },
    "0306.png": {
      "skip": true
    },
    "0307.png": {
      "skip": true
    },
    "0308.png": {
      "skip": true
    },
    "0309.png": {
      "skip": true
    },
    "0310.png": {
      "skip": true
    },
    "0311.png": {
      "skip": true
    },
    "0312.png": {
      "cursor": true,
      "vo": "Clicking the deploy step in the timeline shows the real modal deploy output, ending with the app deployed."
    },
    "0314.png": {
      "cap": "modal deploy: App deployed",
      "ring": {
        "x": 731,
        "y": 412,
        "w": 240,
        "h": 34
      }
    },
    "0315.png": {
      "cap": "The web endpoint's modal.run URL",
      "ring": {
        "x": 943,
        "y": 393,
        "w": 682,
        "h": 34
      },
      "vo": "The web endpoint gets its own modal.run URL.",
      "voSay": "The web endpoint gets its own modal dot run URL."
    },
    "0316.png": {
      "skip": true
    },
    "0317.png": {
      "skip": true
    },
    "0318.png": {
      "skip": true
    },
    "0319.png": {
      "skip": true
    },
    "0320.png": {
      "vo": "The pull request tab shows the code, and app.py holds the whole pipeline.",
      "voSay": "The pull request tab shows the code, and app dot pie holds the whole pipeline."
    },
    "0322.png": {
      "cursor": false,
      "cap": "PR #75: Add dev-pain-index",
      "ring": {
        "x": 1009,
        "y": 161,
        "w": 867,
        "h": 52
      }
    },
    "0323.png": {
      "hold": 3,
      "cap": "modal.Cron: the first of every month",
      "ring": {
        "x": 1013,
        "y": 462,
        "w": 756,
        "h": 65
      },
      "vo": "A modal.Cron schedule runs the refresh on the first of every month, behind a flag so it can stay off for now.",
      "voSay": "A modal dot Cron schedule runs the refresh on the first of every month, behind a flag so it can stay off for now."
    },
    "0324.png": {
      "hold": 3,
      "cap": "xAI Responses API with the x_search tool",
      "ring": {
        "x": 1014,
        "y": 462,
        "w": 612,
        "h": 40
      },
      "vo": "Each search calls the xAI Responses API with the X search tool, limited to one month of dates.",
      "voSay": "Each search calls the ex A I Responses API with the X search tool, limited to one month of dates."
    },
    "0325.png": {
      "hold": 3,
      "cap": "search_category.map: every category and month at once",
      "ring": {
        "x": 990,
        "y": 489,
        "w": 294,
        "h": 34
      },
      "vo": "The .map() call runs every category and month in parallel, so the six-month backfill was 30 searches at once.",
      "voSay": "The dot map call runs every category and month in parallel, so the six month backfill was thirty searches at once."
    },
    "0326.png": {
      "hold": 3,
      "cap": "@modal.asgi_app serves the report",
      "ring": {
        "x": 782,
        "y": 462,
        "w": 294,
        "h": 40
      },
      "vo": "The web function serves the report page from the stored dataset as an ASGI app.",
      "voSay": "The web function serves the report page from the stored dataset as an A S G I app."
    },
    "0327.png": {
      "skip": true
    },
    "0328.png": {
      "hold": 4,
      "cap": "Live at dabit3--dev-pain-index.modal.run",
      "ring": {
        "x": 181,
        "y": 509,
        "w": 276,
        "h": 34
      },
      "vo": "The live page shows September's index at 44 out of 100, built from 109 posts found in September.",
      "voSay": "The lyve page shows September's index at forty four out of a hundred, built from a hundred and nine posts found in September."
    },
    "0329.png": {
      "cap": "Six real months per category, never extrapolated",
      "vo": "Each category gets its own trend line, with six real months behind it and nothing extrapolated."
    },
    "0330.png": {
      "vo": "Every category card shows its top complaint themes for the month."
    },
    "0331.png": {
      "ring": {
        "x": 152,
        "y": 466,
        "w": 215,
        "h": 34
      },
      "vo": "The loudest complaints are real posts from X, each linked to its author."
    },
    "0334.png": {
      "ring": {
        "x": 91,
        "y": 304,
        "w": 96,
        "h": 38
      },
      "cap": "September: layoffs 72, AI coding agents 41",
      "vo": "In September, layoffs scored highest at 72, with AI coding agents second at 41 points.",
      "voSay": "In September, layoffs scored highest at seventy two, with AI coding agents second at forty one points."
    },
    "0336.png": {
      "hold": 3,
      "ring": {
        "x": 122,
        "y": 411,
        "w": 158,
        "h": 40
      },
      "cap": "Samples from X search, not totals",
      "vo": "A methodology note explains that these numbers come from a sample of posts, not a total count."
    }
  }
};
