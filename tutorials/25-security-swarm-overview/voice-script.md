# Voice script: Security Swarm, how it works (overview)

Voice: ElevenLabs `T8iHhGIWPm2GVYpQD1Am` (`25-security-swarm-overview-nader.mp4`). Generated as one continuous take with `python3 _kit/tools/vo_onetake.py 25-security-swarm-overview T8iHhGIWPm2GVYpQD1Am` from the `vo` lines in spec.js, then cut between sentences, at ElevenLabs default voice settings. Each line is a whole sentence, and every line passed the Speech-to-Text check.

| Shot | Narration |
|---|---|
| 0000 | Security Swarm finds, validates, and helps fix security vulnerabilities by dividing your repo among many Devins that work in parallel, for broad coverage and deep investigation. |
| 0001 | First, Devin reads your repo and writes a threat model for it, a set of rules for what to look for in this code. |
| 0003 | In interactive mode, you review those rules and approve them before the scan begins. |
| 0004 | The rules pick out the files worth a closer look, and each small batch of them goes to its own Devin, with every batch investigated in parallel. |
| 0005 | Their results are combined into one view of the whole repo, ranked by severity, with duplicates merged. |
| 0007 | If sandbox validation is on, a separate Devin then tries to reproduce each finding in an isolated sandbox, which gives you stronger evidence that it's real. |
| 0009 | When you're ready, assign a finding to Devin, and it opens a pull request with the fix, tracked right on the finding. |
| 0011 | And because the results are combined, it can connect issues across files: here, one file trusted a header to say who you are, and another only checked for the admin role, so one header made anyone the admin. |
| 0012 | Use it for a deep first review of a high-risk codebase, for Auto Scans that check only the new commits on a schedule, for multi-repo scans of services that call each other, and to triage findings from the scanners you already use. |
| outro | That's Security Swarm: many Devins working through your repo in parallel, with evidence for what they find. |
