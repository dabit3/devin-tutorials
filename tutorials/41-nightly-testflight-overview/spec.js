window.SPEC = {
  "title": "Nightly TestFlight builds",
  "subtitle": "A schedule, a macOS machine, and notes from the day's merged PRs",
  "outro": "A fresh build every morning, with notes testers can use",
  "voOutro": "A fresh build every morning, with notes your testers can use.",
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.6,
  "edit": {
    "0000.png": {
      "cursor": false,
      "hl": null,
      "scene": "pain",
      "hold": 6.0,
      "capPos": "bottom",
      "cap": "Today: test builds cut by hand, notes left to guesswork",
      "vo": "Many iOS teams still cut test builds by hand, so testers get them late and have to guess what changed."
    },
    "0001.png": {
      "cursor": false,
      "hl": null,
      "scene": "flow",
      "hold": 7.5,
      "capPos": "bottom",
      "cap": "A schedule starts a macOS session that archives and writes the notes",
      "vo": "With Devin, a nightly schedule starts a session on a macOS machine that archives the app and writes What to Test notes from the day's merged pull requests."
    },
    "0002.png": {
      "cursor": false,
      "hl": null,
      "hold": 3.0,
      "ring": {
        "x": 524,
        "y": 341,
        "w": 280,
        "h": 34
      },
      "ringFor": 2.4,
      "cap": "Real automation: every day at 2:00 AM",
      "vo": "Here it is: one automation that runs every day at two in the morning.",
      "voGap": 1.0
    },
    "0003.png": {
      "cursor": false,
      "hl": null,
      "hold": 2.8,
      "ring": {
        "x": 1236,
        "y": 447,
        "w": 280,
        "h": 36
      },
      "ringFor": 2.2,
      "cap": "Virtual environment: macOS",
      "vo": "Its virtual environment is macOS, so every run gets a Mac with Xcode."
    },
    "0004.png": {
      "cursor": false,
      "hl": null,
      "scene": "notes",
      "hold": 6.5,
      "capPos": "bottom",
      "cap": "One line per merged PR: what changed, what to try",
      "vo": "The notes come from the pull requests that actually landed, so each line tells testers what changed and what to try.",
      "voGap": 1.0
    },
    "0005.png": {
      "cursor": false,
      "hl": null,
      "hold": 3.0,
      "ring": {
        "x": 927,
        "y": 186,
        "w": 820,
        "h": 165
      },
      "ringFor": 2.4,
      "cap": "The day's merged PRs, checked against main",
      "vo": "In the real run, Devin found the four pull requests merged that day and checked each one against the code on main.",
      "voGap": 1.0
    },
    "0006.png": {
      "cursor": false,
      "hl": null,
      "hold": 3.0,
      "ring": {
        "x": 1120,
        "y": 303,
        "w": 610,
        "h": 380
      },
      "ringFor": 2.4,
      "cap": "The What to Test notes it wrote",
      "vo": "Then it wrote one note per pull request."
    },
    "0007.png": {
      "cursor": false,
      "hl": null,
      "scene": "stubs",
      "hold": 7.0,
      "capPos": "bottom",
      "cap": "Upload and Slack are stubs here; to go live, add keys and Slack",
      "vo": "In this demo, the TestFlight upload and the Slack post are stub scripts. To go live, you save your App Store Connect keys as Devin secrets and connect Slack.",
      "voGap": 1.0
    },
    "0008.png": {
      "cursor": false,
      "hl": null,
      "hold": 3.0,
      "ring": {
        "x": 927,
        "y": 142,
        "w": 820,
        "h": 80
      },
      "ringFor": 2.4,
      "cap": "Nothing reached TestFlight or Slack",
      "vo": "Devin says so plainly: the archive built, and nothing reached TestFlight or Slack.",
      "voGap": 1.0
    },
    "0009.png": {
      "cursor": false,
      "hl": null,
      "hold": 2.6,
      "ring": {
        "x": 980,
        "y": 745,
        "w": 250,
        "h": 36
      },
      "ringFor": 2.0,
      "capPos": "top",
      "subPos": "top",
      "cap": "** ARCHIVE SUCCEEDED **",
      "vo": "The build log ends with archive succeeded."
    },
    "0010.png": {
      "cursor": false,
      "hl": null,
      "scene": "why",
      "hold": 6.0,
      "capPos": "bottom",
      "cap": "A fresh build every morning, and testers know what to try",
      "vo": "Testers start each day with a fresh build and know exactly what to try, and nobody on the team has to cut it by hand.",
      "voGap": 1.0
    }
  }
};
