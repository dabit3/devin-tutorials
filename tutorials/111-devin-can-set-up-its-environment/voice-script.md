# Voice script: Devin can set up its own dev environment

Narrated by Nader (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`, model from `_kit/settings.json`), generated as one take and cut per line.

- `0000.png`: Devin can set up its own dev environment from a fresh repo. Every session starts on a clean machine, so without a saved setup, each one has to rediscover the runtimes, services and settings.
- `0001.png`: You ask in plain English, Devin tests a setup, you approve it, and a snapshot build saves it.
- `0002.png`: Here I point Devin at a fresh repo and ask for services running and tests passing in every new session.
- `0003.png`: Devin explores on its own, checking for Node, Docker and Postgres, and running the tests to see what breaks.
- `0004.png`: Node is missing, and so is a database URL, so Devin writes a blueprint plan that fixes both.
- `0005.png`: A blueprint holds one-time installs, steps that run on every build, and the commands to test and start the app.
- `0006.png`: Devin asks to test it on a clean machine first, and I approve.
- `0008.png`: On fresh machines it goes from a clean clone to passing tests.
- `0009.png`: Then saving the blueprint starts a snapshot build.
- `0010.png`: The first build failed: Docker Hub rate limited an image pull.
- `0015.png`: Retries didn't help, so I asked, in plain English, for a mirror that isn't rate limited.
- `0016.png`: Devin switched to a mirror and tested it with Docker Hub blocked.
- `0021.png`: This time the snapshot build succeeds and becomes active.
- `0022.png`: Now a brand new session: check the services and run the tests, with no setup.
- `0023.png`: Postgres and Redis are already running, and both tests pass. Nothing had to be installed.
- outro: Set it up once, and every new session starts ready.
