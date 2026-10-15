# Voice script: App Store reviews to fixes

Narrated cut: `44-app-store-reviews-nader.mp4` (voice `T8iHhGIWPm2GVYpQD1Am`). The whole script is generated as one ElevenLabs take (default voice settings) with `_kit/tools/vo_onetake.py` from the `vo` fields in `spec.js`, then cut locally into sentence-aligned lines. The STT check passed on the first take.

Disclosure: Tabby is a demo app in `thequantexplorer/product-demo-apps/tabby` with four bugs planted on purpose, and the reviews in `tabby/reviews` are demo data (no real users) in the App Store Connect API and Google Play reviews CSV formats. Both are said in a caption and the narration.

All footage is the real run in the thequantexplorer org: one coordinator session that started two managed Devins (a macOS session with the iOS Simulator and a Linux session with the Android emulator), opened product-demo-apps#61 and had both re-verify it. Long waits are cut or sped up.

## Lines

| Shot | Visual (caption) | Line |
|---|---|---|
| 0000 | Terminal: the review exports in the demo repo: Turn 1-star reviews into reproduced, fixed bugs | Devin can take an export of one-star app reviews, group the complaints into themes, reproduce each one on the iOS Simulator and the Android emulator, and fix them in a pull request. |
| 0006 | Terminal: the review exports in the demo repo: Two exports: App Store Connect and Google Play | Tabby is a small Expo demo app with four bugs we planted on purpose, and these reviews are demo data in the real App Store Connect and Google Play export formats. |
| 0043 | Coordinator session: Start one session on the demo repo | I start one Devin session, mention the demo repo, and give it the goal, not the answer. |
| 0050 | Coordinator session: Group, reproduce on iOS and Android, then fix | The prompt asks Devin to group the complaints into themes, start two managed Devins to reproduce every theme, one on macOS with the iOS Simulator and one on Linux with an Android emulator, then fix what reproduces in one pull request and re-verify it on both. |
| 0069 | Coordinator session: Four bug themes, plus reviews that are not bugs | Devin reads all twenty-five reviews and groups them into four bug themes, each tied to the likely cause in the code, plus a set that aren't bugs: an ads complaint for an app with no ads, and two feature requests. |
| 0083 | Coordinator session: Two managed Devins: macOS and Linux | Then it starts two managed Devins, a macOS session for the iOS Simulator and a Linux session for the Android emulator, and waits for their results. |
| 0095 | macOS Devin (iOS Simulator): iOS Simulator: each person's share skips the tip | On the iOS Simulator, the macOS Devin enters a bill from one of the reviews, and each person's share leaves out the tip. |
| 0099 | macOS Devin (iOS Simulator): Dark mode: the bill name disappears | In dark mode, the bill names vanish from the list. |
| 0104 | macOS Devin (iOS Simulator): Force-quit and reopen: the saved bills are gone | Then it force-quits Tabby on the Simulator and reopens it, and the saved bills are gone. |
| 0111 | Linux Devin (Android emulator): The Linux Devin runs Tabby on the Android emulator | Meanwhile, the Linux Devin runs the same app in Expo Go on the Android emulator. |
| 0129 | Linux Devin (Android emulator): Same bill on Android: the tip is left out | It hits the same tip bug. |
| 0139 | Linux Devin (Android emulator): Dark mode hides the bill name | Bill names disappear in dark mode here too. |
| 0153 | Linux Devin (Android emulator): Deleting the last bill crashes the app | And deleting the last bill crashes the app with an uncaught error. |
| 0160 | Coordinator: Agents tab, PR and final summary: One PR with all four fixes | Once both have reproduced the bugs, the coordinator opens one pull request with all four fixes, and leaves the ads complaint and feature requests out of it. |
| 0162 | Coordinator: Agents tab, PR and final summary: Devin Review findings drove three more commits | Devin Review flagged edge cases in the restart fix, and the coordinator pushed three more commits to handle them. |
| 0163 | macOS Devin (iOS Simulator): iOS re-check: the share now includes the tip | Then both Devins re-verify the fix, and on iOS the same bill now includes the tip. |
| 0168 | macOS Devin (iOS Simulator): Bill names are readable in dark mode | The bill names show up in dark mode. |
| 0175 | macOS Devin (iOS Simulator): Delete the last bill | And deleting the last bill goes back to the empty list instead of crashing. |
| 0198 | macOS Devin (iOS Simulator): Force-quit and reopen to check saved bills | It also force-quits and reopens the app to check that bills are saved. |
| 0201 | Linux Devin (Android emulator): Android re-check on the same build | On Android, the split includes the tip too, and bill names are readable in dark mode. |
| 0243 | Coordinator: Agents tab, PR and final summary: Both managed Devins, asleep when done | The Agents tab lists both managed Devins, which the coordinator put to sleep when they finished. |
| 0246 | Coordinator: Agents tab, PR and final summary: Final re-check passed on both platforms | The final summary says both platforms passed the last re-check on the latest commit, with CI passing and every review thread resolved. |
| 0247 | Coordinator: Agents tab, PR and final summary: It lists what it couldn't test | It also lists what it couldn't test and a known follow-up, and the pull request is left for you to merge. |
| outro | Ending card | Give Devin your one-star reviews, and get back fixes verified on iOS and Android. |

## Sources

- Managed Devins: https://docs.devin.ai/work-with-devin/advanced-capabilities
- macOS support: https://docs.devin.ai/onboard-devin/environment/macos-support
- Android emulation: https://docs.devin.ai/onboard-devin/environment/android-emulation
- Computer use: https://docs.devin.ai/work-with-devin/computer-use
- Devin Review: https://docs.devin.ai/work-with-devin/devin-review
