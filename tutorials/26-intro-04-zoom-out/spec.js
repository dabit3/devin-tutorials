// Intro prototype #04 "Zoom out" for Tutorial 26 (Devin across the SDLC).
// One continuous Powers-of-Ten zoom: a real PR's test checklist -> the PR -> the Test stage of the
// lifecycle -> one Devin among many -> back onto the 26 overview layout it hands off to.
// Render the scene alone: frames from cues.intro + 72 (first UI frame) for SCENE_SECONDS.
window.SPEC = {
  "title": "Devin across the SDLC",
  "subtitle": "A connected system, from code understanding to production feedback",
  "introHold": 0.5,
  "pace": 1,
  "noCaps": true,
  "noZoom": [["0081.png", "0081.png"]],
  "edit": {
    "0081.png": {"scene": "zoomout", "hold": 15.8}
  }
};
