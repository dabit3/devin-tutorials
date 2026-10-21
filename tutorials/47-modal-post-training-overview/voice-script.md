# Post-training on Modal: how it works (overview), voice script

Narrated by Nader (ElevenLabs voice T8iHhGIWPm2GVYpQD1Am, eleven_multilingual_v2, default settings, no seed), recorded as one full-script take and cut at sentence boundaries.

In this video, we'll have Devin post-train Qwen3.8-27B, an open model, on Modal, check it against gpt-6.1-sol, and deploy it as an API endpoint our app can call. Our example is text-to-SQL, but the same steps work for any task where a script can score the answer.

Devin runs every step an ML engineer would, from dataset to deploy, and each step lands as a pull request. Modal provides the GPUs on demand and hosts the finished model, so you only pay while it runs.

First, I ask for training and test splits from BIRD, a hard public text-to-SQL benchmark, and a reward that runs the SQL.

The reward runs the SQL instead of asking an AI judge. Right rows score one, wrong rows score zero, and SQL that fails to run scores minus a half.

Before any training, the base model already matched gpt-6.1-sol on five hundred held-out questions.

Next, Devin fine-tunes the model and runs reinforcement learning with that reward. Then it starts four managed Devins, each with its own VM and Modal job.

Each one tries a different learning rate, LoRA rank, generation count, or reward shaping.

Devin picks the winner by validation score. None of the four beat the base model there, and the winner's test gain came from long reasoning at three times the cost, so we deploy the earlier reinforcement learning model.

Then Devin deploys our trained model with modal deploy, as an OpenAI-compatible API endpoint. Here's the demo app answering a question with gpt-6.1-sol first.

And here's the same question answered by our model's endpoint on Modal, with the same rows back.

The trained model scored sixty-seven point four percent, against sixty-three point eight for gpt-6.1-sol. That gap isn't statistically significant, but it answers faster, and on a warm H100 it costs about two hundred eighty dollars per million queries, against about twenty-five hundred for gpt-6.1-sol, before cold starts and idle time.

To recap, we gave Devin a script that scores answers and a baseline to beat. It trained the model, compared four variants in parallel, and deployed the model that held up as an endpoint.

The big takeaway: start with a script that scores the answer. With that, Devin can train, compare, and deploy a model for your task, and a playbook lets you run it again on your own data.
