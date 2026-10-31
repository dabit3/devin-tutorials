window.SPEC = {
  "title": "Migrate in parallel",
  "subtitle": "A codebase-wide migration, run by a fleet of Devins",
  "outro": "One request in, one pull request per service out",
  "voOutro": "One request in, one pull request per service out.",
  "outroVoDelay": 0.3,
  "introHold": 3.4,
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.6,
  "edit": {
    "0000.png": {
      "cursor": false,
      "hl": null,
      "scene": "why",
      "hold": 7.6,
      "voDelay": -2.6,
      "cap": "One migration touches every service",
      "capPos": "bottom",
      "vo": "Devin can run a codebase-wide migration as a fleet of Devins. A migration like CommonJS to ES modules touches every service, and by hand that means one service after another."
    },
    "0001.png": {
      "cursor": false,
      "hl": null,
      "scene": "fanout",
      "hold": 7.0,
      "cap": "One request, one managed Devin per service",
      "capPos": "bottom",
      "vo": "With managed Devins, you send one request, and a coordinator splits it into independent pieces, starting one managed Devin per service, each on its own VM."
    },
    "0002.png": {
      "cursor": false,
      "hl": null,
      "scene": "prs",
      "hold": 7.7,
      "cap": "Own branch, tests passing, own PR",
      "capPos": "bottom",
      "vo": "Each one works on its own branch, keeps that service's tests passing, and opens its own pull request, while the coordinator tracks them and compiles one summary."
    },
    "0003.png": {
      "cursor": false,
      "hl": null,
      "hold": 3.4,
      "ring": {
        "x": 721,
        "y": 405,
        "w": 866,
        "h": 182
      },
      "ringFor": 3.0,
      "cap": "Real run: four Node services, one request",
      "vo": "Here's a real run on a small store backend with four Node services, asking for exactly that."
    },
    "0004.png": {
      "cursor": false,
      "hl": null,
      "hold": 2.2,
      "cap": "The coordinator reads the repo",
      "vo": "The coordinator reads the repo, then starts four managed Devins, one each for orders, payments, inventory, and notifications.",
      "subPos": {
        "x": 0.5,
        "y": 0.8
      }
    },
    "0005.png": {
      "cursor": false,
      "hl": null,
      "hold": 3.0,
      "voSync": 2.6,
      "ring": {
        "x": 575,
        "y": 436,
        "w": 600,
        "h": 204
      },
      "ringFor": 2.6,
      "cap": "It starts four managed Devins, one per service"
    },
    "0006.png": {
      "cursor": false,
      "hl": null,
      "hold": 3.2,
      "ring": {
        "x": 720,
        "y": 185,
        "w": 870,
        "h": 252
      },
      "ringFor": 2.8,
      "cap": "Each one opens its own PR",
      "vo": "A couple of minutes later, every one of them has a pull request open.",
      "subPos": {
        "x": 0.5,
        "y": 0.8
      }
    },
    "0007.png": {
      "cursor": false,
      "hl": null,
      "hold": 3.0,
      "ring": {
        "x": 188,
        "y": 536,
        "w": 358,
        "h": 288
      },
      "ringFor": 2.6,
      "cap": "Nested under the coordinator in the sidebar",
      "vo": "In the sidebar, all four sit nested under the coordinator.",
      "subPos": {
        "x": 0.63,
        "y": 0.8
      }
    },
    "0008.png": {
      "cursor": false,
      "hl": null,
      "hold": 3.6,
      "ring": {
        "x": 740,
        "y": 272,
        "w": 812,
        "h": 74
      },
      "ringFor": 3.0,
      "cap": "The orders Devin: PR open, 3 tests pass",
      "vo": "Open any of them to see its own work, like the orders Devin reporting its pull request with all three tests still passing.",
      "subPos": {
        "x": 0.5,
        "y": 0.81
      }
    },
    "0009.png": {
      "cursor": false,
      "hl": null,
      "hold": 4.0,
      "ring": {
        "x": 720,
        "y": 301,
        "w": 872,
        "h": 236
      },
      "ringFor": 3.4,
      "cap": "Four PRs, one per service, tests passing",
      "vo": "Then the coordinator reports back with four pull requests, one per service, each with its tests passing.",
      "subPos": {
        "x": 0.5,
        "y": 0.8
      }
    },
    "0010.png": {
      "cursor": false,
      "hl": null,
      "scene": "uses",
      "hold": 7.4,
      "cap": "Any change that splits cleanly",
      "capPos": "bottom",
      "vo": "The same pattern fits any change that splits cleanly, like swapping a legacy REST client for GraphQL, adding tests module by module, or running one skill in every session."
    }
  }
};
