window.SPEC = {
 "title": "Multiplayer Devin",
 "subtitle": "How a whole team builds with one Devin",
 "outro": "Multiplayer Devin",
 "outroSub": "Shared sessions  ·  Slack threads  ·  Tickets  ·  PR reviews  ·  Team skills",
 "voOutro": "So, your team can share a session, work from Slack, assign tickets, review in GitHub, and share skills.",
 "speed": 3,
 "cps": 48,
 "maxZoom": 1.4,
 "outroVoDelay": 0.2,
 "tailHold": 0.2,
 "musicStart": 16.15,
 "edit": {
  "0000.png": {
   "scene": "team",
   "hold": 7.0,
   "cursor": false,
   "capPos": "bottom",
   "subPos": "bottom",
   "cap": "One Devin, a whole team, one shared session",
   "vo": "Devin is multiplayer. Your whole team can work with the same Devin, in the same session.",
   "hl": null,
   "voSay": "Devin is multiplayer.\n\nYour whole team can work with the same Devin, in the same session."
  },
  "0001.png": {
   "hold": 3.4,
   "cursor": false,
   "ring": {
    "x": 909,
    "y": 601,
    "w": 928,
    "h": 129
   },
   "ringFor": 3.0,
   "cap": "Settings → Membership: Maya and Leo, each with their own account",
   "vo": "Here in Settings, Membership, Maya and Leo are on my team, each with their own account.",
   "hl": null,
   "subPos": {
    "x": 0.64,
    "y": 0.955
   },
   "capPos": {
    "x": 0.64,
    "y": 0.955
   }
  },
  "0002.png": {
   "hold": 3.6,
   "cursor": false,
   "ring": {
    "x": 721,
    "y": 406,
    "w": 854,
    "h": 150
   },
   "ringFor": 3.2,
   "cap": "Nader starts the session and says who's joining",
   "vo": "I start a session for issue checklists in our Orbit app, and say they're joining.",
   "hl": null,
   "subPos": {
    "x": 0.5,
    "y": 0.72
   },
   "capPos": {
    "x": 0.5,
    "y": 0.72
   }
  },
  "0003.png": {
   "hold": 4.0,
   "cursor": false,
   "ring": {
    "x": 278,
    "y": 252,
    "w": 475,
    "h": 315
   },
   "ringFor": 3.6,
   "cap": "Maya joins from her own account",
   "vo": "Maya opens the same session and asks for progress on the board cards. Devin adds it to the same pull request.",
   "hl": null,
   "subPos": {
    "x": 0.2,
    "y": 0.6
   },
   "capPos": {
    "x": 0.2,
    "y": 0.6
   }
  },
  "0004.png": {
   "hold": 3.0,
   "cursor": false,
   "ring": {
    "x": 716,
    "y": 80,
    "w": 860,
    "h": 70
   },
   "ringFor": 2.6,
   "cap": "Leo sets his bar for merging",
   "vo": "Leo adds his bar for merging, and Devin answers each of us by name.",
   "hl": null,
   "subPos": {
    "x": 0.6,
    "y": 0.6
   },
   "capPos": {
    "x": 0.6,
    "y": 0.6
   }
  },
  "0005.png": {
   "scene": "slack",
   "hold": 7.6,
   "cursor": false,
   "capPos": "bottom",
   "subPos": "bottom",
   "cap": "A session and its Slack thread stay in sync",
   "vo": "Your team can also reach it from Slack. A session syncs with its Slack thread, so replies in the thread reach Devin.",
   "hl": null
  },
  "0006.png": {
   "scene": "ticket",
   "hold": 7.0,
   "cursor": false,
   "capPos": "bottom",
   "subPos": "bottom",
   "cap": "Assign a Linear or Jira ticket to Devin",
   "vo": "A product manager can hand off work, too. Assign a Linear or Jira ticket to Devin, and it starts a session.",
   "hl": null
  },
  "0007.png": {
   "scene": "review",
   "hold": 8.6,
   "cursor": false,
   "capPos": "bottom",
   "subPos": "bottom",
   "cap": "PR comments reach Devin; /devin starts it on an open PR",
   "vo": "Reviewers can stay in GitHub. Devin answers comments on its pull requests, and a slash devin comment starts it on any open pull request.",
   "hl": null,
   "voSay": "Reviewers can stay in GitHub. Devin answers comments on its pull requests, and a slash Devin comment starts it on any open pull request."
  },
  "0008.png": {
   "hold": 3.6,
   "cursor": false,
   "ring": {
    "x": 735,
    "y": 437,
    "w": 760,
    "h": 110
   },
   "ringFor": 3.2,
   "cap": "Devin Review: no issues; browser test posted on the PR",
   "vo": "On our pull request, Devin Review found no issues, and the session posted its browser test for the team.",
   "hl": null,
   "subPos": "top"
  },
  "0009.png": {
   "hold": 3.0,
   "cursor": false,
   "ring": {
    "x": 715,
    "y": 490,
    "w": 870,
    "h": 190
   },
   "ringFor": 2.6,
   "cap": "Maya signs off; Devin says it's ready to merge",
   "vo": "When Maya signs off, Devin tells us it's ready to merge.",
   "hl": null,
   "subPos": "top"
  },
  "0010.png": {
   "scene": "skills",
   "hold": 7.4,
   "cursor": false,
   "capPos": "bottom",
   "subPos": "bottom",
   "cap": "Commit a skill once; every teammate's session can use it",
   "vo": "Team habits carry across people, too. Commit a skill to the repo, and every teammate's session can use it.",
   "hl": null
  }
 }
};

// Narrated cut only: each beat lasts as long as its line (the captioned holds would leave gaps between lines).
// vo_onetake.py json-parses this file, so remove this block before re-recording the take.
if (new URLSearchParams(location.search).get("voice")) { SPEC.tailHold = 0; for (const e of Object.values(SPEC.edit)) if (e.vo) e.hold = 1.0; }
