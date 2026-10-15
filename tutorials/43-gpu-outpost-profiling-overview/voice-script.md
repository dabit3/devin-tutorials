# 43 · Debug a training loop on a real GPU (overview): voice script

Nader voice (`T8iHhGIWPm2GVYpQD1Am`), one whole-script take. Beat → line (spoken form in brackets where it differs).

- `0000.png` (pain diagram): Some performance problems only show up on the real hardware, like a training loop that leaves an expensive GPU waiting, and a cloud machine without that GPU can't reproduce them.
- `0001.png` (flow diagram): With Outposts, Devin runs the session on a machine you control, so a worker on your GPU machine picks it up and Devin does the work right there.
- `0002.png`: You create the outpost in Settings, and it comes with a token and the worker command.
- `0003.png`: Modal and NVIDIA Brev are the partner integrations for GPUs, and in this demo a small Modal app runs the worker on an H200.  
  _(said: Modal and NVIDIA Brev are the partner integrations for GPUs, and in this demo a small Modal app runs the worker on an H two hundred.)_
- `0004.png`: Then you pick the outpost under Virtual environment and give Devin the task.
- `0005.png` (loop diagram): On the GPU, Devin profiles the real training loop, finds where the time goes, fixes it and measures again on the same hardware.
- `0006.png`: In the demo, the profiler showed most of each step waiting on the data loader instead of the GPU.
- `0007.png`: The fix was a small vectorized change, delivered as a pull request.
- `0008.png`: On the H200, training got about 14 times faster.  
  _(said: On the H two hundred, training got about fourteen times faster.)_
- `0009.png` (uses diagram): Teams use the same pattern for slow training jobs, for errors that only happen on GPUs, for benchmarks on the target hardware, and for work that has to run on their own infrastructure.
- outro: Real hardware, real profiling, a real fix.

## Sources
- Outposts overview and partner integrations (Modal, NVIDIA Brev; `!outpost` in Slack): https://docs.devin.ai/cloud/outposts/overview
- Proof shots: tutorial 42 (`../42-gpu-outpost-profiling/`), mapped in `shots/SOURCES.json`
