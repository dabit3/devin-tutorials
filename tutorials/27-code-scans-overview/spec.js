window.SPEC = {
  "title": "Code Scans, how it works",
  "subtitle": "An overview: scan a repo for one goal, then fix what it finds",
  "outro": "Scan for one goal, then let Devin fix what it finds",
  "voOutro": "Scan for one goal, then let Devin fix what it finds.",
  "speed": 3,
  "cps": 48,
  "capPos": "bottom",
  "capArrows": false,
  "edit": {
    "0000.png": {
      "scene": "idea", "hold": 6.0, "cursor": false,
      "cap": "Point Devin at a repo with one goal",
      "vo": "With Code Scans, you point Devin at a repository with one goal, and it reads the whole codebase and turns what it finds into findings you can fix."
    },
    "0010.png": {
      "scene": "flow1", "hold": 2.6, "fade": 14,
      "cap": "Describe what to find, Devin picks the scan type",
      "vo": "You describe what you want to find, Devin chooses the scan type from your request, and you confirm the repositories on its setup card."
    },
    "0011.png": {
      "hold": 2.6, "fade": 12,
      "cap": "The setup card, before the scan starts",
      "ring": { "x": 720, "y": 414.5, "w": 863, "h": 333 }
    },
    "0020.png": {
      "scene": "flow2", "hold": 2.4, "fade": 12, "ring": false,
      "cap": "The scan reads the code and lists findings",
      "vo": "The scan runs unattended, reads through the code, and lists what it finds in the scan's Findings tab."
    },
    "0021.png": {
      "hold": 2.4, "fade": 12, "ringFor": 2.0,
      "cap": "Findings, ranked by severity",
      "ring": { "x": 1008, "y": 470, "w": 775, "h": 340 }
    },
    "0030.png": {
      "scene": "flow3", "hold": 2.4, "fade": 12, "ring": false,
      "cap": "Assign a finding to Devin, get a pull request",
      "vo": "Assign a finding to Devin, and it starts a session that fixes it and opens a pull request for you to review."
    },
    "0031.png": {
      "hold": 1.9, "fade": 12, "ringFor": 1.6,
      "cam": { "x": 1008, "y": 560, "z": 1.25 }, "camDur": 0.01,
      "cap": "Fix with Devin starts the fix session",
      "ring": { "x": 1275.1, "y": 756.25, "w": 175, "h": 45 }
    },
    "0032.png": {
      "hold": 1.9, "fade": 12, "ringFor": 1.6, "cam": "reset", "camDur": 0.01,
      "cap": "The fix arrives as a pull request",
      "ring": { "x": 1000, "y": 262, "w": 760, "h": 156 }
    },
    "0040.png": {
      "scene": "flow4", "hold": 3.0, "fade": 12, "ring": false,
      "cap": "Scan new commits checks only what changed",
      "vo": "Once a scan completes, Scan new commits runs it again on only the commits added since the last run, and adds the new findings to the same scan."
    },
    "0041.png": {
      "hold": 2.6, "fade": 12,
      "cap": "Scan new commits, in the Findings tab",
      "ring": { "x": 1303, "y": 145, "w": 196, "h": 40 }
    },
    "0050.png": {
      "scene": "types", "hold": 5.6, "fade": 12, "ring": false,
      "cap": "Pick a scan type, or describe your own",
      "vo": "There are scan types for performance, database queries, test coverage, dead code, accessibility, compliance and more, plus a custom scan for anything else you describe."
    },
    "0060.png": {
      "scene": "uses", "hold": 6.0, "fade": 12,
      "cap": "Where scans pay off",
      "vo": "Teams use them to fix inefficient or unsafe database queries, remove dead code that is safe to delete, cover untested flows, and find custom issues, like places that log personal data."
    }
  }
};
