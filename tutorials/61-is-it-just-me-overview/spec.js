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
      "vo": "Is it just me, or is Slack down for everyone? This app answers that from real posts on X.",
      "cursor": false,
      "scene": "idea",
      "subPos": "bottom"
    },
    "0001.png": {
      "hold": 6.5,
      "cap": "Grok searches X, Modal runs the rest",
      "vo": "Here's how it works. Grok searches X through the xAI API, and Modal runs everything else.",
      "voSay": "Here's how it works. Grok searches X through the ex A I API, and Modal runs everything else.",
      "cursor": false,
      "scene": "pipeline",
      "subPos": "bottom"
    },
    "0002.png": {
      "hold": 7.5,
      "cap": "Every minute, one scan per service, in parallel",
      "vo": "Every minute, a Modal Cron job fans out with starmap, one scan per service, in parallel. The counts are stored in a Modal Dict.",
      "voSay": "Every minute, a Modal Cron job fans out with star map, one scan per service, in parallel. The counts are stored in a Modal Dict.",
      "cursor": false,
      "scene": "fanout",
      "subPos": "bottom"
    },
    "0003.png": {
      "hold": 3,
      "cap": "One plain-language prompt in Devin",
      "vo": "In the real run, Devin built it from one plain-language prompt.",
      "subPos": "bottom",
      "cursor": false
    },
    "0004.png": {
      "hold": 3,
      "cap": "Devin writes the detector and the Modal app",
      "vo": "It planned the work, then wrote the detection logic and the Modal app.",
      "subPos": {
        "x": 0.5,
        "y": 0.035
      },
      "cursor": false
    },
    "0005.png": {
      "hold": 3,
      "cap": "modal.Cron(\"* * * * *\") from its pull request",
      "vo": "This is the Cron schedule, straight from its pull request.",
      "subPos": {
        "x": 0.19,
        "y": 0.74
      },
      "cursor": false,
      "ring": {
        "x": 922,
        "y": 404,
        "w": 570,
        "h": 32
      },
      "ringFor": 3
    },
    "0006.png": {
      "hold": 3,
      "cap": "modal deploy puts it on Modal",
      "vo": "Then Devin deployed it with modal deploy.",
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
      "cap": "Its pull request, ready to merge",
      "vo": "It tested the app, and opened a pull request that's ready to merge.",
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
    "0008.png": {
      "hold": 9,
      "cap": "Only what the posts actually say",
      "vo": "The app is honest by design. A region or error only shows up if a post actually says it. The counts are posts found, a sample of X, not every report.",
      "cursor": false,
      "scene": "honest",
      "subPos": "bottom"
    },
    "0009.png": {
      "hold": 3,
      "cap": "ChatGPT: six posts found in six hours",
      "vo": "On the deployed page, ChatGPT had six posts found in the last six hours.",
      "subPos": {
        "x": 0.5,
        "y": 0.03
      },
      "cursor": false
    },
    "0010.png": {
      "hold": 3,
      "cap": "AWS: one post names the Middle East",
      "vo": "For AWS, one post named the Middle East, quoted straight from X.",
      "subPos": {
        "x": 0.5,
        "y": 0.03
      },
      "cursor": false
    },
    "0011.png": {
      "hold": 10,
      "cap": "Ways to extend it",
      "vo": "From here, you can extend it. Watch the services your team depends on. Alert a Slack channel when posts spike. Or compare it against the official status page, and keep weeks of history.",
      "cursor": false,
      "scene": "extend",
      "subPos": "bottom"
    }
  }
};
