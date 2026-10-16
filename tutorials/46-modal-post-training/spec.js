window.SPEC = {
  "title": "Post-train a model on Modal",
  "subtitle": "Devin runs the ML-engineer loop and swaps out a frontier API call",
  "outro": "Devin runs the loop. You review the results",
  "voOutro": "Devin ran the whole loop on its own, and I reviewed results instead of code.",
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.6,
  "pollRunMax": 2.5,
  "noZoom": [
    [
      "0009.png"
    ]
  ],
  "edit": {
    "0001.png": {
      "cap": "Modal and OpenAI keys saved as Devin secrets",
      "vo": "First, I saved my Modal token and an OpenAI key as Devin secrets, so sessions can use them without the values ever showing.",
      "hold": 3.2
    },
    "0002.png": {
      "cap": "Our example: a text-to-SQL demo app",
      "vo": "Our example in this video is text-to-SQL, but the same loop works for any task where a script can score the answer. The repo already has a small demo app we added beforehand, which turns questions into SQL with gpt-4.1.",
      "hold": 5.2,
      "cursor": false,
      "voSay": "Our example in this video is text-to-SQL, but the same loop works for any task where a script can score the answer. The repo already has a small demo app we added beforehand, which turns questions into SQL with GPT four point one."
    },
    "0009.png": {
      "cap": "Step 1: set the folder up for Modal",
      "vo": "I start one session and ask Devin to set the folder up for Modal training, check that auth works, and save the setup as a skill.",
      "hold": 3.2
    },
    "0044.png": {
      "cap": "Auth verified, smoke jobs ran on Modal",
      "vo": "Devin verifies the token, runs a small CPU and GPU job on Modal, and opens a pull request.",
      "hold": 2.8
    },
    "0048.png": {
      "cap": "Approved: future sessions start ready",
      "vo": "It proposes a skill with the setup, and I approve it so future sessions start ready.",
      "hold": 2.6
    },
    "0051.png": {
      "cap": "Step 2: Spider splits and an executable reward",
      "vo": "Next, the dataset and the reward: Spider splits with their SQLite databases, and a reward script that runs the SQL.",
      "hold": 3.2,
      "voSay": "Next, the data set and the reward: Spider splits with their SQLite databases, and a reward script that runs the SQL."
    },
    "0116.png": {
      "cap": "2,000 train, 200 eval, separate databases",
      "vo": "It builds two thousand training and two hundred eval questions on separate databases, and writes the reward with unit tests. The reward is checked by the computer, not an AI judge.",
      "hold": 3.4
    },
    "0118.png": {
      "cap": "Step 3: baseline gpt-4.1 and the base 7B",
      "vo": "Then the baseline: accuracy, latency and cost on the eval split, for gpt-4.1 and the base Qwen 7B on a Modal H100.",
      "hold": 3.2,
      "voSay": "Then the baseline: accuracy, latency and cost on the eval split, for GPT four point one and the base Qwen seven B on a Modal H one hundred."
    },
    "0250.png": {
      "cap": "No CUDA compiler: Devin switches images",
      "vo": "When the vLLM server fails because the image has no CUDA compiler, Devin switches to a CUDA image and redeploys.",
      "hold": 2.6,
      "badge": "Sped up"
    },
    "0337.png": {
      "cap": "Base 7B 77.0%, gpt-4.1 73.5%: within noise",
      "vo": "The base 7B already scores seventy-seven percent to gpt-4.1's seventy-three and a half, and Devin notes the gap is within noise.",
      "hold": 3.2,
      "voSay": "The base seven B already scores seventy-seven percent to GPT four point one's seventy-three and a half, and Devin notes the gap is within noise."
    },
    "0352.png": {
      "cap": "Step 4: LoRA SFT on a Modal H100",
      "vo": "Now supervised fine-tuning: a LoRA run on a Modal H100, with checkpoints on a Modal volume.",
      "hold": 3.0,
      "voSay": "Now supervised fine-tuning: a LoRA run on a Modal H one hundred, with checkpoints on a Modal volume."
    },
    "0400.png": {
      "cap": "A real launch failure, fixed and relaunched",
      "vo": "The first launch fails on a config option the trainer no longer accepts, so Devin fixes it and relaunches.",
      "hold": 2.6,
      "badge": "Sped up"
    },
    "0589.png": {
      "cap": "SFT: 79.0%, still within noise",
      "vo": "The fine-tuned model scores seventy-nine percent, still within noise of the base model.",
      "hold": 3.0
    },
    "0603.png": {
      "cap": "Step 5: GRPO with the same reward",
      "vo": "Then reinforcement learning with GRPO, using the same reward script, with early stopping.",
      "hold": 3.0
    },
    "0977.png": {
      "cap": "Run 1 plateaus; Devin raises the learning rate",
      "vo": "The first run plateaus, because the fine-tuned model is so confident that most samples get the same reward, so Devin raises the learning rate.",
      "hold": 3.0
    },
    "1163.png": {
      "cap": "Out of GPU memory: smaller micro-batches",
      "vo": "The next run runs out of GPU memory, and Devin splits each step into smaller batches.",
      "hold": 2.6,
      "badge": "Sped up"
    },
    "1763.png": {
      "cap": "More fixes: data, reward CPU, early stopping",
      "vo": "Over a few more runs it fixes a data bug, gives the reward more CPU, and rewrites early stopping.",
      "hold": 2.6,
      "badge": "Sped up"
    },
    "2358.png": {
      "cap": "GRPO: 81.5% on the same 200 questions",
      "vo": "The final run scores eighty-one and a half percent, ahead of gpt-4.1, though the gain over fine-tuning alone is within noise.",
      "hold": 3.0,
      "voSay": "The final run scores eighty-one and a half percent, ahead of GPT four point one, though the gain over fine-tuning alone is within noise."
    },
    "2378.png": {
      "cap": "Step 6: four managed Devins, one variant each",
      "vo": "Now the sweep: I ask for four managed Devins, each running one GRPO variant, then a table and the best checkpoint.",
      "hold": 3.2
    },
    "2393.png": {
      "cap": "One coordinator plans four child sessions",
      "vo": "Devin pushes the training code and plans four child sessions, each with its own VM and Modal job.",
      "hold": 2.6
    },
    "2496.png": {
      "cap": "Four Devins, each with its own Modal job",
      "vo": "Each child gets one variant: a lower learning rate, a bigger LoRA rank, sixteen generations per prompt, or a partial-credit reward.",
      "hold": 3.2
    },
    "2642.png": {
      "cap": "One child: its own VM and Modal run",
      "vo": "Inside one child, Devin launches its GRPO run on Modal and watches it train.",
      "hold": 2.8,
      "cam": {
        "x": 720,
        "y": 520,
        "z": 1.5,
        "camForce": true
      }
    },
    "2835.png": {
      "cap": "Same eval set for every variant",
      "vo": "When they finish, the coordinator serves each best checkpoint and scores it on the same eval set.",
      "hold": 2.6
    },
    "2915.png": {
      "cap": "Picked by validation: 82.0% on eval",
      "vo": "Sixteen generations wins on validation and gets promoted. It scores eighty-two percent on eval, and Devin notes no variant is significantly better.",
      "hold": 3.4
    },
    "2918.png": {
      "cap": "Step 7: deploy and swap it into the app",
      "vo": "Next, I ask Devin to deploy the winner with modal deploy, add a feature flag to the app, and show it working in the browser.",
      "hold": 3.2
    },
    "2955.png": {
      "cap": "Testing in the session's browser",
      "vo": "Devin's testing agent opens the app in the session's browser.",
      "hold": 2.4
    },
    "2960.png": {
      "cap": "Before: the frontier backend, gpt-4.1",
      "vo": "With the flag set to frontier, the app answers with gpt-4.1.",
      "hold": 2.8,
      "voSay": "With the flag set to frontier, the app answers with GPT four point one."
    },
    "2964.png": {
      "cap": "After: our model on the Modal endpoint",
      "vo": "Flipped to finetuned, the same question goes to our endpoint on Modal and returns the same rows.",
      "hold": 3.0,
      "voSay": "Flipped to fine tuned, the same question goes to our endpoint on Modal and returns the same rows."
    },
    "2979.png": {
      "cap": "Deployed: text-to-sql-vllm-prod on Modal",
      "vo": "Devin confirms the production endpoint is deployed on Modal, and nothing else is left running.",
      "hold": 2.8
    },
    "2983.png": {
      "cap": "Step 8: the scorecard, real numbers only",
      "vo": "Step eight: the scorecard, filled in with the real numbers.",
      "hold": 3.0
    },
    "3038.png": {
      "cap": "The scorecard: measured numbers only",
      "vo": "On the same two hundred questions, gpt-4.1 scores seventy-three and a half percent, the base 7B seventy-seven, fine-tuning seventy-nine, and the promoted GRPO model eighty-two. Only its lead over gpt-4.1 is statistically significant.",
      "hold": 3.6,
      "voSay": "On the same two hundred questions, GPT four point one scores seventy-three and a half percent, the base seven B seventy-seven, fine-tuning seventy-nine, and the promoted GRPO model eighty-two. Only its lead over GPT four point one is statistically significant."
    },
    "3008.png": {
      "cap": "Qwen cost assumes a warm, busy H100",
      "vo": "On a warm, busy H100 our model costs about forty-nine dollars per million queries, against nine hundred ninety-three for gpt-4.1, not counting cold starts or idle time. The latency differences between the Qwen models are noise.",
      "hold": 3.4,
      "voSay": "On a warm, busy H one hundred our model costs about forty-nine dollars per million queries, against nine hundred ninety-three for GPT four point one, not counting cold starts or idle time. The latency differences between the Qwen models are noise."
    },
    "3014.png": {
      "cap": "Step 9: save the recipe as a playbook",
      "vo": "Finally, I ask Devin to save the whole recipe as a playbook.",
      "hold": 2.8
    },
    "3032.png": {
      "cap": "Devin drafts the playbook; I create it",
      "vo": "Devin drafts it as general steps, with this project as the worked example, and I create it.",
      "hold": 3.0
    },
    "3036.png": {
      "cap": "Saved as an org playbook",
      "vo": "Now it's an organization playbook, so the next task model starts from this recipe.",
      "hold": 2.8
    }
  }
};
