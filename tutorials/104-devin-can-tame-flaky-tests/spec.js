window.SPEC = {
  "title": "Taming flaky tests",
  "subtitle": "Devin can track down a flaky test and prove it's fixed",
  "outro": "Fixed and proven, not just green once",
  "voOutro": "Fixed and proven, not just green once.",
  "outroVoDelay": 0,
  "speed": 3,
  "pollRunMax": 2.2,
  "maxZoom": 1.3,
  "voSentGap": 0.45,
  "edit": {
    "0000.png": {
      "scene": "flaky",
      "hold": 4.8,
      "voDelay": -2.4,
      "cap": "One green run proves nothing",
      "capPos": "bottom",
      "subPos": "bottom",
      "vo": "Devin can track down a flaky test and prove it's fixed. A flaky test passes most of the time and fails now and then, so one green run proves nothing."
    },
    "0005.png": {
      "scene": "method",
      "hold": 7,
      "cap": "Reproduce, find the root cause, fix, prove",
      "capPos": "bottom",
      "subPos": "bottom",
      "vo": "Devin treats it like an investigation. It reproduces the failure with repeated runs, finds the root cause, fixes the code, and then proves the fix with the same runs."
    },
    "0010.png": {
      "hold": 5,
      "cap": "The task: a flaky checkout test in a demo app",
      "capPos": "bottom",
      "subPos": "bottom",
      "ring": {
        "x": 721,
        "y": 405,
        "w": 866,
        "h": 258
      },
      "ringFor": 3,
      "vo": "For this demo, we planted a race in a small inventory app, and asked Devin to fix its flaky checkout test without changing the test."
    },
    "0020.png": {
      "hold": 4,
      "cap": "Reproduce: the whole suite runs 200 times",
      "capPos": "top",
      "subPos": {
        "x": 0.8,
        "y": 0.3
      },
      "ring": {
        "x": 722,
        "y": 571,
        "w": 836,
        "h": 42
      },
      "ringFor": 3,
      "vo": "Devin starts by running the suite two hundred times, to measure how often the test fails."
    },
    "0030.png": {
      "scene": "race",
      "hold": 9,
      "cap": "The root cause: a race between two reservations",
      "capPos": "bottom",
      "subPos": "bottom",
      "vo": "The failures point to a race. Reserving stock reads the count and writes it back in two separate steps. When the first write is slow, a second click still reads five units, and both orders succeed."
    },
    "0040.png": {
      "hold": 4,
      "cap": "Devin explains the root cause and the timing behind it",
      "capPos": "bottom",
      "subPos": {
        "x": 0.62,
        "y": 0.125
      },
      "ring": {
        "x": 714,
        "y": 236,
        "w": 868,
        "h": 96
      },
      "ringFor": 3,
      "vo": "Devin's summary explains the root cause in plain terms, including the timing that triggers it."
    },
    "0050.png": {
      "hold": 4,
      "cap": "The fix: reservations for one item run one at a time",
      "capPos": "bottom",
      "subPos": {
        "x": 0.2,
        "y": 0.69
      },
      "ring": {
        "x": 1008,
        "y": 471,
        "w": 846,
        "h": 330
      },
      "ringFor": 3,
      "vo": "The fix makes reservations for the same item run one after another, and the test stays exactly as it was."
    },
    "0060.png": {
      "scene": "proof",
      "hold": 9,
      "cap": "A CI check that runs the suite 50 times",
      "capPos": "bottom",
      "subPos": "bottom",
      "vo": "To prove it, Devin opened a pull request whose first commit only adds a CI check that runs the suite fifty times. That check failed on the original code. Then Devin pushed the fix to the same pull request."
    },
    "0070.png": {
      "hold": 3.0,
      "cap": "CI failed before the fix was pushed",
      "capPos": "bottom",
      "subPos": {
        "x": 0.62,
        "y": 0.765
      },
      "ring": {
        "x": 675,
        "y": 441,
        "w": 736,
        "h": 164
      },
      "ringFor": 3,
      "vo": "In the session, you can see the check fail before the fix goes in."
    },
    "0080.png": {
      "hold": 2.5,
      "cap": "After the fix, the same check passes",
      "capPos": "bottom",
      "subPos": {
        "x": 0.71,
        "y": 0.925
      },
      "ring": {
        "x": 1010,
        "y": 613,
        "w": 826,
        "h": 112
      },
      "ringFor": 2.8,
      "vo": "After the fix, the same check passes."
    },
    "0090.png": {
      "hold": 3.5,
      "cap": "Local reruns: 18 of 200 failed before, 0 of 200 after",
      "capPos": "bottom",
      "subPos": {
        "x": 0.75,
        "y": 0.925
      },
      "ring": {
        "x": 289,
        "y": 414,
        "w": 524,
        "h": 152
      },
      "ringFor": 3,
      "vo": "And locally, failures dropped from eighteen in two hundred runs to zero in two hundred."
    },
    "0100.png": {
      "scene": "recap",
      "hold": 3.0,
      "cap": "Measure it, explain it, fix it, prove it",
      "capPos": "bottom",
      "subPos": "bottom",
      "vo": "So when a test fails one run in eight, ask Devin to measure it, explain it, fix it, and prove it."
    }
  }
};
