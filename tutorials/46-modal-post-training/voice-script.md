# Post-train a model on Modal, voice script

Narrated by Nader (ElevenLabs voice T8iHhGIWPm2GVYpQD1Am, default settings, no seed), recorded as one full-script take and cut at sentence boundaries.

First, I saved my Modal token and an OpenAI key as Devin secrets, so sessions can use them without the values ever showing.

Our example in this video is text-to-SQL, but the same steps work for any task where a script can score the answer. The repo already has a small demo app we added beforehand, which uses gpt-4.1 to turn questions into SQL.

I start one session and ask Devin to set the folder up for Modal training, check that auth works, and save the setup as a skill.

Devin verifies the token, runs a small CPU and GPU job on Modal, and opens a pull request.

It proposes a skill with the setup, and I approve it so future sessions start ready.

Next, the dataset and the reward: Spider splits with their SQLite databases, and a reward script that runs the SQL.

It builds two thousand training and two hundred eval questions on separate databases, and writes the reward with unit tests. The reward is checked by the computer, not an AI judge.

Then the baseline: gpt-4.1 and the base Qwen 7B on a Modal H100, measured for accuracy, latency and cost on the eval split.

When the vLLM server fails because the image has no CUDA compiler, Devin switches to a CUDA image and redeploys.

The base 7B already scores seventy-seven percent to gpt-4.1's seventy-three and a half, and Devin notes the gap is within noise.

Now supervised fine-tuning: a LoRA run on a Modal H100, with checkpoints on a Modal volume.

The first launch fails on a config option the trainer no longer accepts, so Devin fixes it and relaunches.

The fine-tuned model scores seventy-nine percent, still within noise of the base model.

Then reinforcement learning with GRPO, using the same reward script, with early stopping.

The first run plateaus, because the fine-tuned model is so confident that most samples get the same reward, so Devin raises the learning rate.

The next run runs out of GPU memory, and Devin splits each step into smaller batches.

Over a few more runs it fixes a data bug, gives the reward more CPU, and rewrites early stopping.

The final run scores eighty-one and a half percent, ahead of gpt-4.1, though the gain over fine-tuning alone is within noise.

Now the sweep: I ask for four managed Devins, each running one GRPO variant, then a table and the best checkpoint.

Devin pushes the training code and plans four child sessions, each with its own VM and Modal job.

Each child gets one variant: a lower learning rate, a bigger LoRA rank, sixteen generations per prompt, or a partial-credit reward.

Inside one child, Devin launches its GRPO run on Modal and watches it train.

When they finish, the coordinator serves each best checkpoint and scores it on the same eval set.

Sixteen generations wins on validation and gets promoted. It scores eighty-two percent on eval, and Devin notes no variant is significantly better.

Next, I ask Devin to deploy the winner with modal deploy, add a feature flag to the app, and show it working in the browser.

Devin's testing agent opens the app in the session's browser.

With the flag set to frontier, gpt-4.1 writes the SQL.

Flipped to finetuned, the same question goes to our endpoint on Modal and returns the same rows.

Devin confirms the production endpoint is deployed on Modal, and nothing else is left running.

Step eight: the scorecard, filled in with the real numbers.

On the same two hundred questions, gpt-4.1 scores seventy-three and a half percent, the base 7B seventy-seven, fine-tuning seventy-nine, and the promoted GRPO model eighty-two. Only its lead over gpt-4.1 is statistically significant.

On a warm, busy H100 our model costs about forty-nine dollars per million queries, against nine hundred ninety-three for gpt-4.1, not counting cold starts or idle time. The latency differences between the Qwen models are noise.

Finally, I ask Devin to save the whole recipe as a playbook.

Devin drafts it as general steps, with this project as the worked example, and I create it.

Now it's an organization playbook, so the next task model starts from this recipe.

Devin did every step on its own, and I reviewed results instead of code.
