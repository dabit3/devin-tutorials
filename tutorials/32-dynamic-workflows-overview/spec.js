window.SPEC = {
  "title": "Dynamic Workflows",
  "subtitle": "How it works, and when to use it",
  "outro": "Describe the work. Devin writes the orchestration",
  "voOutro": "Describe the work, and Devin writes the orchestration.",
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.6,
  "edit": {
    "0000.png": {
      "scene": "idea", "hold": 6.6, "voHold": 4.8, "cursor": false, "capPos": "bottom",
      "cap": "Devin writes the orchestration as code",
      "vo": "With dynamic workflows, Devin writes a Python script that runs a whole team of Devin agents for you.",
      "hl": null
    },
    "0001.png": {
      "scene": "flow", "hold": 7.6, "voHold": 6.4, "cursor": false, "capPos": "bottom",
      "cap": "Earlier results build later prompts",
      "vo": "The script decides which agents run, in what order, and what each one is told, using earlier results to build later prompts.",
      "hl": null
    },
    "0002.png": {
      "hold": 3.2, "cursor": false,
      "ring": { "x": 721, "y": 405, "w": 860, "h": 152 }, "ringFor": 2.8,
      "cap": "One reviewer per component, then a merge",
      "vo": "Here, I ask for one accessibility reviewer per component, then one merged list.",
      "hl": null
    },
    "0003.png": {
      "hold": 3.0, "cursor": false,
      "ring": { "x": 714, "y": 356, "w": 872, "h": 84 }, "ringFor": 2.6,
      "cap": "12 reviewers, then one consolidation",
      "vo": "Devin finds twelve files and plans twelve reviewers, plus a consolidation step.",
      "hl": null
    },
    "0004.png": {
      "hold": 3.2, "cursor": false,
      "ring": { "x": 1009, "y": 668, "w": 824, "h": 272 }, "ringFor": 2.8,
      "cap": "Phases, agents and live status",
      "vo": "The workflow panel shows each phase, its agents, and their live status.",
      "hl": null
    },
    "0005.png": {
      "hold": 3.2, "cursor": false,
      "ring": { "x": 1022, "y": 451, "w": 800, "h": 40 }, "ringFor": 2.8,
      "cap": "The script Devin wrote",
      "vo": "The script Devin wrote is right there too, so you can read exactly how the run works.",
      "hl": null
    },
    "0006.png": {
      "scene": "modes", "hold": 8.4, "voHold": 5.9, "cursor": false, "capPos": "bottom",
      "cap": "pipeline has no barrier, parallel waits",
      "vo": "A pipeline moves each item through its stages on its own, while parallel waits for every result before a merge step.",
      "hl": null
    },
    "0007.png": {
      "hold": 3.0, "cursor": false,
      "ring": { "x": 1009, "y": 608, "w": 830, "h": 156 }, "ringFor": 2.6,
      "cap": "The merge starts after all 12 reviews",
      "vo": "This run used parallel, so the consolidation agent only started once all twelve reviews were done.",
      "hl": null
    },
    "0013.png": {
      "hold": 3.0, "cursor": false,
      "ring": { "x": 287, "y": 135, "w": 540, "h": 170 }, "ringFor": 2.6,
      "cap": "10 deduplicated findings, by severity",
      "vo": "Twelve reviews became one report of ten deduplicated findings, ordered by severity.",
      "hl": null
    },
    "0008.png": {
      "scene": "resume", "hold": 7.0, "voHold": 6.5, "cursor": false, "capPos": "bottom",
      "cap": "Finished agents replay, the rest rerun",
      "vo": "Every agent call is recorded, so an interrupted run replays its finished agents instantly, and only unfinished work runs again.",
      "hl": null
    },
    "0009.png": {
      "hold": 3.0, "cursor": false,
      "ring": { "x": 721, "y": 445, "w": 860, "h": 60 }, "ringFor": 2.6,
      "cap": "Settings → Preferences → Auto-approve workflows",
      "vo": "In Settings, under Preferences, Auto-approve workflows lets Devin run workflows without asking first.",
      "hl": null
    },
    "0010.png": {
      "scene": "when", "hold": 5.4, "voHold": 8.0, "cursor": false, "capPos": "bottom",
      "cap": "For fan-out or staged work",
      "vo": "Use a workflow for wide fan-out with a combine step, or staged work; for mechanical changes, a couple of sessions, or tightly coupled work, a plain session fits better.",
      "hl": null
    },
    "0011.png": {
      "scene": "reuse", "hold": 5.6, "voHold": 4.85, "cursor": false, "capPos": "bottom",
      "cap": "Try a slice, then save a skill",
      "vo": "Every agent is a session, so try a slice first, then save the working workflow as a skill.",
      "hl": null
    },
    "0012.png": {
      "scene": "uses", "hold": 6.8, "voHold": 6.0, "cursor": false, "capPos": "bottom",
      "cap": "Migrations, research, review, audits, loops",
      "vo": "Use it for migrations, research, code review, codebase-wide audits, or looping until tests pass.",
      "hl": null
    }
  }
};
