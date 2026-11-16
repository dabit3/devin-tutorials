window.SPEC = {
 "title": "",
 "subtitle": "",
 "introHold": 0.2,
 "outro": "Devin, by Cognition",
 "outroSub": "devin.ai  \u00b7  cognition.com",
 "speed": 1,
 "cps": 48,
 "maxZoom": 1.4,
 "voSentGap": 0.4,
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
   "hl": null,
   "capPos": "bottom",
   "line": 2,
   "vo": "The demo goes through each stage in order. It starts with writing code and opening a pull request. Then it covers security, a failing build, a refactor, new tests, and production bugs."
  },
  "0002.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 3,
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
   "hl": null,
   "capPos": "bottom",
   "line": 6,
   "vo": "This video uses three. Devin Review uses adversarial agents. Some agents look for problems, and other agents try to prove each problem is wrong. Devin Security uses agentic MapReduce to scan a whole codebase. Devin Oncall is a site reliability agent with its own harness."
  },
  "0006.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 7,
   "vo": "Review can start before the code is finished. A developer is adding a fraud score to the claim page, and the pull request is still a draft."
  },
  "0007.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 8,
   "vo": "Devin Review does not review drafts automatically, so the developer starts a review from the pull request menu."
  },
  "0008.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 9,
   "vo": "The change is not finished yet. Devin Review flags one thing to look into: older claims can push a claim over the investigation threshold, because the code counts all of the customer's past claims."
  },
  "0009.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 10,
   "vo": "Its summary also checks access: the new fields are shown only to users who can see all claims, so customers never get them."
  },
  "0010.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 11,
   "vo": "The developer can ask questions in Review chat while writing the code. Here they ask how the score should count prior claims."
  },
  "0011.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 12,
   "vo": "Devin Review explains which claims to count: the same customer, only claims filed before this one, and only in the same year. It also suggests tests for the edge cases."
  },
  "0012.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 13,
   "vo": "The developer can also review in Devin Desktop. The same findings and chat are there, next to the local code."
  },
  "0013.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 14,
   "vo": "When a pull request is ready, Devin Review runs on its own. An admin picks the repositories, when the review runs, and the review effort. Here it covers all four repositories at Ultra effort."
  },
  "0014.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 15,
   "vo": "The admin also sets controls, such as a spend limit for each pull request."
  },
  "0015.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 15,
   "vo": "Devin Review reads the team's rule files, such as REVIEW.md and AGENTS.md, on every review.",
   "voSay": "Devin Review reads the team's rule files, such as review dot M D and agents dot M D, on every review."
  },
  "0016.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 16,
   "vo": "A developer opens a pull request on the claims service. It adds a payout export for the finance team. Devin Review starts with a summary of what the change does."
  },
  "0017.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 17,
   "vo": "Then it lists its findings by type and by severity."
  },
  "0018.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 18,
   "vo": "The most serious finding is that a signed-in customer can read the payout details of another customer. Devin labels it as broken access control, CWE-639, shows the lines of code, and recommends a fix."
  },
  "0019.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 19,
   "vo": "A second finding is a rounding bug. It is tagged as a repo rule, because AGENTS.md says money must be split with the team's own helper. This is how the team's coding standards are enforced.",
   "voSay": "A second finding is a rounding bug. It is tagged as a repo rule, because agents dot M D says money must be split with the team's own helper. This is how the team's coding standards are enforced."
  },
  "0020.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 20,
   "vo": "The reviewer asks which findings must be fixed before the merge. Devin Review names the blockers and links each one to the code and to the rule it breaks."
  },
  "0021.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 21,
   "vo": "Devin Security is a specialized agent that scans whole repositories for security problems. Before it scans, it asks a few questions to build a threat model, such as who the attackers are and how the service is reached."
  },
  "0022.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 22,
   "vo": "Here it finds a chain of problems. The claims service trusts the user ID and role in the request headers, and never checks that they came from the gateway. So anyone who can reach the service can claim to be an adjuster and read every customer's claims."
  },
  "0023.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 23,
   "vo": "Devin documents its reasoning step by step through the code. Then it verifies the finding on a running build: a request that claims to be an adjuster gets back every customer's claims. It labels the finding CWE-290 and marks it critical.",
   "voSay": "Devin documents its reasoning step by step through the code. Then it verifies the finding on a running build: a request that claims to be an adjuster gets back every customer's claims. It labels the finding CWE two ninety and marks it critical."
  },
  "0024.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 24,
   "vo": "One click on Fix with Devin starts a fix. Devin makes the service require a signed header from the gateway, adds tests, and opens a pull request. Devin Review reviews it like any other change."
  },
  "0025.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 25,
   "vo": "The payout pull request also fails in CI, the automatic build and test system. The developer asks Devin to fix it. This session runs on a macOS VM.",
   "voSay": "The payout pull request also fails in C I, the automatic build and test system. The developer asks Devin to fix it. This session runs on a macOS V M."
  },
  "0026.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 26,
   "vo": "Devin reads the CI logs, runs the failing test on its VM, and finds the root cause. The export rounded each installment, so one million cents became 999,999.",
   "voSay": "Devin reads the C I logs, runs the failing test on its V M, and finds the root cause. The export rounded each installment, so one million cents became nine hundred and ninety-nine thousand nine hundred and ninety-nine."
  },
  "0027.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 27,
   "vo": "It fixes the failure and the review findings in the same pull request. Each new regression test fails on the old code and passes on the fix."
  },
  "0028.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 28,
   "vo": "Before it pushes, Devin runs the full build and test suite. Then CI passes.",
   "voSay": "Before it pushes, Devin runs the full build and test suite. Then C I passes."
  },
  "0029.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 29,
   "vo": "Large refactors are hard to review as one pull request. Devin can split a refactor into stacked pull requests, where each one builds on the one below it."
  },
  "0030.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 30,
   "vo": "Here, Devin moves the payout math into one shared module in three pull requests. The first adds the new module, the second switches the callers, and the third deletes the old code."
  },
  "0031.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 31,
   "vo": "Each pull request is small, so Devin Review and the reviewer check one change at a time. Devin Review found no problems in any of the three."
  },
  "0032.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 32,
   "vo": "Devin can write a whole test suite. Here, the developer asks for tests of the claims API at three levels, and asks Devin to run them all.",
   "voSay": "Devin can write a whole test suite. Here, the developer asks for tests of the claims A P I at three levels, and asks Devin to run them all."
  },
  "0033.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 33,
   "vo": "Unit tests check one class at a time. Devin writes tests for the fraud rules and the coverage calculator, with a test on each side of every limit."
  },
  "0034.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 34,
   "vo": "Integration tests check the API with the database. They use MockMvc, which sends requests to the API inside the test, and the seed data.",
   "voSay": "Integration tests check the A P I with the database. They use MockMvc, which sends requests to the A P I inside the test, and the seed data."
  },
  "0035.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 35,
   "vo": "The end-to-end test starts the whole service and calls it over HTTP, as a customer and as an adjuster. It checks that a customer cannot read another customer's claim."
  },
  "0036.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 36,
   "vo": "Then Devin runs the whole suite with one command. The unit and integration tests pass, then the five end-to-end tests pass, and the build succeeds."
  },
  "0037.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 37,
   "vo": "Devin reports the count for each type: 31 unit, 19 integration, and 5 end-to-end tests."
  },
  "0038.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 37,
   "vo": "CI passes, and Devin Review finds no issues.",
   "voSay": "C I passes, and Devin Review finds no issues."
  },
  "0039.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 38,
   "vo": "Devin can also write tests from a requirement. Here, claims over ten thousand dollars must go to a supervisor. This session runs on a Windows VM.",
   "voSay": "Devin can also write tests from a requirement. Here, claims over ten thousand dollars must go to a supervisor. This session runs on a Windows V M."
  },
  "0040.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 39,
   "vo": "Devin finds that the code compared dollars to a limit in cents."
  },
  "0041.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 39,
   "vo": "It writes unit, integration, and UI tests, and all fourteen pass on Windows and in CI.",
   "voSay": "It writes unit, integration, and UI tests, and all fourteen pass on Windows and in C I."
  },
  "0042.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 40,
   "vo": "Some test work is too large for one session. For this, Devin writes a Dynamic Workflow, a Python script that runs many Devin agents."
  },
  "0043.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 41,
   "vo": "The workflow runs the same steps in the same order every time. Inside each step, an agent decides how to do the work."
  },
  "0044.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 42,
   "vo": "It starts one agent for each of the six packages. Each agent runs in its own session, with its own context. It writes unit and integration tests, runs them, and pushes a branch."
  },
  "0045.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 43,
   "vo": "A final step merges the branches, runs the full build, and opens one pull request with 170 new tests for the team to review."
  },
  "0046.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 44,
   "vo": "Some bugs still reach production. A Devin Oncall responder watches one source of alerts. This one gets crash alerts for the iOS app from a webhook.",
   "voSay": "Some bugs still reach production. A Devin Oncall responder watches one source of alerts. This one gets crash alerts for the i O S app from a webhook."
  },
  "0047.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 45,
   "vo": "The responder can use the team's tools through MCP, such as Slack, and it follows the team's runbook. It runs on a macOS VM with Xcode and the iOS Simulator.",
   "voSay": "The responder can use the team's tools through M C P, such as Slack, and it follows the team's runbook. It runs on a macOS V M with Xcode and the i O S Simulator."
  },
  "0048.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 46,
   "vo": "A crash monitor sends an alert, and Devin Oncall starts a session. The alert has the stack trace and the breadcrumbs, which are the last steps the user took."
  },
  "0049.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 47,
   "vo": "Devin follows the breadcrumbs in the iOS Simulator and gets the same crash. The cause is a division by zero when an estimate has no line items.",
   "voSay": "Devin follows the breadcrumbs in the i O S Simulator and gets the same crash. The cause is a division by zero when an estimate has no line items."
  },
  "0050.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 48,
   "vo": "It fixes the root cause and adds two regression tests. One is a unit test for an empty estimate, and one is a UI test that removes the last item."
  },
  "0051.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 49,
   "vo": "The report gives the root cause, the confidence, and the affected app versions, with the test logs and a patch attached."
  },
  "0052.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 50,
   "vo": "Here the alert comes from a Windows desktop app."
  },
  "0053.png": {
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
  "0054.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 51,
   "vo": "A developer opens the pull request from the patch. Like every other change, it goes through Devin Review, and a person approves the merge."
  },
  "0055.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 52,
   "vo": "To recap: Devin Review checked code while it was written and when each pull request opened, with the team's rules. Devin Security found and fixed a chained vulnerability."
  },
  "0056.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 53,
   "vo": "Devin fixed a failing build, split a refactor into small pull requests, wrote and ran a whole test suite, and fixed production crashes on macOS and Windows."
  },
  "0057.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 54,
   "vo": "This works on Linux, macOS, and Windows VMs, with the iOS Simulator and Android emulators.",
   "voSay": "This works on Linux, macOS, and Windows V Ms, with the i O S Simulator and Android emulators."
  },
  "0058.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "line": 55,
   "vo": "So the demo showed code quality at each stage of the life cycle: writing code, opening a pull request, security, a failing build, a refactor, testing, and production."
  }
 }
};
