# Taming flaky tests — narration

Nader voice (`T8iHhGIWPm2GVYpQD1Am`, eleven_multilingual_v2, default settings). The whole script is one ElevenLabs take, cut locally at sentence boundaries. One narrated cut, with Nader's `2-upbeat.mp3` track ducked under the voice.

## Opening

Devin can track down a flaky test and prove it's fixed. A flaky test passes most of the time and fails now and then, so one green run proves nothing.

## How Devin works it

Devin treats it like an investigation. It reproduces the failure with repeated runs, finds the root cause, fixes the code, and then proves the fix with the same runs.

## Proof — the task

For this demo, we planted a race in a small inventory app, and asked Devin to fix its flaky checkout test without changing the test.

## Proof — repeated runs

Devin starts by running the suite two hundred times, to measure how often the test fails.

## Root cause (diagram)

The failures point to a race. Reserving stock reads the count and writes it back in two separate steps. When the first write is slow, a second click still reads five units, and both orders succeed.

## Proof — Devin explains the race

Devin's summary explains the root cause in plain terms, including the timing that triggers it.

## Proof — the fix

The fix makes reservations for the same item run one after another, and the test stays exactly as it was.

## Proving the fix (diagram)

To prove it, Devin opened a pull request whose first commit only adds a CI check that runs the suite fifty times. That check failed on the original code. Then Devin pushed the fix to the same pull request.

## Proof — CI fails before the fix

In the session, you can see the check fail before the fix goes in.

## Proof — CI passes after

After the fix, the same check passes.

## Proof — local reruns

And locally, failures dropped from eighteen in two hundred runs to zero in two hundred.

## Recap

So when a test fails one run in eight, ask Devin to measure it, explain it, fix it, and prove it.

## Outro

Fixed and proven, not just green once.
