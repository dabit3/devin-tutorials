window.SPEC = {
 "title": "Code quality assurance with Devin",
 "subtitle": "From a production alert or a pull request to tested, reviewed code",
 "introHold": 3.4,
 "introSfx": false,
 "outro": "Devin, by Cognition",
 "outroSub": "devin.ai  \u00b7  cognition.com",
 "speed": 1,
 "cps": 48,
 "maxZoom": 1,
 "voSentGap": 0.3,
 "pace": 1.5,
 "edit": {
  "0000.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "1",
   "vo": "Today, I'll walk through how we use Devin to keep code quality high across the development life cycle."
  },
  "0001.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "2",
   "voGap": 1.0,
   "vo": "We'll cover debugging, testing, refactoring, security and code review, using three of Devin's specialized agents: Devin Oncall, Devin Security and Devin Review."
  },
  "0002.png": {
   "hold": 0.5,
   "cursor": true,
   "hl": [
    {
     "x": 535.3820312500001,
     "y": 106.15,
     "w": 416.2640625,
     "h": 42.900000000000006
    }
   ],
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "2",
   "voSync": 7.14
  },
  "0003.png": {
   "hold": 0.5,
   "cursor": true,
   "hl": [
    {
     "x": 159.95546875000002,
     "y": 57.2,
     "w": 99.9109375,
     "h": 35.2
    }
   ],
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "2",
   "voSync": 8.09
  },
  "0004.png": {
   "hold": 0.5,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "2",
   "voSync": 9.04
  },
  "0005.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": [
    {
     "x": 535.3820312500001,
     "y": 106.15,
     "w": 416.2640625,
     "h": 42.900000000000006
    }
   ],
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "3",
   "voGap": 1.0,
   "vo": "Each one is built for a single job. Oncall is a site reliability agent with its own harness."
  },
  "0006.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": [
    {
     "x": 159.95546875000002,
     "y": 57.2,
     "w": 99.9109375,
     "h": 35.2
    }
   ],
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "3",
   "vo": "Security uses agentic MapReduce to scan a whole codebase.",
   "voSay": "Security uses agentic map-reduce to scan a whole codebase."
  },
  "0007.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "3",
   "vo": "Review uses adversarial agents, where some agents find problems and others try to disprove them."
  },
  "0008.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "4",
   "voGap": 1.0,
   "vo": "Our example is an insurance claims platform with four repositories: a Java service, a web portal, a Windows desktop app and an iOS app.",
   "voSay": "Our example is an insurance claims platform with four repositories: a Java service, a web portal, a Windows desktop app and an i O S app."
  },
  "0009.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": [
    {
     "x": 744,
     "y": 579,
     "w": 760,
     "h": 56
    }
   ],
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "4",
   "vo": "Devin works across all of them in one session."
  },
  "0010.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "5",
   "voGap": 1.0,
   "vo": "Before any work starts, Devin pulls in our context. That includes the AGENTS.md file in each repository, our runbooks, and tools like Slack that we connect through MCP.",
   "voSay": "Before any work starts, Devin pulls in our context. That includes the agents dot M D file in each repository, our runbooks, and tools like Slack that we connect through M C P."
  },
  "0011.png": {
   "hold": 0.5,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "5",
   "voSync": 6.17
  },
  "0012.png": {
   "hold": 0.5,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "5",
   "voSync": 7.26
  },
  "0013.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "6",
   "voGap": 1.0,
   "vo": "One rule in AGENTS.md is that every bug fix ships with a regression test. You'll see that rule come up throughout this video.",
   "voSay": "One rule in agents dot M D is that every bug fix ships with a regression test. You'll see that rule come up throughout this video."
  },
  "0014.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "6a",
   "voGap": 1.0,
   "vo": "Devin also writes our documentation."
  },
  "0015.png": {
   "hold": 1.2,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "6a",
   "vo": "DeepWiki generates architecture docs and diagrams for each repository, with links back to the source code.",
   "voSay": "Deep Wiki generates architecture docs and diagrams for each repository, with links back to the source code."
  },
  "0016.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "6b",
   "voGap": 1.0,
   "vo": "When I have a question, I ask in chat."
  },
  "0017.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "6b",
   "vo": "Here I ask how a claim moves from submission to approval, and Devin answers with links to the code."
  },
  "0018.png": {
   "hold": 1.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "6b",
   "voSync": 3.43
  },
  "0019.png": {
   "hold": 2.2,
   "scene": "ch1",
   "cursor": false,
   "waitVo": true
  },
  "0020.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": [
    {
     "x": 1076.1609375,
     "y": 363.00000000000006,
     "w": 76.621875,
     "h": 28.6
    }
   ],
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "7",
   "voGap": 1.0,
   "vo": "Our story starts in production, where a bug has slipped through. When our iOS app crashes, it sends a crash report to a webhook, and that webhook triggers Devin Oncall.",
   "voSay": "Our story starts in production, where a bug has slipped through. When our i O S app crashes, it sends a crash report to a webhook, and that webhook triggers Devin Oncall."
  },
  "0021.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "8",
   "voGap": 1.0,
   "vo": "Here's the alert."
  },
  "0022.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "8",
   "vo": "It has the stack trace and the breadcrumbs, which are the last steps the user took before the crash."
  },
  "0023.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "9",
   "voGap": 1.0,
   "vo": "Oncall starts a session on its own."
  },
  "0024.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "9",
   "vo": "Because this is an iOS bug, it runs on a macOS VM with the iOS Simulator.",
   "voSay": "Because this is an i O S bug, it runs on a macOS V M with the i O S Simulator."
  },
  "0025.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "10",
   "voGap": 1.0,
   "vo": "On its own computer, it follows the breadcrumbs in the Simulator, removes the last line item, and gets the same crash."
  },
  "0026.png": {
   "hold": 0.5,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "10",
   "voSync": 2.83
  },
  "0027.png": {
   "hold": 0.5,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "10",
   "voSync": 4.38
  },
  "0028.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "10",
   "vo": "The cause is a division by zero when an estimate has no line items."
  },
  "0029.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "11",
   "voGap": 1.0,
   "vo": "It fixes the root cause and adds three regression tests: two unit tests and a UI test that removes the last line item.",
   "voSay": "It fixes the root cause and adds three regression tests: two unit tests and a U I test that removes the last line item."
  },
  "0030.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "12",
   "voGap": 1.0,
   "vo": "Then it writes a report: what happened, how it reproduced it, what it changed, and how confident it is in the fix."
  },
  "0031.png": {
   "hold": 0.5,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "12",
   "voSync": 3.78
  },
  "0032.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "13",
   "voGap": 1.0,
   "vo": "The same flow works on Windows. Here an adjuster's desktop app crashes when approving a claim."
  },
  "0033.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "14",
   "voGap": 1.0,
   "vo": "Oncall runs this one on a Windows VM.",
   "voSay": "Oncall runs this one on a Windows V M."
  },
  "0034.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "14",
   "vo": "It reproduces the exception, finds a missing claim type in the approval rules, and adds unit tests and a UI test.",
   "voSay": "It reproduces the exception, finds a missing claim type in the approval rules, and adds unit tests and a U I test."
  },
  "0035.png": {
   "hold": 0.5,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "14",
   "voSync": 1.22
  },
  "0036.png": {
   "hold": 0.5,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "14",
   "voSync": 3.96
  },
  "0037.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "15",
   "voGap": 1.0,
   "vo": "I can review either fix wherever I work: in Devin's web app or in Devin Desktop."
  },
  "0038.png": {
   "hold": 0.5,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "15",
   "voSync": 3.8
  },
  "0039.png": {
   "hold": 2.2,
   "scene": "ch2",
   "cursor": false,
   "waitVo": true
  },
  "0040.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "16",
   "voGap": 1.0,
   "vo": "Next, testing. Our claims service has thin test coverage, so I ask Devin to write a test suite for it."
  },
  "0041.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "17",
   "voGap": 1.0,
   "vo": "Devin writes unit tests for the business rules, integration tests for the API, and an end-to-end test over HTTP.",
   "voSay": "Devin writes unit tests for the business rules, integration tests for the A P I, and an end-to-end test over HTTP."
  },
  "0042.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "18",
   "voGap": 1.0,
   "vo": "It runs the whole suite, reads any failures, fixes them, and runs it again until it passes."
  },
  "0043.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "19",
   "voGap": 1.0,
   "vo": "For apps with a UI, Devin tests in the running app on its own computer.",
   "voSay": "For apps with a U I, Devin tests in the running app on its own computer."
  },
  "0044.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "19",
   "vo": "On Windows it drives our desktop app, and on Linux it runs our Android app in an emulator."
  },
  "0045.png": {
   "hold": 0.5,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "19",
   "voSync": 1.97
  },
  "0046.png": {
   "hold": 0.5,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "19",
   "voSync": 3.38
  },
  "0047.png": {
   "hold": 0.5,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "19",
   "voSync": 4.23
  },
  "0048.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "20",
   "voGap": 1.0,
   "vo": "It attaches the recording and screenshots to the pull request, so the reviewer can see the test run without running it."
  },
  "0049.png": {
   "hold": 0.5,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "20",
   "voSync": 1.35
  },
  "0050.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "21",
   "voGap": 1.0,
   "vo": "Devin can run tests on Linux, macOS and Windows VMs, in the iOS Simulator and in Android emulators.",
   "voSay": "Devin can run tests on Linux, macOS and Windows V Ms, in the i O S Simulator and in Android emulators."
  },
  "0051.png": {
   "hold": 2.2,
   "scene": "ch3",
   "cursor": false,
   "waitVo": true
  },
  "0052.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "22",
   "voGap": 1.0,
   "vo": "Devin Review is a specialized review agent, and every pull request opens in it."
  },
  "0053.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "22",
   "vo": "As an admin, I choose which repositories it covers and how deep it goes. Here it's set to the highest review tier for all four."
  },
  "0054.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": [
    {
     "x": 1139.0500000000002,
     "y": 346.5,
     "w": 577.5,
     "h": 63.800000000000004
    }
   ],
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "23",
   "voGap": 1.0,
   "vo": "On this pull request, Review found an issue and labeled it with its CWE, the standard ID for the type of weakness.",
   "voSay": "On this pull request, Review found an issue and labeled it with its C W E, the standard ID for the type of weakness."
  },
  "0055.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "24",
   "voGap": 1.0,
   "vo": "I can ask Review about it in chat. Here I ask how a user could exploit it, and it explains with references to the code."
  },
  "0056.png": {
   "hold": 2.5,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "24",
   "voSync": 4.75
  },
  "0057.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "25",
   "voGap": 1.0,
   "vo": "This pull request also has a failing build. Devin reads the CI logs, reproduces the failure on a VM, fixes it, and adds a regression test.",
   "voSay": "This pull request also has a failing build. Devin reads the C I logs, reproduces the failure on a V M, fixes it, and adds a regression test."
  },
  "0058.png": {
   "hold": 0.5,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "25",
   "voSync": 4.34
  },
  "0059.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "26",
   "voGap": 1.0,
   "vo": "Then it reruns the build, and the checks pass."
  },
  "0060.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "27",
   "voGap": 1.0,
   "vo": "Large changes are easier to review in small steps. Here Devin splits a refactor into a stack of three pull requests, each one building on the last."
  },
  "0061.png": {
   "hold": 0.5,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "27",
   "voSync": 4.44
  },
  "0062.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "28",
   "voGap": 1.0,
   "vo": "Along the way, Devin adds comments to the code it changed and updates the module's README. Each pull request passes CI and has no open Review findings, so the team can merge them in order.",
   "voSay": "Along the way, Devin adds comments to the code it changed and updates the module's read-me. Each pull request passes C I and has no open Review findings, so the team can merge them in order."
  },
  "0063.png": {
   "hold": 0.5,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "28",
   "voSync": 3.41
  },
  "0064.png": {
   "hold": 0.5,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "28",
   "voSync": 4.55
  },
  "0065.png": {
   "hold": 2.2,
   "scene": "ch4",
   "cursor": false,
   "waitVo": true
  },
  "0066.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "29",
   "voGap": 1.0,
   "vo": "Devin Security is a specialized adversarial agent: it reads our code the way an attacker would. Some problems only show up across the whole codebase, so it scans the full repository, and it asks about our threat model first."
  },
  "0067.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "30",
   "voGap": 1.0,
   "vo": "Here it found a chained vulnerability."
  },
  "0068.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "30",
   "vo": "One service trusts a header that another service never checks, so a user can read other customers' claims."
  },
  "0069.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "31",
   "voGap": 1.0,
   "vo": "Security writes down its reasoning, then verifies that the attack works before it reports it."
  },
  "0070.png": {
   "hold": 0.5,
   "cursor": true,
   "hl": [
    {
     "x": 332.31171875,
     "y": -453.20000000000005,
     "w": 484.22343750000005,
     "h": 57.2
    }
   ],
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "31",
   "voSync": 1.59
  },
  "0071.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": [
    {
     "x": 1339.8859375000002,
     "y": 320.1,
     "w": 107.62812500000001,
     "h": 28.6
    }
   ],
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "32",
   "voGap": 1.0,
   "vo": "One click on Fix with Devin starts a session that fixes it, adds tests, and opens a pull request, which Review then checks like any other change."
  },
  "0072.png": {
   "hold": 0.5,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "32",
   "voSync": 1.75
  },
  "0073.png": {
   "hold": 0.5,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "32",
   "voSync": 4.38
  },
  "0074.png": {
   "hold": 0.5,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "32",
   "voSync": 5.54
  },
  "0075.png": {
   "hold": 2.2,
   "scene": "ch5",
   "cursor": false,
   "waitVo": true
  },
  "0076.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "33",
   "voGap": 1.0,
   "vo": "For bigger jobs, we use dynamic workflows. A workflow combines fixed steps, like running coverage tools, with steps where agents decide what to do."
  },
  "0077.png": {
   "hold": 0.5,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "33",
   "voSync": 5.77
  },
  "0078.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "34",
   "voGap": 1.0,
   "vo": "Here a workflow finds the packages with low coverage, then starts one agent for each package to write and run tests."
  },
  "0079.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "34",
   "vo": "Each agent has its own session and context."
  },
  "0080.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "35",
   "voGap": 1.0,
   "vo": "We manage all of these agents from one place. I can see every session, and the same agents run from Slack, Devin Desktop and the API.",
   "voSay": "We manage all of these agents from one place. I can see every session, and the same agents run from Slack, Devin Desktop and the A P I."
  },
  "0081.png": {
   "hold": 0.5,
   "cursor": true,
   "hl": [
    {
     "x": 457.46250000000003,
     "y": 767.8000000000001,
     "w": 86.625,
     "h": 50.6
    }
   ],
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "35",
   "voSync": 5.68
  },
  "0082.png": {
   "hold": 0.5,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "35",
   "voSync": 6.27
  },
  "0083.png": {
   "hold": 0.5,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "35",
   "voSync": 7.17
  },
  "0084.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "36",
   "voGap": 1.0,
   "vo": "As an admin, I control which repositories each agent can access, what they can spend, and I can see usage across the team."
  },
  "0085.png": {
   "hold": 0.5,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "36",
   "voSync": 3.41
  },
  "0086.png": {
   "hold": 0.5,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "36",
   "voSync": 5.59
  },
  "0087.png": {
   "hold": 0.6,
   "cursor": true,
   "hl": [
    {
     "x": 717.2,
     "y": 255.20000000000002,
     "w": 69.30000000000001,
     "h": 28.6
    }
   ],
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "37",
   "voGap": 1.0,
   "vo": "Devin opens pull requests, and a person on our team approves every merge."
  },
  "0088.png": {
   "hold": 1.5,
   "cursor": true,
   "hl": null,
   "hlDelay": 0.5,
   "capPos": "bottom",
   "line": "38",
   "voGap": 1.0,
   "vo": "So we went from a production alert to a tested fix, from thin coverage to a full test suite, and from a pull request to a reviewed, secure change, all with Devin's specialized agents."
  }
 },
 "noSubs": true
};
