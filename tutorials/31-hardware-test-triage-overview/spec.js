window.SPEC = {
  "title": "Hardware test triage",
  "subtitle": "Automated HIL/SIL test runs and failure triage with Devin",
  "outro": "Every failure, triaged before the team logs on",
  "voOutro": "Every failure, triaged before the team logs on.",
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.6,
  "edit": {
    "0000.png": {
      "scene": "pain",
      "hold": 6.5,
      "cursor": false,
      "capPos": "bottom",
      "cap": "Today: sim suites started by hand, failures triaged a day late",
      "vo": "Robotics teams often run simulation suites on powerful devboxes by hand, so failures pile up and get triaged a day late.",
      "hl": null
    },
    "0001.png": {
      "scene": "flow",
      "hold": 6.6,
      "cursor": false,
      "capPos": "bottom",
      "cap": "A trigger starts the run, one managed Devin per failure",
      "vo": "With Devin, a nightly schedule or a Slack message starts the run, and one managed Devin per failure triages them all in parallel.",
      "hl": null
    },
    "0002.png": {
      "hold": 3.2,
      "cursor": false,
      "ring": {
        "x": 940,
        "y": 298,
        "w": 930,
        "h": 110
      },
      "ringFor": 2.6,
      "cap": "Simulation demo: a nightly automation at 02:00",
      "vo": "Here is a simulation demo: a small robot simulator with a test suite, and an automation that runs it every night at two.",
      "hl": null
    },
    "0003.png": {
      "hold": 2.6,
      "cursor": false,
      "ring": {
        "x": 720,
        "y": 412,
        "w": 980,
        "h": 130
      },
      "ringFor": 2.2,
      "cap": "Each run starts a fresh session with these instructions",
      "hl": null
    },
    "0004.png": {
      "hold": 3,
      "cursor": false,
      "ring": {
        "x": 960,
        "y": 546,
        "w": 890,
        "h": 84
      },
      "ringFor": 2.4,
      "cap": "From Slack: tag Devin in a channel (from tutorial 12)",
      "vo": "From Slack, tagging Devin in a channel starts the same kind of session.",
      "hl": null
    },
    "0005.png": {
      "hold": 2.2,
      "cursor": false,
      "ring": {
        "x": 720,
        "y": 405,
        "w": 620,
        "h": 180
      },
      "ringFor": 1.8,
      "cap": "Run it now instead of waiting for tonight",
      "vo": "I ran it right away instead of waiting for tonight.",
      "hl": null
    },
    "0006.png": {
      "hold": 2.4,
      "cursor": false,
      "ring": {
        "x": 700,
        "y": 95,
        "w": 770,
        "h": 62
      },
      "ringFor": 2,
      "cap": "The automation starts a session on its own",
      "vo": "It started a session on its own and ran the suite.",
      "hl": null
    },
    "0007.png": {
      "hold": 3,
      "cursor": false,
      "ring": {
        "x": 750,
        "y": 235,
        "w": 830,
        "h": 365
      },
      "ringFor": 2.4,
      "cap": "Four failing tests, one managed Devin each",
      "vo": "Four tests failed, so it started one managed Devin for each.",
      "hl": null
    },
    "0008.png": {
      "scene": "triage",
      "hold": 6.4,
      "cursor": false,
      "capPos": "bottom",
      "cap": "Dedupe, root cause, evidence, one report",
      "vo": "Each one checks for a known issue and tests a root cause against the output, so you get one report instead of a pile of logs.",
      "hl": null
    },
    "0009.png": {
      "hold": 3,
      "cursor": false,
      "ring": {
        "x": 757,
        "y": 278,
        "w": 800,
        "h": 140
      },
      "ringFor": 2.4,
      "cap": "One managed Devin’s root cause, checked against the test",
      "vo": "This one traced a spin failure to the wrong constant in the turn-rate math.",
      "hl": null
    },
    "0010.png": {
      "hold": 2.6,
      "cursor": false,
      "ring": {
        "x": 755,
        "y": 112,
        "w": 840,
        "h": 125
      },
      "ringFor": 2.2,
      "cap": "The known issue is flagged and left alone",
      "vo": "The report flags the known issue and leaves it alone.",
      "hl": null
    },
    "0011.png": {
      "hold": 2.6,
      "cursor": false,
      "ring": {
        "x": 748,
        "y": 510,
        "w": 820,
        "h": 150
      },
      "ringFor": 2.2,
      "cap": "One fix PR for the two new root causes",
      "vo": "For the two new root causes, Devin opened one fix pull request.",
      "hl": null
    },
    "0012.png": {
      "hold": 2.6,
      "cursor": false,
      "ring": {
        "x": 1237,
        "y": 445,
        "w": 384,
        "h": 350
      },
      "ringFor": 2.2,
      "cap": "In Slack, Devin replies in the thread (tutorial 12)",
      "vo": "In Slack, Devin replies in the thread where the work started.",
      "hl": null
    },
    "0013.png": {
      "scene": "team",
      "hold": 6.6,
      "cursor": false,
      "capPos": "bottom",
      "cap": "One thread, one session, the whole team",
      "vo": "Your team can triage together: replies in one Slack thread show who sent each message, and anyone can open the shared session link.",
      "hl": null
    },
    "0014.png": {
      "hold": 2.4,
      "cursor": false,
      "ring": {
        "x": 345,
        "y": 130,
        "w": 430,
        "h": 130
      },
      "ringFor": 2,
      "cap": "The same session, open in the web app",
      "vo": "The same session is open in the web app, too.",
      "hl": null
    },
    "0015.png": {
      "hold": 2.6,
      "cursor": false,
      "ring": {
        "x": 684,
        "y": 367,
        "w": 350,
        "h": 48
      },
      "ringFor": 2.2,
      "cap": "A shared playbook, reused by anyone on the team",
      "vo": "A triage playbook one engineer writes is shared with the whole team.",
      "hl": null
    },
    "0016.png": {
      "scene": "uses",
      "hold": 7.6,
      "cursor": false,
      "capPos": "bottom",
      "cap": "What teams have done with HIL/SIL triage",
      "vo": "Teams use this for nightly hardware and simulation triage, Slack-reported issues, crash reports turned into Jira tickets and fixes, moving bench tests to simulation, and playbooks for each subsystem.",
      "hl": null
    }
  }
};
