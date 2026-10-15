window.SPEC = {
  "title": "Is it just me?",
  "subtitle": "An outage detector on Modal and the xAI API",
  "outro": "Is it just me? Now you know.",
  "voOutro": "Is it just me? Now you know.",
  "dark": true,
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.3,
  "edit": {
    "0000.png": {
      "hold": 5,
      "cap": "Is it just me, or is it down for everyone?",
      "vo": "Is it just me, or is Slack not working for everyone? This app answers that from real posts on X.",
      "cursor": false,
      "scene": "idea",
      "subPos": "bottom"
    },
    "0001.png": {
      "hold": 7,
      "cap": "Grok searches X, Modal runs everything else",
      "vo": "Here's how it works. Grok searches X through the xAI API. Modal runs everything else, from a scheduled job to the page at its public URL.",
      "voSay": "Here's how it works. Grok searches X through the ex A I API. Modal runs everything else, from a scheduled job to the page at its public URL.",
      "cursor": false,
      "scene": "pipeline",
      "subPos": "bottom"
    },
    "0002.png": {
      "hold": 7.5,
      "cap": "Every minute, one scan per service, in parallel",
      "vo": "Every minute, a Modal Cron job wakes up and fans out with starmap, one scan per service, in parallel. The counts land in a Modal Dict, so they persist between runs.",
      "voSay": "Every minute, a Modal Cron job wakes up and fans out with star map, one scan per service, in parallel. The counts land in a Modal Dict, so they persist between runs.",
      "cursor": false,
      "scene": "fanout",
      "subPos": "bottom"
    },
    "0003.png": {
      "hold": 8,
      "cap": "No laptop to keep awake, no server to run",
      "vo": "Why Modal? A script on your laptop stops when your laptop sleeps. Your own server runs all day for a job that takes seconds. On Modal, it wakes up on schedule, scales to zero in between, and you only pay for the seconds it runs. The xAI key stays in a Modal Secret.",
      "voSay": "Why Modal? A script on your laptop stops when your laptop sleeps. Your own server runs all day for a job that takes seconds. On Modal, it wakes up on schedule, scales to zero in between, and you only pay for the seconds it runs. The ex A I key stays in a Modal Secret.",
      "cursor": false,
      "scene": "whymodal",
      "subPos": "bottom"
    },
    "0004.png": {
      "hold": 3,
      "cap": "One plain-language prompt in Devin",
      "vo": "In the real run, Devin built it from one plain-language prompt.",
      "subPos": "bottom",
      "cursor": false
    },
    "0005.png": {
      "hold": 3,
      "cap": "Devin's plan, after one real search call",
      "vo": "It checked the setup, made one real search call, and shared its plan.",
      "subPos": {
        "x": 0.5,
        "y": 0.035
      },
      "cursor": false,
      "ring": {
        "x": 718,
        "y": 392,
        "w": 890,
        "h": 72
      },
      "ringFor": 3
    },
    "0006.png": {
      "hold": 3,
      "cap": "modal deploy puts it on Modal",
      "vo": "Then it wrote the app, and deployed it with modal deploy.",
      "subPos": {
        "x": 0.19,
        "y": 0.74
      },
      "cursor": false,
      "ring": {
        "x": 928,
        "y": 152,
        "w": 680,
        "h": 50
      },
      "ringFor": 3
    },
    "0007.png": {
      "hold": 3,
      "cap": "All 12 unit tests pass",
      "vo": "It tested the deployed page, and all twelve unit tests passed.",
      "subPos": {
        "x": 0.5,
        "y": 0.035
      },
      "cursor": false,
      "ring": {
        "x": 718,
        "y": 302,
        "w": 890,
        "h": 62
      },
      "ringFor": 3
    },
    "0008.png": {
      "hold": 3,
      "cap": "Its pull request, ready to merge",
      "vo": "And it opened a pull request that's ready to merge.",
      "subPos": {
        "x": 0.19,
        "y": 0.74
      },
      "cursor": false,
      "ring": {
        "x": 692,
        "y": 321,
        "w": 215,
        "h": 44
      },
      "ringFor": 3
    },
    "0009.png": {
      "hold": 9,
      "cap": "Only what the posts actually say",
      "vo": "The app is honest by design. A region or error only shows up if a post actually says it. The counts are posts found, a sample of X, not every report.",
      "cursor": false,
      "scene": "honest",
      "subPos": "bottom"
    },
    "0010.png": {
      "hold": 3,
      "cap": "ChatGPT: six posts found in six hours",
      "vo": "On the page running on Modal, ChatGPT had six posts found in the last six hours.",
      "subPos": {
        "x": 0.5,
        "y": 0.03
      },
      "cursor": false
    },
    "0011.png": {
      "hold": 3,
      "cap": "AWS: one post names the Middle East",
      "vo": "For AWS, one post named the Middle East, quoted straight from X.",
      "subPos": {
        "x": 0.5,
        "y": 0.03
      },
      "cursor": false
    },
    "0012.png": {
      "hold": 10,
      "cap": "Ways to extend it",
      "vo": "From here, you can extend it. Watch the services your team depends on. Alert a Slack channel when posts spike. Or compare it against the official status page, and keep weeks of history.",
      "cursor": false,
      "scene": "extend",
      "subPos": "bottom"
    }
  }
};
