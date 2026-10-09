// Tutorial 30, variant 2: "Floating window in depth". The whole film is drawn by scenes.js (SCENES.film);
// the single beat only sets the length: 2.4 s intro + 9.6 s UI + 2.4 s outro = 14.4 s.
window.SPEC = {
  "title": "Use your ChatGPT plan in Devin",
  "subtitle": "Link ChatGPT Go, Plus or Pro",
  "introHold": 2.4,
  "tailHold": 0,
  "outroHold": 2.4,
  "pace": 1.0,
  "noCaps": true,
  "scenes": true,
  "edit": {
    "film": { "scene": "film", "hold": 9.6, "cursor": false }
  }
};
