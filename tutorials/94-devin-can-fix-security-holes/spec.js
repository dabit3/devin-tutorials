window.SPEC = {
  "title": "Find and fix the security holes in your repos",
  "eyebrow": "Devin can",
  "subtitle": "From a security scan to a tested pull request",
  "outro": "Find the holes. Ship the fix, with tests.",
  "voOutro": "Devin can find and fix the security holes in your repos, and your team still decides what ships.",
  "introHold": 5.0,
  "outroVoDelay": -0.3,
  "pace": 1,
  "capPos": "bottom",
  "edit": {
    "0000.png": {
      "scene": "idea", "hold": 2.3, "voDelay": -4.1, "cursor": false,
      "cap": "Devin can find and fix the security holes in your repos",
      "vo": "Devin can find and fix the security holes in your repos. Here's how it works, on a small demo API with security bugs planted on purpose."
    },
    "0001.png": {
      "hold": 4.2, "cursor": false, "capPos": "auto",
      "capPos": { "x": 0.62, "y": 0.93 }, "subPos": { "x": 0.62, "y": 0.93 }, "cap": "Devin Security: every finding in your organization",
      "ring": { "x": 613, "y": 123, "w": 334, "h": 34 }, "ringFor": 3.4,
      "vo": "Devin Security keeps the findings from every scan in your organization on one page."
    },
    "0002.png": {
      "scene": "flow0", "hold": 4.4, "cursor": false,
      "cap": "Pick a repo and a scan effort",
      "vo": "It starts with a repository. Pick one, choose a scan effort, and hand it to Devin."
    },
    "0003.png": {
      "cursor": true, "dwell": 1.0, "hold": 1.2, "capPos": "auto",
      "capPos": { "x": 0.72, "y": 0.94 }, "cap": "A Normal scan of the demo API",
      "ring": true, "ringFor": 1.8
    },
    "0004.png": {
      "scene": "flow1", "hold": 5.6, "cursor": false,
      "cap": "First, Devin drafts a threat model",
      "vo": "First, Devin reads the code and drafts a threat model: what the app does, who might attack it, and what's worth protecting."
    },
    "0005.png": {
      "hold": 3.6, "cursor": false, "capPos": "auto",
      "capPos": { "x": 0.7, "y": 0.62 }, "subPos": { "x": 0.7, "y": 0.62 }, "cap": "A few quick questions sharpen the model",
      "ring": { "x": 289, "y": 574, "w": 556, "h": 450 }, "ringFor": 3.2,
      "vo": "It asks a few quick questions to sharpen that model. Answering them is optional."
    },
    "0006.png": {
      "scene": "flow2", "hold": 5.0, "cursor": false,
      "cap": "Findings are ranked against the threat model",
      "vo": "Then the scan runs, and Devin ranks each finding against the threat model, so the worst risks rise to the top."
    },
    "0007.png": {
      "hold": 3.4, "cursor": false, "capPos": "auto",
      "capPos": { "x": 0.7, "y": 0.8 }, "subPos": { "x": 0.7, "y": 0.8 }, "cap": "Six findings, three of them critical",
      "hl": true,
      "vo": "On the demo API, it found six issues, three of them critical."
    },
    "0008.png": {
      "cursor": true, "dwell": 0.8, "hold": 0.8, "capPos": "auto",
      "capPos": { "x": 0.7, "y": 0.8 }, "cap": "Open the alg none token bypass"
    },
    "0009.png": {
      "hold": 3.6, "cursor": false, "capPos": "auto",
      "capPos": { "x": 0.7, "y": 0.93 }, "subPos": { "x": 0.7, "y": 0.8 }, "cap": "What's wrong, who can exploit it, and how",
      "ring": { "x": 1009, "y": 462, "w": 800, "h": 76 }, "ringFor": 3.2,
      "vo": "Each finding explains what's wrong, who could exploit it, and exactly how."
    },
    "0010.png": {
      "cursor": true, "dwell": 1.0, "hold": 1.0, "capPos": "auto",
      "capPos": { "x": 0.7, "y": 0.93 }, "subPos": { "x": 0.7, "y": 0.93 }, "cap": "Assign to Devin",
      "ring": true, "ringFor": 1.6,
      "vo": "Pick one, and click Assign to Devin."
    },
    "0011.png": {
      "scene": "flow3", "hold": 6.2, "cursor": false,
      "cap": "A remediation session patches, tests, and opens a PR",
      "vo": "That starts a remediation session. Devin patches the code, writes tests for the hole, runs the test suite, and opens a pull request."
    },
    "0012.png": {
      "hold": 3.2, "cursor": false, "capPos": "auto",
      "capPos": { "x": 0.7, "y": 0.93 }, "subPos": { "x": 0.7, "y": 0.93 }, "cap": "The real session: rewriting the token check",
      "vo": "Here, it's rewriting the token check and running the tests."
    },
    "0013.png": {
      "hold": 3.6, "cursor": false, "capPos": "auto",
      "cap": "The pull request, opened by Devin",
      "hl": true,
      "vo": "The pull request lands in your repo, linked right on the finding."
    },
    "0014.png": {
      "hold": 5.4, "cursor": false, "capPos": "auto",
      "cap": "6 of 6 tests pass; the alg none tests fail on the old code",
      "hl": true,
      "vo": "Its alg-none test passes with the fix and fails against the old code, so your team reviews the proof, not just the patch."
    }
  }
};
