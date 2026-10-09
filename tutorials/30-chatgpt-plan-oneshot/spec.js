// Tutorial 30, variant 4: "One continuous shot". The whole film (title, real UI, end card) is one camera move
// drawn by scenes.js, which replaces the engine's frame renderer. This spec only sets the length:
// introHold + the single beat's hold + outroHold = 14.5 s.
window.SPEC = {
  "title": "Use your ChatGPT plan in Devin",
  "scenes": true,
  "noCaps": true,
  "introHold": 0.5,
  "pace": 1.0,
  "tailHold": 0,
  "outroHold": 0.5,
  "edit": {}
};
