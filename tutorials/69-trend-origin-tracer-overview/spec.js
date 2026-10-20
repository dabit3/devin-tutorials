window.SPEC = {
  "title": "Trend Origin Tracer",
  "subtitle": "How it works and what you can do",
  "dark": true,
  "outro": "Paste a phrase, and watch how it spread",
  "voOutro": "Paste a phrase, and watch how it spread.",
  "outroVoDelay": 0.2,
  "tailHold": 0.5,
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
      "vo": "How did this blow up? It's one of the internet's favourite questions. Paste a phrase like vibe coding, and this app shows the earliest post it can find on X, who amplified it, and how it spread over time. Modal is what makes this possible. Anyone can paste a phrase into a public page, and Modal runs the searches in parallel, with no server to keep running."
    },
    "0001.png": {
      "cursor": false,
      "scene": "pipeIn",
      "cursor": false,
      "capPos": "bottom",
      "hl": null,
      "hold": 5,
      "cap": "X posts → Grok, through the xAI API",
      "vo": "It starts with real posts on X. The app asks Grok, through the xAI API, with X search turned on.",
      "voSay": "It starts with real posts on X. The app asks Grok, through the ex A I API, with X search turned on."
    },
    "0002.png": {
      "scene": "pipeMap",
      "cursor": false,
      "capPos": "bottom",
      "hl": null,
      "hold": 3,
      "cap": "Modal runs the searches in parallel",
      "vo": "Modal does the rest. It splits each trace into searches, one per time window, and runs them in parallel. For vibe coding, that was twenty-five searches."
    },
    "0003.png": {
      "scene": "pipeStore",
      "cursor": false,
      "capPos": "bottom",
      "hl": null,
      "hold": 3,
      "cap": "Modal keeps the results and serves the page",
      "vo": "It keeps the results, and serves the page at a public URL that anyone can use."
    },
    "0004.png": {
      "scene": "pipeCron",
      "cursor": false,
      "capPos": "bottom",
      "hl": null,
      "hold": 3,
      "cap": "Modal can refresh saved phrases daily",
      "vo": "Modal can also refresh saved phrases every morning. This workspace had no free schedule slot, so for now the page starts that refresh itself."
    },
    "m01.png": {
      "scene": "modalWhy",
      "hold": 4,
      "cap": "Why Modal: no laptop, no server to run",
      "vo": "So why Modal? A laptop script would run the searches one at a time, with no public URL. Your own server would sit there idle, and you'd pay for it anyway. On Modal, it scales to zero between traces, and you pay by the second while it runs.",
      "cursor": false,
      "capPos": "bottom",
      "hl": null
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
      "cursor": true,
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
        "y": 190,
        "w": 545,
        "h": 62
      },
      "ringFor": 3,
      "cap": "modal deploy prints the public URL",
      "vo": "It deployed the app with modal deploy, which printed the public URL. Then it tested the deployed endpoint with a real trace.",
      "hl": null
    },
    "0008.png": {
      "cursor": false,
      "capPos": "bottom",
      "hl": true,
      "hold": 2,
      "cap": "Earliest post found: May 2022",
      "vo": "Here's the page running on Modal. For vibe coding, the earliest post it found is from May twenty twenty-two."
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
      "hold": 2.5,
      "cap": "Ways to extend it",
      "vo": "There's plenty to build on top. You could alert when a saved phrase starts climbing, compare two phrases side by side, or export the graph for a write-up. You could also trace a product launch from its very first post."
    }
  }
};
