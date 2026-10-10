window.SPEC = {
  "title": "Devin Primitives",
  "subtitle": "When to use each one, where it lives, and how to build it",
  "outro": "Teach it once, and every session starts smarter",
  "voOutro": "Teach it once, and every session starts smarter.",
  "outroVoDelay": 0.2,
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.6,
  "noZoom": [
    [
      "0003.png",
      "0011.png"
    ]
  ],
  "edit": {
    "0000.png": {
      "scene": "intro",
      "hold": 4.1,
      "cursor": false,
      "capPos": "bottom",
      "cap": "Each primitive teaches Devin something different",
      "vo": "Devin gets better the more you teach it. Each primitive is a different way to teach it.",
      "hl": null
    },
    "0001.png": {
      "scene": "map",
      "hold": 6.4,
      "cursor": false,
      "capPos": "bottom",
      "cap": "Always-on context, reusable procedures, reach and sharing",
      "vo": "They fall into three groups: always-on context, reusable procedures, and ways to reach new tools and share what you've built.",
      "hl": null
    },
    "0002.png": {
      "scene": "agents",
      "hold": 6.5,
      "cursor": false,
      "capPos": "bottom",
      "cap": "AGENTS.md: short, always-on context in your repo",
      "vo": "For context every session needs, like build commands and conventions, commit a short agents file at the root of your repo, and Devin includes it automatically.",
      "voSay": "For context every session needs like build commands and conventions, commit a short agents file at the root of your repo, and Devin includes it automatically.",
      "hl": null
    },
    "0003.png": {
      "hold": 3.6,
      "cursor": false,
      "ring": {
        "x": 757,
        "y": 300,
        "w": 310,
        "h": 100
      },
      "ringFor": 3.2,
      "cap": "Customize → Rules: trigger Always on",
      "vo": "You can also write a rule under Customize, Rules, and set its trigger to always on.",
      "hl": null,
      "subPos": {
        "x": 0.21,
        "y": 0.82
      },
      "capPos": {
        "x": 0.21,
        "y": 0.82
      }
    },
    "0004.png": {
      "hold": 3.8,
      "cursor": false,
      "ring": {
        "x": 681.4,
        "y": 120,
        "w": 946.5,
        "h": 85
      },
      "ringFor": 3.4,
      "cap": "Customize → Memory: Devin writes it, you ask it to remember or forget",
      "vo": "Memory is different, because Devin writes it as you work, and you can change it too by asking Devin to remember or forget something. It's personal to you, and you'll find it under Customize, Memory.",
      "hl": null,
      "subPos": {
        "x": 0.74,
        "y": 0.05
      },
      "capPos": {
        "x": 0.72,
        "y": 0.935
      }
    },
    "0005.png": {
      "scene": "skill",
      "hold": 6.5,
      "cursor": false,
      "capPos": "bottom",
      "cap": "Skills: SKILL.md in .agents/skills, used when relevant",
      "vo": "When a task should be done the same way every time, like testing before a pull request, write it as a skill file in your repo, and Devin uses it automatically when it's relevant.",
      "hl": null
    },
    "0006.png": {
      "hold": 3.6,
      "cursor": false,
      "ring": {
        "x": 1010,
        "y": 288,
        "w": 800,
        "h": 232
      },
      "ringFor": 3.2,
      "cap": "Customize → Skills → Create skill",
      "vo": "You can create one under Customize, Skills, or let Devin suggest one after it learns something new about your setup.",
      "hl": null,
      "subPos": {
        "x": 0.21,
        "y": 0.82
      },
      "capPos": {
        "x": 0.21,
        "y": 0.82
      }
    },
    "0008.png": {
      "hold": 4.0,
      "cursor": false,
      "ring": {
        "x": 725,
        "y": 354.4,
        "w": 1296.2,
        "h": 183.8
      },
      "ringFor": 3.6,
      "cap": "Settings → Playbooks: attach one with its macro",
      "vo": "Playbooks are prompts for tasks that apply across repos or teams, and you attach one to a session with its macro.",
      "hl": null
    },
    "0009.png": {
      "hold": 3.8,
      "cursor": false,
      "ring": {
        "x": 1045.7,
        "y": 326.9,
        "w": 374.0,
        "h": 158.8
      },
      "ringFor": 3.4,
      "cap": "Customize → MCPs → Add MCP → From plugin marketplace",
      "vo": "MCP servers give Devin tools beyond its built-in ones, like Datadog, and the recommended way to add one is from the plugin marketplace.",
      "hl": null,
      "capPos": "bottom"
    },
    "0010.png": {
      "hold": 3.4,
      "cursor": false,
      "ring": {
        "x": 323.3,
        "y": 240,
        "w": 230.4,
        "h": 60
      },
      "ringFor": 3.0,
      "cap": "Install plugins for you, or for your organization",
      "vo": "Plugins bundle skills, rules, hooks, and MCP servers, and you can install them just for you or for your whole organization.",
      "hl": null,
      "capPos": "bottom"
    },
    "0011.png": {
      "hold": 3.2,
      "cursor": false,
      "ring": {
        "x": 1083.8,
        "y": 345.6,
        "w": 300,
        "h": 196.2
      },
      "ringFor": 2.8,
      "cap": "Customize → Plugins → Add plugin",
      "vo": "Add one from a repository, upload a zip, or create your own.",
      "hl": null,
      "capPos": "bottom"
    },
    "0012.png": {
      "scene": "which",
      "hold": 8.2,
      "cursor": false,
      "capPos": "bottom",
      "cap": "Match the need to the primitive",
      "vo": "So repeatable steps become a skill, conventions go in your agents file or a rule, preferences live in memory, shared prompts are playbooks, tools are MCP servers, and plugins share it all.",
      "hl": null
    }
  }
};



// Narrated cut only: end the last beat 0.5 s after its line so the outro line follows in about 1 s (captioned frame count unchanged).
// vo_onetake.py json-parses this file, so remove this block before re-recording the take.
if (new URLSearchParams(location.search).get("voice")) SPEC.tailHold = 0;
