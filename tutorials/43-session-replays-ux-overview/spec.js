window.SPEC = {
  "title": "Session replays to UX fixes",
  "subtitle": "How Devin turns funnel drop-off into a flagged fix",
  "outro": "Analytics in, a flagged fix out",
  "voOutro": "Analytics in, a flagged fix out.",
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.6,
  "noZoom": [
    [
      0
    ]
  ],
  "edit": {
    "0000.png": {
      "scene": "pain",
      "hold": 6.2,
      "cursor": false,
      "capPos": "bottom",
      "cap": "Conversion drops, and the chart can\u2019t say why",
      "vo": "A funnel chart can tell you where users drop off, but not why. Here, more than half of the checkouts that reach shipping never get to payment."
    },
    "0001.png": {
      "scene": "flow",
      "hold": 8.5,
      "cursor": false,
      "capPos": "bottom",
      "cap": "Funnel, drop-off step, replays, hypothesis, flagged PR",
      "vo": "Devin can close that loop. It reads the funnel, finds the step that loses people, watches the replays from that step, forms a hypothesis, and ships a fix behind a flag."
    },
    "0002.png": {
      "hold": 4.5,
      "cursor": false,
      "cap": "Demo: a planted bug and 320 simulated sessions",
      "vo": "In this demo, we planted a phone-field bug on purpose in a sample checkout, and simulated three hundred and twenty sessions, recorded with rrweb."
    },
    "0003.png": {
      "hold": 2.9,
      "cursor": false,
      "cap": "Metabase plugin, keys as secrets",
      "vo": "Devin reaches Metabase through the marketplace plugin.",
      "ring": {
        "x": 934,
        "y": 484,
        "w": 930,
        "h": 210
      },
      "ringFor": 2.4
    },
    "0004.png": {
      "hold": 4.5,
      "cursor": false,
      "cap": "Devin watches a replay in its own browser",
      "vo": "In its own browser, it watches a session stall on shipping, with five clicks on Continue.",
      "ring": {
        "x": 987,
        "y": 411,
        "w": 560,
        "h": 365
      },
      "ringFor": 3
    },
    "0005.png": {
      "hold": 4.6,
      "cursor": false,
      "cap": "Its hypothesis, backed by the numbers",
      "vo": "Then it states its hypothesis: every session with a formatted phone number dropped at shipping.",
      "ring": {
        "x": 291,
        "y": 303,
        "w": 530,
        "h": 90
      },
      "ringFor": 3
    },
    "0006.png": {
      "scene": "flag",
      "hold": 4.5,
      "cursor": false,
      "capPos": "bottom",
      "cap": "The fix ships behind forgiving_shipping_form",
      "vo": "It ships the fix behind a flag that's off by default, so you can roll it out gradually."
    },
    "0007.png": {
      "hold": 3.5,
      "cursor": false,
      "cap": "A real PR, tested in Devin\u2019s browser",
      "vo": "It opens a pull request and tests checkout in its browser."
    },
    "0008.png": {
      "hold": 3,
      "cursor": false,
      "cap": "Flag off: Continue does nothing visible",
      "vo": "With the flag off, the formatted number still gets stuck."
    },
    "0009.png": {
      "hold": 2.6,
      "cursor": false,
      "cap": "Flag on: straight to Payment",
      "vo": "With it on, the same number goes straight to payment."
    },
    "0010.png": {
      "scene": "uses",
      "hold": 7.5,
      "cursor": false,
      "capPos": "bottom",
      "cap": "Point Devin at your own funnel",
      "vo": "Point Devin at your own funnel: signup drop-off, checkout errors, onboarding steps, or mobile-only bugs."
    }
  }
};
