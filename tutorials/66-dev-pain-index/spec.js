window.SPEC = {
  "title": "Build a Developer Pain Index on Modal",
  "subtitle": "Devin, Modal and the xAI API, step by step",
  "outro": "A monthly developer report, built from real posts",
  "voOutro": "Describe the report you want, and Devin builds it and ships it to Modal.",
  "dark": true,
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.3,
  "pollRunMax": 2.2,
  "noZoom": [
    [
      "0009.png"
    ]
  ],
  "edit": {
    "0000.png": {
      "hold": 5.5,
      "cursor": false,
      "vo": "The Developer Pain Index ranks what developers complain about on X each month, and it groups similar complaints so you can follow each trend over time."
    },
    "0002.png": {
      "cursor": true,
      "vo": "It works like an industry survey people can cite, except it's built from real posts, so every chart has to say how many posts it used and which dates they cover."
    },
    "0004.png": {
      "vo": "The goal is a report page at a public URL on Modal, with real data from X, plus a pull request in the demo repo."
    },
    "0007.png": {
      "hold": 4,
      "cursor": false,
      "cap": "Plain-language prompt in @thequantexplorer/product-demo-apps",
      "vo": "The prompt asks for a Modal app that calls Grok from xAI, and uses its X search tool to find the posts. It runs on a monthly schedule and backfills earlier months, so every trend line has real data points.",
      "voSay": "The prompt asks for a Modal app that calls Grok from ex A I, and uses its X search tool to find the posts. It runs on a monthly schedule and backfills earlier months, so every trend line has real data points."
    },
    "0007a.png": {
      "cursor": false,
      "scene": "modal",
      "hold": 7,
      "capPos": "bottom",
      "cap": "Why Modal: schedule, parallel searches, storage, public URL",
      "vo": "So why Modal? A monthly job shouldn't depend on a laptop being awake, or on a server you pay for all month. On Modal, a cron schedule starts the pull and .map() runs the searches in parallel containers. A Volume keeps the results, and a web endpoint serves the page at a public URL. The xAI key sits in a Modal Secret, and the app scales to zero between runs, so you only pay for the seconds it works.",
      "voSay": "So why Modal? A monthly job shouldn't depend on a laptop being awake, or on a server you pay for all month. On Modal, a cron schedule starts the pull and dot map runs the searches in parallel containers. A Volume keeps the results, and a web endpoint serves the page at a public URL. The ex A I key sits in a Modal Secret, and the app scales to zero between runs, so you only pay for the seconds it works."
    },
    "0008.png": {
      "cursor": true
    },
    "0010.png": {
      "cursor": false
    },
    "0011.png": {
      "hold": 2.5,
      "cap": "Devin starts with a plan",
      "vo": "Devin replies with a short plan before it starts."
    },
    "0015.png": {
      "badge": "Sped up",
      "cap": "Devin builds and runs the app on its own",
      "vo": "From there it works on its own, and runs a real six month backfill of posts from X."
    },
    "0140.png": {
      "badge": "",
      "hold": 6,
      "cap": "Modal's scheduled-function limit: Devin asks first",
      "ring": {
        "x": 720,
        "y": 583,
        "w": 900,
        "h": 130
      },
      "ringFor": 5,
      "vo": "The first deploy fails because the Modal workspace already uses all five of its scheduled functions, so Devin asks how to handle it instead of stopping someone else's app."
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
      "cursor": true,
      "vo": "I tell it to leave the cron off for now. The schedule stays in the code, but it hasn't run yet."
    },
    "0154.png": {
      "cap": "Leave the cron off for now"
    },
    "0155.png": {
      "cursor": false,
      "badge": "Sped up",
      "vo": "Devin redeploys without the schedule and checks the page at its public URL."
    },
    "0195.png": {
      "badge": "",
      "hold": 3,
      "cap": "Devin opens PR #75 in product-demo-apps",
      "ring": {
        "x": 720,
        "y": 411,
        "w": 872,
        "h": 150
      },
      "vo": "Then it opens a pull request in the demo repo with the whole app."
    },
    "0196.png": {
      "skip": true
    },
    "0197.png": {
      "skip": true
    },
    "0198.png": {
      "skip": true
    },
    "0199.png": {
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
      "skip": true
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
      "skip": true
    },
    "0230.png": {
      "skip": true
    },
    "0269.png": {
      "badge": "",
      "hold": 4,
      "cap": "704 posts kept, 14 tests pass",
      "ring": {
        "x": 728,
        "y": 224,
        "w": 856,
        "h": 78
      },
      "vo": "When it finishes, the summary says the backfill kept 704 posts across six months, for about $24.50 of xAI usage. All 14 unit tests pass.",
      "voSay": "When it finishes, the summary says the backfill kept seven hundred and four posts across six months, for about twenty four dollars and fifty cents of ex A I usage. All fourteen unit tests pass."
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
    },
    "0277.png": {
      "skip": true
    },
    "0278.png": {
      "skip": true
    },
    "0279.png": {
      "skip": true
    },
    "0280.png": {
      "skip": true
    },
    "0281.png": {
      "skip": true
    },
    "0282.png": {
      "skip": true
    },
    "0283.png": {
      "skip": true
    },
    "0284.png": {
      "skip": true
    },
    "0285.png": {
      "skip": true
    },
    "0286.png": {
      "skip": true
    },
    "0287.png": {
      "skip": true
    },
    "0288.png": {
      "skip": true
    },
    "0289.png": {
      "skip": true
    },
    "0290.png": {
      "skip": true
    },
    "0291.png": {
      "skip": true
    },
    "0292.png": {
      "skip": true
    },
    "0293.png": {
      "skip": true
    },
    "0294.png": {
      "skip": true
    },
    "0295.png": {
      "skip": true
    },
    "0296.png": {
      "skip": true
    },
    "0297.png": {
      "skip": true
    },
    "0298.png": {
      "skip": true
    },
    "0299.png": {
      "skip": true
    },
    "0300.png": {
      "skip": true
    },
    "0301.png": {
      "skip": true
    },
    "0302.png": {
      "skip": true
    },
    "0303.png": {
      "skip": true
    },
    "0304.png": {
      "skip": true
    },
    "0305.png": {
      "skip": true
    },
    "0306.png": {
      "skip": true
    },
    "0307.png": {
      "skip": true
    },
    "0308.png": {
      "skip": true
    },
    "0309.png": {
      "skip": true
    },
    "0310.png": {
      "skip": true
    },
    "0311.png": {
      "skip": true
    },
    "0312.png": {
      "skip": true
    },
    "0314.png": {
      "hold": 3.5,
      "cap": "modal deploy: the functions Modal created",
      "ring": {
        "x": 808,
        "y": 337,
        "w": 352,
        "h": 118
      },
      "vo": "Devin's deploy step shows the real modal deploy output. It lists every function Modal created, from the parallel searches to the web endpoint."
    },
    "0315.png": {
      "cap": "The public modal.run URL",
      "ring": {
        "x": 943,
        "y": 393,
        "w": 682,
        "h": 34
      },
      "vo": "The web endpoint gets its own modal.run URL, which is the public address of the report.",
      "voSay": "The web endpoint gets its own modal dot run URL, which is the public address of the report."
    },
    "0316.png": {
      "skip": true
    },
    "0317.png": {
      "skip": true
    },
    "0318.png": {
      "skip": true
    },
    "0319.png": {
      "skip": true
    },
    "0320.png": {
      "skip": true
    },
    "0322.png": {
      "skip": true
    },
    "0323.png": {
      "skip": true
    },
    "0324.png": {
      "skip": true
    },
    "0325.png": {
      "skip": true
    },
    "0326.png": {
      "skip": true
    },
    "0327.png": {
      "skip": true
    },
    "0328.png": {
      "hold": 4,
      "cap": "Public URL: dabit3--dev-pain-index.modal.run",
      "ring": {
        "x": 181,
        "y": 509,
        "w": 276,
        "h": 34
      },
      "vo": "The page running on Modal shows September's index at 44 out of 100, built from 109 posts found in September.",
      "voSay": "The page running on Modal shows September's index at forty four out of a hundred, built from a hundred and nine posts found in September."
    },
    "0329.png": {
      "cap": "Six real months per category, never extrapolated",
      "vo": "Each category gets its own trend line, with six real months behind it and nothing extrapolated."
    },
    "0330.png": {
      "vo": "Every category card shows its top complaint themes for the month."
    },
    "0331.png": {
      "ring": {
        "x": 152,
        "y": 466,
        "w": 215,
        "h": 34
      },
      "vo": "The loudest complaints are real posts from X, each linked to its author."
    },
    "0334.png": {
      "ring": {
        "x": 91,
        "y": 304,
        "w": 96,
        "h": 38
      },
      "cap": "September: layoffs 72, AI coding agents 41",
      "vo": "In September, layoffs scored highest at 72, with AI coding agents second at 41 points.",
      "voSay": "In September, layoffs scored highest at seventy two, with AI coding agents second at forty one points."
    },
    "0336.png": {
      "hold": 3,
      "ring": {
        "x": 122,
        "y": 411,
        "w": 158,
        "h": 40
      },
      "cap": "Samples from X search, not totals",
      "vo": "A methodology note explains that these numbers come from a sample of posts, not a total count."
    },
    "0040.png": {
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
    "0044.png": {
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
    "0321.png": {
      "skip": true
    },
    "0313.png": {
      "skip": true
    }
  }
};
