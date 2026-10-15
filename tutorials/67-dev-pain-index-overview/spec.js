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
      "0003.png"
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
      "cap": "X posts → xAI → Modal → Volume → web page",
      "vo": "Each month, Grok searches X through the xAI API to find complaint posts for each category, and rates how severe each one is. Modal functions group similar complaints into themes and save the dataset to a Volume, and a web endpoint serves the report page.",
      "voSay": "Each month, Grok searches X through the ex A I A P I to find complaint posts for each category, and rates how severe each one is. Modal functions group similar complaints into themes and save the dataset to a Volume, and a web endpoint serves the report page."
    },
    "0002.png": {
      "cursor": false,
      "scene": "fanout",
      "hold": 7,
      "capPos": "bottom",
      "cap": "refresh() fans out with .map()",
      "vo": "The refresh function fans out with .map(), so every category and month runs at once, and the six-month backfill was 30 searches that kept 704 posts.",
      "voSay": "The refresh function fans out with dot map, so every category and month runs at once, and the six month backfill was thirty searches that kept seven hundred and four posts."
    },
    "0003.png": {
      "cursor": false,
      "hold": 3,
      "cap": "One plain-language prompt to Devin",
      "vo": "In the real run, Devin built all of this from one plain-language prompt in the demo repo."
    },
    "0004.png": {
      "cursor": false,
      "hold": 3,
      "cap": "Modal's cron limit: Devin asked first",
      "ring": {
        "x": 720,
        "y": 583,
        "w": 900,
        "h": 130
      },
      "vo": "When Modal's scheduled-function limit blocked the cron, Devin asked before touching anything, so the schedule stayed in the code but switched off."
    },
    "0005.png": {
      "cursor": false,
      "hold": 3,
      "cap": "modal deploy: App deployed",
      "ring": {
        "x": 731,
        "y": 412,
        "w": 240,
        "h": 34
      },
      "vo": "Then modal deploy created each function and gave the report its own modal.run URL.",
      "voSay": "Then modal deploy created each function and gave the report its own modal dot run URL."
    },
    "0006.png": {
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
    "0007.png": {
      "cursor": false,
      "hold": 3.5,
      "cap": "September: 44/100 from 109 posts",
      "ring": {
        "x": 181,
        "y": 509,
        "w": 276,
        "h": 34
      },
      "vo": "The deployed report shows September's index at 44 out of 100 from 109 posts, with six real months on the trend line.",
      "voSay": "The deployed report shows September's index at forty four out of a hundred from a hundred and nine posts, with six real months on the trend line."
    },
    "0008.png": {
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
    "0009.png": {
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
