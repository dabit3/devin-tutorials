window.SPEC = {
  "title": "Train a receipt-extraction model on Modal",
  "subtitle": "Devin fine-tunes an open model, tests it against gpt-6.1-sol, and deploys it",
  "outro": "Grade every field, then fine-tune",
  "voOutro": "That's how you post-train an open model on Modal: grade every field, fine-tune on labeled receipts, and test each gain for significance before you deploy.",
  "tailHold": 0.3,
  "outroVoDelay": 0.6,
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.6,
  "pollRunMax": 0.8,
  "noZoom": [
    [
      "0031.png",
      "3151.png"
    ]
  ],
  "edit": {
    "d3152.png": {
      "cap": "Train a receipt model on Modal",
      "vo": "In this video, we'll have Devin post-train Qwen3.8-27B, an open model on Modal, so it turns the text of scanned receipts into clean JSON for accounts payable. Modal runs each GPU job only while it's needed and bills by the second, runs a sweep of jobs side by side, and serves the finished model as an endpoint that scales to zero when nobody calls it.",
      "hold": 3.0,
      "cursor": false,
      "cam": {
        "x": 900,
        "y": 330,
        "z": 1.5
      },
      "camDur": 6.0,
      "voSay": "In this video, we'll have Devin post-train Qwen three point eight twenty-seven B, an open model on Modal, so it turns the text of scanned receipts into clean JSON for accounts payable. Modal runs each GPU job only while it's needed and bills by the second, runs a sweep of jobs side by side, and serves the finished model as an endpoint that scales to zero when nobody calls it."
    },
    "r0000.png": {
      "cap": "Step 1: set the folder up for Modal",
      "vo": "I start one session and ask Devin to follow our saved playbook for a new task: set the folder up for Modal, check auth, and save the setup as a skill.",
      "hold": 3.2,
      "cursor": false,
      "cam": "reset"
    },
    "0062.png": {
      "hold": 2.4
    },
    "0072.png": {
      "cap": "Step 2: 1,126 train and 500 test receipts",
      "vo": "Next, the data: two public receipt sets, Malaysian store receipts and Indonesian restaurant receipts with line items. Five hundred are held out for the test.",
      "hold": 3.2,
      "cursor": false
    },
    "0159.png": {
      "cap": "Graded field by field; 39.000 means 39000",
      "vo": "The grading rule checks each field after cleanup, checks that line items add up, and takes half a point off for broken JSON. Note that Indonesian prices use a dot for thousands: thirty-nine dot zero zero zero means thirty-nine thousand.",
      "hold": 3.4
    },
    "0162.png": {
      "cap": "Step 3: gpt-6.1-sol vs the base 27B",
      "vo": "Then the baseline: gpt-6.1-sol and the untrained model on a Modal H100, with the same prompt.",
      "hold": 3.0,
      "cursor": false,
      "voSay": "Then the baseline: GPT six point one sol and the untrained model on a Modal H one hundred, with the same prompt."
    },
    "r0005.png": {
      "cap": "Whole receipt right: 62.4% vs 47.4%",
      "vo": "gpt-6.1-sol gets sixty-two point four percent of receipts exactly right, and eighty-eight point eight percent of fields. The base model gets forty-seven point four and seventy-five point six.",
      "hold": 3.4,
      "voSay": "GPT six point one sol gets sixty-two point four percent of receipts exactly right, and eighty-eight point eight percent of fields. The base model gets forty-seven point four and seventy-five point six."
    },
    "0287.png": {
      "cap": "Before training: Rp 43.636 read as 43.636",
      "vo": "Here's why. A total of forty-three thousand six hundred thirty-six rupiah is printed with a dot, and the base model reads it as forty-three point six. That happens on sixty-six Indonesian receipts.",
      "hold": 3.4
    },
    "0293.png": {
      "cap": "Step 4: LoRA fine-tuning on a Modal H200",
      "vo": "Step four is supervised fine-tuning: a LoRA run on one Modal H200, with checkpoints saved on a Modal volume.",
      "hold": 3.0,
      "cursor": false,
      "voSay": "Step four is supervised fine-tuning: a LoRA run on one Modal H two hundred, with checkpoints saved on a Modal volume."
    },
    "0294.png": {
      "badge": "Sped up"
    },
    "r0006.png": {
      "cap": "SFT: 72.6% vs 62.4% for gpt-6.1-sol",
      "vo": "Ten minutes of training later, the model gets seventy-two point six percent of receipts exactly right, against sixty-two point four for gpt-6.1-sol. That gap is statistically significant.",
      "hold": 3.4,
      "badge": "",
      "voSay": "Ten minutes of training later, the model gets seventy-two point six percent of receipts exactly right, against sixty-two point four for GPT six point one sol. That gap is statistically significant."
    },
    "0619.png": {
      "cap": "After training: no total off by 1,000",
      "vo": "And the thousands problem is gone. After training, none of its totals are off by a factor of a thousand, and it learned to leave registration numbers out of company names.",
      "hold": 3.4
    },
    "0624.png": {
      "cap": "Step 5: GRPO with the grading rule as reward",
      "vo": "Next, reinforcement learning with GRPO on a B200, starting from the base model. The grading rule scores every answer the model tries.",
      "hold": 3.0,
      "cursor": false,
      "voSay": "Next, reinforcement learning with GRPO on a B two hundred, starting from the base model. The grading rule scores every answer the model tries."
    },
    "0627.png": {
      "badge": "Sped up"
    },
    "r0007.png": {
      "cap": "GRPO from base: 63.0%, a tie with gpt-6.1-sol",
      "vo": "After an hour, it gets sixty-three percent exactly right: a tie with gpt-6.1-sol, well behind fine-tuning. Most groups of answers soon scored the same, leaving little to learn from.",
      "hold": 3.4,
      "badge": "",
      "voSay": "After an hour, it gets sixty-three percent exactly right: a tie with GPT six point one sol, well behind fine-tuning. Most groups of answers soon scored the same, leaving little to learn from."
    },
    "1653.png": {
      "cap": "Step 6: four managed Devins, one variant each",
      "vo": "So the sweep starts from the fine-tuned model. Devin holds out one hundred twenty-six training receipts for validation, and four managed Devins train one variant each, in parallel on Modal.",
      "hold": 3.2,
      "cursor": false
    },
    "1726.png": {
      "cap": "Learning rate, LoRA rank, samples, reward bonus",
      "vo": "The variants change the learning rate, the LoRA rank, or the number of answers per receipt, or they add a bonus for a fully correct receipt.",
      "hold": 3.0,
      "kind": "still",
      "badge": "Sped up"
    },
    "r0003.png": {
      "cap": "Reward bonus wins validation by 0.8 points",
      "vo": "The reward bonus wins on validation by less than one point, which is within chance. The run with sixteen answers per receipt collapsed midway, then recovered.",
      "hold": 3.4,
      "badge": ""
    },
    "r0004.png": {
      "cap": "Promoted model: 73.4% on the test set",
      "vo": "Only then is the winner scored on the test set: seventy-three point four percent exactly right, about the same as the first fine-tuned model.",
      "hold": 3.2
    },
    "3003.png": {
      "cap": "Step 7: deploy with modal deploy",
      "vo": "Step seven deploys the winner with modal deploy, as an endpoint behind an API key that scales to zero, and adds a backend setting to the demo app.",
      "hold": 3.0,
      "cursor": false
    },
    "3016.png": {
      "badge": "Sped up"
    },
    "3152.png": {
      "cap": "Same receipt, same JSON from both",
      "vo": "In the browser, gpt-6.1-sol and our endpoint read the same held-out receipt and return the same correct JSON, in about three and a half seconds each.",
      "hold": 3.2,
      "badge": "",
      "cam": {
        "x": 900,
        "y": 330,
        "z": 1.5
      },
      "voSay": "In the browser, GPT six point one sol and our endpoint read the same held-out receipt and return the same correct JSON, in about three and a half seconds each."
    },
    "3155.png": {
      "cap": "Step 8: the final scorecard",
      "vo": "Step eight is the final scorecard on the five hundred test receipts, with significance tests.",
      "hold": 3.0,
      "cursor": false,
      "cam": "reset"
    },
    "r0002.png": {
      "cap": "73.4% vs 62.4%; $412 vs $1,546 per 1M at 8 in flight",
      "vo": "The deployed model gets seventy-three point four percent of receipts exactly right, against sixty-two point four for gpt-6.1-sol, and ninety-two point seven percent of fields against eighty-eight point eight. Both gaps are significant. With eight requests in flight, it costs about four hundred dollars per million receipts, against about fifteen hundred.",
      "hold": 3.6,
      "voSay": "The deployed model gets seventy-three point four percent of receipts exactly right, against sixty-two point four for GPT six point one sol, and ninety-two point seven percent of fields against eighty-eight point eight. Both gaps are significant. With eight requests in flight, it costs about four hundred dollars per million receipts, against about fifteen hundred."
    },
    "3244.png": {
      "cap": "SFT drove the gain; GRPO added nothing measurable",
      "vo": "Devin is plain about the rest. Fine-tuning drove the gain, and GRPO and the sweep added nothing measurable on top. The cost also leaves out cold starts, idle time, training and storage.",
      "hold": 3.4
    }
  }
};
