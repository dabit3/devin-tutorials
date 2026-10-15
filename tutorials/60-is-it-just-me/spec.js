window.SPEC = {
  "title": "Is it just me?",
  "subtitle": "Build an outage detector with Devin, Modal and the xAI API",
  "outro": "Real posts in, an honest answer out",
  "voOutro": "Real posts in, an honest answer out.",
  "dark": true,
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.3,
  "pollRunMax": 1.0,
  "subPos": {
    "x": 0.5,
    "y": 0.035
  },
  "edit": {
    "0000.png": {
      "hold": 4.5,
      "cursor": false,
      "cap": "Is it just me, or is it down for everyone?",
      "vo": "When Slack or GitHub acts up, everyone asks the same thing. Is it just me, or is it down for everyone?",
      "subPos": "bottom"
    },
    "0001.png": {
      "cap": "Devin builds the answer from real posts on X",
      "vo": "In this tutorial, Devin builds an app that answers that question from real posts on X, using the xAI API, and runs it on Modal.",
      "voSay": "In this tutorial, Devin builds an app that answers that question from real posts on X, using the ex A I API, and runs it on Modal.",
      "subPos": "bottom"
    },
    "0005.png": {
      "hold": 4,
      "cap": "A job every minute, real posts, stored counts",
      "vo": "The prompt asks for a Modal job that runs every minute, searches X for outage posts, and stores the counts.",
      "subPos": "bottom"
    },
    "0006.png": {
      "cap": "Only regions and errors the posts mention",
      "vo": "It also asks for a dark page with a spike chart, showing only the regions and errors that posts actually mention.",
      "subPos": "bottom"
    },
    "0007.png": {
      "badge": "Sped up",
      "cap": "Devin checks the repo and the API keys",
      "vo": "Devin checks the repo and the Modal and xAI setup, then makes one real search call.",
      "voSay": "Devin checks the repo and the Modal and ex A I setup, then makes one real search call."
    },
    "0008.png": {
      "skip": true
    },
    "0009.png": {
      "skip": true
    },
    "0011.png": {
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
    "0017.png": {
      "skip": true
    },
    "0019.png": {
      "hold": 2,
      "badge": null,
      "ring": {
        "x": 718,
        "y": 392,
        "w": 890,
        "h": 72
      },
      "ringFor": 5,
      "cap": "One call cost about 5 cents, so Devin caps the budget",
      "vo": "That call cost about five cents, so Devin caps the scans with a daily post budget before it writes the app."
    },
    "0020.png": {
      "badge": "Sped up",
      "cap": "Devin writes the detector and the Modal app",
      "vo": "Then it writes the detection logic in one file, and the Modal app in another."
    },
    "0021.png": {
      "skip": true
    },
    "0022.png": {
      "skip": true
    },
    "0024.png": {
      "skip": true
    },
    "0025.png": {
      "skip": true
    },
    "0027.png": {
      "skip": true
    },
    "0028.png": {
      "skip": true
    },
    "0030.png": {
      "skip": true
    },
    "0031.png": {
      "skip": true
    },
    "0033.png": {
      "skip": true
    },
    "0034.png": {
      "skip": true
    },
    "0036.png": {
      "skip": true
    },
    "0037.png": {
      "skip": true
    },
    "0039.png": {
      "skip": true
    },
    "0040.png": {
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
    "0048.png": {
      "skip": true
    },
    "0049.png": {
      "skip": true
    },
    "0051.png": {
      "skip": true
    },
    "0052.png": {
      "skip": true
    },
    "0054.png": {
      "skip": true
    },
    "0055.png": {
      "skip": true
    },
    "0057.png": {
      "skip": true
    },
    "0058.png": {
      "skip": true
    },
    "0060.png": {
      "skip": true
    },
    "0061.png": {
      "skip": true
    },
    "0063.png": {
      "skip": true
    },
    "0064.png": {
      "skip": true
    },
    "0066.png": {
      "skip": true
    },
    "0067.png": {
      "skip": true
    },
    "0069.png": {
      "hold": 2,
      "cursor": false,
      "badge": null,
      "ring": {
        "x": 980,
        "y": 404,
        "w": 680,
        "h": 32
      },
      "ringFor": 4,
      "cap": "A Modal Dict stores the counts",
      "vo": "Here's the code from its pull request. The counts live in a Modal Dict, so they persist between runs.",
      "subPos": {
        "x": 0.19,
        "y": 0.74
      }
    },
    "0070.png": {
      "hold": 2,
      "cursor": false,
      "ring": {
        "x": 1003,
        "y": 404,
        "w": 590,
        "h": 32
      },
      "ringFor": 4,
      "cap": "Each scan uses xAI's X search tool",
      "vo": "Each scan calls the xAI Responses API with the X search tool, and asks for structured JSON back.",
      "voSay": "Each scan calls the ex A I Responses API with the X search tool, and asks for structured JSON back.",
      "subPos": {
        "x": 0.19,
        "y": 0.74
      }
    },
    "0071.png": {
      "hold": 1.5,
      "cursor": false,
      "ring": {
        "x": 922,
        "y": 404,
        "w": 570,
        "h": 32
      },
      "ringFor": 3.5,
      "cap": "modal.Cron(\"* * * * *\") runs it every minute",
      "vo": "A Modal Cron schedule runs the tick function every minute.",
      "subPos": {
        "x": 0.19,
        "y": 0.74
      }
    },
    "0072.png": {
      "hold": 1.5,
      "cursor": false,
      "ring": {
        "x": 967,
        "y": 404,
        "w": 630,
        "h": 32
      },
      "ringFor": 3.5,
      "cap": ".starmap() scans every service in parallel",
      "vo": "Inside it, starmap runs one scan per service, in parallel.",
      "voSay": "Inside it, star map runs one scan per service, in parallel.",
      "subPos": {
        "x": 0.19,
        "y": 0.74
      }
    },
    "0073.png": {
      "hold": 1.5,
      "cursor": false,
      "ring": {
        "x": 727,
        "y": 404,
        "w": 175,
        "h": 32
      },
      "ringFor": 3.5,
      "cap": "@modal.asgi_app() serves the web page",
      "vo": "And the same app serves the web page as an ASGI endpoint.",
      "voSay": "And the same app serves the web page as an A S G I endpoint.",
      "subPos": {
        "x": 0.19,
        "y": 0.74
      }
    },
    "0074.png": {
      "hold": 2,
      "cursor": false,
      "ring": {
        "x": 928,
        "y": 152,
        "w": 680,
        "h": 50
      },
      "ringFor": 4,
      "cap": "modal deploy puts it live",
      "vo": "Devin deploys it with modal deploy, and Modal prints the deployment link.",
      "subPos": {
        "x": 0.19,
        "y": 0.74
      }
    },
    "0075.png": {
      "badge": "Sped up",
      "cap": "Unit tests, a live URL check, then a PR",
      "vo": "Then it runs the unit tests, checks the live URL, and opens a pull request.",
      "voSay": "Then it runs the unit tests, checks the lyve URL, and opens a pull request."
    },
    "0076.png": {
      "skip": true
    },
    "0077.png": {
      "skip": true
    },
    "0079.png": {
      "skip": true
    },
    "0080.png": {
      "skip": true
    },
    "0082.png": {
      "skip": true
    },
    "0083.png": {
      "skip": true
    },
    "0085.png": {
      "skip": true
    },
    "0086.png": {
      "skip": true
    },
    "0088.png": {
      "skip": true
    },
    "0089.png": {
      "skip": true
    },
    "0091.png": {
      "skip": true
    },
    "0092.png": {
      "skip": true
    },
    "0094.png": {
      "skip": true
    },
    "0095.png": {
      "skip": true
    },
    "0097.png": {
      "skip": true
    },
    "0098.png": {
      "skip": true
    },
    "0100.png": {
      "skip": true
    },
    "0101.png": {
      "skip": true
    },
    "0103.png": {
      "hold": 2,
      "badge": null,
      "cap": "The PR is open, and Devin tests the page",
      "vo": "With the pull request open, Devin tests the deployed page in its own browser."
    },
    "0104.png": {
      "badge": "Sped up"
    },
    "0105.png": {
      "skip": true
    },
    "0106.png": {
      "skip": true
    },
    "0108.png": {
      "skip": true
    },
    "0109.png": {
      "skip": true
    },
    "0111.png": {
      "skip": true
    },
    "0112.png": {
      "skip": true
    },
    "0114.png": {
      "skip": true
    },
    "0115.png": {
      "skip": true
    },
    "0117.png": {
      "skip": true
    },
    "0118.png": {
      "skip": true
    },
    "0120.png": {
      "skip": true
    },
    "0121.png": {
      "skip": true
    },
    "0123.png": {
      "skip": true
    },
    "0124.png": {
      "skip": true
    },
    "0126.png": {
      "skip": true
    },
    "0127.png": {
      "skip": true
    },
    "0129.png": {
      "skip": true
    },
    "0130.png": {
      "skip": true
    },
    "0132.png": {
      "skip": true
    },
    "0133.png": {
      "skip": true
    },
    "0135.png": {
      "skip": true
    },
    "0136.png": {
      "skip": true
    },
    "0138.png": {
      "skip": true
    },
    "0139.png": {
      "skip": true
    },
    "0141.png": {
      "skip": true
    },
    "0142.png": {
      "skip": true
    },
    "0144.png": {
      "skip": true
    },
    "0145.png": {
      "skip": true
    },
    "0147.png": {
      "skip": true
    },
    "0148.png": {
      "skip": true
    },
    "0150.png": {
      "skip": true
    },
    "0151.png": {
      "skip": true
    },
    "0153.png": {
      "skip": true
    },
    "0154.png": {
      "skip": true
    },
    "0156.png": {
      "hold": 2,
      "badge": null,
      "cap": "Devin Review finds four bugs",
      "vo": "Devin Review finds four bugs, so Devin fixes them, adds regression tests, and redeploys."
    },
    "0157.png": {
      "badge": "Sped up"
    },
    "0158.png": {
      "skip": true
    },
    "0159.png": {
      "skip": true
    },
    "0161.png": {
      "skip": true
    },
    "0162.png": {
      "skip": true
    },
    "0164.png": {
      "skip": true
    },
    "0165.png": {
      "skip": true
    },
    "0167.png": {
      "skip": true
    },
    "0168.png": {
      "skip": true
    },
    "0170.png": {
      "skip": true
    },
    "0171.png": {
      "skip": true
    },
    "0173.png": {
      "skip": true
    },
    "0174.png": {
      "skip": true
    },
    "0176.png": {
      "skip": true
    },
    "0177.png": {
      "skip": true
    },
    "0179.png": {
      "skip": true
    },
    "0180.png": {
      "skip": true
    },
    "0182.png": {
      "skip": true
    },
    "0183.png": {
      "skip": true
    },
    "0185.png": {
      "skip": true
    },
    "0186.png": {
      "skip": true
    },
    "0188.png": {
      "skip": true
    },
    "0189.png": {
      "skip": true
    },
    "0191.png": {
      "skip": true
    },
    "0192.png": {
      "skip": true
    },
    "0194.png": {
      "skip": true
    },
    "0195.png": {
      "skip": true
    },
    "0197.png": {
      "skip": true
    },
    "0198.png": {
      "skip": true
    },
    "0200.png": {
      "skip": true
    },
    "0202.png": {
      "hold": 2,
      "badge": null,
      "ring": {
        "x": 718,
        "y": 302,
        "w": 890,
        "h": 62
      },
      "ringFor": 4,
      "cap": "All 12 unit tests pass after the fixes",
      "vo": "Its summary lists the four fixes, and says all twelve unit tests pass."
    },
    "0203.png": {
      "hold": 3,
      "cap": "Two changes: a blue accent and four services",
      "vo": "It also warns that anyone can trigger paid searches. So I ask for a thin blue accent, and only four allowed services."
    },
    "0205.png": {
      "badge": "Sped up",
      "cap": "Devin restricts the services and redeploys",
      "vo": "Devin restricts the services, swaps the accent, redeploys, and tests the live URL again.",
      "voSay": "Devin restricts the services, swaps the accent, redeploys, and tests the lyve URL again."
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
    "0210.png": {
      "skip": true
    },
    "0211.png": {
      "skip": true
    },
    "0212.png": {
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
    "0218.png": {
      "skip": true
    },
    "0219.png": {
      "skip": true
    },
    "0220.png": {
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
    "0226.png": {
      "skip": true
    },
    "0227.png": {
      "skip": true
    },
    "0228.png": {
      "skip": true
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
    "0234.png": {
      "skip": true
    },
    "0235.png": {
      "skip": true
    },
    "0236.png": {
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
    "0242.png": {
      "skip": true
    },
    "0243.png": {
      "skip": true
    },
    "0244.png": {
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
    "0250.png": {
      "skip": true
    },
    "0251.png": {
      "skip": true
    },
    "0252.png": {
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
    "0258.png": {
      "skip": true
    },
    "0259.png": {
      "skip": true
    },
    "0260.png": {
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
    "0266.png": {
      "skip": true
    },
    "0267.png": {
      "skip": true
    },
    "0268.png": {
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
    "0274.png": {
      "skip": true
    },
    "0275.png": {
      "skip": true
    },
    "0276.png": {
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
    "0282.png": {
      "skip": true
    },
    "0283.png": {
      "skip": true
    },
    "0284.png": {
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
    "0290.png": {
      "skip": true
    },
    "0291.png": {
      "skip": true
    },
    "0292.png": {
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
    "0298.png": {
      "skip": true
    },
    "0299.png": {
      "skip": true
    },
    "0300.png": {
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
    "0306.png": {
      "skip": true
    },
    "0307.png": {
      "skip": true
    },
    "0308.png": {
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
      "skip": true
    },
    "0315.png": {
      "skip": true
    },
    "0316.png": {
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
    "0326.png": {
      "skip": true
    },
    "0327.png": {
      "skip": true
    },
    "0328.png": {
      "skip": true
    },
    "0330.png": {
      "skip": true
    },
    "0331.png": {
      "skip": true
    },
    "0332.png": {
      "skip": true
    },
    "0334.png": {
      "skip": true
    },
    "0335.png": {
      "skip": true
    },
    "0336.png": {
      "skip": true
    },
    "0338.png": {
      "skip": true
    },
    "0339.png": {
      "skip": true
    },
    "0340.png": {
      "skip": true
    },
    "0342.png": {
      "skip": true
    },
    "0343.png": {
      "skip": true
    },
    "0344.png": {
      "skip": true
    },
    "0346.png": {
      "skip": true
    },
    "0347.png": {
      "skip": true
    },
    "0348.png": {
      "skip": true
    },
    "0350.png": {
      "skip": true
    },
    "0351.png": {
      "skip": true
    },
    "0352.png": {
      "skip": true
    },
    "0354.png": {
      "skip": true
    },
    "0355.png": {
      "skip": true
    },
    "0356.png": {
      "skip": true
    },
    "0358.png": {
      "skip": true
    },
    "0359.png": {
      "skip": true
    },
    "0360.png": {
      "skip": true
    },
    "0362.png": {
      "skip": true
    },
    "0363.png": {
      "skip": true
    },
    "0365.png": {
      "hold": 2.5,
      "badge": null,
      "cap": "Its last check types a service that isn't allowed",
      "vo": "In its last check, it types Discord, to confirm that other services are refused."
    },
    "0366.png": {
      "skip": true
    },
    "0367.png": {
      "skip": true
    },
    "0368.png": {
      "skip": true
    },
    "0369.png": {
      "hold": 2,
      "cursor": false,
      "ring": {
        "x": 692,
        "y": 321,
        "w": 215,
        "h": 44
      },
      "ringFor": 3.5,
      "cap": "The PR is ready for review",
      "vo": "The pull request is open in the session, and it's ready to merge.",
      "subPos": {
        "x": 0.19,
        "y": 0.74
      }
    },
    "0370.png": {
      "hold": 2.5,
      "cursor": false,
      "cap": "The deployed app on Modal",
      "vo": "And here's the deployed app on Modal. GitHub is quiet right now, and the page says no posts were found.",
      "subPos": {
        "x": 0.5,
        "y": 0.03
      }
    },
    "0380.png": {
      "hold": 2,
      "cap": "1 post found in 15 minutes, 6 in 6 hours",
      "vo": "For ChatGPT, it found one post in the last fifteen minutes and six in the last six hours, so it's probably just you.",
      "subPos": {
        "x": 0.5,
        "y": 0.03
      }
    },
    "0381.png": {
      "hold": 1.5,
      "cap": "Posts found, not people affected",
      "vo": "The chart counts posts found that report problems, not people affected.",
      "subPos": {
        "x": 0.5,
        "y": 0.03
      }
    },
    "0382.png": {
      "hold": 1.5,
      "cap": "No ChatGPT post names a region",
      "vo": "None of these posts names a region, so that panel stays empty.",
      "subPos": {
        "x": 0.5,
        "y": 0.03
      }
    },
    "0383.png": {
      "hold": 1.5,
      "cap": "\"model not found\" appears in 3 posts",
      "vo": "The most common error quoted is model not found, in three posts.",
      "subPos": {
        "x": 0.5,
        "y": 0.03
      }
    },
    "0384.png": {
      "hold": 1.5,
      "cap": "Every number comes from these real posts",
      "vo": "Every number on the page comes from real posts like these, each linked back to X.",
      "subPos": {
        "x": 0.5,
        "y": 0.03
      }
    },
    "0390.png": {
      "hold": 1.5,
      "cap": "AWS: one post in 24 hours names a region",
      "vo": "For AWS, one post in the last day names the Middle East.",
      "subPos": {
        "x": 0.5,
        "y": 0.03
      }
    },
    "0391.png": {
      "hold": 1.5,
      "cap": "The region comes from the post itself"
    },
    "0392.png": {
      "hold": 2.5,
      "cap": "Its own words: an AWS outage in the Middle East",
      "vo": "That region comes straight from the post's own words, so the page can say exactly where it came from.",
      "subPos": {
        "x": 0.5,
        "y": 0.03
      }
    }
  }
};
