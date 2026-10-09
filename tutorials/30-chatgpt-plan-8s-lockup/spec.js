// 8 s lockup cut: the whole film is drawn by scenes.js (one `film` scene beat sets the length).
window.SPEC = {
  "title": "Use your ChatGPT plan in Devin",
  "scenes": true,
  "introHold": 0,
  "tailHold": 0,
  "outroHold": 0,
  "pace": 1.0,
  "noCaps": true,
  "pageBg": "#ffffff",
  "edit": {
    "film": { "scene": "film", "hold": 8.0, "cursor": false }
  }
};
