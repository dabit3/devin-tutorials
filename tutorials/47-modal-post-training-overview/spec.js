window.SPEC = {
  "title": "Post-training on Modal",
  "subtitle": "How Devin swaps a frontier API for your own model",
  "outro": "Devin does the work. You review the results",
  "voOutro": "Save the recipe as a playbook, and Devin can run it again on your own data.",
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.6,
  "edit": {
    "0000.png": {
      "scene": "value", "hold": 9.6, "voHold": 9.4, "cursor": false, "capPos": "bottom",
      "cap": "Your own model in place of a frontier API",
      "vo": "Devin can post-train a seven-billion-parameter open model on Modal and swap it in for a frontier API. In this video, our example is text-to-SQL, but the same steps work for any task where a script can score the answer.",
      "hl": null
    },
    "0001.png": {
      "scene": "steps", "hold": 6.6, "voHold": 3.6, "capPos": "bottom",
      "cap": "Dataset, baseline, SFT, RL, sweep, eval, deploy",
      "vo": "It does every step an ML engineer would, from dataset to deploy.",
      "hl": null
    },
    "0002.png": {
      "hold": 3.2, "ring": { "x": 720, "y": 706, "w": 872, "h": 100 }, "ringFor": 2.8,
      "cap": "Spider splits and a reward that runs the SQL",
      "vo": "I ask for Spider splits with their databases, and a reward that runs the SQL.",
      "hl": null
    },
    "0003.png": {
      "scene": "reward", "hold": 6.4, "voHold": 6.4, "capPos": "bottom",
      "cap": "Match 1, wrong rows 0, fails to run -0.5",
      "vo": "The reward is checked by the computer, not an AI judge: right rows score one, wrong rows zero, and failed SQL minus a half.",
      "hl": null
    },
    "0004.png": {
      "hold": 3.4, "ring": { "x": 506, "y": 458, "w": 440, "h": 120 }, "ringFor": 3.0,
      "cap": "Base 7B 77.0%, gpt-4.1 73.5%: within noise",
      "vo": "On two hundred held-out questions, the base 7B already matched gpt-4.1.",
      "hl": null
    },
    "0005.png": {
      "scene": "sweep", "hold": 6.4, "voHold": 5.7, "capPos": "bottom",
      "cap": "One coordinator, four managed Devins",
      "vo": "After fine-tuning and GRPO, one coordinator starts four managed Devins, each with its own VM and Modal job.",
      "hl": null
    },
    "0006.png": {
      "hold": 3.2, "ring": { "x": 713, "y": 200, "w": 880, "h": 290 }, "ringFor": 2.8,
      "cap": "Four Devins, one GRPO variant each",
      "vo": "Each one tries a different learning rate, LoRA rank, generation count, or reward shaping.",
      "hl": null
    },
    "0007.png": {
      "hold": 3.4, "ring": { "x": 714, "y": 380, "w": 1322, "h": 82 }, "ringFor": 3.0,
      "cap": "Picked by validation: 82.0% on eval",
      "vo": "Devin promotes the winner by validation score: eighty-two percent on eval, within noise of the others.",
      "hl": null
    },
    "0008.png": {
      "hold": 3.2, "ring": { "x": 1009, "y": 391, "w": 676, "h": 160 }, "ringFor": 2.8,
      "cap": "Before: the app on gpt-4.1",
      "vo": "Then it deploys the winner with modal deploy, behind a feature flag, shown here on gpt-4.1.",
      "hl": null
    },
    "0010.png": {
      "hold": 3.2, "ring": { "x": 1009, "y": 391, "w": 676, "h": 160 }, "ringFor": 2.8,
      "cap": "After: our 7B on Modal",
      "vo": "With the flag flipped, the same question goes to our own model on Modal.",
      "hl": null
    },
    "0009.png": {
      "scene": "score", "hold": 7.4, "voHold": 15.0, "capPos": "bottom",
      "cap": "82.0% vs 73.5%; $49 vs $993 per 1M",
      "vo": "The tuned 7B beat gpt-4.1 by eight and a half points, though each training step's gain alone was within noise. On a warm H100 it cost forty-nine dollars per million queries to gpt-4.1's nine hundred ninety-three, before cold starts and idle time.",
      "hl": null
    }
  }
};
