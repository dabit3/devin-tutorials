# Train a tariff-code model on Modal, voice script

Narrated by Nader (ElevenLabs voice T8iHhGIWPm2GVYpQD1Am, eleven_multilingual_v2, default settings, no seed), recorded as one full-script take and cut at sentence boundaries. Spoken forms live in `voSay` overrides in spec.js (for example "H-S code", "GPT six point one sol", "Qwen three point eight twenty-seven B"); captions keep the written form.

In this video, we'll have Devin post-train Qwen3.8-27B, an open model, on Modal, so it reads a product description from an invoice and returns its H-S tariff code.

Modal runs each GPU job only while it's needed and bills by the second, so Devin can run a whole sweep in parallel and serve the finished model as an endpoint that scales to zero.

Importers and customs brokers classify thousands of products, and a wrong code means paying the wrong duty.

I start one session and ask Devin to follow our saved playbook for post-training on Modal, so this new task reuses the same recipe.

First, Devin sets up the folder, checks the Modal login, and saves the setup as a skill.

Step two is the data: public U.S. Customs rulings, each a product description with its official code.

The grading rule gives full credit for the exact six-digit code, half for the right four-digit heading, a quarter for the right chapter, and a penalty when there's no valid code.

Devin cleans the rulings down to 13,555 and sets aside 1,000 for the final test.

Step three is the baseline. Both models get the same short prompt, with no examples.

gpt-6.1-sol gets 63% of codes exactly right. The base open model gets only 19%.

Step four is supervised fine-tuning with LoRA on one H200 GPU.

Devin launches the job on Modal, watches the logs, and scores the result. Training takes about seventeen minutes.

Fine-tuning lifts exact accuracy from 19% to 56%, but gpt-6.1-sol is still ahead.

Step five is reinforcement learning with GRPO on a B200, starting from the base model and scored by the grading rule.

Partway through, Devin spots a problem. The reward only checked the first code, so the model learned to keep writing until it hit the length limit.

On the test set, exact accuracy falls to 13.7%. Devin explains why and suggests three fixes.

I ask for all three: start from the fine-tuned model, penalize anything after the code, and use more prompts per step.

The fixed run reaches 58.2%, and no answer runs to the limit. The gain over fine-tuning alone is borderline.

Step six is a sweep. Four managed Devins each train one variant in parallel: learning rate, LoRA rank, generations per prompt, and reward shaping.

Each variant is scored on 500 examples held out from training, so the test set stays untouched.

No variant clearly beats the fine-tuned reference. A higher learning rate or a larger rank makes it worse, and reward shaping wins by a single example, so Devin promotes it.

On the test set, the promoted model scores 56.9%.

Step seven deploys that model as an endpoint behind an API key that scales to zero, and adds a backend setting to the demo app.

Devin opens the app with gpt-6.1-sol and classifies a men's acrylic knit pullover.

It returns 6110.30: knitted sweaters of man-made fibres.

Now the same product through our endpoint.

Same code, in about half a second instead of two. The base model had picked 6110.20, the line for cotton.

Step eight is the final scorecard on the 1,000 test examples, with significance tests.

Training closes most of the gap, from 19% to 57%. gpt-6.1-sol stays about six points ahead, and that difference is significant.

But at 128 requests in flight, our model costs about $14 per million requests, against about $1,367 for gpt-6.1-sol, and it answers about five times faster.

The cost leaves out cold starts, idle time, training, and storage, and the differences against the other trained models aren't significant.

That's how you post-train an open model for your own task: grade the answer with a script, compare against a frontier model, and let Devin train, sweep, deploy, and report honestly where it lands.
