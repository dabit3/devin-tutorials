window.SPEC = {
 "title": "Devin Security 2.0",
 "subtitle": "Find, rank and fix vulnerabilities with Devin",
 "outro": "Overview, Connections, Repositories, scans and fixes",
 "voOutro": "We covered the Overview dashboard, Connections, and Repositories. Then we ran a scan that found five vulnerabilities, and Assign to Devin turned one of them into a tested pull request.",
 "speed": 4,
 "pace": 1.2,
 "pollRunMax": 1.2,
 "maxZoom": 1.3,
 "voSentGap": 0.45,
 "subPos": "bottom",
 "edit": {
  "0000.png": {
   "skip": true
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
   "skip": true
  },
  "0008.png": {
   "skip": true
  },
  "0017.png": {
   "skip": true
  },
  "0018.png": {
   "skip": true
  },
  "0033.png": {
   "skip": true
  },
  "0034.png": {
   "skip": true
  },
  "0080.png": {
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
  "0095.png": {
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
  "0125.png": {
   "skip": true
  },
  "0126.png": {
   "hold": 1.0,
   "vo": "Devin Security 2.0 finds vulnerabilities in your code and fixes them. A vulnerability is a bug that an attacker can use. Devin scans your repositories, checks each finding against the code, and ranks it by risk. Then it opens pull requests that fix the problems."
  },
  "0127.png": {
   "hl": true,
   "vo": "The Overview page shows the pull requests that Devin opened for findings, and how the number of findings changes over time."
  },
  "0128.png": {
   "hl": true,
   "vo": "Below that, you see the findings for each severity level and for each repository.",
   "hold": 1.2
  },
  "0129.png": {
   "hl": true,
   "hold": 0.9
  },
  "0130.png": {
   "camDur": 0.7,
   "hold": 0.6
  },
  "0009.png": {
   "vo": "Connections bring findings from your other security tools into Devin, so that Devin can sort and fix them. Snyk, Wiz, GitHub, SonarQube, and other tools are in enterprise beta.",
   "hold": 1.2
  },
  "0010.png": {},
  "0011.png": {},
  "0012.png": {
   "hl": true,
   "vo": "You can also upload a CSV export from any tool."
  },
  "0013.png": {
   "vo": "Devin imports the findings and investigates each one to find out if it is valid. Then it writes the results back."
  },
  "0014.png": {},
  "0015.png": {},
  "0016.png": {
   "vo": "You can also pick Custom. Then you tell Devin where your findings are, for example an API or a report in the repository.",
   "hold": 1.2
  },
  "0111.png": {
   "camDur": 0.01,
   "vo": "The Repositories page shows each repository that Devin scanned. For each one, you see the findings by severity, the pull requests, and the date of the last scan.",
   "hold": 1.0
  },
  "0124.png": {
   "vo": "Click a repository to see its findings."
  },
  "0131.png": {
   "camDur": 0.4,
   "hold": 0.3
  },
  "0019.png": {
   "vo": "To start a scan, I pick a repository. ledger-api is a small invoicing API that I made for this demo. It has a few security bugs.",
   "voSay": "To start a scan, I pick a repository. Ledger A P I is a small invoicing A P I that I made for this demo. It has a few security bugs."
  },
  "0020.png": {},
  "0021.png": {},
  "0022.png": {},
  "0023.png": {},
  "0024.png": {},
  "0025.png": {
   "hold": 0.5
  },
  "0026.png": {},
  "0027.png": {
   "vo": "Basic setup needs only a repository. Advanced setup adds the scan type, a profile, and a connection if you want one."
  },
  "0028.png": {},
  "0029.png": {},
  "0030.png": {
   "hl": true,
   "vo": "I keep Scan with a threat model on. A threat model describes who can attack the app, and how. Devin writes one, runs the scan, and then uses the threat model to rank the findings.",
   "hold": 1.4
  },
  "0031.png": {
   "hl": true
  },
  "0032.png": {},
  "0035.png": {
   "hold": 0.6
  },
  "0036.png": {
   "camDur": 0.01,
   "vo": "Devin writes the threat model from the code. Then it asks four optional questions. I accept the answers that it suggests."
  },
  "0037.png": {
   "hold": 0.45,
   "skip": true
  },
  "0038.png": {
   "hold": 0.3
  },
  "0039.png": {
   "hold": 0.45,
   "skip": true
  },
  "0040.png": {
   "hold": 0.3
  },
  "0041.png": {
   "hold": 0.3
  },
  "0042.png": {
   "hold": 0.45,
   "skip": true
  },
  "0043.png": {
   "hold": 0.3
  },
  "0044.png": {
   "hold": 0.45,
   "skip": true
  },
  "0045.png": {
   "hold": 0.3
  },
  "0046.png": {
   "hold": 0.3
  },
  "0047.png": {
   "hold": 0.45,
   "skip": true
  },
  "0048.png": {
   "hold": 0.3
  },
  "0049.png": {
   "hold": 0.45,
   "skip": true
  },
  "0050.png": {
   "hold": 0.3
  },
  "0051.png": {
   "hold": 0.3
  },
  "0052.png": {
   "hold": 0.45,
   "skip": true
  },
  "0053.png": {
   "hold": 0.3
  },
  "0054.png": {
   "hold": 0.3
  },
  "0055.png": {
   "badge": "Sped up",
   "vo": "Then the scan runs. Devin splits the work across many machines that run at the same time. It checks each finding against the code."
  },
  "0075.png": {
   "badge": "",
   "hl": true,
   "vo": "When the scan is done, there are five findings. One is critical and two are high.",
   "hold": 1.4,
   "subPos": {
    "x": 0.7,
    "y": 0.75
   }
  },
  "0077.png": {
   "vo": "You can filter the findings by status and by severity.",
   "hold": 1.0,
   "subPos": {
    "x": 0.7,
    "y": 0.75
   }
  },
  "0081.png": {
   "vo": "I open the SQL injection. In this attack, user input changes a database query.",
   "subPos": {
    "x": 0.2,
    "y": 0.45
   }
  },
  "0082.png": {
   "vo": "Each finding tells you who can use the bug, what they get, and how the attack works, step by step.",
   "hold": 1.2,
   "subPos": {
    "x": 0.2,
    "y": 0.45
   }
  },
  "0083.png": {
   "hl": true
  },
  "0084.png": {
   "hl": true,
   "vo": "It also recommends a fix and the tests to add.",
   "hold": 1.2,
   "subPos": {
    "x": 0.2,
    "y": 0.45
   }
  },
  "0090.png": {
   "vo": "Here, you can mark a finding as Reviewed or Dismissed.",
   "hold": 1.4,
   "subPos": {
    "x": 0.2,
    "y": 0.45
   }
  },
  "0092.png": {
   "vo": "References show the affected code.",
   "hold": 1.6,
   "subPos": {
    "x": 0.2,
    "y": 0.45
   }
  },
  "0093.png": {
   "vo": "To fix the bug, I click Assign to Devin. This starts a remediation session, which is a Devin session that fixes the finding.",
   "subPos": {
    "x": 0.2,
    "y": 0.45
   }
  },
  "0094.png": {
   "hl": false
  },
  "0096.png": {
   "vo": "Devin first confirms the bug in the handler. Then it passes the customer filter as a query parameter. It also accepts only a fixed list of values for sort.",
   "subPos": {
    "x": 0.73,
    "y": 0.765
   }
  },
  "0097.png": {
   "hl": true,
   "vo": "It adds tests that fail on the old code. All ten tests pass.",
   "hold": 1.6,
   "subPos": {
    "x": 0.73,
    "y": 0.765
   }
  },
  "0099.png": {
   "hl": true,
   "vo": "Then it opens a pull request, and the CI check passes.",
   "subPos": {
    "x": 0.73,
    "y": 0.765
   }
  },
  "0101.png": {
   "hold": 1.6
  },
  "0105.png": {
   "vo": "Here is the code change.",
   "hold": 0.8,
   "subPos": {
    "x": 0.2,
    "y": 0.45
   }
  },
  "0106.png": {
   "hold": 1.0
  },
  "0107.png": {
   "hl": true,
   "vo": "Back on the finding, the pull request is linked and waits for review. When the pull request merges, Devin marks the finding as resolved.",
   "hold": 1.4,
   "subPos": {
    "x": 0.2,
    "y": 0.45
   }
  },
  "0109.png": {
   "vo": "The findings list shows this too.",
   "subPos": {
    "x": 0.2,
    "y": 0.45
   }
  },
  "0110.png": {
   "vo": "The Findings page shows the findings from all repositories in three groups: Open, Reviewed, and Dismissed. You can filter the list, and each row has quick actions.",
   "hold": 0.8,
   "subPos": {
    "x": 0.75,
    "y": 0.94
   }
  },
  "0078.png": {
   "skip": true
  },
  "0079.png": {
   "hold": 0.9
  },
  "0100.png": {
   "skip": true
  },
  "0102.png": {
   "skip": true
  },
  "0108.png": {
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
  }
 },
 "outroVoDelay": 0.3,
 "tailHold": 0.6
};
