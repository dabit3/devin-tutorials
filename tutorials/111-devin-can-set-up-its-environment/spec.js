window.SPEC = {
 "title": "Devin can set up its own dev environment",
 "subtitle": "From a fresh repo to sessions that start ready",
 "outro": "Set it up once. Every session starts ready.",
 "voOutro": "Set it up once, and every new session starts ready.",
 "outroVoDelay": 0.4,
 "introHold": 3.6,
 "pace": 1,
 "speed": 3,
 "pollRunMax": 2.5,
 "voSentGap": 0.45,
 "maxZoom": 1.3,
 "noZoom": [
  [
   "0002.png",
   "0023.png"
  ]
 ],
 "edit": {
  "0000.png": {
   "scene": "fresh",
   "hold": 2,
   "vo": "Devin can set up its own dev environment from a fresh repo. Every session starts on a clean machine, so without a saved setup, each one has to rediscover the runtimes, services and settings.",
   "cursor": false,
   "voDelay": -2.8
  },
  "0001.png": {
   "scene": "flow",
   "hold": 2,
   "vo": "You ask in plain English, Devin tests a setup, you approve it, and a snapshot build saves it."
  },
  "0002.png": {
   "hold": 1.5,
   "vo": "Here I point Devin at a fresh repo and ask for services running and tests passing in every new session."
  },
  "0003.png": {
   "kind": null,
   "hold": 1.5,
   "ring": {
    "x": 540,
    "y": 345,
    "w": 470,
    "h": 500
   },
   "vo": "Devin explores on its own, checking for Node, Docker and Postgres, and running the tests to see what breaks.",
   "subPos": {
    "x": 0.5,
    "y": 0.77
   }
  },
  "0004.png": {
   "kind": null,
   "hold": 1.5,
   "ring": {
    "x": 511,
    "y": 362,
    "w": 447,
    "h": 330
   },
   "vo": "Node is missing, and so is a database URL, so Devin writes a blueprint plan that fixes both.",
   "subPos": {
    "x": 0.5,
    "y": 0.77
   }
  },
  "0005.png": {
   "scene": "parts",
   "hold": 2,
   "vo": "A blueprint holds one-time installs, steps that run on every build, and the commands to test and start the app."
  },
  "0006.png": {
   "vo": "Devin asks to test it on a clean machine first, and I approve.",
   "cursor": true,
   "subPos": {
    "x": 0.5,
    "y": 0.77
   }
  },
  "0008.png": {
   "kind": null,
   "hold": 1.5,
   "ring": {
    "x": 716,
    "y": 228,
    "w": 880,
    "h": 80
   },
   "vo": "On fresh machines it goes from a clean clone to passing tests.",
   "subPos": {
    "x": 0.5,
    "y": 0.77
   }
  },
  "0009.png": {
   "vo": "Then saving the blueprint starts a snapshot build.",
   "subPos": {
    "x": 0.5,
    "y": 0.77
   }
  },
  "0010.png": {
   "badge": "Sped up",
   "vo": "The first build failed: Docker Hub rate limited an image pull.",
   "hold": 0.6,
   "subPos": {
    "x": 0.5,
    "y": 0.655
   }
  },
  "0011.png": {
   "hold": 0.3
  },
  "0012.png": {
   "hold": 0.3
  },
  "0013.png": {
   "hold": 0.3
  },
  "0014.png": {
   "hold": 0.5,
   "ring": {
    "x": 914,
    "y": 765,
    "w": 870,
    "h": 80
   }
  },
  "0015.png": {
   "badge": "",
   "kind": null,
   "hold": 1.5,
   "vo": "Retries didn't help, so I asked, in plain English, for a mirror that isn't rate limited.",
   "subPos": {
    "x": 0.5,
    "y": 0.77
   }
  },
  "0016.png": {
   "kind": null,
   "hold": 1.5,
   "ring": {
    "x": 721,
    "y": 368,
    "w": 885,
    "h": 60
   },
   "vo": "Devin switched to a mirror and tested it with Docker Hub blocked.",
   "subPos": {
    "x": 0.5,
    "y": 0.77
   }
  },
  "0017.png": {
   "hold": 0.3
  },
  "0018.png": {
   "badge": "Sped up",
   "hold": 0.15
  },
  "0019.png": {
   "hold": 0.15
  },
  "0020.png": {
   "hold": 0.15
  },
  "0021.png": {
   "kind": null,
   "hold": 1.5,
   "ring": {
    "x": 178,
    "y": 276,
    "w": 200,
    "h": 110
   },
   "vo": "This time the snapshot build succeeds and becomes active."
  },
  "0022.png": {
   "badge": "",
   "hold": 1.5,
   "vo": "Now a brand new session: check the services and run the tests, with no setup."
  },
  "0023.png": {
   "kind": null,
   "hold": 2,
   "ring": {
    "x": 718,
    "y": 324,
    "w": 880,
    "h": 180
   },
   "vo": "Postgres and Redis are already running, and both tests pass. Nothing had to be installed.",
   "subPos": {
    "x": 0.5,
    "y": 0.77
   }
  }
 },
 "tailHold": 0.4
};
