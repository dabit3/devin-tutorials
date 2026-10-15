# Docs that test themselves: voice script

Voice: Nader (`T8iHhGIWPm2GVYpQD1Am`), generated as one take with `_kit/tools/vo_onetake.py`, ElevenLabs default settings.

## Intro

- Docs that test themselves means every code snippet on every docs page gets run exactly as written, on a fresh machine, and each broken one comes back as a pull request that fixes either the docs or the SDK.
- It works for SDK docs, README quickstarts, API guides, and step-by-step tutorials.
## The run

- Our demo is a small Python invoicing SDK with five docs pages, and we planted two broken examples on purpose.
- I ask Devin to start a managed Devin for each page, on its own fresh machine, run every snippet exactly as written, and open a pull request that fixes whichever side is wrong.
- The coordinator reads the SDK, the docs, and the changelog first, so it can brief each Devin.
- Then it starts five managed Devins, one per docs page, each on its own fresh VM.
- Each one makes a fresh virtual environment, installs the SDK, and runs every snippet on its page, comparing the output with what the docs say.
- In the invoices Devin's shell, the first snippet fails, because the page still passes a keyword that the SDK has since renamed.
- The changelog shows the rename was deliberate, so the docs are wrong, and after the fix both snippets print exactly what the page says.
- So its pull request is a one-line docs fix.
- The quickstart printed the wrong total, because the subtotal ignored each line's quantity, against its own docstring, so that pull request fixes the SDK and adds a regression test.
## The summary

- The coordinator collects everything into one summary: three pages passed as written, one had a docs bug, and one found an SDK bug, each with its pull request.
- It also tried both fixes together, and all eight tests and every snippet passed.
## Make it repeatable

- To make it repeatable, I ask Devin to save this as a playbook, and to create an automation that runs it whenever the docs change on main, and every Monday.
- Devin writes the playbook from the run it just did, and I approve it.
- Then it drafts the automation, with a push trigger for changes to the docs folder on main, and a weekly schedule on Mondays.
- Once I approve it, the automation is created, and its next run is already scheduled.
- The automation's page shows both triggers, and every run it starts.
- I started one manual run, and it followed the playbook and started five fresh Devins again.

## Outro

- Docs that stay true to your code.

## Prompts typed on screen

1. `@thequantexplorer/product-demo-apps Test the docs in ledgerkit/. For every page in ledgerkit/docs/, start a managed Devin on its own fresh machine that runs each code snippet exactly as written. When a snippet fails, decide whether the docs or the SDK is wrong and open a PR that fixes the right one. Then send me a summary.`
2. `Make this repeatable: save it as a playbook and create an automation that runs it whenever ledgerkit/docs/ changes on main, and every Monday.`

## Disclosure

The demo SDK (`ledgerkit/` in thequantexplorer/product-demo-apps) has two problems we planted on purpose: `docs/invoices.md` still uses `Invoice(customer=...)` after the 0.3.0 rename to `customer_id=` (in the CHANGELOG), and `Invoice.subtotal()` ignores quantity, which contradicts its docstring.

## Sources

- Managed Devins: https://docs.devin.ai/work-with-devin/advanced-capabilities
- Playbooks: https://docs.devin.ai/product-guides/creating-playbooks and https://docs.devin.ai/product-guides/using-playbooks
- Automations: https://docs.devin.ai/product-guides/automations
