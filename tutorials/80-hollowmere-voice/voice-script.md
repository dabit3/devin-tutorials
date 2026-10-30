# Tutorial 80 — Hollowmere: a voice-controlled RPG, built and tested by voice

What is in the video, line by line, and what is real versus synthesized.

## Cold open (build/coldopen-v7.mp4, cut from live take 13; see Rev. 7)
Real Hollowmere gameplay in Chrome (Playwright Chromium, 1920×1080) with Eira live on OpenAI **GPT-Live-1** over WebRTC. Her
audio is the recorded remote track; nothing was re-voiced. Brann's lines are prerecorded ElevenLabs audio (`eleven_multilingual_v2`,
`public/audio/brann/`) played by the game itself. The player's lines are Nader's ElevenLabs voice (`T8iHhGIWPm2GVYpQD1Am`,
`eleven_multilingual_v2`, `genlines.py`), played into the page's `getUserMedia` through a virtual microphone with a real room-tone floor.
No interruptions: every line is spoken after Eira has finished.

| t | Nader (ElevenLabs) | Eira (GPT-Live-1, real) | Tool calls (real) |
|---|---|---|---|
| greeting | — | "Friend, that shrine's gone dark, but there's smoke from the watchpost…" | — |
| m1 20 s | "Eira, let's go talk to Brann at the watchpost." | "You got it. I'll take us there…" | `talk_to(Brann)` (walks there) |
| 42 s | — | Brann greets aloud (14 s, his own audio); Eira is muted until he finishes, then answers him | — |
| m2 67 s | "Change your voice. Try a soft Irish one." | "Sure, just a breath." (marin) → "Soft it is, friend. Go on. I'm here." (willow) | `change_voice(willow)`: the GPT-Live session is reconnected with the new voice, context carried |
| m3 77 s | "Ask him about the barrow." | "Yeah, let's hear what he'll say." → Brann answers aloud (11 s) → "Then there's our trail." | `ask_about(barrow)` |
| m4 100 s | "What's in my pack?" | "You've an iron sword and two health potions…" | `open_pack` |
| m5 113 s | "Alright, take us to the shrine." | "Right, I'll get us moving." | `move_to(shrine)` under the end crane |

The run log (`live/v13/run.log`) has every event; `live/v13/stt.json` is the scribe transcript of the take.

## Intro narration (intro/, Nader's ElevenLabs voice, one take with the rest of the narration)
i0 "Today I'll be building and testing a cross-platform mobile game just by using my voice. …" (exact opening line)
i2 "… Devin Voice uses ChatGPT voice under the hood." (exact line)

## Build call (real Devin Voice call, thequantexplorer org, session e5a6243e96194940a67ca1dda499e7d3)
Devin's side is real Devin Voice audio recorded from the WebRTC track (`voice-hook.js`); Nader's side is ElevenLabs
(`call/c1..c7.wav`). Transcript from `stt.py` (scribe_v1) on `audio/call1.wav`:
- c1 Hollowmere intro (Expo, iOS/Android/web, Eira on GPT-Live-1) → Devin: "Got it. You've got an Expo app … What would you like me to do with it?"
- c2 the ask: a new Eira tool that drops a glowing waypoint marker + compass pin, cleared on arrival or "clear the marker" → Devin: "Okay, I'll take a look and…"
- c3 **barge-in** 2.5 s into that answer: "Oh, and make the marker a tall beam of light, so you can see it from across the valley." → Devin: "Got it. Tall beam of light. Checking."
- c4 "Test it on the web build in Chrome and on the iPhone simulator, with recordings of each, then open a pull request." → "Understood. I'll get on it."
- c5 "Perfect. Go ahead."
Edit: Devin went quiet for 39 s after the barge-in before the next line; `cutcall.py call1 58.5 97.5` removed that stretch from
the audio and the stills together, so the call is 110.7 s in the cut (149.7 s recorded). Nothing was reordered.
Rejoin (call2, 24.6 s, real): c6 "how's the waypoint feature coming along?" → "Checking on it. I'm on it and it's moving forward… It's working on the web." c7 barges in: "Great. Let me know when the pull request is up." → "I'll let you know."

The capture lost the start-phase stills (a later phase overwrote them); the macOS environment pick was re-shot on the
new-session page (`shots-pick/`) and the first 24 s of the call hold the first surviving call still.

