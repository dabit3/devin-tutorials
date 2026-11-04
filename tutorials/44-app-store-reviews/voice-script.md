# Voice script: App Store reviews to fixes

Narrated cut: `44-app-store-reviews-nader.mp4` (voice `T8iHhGIWPm2GVYpQD1Am`, ElevenLabs `eleven_multilingual_v2`). The whole script is one ElevenLabs request through `_kit/tools/vo.py`, then cut locally at sentence boundaries, so the tone stays the same. The STT check passed on every line. The audio is the voice over Nader's `2-upbeat.mp3`, ducked under speech and faded out at the end. There are no captions and no UI sounds in this cut.

Disclosure: Tabby is a demo app in `thequantexplorer/product-demo-apps/tabby` with four bugs planted on purpose, and the reviews in `tabby/reviews` are demo data (no real users) in the App Store Connect API and Google Play reviews CSV formats. Both are said in a caption and the narration.

All footage is from the run in the thequantexplorer org: one coordinator session that started two managed Devins (a macOS session with the iOS Simulator and a Linux session with the Android emulator), opened product-demo-apps#61 and had both re-verify it. Long waits are cut or sped up.

## Lines

| Shot | Visual (caption) | Line |
|---|---|---|
| 0000 | Terminal: the review exports in the demo repo: Run it every night, or whenever new reviews come in | In this video, Devin turns a batch of one-star app reviews into bug fixes. It reproduces each bug on the iOS Simulator and the Android emulator first. |
| 0006 | Terminal: the review exports in the demo repo: Two exports: App Store Connect and Google Play | Tabby is a small Expo demo app. We planted four bugs in it on purpose. The reviews are demo data in the App Store Connect and Google Play export formats. |
| 0043 | Coordinator session: Start one session on the demo repo | For this demo, I start one Devin session by hand and mention the demo repo. You can also run it on a schedule, for example every night. |
| 0050 | Coordinator session: Group, reproduce on iOS and Android, then fix | The prompt asks Devin to group the complaints into themes. Then two managed Devins, which are child sessions, reproduce each theme. One uses macOS with the iOS Simulator, and one uses Linux with the Android emulator. Devin fixes what reproduces in one pull request, then tests the fix on both. |
| 0069 | Coordinator session: Four bug themes, plus reviews that are not bugs | Devin reads all twenty-five reviews. It groups them into four bug themes and links each theme to the likely cause in the code. Some reviews are not bugs. One review complains about ads, but the app has no ads. Two reviews ask for new features. |
| 0083 | Coordinator session: Two managed Devins: macOS and Linux | Then the first Devin, the coordinator, starts the two managed Devins. One is a macOS session for the iOS Simulator. The other is a Linux session for the Android emulator. The coordinator waits for their results. |
| 0095 | macOS Devin (iOS Simulator): iOS Simulator: each person's share skips the tip | On the iOS Simulator, the macOS Devin enters a bill from one of the reviews. Each person's share leaves out the tip. |
| 0099 | macOS Devin (iOS Simulator): Dark mode: the bill name disappears | In dark mode, the bill names disappear from the list. |
| 0104 | macOS Devin (iOS Simulator): Force-quit and reopen: the saved bills are gone | Then it force-quits Tabby on the Simulator and opens it again. The saved bills are gone. |
| 0111 | Linux Devin (Android emulator): The Linux Devin runs Tabby on the Android emulator | At the same time, the Linux Devin runs the same app in Expo Go on the Android emulator. |
| 0129 | Linux Devin (Android emulator): Same bill on Android: the tip is left out | It finds the same tip bug. |
| 0139 | Linux Devin (Android emulator): Dark mode hides the bill name | Bill names disappear in dark mode here too. |
| 0153 | Linux Devin (Android emulator): Deleting the last bill crashes the app | Deleting the last bill crashes the app with an uncaught error. |
| 0160 | Coordinator: Agents tab, PR and final summary: One PR with all four fixes | Both Devins reproduced the bugs. The coordinator then opens one pull request with all four fixes. The ads review and the feature requests are not part of it. |
| 0162 | Coordinator: Agents tab, PR and final summary: Devin Review findings drove three more commits | Devin Review found edge cases in the restart fix. The coordinator pushed three more commits to fix them. |
| 0163 | macOS Devin (iOS Simulator): iOS re-check: the share now includes the tip | Then both Devins test the fix again. On iOS, the same bill now includes the tip. |
| 0168 | macOS Devin (iOS Simulator): Bill names are readable in dark mode | The bill names show in dark mode. |
| 0175 | macOS Devin (iOS Simulator): Delete the last bill | Deleting the last bill now goes back to the empty list. The app does not crash. |
| 0198 | macOS Devin (iOS Simulator): Force-quit and reopen to check saved bills | It also force-quits and opens the app again to check that the bills stay saved. |
| 0201 | Linux Devin (Android emulator): Android re-check on the same build | On Android, the split includes the tip too. Bill names are easy to read in dark mode. |
| 0243 | Coordinator: Agents tab, PR and final summary: Both managed Devins, asleep when done | The Agents tab lists both managed Devins. The coordinator put them to sleep when they finished. |
| 0246 | Coordinator: Agents tab, PR and final summary: Final re-check passed on both platforms | The final summary says both platforms passed the last check on the latest commit. CI passed, and every review thread is resolved. |
| 0247 | Coordinator: Agents tab, PR and final summary: It lists what it couldn't test | It also lists what it could not test and a known follow-up. The pull request is left for you to merge. |
| outro | Ending card | That's how you turn one-star reviews into fixes, tested on iOS and Android. |

## Sources

- Managed Devins: https://docs.devin.ai/work-with-devin/advanced-capabilities
- macOS support: https://docs.devin.ai/onboard-devin/environment/macos-support
- Android emulation: https://docs.devin.ai/onboard-devin/environment/android-emulation
- Computer use: https://docs.devin.ai/work-with-devin/computer-use
- Devin Review: https://docs.devin.ai/work-with-devin/devin-review
