window.SPEC = {
  "title": "App Store reviews to fixes",
  "subtitle": "From 1-star reviews to bugs reproduced and fixed on iOS and Android, an overview",
  "outro": "1-star reviews to fixes, verified on iOS and Android",
  "voOutro": "That's how you turn one-star reviews into fixes verified on iOS and Android, every night.",
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
      "vo": "You can have Devin turn your one-star app reviews into fixes automatically, every night or whenever new reviews come in. It reproduces each bug on iOS and Android and fixes them in one pull request."
    },
    "0001.png": {
      "hold": 3.5,
      "cursor": false,
      "cap": "A real App Store Connect export, demo reviews",
      "voGap": 0.8,
      "vo": "In this demo, we start it by hand. The app has bugs we planted on purpose, and the reviews are demo data in the real App Store Connect and Google Play formats."
    },
    "0002.png": {
      "scene": "flow1",
      "hold": 4,
      "cursor": false,
      "capPos": "bottom",
      "hl": null,
      "cap": "Step 1: group the complaints into themes",
      "voGap": 0.8,
      "vo": "First, Devin reads every review and groups the complaints into themes, each tied to the likely cause in the code."
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
      "vo": "Here it found four bug themes. One review complained about ads, but the app has no ads, and two were feature requests, so those stay out."
    },
    "0004.png": {
      "scene": "flow2",
      "hold": 4.5,
      "cursor": false,
      "capPos": "bottom",
      "hl": null,
      "cap": "Step 2: reproduce on iOS and Android",
      "voGap": 0.8,
      "vo": "Next, it starts two managed Devins: a macOS session for the iOS Simulator, and a Linux session running the Android emulator."
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
      "vo": "Then the coordinator fixes everything that reproduced in one pull request, and Devin Review checks it."
    },
    "0009.png": {
      "hold": 3.5,
      "cursor": false,
      "cap": "The fix: each share uses the total, tip included",
      "vo": "Each share is now the total, tip included, divided by the number of people."
    },
    "0010.png": {
      "scene": "flow4",
      "hold": 4,
      "cursor": false,
      "capPos": "bottom",
      "hl": null,
      "cap": "Step 4: re-verify on both platforms",
      "voGap": 0.8,
      "vo": "Finally, both managed Devins re-check the fixed build on their platform."
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
      "vo": "And on Android, bill names are readable in dark mode."
    },
    "0013.png": {
      "scene": "uses",
      "hold": 4.5,
      "cursor": false,
      "capPos": "bottom",
      "hl": null,
      "cap": "What you can do with it",
      "voGap": 0.8,
      "vo": "Use it to triage a review export, tell real bugs from other complaints, reproduce before fixing, and re-verify before you merge."
    },
    "0014.png": {
      "hold": 4,
      "cursor": false,
      "cap": "Both platforms passed the final re-check",
      "vo": "Devin reports back when both platforms pass the final check, and leaves the pull request for you to merge."
    }
  }
};
