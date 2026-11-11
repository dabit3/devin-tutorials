window.SPEC = {
  "title": "From recording to automation",
  "subtitle": "How it works, and what you can hand off",
  "outro": "One recording in. Devin builds and runs the rest",
  "voOutro": "That's how you turn one screen recording into a scheduled automation with Devin.",
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.6,
  "edit": {
    "0000.png": {
      "scene": "value",
      "hold": 4.6,
      "cap": "One recording in, a working automation out",
      "vo": "In this video, Devin turns a screen recording of a chore into a scheduled automation.",
      "cursor": false,
      "voHold": 7.4,
      "capPos": "bottom"
    },
    "0014.png": {
      "scene": "builds",
      "hold": 4.4,
      "cap": "You give it a video. Devin builds the rest",
      "vo": "You do not write the steps or any code. Devin works out the steps, writes a Playwright script, and tests it. It opens a pull request and puts the script on a schedule.",
      "cursor": false,
      "voHold": 5.1,
      "capPos": "bottom"
    },
    "0001.png": {
      "scene": "flow1",
      "hold": 3.4,
      "cap": "1. Record the chore once",
      "vo": "First, you record your screen while you do the chore one time.",
      "cursor": false,
      "voHold": 3.4,
      "capPos": "bottom"
    },
    "0002.png": {
      "hold": 3.4,
      "cap": "We recorded this ourselves, on seeded demo data",
      "vo": "For this demo, we built a refund app and filled it with sample data. We recorded ourselves approving small refunds for damaged items.",
      "cursor": false
    },
    "0003.png": {
      "scene": "flow2",
      "hold": 3.4,
      "cap": "2. Attach it to a Devin session",
      "vo": "Then you attach the video to a Devin session and describe the goal in plain words.",
      "cursor": false,
      "voHold": 4.2,
      "capPos": "bottom"
    },
    "0004.png": {
      "hold": 2.6,
      "cap": "The video, attached to the prompt",
      "vo": "The recording goes in like any other attachment.",
      "ring": {
        "x": 330.6,
        "y": 430,
        "w": 75,
        "h": 75
      },
      "cursor": false,
      "ringFor": 2.2
    },
    "0005.png": {
      "scene": "flow3",
      "hold": 3.4,
      "cap": "3. Devin extracts the workflow",
      "vo": "Devin pulls frames from the video. It works out the steps and the rule behind them on its own.",
      "cursor": false,
      "voHold": 4.3,
      "capPos": "bottom"
    },
    "0006.png": {
      "hold": 3.4,
      "cap": "It inferred the rule from the frames",
      "vo": "Here, it saw that only damaged items of fifty dollars or less were approved.",
      "ring": {
        "x": 725,
        "y": 418,
        "w": 850,
        "h": 96
      },
      "cursor": false,
      "ringFor": 3.0
    },
    "0007.png": {
      "scene": "flow4",
      "hold": 3.4,
      "cap": "4. It turns what it saw into Playwright",
      "vo": "Next, Devin writes a Playwright script from what it saw. It runs the script in its own browser to check that it matches.",
      "cursor": false,
      "voHold": 4.4,
      "capPos": "bottom"
    },
    "0008.png": {
      "hold": 3.2,
      "cap": "The script running in Devin's browser",
      "vo": "In the Computer tab, you can watch the script click through the app.",
      "cursor": false,
      "ring": {
        "x": 1008,
        "y": 370,
        "w": 846,
        "h": 590
      },
      "ringFor": 2.8
    },
    "0010.png": {
      "hold": 2.6,
      "cap": "The script, in a pull request",
      "vo": "The script goes into a pull request.",
      "ring": {
        "x": 916,
        "y": 161,
        "w": 680,
        "h": 46
      },
      "cursor": false,
      "ringFor": 2.2
    },
    "0009.png": {
      "scene": "flow5",
      "hold": 3.4,
      "cap": "5. Devin schedules future runs",
      "vo": "Finally, Devin sets up an Automation with a schedule trigger. The chore then runs without you.",
      "cursor": false,
      "voHold": 4.8,
      "capPos": "bottom"
    },
    "0012.png": {
      "hold": 2.6,
      "cap": "A schedule trigger in Automations",
      "vo": "This one runs every weekday morning.",
      "ring": {
        "x": 1168.1,
        "y": 372.5,
        "w": 335,
        "h": 50
      },
      "cursor": false,
      "ringFor": 2.2
    },
    "0013.png": {
      "hold": 3.6,
      "cap": "Each run reports its result",
      "vo": "Each run reports back. This run made the same six approvals and exported the file.",
      "ring": {
        "x": 310.3,
        "y": 67.5,
        "w": 480,
        "h": 52
      },
      "cursor": false,
      "ringFor": 3.2
    },
    "0011.png": {
      "scene": "uses",
      "hold": 5.0,
      "cap": "Approvals, exports, data entry, smoke checks",
      "vo": "You can use this for approval queues, morning exports, and data entry from a spreadsheet. You can also use it to check that an important flow still runs.",
      "cursor": false,
      "voHold": 6.6,
      "capPos": "bottom"
    }
  }
};
