# Voice script: Devin Security Swarm

Voice: ElevenLabs `T8iHhGIWPm2GVYpQD1Am` (`17-security-swarm-nader.mp4`). Generated as one continuous take with `python3 _kit/tools/vo_onetake.py 17-security-swarm T8iHhGIWPm2GVYpQD1Am` from the `vo` lines in spec.js, then cut between sentences, at ElevenLabs default voice settings. Each line is a whole sentence.

| Shot | Narration |
|---|---|
| 0001 | This is Devin Security Swarm. It reads your code like an attacker, proves each bug is real, and fixes it. |
| 0002 | First, let Devin write a scan profile for your repo. |
| 0006 | Devin opens a session, looks at your repos, and asks which one the profile is for. |
| 0009 | It drafts what to look for and how to validate it, then lists a few optional settings. |
| 0010 | Accept the defaults and add one triage rule: any auth bypass or cross-user leak is always critical. |
| 0045 | Devin shows the change as a diff, and you approve it. |
| 0049 | Now open the profile it created. |
| 0053 | The scan model tells the scanner what to hunt for: auth bypass, access between users, and file paths, with the exact files to check. |
| 0054 | Triage guidance decides how findings are ranked, so our rule makes these always critical. |
| 0055 | Sandbox validation tells Devin how to start the API, which test users to log in as, and to prove every finding with curl. |
| 0056 | A summary report is optional, and this profile leaves it off. |
| 0060 | Under Advanced, it skips tests and seed scripts, and validates every finding from medium up. |
| 0063 | Now start a scan, set it up manually on a single repo, and choose the new profile. |
| 0081 | Turn on Interactive mode, so you review the threat model before it scans. |
| 0084 | Then run the scan. |
| 0091 | Before it scans, Devin proposes a scan model of rules written for this exact code. |
| 0092 | It already suspects the forwarded user header, boards loaded by ID with no owner check, and file paths built from user input. |
| 0096 | This looks right, so start scanning. |
| 0115 | Findings stream in, grouped by severity. |
| 0124 | Then Devin tries to exploit each one in a sandbox. |
| 0145 | Duplicates and false positives are dismissed, which leaves eleven open findings, and three of them are chained across files. |
| 0151 | Open the worst one. |
| 0153 | It's critical, with high confidence, because anyone who sends one header becomes the admin, with no password. |
| 0154 | Here's the attack path, step by step. |
| 0155 | And here are the exact lines in auth.js that make it possible. |
| 0156 | Devin ran the exploit in a sandbox, and it worked, so the finding is confirmed. |
| 0157 | These are the real requests that proved it. |
| 0158 | Now assign it to Devin. |
| 0161 | A fix session starts right away, so open it. |
| 0164 | Devin gets the finding and its evidence, and checks that the bug is still real on main. |
| 0165 | An open pull request from an earlier run already fixes it, so Devin takes it over, reruns the tests, and checks that the header alone is now rejected. |
| 0169 | Back on the finding, the fix PR is attached. |
| 0171 | A real exploit chain, found, proven, and fixed. |
| outro | Security Swarm. Real exploits, found, proven, and fixed. |
