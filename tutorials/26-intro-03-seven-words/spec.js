// Intro prototype #03 "Seven words" for Tutorial 26 (Devin across the SDLC).
// One scene beat (scenes.js: sevenWords), timed to the kicks of 2-upbeat.mp3 played from 0:00.
// In this standalone folder the kit's title card + window rise occupy the first 1.2 s of the beat,
// so `introLead` shifts the scene clock and build-intro.sh trims those frames. Dropped into
// Tutorial 26 as a beat, leave introLead unset so the scene clock starts at the beat.
window.SPEC = {
  "title": "Devin across the SDLC",
  "subtitle": "Seven words",
  "introHold": 0,
  "introLead": 1.2,
  "pace": 1,
  "noCaps": true,
  "tailHold": 0,
  "edit": {
    "0005.png": { "scene": "sevenWords", "hold": 14.5 }
  }
};
