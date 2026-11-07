window.SPEC = {
 "title": "Code Quality Assurance with Devin",
 "subtitle": "Debugging, refactoring, testing, and code review",
 "outro": "Devin, by Cognition",
 "outroSub": "devin.ai  \u00b7  cognition.com",
 "speed": 1,
 "cps": 48,
 "maxZoom": 1.4,
 "voSentGap": 1.0,
 "pace": 1.5,
 "edit": {
  "0000.png": {
   "scene": "open",
   "hold": 6,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "This video covers Code Quality Assurance with Devin. It shows how Devin helps teams debug, refactor, test, and review code at each step of software development."
  },
  "0001.png": {
   "scene": "agents",
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Devin is an AI software engineer made by Cognition. Devin also includes specialized agents. A specialized agent is an agent that is built for one job."
  },
  "0002.png": {
   "scene": "agents",
   "sceneCont": true,
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "This video uses two of them. Devin Review is a specialized agent for code review. Devin Oncall is a specialized agent for site reliability engineering, which is the work of keeping production systems running."
  },
  "0003.png": {
   "scene": "envs",
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Every Devin session runs on its own virtual machine, or VM. A VM is a full computer in the cloud. Teams can choose Linux, macOS, or Windows VMs. On macOS, Devin can use Xcode and the iOS Simulator. Devin can also run Android emulators.",
   "voSay": "Every Devin session runs on its own virtual machine, or V M. A V M is a full computer in the cloud. Teams can choose Linux, macOS, or Windows V Ms. On macOS, Devin can use Xcode and the i O S Simulator. Devin can also run Android emulators."
  },
  "0004.png": {
   "scene": "envs",
   "sceneCont": true,
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Everything in this video works the same way on all of these VMs. Most of this demo uses macOS. One part uses Windows for a desktop app.",
   "voSay": "Everything in this video works the same way on all of these V Ms. Most of this demo uses macOS. One part uses Windows for a desktop app."
  },
  "0005.png": {
   "scene": "example",
   "hold": 4,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Our example is the claims platform of an insurance company. It has four repositories: a Java claims service that calculates and pays claims, a web portal where customers file claims, a Windows desktop app that adjusters use to approve claims, and an iOS app that field adjusters use to file damage reports.",
   "voSay": "Our example is the claims platform of an insurance company. It has four repositories: a Java claims service that calculates and pays claims, a web portal where customers file claims, a Windows desktop app that adjusters use to approve claims, and an i O S app that field adjusters use to file damage reports."
  },
  "0006.png": {
   "scene": "example",
   "sceneCont": true,
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "The team has strict rules. A person reviews every change. Every bug fix needs a regression test, which is a test that proves the bug stays fixed. Only people merge pull requests."
  },
  "0007.png": {
   "scene": "ch1",
   "hold": 4,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Code review."
  },
  "0008.png": {
   "scene": "adversarial",
   "hold": 4,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Code review is the first quality check on every change. Devin Review is a specialized code review agent. It uses adversarial agents. Some agents look for problems, and other agents try to prove each finding wrong. Devin Review reports only the findings that hold up."
  },
  "0009.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": {
    "x": 645.5,
    "y": 455.5,
    "w": 501.0,
    "h": 29.0
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "An admin turns on automatic review in the Review settings. The admin chooses the repositories, when the review runs, and the review effort. Normal effort balances cost and depth. Ultra effort gives the most complete review, at a higher cost."
  },
  "0010.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": {
    "x": 733.0,
    "y": 396.5,
    "w": 902.0,
    "h": 287.0
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "Here, Devin Review covers all four repositories, at Ultra effort."
  },
  "0011.png": {
   "scene": "multirepo",
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "It reviews the pull requests from each repository with the same rules, and it shows them in one place."
  },
  "0012.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "A developer opens a pull request on the claims service. It adds a payout export for the finance team. Devin Review starts with a short summary of what the change does."
  },
  "0013.png": {
   "hold": 2,
   "cursor": false,
   "hl": {
    "x": 1203.0,
    "y": 351.5,
    "w": 436.0,
    "h": 445.0
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "Then it lists its findings by type and by severity."
  },
  "0014.png": {
   "hold": 3,
   "cursor": false,
   "hl": {
    "x": 1194.0,
    "y": 520.0,
    "w": 430.0,
    "h": 196.0
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "The most serious finding is that a signed-in customer can read the payout details of another customer. Devin labels it as broken access control, CWE-862. It shows the lines of code and recommends an ownership check.",
   "voSay": "The most serious finding is that a signed-in customer can read the payout details of another customer. Devin labels it as broken access control, CWE eight six two. It shows the lines of code and recommends an ownership check."
  },
  "0015.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": {
    "x": 1191.0,
    "y": 508.5,
    "w": 428.0,
    "h": 173.0
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "A second finding is a rounding bug. The installments do not add up to the claim total."
  },
  "0016.png": {
   "hold": 2,
   "cursor": false,
   "hl": {
    "x": 1210.0,
    "y": 705.0,
    "w": 446.0,
    "h": 106.0
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "Reviewers can ask questions in Review chat. Here the reviewer asks which findings must be fixed before the merge."
  },
  "0017.png": {
   "hold": 3,
   "cursor": false,
   "hl": {
    "x": 1240,
    "y": 405,
    "w": 402,
    "h": 616
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "Devin names the blockers and links to the code."
  },
  "0018.png": {
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "From my work with engineering teams, quality checks work best at every step of development, because a problem costs less to fix when you find it early. So teams also use Devin Review while a change is still being written."
  },
  "0019.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": {
    "x": 634.5,
    "y": 459.5,
    "w": 311.0,
    "h": 49.0
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "Devin Review does not review draft pull requests automatically. Here the developer starts a review on a draft. Devin Review reviews it now, and again on every push."
  },
  "0020.png": {
   "hold": 3,
   "cursor": false,
   "hl": {
    "x": 1205.0,
    "y": 349.0,
    "w": 440.0,
    "h": 368.0
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "The change is not finished, but Devin Review already finds two problems. The critical one is that finance users can see the fraud score, which only adjusters should see."
  },
  "0021.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": {
    "x": 1187.5,
    "y": 348.5,
    "w": 405.0,
    "h": 209.0
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "The second is a bug. The prior claims count includes claims filed later, so an earlier claim can get a higher score than it should."
  },
  "0022.png": {
   "hold": 2,
   "cursor": false,
   "hl": {
    "x": 1217.5,
    "y": 183.5,
    "w": 393.0,
    "h": 75.0
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "The developer can also use Review chat to learn about the code while writing it. Here the developer asks how the fraud score uses the prior claims count. Devin reads the code to answer."
  },
  "0023.png": {
   "hold": 3,
   "cursor": false,
   "hl": {
    "x": 1194.0,
    "y": 585.0,
    "w": 430.0,
    "h": 100.0
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "Devin explains which claims to count, and it points out the same access problem. The developer learns this before the change is done, when it is cheapest to fix."
  },
  "0024.png": {
   "scene": "ch2",
   "hold": 4,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Debugging a failing build."
  },
  "0025.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": {
    "x": 357,
    "y": 24.5,
    "w": 78,
    "h": 22
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "CI, the automatic build and test system, fails on the same pull request. The developer asks Devin to fix it. This session runs on a macOS VM.",
   "voSay": "C I, the automatic build and test system, fails on the same pull request. The developer asks Devin to fix it. This session runs on a macOS V M."
  },
  "0026.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": {
    "x": 1005.5,
    "y": 477.5,
    "w": 807.0,
    "h": 169.0
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "Devin reads the CI logs, reproduces the failure on its VM, and finds the root cause.",
   "voSay": "Devin reads the C I logs, reproduces the failure on its V M, and finds the root cause."
  },
  "0027.png": {
   "hold": 3,
   "cursor": false,
   "hl": {
    "x": 286.0,
    "y": 342.5,
    "w": 514.0,
    "h": 251.0
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "It fixes the failure and the review findings: an ownership check, installments that add up to the exact total, safe CSV values, and a 404 for an unknown claim. It adds a regression test for each bug.",
   "voSay": "It fixes the failure and the review findings: an ownership check, installments that add up to the exact total, safe CSV values, and a four oh four for an unknown claim. It adds a regression test for each bug."
  },
  "0028.png": {
   "hold": 3,
   "cursor": false,
   "hl": {
    "x": 834.0,
    "y": 627.0,
    "w": 460.0,
    "h": 46.0
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "Before it pushes the code, Devin runs the full build and test suite. Then CI passes.",
   "voSay": "Before it pushes the code, Devin runs the full build and test suite. Then C I passes."
  },
  "0029.png": {
   "scene": "ch3",
   "hold": 4,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Refactoring."
  },
  "0030.png": {
   "scene": "stack",
   "hold": 4,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "A refactor changes the structure of code but not its behavior. A large refactor is hard to review as one pull request. Devin can split it into stacked pull requests. Each pull request targets the branch of the one below it, so a reviewer reads one small change at a time."
  },
  "0031.png": {
   "hold": 3,
   "cursor": false,
   "hl": {
    "x": 350,
    "y": 252.5,
    "w": 332,
    "h": 97
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "Here, Devin moves the payout calculations into one shared module, in three stacked pull requests: the new module, the change to the callers, and the removal of the old code. Devin Review shows where each pull request sits in the stack."
  },
  "0032.png": {
   "scene": "ch4",
   "hold": 4,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Test generation."
  },
  "0033.png": {
   "scene": "tests",
   "hold": 4,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Devin writes tests that follow the existing test patterns of the team. In this example, it writes three types of tests: unit tests, integration tests, and end-to-end tests that use the app as a person does."
  },
  "0034.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": {
    "x": 404.3,
    "y": 24.4,
    "w": 92,
    "h": 22
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "This session runs on a Windows VM. Adjusters report that a twenty thousand dollar claim was approved without a supervisor. The approval limit is ten thousand dollars.",
   "voSay": "This session runs on a Windows V M. Adjusters report that a twenty thousand dollar claim was approved without a supervisor. The approval limit is ten thousand dollars."
  },
  "0035.png": {
   "hold": 3,
   "cursor": false,
   "hl": {
    "x": 946.5,
    "y": 425,
    "w": 689,
    "h": 70,
    "pad": 0
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "Devin finds the root cause. The code compared the claim amount in dollars to a limit stored in cents."
  },
  "0036.png": {
   "hold": 3,
   "cursor": false,
   "hl": {
    "x": 282,
    "y": 348.5,
    "w": 508,
    "h": 275
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "It adds unit tests below, at, and above the limit, an integration test for the claim queue, and an end-to-end test that opens the Windows app, approves the claim, and checks that it goes to a supervisor."
  },
  "0037.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": {
    "x": 230.0,
    "y": 121.5,
    "w": 378.0,
    "h": 31.0
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "It also records a check of the app, so a reviewer can watch each step."
  },
  "0038.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "All fourteen tests pass on Windows and in CI, and Devin opens a pull request.",
   "voSay": "All fourteen tests pass on Windows and in C I, and Devin opens a pull request."
  },
  "0039.png": {
   "scene": "ch5",
   "hold": 4,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Testing at scale."
  },
  "0040.png": {
   "scene": "dwscript",
   "hold": 5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Some test work is large and repetitive. An example is to add tests to every package in a service. For this work, Devin can write a Dynamic Workflow. A Dynamic Workflow is a Python script that runs many Devin agents."
  },
  "0041.png": {
   "scene": "dwscript",
   "sceneCont": true,
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "The workflow is deterministic. It runs the same steps in the same order every time, and each step returns structured results. In each step, an agent decides how to write the tests."
  },
  "0042.png": {
   "hold": 3,
   "cursor": false,
   "hl": {
    "x": 962.5,
    "y": 396.5,
    "w": 721.0,
    "h": 33.0
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "Here is the workflow. The list of packages is in the code: one agent for each of the six packages in the claims service."
  },
  "0043.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": {
    "x": 996.0,
    "y": 423.0,
    "w": 814.0,
    "h": 412.0
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "Each agent writes unit tests and integration tests for its package, runs them, and pushes a branch."
  },
  "0044.png": {
   "hold": 3,
   "cursor": false,
   "hl": {
    "x": 257.5,
    "y": 369.0,
    "w": 437.0,
    "h": 256.0
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "A final step merges the branches, runs the full build, and opens one pull request. It adds one hundred twenty four unit tests and forty six integration tests, and all of the tests pass."
  },
  "0045.png": {
   "scene": "dw",
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "A normal Devin session is not deterministic. Devin decides the next step while it works. Use a session for one task. Use a Dynamic Workflow when the steps must be the same every time."
  },
  "0046.png": {
   "scene": "ch6",
   "hold": 4,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Production debugging."
  },
  "0047.png": {
   "hold": 2,
   "cursor": false,
   "hl": {
    "x": 1106.5,
    "y": 278.5,
    "w": 167.0,
    "h": 31.0
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "Devin Oncall is the specialized agent for site reliability engineering. You set up a responder, which watches one source of alerts."
  },
  "0048.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": {
    "x": 578.0,
    "y": 243.0,
    "w": 244.0,
    "h": 82.0
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "This responder gets crash alerts for the iOS app from a webhook.",
   "voSay": "This responder gets crash alerts for the i O S app from a webhook."
  },
  "0049.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": {
    "x": 941.5,
    "y": 564.3,
    "w": 941,
    "h": 183
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "It follows the runbook of the team: reproduce the crash, fix the root cause, add tests, and open a pull request."
  },
  "0050.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": {
    "x": 941.5,
    "y": 776,
    "w": 941,
    "h": 72
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "And it runs on a macOS VM, with Xcode and the iOS Simulator.",
   "voSay": "And it runs on a macOS V M, with Xcode and the i O S Simulator."
  },
  "0051.png": {
   "hold": 2,
   "cursor": false,
   "hl": {
    "x": 507.5,
    "y": 688.5,
    "w": 865.0,
    "h": 27.0
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "A crash monitor reports a new crash in the iOS app for field adjusters. The responder starts an investigation.",
   "voSay": "A crash monitor reports a new crash in the i O S app for field adjusters. The responder starts an investigation."
  },
  "0052.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": {
    "x": 1060.0,
    "y": 684.0,
    "w": 736.0,
    "h": 262.0
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "Devin Oncall reads the alert. It has the stack trace and the breadcrumbs, which are the last steps the user took before the crash."
  },
  "0053.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": {
    "x": 302.0,
    "y": 251.5,
    "w": 472.0,
    "h": 119.0
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "It posts a first update with the severity and the likely cause: a division by zero when an estimate has no line items."
  },
  "0054.png": {
   "hold": 3,
   "cursor": false,
   "hl": {
    "x": 1026.5,
    "y": 501.5,
    "w": 753.0,
    "h": 75.0
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "On the macOS VM, Devin follows the breadcrumbs in the iOS Simulator. It removes the line items from an estimate, and the app crashes with the same stack trace.",
   "voSay": "On the macOS V M, Devin follows the breadcrumbs in the i O S Simulator. It removes the line items from an estimate, and the app crashes with the same stack trace."
  },
  "0055.png": {
   "hold": 3,
   "cursor": false,
   "hl": {
    "x": 308.0,
    "y": 640.5,
    "w": 462.0,
    "h": 77.0
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "Devin fixes the root cause. It adds a unit test for an estimate with no items, and a UI test that removes the last item. Then it runs the full test suite on the simulator."
  },
  "0056.png": {
   "hold": 3,
   "cursor": false,
   "hl": {
    "x": 302.0,
    "y": 338.5,
    "w": 472.0,
    "h": 259.0
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "The final report gives the root cause, the confidence, and the app versions that are affected."
  },
  "0057.png": {
   "hold": 3,
   "cursor": false,
   "hl": {
    "x": 184.0,
    "y": 119.0,
    "w": 236.0,
    "h": 144.0
   },
   "capPos": "bottom",
   "hlDelay": 0.5,
   "vo": "It attaches a write-up, the test logs, and a patch file. This responder did not have permission to push code, so a developer opens the pull request from the patch."
  },
  "0058.png": {
   "scene": "close",
   "hold": 9,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "To recap: Devin Review checks the pull requests in every repository. Devin finds root causes from CI logs and production alerts, splits large refactors into small stacked pull requests, and writes unit, integration, and end-to-end tests. Dynamic Workflows run large test jobs the same way every time. All of this works on Linux, macOS, and Windows VMs, with the iOS Simulator and Android emulators. A person approves every merge.",
   "voSay": "To recap: Devin Review checks the pull requests in every repository. Devin finds root causes from C I logs and production alerts, splits large refactors into small stacked pull requests, and writes unit, integration, and end-to-end tests. Dynamic Workflows run large test jobs the same way every time. All of this works on Linux, macOS, and Windows V Ms, with the i O S Simulator and Android emulators. A person approves every merge."
  }
 }
};
