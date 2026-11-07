# Builds shots/ and spec.js from the capture take in ../40-gartner-cqa/shots plus scene beats.
#   python3 assemble.py
import json, os, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', '40-gartner-cqa', 'shots')
B = {b['img']: b for b in json.load(open(os.path.join(SRC, 'beats.json')))}
# (image or scene:name, hold, vo)
ORDER = [
 ('scene:open', 8, "Software quality is not one step at the end of a sprint. It is decided in hundreds of small moments: when a bug is diagnosed, when code is reviewed, when a test is written, and when something breaks in production."),
 ('scene:open', 2, "Devin, from Cognition, takes part in every one of those moments. Not as a linter that flags problems, but as an engineer that investigates them, fixes them, proves the fix, and hands the result back to your team."),
 ('scene:loop', 8, "In this video we follow one product through the whole loop. Fairshare is a small expense-splitting app, with a TypeScript API, a web dashboard, and an iOS app."),
 ('scene:loop', 2, "A pull request is reviewed. A failing build is debugged and refactored. The change is tested like a user would test it. And a crash in production is investigated on a Mac. Review, debugging, refactoring and testing, with people in control of every merge."),
 ('scene:ch1', 4.5, "Chapter one: code review."),
 ('0013.png', 2.5, "In the organization's Review settings, review effort is a dial. Normal effort gives an in-depth review with great price-performance. Ultra is the most thorough review, at a higher cost."),
 ('0016.png', 2, "Here, Devin Review runs automatically on every push to this repository, at Ultra effort."),
 ('0019.png', 2, None),
 ('0020.png', 2, "Here is the pull request: a CSV export for receipts. It looks small. Devin Review starts with a plain-language analysis of what the change does."),
 ('0021.png', 2, "Then it lists what it found: three vulnerabilities and four bugs."),
 ('0026.png', 3, "The first vulnerability is critical. Any signed-in user can export someone else's receipts. Devin classifies it as broken access control, CWE-862, points to the exact lines, and recommends checking the receipt's owner against the signed-in user."),
 ('0029.png', 3, "Bugs get the same treatment. For one receipt, the exported shares add up to a cent less than the total, and Devin points to the existing helper the export should have used. Every finding is also posted on the GitHub pull request, where the team already works."),
 ('0060.png', 1.5, "When you want to understand a change before you approve it, you can ask."),
 ('0075.png', 1.5, "Here we ask how a CSV gets from the button to the download, and which finding should block the merge."),
 ('0085.png', 2.5, "Devin traces the request from the button, through the route, to the file it writes, with a link to every line it cites."),
 ('0095.png', 2.5, "Then it names the missing ownership check as the primary blocker, and the incorrect share math as the second, and lists what can wait for a follow-up."),
 ('0102.png', 2, None),
 ('scene:ch2', 4.5, "Chapter two: debugging and refactoring."),
 ('0200.png', 2, "Meanwhile, CI has failed. We hand it to Devin: read the failing logs, reproduce the failure, fix the root cause, address the review findings, and refactor the export to stream the file instead of writing it to disk."),
 ('0254.png', 2, "Devin reads the failing check, reproduces it locally, and works through the fixes: ownership checks, shares that add back up to the total, CSV escaping, and a 404 instead of a 500 for unknown receipts."),
 ('0256.png', 2.5, "Each fix comes with a regression test, and Devin runs lint, the type checker and the test suite before it pushes."),
 ('0753.png', 3, "When it is done, it reports back. The original CI failure was a type error: the export route passed a receipt that could be undefined straight to the CSV writer, and a share test failed from rounding. Devin reproduced both locally before fixing them."),
 ('0752.png', 2.5, "It also proposes a setup for the repository, so future sessions start with dependencies installed and know how to run lint and tests."),
 ('0709.png', 2, "The push triggers a second review. All seven earlier findings are resolved, and Devin Review catches one new edge case: two participants with the same name would overwrite each other's shares."),
 ('0710.png', 1, "We pass it back to the same session."),
 ('0737.png', 3, "Devin writes a regression test that fails on the old code, fixes the export, and pushes. Lint, the type checker and all 24 tests pass, and CI is green."),
 ('0754.png', 3, "While it worked, Devin also noticed a problem outside its task: the auth middleware accepted unsigned tokens. It flagged it instead of quietly changing it."),
 ('0817.png', 1.5, "So we ask for the fix."),
 ('0831.png', 3.5, "Devin now verifies every token's signature, and returns a 401 for unsigned, forged, tampered and expired tokens. Six new rejection tests fail on the old code, and all 31 tests pass. It even raises the next question for a person: should the server refuse to start in production without a real secret?"),
 ('0832.png', 3, "Devin Review checks that push too. The pull request now shows zero open vulnerabilities and zero open bugs, with every finding resolved."),
 ('scene:ch3', 4.5, "Chapter three: testing like a user."),
 ('0751.png', 2.5, "Unit tests prove the logic. Devin also tests the change the way a user would: it starts the app, signs in as a demo user, and clicks Export CSV."),
 ('0755.png', 2.5, "The browser test is recorded, so a reviewer can replay exactly what Devin clicked and checked."),
 ('0757.png', 3, "It opens the downloaded file and checks the numbers. The dinner receipt's three shares now add back up to its exact total, to the cent. It posts the results, with screenshots, to the pull request, so the reviewer sees evidence, not just a claim."),
 ('scene:ch4', 4.5, "Chapter four: production debugging on macOS."),
 ('0103.png', 2, "Not every bug is caught before release. A crash monitor reports a new fatal crash in the iOS app: hundreds of crashes an hour, a division by zero."),
 ('0120.png', 2, "In Oncall, we create a responder for these alerts. It triggers from a webhook."),
 ('0125.png', 2, "It follows a runbook: reproduce the crash, fix the root cause, add tests, and open a pull request with evidence."),
 ('0133.png', 2, "And it investigates on a macOS machine, with Xcode and the iOS Simulator."),
 ('0113.png', 2, "We choose the Alerts responder type and Ultra investigation mode."),
 ('0140.png', 2, "The alert arrives, and Oncall opens an investigation."),
 ('0147.png', 3, "The triage agent reads the stack trace and the breadcrumbs and writes up the likely cause. It also reports that it could not reach the iOS repository yet, so it does not guess at a fix."),
 ('0597.png', 2, "So we escalate: a Devin session on macOS, with the iOS repository attached, and the alert and runbook pasted in."),
 ('0599.png', 2.5, "Devin finds the crashing code first. Removing a participant could leave a receipt with nobody on it, and the split view then divided the total by zero."),
 ('0601.png', 3, "Then it proves it. It builds the app, opens the same receipt in the iOS Simulator, removes Maya, removes Omar, and the app crashes, exactly as the alert described."),
 ('0603.png', 2.5, "It attaches a debugger to the crashed process and confirms the division by zero in SplitCalculator."),
 ('0647.png', 2.5, "The fix goes where the bad state starts: a receipt can no longer lose its last participant, the Remove button is disabled for that last person, and the calculator no longer traps on empty input."),
 ('0640.png', 3, "Devin adds unit tests and a UI test for the exact breadcrumb flow. Against the old code, they fail with the same crash. On the fix, the full simulator suite passes: six unit tests and two UI tests."),
 ('0656.png', 2.5, "On the fixed build, the same steps leave one person on the receipt, and the app keeps running."),
 ('0652.png', 2.5, "Devin opens a pull request with the reproduction steps, before and after screenshots, the test results, and a recording of the fixed flow."),
 ('0665.png', 2.5, "The recording plays right in the session."),
 ('0741.png', 3, "Its report covers the root cause, the fix, and how it reproduced the crash, with links to the changed code."),
 ('0610.png', 2.5, "It even flags a separate rounding issue it noticed along the way, without folding it into this fix."),
 ('0739.png', 3, "The pull request is ready, with Devin Review one click away, and the merge decision stays with a person."),
 ('scene:close', 10, "Review on every push. Debugging from the failing log to the root cause. Refactoring, with tests that lock in the behavior. Testing in a real browser and a real simulator. And a person approving every merge. That is how Devin keeps code quality high across the whole development lifecycle."),
]
SAY = [('CWE-862', 'CWE eight six two'), ('404', 'four zero four'), ('500', 'five hundred'), ('all 24', 'all twenty four'), ('401', 'four zero one'), ('all 31', 'all thirty one'), ("token's", 'token'), ('Oncall', 'On call'), ('lifecycle', 'life cycle')]
out = os.path.join(HERE, 'shots'); shutil.rmtree(out, ignore_errors=True); os.makedirs(out)
beats, edit = [], {}
for i, (src, hold, vo) in enumerate(ORDER):
    new = f'{i:04d}.png'
    if src.startswith('scene:'):
        shutil.copy(os.path.join(SRC, '0000.png'), os.path.join(out, new)); beats.append({'img': new, 'cur': {'x': 1300, 'y': 760}, 'scene': src[6:]})
        e = {'scene': src[6:]}
    else:
        b = dict(B[src]); shutil.copy(os.path.join(SRC, src), os.path.join(out, new))
        for k in ('kind', 'at', 'mark', 'n', 'paste', 'chars'): b.pop(k, None)
        b.update(img=new, src=src); beats.append(b); e = {}
    e.update(hold=hold, cursor=False, hl=None, capPos='bottom')
    if vo:
        e['vo'] = vo; say = vo
        for a, z in SAY: say = say.replace(a, z)
        if say != vo: e['voSay'] = say
    edit[new] = e
json.dump(beats, open(os.path.join(out, 'beats.json'), 'w'), indent=1)
spec = {'title': 'Code Quality Assurance with Devin', 'subtitle': 'Debugging, refactoring, testing and code review', 'outro': 'Devin, by Cognition',
        'outroSub': 'devin.ai  ·  cognition.com', 'speed': 1, 'cps': 48, 'maxZoom': 1.4, 'voSentGap': 1.1, 'pace': 1.6, 'edit': edit}
open(os.path.join(HERE, 'spec.js'), 'w').write('window.SPEC = ' + json.dumps(spec, indent=1) + ';\n')
with open(os.path.join(HERE, 'voice-script.md'), 'w') as f:
    f.write('# Code Quality Assurance with Devin: narration script\n\nRecord one paragraph per line; each paragraph matches one shot in the video.\n\n')
    for src, _, vo in ORDER:
        if vo: f.write(vo + '\n\n')
print(len(beats), 'beats;', sum(len(v.split()) for _, _, v in ORDER if v), 'words')
