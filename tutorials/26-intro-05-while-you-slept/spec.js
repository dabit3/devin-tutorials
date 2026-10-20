// Intro prototype #05 "While you slept" for Tutorial 26 (Devin across the SDLC).
// One scene beat. The prototype cut skips the kit title card: render 30 fps frames from 84 (introEnd + sceneOffset) for 13 s, then mux 2-upbeat.mp3 from 0:00 with a 1.2 s fade.
window.SPEC = {
  "title": "While you slept",
  "subtitle": "Intro prototype for Devin across the SDLC",
  "outro": "Devin does the work. Your team decides what ships.",
  "introHold": 0.2,
  "pace": 1,
  "noCaps": true,
  "tailHold": 0,
  "noZoom": [["0010.png"]],
  // scene seconds that elapse while the kit's title card hands over; the scene's own clock starts after them
  "sceneOffset": 1.2,
  "edit": {
    "0010.png": {"scene": "whileYouSlept", "hold": 15}
  }
};
