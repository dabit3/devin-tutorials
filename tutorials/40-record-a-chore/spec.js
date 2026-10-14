window.SPEC = {
  "title": "Record a chore once",
  "subtitle": "Turn a screen recording into a scheduled Playwright automation",
  "outro": "Record it once, and let Devin run it every morning",
  "voOutro": "Record it once, and let Devin run it every morning.",
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.6,
  "pollRunMax": 1,
  "noZoom": [
    [
      "0011.png",
      "0214.png"
    ]
  ],
  "edit": {
    "rec1.png": {
      "hold": 5,
      "cap": "We recorded this chore ourselves, on seeded demo data",
      "vo": "Every morning, someone opens this refund dashboard and does the same few clicks. We recorded that chore once ourselves, in a demo app we built with seeded data that resets on every reload."
    },
    "rec2.png": {
      "hold": 1.6
    },
    "rec3.png": {
      "hold": 2.2,
      "cap": "Filter to Pending"
    },
    "rec4.png": {
      "hold": 3,
      "cap": "Approve damaged-item refunds of $50 or less",
      "vo": "Filter to pending, and approve every damaged item refund of fifty dollars or less."
    },
    "rec5.png": {
      "hold": 1.4,
      "cap": "Export the approved CSV"
    },
    "rec6.png": {
      "hold": 2.0,
      "cap": "Check it in Exports",
      "vo": "Then export the approved CSV and check it in Exports."
    },
    "0000.png": {
      "hold": 1.4,
      "cap": "Start a new Devin session",
      "vo": "In Devin, start a new session and attach the recording like any other file."
    },
    "0001.png": {},
    "0002.png": {
      "cap": "Attach the screen recording"
    },
    "0009.png": {
      "hold": 3,
      "cap": "Give the goal: script it, prove it, schedule it",
      "vo": "Then give it the goal: watch the video, write a Playwright script that does the same thing, prove it in its browser, and schedule it for every weekday at nine UTC."
    },
    "0011.png": {},
    "0013.png": {
      "hold": 1.4
    },
    "0025.png": {
      "hold": 4.5,
      "cap": "Devin pulls frames and infers the rule",
      "vo": "Devin pulls frames out of the video and works out the rule behind the clicks: damaged items of fifty dollars or less get approved, and the bigger ones stay pending."
    },
    "0026.png": {
      "hold": 1.1,
      "badge": "Sped up",
      "cap": "It writes the script and runs it headless",
      "vo": "It writes the script, runs it headless, and checks that it approves the same six refunds as the recording."
    },
    "0030.png": {
      "hold": 1.1,
      "badge": "Sped up"
    },
    "0036.png": {
      "hold": 1.1,
      "badge": "Sped up"
    },
    "0040.png": {
      "hold": 1.1,
      "badge": "Sped up"
    },
    "0044.png": {
      "hold": 1.1,
      "badge": "Sped up"
    },
    "0217.png": {
      "hold": 3,
      "cap": "We asked for a headed rerun to watch",
      "vo": "Devin had already run it in its own Chrome before we opened the Computer tab, so we asked for one more run, slowed down, to watch."
    },
    "0219.png": {},
    "0223.png": {
      "hold": 1.0,
      "cursor": false
    },
    "0225.png": {
      "hold": 1.0,
      "cursor": false,
      "cap": "The script drives Refund Desk in Devin's browser",
      "vo": "In the Computer tab, the script drives Refund Desk on its own: the pending filter, six approvals, the export, and the Exports page."
    },
    "0227.png": {
      "hold": 1.0,
      "cursor": false
    },
    "0229.png": {
      "hold": 1.0,
      "cursor": false
    },
    "0231.png": {
      "hold": 1.0,
      "cursor": false
    },
    "0233.png": {
      "hold": 1.0,
      "cursor": false
    },
    "0235.png": {
      "hold": 1.0,
      "cursor": false
    },
    "0237.png": {
      "hold": 1.0,
      "cursor": false
    },
    "0277.png": {
      "hold": 3,
      "cap": "Devin opened a PR with the script",
      "vo": "Devin also opened a pull request with the script, so the whole chore now lives in the repo as code."
    },
    "0278.png": {
      "hold": 2.2,
      "cap": "refund-chore.js, the whole chore in code"
    },
    "0186.png": {
      "hold": 2.6,
      "cap": "Devin asks how the automation should run",
      "vo": "For the schedule, Devin asks two setup questions: who the runs act as, and when to email. We picked the organization and every run."
    },
    "0188.png": {},
    "0190.png": {},
    "0191.png": {
      "hold": 2.6,
      "cap": "Approve the automation Devin drafted",
      "vo": "Then it drafts the automation, with a weekday nine o'clock schedule and a tight network policy, and we approve it."
    },
    "0192.png": {},
    "0193.png": {},
    "0194.png": {
      "hold": 2.4,
      "cap": "Devin offers a test run",
      "vo": "Devin offers a test run right away, and we approve that too, so we can watch one real run."
    },
    "0196.png": {
      "hold": 0.8
    },
    "0197.png": {
      "hold": 1.0
    },
    "0198.png": {
      "hold": 0.8
    },
    "0199.png": {
      "hold": 1.0
    },
    "0208.png": {
      "hold": 2.6,
      "cap": "It's in the Automations list",
      "vo": "The automation now sits in the Automations list, active, and running as the organization."
    },
    "0209.png": {
      "hold": 0.8
    },
    "0210.png": {
      "hold": 0.8
    },
    "0211.png": {
      "hold": 1.0,
      "cap": "Runs weekdays at 9:00 as the organization"
    },
    "0212.png": {
      "hold": 2.6,
      "cap": "A schedule trigger, not a CI cron",
      "vo": "Its trigger runs on weekdays at nine in the morning, and the events list shows the test run we just started."
    },
    "0213.png": {
      "hold": 1.6,
      "cap": "One real run, triggered on camera"
    },
    "0214.png": {},
    "0207.png": {
      "hold": 5,
      "cap": "SUCCESS: the same six refunds, CSV attached",
      "vo": "About a minute later, the run reports success, with the same six approvals, and the CSV and a screenshot attached. From now on, it runs every weekday at nine, without us."
    },
    "0224.png": {
      "skip": true
    },
    "0226.png": {
      "skip": true
    },
    "0228.png": {
      "skip": true
    },
    "0230.png": {
      "skip": true
    },
    "0232.png": {
      "skip": true
    },
    "0234.png": {
      "skip": true
    },
    "0236.png": {
      "skip": true
    },
    "0238.png": {
      "skip": true
    },
    "0003.png": {
      "skip": true
    },
    "0004.png": {
      "skip": true
    },
    "0005.png": {
      "skip": true
    },
    "0006.png": {
      "skip": true
    },
    "0007.png": {
      "skip": true
    },
    "0008.png": {
      "skip": true
    },
    "0010.png": {
      "skip": true
    },
    "0012.png": {
      "skip": true
    },
    "0014.png": {
      "skip": true
    },
    "0015.png": {
      "skip": true
    },
    "0016.png": {
      "skip": true
    },
    "0017.png": {
      "skip": true
    },
    "0018.png": {
      "skip": true
    },
    "0019.png": {
      "skip": true
    },
    "0020.png": {
      "skip": true
    },
    "0021.png": {
      "skip": true
    },
    "0022.png": {
      "skip": true
    },
    "0023.png": {
      "skip": true
    },
    "0024.png": {
      "skip": true
    },
    "0027.png": {
      "skip": true
    },
    "0028.png": {
      "skip": true
    },
    "0029.png": {
      "skip": true
    },
    "0031.png": {
      "skip": true
    },
    "0032.png": {
      "skip": true
    },
    "0033.png": {
      "skip": true
    },
    "0034.png": {
      "skip": true
    },
    "0035.png": {
      "skip": true
    },
    "0037.png": {
      "skip": true
    },
    "0038.png": {
      "skip": true
    },
    "0039.png": {
      "skip": true
    },
    "0041.png": {
      "skip": true
    },
    "0042.png": {
      "skip": true
    },
    "0043.png": {
      "skip": true
    },
    "0045.png": {
      "skip": true
    },
    "0046.png": {
      "skip": true
    },
    "0047.png": {
      "skip": true
    },
    "0048.png": {
      "skip": true
    },
    "0049.png": {
      "skip": true
    },
    "0050.png": {
      "skip": true
    },
    "0051.png": {
      "skip": true
    },
    "0052.png": {
      "skip": true
    },
    "0053.png": {
      "skip": true
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
      "skip": true
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
      "skip": true
    },
    "0067.png": {
      "skip": true
    },
    "0068.png": {
      "skip": true
    },
    "0069.png": {
      "skip": true
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
      "skip": true
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
      "skip": true
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
      "skip": true
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
      "skip": true
    },
    "0176.png": {
      "skip": true
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
    "0187.png": {
      "skip": true
    },
    "0189.png": {
      "skip": true
    },
    "0195.png": {
      "skip": true
    },
    "0200.png": {
      "skip": true
    },
    "0201.png": {
      "skip": true
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
    "0215.png": {
      "skip": true
    },
    "0216.png": {
      "skip": true
    },
    "0218.png": {
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
    "0239.png": {
      "skip": true
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
      "skip": true
    },
    "0244.png": {
      "skip": true
    },
    "0245.png": {
      "skip": true
    },
    "0246.png": {
      "skip": true
    },
    "0247.png": {
      "skip": true
    },
    "0248.png": {
      "skip": true
    },
    "0249.png": {
      "skip": true
    },
    "0250.png": {
      "skip": true
    },
    "0251.png": {
      "skip": true
    },
    "0252.png": {
      "skip": true
    },
    "0253.png": {
      "skip": true
    },
    "0254.png": {
      "skip": true
    },
    "0255.png": {
      "skip": true
    },
    "0256.png": {
      "skip": true
    },
    "0257.png": {
      "skip": true
    },
    "0258.png": {
      "skip": true
    },
    "0259.png": {
      "skip": true
    },
    "0260.png": {
      "skip": true
    },
    "0261.png": {
      "skip": true
    },
    "0262.png": {
      "skip": true
    },
    "0263.png": {
      "skip": true
    },
    "0264.png": {
      "skip": true
    },
    "0265.png": {
      "skip": true
    },
    "0266.png": {
      "skip": true
    },
    "0267.png": {
      "skip": true
    },
    "0268.png": {
      "skip": true
    },
    "0269.png": {
      "skip": true
    },
    "0270.png": {
      "skip": true
    },
    "0271.png": {
      "skip": true
    },
    "0272.png": {
      "skip": true
    },
    "0273.png": {
      "skip": true
    },
    "0274.png": {
      "skip": true
    },
    "0275.png": {
      "skip": true
    },
    "0276.png": {
      "skip": true
    }
  }
};
