# Secrets & Site Cookies — voice script

Narrated by Nader Dabit (ElevenLabs voice `T8iHhGIWPm2GVYpQD1Am`). Each line plays over the shot named on the left.

| Shot | Narration |
| --- | --- |
| Home screen | This is Secrets and Site Cookies. Give Devin the credentials it needs, without pasting them in chat. |
| Opening Settings → Secrets | Open Settings, then go to Secrets. |
| Secrets page, Organization tab | Organization secrets are shared with your whole team, and carry over to every future session. |
| Personal tab | Personal secrets only work in sessions you start. |
| Add secret | Click Add secret. |
| Secret scope | Pick a scope. This one is personal. |
| Secret type menu | Then pick a type: a raw secret, a cookie, or a one-time password for two-factor sign-in. |
| Raw secret | A raw secret holds one value, like an API key or a password. |
| Name and value fields | Give it a name, and paste the value. |
| Note field | Add a note, so Devin knows when to use it. |
| Store secret | Click Store secret. |
| ACME_API_KEY in the list | Secrets are encrypted at rest, and the value stays hidden in the dashboard. |
| Add secret again | Site cookies keep Devin signed in to web apps. |
| Type menu | This time, choose Cookie. |
| Cookie name field | Give the cookie a name. |
| Cookie JSON field | Then paste the cookies you exported from your browser, as JSON or base64. |
| 1 cookie parsed | The form parses each cookie, and encodes it for you. |
| Store secret | Store it. |
| Both secrets listed | Now both are ready in any new session you start. Devin types the values straight into the browser, and binds them as environment variables for the commands that need them. |
| Outro | Add a secret once, and let Devin sign in for you. |

The opening line is sent to the voice as "This, is Secrets and Site Cookies. …" (`voSay`) so there's a pause after "This"; the subtitles show the line in `vo`.

## Typed on screen

1. Secret name: `ACME_API_KEY`
2. Secret value: `sk-demo-4f9a2c71e8b0` (a demo value)
3. Note: `Use for the Acme staging API only`
4. Cookie secret name: `ACME_LOGIN_COOKIE`
5. Cookie JSON: `[{"name":"session","value":"demo-8c1f","domain":".acme.dev"}]`

## Sources

- https://docs.devin.ai/product-guides/secrets
