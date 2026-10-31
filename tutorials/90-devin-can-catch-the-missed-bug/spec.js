window.SPEC = {
 "title": "Devin can catch the missed bug",
 "subtitle": "The one a human reviewer approved, flagged by Devin Review and fixed by Auto-fix",
 "outro": "Catch the bug before it ships",
 "voOutro": "Catch the bug before it ships.",
 "outroVoDelay": -0.3,
 "introHold": 2.0,
 "speed": 3,
 "cps": 48,
 "maxZoom": 1.3,
 "pollRunMax": 2.2,
 "voSentGap": 0.45,
 "noZoom": [
  [
   "d01.png",
   "0000.png"
  ]
 ],
 "edit": {
  "d01.png": {
   "scene": "hero",
   "hold": 1.3,
   "cursor": false,
   "cap": "Devin can catch the bug a human reviewer missed and fix it",
   "vo": "Devin can catch the bug a human reviewer missed and fix it.",
   "voDelay": -1.2
  },
  "d02.png": {
   "scene": "story",
   "hold": 6,
   "cursor": false,
   "cap": "Approved doesn't always mean correct",
   "vo": "Approved doesn't always mean correct. The tests pass, a reviewer signs off, and an edge case still slips through."
  },
  "0000.png": {
   "hold": 3.2,
   "cursor": false,
   "cap": "A real demo pull request, with a bug we planted",
   "subPos": "bottom",
   "vo": "Here's a real pull request in Fernhouse, a demo plant shop. It adds gift cards at checkout, and we planted one bug in it for this video."
  },
  "0001.png": {
   "cap": "A teammate approves it",
   "subPos": "bottom",
   "vo": "A teammate reads it, sees the passing tests, and leaves a quick review."
  },
  "0019.png": {
   "hold": 0.8,
   "ring": {
    "x": 1232,
    "y": 510,
    "w": 400,
    "h": 44
   },
   "ringFor": 0.8,
   "subPos": "bottom"
  },
  "0020.png": {
   "cap": "Ask Devin Review to review this pull request",
   "subPos": "bottom",
   "vo": "Then we ask Devin Review to review this pull request."
  },
  "0024.png": {
   "badge": "Sped up",
   "hold": 0.35
  },
  "0025.png": {
   "badge": "Sped up",
   "hold": 0.35
  },
  "0026.png": {
   "badge": "Sped up",
   "hold": 0.35
  },
  "0027.png": {
   "badge": "Sped up",
   "hold": 0.35
  },
  "0028.png": {
   "skip": true
  },
  "0029.png": {
   "hold": 2.6,
   "ring": {
    "x": 1234,
    "y": 157,
    "w": 404,
    "h": 108
   },
   "ringFor": 2.6,
   "cap": "1 Bug: gift cards produce negative order totals",
   "subPos": "bottom",
   "vo": "In under two minutes, it reports one bug. Gift cards produce negative order totals.",
   "badge": ""
  },
  "0032.png": {
   "skip": true
  },
  "0033.png": {
   "hold": 3,
   "ring": {
    "x": 1225,
    "y": 606,
    "w": 400,
    "h": 392
   },
   "ringFor": 3,
   "cap": "The finding opens on the exact line",
   "subPos": {
    "x": 0.38,
    "y": 0.83
   },
   "vo": "Clicking the finding opens the exact line. The total subtracts the whole card balance, so a hundred-dollar card on a sixty-four dollar order shows minus thirty-six dollars instead of zero."
  },
  "0036.png": {
   "hold": 2.6,
   "ring": {
    "x": 684,
    "y": 487,
    "w": 660,
    "h": 346
   },
   "ringFor": 2.6,
   "cap": "Posted on the Discussion tab, below the approval",
   "subPos": {
    "x": 0.5,
    "y": 0.93
   },
   "vo": "The same finding is posted to the Discussion tab, right under the teammate's approval."
  },
  "d03.png": {
   "scene": "autofix",
   "hold": 6,
   "cursor": false,
   "cap": "Auto-fix hands the finding to a Devin session",
   "vo": "Now the fix. Auto-fix hands the finding to a Devin session. Devin pushes a commit to the same pull request, and Devin Review checks it again."
  },
  "0037.png": {
   "cap": "Auto-fix with Devin",
   "subPos": "bottom",
   "vo": "So I click Auto-fix with Devin, and a Devin session starts working on it right away."
  },
  "0039.png": {
   "hold": 1.0,
   "ring": {
    "x": 1233,
    "y": 432,
    "w": 404,
    "h": 64
   },
   "ringFor": 1.0,
   "subPos": "bottom"
  },
  "0040.png": {
   "skip": true
  },
  "0053.png": {
   "hold": 3.4,
   "ring": {
    "x": 289,
    "y": 395,
    "w": 552,
    "h": 356
   },
   "ringFor": 3.2,
   "cap": "Devin caps the credit, adds tests and pushes the fix",
   "subPos": {
    "x": 0.62,
    "y": 0.09
   },
   "vo": "Devin takes over the pull request and caps the gift card credit at the order value. It adds two tests for oversized cards, runs the tests and the build, and pushes the fix."
  },
  "0045.png": {
   "skip": true
  },
  "0046.png": {
   "hold": 2.6,
   "ring": {
    "x": 1234,
    "y": 253,
    "w": 404,
    "h": 104
   },
   "ringFor": 2.6,
   "cap": "Re-checked: 0 bugs, resolved",
   "subPos": "bottom",
   "vo": "Devin Review checks the new commit and marks the bug resolved."
  },
  "0047.png": {
   "skip": true
  },
  "0048.png": {
   "skip": true
  },
  "0049.png": {
   "skip": true
  },
  "0050.png": {
   "cap": "The fix is a normal commit",
   "subPos": "bottom",
   "vo": "The fix is a normal commit on the pull request, ready for a person to read before it merges."
  },
  "0052.png": {
   "hold": 2.4,
   "ring": {
    "x": 678,
    "y": 165,
    "w": 666,
    "h": 134
   },
   "ringFor": 2.4,
   "subPos": "bottom"
  },
  "d04.png": {
   "scene": "recap",
   "hold": 6,
   "cursor": false,
   "cap": "Your team decides what ships",
   "vo": "Your team still decides what ships. Devin Review gives each pull request a second, careful read, and Auto-fix turns its findings into fixes you can review."
  },
  "0054.png": {
   "skip": true
  },
  "0055.png": {
   "skip": true
  },
  "0056.png": {
   "skip": true
  },
  "0002.png": {
   "hold": 0.4
  },
  "0003.png": {
   "hold": 0.4
  },
  "0004.png": {
   "hold": 0.4
  },
  "0015.png": {
   "hold": 0.4,
   "cap": "Approved",
   "subPos": "bottom",
   "vo": "They approve it, and on a busy day, that's often where review ends."
  },
  "0016.png": {
   "hold": 0.4
  },
  "0017.png": {
   "hold": 0.4
  },
  "0018.png": {
   "hold": 0.4
  },
  "0021.png": {
   "hold": 0.35
  },
  "0022.png": {
   "hold": 0.35
  },
  "0023.png": {
   "hold": 0.35
  },
  "0030.png": {
   "hold": 0.4
  },
  "0031.png": {
   "hold": 0.4
  },
  "0034.png": {
   "hold": 0.4
  },
  "0035.png": {
   "hold": 0.4
  },
  "0038.png": {
   "hold": 0.4
  },
  "0041.png": {
   "skip": true
  },
  "0042.png": {
   "hold": 0.3
  },
  "0051.png": {
   "hold": 0.4
  }
 }
};
