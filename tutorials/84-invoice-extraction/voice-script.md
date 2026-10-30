# Train a receipt-extraction model on Modal, voice script

Narrated by Nader (ElevenLabs voice T8iHhGIWPm2GVYpQD1Am, eleven_multilingual_v2, default settings, no seed), recorded as one full-script take and cut at sentence boundaries. Model names are spoken through `voSay` overrides in spec.js ("Qwen three point eight twenty-seven B", "GPT six point one sol", "H one hundred", "H two hundred", "B two hundred"); captions keep the written form. Costs are quoted at 8 requests in flight.

In this video, we'll have Devin post-train Qwen3.8-27B, an open model on Modal, so it turns the text of scanned receipts into clean JSON for accounts payable. Modal runs each GPU job only while it's needed and bills by the second, runs a sweep of jobs side by side, and serves the finished model as an endpoint that scales to zero when nobody calls it.

I start one session and ask Devin to follow our saved playbook for a new task: set the folder up for Modal, check auth, and save the setup as a skill.

Next, the data: two public receipt sets, Malaysian store receipts and Indonesian restaurant receipts with line items. Five hundred are held out for the test.

The grading rule checks each field after cleanup, checks that line items add up, and takes half a point off for broken JSON. Note that Indonesian prices use a dot for thousands: thirty-nine dot zero zero zero means thirty-nine thousand.

Then the baseline: gpt-6.1-sol and the untrained model on a Modal H100, with the same prompt.

gpt-6.1-sol gets sixty-two point four percent of receipts exactly right, and eighty-eight point eight percent of fields. The base model gets forty-seven point four and seventy-five point six.

Here's why. A total of forty-three thousand six hundred thirty-six rupiah is printed with a dot, and the base model reads it as forty-three point six. That happens on sixty-six Indonesian receipts.

Step four is supervised fine-tuning: a LoRA run on one Modal H200, with checkpoints saved on a Modal volume.

Ten minutes of training later, the model gets seventy-two point six percent of receipts exactly right, against sixty-two point four for gpt-6.1-sol. That gap is statistically significant.

And the thousands problem is gone. After training, none of its totals are off by a factor of a thousand, and it learned to leave registration numbers out of company names.

Next, reinforcement learning with GRPO on a B200, starting from the base model. The grading rule scores every answer the model tries.

After an hour, it gets sixty-three percent exactly right: a tie with gpt-6.1-sol, well behind fine-tuning. Most groups of answers soon scored the same, leaving little to learn from.

So the sweep starts from the fine-tuned model. Devin holds out one hundred twenty-six training receipts for validation, and four managed Devins train one variant each, in parallel on Modal.

The variants change the learning rate, the LoRA rank, or the number of answers per receipt, or they add a bonus for a fully correct receipt.

The reward bonus wins on validation by less than one point, which is within chance. The run with sixteen answers per receipt collapsed midway, then recovered.

Only then is the winner scored on the test set: seventy-three point four percent exactly right, about the same as the first fine-tuned model.

Step seven deploys the winner with modal deploy, as an endpoint behind an API key that scales to zero, and adds a backend setting to the demo app.

In the browser, gpt-6.1-sol and our endpoint read the same held-out receipt and return the same correct JSON, in about three and a half seconds each.

Step eight is the final scorecard on the five hundred test receipts, with significance tests.

The deployed model gets seventy-three point four percent of receipts exactly right, against sixty-two point four for gpt-6.1-sol, and ninety-two point seven percent of fields against eighty-eight point eight. Both gaps are significant. With eight requests in flight, it costs about four hundred dollars per million receipts, against about fifteen hundred.

Devin is plain about the rest. Fine-tuning drove the gain, and GRPO and the sweep added nothing measurable on top. The cost also leaves out cold starts, idle time, training and storage.

That's how you post-train an open model on Modal: grade every field, fine-tune on labeled receipts, and test each gain for significance before you deploy.
