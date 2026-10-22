window.SPEC = {
  "title": "Post-train a model on Modal",
  "subtitle": "Devin trains your own model and deploys it as an API endpoint",
  "outro": "Start with a script that scores the answer",
  "voOutro": "The big takeaway: start with a script that scores the answer. With that, Devin can train, compare, and deploy a model for your task, and the playbook lets you run it again on your own data.",
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
      "vo": "In this video, we'll have Devin post-train Qwen3.8-27B, an open model, on Modal, so it turns plain-English questions into SQL. Modal runs each GPU job only while it's needed and serves the finished model as an endpoint that scales to zero, so you pay for training and traffic, not for idle servers.",
      "hold": 3.0,
      "cursor": false,
      "voSay": "In this video, we'll have Devin post-train Qwen three point eight, twenty-seven B, an open model, on Modal, so it turns plain-English questions into sequel. Modal runs each GPU job only while it's needed and serves the finished model as an endpoint that scales to zero, so you pay for training and traffic, not for idle servers."
    },
    "0007.png": {
      "cap": "Step 1: set the folder up for Modal",
      "vo": "I start one session and ask Devin to set the folder up for Modal training, check that auth works, and save the setup as a skill. The repo already has a small demo app we added beforehand, which uses gpt-6.1-sol.",
      "hold": 3.2,
      "cursor": false,
      "voSay": "I start one session and ask Devin to set the folder up for Modal training, check that auth works, and save the setup as a skill. The repo already has a small demo app we added beforehand, which uses GPT six point one sol."
    },
    "0300.png": {
      "cap": "Auth checked; setup saved as a skill",
      "vo": "Devin verifies the Modal token, runs a small GPU job, and proposes the setup as a skill, so future sessions start ready.",
      "hold": 2.8
    },
    "0310.png": {
      "cap": "Step 2: BIRD splits and an executable reward",
      "vo": "Next, the data. BIRD is a hard public text-to-SQL benchmark with real databases, and I ask for a fixed-seed split and a reward script that runs the SQL.",
      "hold": 3.2,
      "cursor": false,
      "voSay": "Next, the data. BIRD is a hard public text-to-sequel benchmark with real databases, and I ask for a fixed-seed split and a reward script that runs the sequel."
    },
    "0389.png": {
      "cap": "1,034 train, 500 test; reward runs the SQL",
      "vo": "Devin builds one thousand thirty-four training questions and five hundred test questions. The reward runs both queries and compares the rows: one for a match, zero for a mismatch, and minus a half when the query fails.",
      "hold": 3.4
    },
    "0397.png": {
      "cap": "Step 3: baseline gpt-6.1-sol and the base 27B",
      "vo": "Then the baseline. Devin measures accuracy, latency and cost on the test split for gpt-6.1-sol and for the base model on a Modal H100.",
      "hold": 3.0,
      "cursor": false,
      "voSay": "Then the baseline. Devin measures accuracy, latency and cost on the test split for GPT six point one sol and for the base model on a Modal H one hundred."
    },
    "1059.png": {
      "cap": "Base 64.0% vs gpt-6.1-sol 63.8%: a tie",
      "vo": "Before any training, the base model scores sixty-four percent and gpt-6.1-sol sixty-three point eight. That's a tie, but our model answers faster and costs about a tenth as much.",
      "hold": 3.4,
      "voSay": "Before any training, the base model scores sixty-four percent and GPT six point one sol sixty-three point eight. That's a tie, but our model answers faster and costs about a tenth as much."
    },
    "1065.png": {
      "cap": "Step 4: LoRA fine-tuning on a Modal H200",
      "vo": "Now supervised fine-tuning: a LoRA run on one Modal H200, with checkpoints saved on a Modal volume.",
      "hold": 3.0,
      "cursor": false,
      "voSay": "Now supervised fine-tuning: a LoRA run on one Modal H two hundred, with checkpoints saved on a Modal volume."
    },
    "1709.png": {
      "cap": "SFT: 66.4%, not significant yet",
      "vo": "Training takes eighteen minutes and lifts the model to sixty-six point four percent, but that gain isn't statistically significant yet.",
      "hold": 3.2
    },
    "1777.png": {
      "cap": "Step 5: GRPO with the SQL reward",
      "vo": "Next comes reinforcement learning with GRPO on a B200. The reward script grades every answer the model tries by running it.",
      "hold": 3.0,
      "cursor": false,
      "voSay": "Next comes reinforcement learning with GRPO on a B two hundred. The reward script grades every answer the model tries by running it."
    },
    "1943.png": {
      "cap": "Smoke test passes; 250-step run launched",
      "vo": "A two-step smoke test passes, so Devin launches the full run of two hundred fifty steps.",
      "hold": 2.8
    },
    "2501.png": {
      "cap": "Crash at step 54: fixed and resumed",
      "vo": "At step fifty-four, the run crashes on a slow scoring query. Devin finds the cause, fixes the scoring, and resumes from the last checkpoint.",
      "hold": 3.0,
      "badge": "Sped up"
    },
    "4002.png": {
      "cap": "GRPO: 67.4% on the test set",
      "vo": "The trained model reaches sixty-seven point four percent. Against the base model, that's suggestive but not conclusive.",
      "hold": 3.2
    },
    "4008.png": {
      "cap": "Step 6: four managed Devins, one variant each",
      "vo": "Now the sweep. I ask for four managed Devins, each training one variant, and Devin holds out a validation set so the test set stays untouched.",
      "hold": 3.2,
      "cursor": false
    },
    "4013.png": {
      "cap": "Four variants, 150 steps each on a B200",
      "vo": "The variants change the learning rate, the LoRA rank, the number of samples per question, or the reward itself.",
      "hold": 3.0
    },
    "4565.png": {
      "cap": "Base model: 62.7% on validation",
      "vo": "While they train, Devin scores the untrained model on validation as a reference.",
      "hold": 2.8
    },
    "5982.png": {
      "cap": "No variant beat the base on validation",
      "vo": "None of the four beats the base model on validation. The rank sixty-four variant wins the pick by one question and scores sixty-nine point four on test, but it now writes reasoning first, at about three times the cost.",
      "hold": 3.6
    },
    "5988.png": {
      "cap": "Step 7: deploy the 250-step model",
      "vo": "So I ask Devin to deploy the earlier reinforcement learning model with modal deploy, as an endpoint that scales to zero, and show it in the demo app.",
      "hold": 3.2,
      "cursor": false
    },
    "6051.png": {
      "cap": "The app, with gpt-6.1-sol and with our endpoint",
      "vo": "Devin adds a backend setting to the app and runs it twice, once with gpt-6.1-sol and once with our endpoint.",
      "hold": 2.8,
      "voSay": "Devin adds a backend setting to the app and runs it twice, once with GPT six point one sol and once with our endpoint."
    },
    "6134.png": {
      "cap": "Same question, same answer from both",
      "vo": "In the browser, both return the same average lap time for Lewis Hamilton, and our endpoint answers a little faster.",
      "hold": 3.2
    },
    "6140.png": {
      "cap": "Step 8: the final scorecard",
      "vo": "Step eight is the final scorecard on the five hundred test questions, with significance tests.",
      "hold": 3.0,
      "cursor": false
    },
    "6159.png": {
      "cap": "67.4% vs 63.8%; $283 vs $2,546 per 1M",
      "vo": "The deployed model scores sixty-seven point four percent, against sixty-three point eight for gpt-6.1-sol. That gap isn't statistically significant, but it costs about two hundred eighty dollars per million queries, against about twenty-five hundred.",
      "hold": 3.6,
      "voSay": "The deployed model scores sixty-seven point four percent, against sixty-three point eight for GPT six point one sol. That gap isn't statistically significant, but it costs about two hundred eighty dollars per million queries, against about twenty-five hundred."
    },
    "6161.png": {
      "cap": "Costs leave out cold starts and idle time",
      "vo": "Devin also spells out what that cost leaves out: cold starts, idle time, and the training itself.",
      "hold": 3.2
    },
    "6165.png": {
      "cursor": false,
      "cap": "Step 9: save it as a playbook",
      "vo": "Last, I ask Devin to save the whole recipe as a playbook.",
      "hold": 2.8
    },
    "6180.png": {
      "cap": "Playbook saved: Post-train a task model on Modal",
      "vo": "Devin writes it up with the steps, the fixes it needed along the way, and what not to do, so the next model on new data is one request.",
      "hold": 3.4
    }
  }
};
