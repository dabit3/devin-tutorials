# Devin can do recurring chores on a schedule, set up in plain English

Nader voice (`T8iHhGIWPm2GVYpQD1Am`, model from `_kit/settings.json`: eleven_multilingual_v2, default settings). The whole script is one continuous ElevenLabs take (one request, no seed), cut locally at sentence boundaries by `_kit/tools/vo.py`, which also runs the transcript and sentence-cut checks. One narrated cut, mixed with Nader's `2-upbeat.mp3` track by `tools/make101.sh`.

## Title card, then the weekly diagram

Devin can do recurring chores on a schedule, set up in plain English.

## Diagram: plain English to automation to session to PR

You describe the chore once, and Devin turns it into an automation: a schedule, plus instructions that every run follows.

## Real UI: the request typed in plain English

Here's ours, typed as a normal request: every Monday at nine, upgrade the npm dependencies in our ledger API, fix what breaks, run the tests, and open a pull request.

## Real UI: Devin drafts the automation card

Devin drafts the automation as a card, with the trigger and the instructions, for me to approve.

## Real UI: automation created

I approve it, and the automation is created, with its first run set for next Monday.

## Real UI: Automations list

It now appears in the Automations list.

## Real UI: automation page

Its page shows the Monday trigger, the instructions, and every run so far.

## Real UI: Run now

Rather than wait for Monday, I started a run with Run now.

## Real UI: run event

Each run is logged as an event and gets its own Devin session.

## Real UI: the run's Devin session

In this run, Devin upgraded Express to version five, checked the code against its breaking changes, ran the tests, and opened a pull request.

## Real UI: GitHub PR #7 summary

The pull request lists each package with its old and new version.

## Real UI: GitHub PR #7 checks

CI passed on the branch, so the upgrade is ready for a person to review.

## Diagram: other chores (examples)

Any chore you can describe works the same way, like a nightly test run, a weekly cleanup of stale branches, or a Friday summary of merged pull requests.

## Outro card

Describe the chore once, and Devin will do it on schedule.
