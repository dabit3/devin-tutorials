window.SPEC = {
  "title": "Train a tariff-code model on Modal",
  "subtitle": "Devin post-trains an open model and deploys it as an endpoint",
  "outro": "Grade the answer, then train",
  "voOutro": "That's how you post-train an open model for your own task: grade the answer with a script, compare against a frontier model, and let Devin train, sweep, deploy, and report honestly where it lands.",
  "tailHold": 0.3,
  "outroVoDelay": 0.6,
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.6,
  "pollRunMax": 0.8,
  "noZoom": [
    [
      "0000.png",
      "0001.png"
    ]
  ],
  "edit": {
    "0000.png": {
      "vo": "In this video, we'll have Devin post-train Qwen3.8-27B, an open model, on Modal, so it reads a product description from an invoice and returns its H-S tariff code.",
      "hold": 3.0,
      "cursor": false,
      "voSay": "In this video, we'll have Devin post-train Qwen three point eight twenty-seven B, an open model on Modal, so it reads a product description from an invoice and returns its H-S tariff code."
    },
    "0001.png": {
      "vo": "Modal runs each GPU job only while it's needed and bills by the second, so Devin can run a whole sweep in parallel and serve the finished model as an endpoint that scales to zero.",
      "hold": 3.0
    },
    "0002.png": {
      "vo": "Importers and customs brokers classify thousands of products, and a wrong code means paying the wrong duty.",
      "cursor": true,
      "hold": 2.0
    },
    "0009.png": {
      "vo": "I start one session and ask Devin to follow our saved playbook for post-training on Modal, so this new task reuses the same recipe."
    },
    "0016.png": {
      "vo": "First, Devin sets up the folder, checks the Modal login, and saves the setup as a skill."
    },
    "0025.png": {
      "vo": "Step two is the data: public U.S. Customs rulings, each a product description with its official code."
    },
    "0030.png": {
      "vo": "The grading rule gives full credit for the exact six-digit code, half for the right four-digit heading, a quarter for the right chapter, and a penalty when there's no valid code."
    },
    "0037.png": {
      "vo": "Devin cleans the rulings down to 13,555 and sets aside 1,000 for the final test.",
      "hold": 2.0,
      "voSay": "Devin cleans the rulings down to thirteen thousand five hundred fifty-five and sets aside one thousand for the final test.",
      "badge": ""
    },
    "0040.png": {
      "vo": "Step three is the baseline. Both models get the same short prompt, with no examples."
    },
    "0056.png": {
      "vo": "gpt-6.1-sol gets 63% of codes exactly right. The base open model gets only 19%.",
      "hold": 2.0,
      "voSay": "GPT six point one sol gets sixty-three percent of codes exactly right. The base open model gets only nineteen percent.",
      "badge": ""
    },
    "0059.png": {
      "vo": "Step four is supervised fine-tuning with LoRA on one H200 GPU.",
      "voSay": "Step four is supervised fine-tuning with Laura on one H two hundred GPU."
    },
    "0063.png": {
      "vo": "Devin launches the job on Modal, watches the logs, and scores the result. Training takes about seventeen minutes."
    },
    "0077.png": {
      "vo": "Fine-tuning lifts exact accuracy from 19% to 56%, but gpt-6.1-sol is still ahead.",
      "hold": 2.0,
      "voSay": "Fine-tuning lifts exact accuracy from nineteen to fifty-six percent, but GPT six point one sol is still ahead.",
      "badge": ""
    },
    "0080.png": {
      "vo": "Step five is reinforcement learning with GRPO on a B200, starting from the base model and scored by the grading rule.",
      "voSay": "Step five is reinforcement learning with G R P O on a B two hundred, starting from the base model and scored by the grading rule."
    },
    "0099.png": {
      "vo": "Partway through, Devin spots a problem. The reward only checked the first code, so the model learned to keep writing until it hit the length limit.",
      "hold": 2.0,
      "badge": ""
    },
    "0100.png": {
      "vo": "On the test set, exact accuracy falls to 13.7%. Devin explains why and suggests three fixes.",
      "hold": 2.0,
      "voSay": "On the test set, exact accuracy falls to thirteen point seven percent. Devin explains why and suggests three fixes."
    },
    "0103.png": {
      "vo": "I ask for all three: start from the fine-tuned model, penalize anything after the code, and use more prompts per step."
    },
    "0121.png": {
      "vo": "The fixed run reaches 58.2%, and no answer runs to the limit. The gain over fine-tuning alone is borderline.",
      "hold": 2.0,
      "voSay": "The fixed run reaches fifty-eight point two percent, and no answer runs to the limit. The gain over fine-tuning alone is borderline.",
      "badge": ""
    },
    "0124.png": {
      "vo": "Step six is a sweep. Four managed Devins each train one variant in parallel: learning rate, LoRA rank, generations per prompt, and reward shaping.",
      "voSay": "Step six is a sweep. Four managed Devins each train one variant in parallel: learning rate, Laura rank, generations per prompt, and reward shaping."
    },
    "0128.png": {
      "vo": "Each variant is scored on 500 examples held out from training, so the test set stays untouched.",
      "voSay": "Each variant is scored on five hundred examples held out from training, so the test set stays untouched."
    },
    "0145.png": {
      "vo": "No variant clearly beats the fine-tuned reference. A higher learning rate or a larger rank makes it worse, and reward shaping wins by a single example, so Devin promotes it.",
      "hold": 2.0,
      "badge": ""
    },
    "0146.png": {
      "vo": "On the test set, the promoted model scores 56.9%.",
      "hold": 2.0,
      "voSay": "On the test set, the promoted model scores fifty-six point nine percent."
    },
    "0149.png": {
      "vo": "Step seven deploys that model as an endpoint behind an API key that scales to zero, and adds a backend setting to the demo app.",
      "voSay": "Step seven deploys that model as an endpoint behind an A P I key that scales to zero, and adds a backend setting to the demo app."
    },
    "0167.png": {
      "vo": "Devin opens the app with gpt-6.1-sol and classifies a men's acrylic knit pullover.",
      "hold": 1.6,
      "voSay": "Devin opens the app with GPT six point one sol and classifies a men's acrylic knit pullover."
    },
    "0168.png": {
      "vo": "It returns 6110.30: knitted sweaters of man-made fibres.",
      "hold": 2.0,
      "voSay": "It returns sixty-one ten point thirty: knitted sweaters of man-made fibres."
    },
    "0170.png": {
      "vo": "Now the same product through our endpoint.",
      "hold": 1.4
    },
    "0171.png": {
      "vo": "Same code, in about half a second instead of two. The base model had picked 6110.20, the line for cotton.",
      "hold": 2.0,
      "voSay": "Same code, in about half a second instead of two. The base model had picked sixty-one ten point twenty, the line for cotton."
    },
    "0174.png": {
      "vo": "Step eight is the final scorecard on the 1,000 test examples, with significance tests.",
      "voSay": "Step eight is the final scorecard on the one thousand test examples, with significance tests."
    },
    "0187.png": {
      "vo": "Training closes most of the gap, from 19% to 57%. gpt-6.1-sol stays about six points ahead, and that difference is significant.",
      "hold": 2.0,
      "voSay": "Training closes most of the gap, from nineteen percent to fifty-seven. GPT six point one sol stays about six points ahead, and that difference is significant.",
      "badge": ""
    },
    "0188.png": {
      "vo": "But at 128 requests in flight, our model costs about $14 per million requests, against about $1,367 for gpt-6.1-sol, and it answers about five times faster.",
      "hold": 2.0,
      "voSay": "But at a hundred twenty-eight requests in flight, our model costs about fourteen dollars per million requests, against about thirteen hundred sixty-seven dollars for GPT six point one sol, and it answers about five times faster."
    },
    "0189.png": {
      "vo": "The cost leaves out cold starts, idle time, training, and storage, and the differences against the other trained models aren't significant.",
      "hold": 2.0
    },
    "0012.png": {
      "badge": "Sped up"
    },
    "0023.png": {
      "badge": ""
    },
    "0028.png": {
      "badge": "Sped up"
    },
    "0043.png": {
      "badge": "Sped up"
    },
    "0062.png": {
      "badge": "Sped up"
    },
    "0083.png": {
      "badge": "Sped up"
    },
    "0106.png": {
      "badge": "Sped up"
    },
    "0127.png": {
      "badge": "Sped up"
    },
    "0152.png": {
      "badge": "Sped up"
    },
    "0166.png": {
      "badge": ""
    },
    "0177.png": {
      "badge": "Sped up"
    }
  }
};
