window.SPEC = {
  "title": "Post-training on Modal",
  "subtitle": "How Devin trains and deploys your own model",
  "outro": "Start with a script that scores the answer",
  "voOutro": "The big takeaway: start with a script that scores the answer. With that, Devin can train, compare, and deploy a model for your task, and a playbook lets you run it again on your own data.",
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
      "vo": "In this video, we'll have Devin post-train Qwen3.8-27B, an open model, on Modal, check it against gpt-6.1-sol, and deploy it as an API endpoint our app can call. Our example is text-to-SQL, but the same steps work for any task where a script can score the answer.",
      "hl": null,
      "voSay": "In this video, we'll have Devin post-train Qwen three point eight twenty-seven B, an open model on Modal, check it against GPT six point one sol, and deploy it as an API endpoint our app can call. Our example is text-to-sequel, but the same steps work for any task where a script can score the answer."
    },
    "0001.png": {
      "scene": "steps",
      "hold": 6.6,
      "voHold": 3.6,
      "capPos": "bottom",
      "cap": "Dataset, baseline, SFT, RL, sweep, eval, deploy",
      "vo": "Devin runs every step an ML engineer would, from dataset to deploy, and each step lands as a pull request. Modal provides the GPUs on demand and hosts the finished model, so you only pay while it runs.",
      "hl": null
    },
    "0002.png": {
      "hold": 3.2,
      "cap": "BIRD splits and a reward that runs the SQL",
      "vo": "First, I ask for training and test splits from BIRD, a hard public text-to-SQL benchmark, and a reward that runs the SQL.",
      "hl": null,
      "voSay": "First, I ask for training and test splits from BIRD, a hard public text-to-sequel benchmark, and a reward that runs the sequel."
    },
    "0003.png": {
      "scene": "reward",
      "hold": 6.4,
      "voHold": 6.4,
      "capPos": "bottom",
      "cap": "Match 1, wrong rows 0, fails to run -0.5",
      "vo": "The reward runs the SQL instead of asking an AI judge. Right rows score one, wrong rows score zero, and SQL that fails to run scores minus a half.",
      "hl": null,
      "voSay": "The reward runs the sequel instead of asking an AI judge. Right rows score one, wrong rows score zero, and sequel that fails to run scores minus a half."
    },
    "0004.png": {
      "hold": 3.4,
      "cap": "Base 27B 64.0%, gpt-6.1-sol 63.8%: about even",
      "vo": "Before any training, the base model already matched gpt-6.1-sol on five hundred held-out questions.",
      "hl": null,
      "voSay": "Before any training, the base model already matched GPT six point one sol on five hundred held-out questions."
    },
    "0005.png": {
      "scene": "sweep",
      "hold": 6.4,
      "voHold": 5.7,
      "capPos": "bottom",
      "cap": "One coordinator, four managed Devins",
      "vo": "Next, Devin fine-tunes the model and runs reinforcement learning with that reward. Then it starts four managed Devins, each with its own VM and Modal job.",
      "hl": null
    },
    "0006.png": {
      "hold": 3.2,
      "cap": "Four Devins, one GRPO variant each",
      "vo": "Each one tries a different learning rate, LoRA rank, generation count, or reward shaping.",
      "hl": null
    },
    "0007.png": {
      "hold": 3.4,
      "cap": "No variant beat the base model on validation",
      "vo": "Devin picks the winner by validation score. None of the four beat the base model there, and the winner's test gain came from long reasoning at three times the cost, so we deploy the earlier reinforcement learning model.",
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
      "vo": "Then Devin deploys our trained model with modal deploy, as an OpenAI-compatible API endpoint. Here's the demo app answering a question with gpt-6.1-sol first.",
      "hl": null,
      "voSay": "Then Devin deploys our trained model with modal deploy, as an OpenAI-compatible API endpoint. Here's the demo app answering a question with GPT six point one sol first."
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
      "vo": "And here's the same question answered by our model's endpoint on Modal, with the same rows back.",
      "hl": null
    },
    "0009.png": {
      "scene": "score",
      "hold": 7.4,
      "voHold": 15.0,
      "capPos": "bottom",
      "cap": "67.4% vs 63.8%; $283 vs $2,546 per 1M",
      "vo": "The trained model scored sixty-seven point four percent, against sixty-three point eight for gpt-6.1-sol. That gap isn't statistically significant, but it answers faster, and on a warm H100 it costs about two hundred eighty dollars per million queries, against about twenty-five hundred for gpt-6.1-sol, before cold starts and idle time.",
      "hl": null,
      "voSay": "The trained model scored sixty-seven point four percent, against sixty-three point eight for GPT six point one sol. That gap isn't statistically significant, but it answers faster, and on a warm H one hundred it costs about two hundred eighty dollars per million queries, against about twenty-five hundred for GPT six point one sol, before cold starts and idle time."
    },
    "0011.png": {
      "scene": "recap",
      "hold": 6.0,
      "voHold": 9.0,
      "capPos": "bottom",
      "cap": "Reward script, baseline, train and sweep, deploy",
      "vo": "To recap, we gave Devin a script that scores answers and a baseline to beat. It trained the model, compared four variants in parallel, and deployed the model that held up as an endpoint.",
      "hl": null
    }
  }
};
