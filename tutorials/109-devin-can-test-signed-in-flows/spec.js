window.SPEC = {
 "title": "Devin can test signed-in flows",
 "subtitle": "Log into your staging site safely and test the pages behind it",
 "outro": "Save the login once. Test every signed-in flow.",
 "voOutro": "Save the login once, and Devin can test every signed-in flow.",
 "outroVoDelay": 0.3,
 "tailHold": 0.4,
 "introHold": 0,
 "pace": 1,
 "speed": 3,
 "capMin": 3,
 "voSentGap": 0.45,
 "maxZoom": 1.3,
 "cps": 34,
 "noZoom": [],
 "edit": {
  "s01.png": {
   "vo": "Devin can log into your staging site safely and test signed-in flows.",
   "voDelay": 1.6,
   "scene": "title",
   "hold": 5.87
  },
  "s02.png": {
   "vo": "The pages that matter most, like profile, billing and security settings, sit behind a login.",
   "scene": "wall",
   "hold": 5.55
  },
  "0000.png": {
   "vo": "Here's Larkspur, a demo staging site with a real sign-in page and a dedicated test account.",
   "cursor": false,
   "hold": 2.2
  },
  "0015.png": {
   "hold": 1.8,
   "voSync": 3.2,
   "cursor": false
  },
  "s03.png": {
   "vo": "Save that account's password once in Devin's Secrets, and every new session can sign itself in.",
   "scene": "save",
   "hold": 5.43
  },
  "0016.png": {
   "vo": "In Settings → Secrets, add a secret and choose Organization, so every session in the organization can use it.",
   "voSay": "In Settings, then Secrets, add a secret and choose Organization, so every session in the organization can use it.",
   "hold": 0.8,
   "subPos": "top"
  },
  "0017.png": {},
  "0018.png": {},
  "0019.png": {
   "hl": true
  },
  "0020.png": {},
  "0021.png": {},
  "0022.png": {},
  "0023.png": {},
  "0024.png": {},
  "0025.png": {},
  "0026.png": {},
  "0027.png": {},
  "0028.png": {},
  "0029.png": {
   "vo": "Paste the password as the value. Secrets are encrypted at rest.",
   "subPos": "top"
  },
  "0030.png": {},
  "0031.png": {
   "hold": 1.0
  },
  "0032.png": {
   "vo": "A note tells Devin which account this is and where to sign in.",
   "subPos": "top"
  },
  "0033.png": {},
  "0034.png": {},
  "0038.png": {},
  "0042.png": {},
  "0046.png": {},
  "0050.png": {},
  "0051.png": {},
  "0052.png": {
   "vo": "Redact value keeps the password hidden in the table view.",
   "subPos": "top",
   "hl": true
  },
  "0053.png": {},
  "0054.png": {
   "vo": "Everyone in the organization can use this secret, so use a dedicated test account.",
   "hold": 1.4,
   "subPos": "top"
  },
  "0055.png": {},
  "0056.png": {},
  "0057.png": {
   "hl": true,
   "hold": 2.0
  },
  "s04.png": {
   "vo": "When a session needs to sign in, Devin types the secret straight into the browser, so there's nothing to paste into chat.",
   "scene": "types",
   "hold": 6.42
  },
  "0058.png": {
   "hold": 0.5
  },
  "0061.png": {},
  "0062.png": {
   "vo": "Then ask in plain English: sign in with the saved account, test the account pages, and record the run.",
   "hold": 2.0
  },
  "0072.png": {
   "vo": "Devin signs itself in on its own machine, then works through the profile, billing and security pages like a real user.",
   "hold": 1.6,
   "cam": {
    "x": 1008,
    "y": 400,
    "z": 1.28
   },
   "camDur": 0.6,
   "voDelay": 0.7
  },
  "0073.png": {
   "hold": 1.0
  },
  "0083.png": {
   "hold": 1.0
  },
  "0086.png": {
   "hold": 0.9
  },
  "0101.png": {
   "hold": 0.9
  },
  "0108.png": {
   "hold": 1.0
  },
  "0117.png": {
   "hold": 1.1
  },
  "0167.png": {
   "vo": "It records the browser as it tests, and the recording marks each check as passed or failed.",
   "cam": {
    "x": 600,
    "y": 330,
    "z": 1.25
   },
   "camDur": 0.7,
   "hl": true,
   "hold": 1.2,
   "subPos": "top"
  },
  "0168.png": {},
  "0169.png": {
   "cam": {
    "x": 600,
    "y": 336,
    "z": 1.22
   },
   "camDur": 0.9
  },
  "0171.png": {
   "hold": 0.7
  },
  "0183.png": {
   "hold": 0.7
  },
  "0195.png": {
   "hold": 0.7
  },
  "0203.png": {
   "hold": 0.7
  },
  "0213.png": {
   "vo": "It caught two real bugs. One invoice download fails with a server error, and signing out other sessions leaves them signed in.",
   "hl": [
    {
     "x": 1018,
     "y": 421,
     "w": 450,
     "h": 50
    },
    {
     "x": 1018,
     "y": 616,
     "w": 450,
     "h": 50
    }
   ],
   "cam": {
    "x": 1000,
    "y": 470,
    "z": 1.3
   },
   "camDur": 0.8,
   "hold": 2.0,
   "subPos": "top"
  },
  "0214.png": {
   "vo": "The summary lists what passed and what failed, so your team knows exactly what to fix.",
   "cam": {
    "x": 720,
    "y": 430,
    "z": 1.25
   },
   "camDur": 0.8,
   "hl": true,
   "hold": 2.0,
   "subPos": "top"
  },
  "s05.png": {
   "vo": "For single sign-on or multi-factor logins, log in once in Devin's browser and ask it to save the browser profile. After you approve the blueprint update, every new session starts already signed in.",
   "scene": "profile",
   "hold": 10.86
  }
 }
};
