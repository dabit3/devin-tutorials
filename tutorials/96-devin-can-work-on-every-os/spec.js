window.SPEC = {
  "title": "Devin on every OS",
  "subtitle": "Linux, macOS and Windows machines, from one place",
  "outro": "Pick the machine. Devin does the work there.",
  "voOutro": "Pick the machine your work needs, and Devin does the work there, all from one place.",
  "outroVoDelay": 0.2,
  "tailHold": 0.2,
  "introHold": 3.4,
  "pace": 1,
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.3,
  "voSentGap": 0.5,
  "pollRunMax": 2.2,
  "edit": {
    "0000.png": {
      "scene": "idea",
      "hold": 7.0,
      "cursor": false,
      "hl": null,
      "voDelay": -2.6,
      "vo": "Devin can work on Linux, macOS and Windows machines from one place. Every session gets its own machine: Ubuntu by default, or macOS or Windows when your work needs them."
    },
    "0010.png": {
      "hold": 1.4,
      "cursor": true,
      "voGap": 0.5,
      "vo": "You pick the machine from the menu under the prompt box."
    },
    "0011.png": {
      "dwell": 0.6
    },
    "0012.png": {
      "hold": 0.6
    },
    "0013.png": {
      "hold": 2.6,
      "ring": {
        "x": 855,
        "y": 547.5,
        "w": 283,
        "h": 170
      },
      "ringFor": 2.6,
      "vo": "Under Virtual environment, the hosted options are Ubuntu, macOS and Windows."
    },
    "0014.png": {
      "dwell": 0.6
    },
    "0015.png": {
      "hold": 0.6
    },
    "0016.png": {
      "hold": 1.0
    },
    "0017.png": {
      "hold": 1.8,
      "cursor": false,
      "vo": "Here, Windows is set for the next session."
    },
    "0020.png": {
      "scene": "fanout",
      "hold": 10.0,
      "cursor": false,
      "hl": null,
      "voGap": 0.6,
      "vo": "To see it in action, we gave three Devins the same request, one per OS: run the tests for ledgerkit, a small Python invoicing library, export a sample invoice to CSV, and report back without changing any code."
    },
    "0030.png": {
      "hold": 2.4,
      "cursor": false,
      "vo": "Here's that request going to the Windows machine."
    },
    "0031.png": {
      "hold": 0.5
    },
    "0032.png": {
      "hold": 2.6,
      "cursor": false,
      "subPos": "top",
      "ring": {
        "x": 569,
        "y": 404,
        "w": 540,
        "h": 42
      },
      "ringFor": 2.4,
      "vo": "Early on, Devin checks the machine itself: its Python, its Windows version and its shell."
    },
    "0040.png": {
      "hold": 3.0,
      "cursor": false,
      "subPos": "top",
      "ring": {
        "x": 736,
        "y": 477,
        "w": 830,
        "h": 132
      },
      "ringFor": 2.8,
      "vo": "On Ubuntu 22.04 with Python 3.10, all eight tests passed and the CSV came back.",
      "voSay": "On Ubuntu twenty-two oh four, with Python three point ten, all eight tests passed, and the CSV came back."
    },
    "0041.png": {
      "hold": 2.2,
      "cursor": false,
      "subPos": "top"
    },
    "0050.png": {
      "hold": 3.0,
      "cursor": false,
      "subPos": "top",
      "ring": {
        "x": 620,
        "y": 463,
        "w": 670,
        "h": 94
      },
      "ringFor": 2.8,
      "vo": "On macOS 26 on Apple silicon, with Python 3.9, the same eight tests passed.",
      "voSay": "On macOS twenty-six on Apple silicon, with Python three point nine, the same eight tests passed."
    },
    "0051.png": {
      "hold": 2.4,
      "cursor": false,
      "subPos": "top"
    },
    "0055.png": {
      "hold": 3.0,
      "cursor": false,
      "subPos": "top",
      "ring": {
        "x": 614,
        "y": 458,
        "w": 604,
        "h": 104
      },
      "ringFor": 2.8,
      "vo": "And on Windows Server 2022 with Python 3.13, all eight passed again.",
      "voSay": "And on Windows Server twenty twenty-two, with Python three point thirteen, all eight passed again."
    },
    "0056.png": {
      "hold": 3.0,
      "cursor": false,
      "subPos": "top",
      "ring": {
        "x": 719,
        "y": 360,
        "w": 884,
        "h": 98
      },
      "ringFor": 2.8,
      "vo": "Devin also noted what Windows needed: python instead of python3, and a different path to activate the virtual environment.",
      "voSay": "Devin also noted what Windows needed: python instead of python three, and a different path to activate the virtual environment."
    },
    "0060.png": {
      "scene": "results",
      "hold": 7.0,
      "cursor": false,
      "hl": null,
      "voGap": 0.6,
      "vo": "Three machines, one answer. And all three flagged the same bug this demo app ships with: the invoice subtotal ignores quantity."
    },
    "0070.png": {
      "scene": "usecases",
      "hold": 6.0,
      "cursor": false,
      "hl": null,
      "voGap": 0.6,
      "vo": "Use it to check a library on every OS before a release, to build Mac and iOS apps with Xcode and the Simulator, or to test Windows desktop apps, with the same Computer Use on every machine."
    }
  }
};
