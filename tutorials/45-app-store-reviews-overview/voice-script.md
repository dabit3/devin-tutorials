# Voice script: App Store reviews to fixes (overview)

Narrated cut: `45-app-store-reviews-overview-nader.mp4` (voice `T8iHhGIWPm2GVYpQD1Am`, ElevenLabs `eleven_multilingual_v2`). The whole script is one ElevenLabs request through `_kit/tools/vo.py`, then cut locally at sentence boundaries, so the tone stays the same. The STT check passed on every line. The audio is the voice over Nader's `2-upbeat.mp3`, ducked under speech and faded out at the end. There are no captions and no UI sounds in this cut.

Disclosure: Tabby is a demo app in `thequantexplorer/product-demo-apps/tabby` with four bugs planted on purpose, and the reviews in `tabby/reviews` are demo data (no real users) in the App Store Connect API and Google Play reviews CSV formats. Both are said in a caption and the narration.

This is a concept overview: animated diagrams (`scenes.js`) alternate with UI shots reused from tutorial 44 (mapped in `shots/SOURCES.json`).

## Lines

| Shot | Visual | Line |
|---|---|---|
| 0000 | Diagram: the pipeline, step 1 (1-star reviews from the App Store and Google Play) | In this video, Devin turns one-star app reviews into bug fixes. It reproduces each bug on iOS and Android, then fixes them in one pull request. |
| 0001 | UI: the App Store Connect export in the demo repo (terminal) | We start it by hand here, but you can also run it on a schedule. The app has bugs we planted on purpose. The reviews are demo data in the App Store Connect and Google Play formats. |
| 0002 | Diagram: step 2, themes (4 bug themes; not bugs: ads, requests) | First, Devin reads every review. It groups the complaints into themes and links each theme to the likely cause in the code. |
| 0003 | UI: the coordinator's theme list (four bug themes, plus reviews that are not bugs) | It found four bugs. Each person's share leaves out the tip. Bill names disappear in dark mode. Deleting the last bill crashes the app. Saved bills are lost after a restart. One review complained about ads, but the app has no ads. Two reviews asked for new features, so they stay out. |
| 0004 | Diagram: step 3, reproduce (iOS Simulator on macOS, Android emulator on Linux) | Next, it starts two managed Devins, which are child sessions. One is a macOS session for the iOS Simulator. The other is a Linux session for the Android emulator. |
| 0005 | UI: both managed Devins' links in the coordinator's chat | (no line) |
| 0006 | UI: the macOS Devin's iOS Simulator screenshot: each person's share leaves out the tip | On the Simulator, each person's share leaves out the tip. |
| 0007 | UI: the Linux Devin's Computer tab: the Android emulator crashing after deleting the last bill | On the emulator, deleting the last bill crashes the app. |
| 0008 | Diagram: step 4, one PR (Devin Review checks it) | Then the first Devin, the coordinator, puts every fix in one pull request. Devin Review checks the pull request. |
| 0009 | UI: the fix PR diff (`perPerson` uses the total) | Each share is now the total, with the tip, divided by the number of people. |
| 0010 | Diagram: step 5, re-verify (iOS passed, Android passed) | Finally, both managed Devins test the fixed build again on their platform. |
| 0011 | UI: iOS Simulator re-check, the share includes the tip | On iOS, the share includes the tip. |
| 0012 | UI: Android emulator re-check, bill names readable in dark mode | On Android, bill names are easy to read in dark mode. |
| 0013 | Diagram: four use-case cards | You can use this to sort a review export into bugs and other complaints. Devin reproduces each bug before it fixes it, and tests again before you merge. |
| 0014 | UI: the coordinator's final summary | Devin reports back when both platforms pass the final check. It leaves the pull request for you to merge. |
| outro | Ending card | That's how you turn one-star reviews into fixes, tested on iOS and Android. |

## Sources

- Managed Devins: https://docs.devin.ai/work-with-devin/advanced-capabilities
- macOS support: https://docs.devin.ai/onboard-devin/environment/macos-support
- Android emulation: https://docs.devin.ai/onboard-devin/environment/android-emulation
- Computer use: https://docs.devin.ai/work-with-devin/computer-use
- Devin Review: https://docs.devin.ai/work-with-devin/devin-review
