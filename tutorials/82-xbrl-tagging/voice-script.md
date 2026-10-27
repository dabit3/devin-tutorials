# Tutorial 82 narration

Voice: Nader (`T8iHhGIWPm2GVYpQD1Am`), ElevenLabs `eleven_multilingual_v2`. Spoken forms (`voSay`) are what ElevenLabs reads; captions keep the written technical names.

- `0000.png`: In this video, we'll have Devin post-train Qwen three point eight twenty-seven B, an open model on Modal, to tag the numbers in SEC filings with their XBRL tags.
- `0001.png`: We use Modal because each GPU job runs only while it's needed and bills by the second. Sweep variants run side by side, and the finished model is served from an endpoint that scales to zero.
- `0002.png`: Finance teams tag every number in a ten-K by hand or pay a vendor for it. I ask Devin to set this folder up for Modal and follow the playbook we saved from an earlier project.
- `0005.png`: Devin checks the Modal token with a small GPU job and saves the setup as a skill.
- `0006.png`: Next, the data. FiNER one thirty-nine has sentences from real filings, labelled with one hundred thirty-nine US GAAP tags.
- `0011.png`: Devin builds six hundred test sentences, including one hundred with no tag, so a model can't score by tagging every number. The grade is F1 over value and tag pairs, and broken JSON costs half a point.
- `0012.png`: Then the baseline. Both models get one shared prompt that lists all one hundred thirty-nine tags.
- `0020.png`: GPT six point one sol scores sixty-eight point four percent F1 and the base model fifty-seven point nine. But the base model costs about ninety-nine dollars per million requests, against three thousand four hundred nine.
- `0021.png`: Step four is LoRA fine-tuning on one Modal H200, with checkpoints saved on a Modal volume.
- `0023.png`: Devin fixes the maximum length and the launch command, then starts the full run.
- `0029.png`: After forty-nine minutes of training, the fine-tuned model scores seventy-four point one percent. That's ahead of GPT six point one sol, and the gap is statistically significant.
- `0030.png`: Step five is GRPO on a B200, where the model learns straight from the grading script.
- `0032.png`: A smoke test passes, so Devin launches the full run of two hundred fifty steps.
- `0038.png`: GRPO reaches seventy point three percent. That ties GPT six point one sol and trails fine-tuning. Late in the run, most groups of answers got the same score, so there was little left to learn.
- `0039.png`: So the sweep starts from the fine-tuned model. Four managed Devins each train one variant, with a new learning rate, LoRA rank, answer count or reward.
- `0041.png`: A validation set held out from training picks the winner, so the test set stays untouched.
- `0043.png`: Then the jobs sat in the queue for over an hour, because Modal had no B200 capacity free.
- `0045.png`: Devin lays out the options and waits for a decision.
- `0046.png`: I ask it to relaunch each variant on two H200s, with vLLM on its own GPU. The hardware changed, but the settings, steps and data did not, so the comparison holds.
- `0047.png`: A smoke test of the heaviest variant passes, and all four relaunch.
- `0056.png`: Over the next few hours, the validation scores come in.
- `0058.png`: When all four finish, I ask Devin to build the validation table, promote the best, and score only that model on the test set.
- `0063.png`: Shaped reward wins the validation pick by a tenth of a point, which is a tie with plain fine-tuning. On test, it scores the same seventy-four point one percent, with fewer exact sentences.
- `0064.png`: I deploy the fine-tuned model instead. It had more exact matches on validation and answers faster. I chose it after the test run, so the test wasn't untouched for that one decision.
- `0065.png`: Devin deploys it with modal deploy, behind an API key, as an endpoint that scales to zero. Then it adds a backend setting to the demo app.
- `0069.png`: In the browser, the app tags one sentence with GPT six point one sol and with our endpoint. They pick different tags, and our endpoint answers in one point three seconds against two point three.
- `0072.png`: Step eight is the final scorecard on the six hundred test sentences, with significance tests.
- `0078.png`: The deployed model scores seventy-four point one percent, against sixty-eight point four for GPT six point one sol. After Holm correction, that gap is significant. It costs about ninety-one dollars per million requests, against three thousand four hundred nine, before cold starts, idle time and training.
- `0079.png`: Here's one real test sentence: one hundred forty-five point six million was outstanding under a credit agreement. Base Qwen tagged it as borrowing capacity. The trained model tagged it as the line of credit, the amount actually owed, which matches the label.

Outro: That's how you post-train a model for your own task. Write the grading script first, then let Devin train, compare and deploy it on Modal, and say plainly what the numbers show.
