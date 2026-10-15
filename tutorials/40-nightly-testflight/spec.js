window.SPEC = {
  "title": "Nightly TestFlight builds",
  "subtitle": "A schedule builds your iOS app on a Mac and writes What to Test notes",
  "outro": "A fresh build every night, with notes testers can use",
  "voOutro": "A fresh build every night, with notes your testers can use.",
  "speed": 3,
  "cps": 48,
  "pollRunMax": 2.5,
  "noZoom": [
    [
      "0056.png"
    ]
  ],
  "edit": {
    "0000.png": {
      "skip": true
    },
    "0001.png": {
      "hold": 2.6,
      "cursor": false,
      "vo": "Devin can build your iOS app every night on a Mac, and write the What to Test notes for your testers from the day's merged pull requests."
    },
    "0002.png": {
      "cap": "Automations → Create automation → Create manually",
      "vo": "To set it up, open Automations, then Create automation, and pick Create manually.",
      "voSay": "To set it up, open Automations, then Create automation, and pick Create manually.",
      "voGap": 1.0
    },
    "0014.png": {
      "cap": "Add a Schedule trigger: every day at 02:00",
      "vo": "Add a Schedule trigger and set it to every day at two in the morning, so a fresh build is waiting when your testers start their day.",
      "voGap": 1.0
    },
    "0027.png": {
      "hold": 0.5
    },
    "0030.png": {
      "kind": "still",
      "hold": 2.6,
      "cap": "What each run does",
      "vo": "The instructions say what each run does. It lists the pull requests merged into main in the last day. It archives the app with xcodebuild. Then it writes one tester note per pull request.",
      "voSay": "The instructions say what each run does. It lists the pull requests merged into main in the last day. It archives the app with x code build. Then it writes one tester note per pull request.",
      "voGap": 1.0
    },
    "0035.png": {
      "hold": 2.6,
      "cap": "Upload and Slack are demo stubs here",
      "vo": "Then it uploads the archive and posts the notes to Slack. In this demo, both of those are stub scripts in the repo, because this org has no App Store Connect keys or Slack connection."
    },
    "0036.png": {
      "cap": "Virtual environment → macOS",
      "vo": "Under Virtual environment, pick macOS, so every run gets a Mac with Xcode, and then create the automation.",
      "voSay": "Under Virtual environment, pick macOS, so every run gets a Mac with Xcode, and then create the automation.",
      "voGap": 1.0
    },
    "0041.png": {
      "hold": 1.0
    },
    "0042.png": {
      "cap": "Create the automation"
    },
    "0044.png": {
      "skip": true
    },
    "0045.png": {
      "hold": 2.2,
      "cap": "Active, every day at 2:00 AM",
      "vo": "The automation is now active, with its schedule and instructions."
    },
    "0046.png": {
      "skip": true
    },
    "0047.png": {
      "hold": 1.0
    },
    "0048.png": {
      "cap": "Run now starts a session right away",
      "vo": "To try it without waiting for the night, click Run now. It starts a new session with the same instructions.",
      "voGap": 1.0
    },
    "0052.png": {
      "hold": 1.6
    },
    "0053.png": {
      "hold": 2.2,
      "cap": "The run shows up under Events",
      "vo": "The run shows up under Events, with a link to the session it started."
    },
    "0056.png": {
      "hold": 0.6,
      "cap": "The session runs on macOS"
    },
    "0057.png": {
      "skip": true
    },
    "0058.png": {
      "skip": true
    },
    "0059.png": {
      "hold": 2.4,
      "cursor": false,
      "cap": "Started by the automation, on macOS",
      "vo": "The session starts from the automation's instructions, on a macOS machine.",
      "voGap": 1.0
    },
    "0060.png": {
      "hold": 0.25,
      "cursor": false
    },
    "0061.png": {
      "hold": 0.25,
      "cursor": false
    },
    "0062.png": {
      "hold": 0.25,
      "cursor": false
    },
    "0063.png": {
      "hold": 0.25,
      "cursor": false
    },
    "0065.png": {
      "hold": 0.25,
      "cursor": false
    },
    "0067.png": {
      "hold": 0.25,
      "cursor": false
    },
    "0064.png": {
      "hold": 0.8,
      "cursor": false
    },
    "0066.png": {
      "hold": 3.2,
      "cursor": false,
      "cap": "Nothing reached TestFlight or Slack: stubs",
      "vo": "In under two minutes the archive is built, and Devin says it plainly: the upload and Slack scripts are stubs, so nothing reached TestFlight or Slack."
    },
    "0068.png": {
      "hold": 3.0,
      "cursor": false,
      "cap": "The day's merged pull requests, checked against main",
      "vo": "It found the four pull requests merged that day that change the app, and checked each one against the code on main."
    },
    "0071.png": {
      "hold": 3.4,
      "cap": "What to Test: one line per pull request",
      "vo": "Here are the What to Test notes, one line per pull request, with what changed and what to try.",
      "voGap": 1.0
    },
    "0074.png": {
      "hold": 3.0,
      "cap": "** ARCHIVE SUCCEEDED **",
      "vo": "The build log ends with archive succeeded. To go live, save your App Store Connect API key as Devin secrets and connect Slack."
    },
    "0017.png": {
      "skip": true
    },
    "0019.png": {
      "skip": true
    },
    "0021.png": {
      "skip": true
    },
    "0023.png": {
      "skip": true
    },
    "0025.png": {
      "skip": true
    },
    "0028.png": {
      "skip": true
    },
    "0016.png": {
      "hold": 0.5
    },
    "0029.png": {
      "skip": true
    }
  }
};
