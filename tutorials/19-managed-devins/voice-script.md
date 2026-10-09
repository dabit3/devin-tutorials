# Tutorial 19: Managed Devins (voice script)

Narrated in Nader's voice (ElevenLabs `T8iHhGIWPm2GVYpQD1Am`, default settings), generated as one take with `_kit/tools/vo_onetake.py` and cut locally at sentence boundaries.

1. Managed Devins let one Devin split a big task into pieces and hand each piece to its own Devin, all running in parallel. It's great for big migrations, adding tests module by module, running one playbook across every service, and parallel research.

2. Here, I'm asking Devin to find the four UI components in Orbit with the least test coverage, and start a managed Devin for each one.

3. The coordinator measures coverage, ranks the components, and pushes one shared test setup, so the pull requests won't conflict.

4. Then it starts four managed Devins, one per component, each in its own isolated VM.

5. In the sidebar, the coordinator opens into a dropdown with its four Devins nested under it, and each one already has a pull request ready.

6. The coordinator checks all four branches together, then writes one summary with what each Devin found.

7. You can still steer the team. I'm telling the coordinator to have the CardModal Devin also test that pressing Escape closes the modal.

8. Opening the CardModal Devin, you can follow its work in its own VM.

9. It pushes two new tests that press the real Escape key, and all forty CardModal tests pass.

10. You can also message a managed Devin directly. I'm asking this one to open Orbit in its browser and test the card modal like a real user.

11. Its Computer tab shows its own desktop live, with Orbit running in Chrome.

12. It opens a card, changes the title, and presses Escape.

13. The modal closes, and the board still shows the original title.

14. Then it reopens the card, types a new title, and saves it.

15. It reports back that Escape closes without saving, and that Save changes stores the new title.

16. Back in the coordinator, the summary lists all four pull requests, each taking its component from zero to one hundred percent coverage.

17. With Auto-approve child sessions on, under Settings, Preferences, Devin starts managed Devins without asking you first.

18. One task in, a team of Devins on it.
