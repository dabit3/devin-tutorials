# Post-train a model on Modal, voice script

Narrated by Nader (ElevenLabs voice T8iHhGIWPm2GVYpQD1Am, eleven_multilingual_v2, default settings, no seed), recorded as one full-script take and cut at sentence boundaries. "SQL" is spoken as "sequel" and GPU names like "H100" as "H one hundred" (`voSay` overrides in spec.js).

In this video, Devin trains an open model on Modal to write SQL from plain-English questions. The model is Qwen, with twenty-seven billion parameters. Modal starts a GPU for each job and stops it when the job ends. The finished model runs as an endpoint that scales to zero, so idle time costs nothing.

I start a session and ask Devin to set up the folder for Modal training. I also ask it to check the Modal login and save the setup as a skill. We added a small demo app to the repo beforehand. It uses OpenAI's GPT model.

Devin checks the Modal token and runs a small GPU job. Then it suggests a skill with the setup, so future sessions start ready.

Next comes the data. BIRD is a public set of hard SQL questions with their databases. I ask Devin to split it with a fixed seed. I also ask for a reward script that runs the SQL.

Devin makes one thousand thirty-four training questions and five hundred test questions. The reward script runs the model's query and the correct query, then compares the rows. A match scores one, and a mismatch scores zero. A query that fails to run scores minus a half.

Then comes the baseline. Devin measures accuracy, speed, and cost on the test questions. On a Modal H100, it tests the untrained Qwen model and the GPT model.

Before training, the Qwen model scores sixty-four percent, and the GPT model scores sixty-three point eight. That is a tie. Our model answers faster and costs about a tenth as much.

Now Devin fine-tunes the model on the training questions and their answers. The run uses LoRA on one Modal H200. Checkpoints save to a Modal volume.

Training takes eighteen minutes. The model reaches sixty-six point four percent. That gain is still small enough to be chance.

Next, Devin runs reinforcement learning with GRPO on a B200. The model tries several answers to each question. The reward script runs each answer and scores it.

A short two-step test run passes. Devin then starts the full run of two hundred fifty steps.

At step fifty-four, the run crashes on a slow scoring query. Devin finds the cause and fixes the scoring. Then it restarts from the last checkpoint.

The trained model reaches sixty-seven point four percent. The gain over the base model looks likely, but the test cannot confirm it.

Now comes the sweep. I ask for four managed Devins, and each one trains one variant. Each managed Devin is its own session with its own machine. Devin holds back a validation set, so the test set stays untouched.

The variants change the learning rate, the LoRA rank, the answers per question, or the reward.

While they train, Devin scores the untrained model on the validation set. That score is the reference.

None of the four beats the base model on validation. The rank sixty-four variant wins by one question. It scores sixty-nine point four percent on test. But it now writes its reasoning first, at about three times the cost.

So I ask Devin to deploy the earlier reinforcement learning model instead. It uses modal deploy to make an endpoint that scales to zero. I also ask Devin to show it in the demo app.

Devin adds a setting to choose the app's backend. Then it runs the app twice, once with the GPT model and once with our endpoint.

In the browser, both return the same average lap time for Lewis Hamilton. Our endpoint answers a little faster.

Step eight is the final scorecard on the five hundred test questions. It includes significance tests.

The deployed model scores sixty-seven point four percent. The GPT model scores sixty-three point eight. That gap could still be chance. Our model costs about two hundred eighty dollars per million queries. The GPT model costs about twenty-five hundred.

Devin also lists what that cost leaves out. It does not include cold starts, idle time, or the training itself.

Last, I ask Devin to save the whole process as a playbook.

Devin writes down the steps, the fixes it needed, and what to avoid. With the playbook, the next model on new data takes one request.

That's how Devin trains and deploys your own model on Modal. Everything starts with a script that scores the answer. The playbook lets you run the same steps on your own data.
