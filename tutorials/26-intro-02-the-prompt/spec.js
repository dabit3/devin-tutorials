// Intro prototype #02 "The prompt": a real task is typed, Enter lands on the music's first downbeat (2.01 s),
// and the prompt card becomes the Devin card that the lifecycle diagram grows out of.
// Render: frames from 72 (the kit's 1.2 s window entry is covered by the blank beat) at --every 2 for 30 fps.
window.SPEC = {
  "title": "Devin across the SDLC",
  "subtitle": "Intro prototype",
  "introHold": 0,
  "pace": 1,
  "noCaps": true,
  "tailHold": 0,
  "noZoom": [["0000.png", "0010.png"]],
  "edit": {
    "0000.png": {"scene": "blank", "hold": 1.2, "fade": 0},
    "0010.png": {"scene": "prompt", "hold": 11.0, "fade": 0}
  }
};
