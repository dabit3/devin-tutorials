// Intro prototype #10 "Split second" for Tutorial 26 (Devin across the SDLC).
// Disconnected handoff cards wait; one blue pulse leaves Devin, sweeps the chain, snaps each card into the
// seven-stage row and returns to Devin, which then connects to every stage. Ends on the exact settled layout of
// 26-sdlc-overview's `overview` scene at s = 4.0, so it can hand off with a straight cut.
// Kit wiring: the kit always plays its title card for the first introHold + 1.2 s, so beat 0000 is a 1.2 s blank
// spacer and the intro itself (beat 0010) starts at frame 72; render from frame 72 (see README.md).
window.SPEC = {
  "title": "Devin across the SDLC",
  "subtitle": "Intro prototype: Split second",
  "outro": "Devin does the work. Your team decides what ships.",
  "introHold": 0,
  "pace": 1,
  "noCaps": true,
  "tailHold": 0,
  "edit": {
    "0000.png": {"scene": "blank", "hold": 1.2, "fade": 0},
    "0010.png": {"scene": "splitSecond", "hold": 10.5, "fade": 0}
  }
};
