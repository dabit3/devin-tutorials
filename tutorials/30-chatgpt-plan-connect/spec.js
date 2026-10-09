// Tutorial 30, variant 5 ("Two marks connecting"). The whole film is one scene (scenes.js `film`) drawn from frame 0:
// introHold -1.2 cancels the kit's 1.2 s title-card/window entrance and outroHold 0 skips the kit end card, so hold = length.
window.SPEC = {
  "title": "Use your ChatGPT plan in Devin",
  "introHold": -1.2,
  "tailHold": 0,
  "outroHold": 0,
  "pace": 1.0,
  "noCaps": true,
  "edit": {
    "0000.png": { "scene": "film", "hold": 14.75, "cursor": false, "fade": 0 }
  }
};
