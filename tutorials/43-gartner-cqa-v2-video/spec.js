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
   "hl": null,
   "capPos": "bottom",
   "vo": "An admin turns on automatic review in the Review settings. The admin chooses the repositories, when the review runs, and the review effort. Normal effort balances cost and depth. Ultra effort gives the most complete review, at a higher cost."
  },
  "0010.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
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
   "hl": null,
   "capPos": "bottom",
   "vo": "Then it lists its findings by type and by severity."
  },
  "0014.png": {
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "The most serious finding is that a signed-in customer can read the payout details of another customer. Devin labels it as broken access control, CWE-862. It shows the lines of code and recommends an ownership check.",
   "voSay": "The most serious finding is that a signed-in customer can read the payout details of another customer. Devin labels it as broken access control, CWE eight six two. It shows the lines of code and recommends an ownership check."
  },
  "0015.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "A second finding is a rounding bug. The installments do not add up to the claim total."
  },
  "0016.png": {
   "hold": 2,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Reviewers can ask questions in Review chat. Here the reviewer asks which findings must be fixed before the merge."
  },
  "0017.png": {
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Devin names the blockers and links to the code."
  },
  "0018.png": {
   "scene": "ch2",
   "hold": 4,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Debugging a failing build."
  },
  "0019.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "CI, the automatic build and test system, fails on the same pull request. The developer asks Devin to fix it. This session runs on a macOS VM.",
   "voSay": "C I, the automatic build and test system, fails on the same pull request. The developer asks Devin to fix it. This session runs on a macOS V M."
  },
  "0020.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Devin reads the CI logs, reproduces the failure on its VM, and finds the root cause.",
   "voSay": "Devin reads the C I logs, reproduces the failure on its V M, and finds the root cause."
  },
  "0021.png": {
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "It fixes the failure and the review findings: an ownership check, installments that add up to the exact total, safe CSV values, and a 404 for an unknown claim. It adds a regression test for each bug.",
   "voSay": "It fixes the failure and the review findings: an ownership check, installments that add up to the exact total, safe CSV values, and a four oh four for an unknown claim. It adds a regression test for each bug."
  },
  "0022.png": {
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Before it pushes the code, Devin runs the full build and test suite. Then CI passes.",
   "voSay": "Before it pushes the code, Devin runs the full build and test suite. Then C I passes."
  },
  "0023.png": {
   "scene": "ch3",
   "hold": 4,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Refactoring."
  },
  "0024.png": {
   "scene": "stack",
   "hold": 4,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "A refactor changes the structure of code but not its behavior. A large refactor is hard to review as one pull request. Devin can split it into stacked pull requests. Each pull request targets the branch of the one below it, so a reviewer reads one small change at a time."
  },
  "0025.png": {
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Here, Devin moves the payout calculations into one shared module, in three stacked pull requests: the new module, the change to the callers, and the removal of the old code. Devin Review shows where each pull request sits in the stack."
  },
  "0026.png": {
   "scene": "ch4",
   "hold": 4,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Test generation."
  },
  "0027.png": {
   "scene": "tests",
   "hold": 4,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Devin writes tests that follow the existing test patterns of the team. In this example, it writes three types of tests: unit tests, integration tests, and end-to-end tests that use the app as a person does."
  },
  "0028.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "This session runs on a Windows VM. Adjusters report that a twenty thousand dollar claim was approved without a supervisor. The approval limit is ten thousand dollars.",
   "voSay": "This session runs on a Windows V M. Adjusters report that a twenty thousand dollar claim was approved without a supervisor. The approval limit is ten thousand dollars."
  },
  "0029.png": {
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Devin finds the root cause. The code compared the claim amount in dollars to a limit stored in cents."
  },
  "0030.png": {
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "It adds unit tests below, at, and above the limit, an integration test for the claim queue, and an end-to-end test that opens the Windows app, approves the claim, and checks that it goes to a supervisor."
  },
  "0031.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "It also records a check of the app, so a reviewer can watch each step."
  },
  "0032.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "All fourteen tests pass on Windows and in CI, and Devin opens a pull request.",
   "voSay": "All fourteen tests pass on Windows and in C I, and Devin opens a pull request."
  },
  "0033.png": {
   "scene": "ch5",
   "hold": 4,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Testing at scale."
  },
  "0034.png": {
   "scene": "dwscript",
   "hold": 5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Some test work is large and repetitive. An example is to add tests to every package in a service. For this work, Devin can write a Dynamic Workflow. A Dynamic Workflow is a Python script that runs many Devin agents."
  },
  "0035.png": {
   "scene": "dwscript",
   "sceneCont": true,
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "The workflow is deterministic. It runs the same steps in the same order every time, and each step returns structured results. In each step, an agent decides how to write the tests."
  },
  "0036.png": {
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Here is the workflow. The list of packages is in the code: one agent for each of the six packages in the claims service."
  },
  "0037.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Each agent writes unit tests and integration tests for its package, runs them, and pushes a branch."
  },
  "0038.png": {
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "A final step merges the branches, runs the full build, and opens one pull request. It adds one hundred twenty four unit tests and forty six integration tests, and all of the tests pass."
  },
  "0039.png": {
   "scene": "dw",
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "A normal Devin session is not deterministic. Devin decides the next step while it works. Use a session for one task. Use a Dynamic Workflow when the steps must be the same every time."
  },
  "0040.png": {
   "scene": "ch6",
   "hold": 4,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Production debugging."
  },
  "0041.png": {
   "hold": 2,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Devin Oncall is the specialized agent for site reliability engineering. You set up a responder, which watches one source of alerts."
  },
  "0042.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "This responder gets crash alerts for the iOS app from a webhook.",
   "voSay": "This responder gets crash alerts for the i O S app from a webhook."
  },
  "0043.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "It follows the runbook of the team: reproduce the crash, fix the root cause, add tests, and open a pull request."
  },
  "0044.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "And it runs on a macOS VM, with Xcode and the iOS Simulator.",
   "voSay": "And it runs on a macOS V M, with Xcode and the i O S Simulator."
  },
  "0045.png": {
   "hold": 2,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "A crash monitor reports a new crash in the iOS app for field adjusters. The responder starts an investigation.",
   "voSay": "A crash monitor reports a new crash in the i O S app for field adjusters. The responder starts an investigation."
  },
  "0046.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Devin Oncall reads the alert. It has the stack trace and the breadcrumbs, which are the last steps the user took before the crash."
  },
  "0047.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "It posts a first update with the severity and the likely cause: a division by zero when an estimate has no line items."
  },
  "0048.png": {
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "On the macOS VM, Devin follows the breadcrumbs in the iOS Simulator. It removes the line items from an estimate, and the app crashes with the same stack trace.",
   "voSay": "On the macOS V M, Devin follows the breadcrumbs in the i O S Simulator. It removes the line items from an estimate, and the app crashes with the same stack trace."
  },
  "0049.png": {
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Devin fixes the root cause. It adds a unit test for an estimate with no items, and a UI test that removes the last item. Then it runs the full test suite on the simulator."
  },
  "0050.png": {
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "The final report gives the root cause, the confidence, and the app versions that are affected."
  },
  "0051.png": {
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "It attaches a write-up, the test logs, and a patch file. This responder did not have permission to push code, so a developer opens the pull request from the patch."
  },
  "0052.png": {
   "scene": "close",
   "hold": 9,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Devin Review reviews the pull requests in each repository. Devin finds root causes from CI logs and production alerts. Devin splits large refactors into small stacked pull requests. Devin writes unit, integration, and end-to-end tests, and Dynamic Workflows run large test jobs the same way every time. All of this works on Linux, macOS, and Windows VMs, with the iOS Simulator and Android emulators. A person approves every merge.",
   "voSay": "Devin Review reviews the pull requests in each repository. Devin finds root causes from C I logs and production alerts. Devin splits large refactors into small stacked pull requests. Devin writes unit, integration, and end-to-end tests, and Dynamic Workflows run large test jobs the same way every time. All of this works on Linux, macOS, and Windows V Ms, with the i O S Simulator and Android emulators. A person approves every merge."
  }
 }
};
