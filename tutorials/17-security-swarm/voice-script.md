# Voice script: Devin Security Swarm

Voice: ElevenLabs `T8iHhGIWPm2GVYpQD1Am` (`17-security-swarm-nader.mp4`). Generated as one continuous take with `python3 _kit/tools/vo_onetake.py 17-security-swarm T8iHhGIWPm2GVYpQD1Am` from the `vo` lines in spec.js, then cut between sentences, at ElevenLabs default voice settings. Each line is a whole sentence.

| Shot | Narration |
|---|---|
| 0001 | Devin Security Swarm reads your code like an attacker, proves each bug is real in a sandbox, and then fixes it. |
| 0002 | Start with a scan profile, and let Devin write it. |
| 0007 | Devin opens a session and asks what the profile should scan, and what matters most. |
| 0010 | Answer in a few sentences: the repo, what to focus on, what to skip, and that any auth bypass or cross-user leak is always critical. |
| 0012 | Devin reads the repo, so the profile matches the real routes and scripts. |
| 0030 | It creates the profile, and even notices that the latest commit on main reverted an earlier auth fix. |
| 0031 | Keep the optional settings on their defaults. |
| 0036 | The profile is ready. |
| 0038 | Now open it. |
| 0042 | The scan model tells the scanner what to hunt for, with the exact files and functions to check. |
| 0043 | Triage guidance ranks the findings, so our rule makes these always critical. |
| 0044 | Sandbox validation tells Devin how to start the API, which test users to log in as, and to prove every finding with curl. |
| 0045 | A summary report is optional, and this profile leaves it off. |
| 0048 | Under Advanced, it skips tests and seed scripts, and validates every severity. |
| 0051 | Now start a scan. |
| 0053 | Set it up manually. |
| 0057 | Pick the repo. |
| 0064 | Then choose the new profile. |
| 0068 | Turn on Interactive mode, so you can review the threat model before it scans. |
| 0071 | Then run the scan. |
| 0074 | Devin reads the code and drafts a threat model first. |
| 0098 | Before it scans, Devin proposes a scan model, with rules written for this exact code. |
| 0099 | It flags the forwarded user header, which is trusted before any token. |
| 0100 | It flags boards loaded by ID, with no owner check. |
| 0101 | And it flags file paths built from the request. |
| 0102 | This looks right, so start scanning. |
| 0169 | A few minutes later, there are seven open findings, and each one was confirmed in a sandbox. |
| 0170 | Open the worst one. |
| 0172 | A spoofed header gives anyone a full auth bypass, and lets them act as the admin. |
| 0173 | The attack path shows each step, from the forged header to the admin export. |
| 0174 | References point to the exact lines in auth dot js. |
| 0175 | Sandbox validation ran the real API and confirmed it. |
| 0176 | Here are the exact curl requests, and the admin data that came back, with no token at all. |
| 0177 | Now assign it to Devin. |
| 0180 | Within a minute, a fix session has already opened a pull request. |
| 0181 | Open the fix session. |
| 0184 | Devin gets the finding and its evidence, checks the code on main, and opens a pull request with the fix. |
| 0185 | It even flags that an earlier fix was reverted on main, and asks you to check before merging. |
| 0186 | The tests pass, and the pull request is ready for review. |
| 0187 | Open the pull request right in the session. |
| 0191 | It's ready to merge, with three files changed. |
| 0192 | The header is now trusted only when the proxy signs it with a fresh HMAC, and the check fails closed when no secret is set. |
| outro | Security Swarm. Real exploits, found, proven, and fixed. |
