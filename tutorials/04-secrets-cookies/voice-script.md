# Secrets & Site Cookies — voice script

Voice: Nader Dabit (ElevenLabs `T8iHhGIWPm2GVYpQD1Am`), default settings, generated as one take with `_kit/tools/vo_onetake.py` and cut into the lines below (each line passed the speech-to-text check).

| Shot | On screen | Line |
|---|---|---|
| 0000 | Devin home, sidebar collapsed | Secrets give Devin the passwords, API keys and site cookies it needs, without pasting them into chat. |
| 0001 | Sidebar → Settings → Secrets | To add one, open Settings → Secrets. *(said: "open Settings, then Secrets")* |
| 0008 | "Reference a secret with a dollar sign" highlighted | Any secret can be referenced by its name, with a dollar sign in front. |
| 0009 | Organization / Personal tabs highlighted | Organization secrets are shared with your whole team. Personal secrets only work in sessions you start. |
| 0010 | Add secret → scope Personal | Click Add secret, and set the scope to Personal. |
| 0016 | Secret type menu highlighted | Then pick a type: a raw secret, a cookie, or a one-time password for two-factor sign-in. |
| 0019 | Secret name, value and note fields | A raw secret holds one value, like an API key. Give it a name, the value, and a note so Devin knows when to use it. |
| 0040 | Redact value switch highlighted (on by default) | Secrets are encrypted, and Redact value is on by default, so the value stays hidden in the dashboard. |
| 0044 | ACME_API_KEY row under Personal highlighted | The new secret shows up under Personal, with its note, and never its value. |
| 0045 | Add secret → Secret type → Cookie | Site cookies keep Devin signed in to web apps. Add another secret, and this time choose Cookie. |
| 0052 | "Cookie secrets" notice highlighted | Name it, then paste the cookies you exported from your browser, as JSON or base64. |
| 0063 | "1 cookie parsed" preview highlighted | The form parses each cookie, and encodes it for you. |
| 0067 | Both secrets listed under Personal | Now both are ready in any new session you start. Devin types the values straight into the browser, and binds them as environment variables for the commands that need them. |
| outro | | Add a secret once, and let Devin sign in for you. |

## Typed on screen (fake demo values only, deleted after recording)
- Secret name: `ACME_API_KEY`
- Secret value: `sk-demo-4f9a2c71e8b0` (shown masked as dots)
- Note: `Use for the Acme staging API only`
- Cookie secret name: `ACME_LOGIN_COOKIE`
- Cookie JSON (pasted, shown masked): `[{"name":"session","value":"demo-8c1f","domain":".acme.dev"}]`

Source: https://docs.devin.ai/product-guides/secrets
