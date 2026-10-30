window.SPEC = {
  "title": "Post-train a contract review model on Modal",
  "subtitle": "Devin trains an open model to find clauses and deploys it as a private endpoint",
  "outro": "Start with a script that scores the answer",
  "voOutro": "That's how you post-train a private model for your task: start with a script that scores the answer, and check the outputs, not just the reward. With that, Devin can train, compare and deploy it on Modal.",
  "tailHold": 0.3,
  "outroVoDelay": 0.6,
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.6,
  "pollRunMax": 0.8,
  "noZoom": [
    [
      "x_demo1.png"
    ],
    [
      "x_demo1b.png"
    ],
    [
      "x_rec1.png"
    ],
    [
      "x_rec2.png"
    ],
    [
      "x_demo2.png"
    ]
  ],
  "edit": {
    "x_demo1.png": {
      "cap": "Find clauses in contracts with an open model",
      "vo": "In this video, we'll have Devin post-train the open model Qwen3.8-27B on Modal to find clauses in contracts.",
      "hold": 3.0,
      "voSay": "In this video, we'll have Devin post-train the open model Qwen three point eight twenty-seven B on Modal to find clauses in contracts.",
      "cursor": false
    },
    "x_demo1b.png": {
      "cap": "gpt-6.1-sol: NOT PRESENT",
      "vo": "Here's the result. On the same contract, gpt-6.1-sol says the clause isn't there.",
      "hold": 3.0,
      "voSay": "Here's the result. On the same contract, GPT six point one sol says the clause isn't there.",
      "cursor": false
    },
    "x_demo2.png": {
      "cap": "Our model copies the whole clause",
      "vo": "Our trained model copies the whole clause, in under a second.",
      "hold": 3.0,
      "cursor": false
    },
    "0000.png": {
      "cap": "GPU jobs that run only while needed",
      "vo": "Modal runs each GPU job only while it's needed and bills by the second. It runs a sweep in parallel and serves the model as an endpoint that scales to zero. And because the model runs on your own GPU, the contracts never leave.",
      "hold": 3.0
    },
    "0007.png": {
      "cap": "Step 1: follow the Modal training playbook",
      "vo": "I start one session and ask Devin to follow our playbook for training a task model on Modal, this time for contract review. Devin checks the Modal login and saves the setup as a skill.",
      "hold": 3.0,
      "cursor": false
    },
    "0074.png": {
      "cap": "Step 2: the data and the grading rule",
      "vo": "Next, the data. CUAD is a public set of five hundred ten commercial contracts, with clauses labeled by lawyers. Devin splits it by contract, so no contract shows up in both training and test.",
      "hold": 3.0,
      "voSay": "Next, the data. C U A D is a public set of five hundred ten commercial contracts, with clauses labeled by lawyers. Devin splits it by contract, so no contract shows up in both training and test.",
      "cursor": false
    },
    "0084.png": {
      "cap": "638 test examples, half with the clause",
      "vo": "The test set has six hundred thirty-eight examples, half with the clause and half without. The grading rule gives partial credit for how much of the clause text matches, and one point for a correct not present. Made-up text costs half a point.",
      "hold": 3.0
    },
    "0129.png": {
      "cap": "Step 3: baseline, gpt-6.1-sol vs the base 27B",
      "vo": "Then the baseline: gpt-6.1-sol against the base model, with one shared prompt.",
      "hold": 3.0,
      "voSay": "Then the baseline: GPT six point one sol against the base model, with one shared prompt.",
      "cursor": false
    },
    "x_p3.png": {
      "cap": "A tie: 0.790 vs 0.782 mean F1",
      "vo": "It's a tie on mean F1, 0.790 against 0.782. But on clauses that really are there, the base model misses fifty-nine and gets only 0.59 of the text right. That's where training can help.",
      "hold": 3.0,
      "voSay": "It's a tie on mean F one, point seven nine zero against point seven eight two. But on clauses that really are there, the base model misses fifty-nine and gets only point five nine of the text right. That's where training can help."
    },
    "0543.png": {
      "cap": "Step 4: LoRA fine-tuning on a Modal H200",
      "vo": "Now supervised fine-tuning: a LoRA run on one Modal H200.",
      "hold": 3.0,
      "voSay": "Now supervised fine-tuning: a LoRA run on one Modal H two hundred.",
      "cursor": false
    },
    "1518.png": {
      "cap": "SFT: 0.867 mean F1, 209 exact clauses",
      "vo": "Thirty-eight minutes later, mean F1 is up to 0.867. Exact copies of the clause jump from fifty-four to two hundred nine, and the gain is significant against both models.",
      "hold": 3.0,
      "voSay": "Thirty-eight minutes later, mean F one is up to point eight six seven. Exact copies of the clause jump from fifty-four to two hundred nine, and the gain is significant against both models."
    },
    "1535.png": {
      "cap": "Step 5: GRPO on a B200, from the base model",
      "vo": "Next, reinforcement learning with GRPO on a B200, from the base model, with the grading script as the reward.",
      "hold": 3.0,
      "voSay": "Next, reinforcement learning with GRPO on a B two hundred, from the base model, with the grading script as the reward.",
      "cursor": false
    },
    "3087.png": {
      "cap": "Mean reward rises, then falls",
      "vo": "Here's an honest failure. The mean reward rises at first, then falls. The model learns to almost never say not present.",
      "hold": 3.0,
      "badge": "Sped up"
    },
    "3414.png": {
      "cap": "Reward hacking: 300 false alarms, F1 0.461",
      "vo": "So it misses nothing, but it raises three hundred false alarms, and mean F1 drops to 0.461. Devin spots the reward hacking, so the sweep starts from the fine-tuned model, with a penalty for drifting away from it.",
      "hold": 3.0,
      "voSay": "So it misses nothing, but it raises three hundred false alarms, and mean F one drops to point four six one. Devin spots the reward hacking, so the sweep starts from the fine-tuned model, with a penalty for drifting away from it.",
      "badge": ""
    },
    "3444.png": {
      "cap": "Step 6: four managed Devins, one variant each",
      "vo": "Now the sweep. Four managed Devins each train one variant: the learning rate, the LoRA rank, the samples per prompt, or a penalty for false alarms.",
      "hold": 3.0,
      "cursor": false
    },
    "3650.png": {
      "cap": "Each variant runs on its own GPU",
      "vo": "They all run in parallel, each on its own GPU, and they're scored only on a validation set held out from training.",
      "hold": 3.0,
      "badge": "Sped up"
    },
    "5240.png": {
      "cap": "No free B200s: three runs move to H200s",
      "vo": "Modal has no free B200s that day, so Devin moves the last three runs to two H200s each, with the same settings.",
      "hold": 3.0,
      "voSay": "Modal has no free B two hundreds that day, so Devin moves the last three runs to two H two hundreds each, with the same settings.",
      "badge": "Sped up"
    },
    "x_val.png": {
      "cap": "16 samples per prompt wins on validation",
      "vo": "Sixteen samples per prompt wins on validation, at 0.893. The margin over the next run is small, and Devin says so.",
      "hold": 3.0,
      "voSay": "Sixteen samples per prompt wins on validation, at point eight nine three. The margin over the next run is small, and Devin says so.",
      "badge": ""
    },
    "x_test.png": {
      "cap": "Test: 0.893 vs 0.867; misses 55 to 35",
      "vo": "Only then does it touch the test set: 0.893 mean F1, up from 0.867, and missed clauses fall from fifty-five to thirty-five.",
      "hold": 3.0,
      "voSay": "Only then does it touch the test set: point eight nine three mean F one, up from point eight six seven, and missed clauses fall from fifty-five to thirty-five."
    },
    "10276.png": {
      "cap": "Step 7: deploy and compare in the app",
      "vo": "Step seven: deploy it with modal deploy, behind an API key, scaling to zero when idle.",
      "hold": 3.0,
      "cursor": false
    },
    "x_p7.png": {
      "cap": "A real test contract the base model missed",
      "vo": "Devin adds a backend setting to the app and picks a real test contract where the base model missed the clause.",
      "hold": 3.0
    },
    "x_rec1.png": {
      "cap": "gpt-6.1-sol: NOT PRESENT",
      "vo": "On this BellRing Brands manufacturing contract, gpt-6.1-sol says the minimum commitment clause is not present.",
      "hold": 3.0,
      "voSay": "On this BellRing Brands manufacturing contract, GPT six point one sol says the minimum commitment clause is not present.",
      "cursor": false
    },
    "x_rec2.png": {
      "cap": "Our endpoint: the whole clause in 0.98 s",
      "vo": "Our endpoint returns the whole clause, word for word, in under a second, and the app highlights it in the passage.",
      "hold": 3.0,
      "cursor": false
    },
    "10403.png": {
      "cap": "Step 8: the final scorecard",
      "vo": "Last, the final scorecard on the six hundred thirty-eight test examples.",
      "hold": 3.0,
      "cursor": false
    },
    "x_score.png": {
      "cap": "0.893 vs 0.790 mean F1; 35 misses vs 50",
      "vo": "The deployed model reaches 0.893 mean F1, against 0.790 for gpt-6.1-sol, and misses thirty-five clauses instead of fifty. Eleven of twelve paired comparisons are significant after Holm correction. The one loss is clause text against the hacked GRPO model, which answers almost every row.",
      "hold": 3.0,
      "voSay": "The deployed model reaches point eight nine three mean F one, against point seven nine zero for GPT six point one sol, and misses thirty-five clauses instead of fifty. Eleven of twelve paired comparisons are significant after Holm correction. The one loss is clause text against the hacked GRPO model, which answers almost every row."
    },
    "10499.png": {
      "cap": "$134 vs $3,223 per 1M requests",
      "vo": "It answers in 0.68 seconds against 1.62, and costs about a hundred thirty-four dollars per million requests, against about three thousand two hundred. Devin spells out what that leaves out: cold starts, idle time, training and storage.",
      "hold": 3.0,
      "voSay": "It answers in point six eight seconds against one point six two, and costs about a hundred thirty-four dollars per million requests, against about three thousand two hundred. Devin spells out what that leaves out: cold starts, idle time, training and storage."
    }
  }
};
