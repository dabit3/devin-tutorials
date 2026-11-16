window.SPEC = {
 "title": "",
 "subtitle": "",
 "introHold": 0.2,
 "outro": "Devin, by Cognition",
 "outroSub": "devin.ai  \u00b7  cognition.com",
 "speed": 1,
 "cps": 48,
 "maxZoom": 1.4,
 "voSentGap": 0.3,
 "pace": 1.5,
 "edit": {
  "0000.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 1,
   "vo": "This video shows how Devin supports code quality across the software development life cycle. It covers code review, security, debugging, refactoring, and testing."
  },
  "0001.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 720,
     "y": 405,
     "w": 757,
     "h": 133
    }
   ],
   "capPos": "bottom",
   "line": 2,
   "hlDelay": 0.5,
   "vo": "The demo goes through each stage in order. It starts with writing code and opening a pull request. Then it covers security, a failing build, a refactor, new tests, and production bugs."
  },
  "0002.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 720,
     "y": 445,
     "w": 878,
     "h": 268
    }
   ],
   "capPos": "bottom",
   "line": 3,
   "hlDelay": 0.5,
   "vo": "Our example is the claims platform of an insurance company. It has four repositories: a Java claims service, a web portal for customers, a Windows desktop app for adjusters, and an iOS app for field adjusters.",
   "voSay": "Our example is the claims platform of an insurance company. It has four repositories: a Java claims service, a web portal for customers, a Windows desktop app for adjusters, and an i O S app for field adjusters."
  },
  "0003.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 4,
   "vo": "The team keeps its rules in a file called AGENTS.md. One rule is that every bug fix needs a regression test, which is a test that proves the bug stays fixed. Devin follows this rule when it writes code, and Devin Review flags pull requests that break it. Devin opens pull requests, and a person on the team approves every merge.",
   "voSay": "The team keeps its rules in a file called agents dot M D. One rule is that every bug fix needs a regression test, which is a test that proves the bug stays fixed. Devin follows this rule when it writes code, and Devin Review flags pull requests that break it. Devin opens pull requests, and a person on the team approves every merge."
  },
  "0004.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 5,
   "vo": "Devin includes specialized agents, which are agents built for one job. Each one runs in its own session, with its own context, and the team manages them from the web app, Devin Desktop, Slack, or the API.",
   "voSay": "Devin includes specialized agents, which are agents built for one job. Each one runs in its own session, with its own context, and the team manages them from the web app, Devin Desktop, Slack, or the A P I."
  },
  "0005.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 720,
     "y": 405,
     "w": 680,
     "h": 130
    }
   ],
   "capPos": "bottom",
   "line": 6,
   "hlDelay": 0.5,
   "vo": "This video uses three. Devin Review uses adversarial agents. Some agents look for problems, and other agents try to prove each problem is wrong. Devin Security uses agentic MapReduce to scan a whole codebase. Devin Oncall is a site reliability agent with its own harness."
  },
  "0006.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 513.1500000000001,
     "y": 250.8,
     "w": 679.8000000000001,
     "h": 44
    }
   ],
   "capPos": "bottom",
   "line": 7,
   "hlDelay": 0.5,
   "vo": "Review can start before the code is finished. A developer is adding a fraud score to the claim page, and the pull request is still a draft."
  },
  "0007.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 548.9000000000001,
     "y": 305.8,
     "w": 255.20000000000002,
     "h": 88
    }
   ],
   "capPos": "bottom",
   "line": 8,
   "hlDelay": 0.5,
   "vo": "Devin Review does not review drafts automatically, so the developer starts a review from the pull request menu."
  },
  "0008.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 1233.65,
     "y": 260.70000000000005,
     "w": 401.50000000000006,
     "h": 244.20000000000002
    }
   ],
   "capPos": "bottom",
   "line": 9,
   "hlDelay": 0.5,
   "vo": "The change is not finished yet. Devin Review flags one thing to look into: older claims can push a claim over the investigation threshold, because the code counts all of the customer's past claims."
  },
  "0009.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 520.85,
     "y": 444.40000000000003,
     "w": 677.6,
     "h": 171.60000000000002
    }
   ],
   "capPos": "bottom",
   "line": 10,
   "hlDelay": 0.5,
   "vo": "Its summary also checks access: the new fields are shown only to users who can see all claims, so customers never get them."
  },
  "0010.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 1233,
     "y": 727,
     "w": 392,
     "h": 72
    }
   ],
   "capPos": "bottom",
   "line": 11,
   "hlDelay": 0.5,
   "vo": "The developer can ask questions in Review chat while writing the code. Here they ask how the score should count prior claims."
  },
  "0011.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 1233,
     "y": 482,
     "w": 392,
     "h": 340
    }
   ],
   "capPos": "bottom",
   "line": 12,
   "hlDelay": 0.5,
   "vo": "Devin Review explains which claims to count: the same customer, only claims filed before this one, and only in the same year. It also suggests tests for the edge cases."
  },
  "0012.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 1237,
     "y": 149,
     "w": 392,
     "h": 100
    }
   ],
   "capPos": "bottom",
   "line": 13,
   "hlDelay": 0.5,
   "vo": "The developer can also review in Devin Desktop."
  },
  "0013.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 1237,
     "y": 205,
     "w": 384,
     "h": 190
    }
   ],
   "capPos": "bottom",
   "line": 13,
   "hlDelay": 0.5,
   "vo": "The same finding is there, and they can ask Devin Review questions in chat."
  },
  "0014.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 720,
     "y": 406,
     "w": 640,
     "h": 125
    }
   ],
   "capPos": "bottom",
   "line": 14,
   "hlDelay": 0.5,
   "vo": "When a pull request is ready, Devin Review runs on its own. An admin picks the repositories, when the review runs, and the review effort. Here it covers all four repositories at Ultra effort."
  },
  "0015.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 720,
     "y": 346,
     "w": 878,
     "h": 80
    }
   ],
   "capPos": "bottom",
   "line": 15,
   "hlDelay": 0.5,
   "vo": "The admin also sets controls, such as a spend limit for each pull request."
  },
  "0016.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 678,
     "y": 592,
     "w": 210,
     "h": 244
    },
    {
     "x": 396,
     "y": 709,
     "w": 112,
     "h": 26
    }
   ],
   "capPos": "bottom",
   "line": 15,
   "hlDelay": 0.5,
   "vo": "Devin Review reads the team's rule files, such as REVIEW.md and AGENTS.md, on every review.",
   "voSay": "Devin Review reads the team's rule files, such as review dot M D and agents dot M D, on every review."
  },
  "0017.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 432.85,
     "y": 489.50000000000006,
     "w": 677.6,
     "h": 257.40000000000003
    }
   ],
   "capPos": "bottom",
   "line": 16,
   "hlDelay": 0.5,
   "vo": "A developer opens a pull request on the claims service. It adds a payout export for the finance team. Devin Review starts with a summary of what the change does."
  },
  "0018.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 959.6984375000001,
     "y": 125.4,
     "w": 187.99687500000002,
     "h": 30.800000000000004
    }
   ],
   "capPos": "bottom",
   "line": 17,
   "hlDelay": 0.5,
   "vo": "Then it lists its findings by type and by severity."
  },
  "0019.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 1145.65,
     "y": 276.65000000000003,
     "w": 577.5,
     "h": 276.1
    }
   ],
   "capPos": "bottom",
   "line": 18,
   "hlDelay": 0.5,
   "vo": "The most serious finding is that a signed-in customer can read the payout details of another customer. Devin labels it as broken access control, CWE-639, shows the lines of code, and recommends a fix."
  },
  "0020.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 1145.65,
     "y": 346.5,
     "w": 577.5,
     "h": 160.60000000000002
    }
   ],
   "capPos": "bottom",
   "line": 19,
   "hlDelay": 0.5,
   "vo": "A second finding is a rounding bug. It is tagged as a repo rule, because AGENTS.md says money must be split with the team's own helper. This is how the team's coding standards are enforced.",
   "voSay": "A second finding is a rounding bug. It is tagged as a repo rule, because agents dot M D says money must be split with the team's own helper. This is how the team's coding standards are enforced."
  },
  "0021.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 1236,
     "y": 255,
     "w": 392,
     "h": 330
    }
   ],
   "capPos": "bottom",
   "line": 20,
   "hlDelay": 0.5,
   "vo": "The reviewer asks which findings must be fixed before the merge. Devin Review names the blockers and links each one to the code and to the rule it breaks."
  },
  "0022.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 1008,
     "y": 345,
     "w": 300,
     "h": 130
    }
   ],
   "capPos": "bottom",
   "line": 21,
   "hlDelay": 0.5,
   "vo": "Devin Security is a specialized agent that scans whole repositories for security problems."
  },
  "0023.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 287,
     "y": 505,
     "w": 545,
     "h": 255
    }
   ],
   "capPos": "bottom",
   "line": 21,
   "hlDelay": 0.5,
   "vo": "Before it scans, it asks a few questions to build a threat model, such as who the attackers are and how the service is reached."
  },
  "0024.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 1000,
     "y": 131,
     "w": 800,
     "h": 60
    },
    {
     "x": 1008,
     "y": 610,
     "w": 806,
     "h": 50
    }
   ],
   "capPos": "bottom",
   "line": 22,
   "hlDelay": 0.5,
   "vo": "Here it finds a chain of problems. The claims service trusts the user ID and role in the request headers, and never checks that they came from the gateway. So anyone who can reach the service can claim to be an adjuster and read every customer's claims."
  },
  "0025.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 1008,
     "y": 145,
     "w": 806,
     "h": 190
    },
    {
     "x": 150,
     "y": 181,
     "w": 230,
     "h": 28
    }
   ],
   "capPos": "bottom",
   "line": 23,
   "hlDelay": 0.5,
   "vo": "Devin documents its reasoning step by step through the code. Then it verifies the finding on a running build: a request that claims to be an adjuster gets back every customer's claims. It labels the finding CWE-290 and marks it critical.",
   "voSay": "Devin documents its reasoning step by step through the code. Then it verifies the finding on a running build: a request that claims to be an adjuster gets back every customer's claims. It labels the finding CWE two ninety and marks it critical."
  },
  "0026.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 512,
     "y": 125,
     "w": 690,
     "h": 70
    },
    {
     "x": 1232,
     "y": 190,
     "w": 396,
     "h": 190
    }
   ],
   "capPos": "bottom",
   "line": 24,
   "hlDelay": 0.5,
   "vo": "One click on Fix with Devin starts a fix. Devin makes the service require a signed header from the gateway, adds tests, and opens a pull request. Devin Review reviews it like any other change."
  },
  "0027.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 247,
     "y": 27,
     "w": 380,
     "h": 32
    }
   ],
   "capPos": "bottom",
   "line": 25,
   "hlDelay": 0.5,
   "vo": "The payout pull request also fails in CI, the automatic build and test system. The developer asks Devin to fix it. This session runs on a macOS VM.",
   "voSay": "The payout pull request also fails in C I, the automatic build and test system. The developer asks Devin to fix it. This session runs on a macOS V M."
  },
  "0028.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 290,
     "y": 253,
     "w": 480,
     "h": 185
    }
   ],
   "capPos": "bottom",
   "line": 26,
   "hlDelay": 0.5,
   "vo": "Devin reads the CI logs, runs the failing test on its VM, and finds the root cause. The export rounded each installment, so one million cents became 999,999.",
   "voSay": "Devin reads the C I logs, runs the failing test on its V M, and finds the root cause. The export rounded each installment, so one million cents became nine hundred and ninety-nine thousand nine hundred and ninety-nine."
  },
  "0029.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 290,
     "y": 438,
     "w": 480,
     "h": 130
    }
   ],
   "capPos": "bottom",
   "line": 27,
   "hlDelay": 0.5,
   "vo": "It fixes the failure and the review findings in the same pull request. Each new regression test fails on the old code and passes on the fix."
  },
  "0030.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 287,
     "y": 505,
     "w": 500,
     "h": 100
    }
   ],
   "capPos": "bottom",
   "line": 28,
   "hlDelay": 0.5,
   "vo": "Before it pushes, Devin runs the full build and test suite. Then CI passes.",
   "voSay": "Before it pushes, Devin runs the full build and test suite. Then C I passes."
  },
  "0031.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 385,
     "y": 170,
     "w": 745,
     "h": 160
    }
   ],
   "capPos": "bottom",
   "line": 29,
   "hlDelay": 0.5,
   "vo": "Large refactors are hard to review as one pull request. Devin can split a refactor into stacked pull requests, where each one builds on the one below it."
  },
  "0032.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 288,
     "y": 380,
     "w": 465,
     "h": 230
    }
   ],
   "capPos": "bottom",
   "line": 30,
   "hlDelay": 0.5,
   "vo": "Here, Devin moves the payout math into one shared module in three pull requests. The first adds the new module, the second switches the callers, and the third deletes the old code."
  },
  "0033.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 380,
     "y": 145,
     "w": 735,
     "h": 75
    }
   ],
   "capPos": "bottom",
   "line": 31,
   "hlDelay": 0.5,
   "vo": "Each pull request is small, so Devin Review and the reviewer check one change at a time."
  },
  "0034.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 1105,
     "y": 215,
     "w": 650,
     "h": 215
    }
   ],
   "capPos": "bottom",
   "line": 31,
   "hlDelay": 0.5,
   "vo": "Devin Review found no problems in any of the three."
  },
  "0035.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 340,
     "y": 202,
     "w": 390,
     "h": 260
    }
   ],
   "capPos": "bottom",
   "line": 32,
   "hlDelay": 0.5,
   "vo": "Devin can write a whole test suite. Here, the developer asks for tests of the claims API at three levels, and asks Devin to run them all.",
   "voSay": "Devin can write a whole test suite. Here, the developer asks for tests of the claims A P I at three levels, and asks Devin to run them all."
  },
  "0036.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 425,
     "y": 131,
     "w": 836,
     "h": 44
    }
   ],
   "capPos": "bottom",
   "line": 33,
   "hlDelay": 0.5,
   "vo": "Unit tests check one class at a time. Devin writes tests for the fraud rules and the coverage calculator, with a test on each side of every limit."
  },
  "0037.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 288,
     "y": 93,
     "w": 470,
     "h": 55
    },
    {
     "x": 1008,
     "y": 434,
     "w": 808,
     "h": 230
    }
   ],
   "capPos": "bottom",
   "line": 34,
   "hlDelay": 0.5,
   "vo": "Integration tests check the API with the database. They use MockMvc, which sends requests to the API inside the test, and the seed data.",
   "voSay": "Integration tests check the A P I with the database. They use MockMvc, which sends requests to the A P I inside the test, and the seed data."
  },
  "0038.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 296,
     "y": 262,
     "w": 480,
     "h": 96
    },
    {
     "x": 1008,
     "y": 648,
     "w": 806,
     "h": 40
    }
   ],
   "capPos": "bottom",
   "line": 35,
   "hlDelay": 0.5,
   "vo": "The end-to-end test starts the whole service and calls it over HTTP, as a customer and as an adjuster. It checks that a customer cannot read another customer's claim."
  },
  "0039.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 1008,
     "y": 338,
     "w": 806,
     "h": 40
    },
    {
     "x": 1008,
     "y": 734,
     "w": 806,
     "h": 106
    }
   ],
   "capPos": "bottom",
   "line": 36,
   "hlDelay": 0.5,
   "vo": "Then Devin runs the whole suite with one command. The unit and integration tests pass, then the five end-to-end tests pass, and the build succeeds."
  },
  "0040.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 288,
     "y": 483,
     "w": 494,
     "h": 252
    }
   ],
   "capPos": "bottom",
   "line": 37,
   "hlDelay": 0.5,
   "vo": "Devin reports the count for each type: 31 unit, 19 integration, and 5 end-to-end tests."
  },
  "0041.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 288,
     "y": 573,
     "w": 500,
     "h": 75
    }
   ],
   "capPos": "bottom",
   "line": 37,
   "hlDelay": 0.5,
   "vo": "CI passes, and Devin Review finds no issues.",
   "voSay": "C I passes, and Devin Review finds no issues."
  },
  "0042.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 409,
     "y": 24,
     "w": 92,
     "h": 26
    },
    {
     "x": 340,
     "y": 129,
     "w": 390,
     "h": 105
    }
   ],
   "capPos": "bottom",
   "line": 38,
   "hlDelay": 0.5,
   "vo": "Devin can also write tests from a requirement. Here, claims over ten thousand dollars must go to a supervisor. This session runs on a Windows VM.",
   "voSay": "Devin can also write tests from a requirement. Here, claims over ten thousand dollars must go to a supervisor. This session runs on a Windows V M."
  },
  "0043.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 288,
     "y": 392,
     "w": 500,
     "h": 100
    }
   ],
   "capPos": "bottom",
   "line": 39,
   "hlDelay": 0.5,
   "vo": "Devin finds that the code compared dollars to a limit in cents."
  },
  "0044.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 418,
     "y": 125,
     "w": 670,
     "h": 70
    },
    {
     "x": 1144,
     "y": 275,
     "w": 570,
     "h": 40
    }
   ],
   "capPos": "bottom",
   "line": 39,
   "hlDelay": 0.5,
   "vo": "It writes unit, integration, and UI tests, and all fourteen pass on Windows and in CI.",
   "voSay": "It writes unit, integration, and UI tests, and all fourteen pass on Windows and in C I."
  },
  "0045.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 340,
     "y": 140,
     "w": 390,
     "h": 112
    }
   ],
   "capPos": "bottom",
   "line": 40,
   "hlDelay": 0.5,
   "vo": "Some test work is too large for one session. For this, Devin writes a Dynamic Workflow, a Python script that runs many Devin agents."
  },
  "0046.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 1008,
     "y": 745,
     "w": 806,
     "h": 125
    }
   ],
   "capPos": "bottom",
   "line": 41,
   "hlDelay": 0.5,
   "vo": "The workflow runs the same steps in the same order every time. Inside each step, an agent decides how to do the work."
  },
  "0047.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 288,
     "y": 216,
     "w": 496,
     "h": 116
    },
    {
     "x": 288,
     "y": 413,
     "w": 500,
     "h": 135
    }
   ],
   "capPos": "bottom",
   "line": 42,
   "hlDelay": 0.5,
   "vo": "It starts one agent for each of the six packages. Each agent runs in its own session, with its own context. It writes unit and integration tests, runs them, and pushes a branch."
  },
  "0048.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 288,
     "y": 238,
     "w": 500,
     "h": 150
    }
   ],
   "capPos": "bottom",
   "line": 43,
   "hlDelay": 0.5,
   "vo": "A final step merges the branches, runs the full build, and opens one pull request with 170 new tests for the team to review."
  },
  "0049.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 1000,
     "y": 335,
     "w": 834,
     "h": 172
    }
   ],
   "capPos": "bottom",
   "line": 44,
   "hlDelay": 0.5,
   "vo": "Some bugs still reach production. A Devin Oncall responder watches one source of alerts. This one gets crash alerts for the iOS app from a webhook.",
   "voSay": "Some bugs still reach production. A Devin Oncall responder watches one source of alerts. This one gets crash alerts for the i O S app from a webhook."
  },
  "0050.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 1000,
     "y": 243,
     "w": 834,
     "h": 40
    },
    {
     "x": 1000,
     "y": 575,
     "w": 834,
     "h": 162
    }
   ],
   "capPos": "bottom",
   "line": 45,
   "hlDelay": 0.5,
   "vo": "The responder can use the team's tools through MCP, such as Slack, and it follows the team's runbook. It runs on a macOS VM with Xcode and the iOS Simulator.",
   "voSay": "The responder can use the team's tools through M C P, such as Slack, and it follows the team's runbook. It runs on a macOS V M with Xcode and the i O S Simulator."
  },
  "0051.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 312,
     "y": 145,
     "w": 450,
     "h": 135
    }
   ],
   "capPos": "bottom",
   "line": 46,
   "hlDelay": 0.5,
   "vo": "A crash monitor sends an alert, and Devin Oncall starts a session. The alert has the stack trace and the breadcrumbs, which are the last steps the user took."
  },
  "0052.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 303,
     "y": 220,
     "w": 440,
     "h": 180
    }
   ],
   "capPos": "bottom",
   "line": 47,
   "hlDelay": 0.5,
   "vo": "Devin follows the breadcrumbs in the iOS Simulator and gets the same crash. The cause is a division by zero when an estimate has no line items.",
   "voSay": "Devin follows the breadcrumbs in the i O S Simulator and gets the same crash. The cause is a division by zero when an estimate has no line items."
  },
  "0053.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 325,
     "y": 480,
     "w": 430,
     "h": 155
    }
   ],
   "capPos": "bottom",
   "line": 48,
   "hlDelay": 0.5,
   "vo": "It fixes the root cause and adds three regression tests: two unit tests for an empty estimate, and a UI test that removes the last item."
  },
  "0054.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 310,
     "y": 283,
     "w": 450,
     "h": 135
    }
   ],
   "capPos": "bottom",
   "line": 49,
   "hlDelay": 0.5,
   "vo": "The report gives the root cause, the confidence, and the affected app versions, with the test logs and a patch attached."
  },
  "0055.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 1132,
     "y": 165,
     "w": 590,
     "h": 100
    }
   ],
   "capPos": "bottom",
   "line": 50,
   "hlDelay": 0.5,
   "vo": "Here the alert comes from a Windows desktop app."
  },
  "0056.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": {
    "x": 72,
    "y": 330,
    "w": 425,
    "h": 118
   },
   "capPos": "bottom",
   "line": 50,
   "hlDelay": 0.5,
   "vo": "Oncall starts a session on a Windows virtual machine, runs the app, and reproduces the crash. It finds the cause, a missing claim type in the approval rules, writes a fix with a test, and reports its confidence."
  },
  "0057.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 455,
     "y": 604,
     "w": 570,
     "h": 70
    },
    {
     "x": 1233,
     "y": 157,
     "w": 396,
     "h": 100
    }
   ],
   "capPos": "bottom",
   "line": 51,
   "hlDelay": 0.5,
   "vo": "A developer opens the pull request from the patch. Like every other change, it goes through Devin Review, and a person approves the merge."
  },
  "0058.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 720,
     "y": 125,
     "w": 1400,
     "h": 50
    },
    {
     "x": 720,
     "y": 520,
     "w": 1400,
     "h": 50
    }
   ],
   "capPos": "bottom",
   "line": 52,
   "hlDelay": 0.5,
   "vo": "To recap: Devin Review checked code while it was written and when each pull request opened, with the team's rules. Devin Security found and fixed a chained vulnerability."
  },
  "0059.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 720,
     "y": 125,
     "w": 1400,
     "h": 50
    },
    {
     "x": 720,
     "y": 325,
     "w": 1400,
     "h": 175
    },
    {
     "x": 720,
     "y": 455,
     "w": 1400,
     "h": 50
    }
   ],
   "capPos": "bottom",
   "line": 53,
   "hlDelay": 0.5,
   "vo": "Devin fixed a failing build, split a refactor into small pull requests, wrote and ran a whole test suite, and fixed production crashes on macOS and Windows."
  },
  "0060.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 720,
     "y": 585,
     "w": 1400,
     "h": 50
    },
    {
     "x": 720,
     "y": 650,
     "w": 1400,
     "h": 50
    }
   ],
   "capPos": "bottom",
   "line": 54,
   "hlDelay": 0.5,
   "vo": "This works on Linux, macOS, and Windows VMs, with the iOS Simulator and Android emulators.",
   "voSay": "This works on Linux, macOS, and Windows V Ms, with the i O S Simulator and Android emulators."
  },
  "0061.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": [
    {
     "x": 720,
     "y": 390,
     "w": 1404,
     "h": 590
    }
   ],
   "capPos": "bottom",
   "line": 55,
   "hlDelay": 0.5,
   "vo": "So the demo showed code quality at each stage of the life cycle: writing code, opening a pull request, security, a failing build, a refactor, testing, and production."
  }
 }
};
