window.SPEC = {
  "title": "Devin Security Swarm",
  "subtitle": "Find real exploits, prove them, and fix them",
  "outro": "Found, proven, and fixed",
  "speed": 3,
  "cps": 48,
  "capPos": "bottom",
  "capArrows": false,
  "pollRunMax": 2.5,
  "voOutro": "Security Swarm. Real exploits, found, proven, and fixed.",
  "edit": {
    "0000.png": {
      "skip": true
    },
    "0001.png": {
      "hold": 2.6,
      "cursor": false,
      "vo": "Devin Security Swarm reads your code like an attacker, proves each bug is real in a sandbox, and then fixes it."
    },
    "0002.png": {
      "cap": "Create a scan profile",
      "vo": "Start with a scan profile, and let Devin write it."
    },
    "0004.png": {
      "hl": {
        "x": 898,
        "y": 472,
        "w": 298,
        "h": 78
      },
      "hold": 1.6,
      "cap": "Let Devin generate it"
    },
    "0006.png": {
      "skip": true
    },
    "0007.png": {
      "hold": 3.2,
      "vo": "Devin opens a session and asks what the profile should scan, and what matters most."
    },
    "0008.png": {
      "cap": "Answer in a few sentences"
    },
    "0010.png": {
      "hold": 2.6,
      "vo": "Answer in a few sentences: the repo, what to focus on, what to skip, and that any auth bypass or cross-user leak is always critical."
    },
    "0011.png": {
      "hold": 0.6
    },
    "0012.png": {
      "badge": "Sped up",
      "vo": "Devin reads the repo, so the profile matches the real routes and scripts."
    },
    "0029.png": {
      "skip": true
    },
    "0030.png": {
      "hold": 5.0,
      "badge": null,
      "hl": {
        "x": 720,
        "y": 458,
        "w": 865,
        "h": 655
      },
      "cap": "Devin writes the profile, and spots that main reverted an auth fix",
      "vo": "It creates the profile, and even notices that the latest commit on main reverted an earlier auth fix."
    },
    "0031.png": {
      "cap": "Keep the optional settings on their defaults",
      "vo": "Keep the optional settings on their defaults."
    },
    "0033.png": {
      "hold": 0.8
    },
    "0034.png": {
      "hold": 0.6,
      "skip": true
    },
    "0035.png": {
      "skip": true
    },
    "0036.png": {
      "hold": 1.4,
      "cap": "The profile is ready",
      "vo": "The profile is ready."
    },
    "0037.png": {
      "skip": true
    },
    "0038.png": {
      "cap": "Open the new profile",
      "vo": "Now open it."
    },
    "0040.png": {
      "skip": true
    },
    "0041.png": {
      "hold": 1.0
    },
    "0042.png": {
      "hold": 4.4,
      "hl": {
        "x": 720,
        "y": 386,
        "w": 990,
        "h": 312
      },
      "cap": "Scan model: what to look for, and where",
      "vo": "The scan model tells the scanner what to hunt for, with the exact files and functions to check."
    },
    "0043.png": {
      "hold": 3.8,
      "hl": {
        "x": 721,
        "y": 211,
        "w": 970,
        "h": 251
      },
      "cap": "Triage guidance: auth bypass and cross-user leaks are always critical",
      "vo": "Triage guidance ranks the findings, so our rule makes these always critical."
    },
    "0044.png": {
      "hold": 4.6,
      "hl": {
        "x": 720,
        "y": 330,
        "w": 990,
        "h": 500
      },
      "cap": "Sandbox validation: start it, seed it, prove it with curl",
      "vo": "Sandbox validation tells Devin how to start the API, which test users to log in as, and to prove every finding with curl."
    },
    "0045.png": {
      "hold": 2.4,
      "hl": {
        "x": 721,
        "y": 548,
        "w": 970,
        "h": 52
      },
      "cap": "Report: an optional summary after the scan",
      "vo": "A summary report is optional, and this profile leaves it off."
    },
    "0046.png": {
      "hold": 0.6
    },
    "0048.png": {
      "hold": 3.8,
      "hl": {
        "x": 720,
        "y": 600,
        "w": 1000,
        "h": 250
      },
      "cap": "Skip tests and seed scripts, and validate every severity",
      "vo": "Under Advanced, it skips tests and seed scripts, and validates every severity."
    },
    "0049.png": {
      "skip": true
    },
    "0050.png": {
      "hold": 1.0
    },
    "0051.png": {
      "cap": "Start a scan",
      "vo": "Now start a scan."
    },
    "0053.png": {
      "cap": "Set it up manually",
      "vo": "Set it up manually."
    },
    "0057.png": {
      "cap": "Pick the repository",
      "vo": "Pick the repo."
    },
    "0059.png": {
      "skip": true
    },
    "0060.png": {
      "skip": true
    },
    "0062.png": {
      "skip": true
    },
    "0064.png": {
      "cap": "Choose the new profile",
      "vo": "Then choose the new profile."
    },
    "0068.png": {
      "hl": {
        "x": 1200,
        "y": 721,
        "w": 475,
        "h": 70
      },
      "cap": "Turn on Interactive mode",
      "vo": "Turn on Interactive mode, so you can review the threat model before it scans."
    },
    "0070.png": {
      "hl": {
        "x": 1200,
        "y": 721,
        "w": 475,
        "h": 70
      },
      "hold": 1.4
    },
    "0071.png": {
      "cap": "Run the scan",
      "vo": "Then run the scan."
    },
    "0073.png": {
      "hold": 1.2,
      "cap": "The scan starts by building a scan model"
    },
    "0074.png": {
      "badge": "Sped up",
      "vo": "Devin reads the code and drafts a threat model first."
    },
    "0098.png": {
      "hold": 2.8,
      "badge": null,
      "cap": "A scan model with rules written for this code",
      "vo": "Before it scans, Devin proposes a scan model, with rules written for this exact code."
    },
    "0099.png": {
      "hl": {
        "x": 360,
        "y": 291,
        "w": 658,
        "h": 210
      },
      "hold": 2.6,
      "vo": "It flags the forwarded user header, which is trusted before any token."
    },
    "0100.png": {
      "hl": {
        "x": 360,
        "y": 705,
        "w": 658,
        "h": 210
      },
      "hold": 2.4,
      "vo": "It flags boards loaded by ID, with no owner check."
    },
    "0101.png": {
      "hl": {
        "x": 360,
        "y": 694,
        "w": 658,
        "h": 232
      },
      "hold": 2.4,
      "vo": "And it flags file paths built from the request."
    },
    "0102.png": {
      "vo": "This looks right, so start scanning."
    },
    "0103.png": {
      "hold": 0.8
    },
    "0104.png": {
      "skip": true
    },
    "0105.png": {
      "skip": true
    },
    "0106.png": {
      "skip": true
    },
    "0107.png": {
      "skip": true
    },
    "0108.png": {
      "skip": true
    },
    "0109.png": {
      "skip": true
    },
    "0110.png": {
      "skip": true
    },
    "0111.png": {
      "skip": true
    },
    "0112.png": {
      "skip": true
    },
    "0113.png": {
      "skip": true
    },
    "0114.png": {
      "skip": true
    },
    "0115.png": {
      "skip": true
    },
    "0116.png": {
      "skip": true
    },
    "0117.png": {
      "skip": true
    },
    "0118.png": {
      "skip": true
    },
    "0119.png": {
      "skip": true
    },
    "0120.png": {
      "skip": true
    },
    "0121.png": {
      "skip": true
    },
    "0122.png": {
      "skip": true
    },
    "0123.png": {
      "skip": true
    },
    "0124.png": {
      "skip": true
    },
    "0125.png": {
      "skip": true
    },
    "0126.png": {
      "skip": true
    },
    "0127.png": {
      "skip": true
    },
    "0128.png": {
      "skip": true
    },
    "0129.png": {
      "skip": true
    },
    "0130.png": {
      "skip": true
    },
    "0131.png": {
      "skip": true
    },
    "0132.png": {
      "skip": true
    },
    "0133.png": {
      "skip": true
    },
    "0134.png": {
      "skip": true
    },
    "0135.png": {
      "skip": true
    },
    "0136.png": {
      "skip": true
    },
    "0137.png": {
      "skip": true
    },
    "0138.png": {
      "skip": true
    },
    "0139.png": {
      "skip": true
    },
    "0140.png": {
      "skip": true
    },
    "0141.png": {
      "skip": true
    },
    "0142.png": {
      "skip": true
    },
    "0143.png": {
      "skip": true
    },
    "0144.png": {
      "skip": true
    },
    "0145.png": {
      "skip": true
    },
    "0146.png": {
      "skip": true
    },
    "0147.png": {
      "skip": true
    },
    "0148.png": {
      "skip": true
    },
    "0149.png": {
      "skip": true
    },
    "0150.png": {
      "skip": true
    },
    "0151.png": {
      "skip": true
    },
    "0152.png": {
      "skip": true
    },
    "0153.png": {
      "skip": true
    },
    "0154.png": {
      "skip": true
    },
    "0155.png": {
      "skip": true
    },
    "0156.png": {
      "skip": true
    },
    "0157.png": {
      "skip": true
    },
    "0158.png": {
      "skip": true
    },
    "0159.png": {
      "skip": true
    },
    "0160.png": {
      "skip": true
    },
    "0161.png": {
      "skip": true
    },
    "0162.png": {
      "skip": true
    },
    "0163.png": {
      "skip": true
    },
    "0164.png": {
      "skip": true
    },
    "0165.png": {
      "skip": true
    },
    "0166.png": {
      "skip": true
    },
    "0167.png": {
      "skip": true
    },
    "0168.png": {
      "skip": true
    },
    "0169.png": {
      "hold": 2.6,
      "cap": "Seven open findings, each one confirmed in a sandbox",
      "vo": "A few minutes later, there are seven open findings, and each one was confirmed in a sandbox."
    },
    "0170.png": {
      "cap": "Open the worst one",
      "vo": "Open the worst one."
    },
    "0171.png": {
      "skip": true
    },
    "0172.png": {
      "hold": 3.4,
      "hl": {
        "x": 915,
        "y": 382,
        "w": 330,
        "h": 175
      },
      "cap": "Critical, high confidence: a full auth bypass",
      "vo": "A spoofed header gives anyone a full auth bypass, and lets them act as the admin."
    },
    "0173.png": {
      "hold": 4.0,
      "hl": {
        "x": 1080,
        "y": 215,
        "w": 640,
        "h": 200
      },
      "cap": "The attack path, step by step",
      "vo": "The attack path shows each step, from the forged header to the admin export."
    },
    "0174.png": {
      "hold": 3.6,
      "hl": {
        "x": 1080,
        "y": 271,
        "w": 640,
        "h": 320
      },
      "cap": "References point to the exact lines",
      "vo": "References point to the exact lines in auth dot js."
    },
    "0175.png": {
      "hold": 4.0,
      "hl": {
        "x": 1080,
        "y": 245,
        "w": 640,
        "h": 260
      },
      "cap": "Confirmed in a sandbox",
      "vo": "Sandbox validation ran the real API and confirmed it."
    },
    "0176.png": {
      "hold": 4.4,
      "hl": {
        "x": 1080,
        "y": 280,
        "w": 640,
        "h": 360
      },
      "cap": "The exact requests, and what came back",
      "vo": "Here are the exact curl requests, and the admin data that came back, with no token at all."
    },
    "0177.png": {
      "cap": "Assign it to Devin",
      "vo": "Now assign it to Devin."
    },
    "0179.png": {
      "hold": 1.4,
      "cap": "A fix session starts right away"
    },
    "0180.png": {
      "hold": 3.2,
      "hl": {
        "x": 1270,
        "y": 117,
        "w": 300,
        "h": 50
      },
      "cap": "Devin already opened a fix PR",
      "vo": "Within a minute, a fix session has already opened a pull request."
    },
    "0181.png": {
      "cap": "Open the fix session",
      "vo": "Open the fix session."
    },
    "0182.png": {
      "hold": 0.8
    },
    "0183.png": {
      "skip": true
    },
    "0184.png": {
      "hold": 3.6,
      "hl": {
        "x": 720,
        "y": 401,
        "w": 862,
        "h": 145
      },
      "cap": "It checks the code on main, then opens a fix PR",
      "vo": "Devin gets the finding and its evidence, checks the code on main, and opens a pull request with the fix."
    },
    "0185.png": {
      "hold": 4.4,
      "hl": {
        "x": 720,
        "y": 210,
        "w": 865,
        "h": 82
      },
      "cap": "It flags the earlier revert before you merge",
      "vo": "It even flags that an earlier fix was reverted on main, and asks you to check before merging."
    },
    "0186.png": {
      "hold": 3.4,
      "hl": {
        "x": 720,
        "y": 485,
        "w": 865,
        "h": 70
      },
      "cap": "Tests pass, and the PR is ready for review",
      "vo": "The tests pass, and the pull request is ready for review."
    },
    "0187.png": {
      "cap": "Open the pull request",
      "vo": "Open the pull request right in the session."
    },
    "0188.png": {
      "skip": true
    },
    "0189.png": {
      "cap": "Give it the full width"
    },
    "0190.png": {
      "skip": true
    },
    "0191.png": {
      "hold": 3.2,
      "hl": {
        "x": 721,
        "y": 145,
        "w": 1438,
        "h": 180
      },
      "cap": "Ready to merge, with 3 files changed",
      "vo": "It's ready to merge, with three files changed."
    },
    "0192.png": {
      "hold": 5.0,
      "hl": {
        "x": 575,
        "y": 595,
        "w": 1125,
        "h": 330
      },
      "cap": "The header now needs a fresh HMAC from the proxy",
      "vo": "The header is now trusted only when the proxy signs it with a fresh HMAC, and the check fails closed when no secret is set."
    }
  }
};
