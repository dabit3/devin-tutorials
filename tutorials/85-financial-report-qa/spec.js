window.SPEC = {
 "title": "Post-train a model for financial report questions",
 "subtitle": "Devin fine-tunes an open model on Modal and deploys it as an API endpoint",
 "outro": "Start with a script that scores the answer",
 "voOutro": "That's how you post-train a model for your own task. Start with a script that scores the answer, and Devin can train, compare, and deploy a model that matches the frontier at a fraction of the cost.",
 "tailHold": 0.3,
 "outroVoDelay": 0.6,
 "speed": 3,
 "cps": 48,
 "maxZoom": 1.6,
 "pollRunMax": 0.8,
 "noZoom": [
  [
   "x_runaway.png",
   "x_runaway.png"
  ],
  [
   "bc_144.png",
   "bc_95.png"
  ]
 ],
 "edit": {
  "p1_0007.png": {
   "cap": "Post-train an open model on Modal",
   "hold": 3.0,
   "cursor": false,
   "vo": "In this video, we'll have Devin post-train Qwen3.8-27B, an open model, on Modal, so it answers numeric questions about earnings reports. Modal runs each GPU job only while it's needed and bills by the second, runs a whole sweep in parallel, and serves the finished model as an endpoint that scales to zero.",
   "voSay": "In this video, we'll have Devin post-train Qwen three point eight twenty-seven B, an open model on Modal, so it answers numeric questions about earnings reports. Modal runs each GPU job only while it's needed and bills by the second, runs a whole sweep in parallel, and serves the finished model as an endpoint that scales to zero."
  },
  "p1_0007b.png": {
   "cap": "Step 1: set the folder up for Modal",
   "hold": 3.0,
   "cursor": false,
   "vo": "I start one session and ask Devin to set the folder up for Modal, follow the playbook we saved in an earlier video, and check that auth works.",
   "voSay": "I start one session and ask Devin to set the folder up for Modal, follow the playbook we saved in an earlier video, and check that auth works."
  },
  "p1_0090.png": {
   "cap": "Auth checked; setup saved as a skill",
   "hold": 2.8,
   "cam": {
    "x": 720,
    "y": 520,
    "z": 1.3
   },
   "vo": "Devin verifies the Modal token, runs a small GPU job, and saves the setup as a skill."
  },
  "0004.png": {
   "cap": "Step 2: FinQA splits and a numeric reward",
   "hold": 3.0,
   "cursor": false,
   "vo": "Next, the data. FinQA has real pages from S&P 500 annual reports, each with text, a table and a question whose answer is a number.",
   "voSay": "Next, the data. Fin Q A has real pages from S and P five hundred annual reports, each with text, a table and a question whose answer is a number."
  },
  "0040.png": {
   "cap": "5,827 train, 300 validation, 1,127 test",
   "hold": 3.4,
   "cam": {
    "x": 720,
    "y": 300,
    "z": 1.25
   },
   "vo": "Devin builds a fixed split: 5,827 training questions, 300 for validation, and all 1,127 test questions. The reward gives one point when the number is within 1% of the gold answer, zero when it's wrong, and minus a half when there's no number at all.",
   "voSay": "Devin builds a fixed split: five thousand eight hundred twenty-seven training questions, three hundred for validation, and all one thousand one hundred twenty-seven test questions. The reward gives one point when the number is within one percent of the gold answer, zero when it's wrong, and minus a half when there's no number at all."
  },
  "0044.png": {
   "cap": "Step 3: baseline gpt-6.1-sol and the base 27B",
   "hold": 3.0,
   "cursor": false,
   "vo": "Then the baseline. Every model gets the same prompt: show a few short calculation lines, then end with one answer line."
  },
  "0500.png": {
   "cap": "gpt-6.1-sol 80.2%; base 77.0%, 36 answers hit the cap",
   "hold": 3.4,
   "cam": {
    "x": 720,
    "y": 200,
    "z": 1.3
   },
   "vo": "gpt-6.1-sol gets 80.2%. The base model gets 77%, and 36 of its answers run on until they hit the token cap.",
   "voSay": "GPT six point one sol gets eighty point two percent. The base model gets seventy-seven, and thirty-six of its answers run on until they hit the token cap."
  },
  "0558.png": {
   "cap": "Step 4: LoRA fine-tuning on a Modal H200",
   "hold": 3.0,
   "cursor": false,
   "vo": "Now supervised fine-tuning. FinQA ships the calculation behind each answer, so Devin writes those out as short worked answers and trains a LoRA on one Modal H200.",
   "voSay": "Now supervised fine-tuning. Fin Q A ships the calculation behind each answer, so Devin writes those out as short worked answers and trains a LoRA on one Modal H two hundred."
  },
  "0900.png": {
   "cap": "SFT: 80.3%, and no answer hits the cap",
   "hold": 3.2,
   "cam": {
    "x": 720,
    "y": 280,
    "z": 1.3
   },
   "vo": "78 minutes later, the model scores 80.3%, and not one answer hits the cap.",
   "voSay": "Seventy-eight minutes later, the model scores eighty point three percent, and not one answer hits the cap."
  },
  "x_runaway.png": {
   "cap": "One runaway answer, before and after",
   "hold": 3.6,
   "cam": "reset",
   "vo": "Here's one of those runaway answers. The base model argues with itself for 1,000 tokens and never answers. After fine-tuning, it's one line of math and the right number.",
   "cursor": false,
   "voSay": "Here's one of those runaway answers. The base model argues with itself for a thousand tokens and never answers. After fine-tuning, it's one line of math and the right number."
  },
  "0962.png": {
   "cap": "Step 5: GRPO from the base model on a B200",
   "hold": 3.0,
   "cursor": false,
   "cam": {
    "x": 720,
    "y": 560,
    "z": 1.3
   },
   "vo": "Next, reinforcement learning with GRPO, starting from the base model on a B200 and graded by the same reward script.",
   "voSay": "Next, reinforcement learning with G R P O, starting from the base model on a B two hundred and graded by the same reward script."
  },
  "1880.png": {
   "hold": 0.5,
   "badge": "Sped up",
   "vo": "The run takes about 2 hours and 45 minutes.",
   "voSay": "The run takes about two hours and forty-five minutes."
  },
  "1884.png": {
   "hold": 0.5,
   "badge": "Sped up"
  },
  "1888.png": {
   "hold": 0.5,
   "badge": "Sped up"
  },
  "1892.png": {
   "hold": 0.5,
   "badge": "Sped up"
  },
  "1600.png": {
   "cap": "GRPO: 79.0%, still 22 answers at the cap",
   "hold": 3.4,
   "badge": "",
   "cam": {
    "x": 720,
    "y": 250,
    "z": 1.3
   },
   "vo": "GRPO lifts the base model to 79%, but it stays below fine-tuning, and 22 answers still hit the cap.",
   "voSay": "G R P O lifts the base model to seventy-nine percent, but it stays below fine-tuning, and twenty-two answers still hit the cap."
  },
  "1908.png": {
   "cap": "Step 6: four managed Devins, one variant each",
   "hold": 3.2,
   "cursor": false,
   "cam": {
    "x": 720,
    "y": 560,
    "z": 1.3
   },
   "vo": "Now the sweep. I ask for four managed Devins, each training one variant, scored only on 300 validation questions, so the test set stays untouched.",
   "voSay": "Now the sweep. I ask for four managed Devins, each training one variant, scored only on three hundred validation questions, so the test set stays untouched."
  },
  "1942.png": {
   "cap": "Learning rate, LoRA rank, samples, reward",
   "hold": 3.0,
   "cam": {
    "x": 720,
    "y": 280,
    "z": 1.3
   },
   "vo": "The variants change the learning rate, the LoRA rank, the number of samples per question, or the reward itself."
  },
  "2012.png": {
   "cap": "Start from SFT, on two H200s each",
   "hold": 3.4,
   "cursor": false,
   "cam": {
    "x": 720,
    "y": 560,
    "z": 1.3
   },
   "vo": "Before they start, I ask for two changes: start from the fine-tuned model, and use two H200s each, since B200s are scarce right now and the inference server needs its own GPU.",
   "voSay": "Before they start, I ask for two changes: start from the fine-tuned model, and use two H two hundreds each, since B two hundreds are scarce right now and the inference server needs its own GPU."
  },
  "2286.png": {
   "cap": "Crash at step 57: fixed and resumed",
   "hold": 3.4,
   "cam": {
    "x": 720,
    "y": 300,
    "z": 1.3
   },
   "vo": "One run crashes at step 57 on a prompt longer than the context. The length filter was counting the wrong thing, so Devin fixes it and resumes from the last checkpoint.",
   "voSay": "One run crashes at step fifty-seven on a prompt longer than the context. The length filter was counting the wrong thing, so Devin fixes it and resumes from the last checkpoint."
  },
  "2860.png": {
   "hold": 0.5,
   "badge": "Sped up"
  },
  "2876.png": {
   "hold": 0.5,
   "badge": "Sped up"
  },
  "2892.png": {
   "hold": 0.5,
   "badge": "Sped up"
  },
  "2908.png": {
   "hold": 0.5,
   "badge": "Sped up"
  },
  "2700.png": {
   "cap": "No variant beats SFT on validation (243/300)",
   "hold": 3.6,
   "badge": "",
   "cam": {
    "x": 720,
    "y": 250,
    "z": 1.3
   },
   "vo": "None of the four beats the fine-tuned model's 243 out of 300. The rank-64 run is clearly worse, and often flips the sign of a change.",
   "voSay": "None of the four beats the fine-tuned model's two hundred forty-three out of three hundred. The rank sixty-four run is clearly worse, and often flips the sign of a change."
  },
  "2932.png": {
   "cap": "SFT promoted; best variant scored once on test",
   "hold": 3.2,
   "cam": {
    "x": 720,
    "y": 300,
    "z": 1.3
   },
   "vo": "So the fine-tuned model is promoted. The best variant still gets one test run for the scorecard."
  },
  "3053.png": {
   "cap": "Step 7: deploy the fine-tuned model",
   "hold": 3.2,
   "cursor": false,
   "cam": {
    "x": 720,
    "y": 640,
    "z": 1.3
   },
   "vo": "Step seven is the deploy. Devin serves the fine-tuned model with modal deploy, behind an API key, scaling to zero, and adds a backend setting to the demo app."
  },
  "3467.png": {
   "cap": "Endpoint behind an API key, scales to zero",
   "hold": 3.2,
   "cam": {
    "x": 720,
    "y": 330,
    "z": 1.25
   },
   "vo": "The first deploy fails because the server's default settings don't fit on one H100. Devin lowers the limit and deploys again.",
   "voSay": "The first deploy fails because the server's default settings don't fit on one H one hundred. Devin lowers the limit and deploys again."
  },
  "bc_15.png": {
   "cap": "The app, asking gpt-6.1-sol",
   "hold": 2.6,
   "cam": "reset",
   "vo": "Devin's own browser test asks the app about the change in operating cash flow on a 2007 annual report page, first with gpt-6.1-sol.",
   "voSay": "Devin's own browser test asks the app about the change in operating cash flow on a two thousand seven annual report page, first with GPT six point one sol.",
   "cursor": false
  },
  "bc_65.png": {
   "cap": "gpt-6.1-sol: 67.66% in 2,677 ms",
   "hold": 2.8,
   "vo": "It answers 67.66% in about 2.7 seconds.",
   "cursor": false,
   "voSay": "It answers sixty-seven point six six percent in about two point seven seconds."
  },
  "bc_95.png": {
   "cap": "The same question, with our endpoint",
   "hold": 2.2,
   "vo": "Then with our endpoint, same page, same question.",
   "cursor": false
  },
  "bc_144.png": {
   "cap": "Our endpoint: 67.66% in 2,043 ms",
   "hold": 3.0,
   "vo": "Same answer, in about 2 seconds.",
   "cursor": false,
   "voSay": "Same answer, in about two seconds."
  },
  "3398.png": {
   "cap": "Step 8: the final scorecard",
   "hold": 3.0,
   "cursor": false,
   "cam": {
    "x": 720,
    "y": 560,
    "z": 1.3
   },
   "vo": "Step eight is the final scorecard on all 1,127 test questions, with significance tests.",
   "voSay": "Step eight is the final scorecard on all one thousand one hundred twenty-seven test questions, with significance tests."
  },
  "3466.png": {
   "cap": "SFT 80.3% vs gpt-6.1-sol 80.2%; $114 vs $2,743 per 1M",
   "hold": 3.8,
   "cam": {
    "x": 720,
    "y": 560,
    "z": 1.35
   },
   "vo": "The deployed model scores 80.3%, against 80.2% for gpt-6.1-sol. That's a tie, but it answers faster and costs about $114 per million questions, against about $2,700.",
   "voSay": "The deployed model scores eighty point three percent, against eighty point two for GPT six point one sol. That's a tie, but it answers faster and costs about a hundred fourteen dollars per million questions, against about twenty-seven hundred."
  },
  "3464.png": {
   "cap": "Only the gain over the base model is significant",
   "hold": 3.4,
   "cam": {
    "x": 720,
    "y": 380,
    "z": 1.3
   },
   "vo": "After a Holm correction, only the gain over the base model is significant. The gaps to gpt-6.1-sol, GRPO and the sweep winner are not.",
   "voSay": "After a Holm correction, only the gain over the base model is significant. The gaps to GPT six point one sol, G R P O and the sweep winner are not."
  },
  "3426.png": {
   "cap": "Costs leave out cold starts, idle time, training",
   "hold": 3.2,
   "cam": {
    "x": 720,
    "y": 230,
    "z": 1.3
   },
   "vo": "Devin also spells out what the cost leaves out: cold starts, idle time, training, and storage."
  }
 }
};
