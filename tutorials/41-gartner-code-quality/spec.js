window.SPEC = {
 "title": "Code Quality Assurance with Devin",
 "subtitle": "Debugging, refactoring, testing and code review",
 "outro": "Devin, by Cognition",
 "outroSub": "devin.ai  \u00b7  cognition.com",
 "speed": 1,
 "cps": 48,
 "maxZoom": 1.4,
 "voSentGap": 1.1,
 "pace": 1.6,
 "edit": {
  "0000.png": {
   "scene": "open",
   "hold": 8,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Software quality is not one step at the end of a sprint. It is decided in hundreds of small moments: when a bug is diagnosed, when code is reviewed, when a test is written, and when something breaks in production."
  },
  "0001.png": {
   "scene": "open",
   "hold": 2,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Devin, from Cognition, takes part in every one of those moments. Not as a linter that flags problems, but as an engineer that investigates them, fixes them, proves the fix, and hands the result back to your team."
  },
  "0002.png": {
   "scene": "loop",
   "hold": 8,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "In this video we follow one product through the whole loop. Fairshare is a small expense-splitting app, with a TypeScript API, a web dashboard, and an iOS app."
  },
  "0003.png": {
   "scene": "loop",
   "hold": 2,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "A pull request is reviewed. A failing build is debugged and refactored. The change is tested like a user would test it. And a crash in production is investigated on a Mac. Review, debugging, refactoring and testing, with people in control of every merge."
  },
  "0004.png": {
   "scene": "ch1",
   "hold": 4.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Chapter one: code review."
  },
  "0005.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "In the organization's Review settings, review effort is a dial. Normal effort gives an in-depth review with great price-performance. Ultra is the most thorough review, at a higher cost."
  },
  "0006.png": {
   "hold": 2,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Here, Devin Review runs automatically on every push to this repository, at Ultra effort."
  },
  "0007.png": {
   "hold": 2,
   "cursor": false,
   "hl": null,
   "capPos": "bottom"
  },
  "0008.png": {
   "hold": 2,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Here is the pull request: a CSV export for receipts. It looks small. Devin Review starts with a plain-language analysis of what the change does."
  },
  "0009.png": {
   "hold": 2,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Then it lists what it found: three vulnerabilities and four bugs."
  },
  "0010.png": {
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "The first vulnerability is critical. Any signed-in user can export someone else's receipts. Devin classifies it as broken access control, CWE-862, points to the exact lines, and recommends checking the receipt's owner against the signed-in user.",
   "voSay": "The first vulnerability is critical. Any signed-in user can export someone else's receipts. Devin classifies it as broken access control, CWE eight six two, points to the exact lines, and recommends checking the receipt's owner against the signed-in user."
  },
  "0011.png": {
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Bugs get the same treatment. For one receipt, the exported shares add up to a cent less than the total, and Devin points to the existing helper the export should have used. Every finding is also posted on the GitHub pull request, where the team already works."
  },
  "0012.png": {
   "hold": 1.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "When you want to understand a change before you approve it, you can ask."
  },
  "0013.png": {
   "hold": 1.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Here we ask how a CSV gets from the button to the download, and which finding should block the merge."
  },
  "0014.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Devin traces the request from the button, through the route, to the file it writes, with a link to every line it cites."
  },
  "0015.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Then it names the missing ownership check as the primary blocker, and the incorrect share math as the second, and lists what can wait for a follow-up."
  },
  "0016.png": {
   "hold": 2,
   "cursor": false,
   "hl": null,
   "capPos": "bottom"
  },
  "0017.png": {
   "scene": "ch2",
   "hold": 4.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Chapter two: debugging and refactoring."
  },
  "0018.png": {
   "hold": 2,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Meanwhile, CI has failed. We hand it to Devin: read the failing logs, reproduce the failure, fix the root cause, address the review findings, and refactor the export to stream the file instead of writing it to disk."
  },
  "0019.png": {
   "hold": 2,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Devin reads the failing check, reproduces it locally, and works through the fixes: ownership checks, shares that add back up to the total, CSV escaping, and a 404 instead of a 500 for unknown receipts.",
   "voSay": "Devin reads the failing check, reproduces it locally, and works through the fixes: ownership checks, shares that add back up to the total, CSV escaping, and a four zero four instead of a five hundred for unknown receipts."
  },
  "0020.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Each fix comes with a regression test, and Devin runs lint, the type checker and the test suite before it pushes."
  },
  "0021.png": {
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "When it is done, it reports back. The original CI failure was a type error: the export route passed a receipt that could be undefined straight to the CSV writer, and a share test failed from rounding. Devin reproduced both locally before fixing them."
  },
  "0022.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "It also proposes a setup for the repository, so future sessions start with dependencies installed and know how to run lint and tests."
  },
  "0023.png": {
   "hold": 2,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "The push triggers a second review. All seven earlier findings are resolved, and Devin Review catches one new edge case: two participants with the same name would overwrite each other's shares."
  },
  "0024.png": {
   "hold": 1,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "We pass it back to the same session."
  },
  "0025.png": {
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Devin writes a regression test that fails on the old code, fixes the export, and pushes. Lint, the type checker and all 24 tests pass, and CI is green.",
   "voSay": "Devin writes a regression test that fails on the old code, fixes the export, and pushes. Lint, the type checker and all twenty four tests pass, and CI is green."
  },
  "0026.png": {
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "While it worked, Devin also noticed a problem outside its task: the auth middleware accepted unsigned tokens. It flagged it instead of quietly changing it."
  },
  "0027.png": {
   "hold": 1.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "So we ask for the fix."
  },
  "0028.png": {
   "hold": 3.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Devin now verifies every token's signature, and returns a 401 for unsigned, forged, tampered and expired tokens. Six new rejection tests fail on the old code, and all 31 tests pass. It even raises the next question for a person: should the server refuse to start in production without a real secret?",
   "voSay": "Devin now verifies every token signature, and returns a four zero one for unsigned, forged, tampered and expired tokens. Six new rejection tests fail on the old code, and all thirty one tests pass. It even raises the next question for a person: should the server refuse to start in production without a real secret?"
  },
  "0029.png": {
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Devin Review checks that push too. The pull request now shows zero open vulnerabilities and zero open bugs, with every finding resolved."
  },
  "0030.png": {
   "scene": "ch3",
   "hold": 4.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Chapter three: testing like a user."
  },
  "0031.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Unit tests prove the logic. Devin also tests the change the way a user would: it starts the app, signs in as a demo user, and clicks Export CSV."
  },
  "0032.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "The browser test is recorded, so a reviewer can replay exactly what Devin clicked and checked."
  },
  "0033.png": {
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "It opens the downloaded file and checks the numbers. The dinner receipt's three shares now add back up to its exact total, to the cent. It posts the results, with screenshots, to the pull request, so the reviewer sees evidence, not just a claim."
  },
  "0034.png": {
   "scene": "ch4",
   "hold": 4.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Chapter four: production debugging on macOS."
  },
  "0035.png": {
   "hold": 2,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Not every bug is caught before release. A crash monitor reports a new fatal crash in the iOS app: hundreds of crashes an hour, a division by zero."
  },
  "0036.png": {
   "hold": 2,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "In Oncall, we create a responder for these alerts. It triggers from a webhook.",
   "voSay": "In On call, we create a responder for these alerts. It triggers from a webhook."
  },
  "0037.png": {
   "hold": 2,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "It follows a runbook: reproduce the crash, fix the root cause, add tests, and open a pull request with evidence."
  },
  "0038.png": {
   "hold": 2,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "And it investigates on a macOS machine, with Xcode and the iOS Simulator."
  },
  "0039.png": {
   "hold": 2,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "We choose the Alerts responder type and Ultra investigation mode."
  },
  "0040.png": {
   "hold": 2,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "The alert arrives, and Oncall opens an investigation.",
   "voSay": "The alert arrives, and On call opens an investigation."
  },
  "0041.png": {
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "The triage agent reads the stack trace and the breadcrumbs and writes up the likely cause. It also reports that it could not reach the iOS repository yet, so it does not guess at a fix."
  },
  "0042.png": {
   "hold": 2,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "So we escalate: a Devin session on macOS, with the iOS repository attached, and the alert and runbook pasted in."
  },
  "0043.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Devin finds the crashing code first. Removing a participant could leave a receipt with nobody on it, and the split view then divided the total by zero."
  },
  "0044.png": {
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Then it proves it. It builds the app, opens the same receipt in the iOS Simulator, removes Maya, removes Omar, and the app crashes, exactly as the alert described."
  },
  "0045.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "It attaches a debugger to the crashed process and confirms the division by zero in SplitCalculator."
  },
  "0046.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "The fix goes where the bad state starts: a receipt can no longer lose its last participant, the Remove button is disabled for that last person, and the calculator no longer traps on empty input."
  },
  "0047.png": {
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Devin adds unit tests and a UI test for the exact breadcrumb flow. Against the old code, they fail with the same crash. On the fix, the full simulator suite passes: six unit tests and two UI tests."
  },
  "0048.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "On the fixed build, the same steps leave one person on the receipt, and the app keeps running."
  },
  "0049.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Devin opens a pull request with the reproduction steps, before and after screenshots, the test results, and a recording of the fixed flow."
  },
  "0050.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "The recording plays right in the session."
  },
  "0051.png": {
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Its report covers the root cause, the fix, and how it reproduced the crash, with links to the changed code."
  },
  "0052.png": {
   "hold": 2.5,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "It even flags a separate rounding issue it noticed along the way, without folding it into this fix."
  },
  "0053.png": {
   "hold": 3,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "The pull request is ready, with Devin Review one click away, and the merge decision stays with a person."
  },
  "0054.png": {
   "scene": "close",
   "hold": 10,
   "cursor": false,
   "hl": null,
   "capPos": "bottom",
   "vo": "Review on every push. Debugging from the failing log to the root cause. Refactoring, with tests that lock in the behavior. Testing in a real browser and a real simulator. And a person approving every merge. That is how Devin keeps code quality high across the whole development lifecycle.",
   "voSay": "Review on every push. Debugging from the failing log to the root cause. Refactoring, with tests that lock in the behavior. Testing in a real browser and a real simulator. And a person approving every merge. That is how Devin keeps code quality high across the whole development life cycle."
  }
 }
};
