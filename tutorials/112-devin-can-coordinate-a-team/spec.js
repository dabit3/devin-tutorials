window.SPEC = {
  "title": "Devin can coordinate a team of Devins on one app",
  "subtitle": "One coordinator, three managed Devins, one weekend trip planner",
  "outro": "One app, a team of Devins",
  "voOutro": "One app, built by a team of Devins.",
  "introHold": 2.2,
  "outroVoDelay": 0.0,
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.6,
  "edit": {
    "0000.png": {
      "scene": "split",
      "hold": 7.5,
      "cursor": false,
      "capPos": "bottom",
      "cap": "A coordinator splits the app into parts",
      "vo": "Devin can coordinate a team of Devins on one app. A coordinator splits the app into parts and hands each part to a managed Devin on its own isolated VM, so they all work in parallel.",
      "hl": null,
      "voDelay": -1.5
    },
    "0001.png": {
      "hold": 3.6,
      "cursor": false,
      "cap": "Real run: one trip planner, a team of Devins",
      "vo": "Here's a real run, where I asked for a weekend trip planner built by a team of Devins.",
      "hl": null,
      "subPos": "top"
    },
    "0002.png": {
      "hold": 3.8,
      "cursor": false,
      "ring": {
        "x": 602,
        "y": 284,
        "w": 600,
        "h": 34
      },
      "ringFor": 3.0,
      "cap": "The coordinator sets up the shell and shared data",
      "vo": "The coordinator sets up the app shell and the shared trip data first, and pushes them to a shared branch.",
      "hl": null,
      "subPos": "top"
    },
    "0003.png": {
      "hold": 3.6,
      "cursor": false,
      "ring": {
        "x": 460,
        "y": 142,
        "w": 300,
        "h": 112
      },
      "ringFor": 3.0,
      "cap": "Three managed Devins, one per panel",
      "vo": "Then it starts three managed Devins, one each for the itinerary, the budget, and the packing list.",
      "hl": null,
      "subPos": "top"
    },
    "0004.png": {
      "hold": 2.4,
      "cursor": false,
      "ring": {
        "x": 215,
        "y": 390,
        "w": 418,
        "h": 230
      },
      "ringFor": 2.0,
      "cap": "The sidebar nests them under the coordinator",
      "vo": "The sidebar nests all three under the coordinator.",
      "hl": null,
      "cam": {
        "x": 300,
        "y": 400,
        "z": 1.5
      },
      "camDur": 0.8
    },
    "0005.png": {
      "hold": 3.2,
      "cursor": false,
      "ring": {
        "x": 747,
        "y": 410,
        "w": 812,
        "h": 148
      },
      "ringFor": 2.6,
      "cap": "Each one opens a PR into the shared branch",
      "vo": "Each one builds its own panel and opens a pull request into the shared branch.",
      "hl": null,
      "subPos": "top",
      "cam": "reset",
      "camDur": 0.6
    },
    "0006.png": {
      "hold": 4.2,
      "cursor": false,
      "ring": {
        "x": 592,
        "y": 445,
        "w": 462,
        "h": 232
      },
      "ringFor": 3.4,
      "cap": "Tested in its own browser first",
      "vo": "First, it tests its panel in its own browser, like the budget Devin checking that a negative limit is rejected.",
      "hl": null,
      "subPos": "top"
    },
    "0007.png": {
      "scene": "merge",
      "hold": 5.6,
      "cursor": false,
      "capPos": "bottom",
      "cap": "Merged, run and tested as one app",
      "vo": "Once all three pull requests are in, the coordinator merges them, runs the whole app, and tests it end to end.",
      "hl": null
    },
    "0008.png": {
      "hold": 4.0,
      "cursor": false,
      "ring": {
        "x": 705,
        "y": 145,
        "w": 842,
        "h": 138
      },
      "ringFor": 3.2,
      "cap": "Three merged PRs, 37 tests and the build passing",
      "vo": "Its summary lists the three merged pull requests, with no conflicts, and every test and the build passing.",
      "hl": null,
      "subPos": "top"
    },
    "0009.png": {
      "hold": 3.6,
      "cursor": false,
      "ring": {
        "x": 1010,
        "y": 225,
        "w": 522,
        "h": 168
      },
      "ringFor": 3.0,
      "cap": "The end-to-end test run: 11 passed",
      "vo": "The end-to-end test run is recorded, with eleven checks passed and none failed.",
      "hl": null,
      "subPos": "top"
    },
    "0010.png": {
      "hold": 2.2,
      "cursor": false,
      "cap": "The merged app, running",
      "vo": "And here's the merged app, running.",
      "hl": null,
      "subPos": {
        "x": 0.4,
        "y": 0.085
      }
    },
    "0011.png": {
      "hold": 2.8,
      "ring": {
        "x": 300,
        "y": 557,
        "w": 330,
        "h": 52
      },
      "ringFor": 2.2,
      "cap": "A new activity's cost lands in the budget",
      "vo": "Add an activity with a cost, and the budget picks it up.",
      "hl": null,
      "subPos": {
        "x": 0.4,
        "y": 0.085
      }
    },
    "0012.png": {
      "hold": 1.2,
      "ring": {
        "x": 1186,
        "y": 248,
        "w": 420,
        "h": 46
      },
      "ringFor": 1.6,
      "cap": "Pack an item and the count updates",
      "vo": "Pack an item, and the packing count updates.",
      "hl": null,
      "subPos": {
        "x": 0.4,
        "y": 0.085
      }
    }
  }
};
