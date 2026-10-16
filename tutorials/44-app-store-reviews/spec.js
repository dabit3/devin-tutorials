window.SPEC = {
  "title": "App Store reviews to fixes",
  "subtitle": "Group 1-star reviews, reproduce on iOS and Android, fix in one PR",
  "outro": "1-star reviews to fixes, verified on iOS and Android",
  "voOutro": "That's how you turn one-star reviews into fixes verified on iOS and Android, every night.",
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.6,
  "pollRunMax": 2.5,
  "noZoom": [
    [
      "0052.png"
    ]
  ],
  "edit": {
    "0000.png": {
      "hold": 6,
      "cursor": false,
      "capPos": "bottom",
      "cap": "Run it every night, or whenever new reviews come in",
      "vo": "You can have Devin turn your one-star app reviews into fixes automatically, every night or whenever new reviews come in. It groups the complaints, reproduces each one on the iOS Simulator and the Android emulator, and fixes them in a pull request."
    },
    "0006.png": {
      "cursor": false,
      "capPos": "bottom",
      "cap": "Two exports: App Store Connect and Google Play",
      "voGap": 1.2,
      "vo": "Tabby is a small Expo demo app with four bugs we planted on purpose, and these reviews are demo data in the real App Store Connect and Google Play export formats."
    },
    "0024.png": {
      "hold": 2.6,
      "cursor": false,
      "capPos": "bottom",
      "cap": "App Store Connect customer reviews (demo data)"
    },
    "0042.png": {
      "hold": 2.6,
      "cursor": false,
      "capPos": "bottom",
      "cap": "Google Play reviews CSV (demo data)"
    },
    "0043.png": {
      "hold": 2.2,
      "voGap": 1.2,
      "cap": "Start one session on the demo repo",
      "vo": "For this demo, I start one Devin session by hand, mention the demo repo, and give it the goal, not the answer."
    },
    "0046.png": {
      "skip": true
    },
    "0050.png": {
      "hold": 4,
      "cursor": false,
      "cap": "Group, reproduce on iOS and Android, then fix",
      "vo": "The prompt asks Devin to group the complaints into themes, start two managed Devins to reproduce every theme, one on macOS with the iOS Simulator and one on Linux with an Android emulator, then fix what reproduces in one pull request and re-verify it on both."
    },
    "0053.png": {
      "cap": "",
      "badge": "Sped up",
      "hold": 1.2
    },
    "0054.png": {
      "skip": true
    },
    "0055.png": {
      "skip": true
    },
    "0056.png": {
      "skip": true
    },
    "0057.png": {
      "skip": true
    },
    "0058.png": {
      "skip": true
    },
    "0059.png": {
      "hold": 1.2
    },
    "0060.png": {
      "skip": true
    },
    "0061.png": {
      "skip": true
    },
    "0062.png": {
      "skip": true
    },
    "0063.png": {
      "skip": true
    },
    "0064.png": {
      "skip": true
    },
    "0065.png": {
      "skip": true
    },
    "0066.png": {
      "hold": 1.2
    },
    "0067.png": {
      "skip": true
    },
    "0068.png": {
      "skip": true
    },
    "0069.png": {
      "hold": 4,
      "badge": null,
      "cap": "Four bug themes, plus reviews that are not bugs",
      "voGap": 1.2,
      "ring": {
        "x": 725,
        "y": 332,
        "w": 870,
        "h": 250
      },
      "ringFor": 4,
      "vo": "Devin reads all twenty-five reviews and groups them into four bug themes, each tied to the likely cause in the code. Some reviews aren't bugs. One complains about ads, but the app has no ads, and two are feature requests."
    },
    "0070.png": {
      "skip": true
    },
    "0071.png": {
      "skip": true
    },
    "0072.png": {
      "skip": true
    },
    "0073.png": {
      "skip": true
    },
    "0074.png": {
      "skip": true
    },
    "0075.png": {
      "skip": true
    },
    "0076.png": {
      "skip": true
    },
    "0077.png": {
      "skip": true
    },
    "0078.png": {
      "skip": true
    },
    "0079.png": {
      "skip": true
    },
    "0080.png": {
      "skip": true
    },
    "0081.png": {
      "skip": true
    },
    "0082.png": {
      "skip": true
    },
    "0083.png": {
      "hold": 3.5,
      "cap": "Two managed Devins: macOS and Linux",
      "ring": {
        "x": 700,
        "y": 410,
        "w": 830,
        "h": 66
      },
      "ringFor": 3.5,
      "vo": "Then it starts two managed Devins, a macOS session for the iOS Simulator and a Linux session for the Android emulator, and waits for their results."
    },
    "0084.png": {
      "skip": true
    },
    "0085.png": {
      "skip": true
    },
    "0086.png": {
      "skip": true
    },
    "0087.png": {
      "skip": true
    },
    "0088.png": {
      "skip": true
    },
    "0089.png": {
      "skip": true
    },
    "0090.png": {
      "skip": true
    },
    "0091.png": {
      "skip": true
    },
    "0092.png": {
      "skip": true
    },
    "0093.png": {
      "skip": true
    },
    "0094.png": {
      "skip": true
    },
    "0095.png": {
      "hold": 3.5,
      "cursor": false,
      "cap": "iOS Simulator: each person's share skips the tip",
      "voGap": 1.2,
      "vo": "On the iOS Simulator, the macOS Devin enters a bill from one of the reviews, and each person's share leaves out the tip."
    },
    "0096.png": {
      "skip": true
    },
    "0097.png": {
      "skip": true
    },
    "0098.png": {
      "skip": true
    },
    "0099.png": {
      "hold": 3,
      "cap": "Dark mode: the bill name disappears",
      "vo": "In dark mode, the bill names vanish from the list."
    },
    "0100.png": {
      "skip": true
    },
    "0101.png": {
      "skip": true
    },
    "0102.png": {
      "skip": true
    },
    "0103.png": {
      "skip": true
    },
    "0104.png": {
      "hold": 2.6,
      "cap": "Force-quit and reopen: the saved bills are gone",
      "vo": "Then it force-quits Tabby on the Simulator and reopens it, and the saved bills are gone."
    },
    "0105.png": {
      "skip": true
    },
    "0106.png": {
      "hold": 1.2
    },
    "0107.png": {
      "skip": true
    },
    "0108.png": {
      "hold": 1.2
    },
    "0109.png": {
      "skip": true
    },
    "0110.png": {
      "hold": 2
    },
    "0111.png": {
      "hold": 2.6,
      "cursor": false,
      "cap": "The Linux Devin runs Tabby on the Android emulator",
      "voGap": 1.2,
      "vo": "Meanwhile, the Linux Devin runs the same app in Expo Go on the Android emulator."
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
      "hold": 1.2
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
      "hold": 3,
      "cap": "Same bill on Android: the tip is left out",
      "vo": "It hits the same tip bug."
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
      "hold": 3,
      "cap": "Dark mode hides the bill name",
      "vo": "Bill names disappear in dark mode here too."
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
      "hold": 3.5,
      "cap": "Deleting the last bill crashes the app",
      "vo": "And deleting the last bill crashes the app with an uncaught error."
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
      "cursor": true,
      "voGap": 1.2,
      "cap": "One PR with all four fixes",
      "vo": "Once both have reproduced the bugs, the coordinator opens one pull request with all four fixes. The ads review and the feature requests stay out of it."
    },
    "0162.png": {
      "hold": 4,
      "cursor": false,
      "cap": "Devin Review findings drove three more commits",
      "vo": "Devin Review flagged edge cases in the restart fix, and the coordinator pushed three more commits to handle them."
    },
    "0163.png": {
      "hold": 3,
      "cursor": false,
      "cap": "iOS re-check: the share now includes the tip",
      "voGap": 1.2,
      "vo": "Then both Devins re-verify the fix, and on iOS the same bill now includes the tip."
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
      "hold": 2.6,
      "cap": "Bill names are readable in dark mode",
      "vo": "The bill names show up in dark mode."
    },
    "0169.png": {
      "skip": true
    },
    "0170.png": {
      "skip": true
    },
    "0171.png": {
      "skip": true
    },
    "0172.png": {
      "skip": true
    },
    "0173.png": {
      "skip": true
    },
    "0174.png": {
      "skip": true
    },
    "0175.png": {
      "hold": 1.6,
      "cap": "Delete the last bill",
      "vo": "And deleting the last bill goes back to the empty list instead of crashing."
    },
    "0176.png": {
      "hold": 2.4,
      "cap": "Back to the empty list, no crash"
    },
    "0177.png": {
      "skip": true
    },
    "0178.png": {
      "skip": true
    },
    "0179.png": {
      "skip": true
    },
    "0180.png": {
      "skip": true
    },
    "0181.png": {
      "skip": true
    },
    "0182.png": {
      "skip": true
    },
    "0183.png": {
      "skip": true
    },
    "0184.png": {
      "skip": true
    },
    "0185.png": {
      "skip": true
    },
    "0186.png": {
      "skip": true
    },
    "0187.png": {
      "skip": true
    },
    "0188.png": {
      "skip": true
    },
    "0189.png": {
      "skip": true
    },
    "0190.png": {
      "skip": true
    },
    "0191.png": {
      "skip": true
    },
    "0192.png": {
      "skip": true
    },
    "0193.png": {
      "skip": true
    },
    "0194.png": {
      "skip": true
    },
    "0195.png": {
      "skip": true
    },
    "0196.png": {
      "skip": true
    },
    "0197.png": {
      "skip": true
    },
    "0198.png": {
      "hold": 2,
      "cap": "Force-quit and reopen to check saved bills",
      "vo": "It also force-quits and reopens the app to check that bills are saved."
    },
    "0199.png": {
      "hold": 1.2
    },
    "0200.png": {
      "hold": 1.2
    },
    "0201.png": {
      "hold": 1.6,
      "cursor": false,
      "cap": "Android re-check on the same build",
      "voGap": 1.2,
      "vo": "On Android, the split includes the tip too, and bill names are readable in dark mode."
    },
    "0202.png": {
      "skip": true
    },
    "0203.png": {
      "skip": true
    },
    "0204.png": {
      "skip": true
    },
    "0205.png": {
      "skip": true
    },
    "0206.png": {
      "skip": true
    },
    "0207.png": {
      "skip": true
    },
    "0208.png": {
      "skip": true
    },
    "0209.png": {
      "skip": true
    },
    "0210.png": {
      "skip": true
    },
    "0211.png": {
      "skip": true
    },
    "0212.png": {
      "skip": true
    },
    "0213.png": {
      "skip": true
    },
    "0214.png": {
      "skip": true
    },
    "0215.png": {
      "hold": 2.6,
      "cap": "The share includes the tip"
    },
    "0216.png": {
      "skip": true
    },
    "0217.png": {
      "skip": true
    },
    "0218.png": {
      "skip": true
    },
    "0219.png": {
      "skip": true
    },
    "0220.png": {
      "skip": true
    },
    "0221.png": {
      "skip": true
    },
    "0222.png": {
      "skip": true
    },
    "0223.png": {
      "skip": true
    },
    "0224.png": {
      "skip": true
    },
    "0225.png": {
      "skip": true
    },
    "0226.png": {
      "skip": true
    },
    "0227.png": {
      "skip": true
    },
    "0228.png": {
      "skip": true
    },
    "0229.png": {
      "hold": 2.2,
      "cap": "Dark mode fixed on Android"
    },
    "0230.png": {
      "skip": true
    },
    "0231.png": {
      "skip": true
    },
    "0232.png": {
      "skip": true
    },
    "0233.png": {
      "skip": true
    },
    "0234.png": {
      "skip": true
    },
    "0235.png": {
      "skip": true
    },
    "0236.png": {
      "skip": true
    },
    "0237.png": {
      "skip": true
    },
    "0238.png": {
      "skip": true
    },
    "0239.png": {
      "hold": 1.6,
      "cap": "Delete down to the last bill"
    },
    "0240.png": {
      "skip": true
    },
    "0241.png": {
      "skip": true
    },
    "0242.png": {
      "skip": true
    },
    "0243.png": {
      "cursor": true,
      "voGap": 1.2,
      "cap": "Both managed Devins, asleep when done",
      "vo": "The Agents tab lists both managed Devins, which the coordinator put to sleep when they finished."
    },
    "0245.png": {
      "hold": 3,
      "cursor": false
    },
    "0246.png": {
      "hold": 3.5,
      "cursor": false,
      "cap": "Final re-check passed on both platforms",
      "voGap": 1.2,
      "vo": "The final summary says both platforms passed the last re-check on the latest commit, with CI passing and every review thread resolved."
    },
    "0247.png": {
      "hold": 3.5,
      "cap": "It lists what it couldn't test",
      "vo": "It also lists what it couldn't test and a known follow-up, and the pull request is left for you to merge."
    }
  }
};
