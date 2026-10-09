window.SPEC = {
  "title": "Security Swarm",
  "subtitle": "How it works, in about a minute",
  "outro": "Many Devins, one repo, real evidence",
  "voOutro": "That's Security Swarm: many Devins working through your repo in parallel, with evidence for what they find.",
  "pace": 1,
  "usesStep": 3.0,
  "chainA": 3.8,
  "chainB": 6.6,
  "chainShift": 6.6,
  "capPos": "bottom",
  "edit": {
    "0000.png": {
      "scene": "idea", "hold": 5.4, "cursor": false,
      "cap": "Security Swarm divides your repo among parallel Devins",
      "vo": "Security Swarm finds, validates, and helps fix security vulnerabilities by dividing your repo among many Devins that work in parallel, for broad coverage and deep investigation."
    },
    "0001.png": {
      "scene": "flow1", "hold": 3.6,
      "cap": "First, Devin writes a threat model for your code",
      "vo": "First, Devin reads your repo and writes a threat model for it, a set of rules for what to look for in this code."
    },
    "0002.png": {
      "hold": 2.4, "capPos": "auto",
      "cap": "The rules Devin proposed for orbit-api-demo",
      "ring": { "x": 357.4, "y": 214.4, "w": 682, "h": 390 }, "ringFor": 2.4
    },
    "0003.png": {
      "cursor": true, "dwell": 1.4, "hold": 1.6, "capPos": "auto",
      "cap": "In interactive mode, you approve them first",
      "ring": true, "ringFor": 2.2,
      "vo": "In interactive mode, you review those rules and approve them before the scan begins."
    },
    "0004.png": {
      "scene": "flow2", "hold": 4.6, "cursor": false,
      "cap": "Each batch of files gets its own Devin, in parallel",
      "vo": "The rules pick out the files worth a closer look, and each small batch of them goes to its own Devin, with every batch investigated in parallel."
    },
    "0005.png": {
      "scene": "flow3", "hold": 3.8,
      "cap": "Results are combined into one repo-wide view",
      "vo": "Their results are combined into one view of the whole repo, ranked by severity, with duplicates merged."
    },
    "0006.png": {
      "hold": 2.4, "capPos": "auto",
      "cap": "The real findings, grouped by severity",
      "ring": { "x": 358.7, "y": 158.6, "w": 689, "h": 254 }, "ringFor": 2.4
    },
    "0007.png": {
      "scene": "flow4", "hold": 3.8,
      "cap": "A separate Devin tries to reproduce each finding",
      "vo": "If sandbox validation is on, a separate Devin then tries to reproduce each finding in an isolated sandbox, which gives you stronger evidence that it's real."
    },
    "0008.png": {
      "hold": 2.4, "capPos": "auto",
      "cap": "Reproduced in a sandbox: Confirmed",
      "ring": { "x": 882.5, "y": 124.8, "w": 266, "h": 42 }, "ringFor": 2.4
    },
    "0009.png": {
      "scene": "flow5", "hold": 3.6,
      "cap": "Assign a finding to Devin to get a fix PR",
      "vo": "When you're ready, assign a finding to Devin, and it opens a pull request with the fix, tracked right on the finding."
    },
    "0010.png": {
      "hold": 2.4, "capPos": "auto",
      "cap": "The fix PR, tracked on the finding",
      "ring": { "x": 644.6, "y": 374.3, "w": 86, "h": 42 }, "ringFor": 2.4
    },
    "0011.png": {
      "scene": "chain", "hold": 5.6,
      "cap": "Two issues in two files, combined into one critical finding",
      "vo": "And because the results are combined, it can connect issues across files: here, one file trusted a header to say who you are, and another only checked for the admin role, so one header made anyone the admin."
    },
    "0012.png": {
      "scene": "uses", "hold": 6.6,
      "cap": "Where it helps most",
      "vo": "Use it for a deep first review of a high-risk codebase, for Auto Scans that check only the new commits on a schedule, for multi-repo scans of services that call each other, and to triage findings from the scanners you already use."
    }
  }
};
