window.SPEC = {
  "title": "One bug, three operating systems",
  "subtitle": "Multi-platform blueprints, managed Devins and recordings",
  "outro": "One bug, three operating systems, one verified fix",
  "voOutro": "One bug, three operating systems, one verified fix.",
  "speed": 3,
  "cps": 48,
  "maxZoom": 1.3,
  "pollRunMax": 2.5,
  "noZoom": [
    [
      "0019.png"
    ]
  ],
  "edit": {
    "0000.png": {
      "hold": 6,
      "cursor": false,
      "cap": "One bug, sent to Linux, macOS and Windows",
      "vo": "Some bugs only show up on one operating system. With a multi-platform blueprint and managed Devins, one coordinator sends the same bug to Linux, macOS and Windows, each Devin records a repro, and one fix gets verified on all three."
    },
    "0001.png": {
      "hold": 4,
      "cap": "Add a macOS and Windows block to the blueprint",
      "voGap": 1.2,
      "vo": "First, open the repo's blueprint in Settings → Environment, and add a second YAML document for macOS and Windows, after three dashes.",
      "voSay": "First, open the repo's blueprint in Settings, Environment, and add a second YAML document for macOS and Windows, after three dashes."
    },
    "0004.png": {
      "hold": 2.5,
      "cap": "Save, and Devin builds one snapshot per platform",
      "vo": "Save it, and Devin builds one snapshot for each platform."
    },
    "0006.png": {
      "hold": 4,
      "cap": "Active snapshots for Ubuntu, macOS and Windows",
      "vo": "When the builds finish, the active snapshots show Ubuntu, macOS and Windows, all from the same blueprint."
    },
    "0010.png": {
      "hold": 3.5,
      "cap": "The platform picker offers the same three",
      "voGap": 1.2,
      "vo": "The platform picker under the prompt box offers the same three. I'm leaving it on Ubuntu for the coordinator, because it starts the other platforms itself."
    },
    "0017.png": {
      "hold": 6,
      "cursor": false,
      "cap": "One prompt: three managed Devins, one fix",
      "voGap": 1.2,
      "vo": "Now the prompt. I describe the bug in the Tally desktop app, and ask for three managed Devins, one each on Linux, macOS and Windows, to reproduce it and send a recording. Then one fix in one PR, verified on all three."
    },
    "0019.png": {},
    "0020.png": {
      "hold": 1.5,
      "cap": "",
      "badge": "Sped up",
      "cursor": false
    },
    "0024.png": {
      "hold": 1.5
    },
    "0029.png": {
      "hold": 1.5
    },
    "0031.png": {
      "hold": 4,
      "cap": "Three managed Devins, one per OS",
      "voGap": 1.2,
      "vo": "The coordinator reads the code, finds the cause, and starts three managed Devins, one for each operating system, each in its own VM."
    },
    "0039.png": {
      "hold": 3.5,
      "cap": "It writes the fix and opens a PR",
      "vo": "While they reproduce the bug, it writes the fix and opens a pull request with a new unit test."
    },
    "0047.png": {
      "hold": 1.5
    },
    "0063.png": {
      "hold": 4,
      "cap": "Linux: History survives Reset",
      "vo": "Each child reports back what it saw. On Linux, the old history entries are still there after Reset."
    },
    "0123.png": {
      "hold": 3.5,
      "badge": null,
      "cap": "The Agents tab lists all three children",
      "voGap": 1.2,
      "vo": "The Agents tab lists all three children, and each one is done."
    },
    "0124.png": {
      "hold": 2.5,
      "cursor": true,
      "cap": "Each child attaches its recording",
      "voGap": 1.2,
      "vo": "Open a child to see its work. Each Devin attaches a recording of the repro to its message."
    },
    "0125.png": {
      "hold": 1.5
    },
    "0128.png": {
      "hold": 2,
      "cap": "Precondition passes, Reset check fails",
      "vo": "The recording viewer plays the run and lists each check. The precondition passes, and the Reset check fails, which is the bug."
    },
    "0157.png": {
      "hold": 2,
      "cap": "macOS: the same bug",
      "voGap": 1.0,
      "vo": "On macOS, the same app shows the same bug on main. On the fix branch, Reset empties the history and all three checks pass."
    },
    "0182.png": {
      "hold": 1.2,
      "cap": "Windows: the same bug",
      "voGap": 1.0,
      "vo": "Windows tells the same story, with the bug on main and three passing checks on the fix branch."
    },
    "0138.png": {
      "hold": 1.5,
      "cap": "Linux re-tests the fix branch: 3 passed",
      "voGap": 1.2,
      "vo": "Once the fix is up, the coordinator sends the branch back to each child. Linux tests it on the same machine and records again, and this time every check passes."
    },
    "0169.png": {
      "hold": 1.5,
      "cap": "macOS: 3 passed"
    },
    "0199.png": {
      "hold": 1.2,
      "cap": "Windows: 3 passed"
    },
    "0213.png": {
      "hold": 4,
      "cap": "One PR: reset() now clears history",
      "voGap": 1.2,
      "vo": "Back in the coordinator, the diff shows the fix: one new line in Reset that clears the history."
    },
    "0214.png": {
      "hold": 5,
      "cap": "Reproduced and fixed on all three",
      "vo": "Its summary confirms it. The bug reproduced on all three systems, the fix passed on all three, and CI is green."
    },
    "0002.png": {
      "skip": true
    },
    "0003.png": {
      "skip": true
    },
    "0005.png": {
      "skip": true
    },
    "0008.png": {
      "skip": true
    },
    "0009.png": {
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
    "0030.png": {
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
    "0126.png": {
      "skip": true
    },
    "0127.png": {
      "skip": true
    },
    "0139.png": {
      "skip": true
    },
    "0140.png": {
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
    "0166.png": {
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
    "0196.png": {
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
    "0211.png": {
      "skip": true
    },
    "0212.png": {
      "skip": true
    },
    "0158.png": {
      "skip": true
    },
    "0160.png": {
      "skip": true
    },
    "0162.png": {
      "skip": true
    },
    "0164.png": {
      "skip": true
    },
    "0183.png": {
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
    "0191.png": {
      "skip": true
    },
    "0193.png": {
      "skip": true
    },
    "0165.png": {
      "skip": true
    },
    "0177.png": {
      "skip": true
    },
    "0195.png": {
      "skip": true
    },
    "0210.png": {
      "skip": true
    },
    "0142.png": {
      "skip": true
    },
    "0144.png": {
      "skip": true
    },
    "0146.png": {
      "skip": true
    },
    "0148.png": {
      "skip": true
    },
    "0150.png": {
      "skip": true
    },
    "0152.png": {
      "skip": true
    }
  }
};
