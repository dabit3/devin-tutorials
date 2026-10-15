window.SPEC = {
  "title": "Job-market pulse",
  "subtitle": "Hiring, layoffs and job hunting on X, counted live",
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
    "0001.png": {
      "scene": "pipeline",
      "hold": 9,
      "cursor": false,
      "cap": "X search to Modal to a web page",
      "vo": "Here's how it works. Grok searches X through the xAI API. A Modal Cron job runs every hour, and dot map fans the searches and labels out in parallel. Each run is saved to a Modal Volume, and a web endpoint serves the page.",
      "voSay": "Here's how it works. Grok searches X through the ex A I API. A Modal Cron job runs every hour, and dot map fans the searches and labels out in parallel. Each run is saved to a Modal Volume, and a web endpoint serves the page."
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
      "hold": 3,
      "cursor": false,
      "cap": "modal.Cron: every hour",
      "vo": "In the code, a Modal Cron schedule runs the collection every hour."
    },
    "0005.png": {
      "hold": 3,
      "cursor": false,
      "cap": ".map(): six searches in parallel",
      "vo": "And search dot map runs the six searches in parallel."
    },
    "0006.png": {
      "hold": 1.8,
      "cursor": false,
      "cap": "Pull request #72",
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
