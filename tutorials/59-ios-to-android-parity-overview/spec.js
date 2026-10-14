window.SPEC = {
  "title": "Port an iOS screen to Android",
  "subtitle": "Prove parity with two sessions and one PR, an overview",
  "outro": "Run the original, build the port, prove they match",
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.6,
  "edit": {
    "0000.png": {
      "scene": "idea",
      "hold": 6.6,
      "cursor": false,
      "capPos": "bottom",
      "hl": null,
      "cap": "Two sessions, two platforms, one PR",
      "vo": "To port an iOS screen to Android, run the original on a Mac, build the port on an Android emulator, and show both screens in one pull request."
    },
    "0001.png": {
      "hold": 3.6,
      "cursor": false,
      "hl": null,
      "voGap": 1.0,
      "ring": {
        "x": 855,
        "y": 560,
        "w": 265,
        "h": 37.5
      },
      "ringFor": 3.2,
      "cap": "Session 1: pick macOS",
      "vo": "The first session runs on macOS, which you pick from the platform menu."
    },
    "0002.png": {
      "hold": 3.8,
      "cursor": false,
      "hl": null,
      "ring": {
        "x": 1017,
        "y": 385,
        "w": 250,
        "h": 510
      },
      "ringFor": 3.4,
      "cap": "The original, in the iPhone Simulator",
      "vo": "It runs the original app in the iPhone Simulator and screenshots the screen."
    },
    "0003.png": {
      "scene": "flow",
      "hold": 6.4,
      "cursor": false,
      "capPos": "bottom",
      "hl": null,
      "voGap": 1.0,
      "cap": "Spec, port, same screen, side by side",
      "vo": "From that screenshot it writes a parity spec, and a second session on Ubuntu builds the port to match it, then screenshots the same screen."
    },
    "0004.png": {
      "hold": 2.2,
      "cursor": false,
      "hl": null,
      "voGap": 1.0,
      "ring": {
        "x": 667,
        "y": 233,
        "w": 112,
        "h": 250
      },
      "ringFor": 2.2,
      "cap": "The port, on the Android emulator",
      "vo": "Here's the port, running on the Android emulator."
    },
    "0005.png": {
      "hold": 4.4,
      "cursor": false,
      "hl": null,
      "ring": {
        "x": 1003,
        "y": 330,
        "w": 828,
        "h": 425
      },
      "ringFor": 4.0,
      "cap": "iOS and Android, side by side in the PR",
      "vo": "The pull request shows the iOS and Android screens side by side, at the same size."
    },
    "0006.png": {
      "scene": "why",
      "hold": 6.2,
      "cursor": false,
      "capPos": "bottom",
      "hl": null,
      "voGap": 1.0,
      "cap": "Why it matters",
      "vo": "That's the point of the pattern: the spec gives the port a clear target, and the screenshots let a reviewer check the result instead of trusting it."
    },
    "0007.png": {
      "hold": 5.0,
      "cursor": false,
      "hl": null,
      "voGap": 1.0,
      "ring": {
        "x": 1003,
        "y": 515,
        "w": 840,
        "h": 270
      },
      "ringFor": 4.6,
      "cap": "Known differences are listed",
      "vo": "Anything that can't match exactly, like system fonts and icons, is listed as a known difference."
    },
    "0008.png": {
      "scene": "usecases",
      "hold": 5.4,
      "cursor": false,
      "capPos": "bottom",
      "hl": null,
      "voGap": 1.0,
      "cap": "Port, check a redesign, catch drift",
      "vo": "Use it to port an app one screen at a time, check a redesign on both platforms, or catch drift between two apps."
    },
    "0009.png": {
      "scene": "setup",
      "hold": 7.0,
      "cursor": false,
      "capPos": "bottom",
      "hl": null,
      "voGap": 1.0,
      "cap": "Pick macOS, then ask Ubuntu for an emulator",
      "vo": "To set it up, pick macOS for the first session, then ask an Ubuntu session to set up an Android emulator, and approve the blueprint Devin proposes."
    },
    "0010.png": {
      "hold": 4.6,
      "cursor": false,
      "hl": null,
      "voGap": 1.0,
      "cap": "One prompt for the emulator and the port",
      "vo": "Here, one prompt asked for the emulator, the port and the side by side screenshots."
    }
  },
  "voOutro": "Run the original, build the port, and let the screenshots prove they match."
};
