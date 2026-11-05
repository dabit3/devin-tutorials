window.SPEC = {
  "title": "How to Fix Bugs from Customer Videos",
  "subtitle": "From a screen recording to a tested pull request",
  "outro": "Try it with your next bug video",
  "voOutro": "When a customer sends a bug video, attach it to a Devin session. Devin gives you back a tested fix. Try it with the next one you get.",
  "outroVoDelay": 0.2,
  "speed": 3,
  "cps": 48,
  "capPos": "bottom",
  "maxZoom": 1.6,
  "edit": {
    "0000.png": {
      "scene": "intro",
      "hold": 3.6,
      "cursor": false,
      "cap": "Hand Devin a customer’s bug video, get back a verified fix",
      "vo": "In this video, Devin fixes a bug from a customer's screen recording."
    },
    "0001.png": {
      "scene": "flow",
      "hold": 4.8,
      "cursor": false,
      "cap": "Watch → replay → reproduce → fix → re-check → PR",
      "vo": "You give Devin the video and what the customer wrote. You get back a pull request with the fix."
    },
    "0002.png": {
      "hold": 6.6,
      "cursor": false,
      "cap": "Attach the recording to a new session (bug planted, clip recorded by us)",
      "vo": "We put the bug in this demo on purpose. I recorded the clip myself, playing the customer. To start, attach the video to a new session."
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
      "vo": "In the Computer tab, it repeats the customer's clicks. The total goes negative, the same as in the video.",
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
      "vo": "After the fix, it repeats the clicks, and the total is correct."
    },
    "0006.png": {
      "hold": 3.8,
      "cursor": false,
      "cap": "A PR with the fix and a regression test",
      "vo": "Then it opens a pull request with the fix and a test for this bug.",
      "cam": "reset",
      "camDur": 0.6
    },
    "0007.png": {
      "scene": "inputs",
      "hold": 6.0,
      "cursor": false,
      "cap": "Support-ticket clips, QA recordings, your own repro",
      "vo": "Any screen recording of a bug works. It can be a clip from a support ticket or a QA run."
    }
  }
};
