window.SPEC = {
  "title": "Session replays to UX fixes",
  "subtitle": "How Devin turns funnel drop-off into a flagged fix",
  "outro": "From funnel drop-off to a flagged fix",
  "voOutro": "That's how Devin turns a funnel drop-off into a flagged fix.",
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
      "cap": "Conversion drops, and the chart can’t say why",
      "vo": "In this video, Devin finds out why users leave a checkout flow. The funnel shows where they leave. More than half of the checkouts that reach shipping never get to payment."
    },
    "0001.png": {
      "scene": "flow",
      "hold": 8.5,
      "cursor": false,
      "capPos": "bottom",
      "cap": "Funnel, drop-off step, replays, hypothesis, flagged PR",
      "vo": "Devin reads the funnel and finds the step that loses people. It watches the replays from that step and forms a hypothesis. Then it ships a fix behind a flag."
    },
    "0002.png": {
      "hold": 4.5,
      "cursor": false,
      "cap": "Demo: a planted bug and 320 simulated sessions",
      "vo": "For this demo, we planted a phone-field bug in a sample checkout on purpose. We also simulated three hundred and twenty sessions and recorded them with rrweb."
    },
    "0003.png": {
      "hold": 2.9,
      "cursor": false,
      "cap": "Metabase plugin, keys as secrets",
      "vo": "Devin connects to Metabase through the marketplace plugin.",
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
      "vo": "In its browser, it watches a session get stuck on shipping. The user clicks Continue five times.",
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
      "vo": "Then it states its hypothesis. Every session with a formatted phone number dropped at shipping.",
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
      "vo": "It ships the fix behind a flag that is off by default. You turn it on when you are ready."
    },
    "0007.png": {
      "hold": 3.5,
      "cursor": false,
      "cap": "A PR, tested in Devin’s browser",
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
      "cap": "Flag on: the same number reaches Payment",
      "vo": "With the flag on, the same number goes to payment."
    },
    "0010.png": {
      "scene": "uses",
      "hold": 7.5,
      "cursor": false,
      "capPos": "bottom",
      "cap": "Point Devin at your own funnel",
      "vo": "Signup drop-off, checkout errors, and mobile-only bugs work the same way. Point Devin at your own funnel to try it."
    }
  }
};
