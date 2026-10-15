# 42 · Debug a training loop on a real GPU: voice script

Nader voice (`T8iHhGIWPm2GVYpQD1Am`), one whole-script take. Beat → line (spoken form in brackets where it differs).

- `0000.png`: Outposts let Devin run sessions on machines you control, so when a problem only shows up on a real GPU, Devin can debug it on that GPU.
- `0001.png`: Use it to profile slow training, to chase errors that only happen on GPU hardware, or to benchmark a change where it will actually run.
- `0002.png`: To set one up, open Settings → Environment → Outposts and create an outpost.  
  _(said: To set one up, open Settings, Environment, Outposts, and create an outpost.)_
- `0004.png`: I'm naming it gpu-h200 after the hardware it will run on, and picking the Linux platform, because the GPU machine runs Linux.  
  _(said: I'm naming it gpu H two hundred after the hardware it will run on, and picking the Linux platform, because the GPU machine runs Linux.)_
- `0013.png`: Devin generates a token for the outpost and the worker command that connects a machine to it, and the token is only shown once, so copy it before you close the dialog.
- `0018.png`: The docs list Modal and NVIDIA Brev as partner integrations for GPU machines, and here a small Modal app runs that worker command on an H200.  
  _(said: The docs list Modal and NVIDIA Brev as partner integrations for GPU machines, and here a small Modal app runs that worker command on an H two hundred.)_
- `0031.png`: The outpost token goes into a Modal secret, so it never appears in the code, and modal run starts the worker on the H200 in the background.  
  _(said: The outpost token goes into a Modal secret, so it never appears in the code, and modal run starts the worker on the H two hundred in the background.)_
- `0061.png`: When it prints worker started, the outpost is online.
- `0062.png`: Back in Devin, open Configuration below the prompt box, and under Virtual environment pick the outpost instead of Ubuntu.
- `0068.png`: The demo repo, gpu-train-demo, has a slow data loader that I planted on purpose, so I ask Devin to profile the training loop and fix the bottleneck.  
  _(said: The demo repo, gpu train demo, has a slow data loader that I planted on purpose, so I ask Devin to profile the training loop and fix the bottleneck.)_
- `0076.png`: The session waits for the outpost, and the Modal worker picks it up within seconds.
- `0077.png`: From there Devin works on the H200 on its own, running the training script, profiling it and changing the code.  
  _(said: From there Devin works on the H two hundred on its own, running the training script, profiling it and changing the code.)_
- `0084.png`: When it's done, every step is in the timeline, and clicking a step shows its command and output, starting with the moment the outpost machine connected.
- `0090.png`: First it checks the hardware, and nvidia-smi shows an NVIDIA H200.  
  _(said: First it checks the hardware, and nvidia S M I shows an NVIDIA H two hundred.)_
- `0093.png`: Then it times each half on its own, and preparing the images turns out to be far slower than the GPU step.
- `0096.png`: The torch profiler confirms it, with most of each step spent waiting on the data loader.
- `0099.png`: The cause is a Python loop that normalizes each image one row at a time, so Devin replaces it with one vectorized NumPy call and checks that the output is identical.
- `0102.png`: Then it opens a pull request, and the diff is small, with the row by row loop replaced by a single NumPy expression.
- `0104.png`: On the H200, training is about 14 times faster, and since the repo has no tests, Devin checked the speedup by running the training script.  
  _(said: On the H two hundred, training is about fourteen times faster, and since the repo has no tests, Devin checked the speedup by running the training script.)_
- outro: Your GPU, your outpost, and Devin doing the profiling.

## Typed on screen
- Outpost name: `gpu-h200` (Linux platform)
- Terminal: `cat worker.py`, `read -s TOKEN` (hidden input), `modal secret create devin-outpost DEVIN_OUTPOSTS_TOKEN="$TOKEN"`, `modal run --detach worker.py`
- Prompt (web app, `@thequantexplorer/gpu-train-demo` mentioned): "Training is slow on this H200. Profile the training loop, find the bottleneck and fix it."

## Sources
- Outposts overview and partner integrations (Modal, NVIDIA Brev): https://docs.devin.ai/cloud/outposts/overview
- Modal: https://modal.com/docs/devin
- Real session (thequantexplorer, archived after capture): https://app.devin.ai/sessions/541ac80619aa4cf8bf8a66d7148196d8
- Real PR (closed after capture): https://github.com/thequantexplorer/gpu-train-demo/pull/1
