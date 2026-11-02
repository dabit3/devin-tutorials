# Tutorial 80 v2 — shot list (target 5:00–5:20 narrated, ~4:40 captioned)

## Cold open (live take, real GPT-Live-1 Eira, Nader's 5 ElevenLabs lines via virtual mic; ~75 s)
| t | beat | camera | audio |
|---|---|---|---|
| 0:00–0:06 | Shrine ring at dusk: cold brazier, stones, barrow + mountains behind, light shafts, snow | director: low crane, dollies right-to-left around the ring (still 1) | wind/snow, Eira's greeting starts ~0:04 |
| 0:06–0:12 | Dolly past the stones toward the barrow mouth (blue light, mist) | director (still 2) | Eira greeting continues |
| 0:12–0:17 | High over the watchpost: forge glow, smoke, long shadows; tilt down the valley | director (still 3) | greeting ends |
| 0:17–0:19 | Settle behind the hero and Eira on the road; HUD fades in | director → follow hand-off (still 4) | — |
| 0:19–0:23 | "Eira, walk us to the shrine" → `move_to`; hero and Eira walk INTO the valley at walking pace | follow, behind / three-quarter (still 5) | Nader k1, Eira answers while walking |
| 0:23–0:27 | "Wait, wait, stop — go talk to Brann instead" cuts her off mid-sentence; she stops, reroutes (`stop` + `talk_to`) | follow | Nader k2 (barge-in) |
| 0:27–0:40 | "Talk like an old bard from now on" → she answers in character while the pair walks toward the forge | follow; one director pass alongside the walk (hero never toward lens) | Nader k3 |
| 0:40–0:46 | Arrival: hero stops, turns to face Brann, Eira steps aside | dialogue two-shot (still 6) | Brann's greeting bark |
| 0:46–0:58 | "Ask him about the barrow" → `ask_about`, Brann's answer | two-shot, slow push-in | Nader k4 |
| 0:58–1:06 | "What's in my pack?" → `open_pack` | two-shot | Nader k5 |
| 1:06–1:12 | End beat: director crane up from the forge fire and sparks over the valley toward the shrine; fade to the title | director (still 7) | wind, forge; music swell |

## Intro (narration, 0:00 of the kit cut → ~0:45)
Exact opener over the end-beat frame; "built with Devin beforehand"; "Devin Voice uses ChatGPT voice under the hood." Teaser b-roll: 3 cuts of ≤3 s each from the take (walk, barge-in reaction, Brann two-shot) — no shot reused later.

## Devin Voice call (real footage, re-edited; ~1:50)
Punch-ins instead of wide chat UI: 2.2× crop on the transcript line as each of Nader's lines lands; 1.6× on Devin's reply; the barge-in beat full-frame for 3 s then back to the transcript; the environment picker ≤3 s; dead air after the barge-in already cut (cutcall.py). Build section: 1.8× crop on the Computer tab diff (`mark_waypoint` tool in `parse.ts`/`world marker`), the beam appearing in Devin's own Chrome test at 1.4×, the iPhone simulator at 1.6× with the honest "~1 frame/min" pill. No still held > 3 s without a move (slow push on holds).

## Our live check (new take on the fixed build, ~25 s)
"Eira, mark the barrow" → beam rises across the valley: start on a low wide of the valley (director), punch to the compass pin for 2 s, back wide; "clear the marker" → beam fades. Three-line native disclosure pill (iPhone simulator ~1 frame/min, Android emulator ~1 fps and the typed command stalled the app, no physical devices).

## Outro (~8 s)
Slow director orbit of the lit forge / valley at dusk with the closing line and "That's how you…" recap card; no reused footage.
