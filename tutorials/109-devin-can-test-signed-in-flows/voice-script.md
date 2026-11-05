# Devin can log into your staging site safely and test signed-in flows

Nader voice (`T8iHhGIWPm2GVYpQD1Am`, model from `_kit/settings.json`, eleven_multilingual_v2). The whole script is one ElevenLabs take from `_kit/tools/vo.py`, cut locally at sentence boundaries. Music: Nader's `2-upbeat.mp3`, laid under the narration + SFX bed by `tools/make109.sh`.

Demo: Larkspur, a small staging account portal (`thequantexplorer/product-demo-apps/dc109-staging-portal`) with a real login and a dedicated test account `qa@larkspur.test`. Its password was saved as an Organization secret; a fresh session signed itself in, tested Overview, Profile, Billing and Security, recorded the run, and found two real bugs (INV-1042 download returns HTTP 500; "Sign out of other sessions" leaves other sessions signed in).

## Title

Devin can log into your staging site safely and test signed-in flows.

## Behind the login (diagram)

The pages that matter most, like profile, billing and security settings, sit behind a login.

## The staging site (real)

Here's Larkspur, a demo staging site with a real sign-in page and a dedicated test account.

## Save it once (diagram)

Save that account's password once in Devin's Secrets, and every new session can sign itself in.

## Settings → Secrets (real)

In Settings → Secrets, add a secret and choose Organization, so every session in the organization can use it.

## Value

Paste the password as the value. Secrets are encrypted at rest.

## Note

A note tells Devin which account this is and where to sign in.

## Redact value

Redact value keeps the password hidden in the table view.

## Organization scope

Everyone in the organization can use this secret, so use a dedicated test account.

## Used, not pasted (diagram)

When a session needs to sign in, Devin types the secret straight into the browser, so there's nothing to paste into chat.

## The ask (real)

Then ask in plain English: sign in with the saved account, test the account pages, and record the run.

## Devin signs in and tests (real Computer tab)

Devin signs itself in on its own machine, then works through the profile, billing and security pages like a real user.

## The recording (real)

It records the browser as it tests, and the recording marks each check as passed or failed.

## Findings (real)

It caught two real bugs. One invoice download fails with a server error, and signing out other sessions leaves them signed in.

## Summary (real)

The summary lists what passed and what failed, so your team knows exactly what to fix.

## For SSO and MFA (diagram)

For single sign-on or multi-factor logins, log in once in Devin's browser and ask it to save the browser profile. After you approve the blueprint update, every new session starts already signed in.

## Outro

Save the login once, and Devin can test every signed-in flow.

Sources: docs.devin.ai/product-guides/secrets, docs.devin.ai/work-with-devin/browser-auth.
