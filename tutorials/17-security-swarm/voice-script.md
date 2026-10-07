# Voice script: Devin Security Swarm

Voice: ElevenLabs `T8iHhGIWPm2GVYpQD1Am` (`17-security-swarm-nader.mp4`). Generated with `python3 _kit/tools/vo.py 17-security-swarm T8iHhGIWPm2GVYpQD1Am` from the `vo` lines in spec.js.

| Shot | Narration |
|---|---|
| 0000 | This is Devin Security Swarm. It reads your code like an attacker, proves each bug is real, and fixes it. |
| 0002 | First, create a scan profile. |
| 0009 | Give it a name. |
| 0016 | Turn on sandbox validation, so Devin runs your app and tries every exploit. |
| 0018 | Tell it how to start the app, and who the test users are. |
| 0021 | Then create the profile. |
| 0026 | Now start a scan. |
| 0028 | Set it up manually, |
| 0030 | pick a single repo, |
| 0040 | and choose the profile. |
| 0044 | Turn on Interactive mode, so you review the threat model before it scans. |
| 0047 | Then run the scan. |
| 0056 | Devin studies the code and proposes a scan model: what an attacker could reach, the trust boundaries, and the entry points. |
| 0057 | It already suspects the X-Forwarded-User header, |
| 0058 | records fetched by ID with no owner check, |
| 0059 | and file paths built from user input. |
| 0060 | You can give feedback, or approve it. |
| 0065 | Findings stream in, grouped by severity. |
| 0080 | Then Devin tries to exploit each one in a sandbox. |
| 0095 | Duplicates and false positives are dismissed. Seven findings are open, and two are chained across files. |
| 0104 | Open the worst one. |
| 0106 | It's critical, with high confidence. Anyone can become an admin, with no password. |
| 0107 | Here's the attack path, step by step. |
| 0108 | And the exact lines, across four files. |
| 0109 | Devin ran the exploit in a sandbox, and it worked. Confirmed. |
| 0110 | This is the real request that proved it. |
| 0111 | Now assign it to Devin. |
| 0114 | A fix session starts right away. |
| 0116 | Devin takes the finding and its evidence, fixes the code, and adds tests for the forged header. |
| 0120 | Then it opens a pull request. |
| 0122 | Back on the finding, the fix PR is attached. |
| 0124 | A real exploit chain, found, proven, and fixed. |
| outro | Security Swarm. Real exploits, found, proven, and fixed. |

## Typed on screen

- Profile name: `Orbit API`
- Sandbox validation guidance: `Run the API from the repo README: npm install, npm run seed, npm start (port 4000). Seed users: ada@orbit.test / ada-demo-pw and grace@orbit.test / grace-demo-pw (members), ops@orbit.test (admin). Reproduce each finding with curl against localhost only, and attach the exact request and response as evidence.`
- Repo search: `orbit-api`

## Sources

- https://docs.devin.ai/work-with-devin/security-swarm
- Target repo: https://github.com/thequantexplorer/orbit-api-demo (fix PR: https://github.com/thequantexplorer/orbit-api-demo/pull/1)
