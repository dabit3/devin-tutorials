window.SPEC = {
  "title": "Debug a training loop on a real GPU",
  "subtitle": "Devin Outposts on a Modal H200, step by step",
  "outro": "Your GPU, your outpost, Devin doing the profiling",
  "voOutro": "Your GPU, your outpost, and Devin doing the profiling.",
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.6,
  "pollRunMax": 1,
  "edit": {
    "0000.png": {
      "hold": 5.5,
      "cursor": false,
      "cap": "Outposts: Devin sessions on machines you control",
      "vo": "Outposts let Devin run sessions on machines you control, so when a problem only shows up on a real GPU, Devin can debug it on that GPU."
    },
    "0001.png": {
      "cursor": true,
      "vo": "Use it to profile slow training, to chase errors that only happen on GPU hardware, or to benchmark a change where it will actually run."
    },
    "0002.png": {
      "cap": "Settings → Environment → Outposts",
      "vo": "To set one up, open Settings → Environment → Outposts and create an outpost.",
      "voSay": "To set one up, open Settings, Environment, Outposts, and create an outpost."
    },
    "0004.png": {
      "cap": "Name it after the hardware: gpu-h200",
      "vo": "I'm naming it gpu-h200 after the hardware it will run on, and picking the Linux platform, because the GPU machine runs Linux.",
      "voSay": "I'm naming it gpu H two hundred after the hardware it will run on, and picking the Linux platform, because the GPU machine runs Linux."
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
    "0024.png": {
      "hold": 4.5,
      "cap": "worker.py: devin worker start --outpost gpu-h200, on gpu=\"H200\""
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
      "vo": "When it's done, every step is in the timeline, and clicking a step shows its command and output, starting with the moment the outpost machine connected."
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
      "vo": "Then it times each half on its own, and preparing the images turns out to be far slower than the GPU step."
    },
    "0096.png": {
      "hold": 2.4,
      "cap": "torch.profiler: 81% of each step waits on the DataLoader",
      "vo": "The torch profiler confirms it, with most of each step spent waiting on the data loader."
    },
    "0099.png": {
      "cap": "Vectorized normalize: maxdiff 0.0, 93 µs per image",
      "vo": "The cause is a Python loop that normalizes each image one row at a time, so Devin replaces it with one vectorized NumPy call and checks that the output is identical."
    },
    "0102.png": {
      "cap": "Devin opens a PR on thequantexplorer/gpu-train-demo",
      "vo": "Then it opens a pull request, and the diff is small, with the row by row loop replaced by a single NumPy expression."
    },
    "0103.png": {
      "hold": 4,
      "cap": "train.py, +2 −6: the row loop becomes one NumPy expression"
    },
    "0104.png": {
      "hold": 4.5,
      "cap": "383 → 5,389 img/s on the H200, about 14x",
      "vo": "On the H200, training is about 14 times faster, and since the repo has no tests, Devin checked the speedup by running the training script.",
      "voSay": "On the H two hundred, training is about fourteen times faster, and since the repo has no tests, Devin checked the speedup by running the training script."
    }
  }
};
