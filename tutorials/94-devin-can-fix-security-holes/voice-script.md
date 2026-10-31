# Voice script: Devin can find and fix the security holes in your repos

One narrated cut, Nader voice (T8iHhGIWPm2GVYpQD1Am), model from _kit/settings.json, generated as one take with _kit/tools/vo_onetake.py.

| Beat | Picture | Line |
|---|---|---|
| 0000.png | diagram: idea | Devin can find and fix the security holes in your repos. Here's how it works, on a small demo API with security bugs planted on purpose. |
| 0001.png | real UI | Devin Security keeps the findings from every scan in your organization on one page. |
| 0002.png | diagram: flow0 | It starts with a repository. Pick one, choose a scan effort, and hand it to Devin. |
| 0004.png | diagram: flow1 | First, Devin reads the code and drafts a threat model: what the app does, who might attack it, and what's worth protecting. |
| 0005.png | real UI | It asks a few quick questions to sharpen that model. Answering them is optional. |
| 0006.png | diagram: flow2 | Then the scan runs, and Devin ranks each finding against the threat model, so the worst risks rise to the top. |
| 0007.png | real UI | On the demo API, it found six issues, three of them critical. |
| 0009.png | real UI | Each finding explains what's wrong, who could exploit it, and exactly how. |
| 0010.png | real UI | Pick one, and click Assign to Devin. |
| 0011.png | diagram: flow3 | That starts a remediation session. Devin patches the code, writes tests for the hole, runs the test suite, and opens a pull request. |
| 0012.png | real UI | Here, it's rewriting the token check and running the tests. |
| 0013.png | real UI | The pull request lands in your repo, linked right on the finding. |
| 0014.png | real UI | Its new tests pass with the fix and fail against the old code, so your team reviews the proof, not just the patch. |
| outro | end card | Devin can find and fix the security holes in your repos, and your team still decides what ships. |
