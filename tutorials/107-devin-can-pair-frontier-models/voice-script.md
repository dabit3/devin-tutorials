# 107: Devin can pair frontier models on one task (Fusion): voice script

Narrator: Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, model from `_kit/settings.json`), one whole-script take cut into lines by `_kit/tools/vo.py`.
Claims follow https://docs.devin.ai/cli/fusion and the Fusion card in the Devin web model picker.

**0000.png: Title + idea (diagram)**  
Devin can pair frontier models on one task. With Fusion, a frontier lead and a cost-efficient sidekick work together as a single Devin.

**0001.png: Lead and sidekick roles (diagram)**  
The lead owns the task. It plans, investigates, and makes the design decisions and the correctness-critical calls. The sidekick executes that plan. It writes the code, runs builds and tests, and verifies the changes. You talk to one Devin, and the pairing happens behind the scenes.

**0002.png: Model picker (real UI)**  
In the Devin web app, Fusion sits at the top of the model picker.

**0003.png: Fusion hover card (real UI)**  
Its card describes the pairing: frontier models like Opus, Fable, and GPT-6 Astra, with a cost-efficient sidekick.

**0004.png: The task in the composer (real UI)**  
Here's a real task for an existing kanban app: add work-in-progress limits, then lint, build, test it in the browser, and open a pull request.

**0005.png: Plan on a real task (diagram)**  
The lead reads the code and turns the request into four tasks. Then the sidekick carries them out, one by one.

**0006.png: Tasks panel under sidekick (real UI)**  
In the session, the Tasks panel shows that work under the sidekick.

**0007.png: Devin's browser check (real UI)**  
Lint and build pass, and Devin checks the board in its own browser. The full column turns red, and a toast blocks the drop.

**0008.png: PR #116 in the session (real UI)**  
Then it opens the pull request, with every change ready for review.

**0009.png: Session finished, 4/4 tasks (real UI)**  
With all four tasks done, Devin reports exactly which checks the change got: lint, build, and its own browser test.

**0010.png: When to choose Fusion (diagram)**  
Choose Fusion when you want top-tier quality on a complex task. Routine work runs on the cheaper sidekick, and each model bills at its own rate. In Devin CLI and Desktop, you can also pick the pairing: the lead, its effort, and the sidekick.

**Outro**  
Pick Fusion, and give Devin the whole task.
