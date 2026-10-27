# Tutorial 83 voice script

Narration by Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, `eleven_multilingual_v2`, one full-script take via `_kit/tools/vo_onetake.py`). Each line plays on the frame named before it; `voSay` spellings in `spec.js` only change pronunciation.

**x_demo1.png** (Find clauses in contracts with an open model)  
In this video, we'll have Devin post-train Qwen3.8-27B, an open model on Modal, to find clauses in contracts.

**x_demo1b.png** (gpt-6.1-sol: NOT PRESENT)  
Here's the result. On the same contract, gpt-6.1-sol says the clause isn't there.

**x_demo2.png** (Our model copies the whole clause)  
Our trained model copies the whole clause, in under a second.

**0000.png** (GPU jobs that run only while needed)  
Modal runs each GPU job only while it's needed and bills by the second. It runs a sweep in parallel and serves the model as an endpoint that scales to zero. And because the model runs on your own GPU, the contracts never leave.

**0007.png** (Step 1: follow the Modal training playbook)  
I start one session and ask Devin to follow our playbook for training a task model on Modal, this time for contract review. Devin checks the Modal login and saves the setup as a skill.

**0074.png** (Step 2: the data and the grading rule)  
Next, the data. CUAD is a public set of five hundred ten commercial contracts, with clauses labeled by lawyers. Devin splits it by contract, so no contract shows up in both training and test.

**0084.png** (638 test examples, half with the clause)  
The test set has six hundred thirty-eight examples, half with the clause and half without. The grading rule gives partial credit for how much of the clause text matches, and one point for a correct not present. Made-up text costs half a point.

**0129.png** (Step 3: baseline, gpt-6.1-sol vs the base 27B)  
Then the baseline: gpt-6.1-sol against the base model, with one shared prompt.

**x_p3.png** (A tie: 0.790 vs 0.782 mean F1)  
It's a tie on mean F1, 0.790 against 0.782. But on clauses that really are there, the base model misses fifty-nine and gets only 0.59 of the text right. That's where training can help.

**0543.png** (Step 4: LoRA fine-tuning on a Modal H200)  
Now supervised fine-tuning: a LoRA run on one Modal H200.

**1518.png** (SFT: 0.867 mean F1, 209 exact clauses)  
Thirty-eight minutes later, mean F1 is up to 0.867. Exact copies of the clause jump from fifty-four to two hundred nine, and the gain is significant against both models.

**1535.png** (Step 5: GRPO on a B200, from the base model)  
Next, reinforcement learning with GRPO on a B200, from the base model, with the grading script as the reward.

**3087.png** (Mean reward rises, then falls)  
Here's an honest failure. The mean reward rises at first, then falls. The model learns to almost never say not present.

**3414.png** (Reward hacking: 300 false alarms, F1 0.461)  
So it misses nothing, but it raises three hundred false alarms, and mean F1 drops to 0.461. Devin spots the reward hacking, so the sweep starts from the fine-tuned model, with a penalty for drifting away from it.

**3444.png** (Step 6: four managed Devins, one variant each)  
Now the sweep. Four managed Devins each train one variant: the learning rate, the LoRA rank, the samples per prompt, or a penalty for false alarms.

**3650.png** (Each variant runs on its own GPU)  
They all run in parallel, each on its own GPU, and they're scored only on a validation set held out from training.

**5240.png** (No free B200s: three runs move to H200s)  
Modal has no free B200s that day, so Devin moves the last three runs to two H200s each, with the same settings.

**x_val.png** (16 samples per prompt wins on validation)  
Sixteen samples per prompt wins on validation, at 0.893. The margin over the next run is small, and Devin says so.

**x_test.png** (Test: 0.893 vs 0.867; misses 55 to 35)  
Only then does it touch the test set: 0.893 mean F1, up from 0.867, and missed clauses fall from fifty-five to thirty-five.

**10276.png** (Step 7: deploy and compare in the app)  
Step seven: deploy it with modal deploy, behind an API key, scaling to zero when idle.

**x_p7.png** (A real test contract the base model missed)  
Devin adds a backend setting to the app and picks a real test contract where the base model missed the clause.

**x_rec1.png** (gpt-6.1-sol: NOT PRESENT)  
On this BellRing Brands manufacturing contract, gpt-6.1-sol says the minimum commitment clause is not present.

**x_rec2.png** (Our endpoint: the whole clause in 0.98 s)  
Our endpoint returns the whole clause, word for word, in under a second, and the app highlights it in the passage.

**10403.png** (Step 8: the final scorecard)  
Last, the final scorecard on the six hundred thirty-eight test examples.

**x_score.png** (0.893 vs 0.790 mean F1; 35 misses vs 50)  
The deployed model reaches 0.893 mean F1, against 0.790 for gpt-6.1-sol, and misses thirty-five clauses instead of fifty. Eleven of twelve paired comparisons are significant after Holm correction. The one loss is clause text against the hacked GRPO model, which answers almost every row.

**10499.png** ($134 vs $3,223 per 1M requests)  
It answers in 0.68 seconds against 1.62, and costs about a hundred thirty-four dollars per million requests, against about three thousand two hundred. Devin spells out what that leaves out: cold starts, idle time, training and storage.

**Outro** (Start with a script that scores the answer)  
That's how you post-train a private model for your task: start with a script that scores the answer, and check the outputs, not just the reward. With that, Devin can train, compare and deploy it on Modal.
