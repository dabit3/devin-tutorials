window.SPEC = {
  "title": "Red team your own fix",
  "subtitle": "What the pattern is, and why it matters",
  "outro": "Let one Devin fix it, and another try to break it",
  "voOutro": "Let one Devin write the fix, and let another one try to break it.",
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.6,
  "edit": {
    "0000.png": {
      "scene": "value",
      "hold": 7.5,
      "voHold": 7.1,
      "cursor": false,
      "capPos": "bottom",
      "cap": "One Devin writes the fix, another tries to break it",
      "vo": "Red teaming your own fix means one Devin writes the patch, a second Devin tries to break it, and the loop keeps going until the breaker fails.",
      "hl": null
    },
    "0001.png": {
      "scene": "why",
      "hold": 9.0,
      "voHold": 9.3,
      "capPos": "bottom",
      "cap": "A fresh breaker, proof for every break, fixes that build on it",
      "vo": "It matters because an agent checking its own patch shares its blind spots, while a separate breaker starts fresh, has to reproduce every break, and hands each one back to be fixed.",
      "hl": null
    },
    "0002.png": {
      "hold": 4.0,
      "ring": {
        "x": 720.6,
        "y": 387.5,
        "w": 842.5,
        "h": 150
      },
      "ringFor": 3.5,
      "cap": "A real bug, at most four rounds",
      "vo": "Here, I ask Devin for that loop on a real bug in a kanban demo app, with at most four rounds.",
      "hl": null
    },
    "0003.png": {
      "scene": "loop",
      "hold": 8.0,
      "voHold": 8.1,
      "capPos": "bottom",
      "cap": "Fix, break, stop when the breaker comes back empty",
      "vo": "As a dynamic workflow, it's a short script: each round runs a fixer, gives its branch to a breaker, and stops as soon as the breaker comes back empty.",
      "hl": null
    },
    "0004.png": {
      "hold": 3.6,
      "ring": {
        "x": 977.5,
        "y": 466.9,
        "w": 746.5,
        "h": 91.3
      },
      "ringFor": 3.5,
      "cap": "The breaker gets the fixer's branch",
      "vo": "This is the loop Devin wrote, with the breaker getting the fixer's branch.",
      "hl": null
    },
    "0005.png": {
      "hold": 4.0,
      "ring": {
        "x": 1002,
        "y": 232,
        "w": 812,
        "h": 82
      },
      "ringFor": 3.5,
      "cap": "Fix and break phases, with live status",
      "vo": "The workflow panel shows the fix and break phases, with every agent's live status.",
      "hl": null
    },
    "0006.png": {
      "scene": "rounds",
      "hold": 8.0,
      "voHold": 6.9,
      "capPos": "bottom",
      "cap": "Round one found a break, round two held",
      "vo": "In the real run, round one's breaker found a card that vanished on reload, round two fixed it, and the second breaker came up empty.",
      "hl": null
    },
    "0007.png": {
      "hold": 4.5,
      "ring": {
        "x": 737,
        "y": 103,
        "w": 820,
        "h": 100
      },
      "ringFor": 3.5,
      "cap": "A real break, reproduced in tests",
      "vo": "That first break was real, and the breaker reproduced it in tests before reporting it.",
      "hl": null
    },
    "0008.png": {
      "hold": 4.2,
      "ring": {
        "x": 1207,
        "y": 397,
        "w": 92,
        "h": 40
      },
      "ringFor": 3.5,
      "cap": "One PR, still reviewed before merge",
      "vo": "The result is one pull request, and it still gets a normal review before you merge.",
      "hl": null
    },
    "0009.png": {
      "scene": "uses",
      "hold": 7.0,
      "voHold": 7.5,
      "capPos": "bottom",
      "cap": "Input validation, parsers, permission checks, data migrations",
      "vo": "Use it for fixes where edge cases matter, like input validation, parsers, permission checks and data migrations.",
      "hl": null
    }
  }
};
