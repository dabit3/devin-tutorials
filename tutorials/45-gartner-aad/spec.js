window.SPEC = {
 "title": "",
 "subtitle": "",
 "introHold": 0,
 "tailHold": 0,
 "outro": "Devin, by Cognition",
 "outroSub": "devin.ai  \u00b7  cognition.com",
 "speed": 1,
 "pace": 1,
 "maxZoom": 1,
 "voSentGap": 0.3,
 "voNatural": false,
 "noSubs": true,
 "noCaps": true,
 "edit": {
  "section01.png": {
   "scene": "section01",
   "hold": 2.5,
   "cursor": false,
   "waitVo": true,
   "fade": 0
  },
  "line01-01.png": {
   "line": 1,
   "hold": 10.116666666666667,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "In this video, I'm going to show you how I build a feature with Devin when I want to stay hands-on: working in the IDE and the terminal next to the agents, instead of handing the whole task off."
  },
  "line02-01.png": {
   "line": 2,
   "hold": 9.8,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "I'll use Devin Desktop and the Devin CLI. Local agents, cloud agents, and other agents like Codex and OpenCode all run here, in one app, with one session list."
  },
  "section02.png": {
   "scene": "section02",
   "hold": 2.5,
   "cursor": false,
   "waitVo": true,
   "fade": 0
  },
  "line03-01.png": {
   "line": 3,
   "hold": 3.95,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "Setup is short. First, I connect GitHub to my Devin organization."
  },
  "line04-01.png": {
   "line": 4,
   "hold": 2.966666666666667,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "Then Devin indexes my repositories in DeepWiki. These are the four repos for an insurance claims app: the Java claims service, the customer web portal, an adjuster desktop app, and an iOS app."
  },
  "line04-02.png": {
   "line": 4,
   "hold": 2.966666666666667,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0
  },
  "line04-03.png": {
   "line": 4,
   "hold": 2.966666666666667,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0
  },
  "line04-04.png": {
   "line": 4,
   "hold": 2.966666666666667,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0
  },
  "line05-01.png": {
   "line": 5,
   "hold": 7.466666666666667,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "DeepWiki gives me, and the agent, an architecture view of each repo. This is the claims service, generated from the code."
  },
  "line06-01.png": {
   "line": 6,
   "hold": 2.933333333333333,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "In Desktop I open the portal and the service in one workspace. DeepWiki is right here in the IDE too."
  },
  "line06-02.png": {
   "line": 6,
   "hold": 2.933333333333333,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0
  },
  "section03.png": {
   "scene": "section03",
   "hold": 2.5,
   "cursor": false,
   "waitVo": true,
   "fade": 0
  },
  "line07-01.png": {
   "line": 7,
   "hold": 8.383333333333333,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "Here's my first task. It's a GitHub issue: let customers upload photos and documents to an open claim. Two sentences, no acceptance criteria."
  },
  "line08-01.png": {
   "line": 8,
   "hold": 2.5833333333333335,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "I pick Devin Local as the agent and switch to Plan mode, so it plans before it writes any code."
  },
  "line08-02.png": {
   "line": 8,
   "hold": 2.5833333333333335,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0
  },
  "line09-01.png": {
   "line": 9,
   "hold": 5.1,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "For the model I pick Fusion, which pairs a frontier model with a faster one to keep the cost down."
  },
  "line10-01.png": {
   "line": 10,
   "hold": 7.333333333333333,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "I ask it to plan this issue across the service and the portal, with acceptance criteria and a task list that shows what can run in parallel."
  },
  "line11-01.png": {
   "line": 11,
   "hold": 9.05,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "Before it writes the plan, it asks me questions: which statuses count as open, where files are stored, which file types and limits. I answer them."
  },
  "line12-01.png": {
   "line": 12,
   "hold": 3.966666666666667,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "Now I have a spec. It has the context it found in both repos, the decisions we made, and twelve acceptance criteria. Each one is testable: status codes, ownership, file types, limits."
  },
  "line12-02.png": {
   "line": 12,
   "hold": 3.966666666666667,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0
  },
  "line12-03.png": {
   "line": 12,
   "hold": 3.966666666666667,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0
  },
  "line13-01.png": {
   "line": 13,
   "hold": 2.9833333333333334,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "And here's the task list. There's a service track and a portal track, and the plan says which tasks depend on each other and which can run at the same time."
  },
  "line13-02.png": {
   "line": 13,
   "hold": 2.9833333333333334,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0
  },
  "line13-03.png": {
   "line": 13,
   "hold": 2.9833333333333334,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0
  },
  "line14-01.png": {
   "line": 14,
   "hold": 3.466666666666667,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "The spec is just a file, so I can edit it. I tighten one criterion: list responses contain attachment metadata only."
  },
  "line14-02.png": {
   "line": 14,
   "hold": 3.466666666666667,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0
  },
  "line15-01.png": {
   "line": 15,
   "hold": 1.1333333333333333,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "Nothing is built until I approve the plan."
  },
  "line15-02.png": {
   "line": 15,
   "hold": 1.1333333333333333,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0
  },
  "section04.png": {
   "scene": "section04",
   "hold": 2.5,
   "cursor": false,
   "waitVo": true,
   "fade": 0
  },
  "line16-01.png": {
   "line": 16,
   "hold": 5.3,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "I approve it, but I scope this local session to the portal screen only. Other agents get the rest."
  },
  "line17-01.png": {
   "line": 17,
   "hold": 2.533333333333333,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "For the service track, I open the Devin CLI in the claims service and point it at the same plan file."
  },
  "line17-02.png": {
   "line": 17,
   "hold": 2.533333333333333,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0
  },
  "line18-01.png": {
   "line": 18,
   "hold": 3.8833333333333333,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "Then I type slash handoff and pick Ubuntu. The CLI packages my conversation, my branch, and my uncommitted changes, and a cloud Devin picks it up in its own VM. My environment comes with me."
  },
  "line18-02.png": {
   "line": 18,
   "hold": 3.8833333333333333,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0
  },
  "line18-03.png": {
   "line": 18,
   "hold": 3.8833333333333333,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0
  },
  "line19-01.png": {
   "line": 19,
   "hold": 2.05,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "The cloud agent is building and testing the API while my laptop stays free."
  },
  "line19-02.png": {
   "line": 19,
   "hold": 2.05,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0
  },
  "line20-01.png": {
   "line": 20,
   "hold": 5.65,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "From Desktop I start a second cloud session for the release notes, so the docs are written alongside the code."
  },
  "line21-01.png": {
   "line": 21,
   "hold": 8.75,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "For the portal's proxy, I use Codex, running inside Devin Desktop through the Agent Client Protocol. It owns the proxy change and its tests."
  },
  "line22-01.png": {
   "line": 22,
   "hold": 5.8,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "Here's the real work side by side: Codex's proxy change, and Devin Local's upload helpers."
  },
  "line23-01.png": {
   "line": 23,
   "hold": 9.45,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "And this is what I mean by one surface. Devin Local, Codex, OpenCode, and my two cloud sessions are all in one session list, each with its status and pull request."
  },
  "line24-01.png": {
   "line": 24,
   "hold": 3.783333333333333,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "The same cloud session is also in the Devin web app, with its PR."
  },
  "section05.png": {
   "scene": "section05",
   "hold": 2.5,
   "cursor": false,
   "waitVo": true,
   "fade": 0
  },
  "line25-01.png": {
   "line": 25,
   "hold": 4.033333333333333,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "While Devin Local is working, I can queue a message. I edit it before it sends: keep it vanilla JavaScript, no new dependencies."
  },
  "line25-02.png": {
   "line": 25,
   "hold": 4.033333333333333,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0
  },
  "line26-01.png": {
   "line": 26,
   "hold": 1.7666666666666666,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "I can also stop it outright."
  },
  "line27-01.png": {
   "line": 27,
   "hold": 7.616666666666666,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "Then I give one correction: the button says \"Upload file\", with a hint for the allowed types and size. It picks up from where it was and makes the change."
  },
  "line28-01.png": {
   "line": 28,
   "hold": 2.6666666666666665,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "OpenCode wrote the customer help page, so I steer it the same way, and it updates the label."
  },
  "line28-02.png": {
   "line": 28,
   "hold": 2.6666666666666665,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0
  },
  "line29-01.png": {
   "line": 29,
   "hold": 10.966666666666667,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "In the CLI, I can ask a quick side question with slash btw, without disrupting the main task. Here I ask where the proxy adds the customer headers, and it answers from the code."
  },
  "section06.png": {
   "scene": "section06",
   "hold": 2.5,
   "cursor": false,
   "waitVo": true,
   "fade": 0
  },
  "line30-01.png": {
   "line": 30,
   "hold": 2.3,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "When the portal work is done, I hand it off from Desktop too. I pick Ubuntu again."
  },
  "line30-02.png": {
   "line": 30,
   "hold": 2.3,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0
  },
  "line31-01.png": {
   "line": 31,
   "hold": 3.283333333333333,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "The cloud agent receives my uncommitted changes, checks all eight files, runs the tests, and opens the pull request."
  },
  "line31-02.png": {
   "line": 31,
   "hold": 3.283333333333333,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0
  },
  "section07.png": {
   "scene": "section07",
   "hold": 2.5,
   "cursor": false,
   "waitVo": true,
   "fade": 0
  },
  "line32-01.png": {
   "line": 32,
   "hold": 3.8,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "Devin fits into my own harness. From Customizations, I open the plugin marketplace and install the official DeepWiki plugin."
  },
  "line32-02.png": {
   "line": 32,
   "hold": 3.8,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0
  },
  "line33-01.png": {
   "line": 33,
   "hold": 3.533333333333333,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "MCP servers are listed here. Plugins can bring their own."
  },
  "line34-01.png": {
   "line": 34,
   "hold": 2.6,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "Hooks run my own scripts on agent events."
  },
  "line35-01.png": {
   "line": 35,
   "hold": 7.0,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "And rules: both repos' AGENTS.md files are always on, so every agent follows the same conventions."
  },
  "line36-01.png": {
   "line": 36,
   "hold": 3.6166666666666667,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "I also want this upload checklist reused next time, so I ask Devin to turn it into a skill. It writes the SKILL.md."
  },
  "line36-02.png": {
   "line": 36,
   "hold": 3.6166666666666667,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0
  },
  "line37-01.png": {
   "line": 37,
   "hold": 3.05,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "And now it shows up in Skills for any future session."
  },
  "section08.png": {
   "scene": "section08",
   "hold": 2.5,
   "cursor": false,
   "waitVo": true,
   "fade": 0
  },
  "line38-01.png": {
   "line": 38,
   "hold": 11.25,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "For context, I generate a Codemap of the upload flow: from the portal, through the proxy, to the controller, the ownership check, validation, and storage. It's built from the code, and each step links back to it."
  },
  "line39-01.png": {
   "line": 39,
   "hold": 6.966666666666667,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "Then I ask Devin Local to test it on my computer. It opens a browser and uploads a real PNG through the file picker."
  },
  "line40-01.png": {
   "line": 40,
   "hold": 5.283333333333333,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "The file shows up on the open claim, with its size, and the request returned 201."
  },
  "section09.png": {
   "scene": "section09",
   "hold": 2.5,
   "cursor": false,
   "waitVo": true,
   "fade": 0
  },
  "line41-01.png": {
   "line": 41,
   "hold": 5.566666666666666,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "The service pull request opens in Desktop's Review. Devin Review found no active bugs here."
  },
  "line42-01.png": {
   "line": 42,
   "hold": 3.933333333333333,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "But the author noted a race at the twenty-file limit, so I ask Review chat to fix it. It drafts a lock and a concurrency test, and I commit it from here."
  },
  "line42-02.png": {
   "line": 42,
   "hold": 3.933333333333333,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0
  },
  "line43-01.png": {
   "line": 43,
   "hold": 1.7,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "Checks pass, and I merge the pull request from Desktop."
  },
  "line43-02.png": {
   "line": 43,
   "hold": 1.7,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0
  },
  "line44-01.png": {
   "line": 44,
   "hold": 9.45,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "On the portal PR, Review flags a critical issue: the demo proxy uses a fixed customer identity. That's a real finding, and it's the kind of thing I'd fix before production."
  },
  "section10.png": {
   "scene": "section10",
   "hold": 2.5,
   "cursor": false,
   "waitVo": true,
   "fade": 0
  },
  "line45-01.png": {
   "line": 45,
   "hold": 7.8,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "Cost control starts with the model. Adaptive routes each request to the right model, and Fusion keeps frontier quality at a lower cost."
  },
  "line46-01.png": {
   "line": 46,
   "hold": 4.916666666666667,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "In the CLI, slash session-stats shows the messages and tokens for the session."
  },
  "line47-01.png": {
   "line": 47,
   "hold": 2.933333333333333,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "Desktop shows my daily and weekly usage."
  },
  "line48-01.png": {
   "line": 48,
   "hold": 3.433333333333333,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "Admins control Desktop from organization settings: which models are allowed, and which MCP servers can be used."
  },
  "line48-02.png": {
   "line": 48,
   "hold": 3.433333333333333,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0
  },
  "line49-01.png": {
   "line": 49,
   "hold": 2.0166666666666666,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "The ACP agent registry, and agent hooks for the whole organization."
  },
  "line49-02.png": {
   "line": 49,
   "hold": 2.0166666666666666,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0
  },
  "line50-01.png": {
   "line": 50,
   "hold": 1.5666666666666667,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "And usage limits."
  },
  "section11.png": {
   "scene": "section11",
   "hold": 2.5,
   "cursor": false,
   "waitVo": true,
   "fade": 0
  },
  "line51-01.png": {
   "line": 51,
   "hold": 12.233333333333333,
   "cursor": true,
   "hl": true,
   "hlDelay": 0.12,
   "fade": 0,
   "vo": "So that's assisted development with Devin: a spec I can read and edit, local, cloud, and ACP agents working in parallel, steering in real time, and review and merge, all from one app and one session list."
  }
 }
};
