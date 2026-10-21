# Glow Puck on Android — Phase 4 report (referee time out)

Branch tested: `devin/1792458965-glow-puck-timeout` at 33df48c1. API 35 x86_64 emulator (Pixel 7 AVD, 1080x2400), `-gpu host` falling back to Mesa llvmpipe software GL, session server on the host at http://10.0.2.2:8787 with OPENAI_API_KEY, REF ON.

Phase 4 done. The time out fires and auto-resumes on the emulator, but I could only trigger it with the **tool fallback**, not voice. Nothing committed/pushed on the game branch; only uncommitted debug hooks (console.log lines in `src/live/LiveClient.ts`, two long-press hooks in `src/screens/MatchScreen.tsx`) in the working tree.

## Trigger: tool fallback (not voice)

Debug hook = long-press on the II button calls `callTimeout()` directly (`[debug] call_timeout triggered directly from the client (tool fallback, not voice)` in logcat). So the GPT-Live -> `call_timeout` -> client dispatch path itself was NOT exercised.

- Voice (preferred): 3 attempts, "Ref, time out please. Time out. Time out." via TTS -> `paplay --device=micsink` -> vmic (host-side parec from vmic confirms the signal at -12.8 dB peak; guest `audio_flinger` shows the BUILTIN_MIC record track active). The model never reacted: no input transcript, no response, no tool call — only `session.usage.updated` events on the data channel. Differs from Phase 2 where the same path worked; I did not find the cause inside the time box.
- Typed (data channel): long-press REF sends `session.commentary.append` "Ember just said out loud: 'Ref, time out!'". The ref answered **"Time out, let's stop it here."** but did **not** call `call_timeout` — no tool call, no countdown, play continued. Caveat: commentary.append is the context channel, not a user turn, so this isn't a clean test of the prompt fix; still, it's the exact "announces without delegating" behaviour the fix targets.

## Result (tool fallback), logcat (`p4-logcat-timeout.txt`)

`[timeout] start 10 s` 06:50:55.771 -> TIMEOUT overlay with 10…1 countdown, puck and both mallets frozen (the overlay is `pointerEvents="none"`, II shows ▶) -> `[timeout] over: play resumed` 06:51:06.472 (**10.7 s**) -> "EMBER SERVES", puck moving. Referee captions appeared both times: **"Timeout on, ten-second breather."** at start and **"And we're back, play on now."** on resume (both `session.commentary.appended` -> transcript). Note this fired while the match was manually PAUSED (my earlier II press); `callTimeout` cleared the pause, ran the countdown and resumed play — correct.

## FPS during countdown

gfxinfo over ~8 s of the countdown: 30 frames, 100 % janky, p50 150 ms / p90 250 ms / p99 350 ms ≈ 3.7 fps; same llvmpipe software GL as before (`-gpu host`, no host GPU). Clip: 22 s, 0.3 MB, `adb shell screenrecord`.

## Not verified

Any audible audio (ref voice, pause/serve SFX); voice-triggered timeout; the real `call_timeout` tool round-trip from GPT-Live. Also: Metro from `expo run:android` served a stale bundle after edits (HMR said "1 module" but cold starts got the old graph) — fixed host-side with `expo start --dev-client -c`. Title clipping from Phase 3 is gone on this branch ("GLOW PUCK" renders).

## Files

- `p4-timeout-clip.mp4` — 22 s screenrecord: PAUSED -> TIMEOUT 10…1 countdown with frozen puck/mallets -> auto-resume, captions visible
- `p4-countdown-4s.png` — countdown at 4 s with the "Timeout on, ten-second breather." caption
- `p4-after-resume.png` — play resumed, "And we're back, play on now." caption
- `p4-logcat-timeout.txt` — ReactNativeJS logcat lines for the trigger, `[timeout] start`, captions and `[timeout] over`