## Devin's build and tests
- Devin's PR: thequantexplorer/product-demo-apps#91 (branch `devin/1792599913-hollowmere-waypoint`, unmerged). New Eira tools `mark_waypoint` and `clear_waypoint` (`server/companion.mjs`), `GameState.waypoint`, a tall warm-gold beam with ground ring, motes and a point light (`src/render/waypoint.ts`), a diamond pin with distance on the compass that clamps to the strip edge (`src/render/Hud.tsx`), typed-parser fallbacks ("mark/pin/flag X", "set a waypoint at X", "clear/remove the marker"). Marking never moves the hero; a new mark replaces the old one; arriving clears it.
- Devin's checks on its branch: `npm test` (25 passed), `npm run typecheck`, `npm run lint`, `npm run build` (web export). The repo has no CI.
- Devin's recordings (both in the session, played back in the cut): "Chrome waypoint flow", 5 of 5 checks passed (beam + pin on mark, hero stationary, re-mark replaces, arrival clears, clear command removes); "iPhone waypoint partial test", 2 passed / 2 untested (beam + pin appeared; replace-on-re-mark and arrival-clear were not tried because the simulator gave roughly one frame a minute on software GL). Devin drove Eira with the typed command box in both recordings, not by voice.
- The call stretch Devin spent silent after the barge-in (about 39 s) is cut out of call1 in the video; nothing else in either call is edited.

