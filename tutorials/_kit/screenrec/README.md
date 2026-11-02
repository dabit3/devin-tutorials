# screenrec

Real-time capture for short silent screen recordings (tutorials 113–116).

- `screc.mjs`: CDP screencast recorder (1152×648 CSS px at device scale factor 5 → 5760×3240 JPEG frames) that also drives an eased pointer, clicks, wheel and typing and logs them to `events.jsonl`.
- `take.mjs <dir> "<prompt>"`: types the prompt on the Devin home page, sends it, and records the session until an inline artifact iframe appears and Devin goes idle.
- `int113.mjs`–`int116.mjs`, `rev113.mjs`, `watch.mjs`: artifact interaction takes. `ifr.mjs` reads the artifact iframe (its own CDP target) so the game take can pick the right answer.
- `comp.py <edl.json>`: compositor. Segments of one or more takes with speed factors, eased camera keyframes (`take:mark±s`), cursor sprite and click rings, encoded to silent H.264 4K60 plus a 1080p preview.
- `prender.sh <edl.json> [jobs]`: renders `comp.py` in parallel chunks and concatenates them.
