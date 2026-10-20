// Intro prototype #06 "The signal" for Tutorial 26 (Devin across the SDLC).
// A single blue dot draws the lifecycle loop (Understand -> ... -> Operate -> back), timed to the bars of
// 2-upbeat.mp3, then the loop resolves into the Devin card and lands on the 26-sdlc-overview "overview" layout.
// The kit draws its title card for the first introHold + 1.2 s; sceneOffset shifts the scene clock so the intro
// starts at frame (introHold + 1.2) * 60. Render that range with render.mjs (see README.md).
window.SPEC = {
  "title": "Devin across the SDLC",
  "subtitle": "",
  "introHold": 0,
  "sceneOffset": 1.2,
  "pace": 1,
  "noCaps": true,
  "tailHold": 0,
  "edit": {
    "0010.png": { "scene": "signal", "hold": 13.9 }
  }
};
