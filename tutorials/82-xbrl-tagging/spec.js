window.SPEC = {
  "title": "Teach an open model to tag SEC filings",
  "subtitle": "Devin post-trains Qwen3.8-27B on Modal and deploys it",
  "outro": "Write the grading script first",
  "voOutro": "Write the grading script first. Then let Devin train, compare and deploy on Modal, and say plainly what the numbers show.",
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
      "cap": "Tag every number in an SEC filing",
      "vo": "In this video, we'll have Devin post-train Qwen3.8-27B, an open model on Modal, to tag the numbers in SEC filings with their XBRL tags.",
      "hold": 3.0,
      "voSay": "In this video, we'll have Devin post-train Qwen three point eight twenty-seven B, an open model on Modal, to tag the numbers in S-E-C filings with their X-B-R-L tags.",
      "cursor": false
    },
    "0001.png": {
      "cap": "Why Modal: GPUs only while a job runs",
      "vo": "Modal runs each GPU job only while it's needed and bills by the second. Sweep variants run side by side, and the endpoint scales to zero.",
      "hold": 3.0
    },
    "0002.png": {
      "cap": "Step 1: follow the saved playbook",
      "vo": "Finance teams tag every number in a 10-K by hand. I ask Devin to set this folder up for Modal with the playbook from an earlier project.",
      "hold": 2.6,
      "voSay": "Finance teams tag every number in a ten-K by hand. I ask Devin to set this folder up for Modal with the playbook from an earlier project."
    },
    "0005.png": {
      "cap": "Auth checked; setup saved as a skill",
      "vo": "Devin checks the Modal token with a small GPU job and saves the setup as a skill.",
      "hold": 2.8
    },
    "0006.png": {
      "cap": "Step 2: FiNER-139 and a grading script",
      "vo": "Next, the data. FiNER-139 has sentences from real filings, labelled with 139 US-GAAP tags.",
      "hold": 2.8,
      "voSay": "Next, the data. FiNER one thirty-nine has sentences from real filings, labelled with one hundred thirty-nine U-S GAAP tags.",
      "cursor": false
    },
    "0011.png": {
      "cap": "600 test sentences; F1 over value and tag",
      "vo": "Devin builds 600 test sentences, including 100 with no tag, so a model can't score by tagging every number. The grade is F1 over value and tag pairs, and broken JSON costs half a point.",
      "hold": 3.4,
      "voSay": "Devin builds six hundred test sentences, including one hundred with no tag, so a model can't score by tagging every number. The grade is F-one over value and tag pairs, and broken JSON costs half a point."
    },
    "0012.png": {
      "cap": "Step 3: one shared prompt for both models",
      "vo": "Then the baseline. Both models get one shared prompt that lists all 139 tags.",
      "hold": 2.6,
      "voSay": "Then the baseline. Both models get one shared prompt that lists all one hundred thirty-nine tags.",
      "cursor": false
    },
    "0020.png": {
      "cap": "gpt-6.1-sol 68.4% vs base Qwen 57.9%",
      "vo": "gpt-6.1-sol scores 68.4 percent F1 and the base model 57.9. But the base model costs about 99 dollars per million requests, against 3,409.",
      "hold": 3.4,
      "voSay": "GPT six point one sol scores sixty-eight point four percent F-one and the base model fifty-seven point nine. But the base model costs about ninety-nine dollars per million requests, against three thousand four hundred nine."
    },
    "0021.png": {
      "cap": "Step 4: LoRA fine-tuning on an H200",
      "vo": "Step four is LoRA fine-tuning on one Modal H200, with checkpoints saved on a Modal volume.",
      "hold": 2.6,
      "voSay": "Step four is LoRA fine-tuning on one Modal H two hundred, with checkpoints saved on a Modal volume.",
      "cursor": false
    },
    "0023.png": {
      "cap": "Two fixes, then the full run",
      "vo": "Devin fixes the maximum length and the launch command, then starts the full run.",
      "hold": 2.6
    },
    "0029.png": {
      "cap": "SFT: 74.1%, ahead of gpt-6.1-sol",
      "vo": "After 49 minutes of training, the fine-tuned model scores 74.1 percent. That's ahead of gpt-6.1-sol, and the gap is statistically significant.",
      "hold": 3.4,
      "voSay": "After forty-nine minutes of training, the fine-tuned model scores seventy-four point one percent. That's ahead of GPT six point one sol, and the gap is statistically significant."
    },
    "0030.png": {
      "cap": "Step 5: GRPO with the grading script",
      "vo": "Step five is GRPO on a B200, where the model learns straight from the grading script.",
      "hold": 2.6,
      "voSay": "Step five is G-R-P-O on a B two hundred, where the model learns straight from the grading script.",
      "cursor": false
    },
    "0032.png": {
      "cap": "Smoke test passes; 250-step run starts",
      "vo": "A smoke test passes, so Devin launches the full run of 250 steps.",
      "hold": 2.6,
      "voSay": "A smoke test passes, so Devin launches the full run of two hundred fifty steps."
    },
    "0038.png": {
      "cap": "GRPO: 70.3%, a tie with gpt-6.1-sol",
      "vo": "GRPO reaches 70.3 percent. That ties gpt-6.1-sol and trails fine-tuning. Late in the run, most groups of answers got the same score, so there was little left to learn.",
      "hold": 3.6,
      "voSay": "G-R-P-O reaches seventy point three percent. That ties GPT six point one sol and trails fine-tuning. Late in the run, most groups of answers got the same score, so there was little left to learn."
    },
    "0039.png": {
      "cap": "Step 6: four managed Devins, one variant each",
      "vo": "So the sweep starts from the fine-tuned model. Four managed Devins each train one variant, with a new learning rate, LoRA rank, answer count or reward.",
      "hold": 2.8,
      "cursor": false
    },
    "0041.png": {
      "cap": "Validation picks the winner",
      "vo": "A validation set held out from training picks the winner, so the test set stays untouched.",
      "hold": 2.6
    },
    "0043.png": {
      "cap": "Queued: no B200 capacity",
      "vo": "Then the jobs sat in the queue for over an hour, because Modal had no B200 capacity free.",
      "hold": 2.8,
      "voSay": "Then the jobs sat in the queue for over an hour, because Modal had no B two hundred capacity free."
    },
    "0045.png": {
      "cap": "Devin lays out the options",
      "vo": "Devin lays out the options and waits for a decision.",
      "hold": 2.4
    },
    "0046.png": {
      "cap": "Relaunch on 2× H200, same settings",
      "vo": "I ask it to relaunch each variant on two H200s, with vLLM on its own GPU. The hardware changed, but the settings, steps and data did not, so the comparison holds.",
      "hold": 2.8,
      "voSay": "I ask it to relaunch each variant on two H two hundreds, with V-L-L-M on its own GPU. The hardware changed, but the settings, steps and data did not, so the comparison holds.",
      "cursor": false
    },
    "0047.png": {
      "cap": "Smoke test passes on 2× H200",
      "vo": "A smoke test of the heaviest variant passes, and all four relaunch.",
      "hold": 2.6
    },
    "0056.png": {
      "cap": "Validation scores come in",
      "vo": "Over the next few hours, the validation scores come in.",
      "hold": 2.6
    },
    "0058.png": {
      "cap": "Promote by validation, test once",
      "vo": "I ask Devin to promote the best on validation and score only that model on test.",
      "hold": 2.6,
      "cursor": false
    },
    "0063.png": {
      "cap": "Shaped reward wins validation by 0.1",
      "vo": "Shaped reward wins the validation pick by a tenth of a point, which is a tie with plain fine-tuning. On test, it scores the same 74.1 percent, with fewer exact sentences.",
      "hold": 3.6,
      "voSay": "Shaped reward wins the validation pick by a tenth of a point, which is a tie with plain fine-tuning. On test, it scores the same seventy-four point one percent, with fewer exact sentences."
    },
    "0064.png": {
      "cap": "Step 7: deploy the fine-tuned model",
      "vo": "I deploy the fine-tuned model instead. It had more exact matches on validation and answers faster. I chose it after the test run, so the test wasn't untouched for that one decision.",
      "hold": 3.0,
      "cursor": false
    },
    "0065.png": {
      "cap": "Endpoint behind a key; scales to zero",
      "vo": "Devin deploys it with modal deploy, behind an API key, as an endpoint that scales to zero.",
      "hold": 2.6
    },
    "0069.png": {
      "cap": "Same sentence, both backends",
      "vo": "In the browser, the app tags one sentence with gpt-6.1-sol and with our endpoint. They pick different tags, and our endpoint answers in 1.3 seconds against 2.3.",
      "hold": 3.4,
      "voSay": "In the browser, the app tags one sentence with GPT six point one sol and with our endpoint. They pick different tags, and our endpoint answers in one point three seconds against two point three."
    },
    "0072.png": {
      "cap": "Step 8: the final scorecard",
      "vo": "Step eight is the final scorecard on the 600 test sentences, with significance tests.",
      "hold": 2.6,
      "voSay": "Step eight is the final scorecard on the six hundred test sentences, with significance tests.",
      "cursor": false
    },
    "0078.png": {
      "cap": "74.1% vs 68.4%; $91 vs $3,409 per 1M",
      "vo": "The deployed model scores 74.1 percent, against 68.4 for gpt-6.1-sol. After Holm correction, that gap is significant. It costs about 91 dollars per million requests, against 3,409, before cold starts, idle time and training.",
      "hold": 4.0,
      "voSay": "The deployed model scores seventy-four point one percent, against sixty-eight point four for GPT six point one sol. After Holm correction, that gap is significant. It costs about ninety-one dollars per million requests, against three thousand four hundred nine, before cold starts, idle time and training."
    },
    "0079.png": {
      "cap": "Base: capacity. Trained: amount owed",
      "vo": "Here's one real test sentence: 145.6 million was outstanding under a credit agreement. Base Qwen tagged it as borrowing capacity. The trained model tagged it as the line of credit, the amount actually owed, which matches the label.",
      "hold": 4.0,
      "voSay": "Here's one real test sentence: one hundred forty-five point six million was outstanding under a credit agreement. Base Qwen tagged it as borrowing capacity. The trained model tagged it as the line of credit, the amount actually owed, which matches the label."
    },
    "0003.png": {
      "badge": "Sped up"
    },
    "0004.png": {
      "badge": "Sped up"
    },
    "0007.png": {
      "badge": "Sped up"
    },
    "0008.png": {
      "badge": "Sped up"
    },
    "0009.png": {
      "badge": "Sped up"
    },
    "0010.png": {
      "badge": "Sped up"
    },
    "0013.png": {
      "badge": "Sped up"
    },
    "0014.png": {
      "badge": "Sped up"
    },
    "0015.png": {
      "badge": "Sped up"
    },
    "0016.png": {
      "badge": "Sped up"
    },
    "0017.png": {
      "badge": "Sped up"
    },
    "0018.png": {
      "badge": "Sped up"
    },
    "0024.png": {
      "badge": "Sped up"
    },
    "0025.png": {
      "badge": "Sped up"
    },
    "0026.png": {
      "badge": "Sped up"
    },
    "0027.png": {
      "badge": "Sped up"
    },
    "0028.png": {
      "badge": "Sped up"
    },
    "0033.png": {
      "badge": "Sped up"
    },
    "0034.png": {
      "badge": "Sped up"
    },
    "0035.png": {
      "badge": "Sped up"
    },
    "0036.png": {
      "badge": "Sped up"
    },
    "0037.png": {
      "badge": "Sped up"
    },
    "0048.png": {
      "badge": "Sped up"
    },
    "0049.png": {
      "badge": "Sped up"
    },
    "0050.png": {
      "badge": "Sped up"
    },
    "0051.png": {
      "badge": "Sped up"
    },
    "0052.png": {
      "badge": "Sped up"
    },
    "0053.png": {
      "badge": "Sped up"
    },
    "0054.png": {
      "badge": "Sped up"
    },
    "0055.png": {
      "badge": "Sped up"
    },
    "0057.png": {
      "badge": "Sped up"
    },
    "0066.png": {
      "badge": "Sped up"
    },
    "0067.png": {
      "badge": "Sped up"
    },
    "0068.png": {
      "badge": "Sped up"
    },
    "0019.png": {
      "skip": true
    },
    "0059.png": {
      "skip": true
    },
    "0060.png": {
      "skip": true
    },
    "0061.png": {
      "skip": true
    },
    "0062.png": {
      "skip": true
    },
    "0070.png": {
      "skip": true
    },
    "0071.png": {
      "skip": true
    },
    "0073.png": {
      "skip": true
    },
    "0074.png": {
      "skip": true
    },
    "0075.png": {
      "skip": true
    },
    "0076.png": {
      "skip": true
    },
    "0077.png": {
      "skip": true
    }
  }
};