## Our verification
- Chrome, web build of PR #91 (`live/test.mp4`, 32 s, real time, real GPT-Live-1 audio, Nader's `eleven_multilingual_v2` lines through the virtual mic): "Eira, mark the barrow" → `mark_waypoint` 6.4 s after the line, beam at the barrow and the compass pin with distance; "Clear the marker" → `clear_waypoint`, "Gone. Marker's cleared, friend." 25 fps while recording on this no-GPU macOS VM.
- iPhone simulator: Devin's recording above (Xcode, iPhone simulator, minimal tier, about one frame a minute). We did not run a second simulator pass ourselves.
- Android: an Ubuntu child session (https://app.devin.ai/sessions/c83b4384895e462fb426b65c650dc7a9) ran the same change (branch `devin/1792602211-hollowmere-waypoint-android` in dabit3/private-experiments, identical hollowmere diff) on an x86_64 API 35 emulator with SwiftShader, no GPU. APK built in 2m57s. With `-gpu swiftshader_indirect` the emulator process segfaulted six times as the valley appeared; in the emulator's automatic software mode (ANGLE on SwiftShader) the valley rendered at +106 s, Begin at +234 s, HUD full screen (`android/h1.png`). Typing "mark the barrow" ANR'd the app after the first letter on both tries (`android/m1.png`) and the guest system_server rebooted, so the beam, compass pin and clear were NOT observed on Android. fps not measured this run; the previous run on the same AVD gave 1-4 fps. The caption says "valley rendered (~1 fps) but the typed command stalled the app — marker not checked"; the narration's "the Android emulator ran at about one frame a second" refers to the game, not the feature. No code changes, no PR, no push from the child.
- No physical iPhone or Android device was used anywhere in this tutorial, by us or by Devin. The video and captions say so.

## Redaction
- OCR of every second of both finals (`ocrscan.py video <mp4> 1`, tesseract 5.5), terms: 403, fatal, git-manager, unable to access, usage limit, GITHUB_PAT. Narrated cut (rev. 2): 339 frames, 1 hit: frame 0.0 s matched `403`, which is the opening gameplay frame of the teaser (hero, Eira and the compass; no UI or log text). Re-running tesseract on that extracted frame finds no `403`, and the frame was checked by eye, so it is a tesseract misread of the compass distance tag, not a 403 message. Captioned cut (rev. 2): 302 frames, 0 hits. The no-music cut has the identical video stream as the narrated cut (same kit video, different audio), so it shares that result. The 498 session stills were also scanned before the build: 0 hits. Rev. 5 (current finals): narrated 332 frames, captioned 310 frames, 0 hits in both.
- MASK_TEXT=eigenexplorer hides the capture account's e-mail in the session stills.

## STT checks (ElevenLabs scribe_v1, `stt.py`)
- Narrated cut (`stt-nader.json`, rev. 2: opener 0.6-4.5 s, Devin Voice line 30.2-32.6 s, Eira's new take lines, "No physical devices were tested." 336.3-337.9 s): opens 0.6-4.5 s "Today I'll be building and testing a cross-platform mobile game just by using my voice."; 30.2-32.6 s "Devin Voice uses ChatGPT Voice under the hood."; Eira's live lines, Devin's call lines and the closing "No physical devices were tested." (321-323 s) are all transcribed. Scribe spells Hollowmere "Holomere" and Eira "Era".
- No-music cut (`stt-nomusic.json`): same narration and call audio, same lines found.
- Captioned cut (`stt-cap.json`): no narration in this cut; Eira's cold-open lines (8.5 s "The shrine's gone dark…", 16.3 s "Eira, walk us to the shrine"), Nader's barge-in (136.5 s "Oh, and make the marker a tall beam of light…"), Devin's "Tall beam of light." (142.4 s) and Eira's "Marker's cleared, friend." (276.9 s) are all transcribed.

## Revision after the first review
- Call stills 0200–0216 carried the Devin app's yellow maintenance warning ("Running pull commands for thequantexplorer/product-demo-apps took 2m 27s…"). It is painted over with the panel colour in the stills (originals kept locally); no timing change, same treatment as Tutorial 77.
- The native disclosure pill is now three lines inside the safe area (caps.mjs supports `\n`). `mark_waypoint fires…` starts on the beam's first frame (21.0 s in live/test.mp4) and `Clear the marker → clear_waypoint` on the frame the beam goes out (30.0 s); the last frame is held so the disclosure pill gets ~5 s.

## Revision 2: the hero ran facing the camera
Nader: "the person is running in the direction of the screen but not moving". Real game bug, not a capture artifact: the Quaternius Ranger exports (hero, Eira) face +Z like the Peasant rigs, but `facesPlusZ` was unset for them, so `buildCharacter` turned the models 180° and the body walked away from the follow camera while facing it. Fixed in `characters.ts` (`HERO_SPEC`/`EIRA_SPEC: facesPlusZ: true`): dabit3/private-experiments#152 (61e24f1) and thequantexplorer/product-demo-apps#93; verified with `tools/shot.mjs` mid-walk before re-recording.
- Cold open re-recorded (take 4, `live/raw/`, flash 5.04 s, 72.6 s raw, cut 1.0–69.5 s): same five ElevenLabs lines, Eira live on GPT-Live-1. k2 interrupt → "clean start. Let's go find Brann instead." (`stop` + `talk_to`), k3 → "Oh, an old bard. Aye, the walking ditty changes tune", Brann reached at ~33 s, k4 → Brann's barrow answer, k5 → `open_pack` ("That iron sword, two health potions, and your own hide whole"). The committed `live/live.mp4` is a crf-20 re-encode of the take (the crf-16 mux the finals were cut from was 117 MB, over GitHub's limit). Take 3 (`live/raw-take3/`) was discarded: Eira answered the interruption without a tool call. 38 fps.
- Live waypoint check re-recorded (take 3, `live/test-raw/`, flash 5.64 s): "Eira, mark the barrow" → `mark_waypoint` ("A tall beam now marks the barrow, friend, and it's pinned to your compass"), beam 16.25–26.5 s, "clear the marker" → `clear_waypoint` ("The barrow marker's cleared, friend."). 26 fps while recording.
- Not re-shot: the Devin Voice call and Devin's own on-camera web/iPhone-simulator test stills, which show the pre-fix rig in a few small game frames. That is what Devin actually saw during the call; the kit cut is unchanged apart from the painted-out maintenance box.

## Revision 3: the quality pass (cinematic cold open)
Nader: "the beginning of the game gives a very bad first impression… the person on the screen should be doing something that is natural and not weird." Rebuilt against a storyboard gate (7 real stills, three rounds) and a cold-open draft gate.
- Game, on the #152 branch (unmerged): a scripted **director camera** (`Camera.play`, world-space keys eased per segment, hands back to the follow cam), a capture-only `?cine=1` mode (hero and Eira walk, never jog; Eira kept beside the hero inside a wider, higher follow frame; over-the-shoulder dialogue camera with the hero never ghosted; HUD reduced to subtitles + a tool pill, hidden during director moves). Eira's server-side interruption policy gained one sentence: if the interruption names a new place or person, call `stop` then `talk_to`/`move_to` in the same turn.
- Cold open take 9 (`live/raw/`, 1920×1080, 44 fps, real GPT-Live-1 audio, the same five ElevenLabs lines through the virtual mic with the room-tone floor): director opening (shrine ring → vista over the mere → watchpost forge → settle behind the pair), k1 → `move_to(shrine)`, k2 barge-in once `move_to` had landed → "Aye, stopping now. Let's go have a word with Brann." (`stop` + `talk_to` + `move_to` in one turn), k3 → "As you wish, traveler. My tongue slips back to older songs…", at Brann k4 → `ask_about(barrow)`, k5 → `open_pack`, crane end beat. Takes 5–8 failed because the barge-in landed before her tool call (`coldopen.mjs` now waits for `move_to`).
- Approved as an **edit, no retake** (`coldopen_edit.py`): shrine 5 s, vista 3 s, watchpost 3.5 s, the walk minus the beat where a foreground rock covers Eira, the two-shot cut to the greeting, the `ask_about` answer and the pack line with eased punch-ins, the crane landing on the composed forge frame. The two-shot picture runs 2.7 s ahead of its audio (a J-cut over the dropped rock beat; nobody is lip-synced). The in-take subtitles are hidden behind a frosted lower band and re-rendered larger by `subs.mjs` (36 px lines at 1080p, one speaker at a time, "You:" lines and tool pills ≥30 px). The band is the honest cost of not retaking: a dark gradient over the lower ~28 % of the frame (40 % in the two-shot). An edit-only shadow lift is applied to the backlit walk.
- Intro teasers are **unused** footage from `broll.mjs` (`live/broll/`, no GPT-Live, the game's own typed command path + director camera): valley flight, the cold shrine, the walk to the barrow, the frost hit on the wight, the relit brazier and the ending. Nothing from the cold open appears twice.
- Call section: kit camera punch-ins (the ask, the barge-in pill and "Got it. Tall beam of light.", the beam in Devin's own Chrome test still 0234, the iPhone simulator, the PR and its diff); the call audio and stills are otherwise the real recording, unchanged.
- Call section rev. 4: the kit frame is a card filling the left column's height (centred, chat column cropped to whole bubbles, resting text ≈17 px at 1080p, punch-in lines 26–30 px) over unused gameplay from `live/broll2/` and `live/broll/`: valley flight, mere vista, Brann at the forge, the barrow road from behind the pair, the wight fight, the behind-the-back barrow walk. Dropped from the right pane: the hero walking toward the lens, the pine-branch close-up, the night frames. Game audio −15 dB under the call.
- Live check rev. 4: `live/test.mp4` is still Devin's real take (not re-recorded), cut to 5 s with an eased punch-in on the beam, the compass pin and Eira's reply line; the native disclosure then plays over a behind-the-back walk to the shrine (`live/broll/` 116–134.8 s). The lit-brazier teaser in the intro is 3.5 s.

## Rev. 6 (reviewer notes on v5)
- Native-testing disclosure: `caps.mjs` renders multi-line pills at 64 px (32 px at 1080p, line height 83) on the same dark `rgba(25,25,25,.94)` panel, three lines, inside the safe area, top of frame; held for the whole 19.5 s walk so it is still up when the narration says "No physical devices were tested" (v5 showed it for 6.5 s only).
- Right pane: broll1 24.5-30.5 s (the flight between the standing stones that blocked the pane at ~3:50) is skipped; the pane now runs flights → mere walk → Brann → barrow road + wight → the watchpost road from behind (30.5-58 s) → the lit brazier (140.5-153 s).
- Shrine-walk outro: cut at 130 s, before the stones pass in front of the lens (130-135 s), then the brazier burning (141-147.5 s) carries the rest of the disclosure narration; 20.5 s in total.
- Narration line i3 re-recorded shorter ("Then I checked it myself, live on the web build. I ask Eira to mark the barrow.", 4.1 s) so it finishes inside the 5 s live check; the v5 take was cut off after "GPT-Live-1".
- No-music master: the split-screen call section is now rebuilt from the no-music kit; in v5 it reused the narrated kit's render, so the call section still carried the music bed.
- Each mode now builds its own split-screen call section from its own kit (cap 149.7 s, narrated/no-music 146.8 s); v5 reused the narrated render in the captioned and no-music cuts. Finals: captioned 5:10, narrated 5:32, no-music 5:32, all 92.1-92.4 MB.

## Rev. 7 (Nader: cut the blank space, Brann talks back, Eira's voice really changes, no interruptions, smoother gameplay, Blender pass)
- Game (#152 branch): `change_voice` tool reconnects GPT-Live with a new `audio.output.voice` (the API fixes the voice per session) carrying the recent transcript; Brann's lines play as real audio (`audio.bark`) and Eira is muted (`hold()`) while he speaks, then reacts when he finishes; the interruption policy is gone from her instructions; the director camera is no longer clobbered by tool camera events.
- Blender 5.2 props exported as GLB and loaded with `loadGltf`: shrine brazier (carved bowl, rune band, chains, claw legs), watchpost forge (arched hood, chimney, grate, anvil on a stump) and the barrow facade (megalith jambs, cracked lintel, dry-stone wings, snow caps), all on the game's PBR sets.
- Cold open re-recorded as take 13 (`coldopen.mjs` SEQ=v7, `conform.py` re-times the 25 fps-tagged recording to its audio): no "wait, wait", no barge-in; two cutaways (`cutaways.mjs`: the cold brazier under Brann's "the shrine-fire went out", a low dolly on the barrow door under his barrow answer) break up the two-shot. Subtitles re-rendered (36 px lines, one speaker at a time) over a short frosted strip instead of the old 28 % band.
- Narration line i1 re-voiced ("Brann the warden answers you out loud, and when you ask, Eira changes her voice."); call-section captions no longer say "interrupt"/"barge-in".
