# Voice script: App Store reviews to fixes (overview)

Narrated cut: `45-app-store-reviews-overview-nader.mp4` (voice `T8iHhGIWPm2GVYpQD1Am`). The whole script is generated as one ElevenLabs take (default voice settings) with `_kit/tools/vo_onetake.py` from the `vo` fields in `spec.js`, then cut locally into sentence-aligned lines. The STT check passed on the first take.

Disclosure: Tabby is a demo app in `thequantexplorer/product-demo-apps/tabby` with four bugs planted on purpose, and the reviews in `tabby/reviews` are demo data (no real users) in the App Store Connect API and Google Play reviews CSV formats. Both are said in a caption and the narration.

This is a concept overview: animated diagrams (`scenes.js`) alternate with real UI shots reused from tutorial 44 (mapped in `shots/SOURCES.json`).

## Lines

| Shot | Visual | Line |
|---|---|---|
| 0000 | Diagram: the pipeline, step 1 (1-star reviews from the App Store and Google Play) | You can have Devin turn your one-star app reviews into fixes automatically, every night or whenever new reviews come in. It reproduces each bug on iOS and Android and fixes them in one pull request. |
| 0001 | Real UI: the App Store Connect export in the demo repo (terminal) | In this demo, we start it by hand. The app has bugs we planted on purpose, and the reviews are demo data in the real App Store Connect and Google Play formats. |
| 0002 | Diagram: step 2, themes (4 bug themes; not bugs: ads, requests) | First, Devin reads every review and groups the complaints into themes, each tied to the likely cause in the code. |
| 0003 | Real UI: the coordinator's theme list (four bug themes, plus reviews that are not bugs) | Here it found four bug themes. One review complained about ads, but the app has no ads, and two were feature requests, so those stay out. |
| 0004 | Diagram: step 3, reproduce (iOS Simulator on macOS, Android emulator on Linux) | Next, it starts two managed Devins: a macOS session for the iOS Simulator, and a Linux session running the Android emulator. |
| 0005 | Real UI: both managed Devins' links in the coordinator's chat | (no line) |
| 0006 | Real UI: the macOS Devin's iOS Simulator screenshot: each person's share leaves out the tip | On the Simulator, each person's share leaves out the tip. |
| 0007 | Real UI: the Linux Devin's Computer tab: the Android emulator crashing after deleting the last bill | On the emulator, deleting the last bill crashes the app. |
| 0008 | Diagram: step 4, one PR (Devin Review checks it) | Then the coordinator fixes everything that reproduced in one pull request, and Devin Review checks it. |
| 0009 | Real UI: the fix PR diff (`perPerson` uses the total) | Each share is now the total, tip included, divided by the number of people. |
| 0010 | Diagram: step 5, re-verify (iOS passed, Android passed) | Finally, both managed Devins re-check the fixed build on their platform. |
| 0011 | Real UI: iOS Simulator re-check, the share includes the tip | On iOS, the share includes the tip. |
| 0012 | Real UI: Android emulator re-check, bill names readable in dark mode | And on Android, bill names are readable in dark mode. |
| 0013 | Diagram: four use-case cards | Use it to triage a review export, tell real bugs from other complaints, reproduce before fixing, and re-verify before you merge. |
| 0014 | Real UI: the coordinator's final summary | Devin reports back when both platforms pass the final check, and leaves the pull request for you to merge. |
| outro | Ending card | That's how you turn one-star reviews into fixes verified on iOS and Android, every night. |

## Sources

- Managed Devins: https://docs.devin.ai/work-with-devin/advanced-capabilities
- macOS support: https://docs.devin.ai/onboard-devin/environment/macos-support
- Android emulation: https://docs.devin.ai/onboard-devin/environment/android-emulation
- Computer use: https://docs.devin.ai/work-with-devin/computer-use
- Devin Review: https://docs.devin.ai/work-with-devin/devin-review
