window.SPEC = {
  "title": "Trend Origin Tracer",
  "subtitle": "How it works and what you can do",
  "dark": true,
  "outro": "Paste a phrase, and watch how it spread",
  "voOutro": "Paste a phrase, and watch how it spread.",
  "outroVoDelay": 0.2,
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.4,
  "capPos": "bottom",
  "edit": {
    "0000.png": {
      "scene": "intro",
      "cursor": false,
      "capPos": "bottom",
      "hl": null,
      "hold": 4,
      "cap": "Paste a phrase, see how it spread",
      "vo": "How did this blow up? It's one of the internet's favourite questions. Paste a phrase like vibe coding, and this app shows the earliest post it can find on X, who amplified it, and how it spread over time."
    },
    "0001.png": {
      "scene": "pipeIn",
      "cursor": false,
      "capPos": "bottom",
      "hl": null,
      "hold": 5,
      "cap": "X posts → xAI API: Grok with X search",
      "vo": "It starts with real posts on X. The app asks Grok through the xAI API, with the X search tool turned on, and gets structured JSON back.",
      "voSay": "It starts with real posts on X. The app asks Grok through the ex A I API, with the X search tool turned on, and gets structured JSON back."
    },
    "0002.png": {
      "scene": "pipeMap",
      "cursor": false,
      "capPos": "bottom",
      "hl": null,
      "hold": 3,
      "cap": ".map() runs one search per time window",
      "vo": "On Modal, one function fans out the searches with dot map, one per time window, so they all run at once. For vibe coding, that was twenty-five searches."
    },
    "0003.png": {
      "scene": "pipeStore",
      "cursor": false,
      "capPos": "bottom",
      "hl": null,
      "hold": 3,
      "cap": "Results in a Modal Dict, served by a web endpoint",
      "vo": "The results go into a Modal Dict, and a web endpoint serves the page and its API from that storage."
    },
    "0004.png": {
      "scene": "pipeCron",
      "cursor": false,
      "capPos": "bottom",
      "hl": null,
      "hold": 3,
      "cap": "A Modal Cron can refresh saved phrases daily",
      "vo": "A Modal cron can refresh saved phrases every morning. This workspace had no free schedule slot, so for now the page starts that refresh itself."
    },
    "0005.png": {
      "scene": "honest",
      "cursor": false,
      "capPos": "bottom",
      "hl": null,
      "hold": 4,
      "cap": "Honest labels, real edges",
      "vo": "The labels stay honest. The earliest post found isn't proof of origin. Counts are posts found in a sample, not totals. And every edge comes from a real reply, quote or mention in the data."
    },
    "0006.png": {
      "cursor": false,
      "capPos": "bottom",
      "cap": "Devin builds it from one short prompt",
      "vo": "Devin built the whole thing from one short prompt, in a single session.",
      "hl": null
    },
    "0007.png": {
      "cursor": false,
      "capPos": "bottom",
      "ring": {
        "x": 582,
        "y": 174,
        "w": 545,
        "h": 36
      },
      "ringFor": 3,
      "cap": "modal deploy, then a real trace",
      "vo": "It deployed the app with modal deploy, then tested the deployed endpoint with a real trace.",
      "hl": null
    },
    "0008.png": {
      "cursor": false,
      "capPos": "bottom",
      "hl": true,
      "hold": 2,
      "cap": "Earliest post found: May 2022",
      "vo": "Here's the deployed app. For vibe coding, the earliest post it found is from May twenty twenty-two."
    },
    "0009.png": {
      "cursor": false,
      "capPos": "bottom",
      "hold": 2,
      "cap": "69 posts found, Karpathy the top amplifier",
      "vo": "It found sixty-nine posts with the phrase, and the graph shows who passed it to whom, with Karpathy as the top amplifier.",
      "hl": null
    },
    "0010.png": {
      "scene": "extend",
      "cursor": false,
      "capPos": "bottom",
      "hl": null,
      "hold": 6,
      "cap": "Ways to extend it",
      "vo": "There's plenty to build on top. You could alert when a saved phrase starts climbing, compare two phrases side by side, or export the graph for a write-up. You could also trace a product launch from its very first post."
    }
  }
};
