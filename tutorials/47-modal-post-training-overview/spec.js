window.SPEC = {
  "title": "Post-training on Modal",
  "subtitle": "How Devin trains and deploys your own model",
  "outro": "Start with a script that scores the answer",
  "voOutro": "That's how Devin trains and deploys your own model on Modal. Everything starts with a script that scores the answer. A playbook lets you run the same steps on your own data.",
  "tailHold": 0.3,
  "outroVoDelay": 0.6,
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.6,
  "edit": {
    "0000.png": {
      "scene": "value",
      "hold": 9.6,
      "voHold": 9.4,
      "cursor": false,
      "capPos": "bottom",
      "cap": "Your own model, served as an API endpoint",
      "vo": "In this video, Devin trains an open model on Modal and deploys it as an API. Then we compare it with OpenAI's GPT model. Our example turns plain-English questions into SQL. The same steps work for any task where a script can score the answer.",
      "hl": null,
      "voSay": "In this video, Devin trains an open model on Modal and deploys it as an API. Then we compare it with OpenAI's GPT model. Our example turns plain-English questions into sequel. The same steps work for any task where a script can score the answer."
    },
    "0001.png": {
      "scene": "steps",
      "hold": 6.6,
      "voHold": 3.6,
      "capPos": "bottom",
      "cap": "Dataset, baseline, SFT, RL, sweep, eval, deploy",
      "vo": "Devin runs each step an ML engineer would, from the dataset to the deploy. Each step lands as a pull request. Modal provides GPUs on demand and hosts the finished model. You pay only while it runs.",
      "hl": null
    },
    "0002.png": {
      "hold": 3.2,
      "cap": "BIRD splits and a reward that runs the SQL",
      "vo": "First, I ask for training and test splits from BIRD, a public set of hard SQL questions. I also ask for a reward that runs the SQL.",
      "hl": null,
      "voSay": "First, I ask for training and test splits from BIRD, a public set of hard sequel questions. I also ask for a reward that runs the sequel."
    },
    "0003.png": {
      "scene": "reward",
      "hold": 6.4,
      "voHold": 6.4,
      "capPos": "bottom",
      "cap": "Match 1, wrong rows 0, fails to run -0.5",
      "vo": "The reward runs the SQL instead of asking an AI judge. Correct rows score one, and wrong rows score zero. SQL that fails to run scores minus a half.",
      "hl": null,
      "voSay": "The reward runs the sequel instead of asking an AI judge. Correct rows score one, and wrong rows score zero. sequel that fails to run scores minus a half."
    },
    "0004.png": {
      "hold": 3.4,
      "cap": "Base 27B 64.0%, gpt-6.1-sol 63.8%: about even",
      "vo": "Before training, the base model already matched the GPT model on five hundred test questions.",
      "hl": null
    },
    "0005.png": {
      "scene": "sweep",
      "hold": 6.4,
      "voHold": 5.7,
      "capPos": "bottom",
      "cap": "One coordinator, four managed Devins",
      "vo": "Next, Devin fine-tunes the model and runs reinforcement learning with that reward. Then it starts four managed Devins. Each one has its own machine and its own Modal job.",
      "hl": null
    },
    "0006.png": {
      "hold": 3.2,
      "cap": "Four Devins, one GRPO variant each",
      "vo": "Each one tries a different learning rate, LoRA rank, number of answers per question, or reward.",
      "hl": null
    },
    "0007.png": {
      "hold": 3.4,
      "cap": "No variant beat the base model on validation",
      "vo": "Devin picks the winner by validation score. None of the four beat the base model there. The winner's test gain came from long reasoning, at three times the cost. So we deploy the earlier reinforcement learning model.",
      "hl": null
    },
    "0008.png": {
      "hold": 3.2,
      "ring": {
        "x": 720,
        "y": 372,
        "w": 640,
        "h": 270
      },
      "ringFor": 2.8,
      "cap": "The demo app with gpt-6.1-sol",
      "vo": "Devin deploys our trained model with modal deploy, as an OpenAI-compatible API endpoint. Here, the demo app answers a question with the GPT model first.",
      "hl": null
    },
    "0010.png": {
      "hold": 3.2,
      "ring": {
        "x": 720,
        "y": 372,
        "w": 640,
        "h": 270
      },
      "ringFor": 2.8,
      "cap": "Same question, our 27B on Modal",
      "vo": "Here is the same question, answered by our model's endpoint on Modal. It returns the same rows.",
      "hl": null
    },
    "0009.png": {
      "scene": "score",
      "hold": 7.4,
      "voHold": 15.0,
      "capPos": "bottom",
      "cap": "67.4% vs 63.8%; $283 vs $2,546 per 1M",
      "vo": "The trained model scored sixty-seven point four percent. The GPT model scored sixty-three point eight. That gap could still be chance. Our model answers faster. On an H100 that is already running, it costs about two hundred eighty dollars per million queries. The GPT model costs about twenty-five hundred. Those numbers leave out cold starts and idle time.",
      "hl": null,
      "voSay": "The trained model scored sixty-seven point four percent. The GPT model scored sixty-three point eight. That gap could still be chance. Our model answers faster. On an H one hundred that is already running, it costs about two hundred eighty dollars per million queries. The GPT model costs about twenty-five hundred. Those numbers leave out cold starts and idle time."
    },
    "0011.png": {
      "scene": "recap",
      "hold": 6.0,
      "voHold": 9.0,
      "capPos": "bottom",
      "cap": "Reward script, baseline, train and sweep, deploy",
      "vo": "To recap, we gave Devin a script that scores answers and a baseline to beat. Devin trained the model and compared four variants in parallel. Then it deployed the earlier reinforcement learning model as an endpoint.",
      "hl": null
    }
  }
};
