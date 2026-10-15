window.SPEC = {
  "title": "Job-market pulse",
  "subtitle": "Hiring, layoffs and job hunting on X, counted from sampled posts",
  "eyebrow": "Modal + xAI",
  "dark": true,
  "outro": "Your own job-market numbers",
  "voOutro": "Your own job-market numbers, every hour.",
  "speed": 3,
  "edit": {
    "0000.png": {
      "scene": "intro",
      "hold": 7,
      "cursor": false,
      "cap": "Three buckets, tallied by role, company and skill",
      "vo": "This is a job-market pulse. Every hour it samples tech posts on X, sorts them into hiring, layoffs and looking for work, and counts the roles, companies and skills they mention. You get your own up-to-date numbers, instead of waiting for a monthly report."
    },
    "0001a.png": {
      "scene": "modal",
      "hold": 4,
      "cursor": false,
      "cap": "Modal runs it hourly, in parallel, with no server",
      "vo": "Why Modal? The app has to wake up every hour and make many Grok calls. Then it has to store the results and serve them on a page. A laptop script stops when the lid closes, and your own server sits idle most of the day. On Modal, the collection is a scheduled function, so there's nothing to keep running. Dot map runs the xAI calls in parallel across containers. A Modal Volume stores each run, and a Modal Secret holds the xAI key. A web endpoint serves the page at a public URL. And between runs it scales to zero, so you only pay for the seconds it works.",
      "voSay": "Why Modal? The app has to wake up every hour and make many Grok calls. Then it has to store the results and serve them on a page. A laptop script stops when the lid closes, and your own server sits idle most of the day. On Modal, the collection is a scheduled function, so there's nothing to keep running. Dot map runs the ex A I calls in parallel across containers. A Modal Volume stores each run, and a Modal Secret holds the ex A I key. A web endpoint serves the page at a public URL. And between runs it scales to zero, so you only pay for the seconds it works."
    },
    "0001.png": {
      "scene": "pipeline",
      "hold": 9,
      "cursor": false,
      "cap": "X search, Grok, then Modal",
      "vo": "Here's how the pieces connect. Every hour, the scheduled function asks Grok to search X through the xAI API. Dot map classifies the posts in parallel. Each run lands in the Volume, and the web endpoint reads it to serve the page.",
      "voSay": "Here's how the pieces connect. Every hour, the scheduled function asks Grok to search X through the ex A I API. Dot map classifies the posts in parallel. Each run lands in the Volume, and the web endpoint reads it to serve the page."
    },
    "0002.png": {
      "hold": 3.0,
      "cursor": false,
      "cap": "One plain prompt to Devin",
      "vo": "Devin built it from one plain prompt in the demo apps repo."
    },
    "0003.png": {
      "hold": 3.5,
      "cursor": false,
      "cap": "Tests, modal deploy, then the public URL",
      "vo": "It ran the tests, deployed with modal deploy, and checked the public URL."
    },
    "0004.png": {
      "skip": true
    },
    "0005.png": {
      "skip": true
    },
    "0006.png": {
      "hold": 1.8,
      "cursor": false,
      "cap": "Deployed, with PR #72 open",
      "vo": "It all landed in one pull request."
    },
    "0007.png": {
      "hold": 4.5,
      "cursor": false,
      "cap": "78 sampled posts in the last 24 hours",
      "vo": "The page shows seventy-eight sampled posts from the last day. Fifty-eight are about hiring, and twenty are about layoffs.",
      "capPos": {
        "x": 0.68,
        "y": 0.055
      },
      "subPos": {
        "x": 0.68,
        "y": 0.055
      }
    },
    "0008.png": {
      "hold": 2.3,
      "cursor": false,
      "cap": "Sampled posts per hourly run",
      "vo": "A chart counts the posts from each hourly run.",
      "capPos": {
        "x": 0.3,
        "y": 0.86
      },
      "subPos": {
        "x": 0.3,
        "y": 0.86
      }
    },
    "0009.png": {
      "scene": "honest",
      "hold": 5,
      "cursor": false,
      "vo": "These are counts of posts in a sample, not labor statistics. And the page never names anyone who posted about layoffs or job hunting.",
      "cap": "Counts of sampled posts, never names"
    },
    "0010.png": {
      "scene": "extend",
      "hold": 13.5,
      "cursor": false,
      "vo": "To take it further, track one role over time, such as forward deployed engineers. You could post a weekly digest to Slack. You could split the counts by region or seniority. And you could get an alert when a skill suddenly spikes.",
      "cap": "Four ways to extend it"
    }
  }
};
