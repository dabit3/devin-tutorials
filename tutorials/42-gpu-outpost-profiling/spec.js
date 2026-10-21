window.SPEC = {
  "title": "Debug a training loop on a real GPU",
  "subtitle": "Devin Outposts on a Modal H200, step by step",
  "outro": "Connect a GPU, let Devin profile and fix",
  "voOutro": "That's how you connect a GPU on Modal to Devin, and have Devin profile and fix a slow training loop right on that hardware.",
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.6,
  "noZoom": [
    [
      "0000.png"
    ]
  ],
  "pollRunMax": 1,
  "edit": {
    "0002.png": {
      "hold": 1.6,
      "cursor": false,
      "cap": "A slow PyTorch training loop, debugged on a Modal H200",
      "vo": "In this video, Devin finds and fixes a slow PyTorch training loop on a real NVIDIA H200 GPU running on Modal.",
      "voSay": "In this video, Devin finds and fixes a slow PyTorch training loop on a real NVIDIA H two hundred GPU running on Modal."
    },
    "0003.png": {
      "cursor": true,
      "cap": "Settings → Environment → Outposts",
      "vo": "Modal provides the GPU machine and a Devin outpost connects it, so you can debug training, chase GPU-only errors and benchmark changes on real hardware.",
      "voSay": "Modal provides the GPU machine and a Devin outpost connects it, so you can debug training, chase GPU only errors and benchmark changes on real hardware."
    },
    "0004.png": {
      "cap": "Name it after the hardware: gpu-h200",
      "vo": "To set one up, create an outpost in Settings → Environment → Outposts. I'm naming it gpu-h200 after the hardware it will run on, and picking the Linux platform, because the GPU machine runs Linux.",
      "voSay": "To set one up, create an outpost in Settings, Environment, Outposts. I'm naming it gpu H two hundred after the hardware it will run on, and picking the Linux platform, because the GPU machine runs Linux."
    },
    "0011.png": {
      "cap": "Platform: Linux"
    },
    "0013.png": {
      "cap": "One token, plus the devin worker start command to run on your machine",
      "vo": "Devin generates a token for the outpost and the worker command that connects a machine to it, and the token is only shown once, so copy it before you close the dialog."
    },
    "0014.png": {
      "hold": 2.6
    },
    "0017.png": {
      "cap": "gpu-h200 is created, with no machine connected yet"
    },
    "0018.png": {
      "cursor": false,
      "cap": "Modal: a small app that runs the worker on an H200",
      "vo": "The docs list Modal and NVIDIA Brev as partner integrations for GPU machines, and here a small Modal app runs that worker command on an H200.",
      "voSay": "The docs list Modal and NVIDIA Brev as partner integrations for GPU machines, and here a small Modal app runs that worker command on an H two hundred."
    },
    "0031.png": {
      "cap": "The outpost token goes into a Modal secret",
      "vo": "The outpost token goes into a Modal secret, so it never appears in the code, and modal run starts the worker on the H200 in the background.",
      "voSay": "The outpost token goes into a Modal secret, so it never appears in the code, and modal run starts the worker on the H two hundred in the background."
    },
    "0049.png": {
      "cap": "Modal secret devin-outpost created"
    },
    "0061.png": {
      "hold": 2.4,
      "cap": "Worker started: the outpost is online",
      "vo": "When it prints worker started, the outpost is online."
    },
    "0062.png": {
      "cursor": true,
      "cap": "Configuration → Virtual environment → gpu-h200",
      "vo": "Back in Devin, open Configuration below the prompt box, and under Virtual environment pick the outpost instead of Ubuntu."
    },
    "0068.png": {
      "cap": "@thequantexplorer/gpu-train-demo",
      "vo": "The demo repo, gpu-train-demo, has a slow data loader that I planted on purpose, so I ask Devin to profile the training loop and fix the bottleneck.",
      "voSay": "The demo repo, gpu train demo, has a slow data loader that I planted on purpose, so I ask Devin to profile the training loop and fix the bottleneck."
    },
    "0074.png": {
      "cap": "\"Training is slow on this H200. Profile the training loop, find the bottleneck and fix it.\""
    },
    "0076.png": {
      "hold": 1.6,
      "cap": "Queued on the outpost until the worker picks it up",
      "vo": "The session waits for the outpost, and the Modal worker picks it up within seconds."
    },
    "0077.png": {
      "badge": "Sped up",
      "cap": "Devin works on the H200 by itself",
      "vo": "From there Devin works on the H200 on its own, running the training script, profiling it and changing the code.",
      "voSay": "From there Devin works on the H two hundred on its own, running the training script, profiling it and changing the code."
    },
    "0078.png": {
      "hold": 0.7
    },
    "0079.png": {
      "hold": 0.7
    },
    "0080.png": {
      "hold": 0.7
    },
    "0081.png": {
      "hold": 0.7
    },
    "0082.png": {
      "hold": 0.7
    },
    "0083.png": {
      "hold": 0.7
    },
    "0084.png": {
      "badge": "",
      "cap": "Every step is in the session timeline",
      "vo": "When it's done, every step is in the timeline, and clicking a step shows its command and output, starting with the moment the outpost machine connected.",
      "cam": {
        "x": 672,
        "y": 362,
        "z": 1.12
      },
      "camForce": true
    },
    "0087.png": {
      "hold": 1.2,
      "cap": "Outpost machine connected: the Modal H200"
    },
    "0090.png": {
      "hold": 2.4,
      "cap": "nvidia-smi: NVIDIA H200, 143771 MiB",
      "vo": "First it checks the hardware, and nvidia-smi shows an NVIDIA H200.",
      "voSay": "First it checks the hardware, and nvidia S M I shows an NVIDIA H two hundred."
    },
    "0093.png": {
      "cap": "Data loading: 2.40 ms per image → 417 img/s. GPU step alone: 13,869 img/s",
      "vo": "Then it times each half on its own, and preparing the images turns out to be far slower than the GPU step.",
      "cam": {
        "x": 990,
        "y": 557,
        "z": 1.6
      },
      "camForce": true
    },
    "0096.png": {
      "hold": 2.4,
      "cap": "torch.profiler: 81% of each step waits on the DataLoader",
      "vo": "The torch profiler confirms it, with most of each step spent waiting on the data loader.",
      "cam": {
        "x": 990,
        "y": 557,
        "z": 1.6
      },
      "camForce": true
    },
    "0099.png": {
      "cap": "Vectorized normalize: maxdiff 0.0, 93 µs per image",
      "vo": "The cause is a Python loop that normalizes each image one row at a time, so Devin replaces it with one vectorized NumPy call and checks that the output is identical.",
      "cam": {
        "x": 990,
        "y": 557,
        "z": 1.6
      },
      "camForce": true
    },
    "0102.png": {
      "cam": {
        "x": 672,
        "y": 362,
        "z": 1.12
      },
      "camForce": true,
      "cap": "Devin opens a PR on thequantexplorer/gpu-train-demo",
      "vo": "Then it opens a pull request and sums up what it found, the profile, the cause and the fix."
    },
    "0104.png": {
      "hold": 4.5,
      "cap": "383 → 5,389 img/s on the H200, about 14x",
      "vo": "On the H200, training is about 14 times faster, and since the repo has no tests, Devin checked the speedup by running the training script.",
      "voSay": "On the H two hundred, training is about fourteen times faster, and since the repo has no tests, Devin checked the speedup by running the training script."
    },
    "0089.png": {
      "cam": "reset"
    },
    "0094.png": {
      "cam": "reset"
    },
    "0097.png": {
      "cam": "reset"
    },
    "0100.png": {
      "cam": "reset"
    },
    "0101.png": {
      "cam": {
        "x": 672,
        "y": 362,
        "z": 1.12
      },
      "camForce": true
    }
  }
};
