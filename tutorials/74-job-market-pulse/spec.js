window.SPEC = {
  "title": "Job-market pulse",
  "subtitle": "Build and deploy it on Modal with the xAI API, step by step",
  "eyebrow": "Modal + xAI",
  "dark": true,
  "tailHold": 0.5,
  "outroVoDelay": 0.4,
  "outro": "Your own job-market numbers, every hour",
  "voOutro": "Your own job-market numbers, every hour.",
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.6,
  "edit": {
    "0000.png": {
      "hold": 6,
      "cursor": false,
      "cap": "Hourly job-market counts from sampled X posts",
      "vo": "This is a job-market pulse. Every hour, it samples tech posts on X about hiring, layoffs and people looking for work, sorts them with Grok, and shows which roles, companies and skills come up most."
    },
    "0000a.png": {
      "scene": "modal",
      "hold": 4,
      "cursor": false,
      "cap": "Modal runs it hourly, in parallel, with no server",
      "vo": "Why Modal? The app has to wake up every hour and make many Grok calls. Then it has to store the results and serve them on a page. A laptop script stops when the lid closes, and your own server sits idle most of the day. On Modal, the collection is a scheduled function, so there's nothing to keep running. Dot map runs the xAI calls in parallel across containers. A Modal Volume stores each run, and a Modal Secret holds the xAI key. A web endpoint serves the page at a public URL. And between runs it scales to zero, so you only pay for the seconds it works.",
      "voSay": "Why Modal? The app has to wake up every hour and make many Grok calls. Then it has to store the results and serve them on a page. A laptop script stops when the lid closes, and your own server sits idle most of the day. On Modal, the collection is a scheduled function, so there's nothing to keep running. Dot map runs the ex A I calls in parallel across containers. A Modal Volume stores each run, and a Modal Secret holds the ex A I key. A web endpoint serves the page at a public URL. And between runs it scales to zero, so you only pay for the seconds it works."
    },
    "0001.png": {
      "skip": true
    },
    "0002.png": {
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
      "cap": "One plain prompt: build, deploy, test, open a PR",
      "vo": "Here's the prompt. I'm asking Devin to build it on Modal with the xAI API and X search, to label every number as a count of sampled posts, and to never name people who posted about layoffs or job hunting.",
      "voSay": "Here's the prompt. I'm asking Devin to build it on Modal with the ex A I API and X search, to label every number as a count of sampled posts, and to never name people who posted about layoffs or job hunting.",
      "hold": 3.5
    },
    "0008.png": {
      "skip": true
    },
    "0009.png": {
      "skip": true
    },
    "0010.png": {
      "skip": true
    },
    "0011.png": {
      "skip": true
    },
    "0012.png": {
      "vo": "Devin also deploys it, tests the public URL, and opens a pull request.",
      "hold": 3.5
    },
    "0013.png": {
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
      "badge": "Sped up",
      "cap": "Current xAI docs, and the key in a Modal Secret",
      "vo": "First, Devin checks the current xAI docs for X search, and plans to keep the API key in a Modal Secret.",
      "voSay": "First, Devin checks the current ex A I docs for X search, and plans to keep the API key in a Modal Secret.",
      "hold": 3.5
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
    "0025.png": {
      "skip": true
    },
    "0026.png": {
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
    "0030.png": {
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
    "0036.png": {
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
      "badge": "Sped up",
      "cap": "modal deploy, then a test of the public URL",
      "vo": "Then it writes the app, deploys it with modal deploy, and tests the public URL.",
      "hold": 3.5
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
      "cap": "Deployed, with PR #72 open",
      "vo": "It's deployed, and the pull request is open in the demo apps repo.",
      "hold": 3,
      "badge": ""
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
    "0313.png": {
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
    "0321.png": {
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
      "skip": true
    },
    "0329.png": {
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
    "0333.png": {
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
    "0337.png": {
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
    "0341.png": {
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
    "0345.png": {
      "skip": true
    },
    "0346.png": {
      "hold": 5,
      "cursor": false,
      "cap": "78 sampled posts in the last 24 hours",
      "vo": "And here's the page running on Modal. In the last day it has seventy-eight sampled posts, fifty-eight about hiring and twenty about layoffs.",
      "capPos": {
        "x": 0.68,
        "y": 0.055
      },
      "subPos": {
        "x": 0.68,
        "y": 0.055
      }
    },
    "0347.png": {
      "skip": true
    },
    "0348.png": {
      "skip": true
    },
    "0349.png": {
      "skip": true
    },
    "0350.png": {
      "hold": 5,
      "cursor": false,
      "cap": "Every number is a count of sampled posts",
      "vo": "The top role is Software Engineer, and the top skill is Python. No looking-for-work posts turned up in this sample yet, and every number here is a count of sampled posts, not a labor statistic.",
      "capPos": {
        "x": 0.3,
        "y": 0.86
      },
      "subPos": {
        "x": 0.3,
        "y": 0.86
      }
    }
  }
};
