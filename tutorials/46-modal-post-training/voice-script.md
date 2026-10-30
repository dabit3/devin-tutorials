# Post-train a model on Modal, voice script

Narrated by Nader (ElevenLabs voice T8iHhGIWPm2GVYpQD1Am, eleven_multilingual_v2, default settings, no seed), recorded as one full-script take and cut at sentence boundaries. "SQL" is spoken as "sequel" (a `voSay` override in spec.js); captions keep "SQL".

In this video, we'll have Devin post-train Qwen3.8-27B, an open model, on Modal, so it turns plain-English questions into SQL. Modal runs each GPU job only while it's needed and serves the finished model as an endpoint that scales to zero, so you pay for training and traffic, not for idle servers.

I start one session and ask Devin to set the folder up for Modal training, check that auth works, and save the setup as a skill. The repo already has a small demo app we added beforehand, which uses gpt-6.1-sol.

Devin verifies the Modal token, runs a small GPU job, and proposes the setup as a skill, so future sessions start ready.

Next, the data. BIRD is a hard public text-to-SQL benchmark with real databases, and I ask for a fixed-seed split and a reward script that runs the SQL.

Devin builds one thousand thirty-four training questions and five hundred test questions. The reward runs both queries and compares the rows: one for a match, zero for a mismatch, and minus a half when the query fails.

Then the baseline. Devin measures accuracy, latency and cost on the test split for gpt-6.1-sol and for the base model on a Modal H100.

Before any training, the base model scores sixty-four percent and gpt-6.1-sol sixty-three point eight. That's a tie, but our model answers faster and costs about a tenth as much.

Now supervised fine-tuning: a LoRA run on one Modal H200, with checkpoints saved on a Modal volume.

Training takes eighteen minutes and lifts the model to sixty-six point four percent, but that gain isn't statistically significant yet.

Next comes reinforcement learning with GRPO on a B200. The reward script grades every answer the model tries by running it.

A two-step smoke test passes, so Devin launches the full run of two hundred fifty steps.

At step fifty-four, the run crashes on a slow scoring query. Devin finds the cause, fixes the scoring, and resumes from the last checkpoint.

The trained model reaches sixty-seven point four percent. Against the base model, that's suggestive but not conclusive.

Now the sweep. I ask for four managed Devins, each training one variant, and Devin holds out a validation set so the test set stays untouched.

The variants change the learning rate, the LoRA rank, the number of samples per question, or the reward itself.

While they train, Devin scores the untrained model on validation as a reference.

None of the four beats the base model on validation. The rank sixty-four variant wins the pick by one question and scores sixty-nine point four on test, but it now writes reasoning first, at about three times the cost.

So I ask Devin to deploy the earlier reinforcement learning model with modal deploy, as an endpoint that scales to zero, and show it in the demo app.

Devin adds a backend setting to the app and runs it twice, once with gpt-6.1-sol and once with our endpoint.

In the browser, both return the same average lap time for Lewis Hamilton, and our endpoint answers a little faster.

Step eight is the final scorecard on the five hundred test questions, with significance tests.

The deployed model scores sixty-seven point four percent, against sixty-three point eight for gpt-6.1-sol. That gap isn't statistically significant, but it costs about two hundred eighty dollars per million queries, against about twenty-five hundred.

Devin also spells out what that cost leaves out: cold starts, idle time, and the training itself.

Last, I ask Devin to save the whole recipe as a playbook.

Devin writes it up with the steps, the fixes it needed along the way, and what not to do, so the next model on new data is one request.

The big takeaway: start with a script that scores the answer. With that, Devin can train, compare, and deploy a model for your task, and the playbook lets you run it again on your own data.
