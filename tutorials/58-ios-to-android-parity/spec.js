window.SPEC = {
  "title": "Port an iOS screen to Android",
  "subtitle": "Run it in the Simulator, port it on the emulator, prove parity in one PR",
  "outro": "Run the original, port it, prove parity in one PR",
  "speed": 3,
  "cps": 48,
  "pollRunMax": 2.5,
  "capPos": "bottom",
  "noZoom": [
    [
      "0007.png"
    ]
  ],
  "edit": {
    "0000.png": {
      "hold": 2.6,
      "cursor": false,
      "vo": "Here's how to port an iOS screen to Android with Devin, and prove that both versions match."
    },
    "0001.png": {
      "cursor": true,
      "capPos": "auto",
      "cap": "Open the platform menu below the prompt box",
      "voGap": 1.0,
      "vo": "Start with the original app. Open the platform menu below the prompt box."
    },
    "0002.png": {
      "hold": 1.4
    },
    "0003.png": {
      "capPos": "auto",
      "cap": "Pick macOS",
      "vo": "Pick macOS, so the session runs on a Mac with Xcode and the iOS Simulator."
    },
    "0004.png": {
      "hold": 1.4,
      "cap": "macOS is set for the next session",
      "capPos": "auto",
      "target": {
        "x": 330,
        "y": 536,
        "w": 80,
        "h": 30
      }
    },
    "0005.png": {
      "hold": 4.2,
      "cursor": false,
      "cap": "Ask for a screenshot and a parity spec",
      "vo": "Ask Devin to run the app in the iPhone Simulator, screenshot the screen, and write a parity spec of its layout, copy, fonts and colors."
    },
    "0006.png": {
      "cursor": true,
      "hold": 0.6
    },
    "0007.png": {
      "hold": 1.4,
      "cursor": false,
      "cap": "Watch Devin's Mac in the Computer tab",
      "vo": "In the Computer tab, you can watch Devin's Mac build the app and launch it."
    },
    "0008.png": {
      "badge": "Sped up",
      "cursor": false,
      "hold": 1.0
    },
    "0010.png": {
      "hold": 2.4,
      "badge": null,
      "cap": "The original, in the iPhone Simulator",
      "ring": {
        "x": 1017,
        "y": 385,
        "w": 250,
        "h": 510
      },
      "vo": "Here's the onboarding screen, running in the iPhone Simulator."
    },
    "0011.png": {
      "badge": "Sped up",
      "hold": 0.6
    },
    "0016.png": {
      "hold": 3.2,
      "badge": null,
      "cap": "The spec and screenshot land in a PR",
      "ring": {
        "x": 282,
        "y": 261,
        "w": 502,
        "h": 172
      },
      "vo": "Devin pushes the spec and the iOS screenshot to a branch, and opens a pull request."
    },
    "0017.png": {
      "skip": true
    },
    "0018.png": {
      "cursor": true,
      "capPos": "auto",
      "cap": "New session: switch back to Ubuntu",
      "voGap": 1.3,
      "vo": "Now for the port. In a new session, switch the platform back to Ubuntu."
    },
    "0019.png": {
      "hold": 1.2
    },
    "0020.png": {
      "capPos": "auto",
      "cap": "Pick Ubuntu"
    },
    "0021.png": {
      "hold": 1.0
    },
    "0022.png": {
      "hold": 5.0,
      "cursor": false,
      "cap": "Ask it to set up an Android emulator",
      "vo": "There's no Android option in the menu. Instead, ask an Ubuntu session to set up an Android emulator, port the screen with Jetpack Compose, and screenshot the same screen."
    },
    "0023.png": {
      "cursor": true,
      "hold": 0.6
    },
    "0024.png": {
      "hold": 1.0,
      "cursor": false
    },
    "0025.png": {
      "badge": "Sped up",
      "cursor": false,
      "cap": "Devin builds the app and boots the emulator",
      "vo": "Devin builds the Android app with Gradle, boots the emulator and installs the app on it.",
      "hold": 1.0
    },
    "0033.png": {
      "hold": 2.4,
      "badge": null,
      "cap": "The port, on the Android emulator",
      "ring": {
        "x": 667,
        "y": 233,
        "w": 112,
        "h": 250
      },
      "vo": "Here's the port, running on the Android emulator."
    },
    "0034.png": {
      "skip": true
    },
    "0037.png": {
      "hold": 3.2,
      "badge": null,
      "cap": "iOS and Android, side by side",
      "ring": {
        "x": 262,
        "y": 290,
        "w": 462,
        "h": 478
      },
      "vo": "Then it sends you the iOS and Android screens side by side."
    },
    "0038.png": {
      "hold": 0.8,
      "cursor": true
    },
    "0039.png": {
      "skip": true
    },
    "0040.png": {
      "cap": "Open the PR tab",
      "capPos": "auto",
      "voGap": 1.2,
      "vo": "Open the pull request to review the port."
    },
    "0041.png": {
      "hold": 0.6
    },
    "0042.png": {
      "cap": "Open the description",
      "capPos": "auto"
    },
    "0044.png": {
      "hold": 2.6,
      "cursor": false,
      "cap": "The port follows the parity spec",
      "vo": "The description explains how the port follows the parity spec."
    },
    "0045.png": {
      "hold": 3.4,
      "cap": "Same screen, same size, side by side",
      "ring": {
        "x": 1003,
        "y": 330,
        "w": 828,
        "h": 425
      },
      "vo": "Below it, the iOS and Android screenshots sit side by side, at the same size."
    },
    "0046.png": {
      "hold": 3.4,
      "cap": "Known differences are listed",
      "ring": {
        "x": 1003,
        "y": 515,
        "w": 840,
        "h": 270
      },
      "vo": "It also lists the known differences, like fonts and icons, so reviewers know what to expect."
    },
    "0009.png": {
      "skip": true
    },
    "0012.png": {
      "skip": true
    },
    "0013.png": {
      "skip": true
    },
    "0014.png": {
      "skip": true
    },
    "0027.png": {
      "skip": true
    },
    "0029.png": {
      "skip": true
    },
    "0031.png": {
      "skip": true
    },
    "0035.png": {
      "skip": true
    },
    "0036.png": {
      "skip": true
    },
    "0015.png": {
      "hold": 0.6
    },
    "0026.png": {
      "hold": 0.8
    },
    "0028.png": {
      "hold": 0.8
    },
    "0030.png": {
      "hold": 0.8
    },
    "0032.png": {
      "hold": 0.8
    }
  },
  "voOutro": "Run the original on macOS, port it on Android, and prove they match in one pull request."
};
