window.SPEC = {
  "title": "Post-train a model on Modal",
  "subtitle": "Devin trains your own model and deploys it as an API endpoint",
  "outro": "Start with a script that scores the answer",
  "voOutro": "That's how Devin trains and deploys your own model on Modal. Everything starts with a script that scores the answer. The playbook lets you run the same steps on your own data.",
  "tailHold": 0.3,
  "outroVoDelay": 0.6,
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.6,
  "pollRunMax": 0.8,
  "noZoom": [
    [
      "0000.png"
    ]
  ],
  "edit": {
    "0000.png": {
      "cap": "Post-train an open model on Modal",
      "vo": "In this video, Devin trains an open model on Modal to write SQL from plain-English questions. The model is Qwen, with twenty-seven billion parameters. Modal starts a GPU for each job and stops it when the job ends. The finished model runs as an endpoint that scales to zero, so idle time costs nothing.",
      "hold": 3.0,
      "cursor": false,
      "voSay": "In this video, Devin trains an open model on Modal to write sequel from plain-English questions. The model is Qwen, with twenty-seven billion parameters. Modal starts a GPU for each job and stops it when the job ends. The finished model runs as an endpoint that scales to zero, so idle time costs nothing."
    },
    "0007.png": {
      "cap": "Step 1: set the folder up for Modal",
      "vo": "I start a session and ask Devin to set up the folder for Modal training. I also ask it to check the Modal login and save the setup as a skill. We added a small demo app to the repo beforehand. It uses OpenAI's GPT model.",
      "hold": 3.2,
      "cursor": false
    },
    "0300.png": {
      "cap": "Auth checked; setup saved as a skill",
      "vo": "Devin checks the Modal token and runs a small GPU job. Then it suggests a skill with the setup, so future sessions start ready.",
      "hold": 2.8
    },
    "0389.png": {
      "cap": "1,034 train, 500 test; reward runs the SQL",
      "vo": "Devin makes one thousand thirty-four training questions and five hundred test questions. The reward script runs the model's query and the correct query, then compares the rows. A match scores one, and a mismatch scores zero. A query that fails to run scores minus a half.",
      "hold": 3.4
    },
    "0397.png": {
      "cap": "Step 3: baseline gpt-6.1-sol and the base 27B",
      "vo": "Then comes the baseline. Devin measures accuracy, speed, and cost on the test questions. On a Modal H100, it tests the untrained Qwen model and the GPT model.",
      "hold": 3.0,
      "cursor": false,
      "voSay": "Then comes the baseline. Devin measures accuracy, speed, and cost on the test questions. On a Modal H one hundred, it tests the untrained Qwen model and the GPT model."
    },
    "1059.png": {
      "cap": "Base 64.0% vs gpt-6.1-sol 63.8%: a tie",
      "vo": "Before training, the Qwen model scores sixty-four percent, and the GPT model scores sixty-three point eight. That is a tie. Our model answers faster and costs about a tenth as much.",
      "hold": 3.4
    },
    "1065.png": {
      "cap": "Step 4: LoRA fine-tuning on a Modal H200",
      "vo": "Now Devin fine-tunes the model on the training questions and their answers. The run uses LoRA on one Modal H200. Checkpoints save to a Modal volume.",
      "hold": 3.0,
      "cursor": false,
      "voSay": "Now Devin fine-tunes the model on the training questions and their answers. The run uses LoRA on one Modal H two hundred. Checkpoints save to a Modal volume."
    },
    "1709.png": {
      "cap": "SFT: 66.4%, not significant yet",
      "vo": "Training takes eighteen minutes. The model reaches sixty-six point four percent. That gain is still small enough to be chance.",
      "hold": 3.2
    },
    "1777.png": {
      "cap": "Step 5: GRPO with the SQL reward",
      "vo": "Next, Devin runs reinforcement learning with GRPO on a B200. The model tries several answers to each question. The reward script runs each answer and scores it.",
      "hold": 3.0,
      "cursor": false,
      "voSay": "Next, Devin runs reinforcement learning with GRPO on a B two hundred. The model tries several answers to each question. The reward script runs each answer and scores it."
    },
    "1943.png": {
      "cap": "Smoke test passes; 250-step run launched",
      "vo": "A short two-step test run passes. Devin then starts the full run of two hundred fifty steps.",
      "hold": 2.8
    },
    "2501.png": {
      "cap": "Crash at step 54: fixed and resumed",
      "vo": "At step fifty-four, the run crashes on a slow scoring query. Devin finds the cause and fixes the scoring. Then it restarts from the last checkpoint.",
      "hold": 3.0,
      "badge": "Sped up"
    },
    "4002.png": {
      "cap": "GRPO: 67.4% on the test set",
      "vo": "The trained model reaches sixty-seven point four percent. The gain over the base model looks likely, but the test cannot confirm it.",
      "hold": 3.2
    },
    "4008.png": {
      "cap": "Step 6: four managed Devins, one variant each",
      "vo": "Now comes the sweep. I ask for four managed Devins, and each one trains one variant. Each managed Devin is its own session with its own machine. Devin holds back a validation set, so the test set stays untouched.",
      "hold": 3.2,
      "cursor": false
    },
    "4013.png": {
      "cap": "Four variants, 150 steps each on a B200",
      "vo": "The variants change the learning rate, the LoRA rank, the answers per question, or the reward.",
      "hold": 3.0
    },
    "4565.png": {
      "cap": "Base model: 62.7% on validation",
      "vo": "While they train, Devin scores the untrained model on the validation set. That score is the reference.",
      "hold": 2.8
    },
    "5982.png": {
      "cap": "No variant beat the base on validation",
      "vo": "None of the four beats the base model on validation. The rank sixty-four variant wins by one question. It scores sixty-nine point four percent on test. But it now writes its reasoning first, at about three times the cost.",
      "hold": 3.6
    },
    "5988.png": {
      "cap": "Step 7: deploy the 250-step model",
      "vo": "So I ask Devin to deploy the earlier reinforcement learning model instead. It uses modal deploy to make an endpoint that scales to zero. I also ask Devin to show it in the demo app.",
      "hold": 3.2,
      "cursor": false
    },
    "6051.png": {
      "cap": "The app, with gpt-6.1-sol and with our endpoint",
      "vo": "Devin adds a setting to choose the app's backend. Then it runs the app twice, once with the GPT model and once with our endpoint.",
      "hold": 2.8
    },
    "6134.png": {
      "cap": "Same question, same answer from both",
      "vo": "In the browser, both return the same average lap time for Lewis Hamilton. Our endpoint answers a little faster.",
      "hold": 3.2
    },
    "6140.png": {
      "cap": "Step 8: the final scorecard",
      "vo": "Step eight is the final scorecard on the five hundred test questions. It includes significance tests.",
      "hold": 3.0,
      "cursor": false
    },
    "6159.png": {
      "cap": "67.4% vs 63.8%; $283 vs $2,546 per 1M",
      "vo": "The deployed model scores sixty-seven point four percent. The GPT model scores sixty-three point eight. That gap could still be chance. Our model costs about two hundred eighty dollars per million queries. The GPT model costs about twenty-five hundred.",
      "hold": 3.6
    },
    "6161.png": {
      "cap": "Costs leave out cold starts and idle time",
      "vo": "Devin also lists what that cost leaves out. It does not include cold starts, idle time, or the training itself.",
      "hold": 3.2
    },
    "6165.png": {
      "cursor": false,
      "cap": "Step 9: save it as a playbook",
      "vo": "Last, I ask Devin to save the whole process as a playbook.",
      "hold": 2.8
    },
    "6180.png": {
      "cap": "Playbook saved: Post-train a task model on Modal",
      "vo": "Devin writes down the steps, the fixes it needed, and what to avoid. With the playbook, the next model on new data takes one request.",
      "hold": 3.4
    },
    "0321.png": {
      "cap": "Step 2: BIRD splits and an executable reward",
      "vo": "Next comes the data. BIRD is a public set of hard SQL questions with their databases. I ask Devin to split it with a fixed seed. I also ask for a reward script that runs the SQL.",
      "hold": 3.2,
      "cursor": false,
      "voSay": "Next comes the data. BIRD is a public set of hard sequel questions with their databases. I ask Devin to split it with a fixed seed. I also ask for a reward script that runs the sequel."
    },
    "0032.png": {
      "skip": true
    },
    "0255.png": {
      "skip": true
    },
    "0277.png": {
      "skip": true
    },
    "0310.png": {
      "skip": true
    },
    "0311.png": {
      "skip": true
    },
    "0312.png": {
      "skip": true
    }
  }
};
