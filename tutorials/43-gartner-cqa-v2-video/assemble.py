# Builds shots/, spec.js and voice-script.md from the v2 capture take in ../42-gartner-cqa-v2/shots.
#   python3 assemble.py
import json, os, shutil
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', '42-gartner-cqa-v2', 'shots')
B = {b['img']: b for b in json.load(open(os.path.join(SRC, 'beats.json')))}
ONCALL = json.load(open(os.path.join(HERE, 'oncall-shots.json'))) if os.path.exists(os.path.join(HERE, 'oncall-shots.json')) else []
ORDER = [
 ('scene:open', 6, "This video covers Code Quality Assurance with Devin. It shows how Devin helps teams debug, refactor, test, and review code at each step of software development."),
 ('scene:agents', 3, "Devin is an AI software engineer made by Cognition. Devin also includes specialized agents. A specialized agent is an agent that is built for one job."),
 ('scene:agents+', 3, "This video uses two of them. Devin Review is a specialized agent for code review. Devin Oncall is a specialized agent for site reliability engineering, which is the work of keeping production systems running."),
 ('scene:envs', 3, "Every Devin session runs on its own virtual machine, or VM. A VM is a full computer in the cloud. Teams can choose Linux, macOS, or Windows VMs. On macOS, Devin can use Xcode and the iOS Simulator. Devin can also run Android emulators."),
 ('scene:envs+', 3, "Everything in this video works the same way on all of these VMs. Most of this demo uses macOS. One part uses Windows for a desktop app."),
 ('scene:example', 4, "Our example is the claims platform of an insurance company. It has four repositories: a Java claims service that calculates and pays claims, a web portal where customers file claims, a Windows desktop app that adjusters use to approve claims, and an iOS app that field adjusters use to file damage reports."),
 ('scene:example+', 3, "The team has strict rules. A person reviews every change. Every bug fix needs a regression test, which is a test that proves the bug stays fixed. Only people merge pull requests."),
 ('scene:ch1', 4, "Code review."),
 ('scene:adversarial', 4, "Code review is the first quality check on every change. Devin Review is a specialized code review agent. It uses adversarial agents. Some agents look for problems, and other agents try to prove each finding wrong. Devin Review reports only the findings that hold up."),
 ('0016.png', 2.5, "An admin turns on automatic review in the Review settings. The admin chooses the repositories, when the review runs, and the review effort. Normal effort balances cost and depth. Ultra effort gives the most complete review, at a higher cost."),
 ('0097.png', 2.5, "Here, Devin Review covers all four repositories, at Ultra effort."),
 ('scene:multirepo', 3, "It reviews the pull requests from each repository with the same rules, and it shows them in one place."),
 ('0098.png', 2.5, "A developer opens a pull request on the claims service. It adds a payout export for the finance team. Devin Review starts with a short summary of what the change does."),
 ('0099.png', 2, "Then it lists its findings by type and by severity."),
 ('0102.png', 3, "The most serious finding is that a signed-in customer can read the payout details of another customer. Devin labels it as broken access control, CWE-862. It shows the lines of code and recommends an ownership check."),
 ('0105.png', 2.5, "A second finding is a rounding bug. The installments do not add up to the claim total."),
 ('0162.png', 2, "Reviewers can ask questions in Review chat. Here the reviewer asks which findings must be fixed before the merge."),
 ('0190.png', 3, "Devin names the blockers and links to the code."),
 ('1136.png', 3, "From my work with engineering teams, quality checks work best at every step of development, because a problem costs less to fix when you find it early. So teams also use Devin Review while a change is still being written."),
 ('1139.png', 2.5, "Devin Review does not review draft pull requests automatically. Here the developer starts a review on a draft. Devin Review reviews it now, and again on every push."),
 ('1199.png', 3, "The change is not finished, but Devin Review already finds two problems. The critical one is that finance users can see the fraud score, which only adjusters should see."),
 ('1202.png', 2.5, "The second is a bug. The prior claims count includes claims filed later, so an earlier claim can get a higher score than it should."),
 ('1258.png', 2, "The developer can also use Review chat to learn about the code while writing it. Here the developer asks how the fraud score uses the prior claims count. Devin reads the code to answer."),
 ('1266.png', 3, "Devin explains which claims to count, and it points out the same access problem. The developer learns this before the change is done, when it is cheapest to fix."),
 ('scene:ch2', 4, "Debugging a failing build."),
 ('0329.png', 2.5, "CI, the automatic build and test system, fails on the same pull request. The developer asks Devin to fix it. This session runs on a macOS VM."),
 ('0340.png', 2.5, "Devin reads the CI logs, reproduces the failure on its VM, and finds the root cause."),
 ('0346.png', 3, "It fixes the failure and the review findings: an ownership check, installments that add up to the exact total, safe CSV values, and a 404 for an unknown claim. It adds a regression test for each bug."),
 ('0347.png', 3, "Before it pushes the code, Devin runs the full build and test suite. Then CI passes."),
 ('scene:ch3', 4, "Refactoring."),
 ('scene:stack', 4, "A refactor changes the structure of code but not its behavior. A large refactor is hard to review as one pull request. Devin can split it into stacked pull requests. Each pull request targets the branch of the one below it, so a reviewer reads one small change at a time."),
 ('0521.png', 3, "Here, Devin moves the payout calculations into one shared module, in three stacked pull requests: the new module, the change to the callers, and the removal of the old code. Devin Review shows where each pull request sits in the stack."),
 ('scene:ch4', 4, "Test generation."),
 ('scene:tests', 4, "Devin writes tests that follow the existing test patterns of the team. In this example, it writes three types of tests: unit tests, integration tests, and end-to-end tests that use the app as a person does."),
 ('0700.png', 2.5, "This session runs on a Windows VM. Adjusters report that a twenty thousand dollar claim was approved without a supervisor. The approval limit is ten thousand dollars."),
 ('0724.png', 3, "Devin finds the root cause. The code compared the claim amount in dollars to a limit stored in cents."),
 ('0726.png', 3, "It adds unit tests below, at, and above the limit, an integration test for the claim queue, and an end-to-end test that opens the Windows app, approves the claim, and checks that it goes to a supervisor."),
 ('0728.png', 2.5, "It also records a check of the app, so a reviewer can watch each step."),
 ('0720.png', 2.5, "All fourteen tests pass on Windows and in CI, and Devin opens a pull request."),
 ('scene:ch5', 4, "Testing at scale."),
 ('scene:dwscript', 5, "Some test work is large and repetitive. An example is to add tests to every package in a service. For this work, Devin can write a Dynamic Workflow. A Dynamic Workflow is a Python script that runs many Devin agents."),
 ('scene:dwscript+', 3, "The workflow is deterministic. It runs the same steps in the same order every time, and each step returns structured results. In each step, an agent decides how to write the tests."),
 ('0951.png', 3, "Here is the workflow. The list of packages is in the code: one agent for each of the six packages in the claims service."),
 ('0949.png', 2.5, "Each agent writes unit tests and integration tests for its package, runs them, and pushes a branch."),
 ('0953.png', 3, "A final step merges the branches, runs the full build, and opens one pull request. It adds one hundred twenty four unit tests and forty six integration tests, and all of the tests pass."),
 ('scene:dw', 3, "A normal Devin session is not deterministic. Devin decides the next step while it works. Use a session for one task. Use a Dynamic Workflow when the steps must be the same every time."),
 ('scene:ch6', 4, "Production debugging."),
 ('0958.png', 2, "Devin Oncall is the specialized agent for site reliability engineering. You set up a responder, which watches one source of alerts."),
 ('0976.png', 2.5, "This responder gets crash alerts for the iOS app from a webhook."),
 ('0988.png', 2.5, "It follows the runbook of the team: reproduce the crash, fix the root cause, add tests, and open a pull request."),
 ('0996.png', 2.5, "And it runs on a macOS VM, with Xcode and the iOS Simulator."),
 ('1003.png', 2, "A crash monitor reports a new crash in the iOS app for field adjusters. The responder starts an investigation."),
] + [tuple(x) for x in ONCALL] + [
 ('scene:close', 9, "To recap: Devin Review checks the pull requests in every repository. Devin finds root causes from CI logs and production alerts, splits large refactors into small stacked pull requests, and writes unit, integration, and end-to-end tests. Dynamic Workflows run large test jobs the same way every time. All of this works on Linux, macOS, and Windows VMs, with the iOS Simulator and Android emulators. A person approves every merge."),
]
SAY = [('CWE-862', 'CWE eight six two'), ('404', 'four oh four'), ('CI,', 'C I,'), ('CI ', 'C I '), ('CI.', 'C I.'), ('VMs', 'V Ms'), ('VM', 'V M'), ('iOS', 'i O S')]
out = os.path.join(HERE, 'shots'); shutil.rmtree(out, ignore_errors=True); os.makedirs(out)
beats, edit = [], {}
for i, (src, hold, vo) in enumerate(ORDER):
    new = f'{i:04d}.png'
    if src.startswith('scene:'):
        name = src[6:].rstrip('+')
        shutil.copy(os.path.join(SRC, '0000.png'), os.path.join(out, new)); beats.append({'img': new, 'cur': {'x': 1300, 'y': 760}, 'scene': name})
        e = {'scene': name}
        if src.endswith('+'): e['sceneCont'] = True
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
spec = {'title': 'Code Quality Assurance with Devin', 'subtitle': 'Debugging, refactoring, testing, and code review', 'outro': 'Devin, by Cognition',
        'outroSub': 'devin.ai  ·  cognition.com', 'speed': 1, 'cps': 48, 'maxZoom': 1.4, 'voSentGap': 1.0, 'pace': 1.5, 'edit': edit}
if os.environ.get('NO_CAPTIONS'): spec['noSubs'] = True
open(os.path.join(HERE, 'spec.js'), 'w').write('window.SPEC = ' + json.dumps(spec, indent=1) + ';\n')
with open(os.path.join(HERE, 'voice-script.md'), 'w') as f:
    f.write('# Code Quality Assurance with Devin: narration script\n\nRecord one paragraph per line; each paragraph matches one shot in the video.\n\n')
    for src, _, vo in ORDER:
        if vo: f.write(vo + '\n\n')
print(len(beats), 'beats;', sum(len(v.split()) for _, _, v in ORDER if v), 'words')
