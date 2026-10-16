window.SPEC = {
  "title": "Debug a training loop on a real GPU",
  "subtitle": "Devin Outposts: how it works",
  "outro": "Profile and fix training on real GPUs",
  "voOutro": "That's how an outpost lets Devin profile and fix a slow training loop on a real GPU, using a machine from Modal or NVIDIA Brev.",
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.6,
  "noZoom": [
    [
      "0000.png"
    ]
  ],
  "edit": {
    "0000.png": {
      "cursor": false,
      "scene": "pain",
      "hold": 4.6,
      "capPos": "bottom",
      "cap": "Some slowdowns only happen on the real GPU",
      "vo": "Some performance problems only show up on the real hardware, like a training loop that leaves an expensive GPU waiting, and a cloud machine without that GPU can't reproduce them.",
      "voHold": 8.29
    },
    "0001.png": {
      "cursor": false,
      "scene": "flow",
      "hold": 6.8,
      "capPos": "bottom",
      "cap": "Outposts: Devin runs the session on your GPU machine",
      "vo": "With Outposts, Devin runs the session on a machine you control, so a worker on your GPU machine picks it up and Devin does the work right there.",
      "voHold": 6.33
    },
    "0002.png": {
      "cursor": false,
      "hold": 3,
      "cap": "Create the outpost in Settings → Environment → Outposts",
      "vo": "You create the outpost in Settings, and it comes with a token and the worker command."
    },
    "0003.png": {
      "cursor": false,
      "hold": 3,
      "cap": "Modal runs the outpost worker on an H200",
      "vo": "Modal and NVIDIA Brev are the partner integrations for GPUs, and in this demo a small Modal app runs the worker on an H200.",
      "voSay": "Modal and NVIDIA Brev are the partner integrations for GPUs, and in this demo a small Modal app runs the worker on an H two hundred."
    },
    "0004.png": {
      "cursor": false,
      "hold": 3,
      "cap": "Configuration → Virtual environment → gpu-h200",
      "vo": "Then you pick the outpost under Virtual environment and give Devin the task."
    },
    "0005.png": {
      "cursor": false,
      "scene": "loop",
      "hold": 6.0,
      "capPos": "bottom",
      "cap": "Profile, find the bottleneck, fix, measure again",
      "vo": "On the GPU, Devin profiles the real training loop, finds where the time goes, fixes it and measures again on the same hardware.",
      "voHold": 6.18
    },
    "0006.png": {
      "cursor": false,
      "hold": 3,
      "cap": "torch.profiler: 81% of each step waits on the DataLoader",
      "vo": "In the demo, the profiler showed most of each step waiting on the data loader instead of the GPU.",
      "cam": {
        "x": 990,
        "y": 557,
        "z": 1.6
      },
      "camForce": true
    },
    "0007.png": {
      "cursor": false,
      "hold": 3,
      "cam": {
        "x": 672,
        "y": 362,
        "z": 1.12
      },
      "camForce": true,
      "cap": "The fix: one vectorized NumPy expression, in a PR",
      "vo": "The fix was a small vectorized change, delivered as a pull request."
    },
    "0008.png": {
      "cursor": false,
      "hold": 3.5,
      "cap": "383 → 5,389 img/s on the H200, about 14x",
      "vo": "On the H200, training got about 14 times faster.",
      "voSay": "On the H two hundred, training got about fourteen times faster."
    },
    "0009.png": {
      "cursor": false,
      "scene": "uses",
      "cam": "reset",
      "camDur": 0.5,
      "hold": 2.9,
      "capPos": "bottom",
      "cap": "Slow training, GPU-only errors, benchmarks, your own infrastructure",
      "vo": "Teams use the same pattern for slow training jobs, for errors that only happen on GPUs, for benchmarks on the target hardware, and for work that has to run on their own infrastructure.",
      "voHold": 9.13
    }
  }
};
