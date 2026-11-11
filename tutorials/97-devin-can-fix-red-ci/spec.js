window.SPEC = {
  "title": "Devin can fix a red CI build on its own",
  "subtitle": "From a failing check to a green pull request",
  "outro": "Red check in. Green check out.",
  "voOutro": "When a push breaks the build, Devin can read the failure, fix it, and get the check back to green on its own.",
  "outroVoDelay": -0.5,
  "introHold": 0,
  "pace": 1,
  "speed": 3,
  "capMin": 3,
  "voSentGap": 0.5,
  "maxZoom": 1.3,
  "noZoom": [
    [
      "0005.png",
      "0010.png"
    ],
    [
      "0040.png",
      "0040.png"
    ],
    [
      "0060.png",
      "0060.png"
    ]
  ],
  "edit": {
    "0005.png": {
      "scene": "title",
      "hold": 4.69,
      "voDelay": 2.1,
      "vo": "Devin can fix a red CI build on its own."
    },
    "0010.png": {
      "scene": "flow",
      "hold": 12.76,
      "vo": "Here's how it works. A push breaks a check on a pull request. A GitHub automation sees the failure and starts a Devin session. Devin reads the logs, fixes the cause, and pushes to the same branch, so the check runs again."
    },
    "0020.png": {
      "hold": 6.06,
      "subPos": "bottom",
      "ring": {
        "x": 940,
        "y": 315,
        "w": 937,
        "h": 168
      },
      "ringFor": 2.8,
      "cam": {
        "x": 814,
        "y": 360,
        "z": 1.12
      },
      "camDur": 1.2,
      "vo": "This automation watches one repository, and fires when the checkout API tests check completes with a failure."
    },
    "0021.png": {
      "hold": 5.55,
      "subPos": "top",
      "ring": {
        "x": 940,
        "y": 762,
        "w": 905,
        "h": 82
      },
      "ringFor": 2.8,
      "cam": "reset",
      "vo": "Its instructions are plain English: read the logs, fix the root cause, and push to the same branch."
    },
    "0030.png": {
      "hold": 4.73,
      "subPos": {
        "x": 0.5,
        "y": 0.8
      },
      "ring": {
        "x": 1203,
        "y": 140,
        "w": 460,
        "h": 46
      },
      "ringFor": 2.8,
      "vo": "Now a teammate opens a pull request that adds free shipping, and the check goes red."
    },
    "0031.png": {
      "hold": 4.4,
      "subPos": "top",
      "ring": {
        "x": 483,
        "y": 689,
        "w": 930,
        "h": 52
      },
      "ringFor": 2.8,
      "vo": "Nobody prompts Devin. The automation fires on its own and starts a session."
    },
    "0040.png": {
      "scene": "session",
      "hold": 9.26,
      "vo": "Inside the session, Devin works the way an engineer would. It reads the failing job, reproduces it, makes the fix, and confirms the tests pass before it pushes."
    },
    "0041.png": {
      "hold": 3.4,
      "subPos": "top",
      "ring": {
        "x": 741,
        "y": 540,
        "w": 780,
        "h": 90
      },
      "ringFor": 2.8,
      "vo": "Here, it pulls the branch and opens the failed job's log."
    },
    "0042.png": {
      "hold": 4.85,
      "subPos": "top",
      "ring": {
        "x": 741,
        "y": 406,
        "w": 780,
        "h": 190
      },
      "ringFor": 2.8,
      "vo": "It runs the tests, changes one line, runs them again, and pushes the fix."
    },
    "0043.png": {
      "hold": 6.14,
      "subPos": "top",
      "ring": {
        "x": 742,
        "y": 496,
        "w": 805,
        "h": 172
      },
      "ringFor": 3.2,
      "cam": {
        "x": 742,
        "y": 458,
        "z": 1.12
      },
      "camDur": 1.2,
      "vo": "Then it explains the cause. The subtotal is in cents, but the free-shipping threshold was written in dollars."
    },
    "0050.png": {
      "hold": 3.4,
      "subPos": {
        "x": 0.5,
        "y": 0.8
      },
      "ring": {
        "x": 1203,
        "y": 140,
        "w": 460,
        "h": 46
      },
      "ringFor": 2.8,
      "cam": "reset",
      "vo": "Back on the pull request, the same check is now green."
    },
    "0060.png": {
      "scene": "control",
      "hold": 8.9,
      "vo": "You stay in control. Conditions decide which failures start a session, the fix lands as a normal commit on the same pull request, and your team still reviews and merges."
    }
  }
};
