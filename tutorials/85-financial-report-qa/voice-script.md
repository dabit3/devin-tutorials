# Post-train a model for financial report questions, voice script

Narrated by Nader (ElevenLabs voice T8iHhGIWPm2GVYpQD1Am, eleven_multilingual_v2, default settings), recorded as one full-script take and cut at sentence boundaries. Captions and this script use written forms; spoken forms live in `voSay` overrides in spec.js (for example "Qwen3.8-27B" is spoken "Qwen three point eight twenty-seven B", "FinQA" as "Fin Q A", "GRPO" as "G R P O", and numbers are spelled out).

In this video, we'll have Devin post-train Qwen3.8-27B, an open model, on Modal, so it answers numeric questions about earnings reports. Modal runs each GPU job only while it's needed and bills by the second, runs a whole sweep in parallel, and serves the finished model as an endpoint that scales to zero.

I start one session and ask Devin to set the folder up for Modal, follow the playbook we saved in an earlier video, and check that auth works.

Devin verifies the Modal token, runs a small GPU job, and saves the setup as a skill.

Next, the data. FinQA has real pages from S&P 500 annual reports, each with text, a table and a question whose answer is a number.

Devin builds a fixed split: 5,827 training questions, 300 for validation, and all 1,127 test questions. The reward gives one point when the number is within 1% of the gold answer, zero when it's wrong, and minus a half when there's no number at all.

Then the baseline. Every model gets the same prompt: show a few short calculation lines, then end with one answer line.

gpt-6.1-sol gets 80.2%. The base model gets 77%, and 36 of its answers run on until they hit the token cap.

Now supervised fine-tuning. FinQA ships the calculation behind each answer, so Devin writes those out as short worked answers and trains a LoRA on one Modal H200.

78 minutes later, the model scores 80.3%, and not one answer hits the cap.

Here's one of those runaway answers. The base model argues with itself for 1,000 tokens and never answers. After fine-tuning, it's one line of math and the right number.

Next, reinforcement learning with GRPO, starting from the base model on a B200 and graded by the same reward script.

The run takes about 2 hours and 45 minutes.

GRPO lifts the base model to 79%, but it stays below fine-tuning, and 22 answers still hit the cap.

Now the sweep. I ask for four managed Devins, each training one variant, scored only on 300 validation questions, so the test set stays untouched.

The variants change the learning rate, the LoRA rank, the number of samples per question, or the reward itself.

Before they start, I ask for two changes: start from the fine-tuned model, and use two H200s each, since B200s are scarce right now and the inference server needs its own GPU.

One run crashes at step 57 on a prompt longer than the context. The length filter was counting the wrong thing, so Devin fixes it and resumes from the last checkpoint.

None of the four beats the fine-tuned model's 243 out of 300. The rank-64 run is clearly worse, and often flips the sign of a change.

So the fine-tuned model is promoted. The best variant still gets one test run for the scorecard.

Step seven is the deploy. Devin serves the fine-tuned model with modal deploy, behind an API key, scaling to zero, and adds a backend setting to the demo app.

The first deploy fails because the server's default settings don't fit on one H100. Devin lowers the limit and deploys again.

Devin's own browser test asks the app about the change in operating cash flow on a 2007 annual report page, first with gpt-6.1-sol.

It answers 67.66% in about 2.7 seconds.

Then with our endpoint, same page, same question.

Same answer, in about 2 seconds.

Step eight is the final scorecard on all 1,127 test questions, with significance tests.

The deployed model scores 80.3%, against 80.2% for gpt-6.1-sol. That's a tie, but it answers faster and costs about $114 per million questions, against about $2,700.

After a Holm correction, only the gain over the base model is significant. The gaps to gpt-6.1-sol, GRPO and the sweep winner are not.

Devin also spells out what the cost leaves out: cold starts, idle time, training, and storage.

That's how you post-train a model for your own task. Start with a script that scores the answer, and Devin can train, compare, and deploy a model that matches the frontier at a fraction of the cost.
