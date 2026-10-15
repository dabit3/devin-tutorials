# Post-training on Modal: how it works (overview), voice script

Narrated by Nader (ElevenLabs voice T8iHhGIWPm2GVYpQD1Am, default settings, no seed), recorded as one full-script take and cut at sentence boundaries.

Devin can post-train a small open model on Modal and swap it in for a frontier API on one narrow task: text-to-SQL.

It runs the whole loop an ML engineer would, from dataset to deploy.

I ask for Spider splits with their databases, and a reward that runs the SQL.

The reward is checked by the computer, not an AI judge: right rows score one, wrong rows zero, and failed SQL minus a half.

On two hundred held-out questions, the base 7B already matched gpt-4.1.

After fine-tuning and GRPO, one coordinator starts four managed Devins, each with its own VM and Modal job.

Each one tries a different learning rate, LoRA rank, generation count, or reward shaping.

Devin promotes the winner by validation score: eighty-two percent on eval, within noise of the others.

Then it deploys the winner with modal deploy, behind a feature flag, shown here on gpt-4.1.

With the flag flipped, the same question goes to our own model on Modal.

The tuned 7B beat gpt-4.1 by eight and a half points, though each training step's gain alone was within noise. On a warm H100 it cost forty-nine dollars per million queries to gpt-4.1's nine hundred ninety-three, before cold starts and idle time.

Save the recipe as a playbook, and Devin can run it again on your own data.
