# Post-training on Modal: how it works (overview), voice script

Narrated by Nader (ElevenLabs voice T8iHhGIWPm2GVYpQD1Am, eleven_multilingual_v2, default settings, no seed), recorded as one full-script take and cut at sentence boundaries. "SQL" is spoken as "sequel" and GPU names like "H100" as "H one hundred" (`voSay` overrides in spec.js).

In this video, Devin trains an open model on Modal and deploys it as an API. Then we compare it with OpenAI's GPT model. Our example turns plain-English questions into SQL. The same steps work for any task where a script can score the answer.

Devin runs each step an ML engineer would, from the dataset to the deploy. Each step lands as a pull request. Modal provides GPUs on demand and hosts the finished model. You pay only while it runs.

First, I ask for training and test splits from BIRD, a public set of hard SQL questions. I also ask for a reward that runs the SQL.

The reward runs the SQL instead of asking an AI judge. Correct rows score one, and wrong rows score zero. SQL that fails to run scores minus a half.

Before training, the base model already matched the GPT model on five hundred test questions.

Next, Devin fine-tunes the model and runs reinforcement learning with that reward. Then it starts four managed Devins. Each one has its own machine and its own Modal job.

Each one tries a different learning rate, LoRA rank, number of answers per question, or reward.

Devin picks the winner by validation score. None of the four beat the base model there. The winner's test gain came from long reasoning, at three times the cost. So we deploy the earlier reinforcement learning model.

Devin deploys our trained model with modal deploy, as an OpenAI-compatible API endpoint. Here, the demo app answers a question with the GPT model first.

Here is the same question, answered by our model's endpoint on Modal. It returns the same rows.

The trained model scored sixty-seven point four percent. The GPT model scored sixty-three point eight. That gap could still be chance. Our model answers faster. On an H100 that is already running, it costs about two hundred eighty dollars per million queries. The GPT model costs about twenty-five hundred. Those numbers leave out cold starts and idle time.

To recap, we gave Devin a script that scores answers and a baseline to beat. Devin trained the model and compared four variants in parallel. Then it deployed the earlier reinforcement learning model as an endpoint.

That's how Devin trains and deploys your own model on Modal. Everything starts with a script that scores the answer. A playbook lets you run the same steps on your own data.
