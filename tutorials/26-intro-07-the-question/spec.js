// Intro prototype #07 "The question": plays before Tutorial 26's overview and lands on its settled layout.
// Standalone render: introHold 0 skips the kit's title card; make.sh trims the kit's 1.2 s window entrance (sceneLead).
window.SPEC = {
  "title": "What happens after the code is written?",
  "subtitle": "Intro prototype",
  "introHold": 0,
  "sceneLead": 1.2,
  "pace": 1,
  "tailHold": 0,
  "noCaps": true,
  "noZoom": [["0010.png", "0010.png"]],
  "edit": {
    "0010.png": {"scene": "question", "hold": 13.4}
  }
};
