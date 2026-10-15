window.SPEC = {
  "title": "The Developer Pain Index",
  "subtitle": "How it works with Modal and the xAI API",
  "outro": "Real posts from X, a report you can cite",
  "voOutro": "Real posts from X, turned into a monthly report you can cite.",
  "dark": true,
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.3,
  "noZoom": [
    [
      "0004.png"
    ]
  ],
  "edit": {
    "0000.png": {
      "cursor": false,
      "scene": "why",
      "hold": 7,
      "capPos": "bottom",
      "cap": "What developers complain about, ranked monthly",
      "vo": "Developers complain on X every day about their tools, their cloud bills and the job market, but nobody adds it up. The Developer Pain Index turns those posts into a monthly report you can cite, with every chart showing its sample size and dates."
    },
    "0001.png": {
      "cursor": false,
      "scene": "flow",
      "hold": 8,
      "capPos": "bottom",
      "cap": "X posts → xAI API → Modal → public page",
      "vo": "Each month, Grok from xAI searches X for complaint posts in each category, and rates how severe each one is. Everything after that runs on Modal, which groups the complaints into themes, saves the dataset to a Volume and serves the report page.",
      "voSay": "Each month, Grok from ex A I searches X for complaint posts in each category, and rates how severe each one is. Everything after that runs on Modal, which groups the complaints into themes, saves the dataset to a Volume and serves the report page."
    },
    "0002.png": {
      "cursor": false,
      "scene": "modal",
      "hold": 7,
      "capPos": "bottom",
      "cap": "Why Modal: schedule, storage, public URL, scale to zero",
      "vo": "Why Modal? This job runs once a month, so a laptop script would have to stay awake for it, and your own server would sit idle the rest of the time. Modal starts the pull on a cron schedule and keeps the xAI key in a Secret. A Volume stores the results, and a web endpoint serves the page at a public URL. Between runs it scales to zero, so you only pay for the seconds it works.",
      "voSay": "Why Modal? This job runs once a month, so a laptop script would have to stay awake for it, and your own server would sit idle the rest of the time. Modal starts the pull on a cron schedule and keeps the ex A I key in a Secret. A Volume stores the results, and a web endpoint serves the page at a public URL. Between runs it scales to zero, so you only pay for the seconds it works."
    },
    "0003.png": {
      "cursor": false,
      "scene": "fanout",
      "hold": 7,
      "capPos": "bottom",
      "cap": ".map(): 30 searches in parallel",
      "vo": "When it runs, one .map() call spreads the searches across containers, so the six-month backfill ran 30 searches in parallel and kept 704 posts.",
      "voSay": "When it runs, one dot map call spreads the searches across containers, so the six month backfill ran thirty searches in parallel and kept seven hundred and four posts."
    },
    "0004.png": {
      "cursor": false,
      "hold": 3,
      "cap": "One plain-language prompt to Devin",
      "vo": "In the real run, Devin built all of this from one plain-language prompt in the demo repo."
    },
    "0005.png": {
      "cursor": false,
      "hold": 3,
      "cap": "Modal's 5-schedule limit: Devin asked first",
      "ring": {
        "x": 720,
        "y": 583,
        "w": 900,
        "h": 130
      },
      "vo": "The workspace had already used all five of its scheduled functions, so Devin asked first. The schedule stayed in the code but switched off, and it hasn't run yet."
    },
    "0006.png": {
      "cursor": false,
      "hold": 3,
      "cap": "modal deploy: functions and a modal.run URL",
      "ring": {
        "x": 808,
        "y": 337,
        "w": 352,
        "h": 118
      },
      "vo": "Then modal deploy created each function and gave the report its own modal.run URL.",
      "voSay": "Then modal deploy created each function and gave the report its own modal dot run URL."
    },
    "0007.png": {
      "cursor": false,
      "hold": 3,
      "cap": "PR #75 in product-demo-apps",
      "ring": {
        "x": 720,
        "y": 411,
        "w": 872,
        "h": 150
      },
      "vo": "Devin opened a pull request with the whole app and its tests."
    },
    "0008.png": {
      "cursor": false,
      "hold": 3.5,
      "cap": "September: 44/100 from 109 posts found",
      "ring": {
        "x": 181,
        "y": 509,
        "w": 276,
        "h": 34
      },
      "vo": "The page running on Modal shows September's index at 44 out of 100 from 109 posts found, with six real months on the trend line.",
      "voSay": "The page running on Modal shows September's index at forty four out of a hundred from a hundred and nine posts found, with six real months on the trend line."
    },
    "0009.png": {
      "cursor": false,
      "hold": 3,
      "cap": "Top themes and the real posts behind them",
      "ring": {
        "x": 152,
        "y": 466,
        "w": 215,
        "h": 34
      },
      "vo": "Each category lists its top themes and the loudest real posts behind them."
    },
    "0010.png": {
      "cursor": false,
      "scene": "uses",
      "hold": 8,
      "capPos": "bottom",
      "cap": "Ways to extend it",
      "vo": "You could extend it with alerts when a theme spikes and with drill-downs for a single tool. A weekly edition just needs a weekly schedule and shorter search windows, and the data.json route lets other sites embed the numbers.",
      "voSay": "You could extend it with alerts when a theme spikes and with drill downs for a single tool. A weekly edition just needs a weekly schedule and shorter search windows, and the data dot jason route lets other sites embed the numbers."
    }
  }
};
