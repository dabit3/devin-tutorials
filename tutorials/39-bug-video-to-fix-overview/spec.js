window.SPEC = {
  "title": "A Customer’s Bug Video Becomes a Fix",
  "subtitle": "How Devin turns a screen recording into a verified PR",
  "outro": "Send the bug video, get back a verified fix",
  "voOutro": "Send Devin the bug video, and get back a verified fix.",
  "outroVoDelay": 0.2,
  "speed": 3,
  "cps": 48,
  "capPos": "bottom",
  "maxZoom": 1.6,
  "edit": {
    "0000.png": {
      "scene": "intro",
      "hold": 5.4,
      "cursor": false,
      "cap": "Hand Devin a customer’s bug video, get back a verified fix",
      "vo": "Hand Devin a customer's screen recording, and it reproduces the bug, fixes it, and opens a pull request."
    },
    "0001.png": {
      "scene": "flow",
      "hold": 8.6,
      "cursor": false,
      "cap": "Watch → replay → reproduce → fix → re-check → PR",
      "vo": "It watches the video, replays the same clicks in its own browser until the bug shows up, and fixes the code. Then it replays the clicks again to prove the fix before it opens the PR."
    },
    "0002.png": {
      "hold": 6.6,
      "cursor": false,
      "cap": "Attach the recording to a new session (bug planted, clip recorded by us)",
      "vo": "In this demo we planted the bug on purpose, and I recorded the clip playing the customer. You just attach the video to a new session."
    },
    "0003.png": {
      "hold": 3.8,
      "cursor": false,
      "cap": "Devin reads the video and starts the app",
      "vo": "Devin reads the recording and starts the app on its own machine."
    },
    "0004.png": {
      "hold": 5.0,
      "cursor": false,
      "cap": "It replays the clicks until the bug shows: −$4.80",
      "vo": "In the Computer tab, you watch it repeat the customer's clicks until the total goes negative, just like in the video.",
      "cam": {
        "x": 1180,
        "y": 330,
        "z": 1.4
      },
      "camDur": 0.8
    },
    "0005.png": {
      "hold": 3.6,
      "cursor": false,
      "cap": "Same clicks after the fix: $14.40",
      "vo": "After the fix, it runs the same clicks again, and the total is right."
    },
    "0006.png": {
      "hold": 3.8,
      "cursor": false,
      "cap": "A PR with the fix and a regression test",
      "vo": "Then it opens a pull request with the fix and a regression test.",
      "cam": "reset",
      "camDur": 0.6
    },
    "0007.png": {
      "scene": "inputs",
      "hold": 6.0,
      "cursor": false,
      "cap": "Support-ticket clips, QA recordings, your own repro",
      "vo": "Any screen recording of a bug works, like a clip from a support ticket or a QA run, along with whatever the customer wrote."
    }
  }
};
