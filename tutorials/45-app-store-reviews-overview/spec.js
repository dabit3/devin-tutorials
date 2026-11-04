window.SPEC = {
  "title": "App Store reviews to fixes",
  "subtitle": "From 1-star reviews to bugs reproduced and fixed on iOS and Android, an overview",
  "outro": "1-star reviews to fixes, verified on iOS and Android",
  "voOutro": "That's how you turn one-star reviews into fixes, tested on iOS and Android.",
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.6,
  "edit": {
    "0000.png": {
      "scene": "flow0",
      "hold": 4,
      "cursor": false,
      "capPos": "bottom",
      "hl": null,
      "cap": "Run it every night, or whenever new reviews come in",
      "vo": "In this video, Devin turns one-star app reviews into bug fixes. It reproduces each bug on iOS and Android, then fixes them in one pull request."
    },
    "0001.png": {
      "hold": 3.5,
      "cursor": false,
      "cap": "A real App Store Connect export, demo reviews",
      "voGap": 0.8,
      "vo": "We start it by hand here, but you can also run it on a schedule. The app has bugs we planted on purpose. The reviews are demo data in the App Store Connect and Google Play formats."
    },
    "0002.png": {
      "scene": "flow1",
      "hold": 4,
      "cursor": false,
      "capPos": "bottom",
      "hl": null,
      "cap": "Step 1: group the complaints into themes",
      "voGap": 0.8,
      "vo": "First, Devin reads every review. It groups the complaints into themes and links each theme to the likely cause in the code."
    },
    "0003.png": {
      "hold": 4,
      "cursor": false,
      "cap": "Four bug themes, plus reviews that aren't bugs",
      "ring": {
        "x": 725,
        "y": 332,
        "w": 870,
        "h": 250
      },
      "ringFor": 4,
      "vo": "Here it found four bug themes. One review complained about ads, but the app has no ads. Two reviews asked for new features, so they stay out."
    },
    "0004.png": {
      "scene": "flow2",
      "hold": 4.5,
      "cursor": false,
      "capPos": "bottom",
      "hl": null,
      "cap": "Step 2: reproduce on iOS and Android",
      "voGap": 0.8,
      "vo": "Next, it starts two managed Devins, which are child sessions. One is a macOS session for the iOS Simulator. The other is a Linux session for the Android emulator."
    },
    "0005.png": {
      "hold": 2.2,
      "cursor": false,
      "cap": "One managed Devin per platform",
      "ring": {
        "x": 700,
        "y": 410,
        "w": 830,
        "h": 66
      },
      "ringFor": 2.2
    },
    "0006.png": {
      "hold": 3,
      "cursor": false,
      "cap": "iOS Simulator: the share leaves out the tip",
      "vo": "On the Simulator, each person's share leaves out the tip."
    },
    "0007.png": {
      "hold": 3,
      "cursor": false,
      "cap": "Android emulator: deleting the last bill crashes",
      "vo": "On the emulator, deleting the last bill crashes the app."
    },
    "0008.png": {
      "scene": "flow3",
      "hold": 4,
      "cursor": false,
      "capPos": "bottom",
      "hl": null,
      "cap": "Step 3: one PR with every fix",
      "voGap": 0.8,
      "vo": "Then the first Devin, the coordinator, puts every fix in one pull request. Devin Review checks the pull request."
    },
    "0009.png": {
      "hold": 3.5,
      "cursor": false,
      "cap": "The fix: each share uses the total, tip included",
      "vo": "Each share is now the total, with the tip, divided by the number of people."
    },
    "0010.png": {
      "scene": "flow4",
      "hold": 4,
      "cursor": false,
      "capPos": "bottom",
      "hl": null,
      "cap": "Step 4: re-verify on both platforms",
      "voGap": 0.8,
      "vo": "Finally, both managed Devins test the fixed build again on their platform."
    },
    "0011.png": {
      "hold": 2.8,
      "cursor": false,
      "cap": "iOS: the share includes the tip",
      "vo": "On iOS, the share includes the tip."
    },
    "0012.png": {
      "hold": 2.8,
      "cursor": false,
      "cap": "Android: bill names readable in dark mode",
      "vo": "On Android, bill names are easy to read in dark mode."
    },
    "0013.png": {
      "scene": "uses",
      "hold": 4.5,
      "cursor": false,
      "capPos": "bottom",
      "hl": null,
      "cap": "What you can do with it",
      "voGap": 0.8,
      "vo": "You can use this to sort a review export into bugs and other complaints. Devin reproduces each bug before it fixes it, and tests again before you merge."
    },
    "0014.png": {
      "hold": 4,
      "cursor": false,
      "cap": "Both platforms passed the final re-check",
      "vo": "Devin reports back when both platforms pass the final check. It leaves the pull request for you to merge."
    }
  }
};
