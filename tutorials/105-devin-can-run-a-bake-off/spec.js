window.SPEC = {
  "title": "Devin can run a bake-off",
  "subtitle": "Several Devins, different approaches, one winner",
  "outro": "Several approaches in, one winner out",
  "voOutro": "Several approaches in, one winner out.",
  "outroVoDelay": 0.1,
  "tailHold": 0.4,
  "introHold": 1.45,
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.4,
  "edit": {
    "0000.png": {
      "scene": "fork",
      "hold": 6.0,
      "cursor": false,
      "subPos": "bottom",
      "vo": "Devin can run a bake-off where several Devins try different approaches. You give a coordinator Devin one problem, and it starts a managed Devin for each approach, each in its own isolated VM, all working at the same time.",
      "hl": null
    },
    "0001.png": {
      "hold": 3.0,
      "cursor": false,
      "cam": { "x": 660, "y": 330, "z": 1.25 },
      "camDur": 1.2,
      "ring": { "x": 721, "y": 405, "w": 870, "h": 210 },
      "ringFor": 4.5,
      "vo": "Here's a real run. The analytics dashboard is slow, so I asked three managed Devins to try three fixes. One adds an index, one fetches every event in a single query, and one aggregates in SQL.",
      "hl": null
    },
    "0002.png": {
      "hold": 2.4,
      "cursor": false,
      "cam": { "x": 660, "y": 330, "z": 1.25 },
      "camDur": 1.2,
      "ring": { "x": 630, "y": 154, "w": 706, "h": 60 },
      "ringFor": 2.6,
      "vo": "The coordinator starts all three, each named after its approach.",
      "hl": null
    },
    "0003.png": {
      "hold": 2.6,
      "cursor": false,
      "cam": { "x": 576, "y": 330, "z": 1.25 },
      "camDur": 1.0,
      "ring": { "x": 188, "y": 510, "w": 360, "h": 226 },
      "ringFor": 4.0,
      "vo": "They're nested under it in the sidebar. Each one benchmarks before and after, keeps the tests passing, and opens its own pull request.",
      "hl": null
    },
    "0004.png": {
      "hold": 1.6,
      "cursor": false,
      "cam": { "x": 690, "y": 330, "z": 1.2 },
      "camDur": 1.0,
      "ring": { "x": 720, "y": 236, "w": 800, "h": 92 },
      "ringFor": 1.4,
      "vo": "That's three real pull requests, one for each idea.",
      "hl": null
    },
    "0005.png": { "hold": 0.8, "cursor": false, "hl": null },
    "0006.png": { "hold": 0.8, "cursor": false, "hl": null },
    "0007.png": {
      "scene": "judge",
      "hold": 5.6,
      "cursor": false,
      "cam": { "x": 720, "y": 330, "z": 1.25 },
      "camDur": 1.0,
      "subPos": "bottom",
      "vo": "Then the coordinator judges them fairly. It reruns the same benchmark for every candidate on one machine, and checks that each one still returns the same responses.",
      "hl": null
    },
    "0008.png": {
      "hold": 2.6,
      "cursor": false,
      "cam": { "x": 620, "y": 300, "z": 1.35 },
      "camDur": 1.2,
      "ring": { "x": 710, "y": 140, "w": 880, "h": 90 },
      "ringFor": 4.0,
      "vo": "In this run, it caught a difference in the SQL version and sent it back for a fix before measuring it.",
      "hl": null
    },
    "0009.png": {
      "hold": 3.5,
      "cursor": false,
      "cam": { "x": 620, "y": 300, "z": 1.35 },
      "camDur": 1.2,
      "ring": { "x": 721, "y": 389, "w": 856, "h": 46 },
      "ringDelay": 2.0,
      "ringFor": 5.0,
      "vo": "Finally, it puts the results side by side and picks a winner. Here, the simple index won, with the lowest latency and the highest throughput, and the report says plainly that none of them hit the target yet.",
      "hl": null
    },
    "0010.png": {
      "scene": "uses",
      "hold": 5.0,
      "cursor": false,
      "cam": "reset",
      "subPos": "bottom",
      "vo": "Run a bake-off whenever there's more than one reasonable way to do something. It works for competing fixes, design options, or experiments you want to try in parallel.",
      "hl": null
    }
  }
}
