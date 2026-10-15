# Docs that test themselves (overview): voice script

Voice: Nader (`T8iHhGIWPm2GVYpQD1Am`), generated as one take with `_kit/tools/vo_onetake.py`, ElevenLabs default settings.

## How it works

- Docs that test themselves means every code snippet on every docs page is run exactly as written, on a fresh machine, so you find out which examples are broken before your users do.
- One Devin coordinates the run, and it starts a managed Devin for each docs page, each on its own fresh VM, all in parallel.

## A real run

- Here's a real run on a small invoicing SDK, where we planted two broken examples on purpose.
- The coordinator starts five managed Devins, one per page.
- Each one installs the SDK from scratch and runs every snippet, and here the invoices page fails.

## Docs or SDK

- When a snippet fails, Devin works out whether the page is stale or the SDK has a bug, and the answer decides what the pull request fixes.
- That page still used a parameter name the SDK had renamed, so its pull request fixes the docs.
- The quickstart exposed a real bug in the SDK, so that pull request fixes the code and adds a test.
- The coordinator collects the results into one summary.

## Make it repeatable

- To keep it that way, save the procedure as a playbook, and create an automation that runs it whenever the docs change, and on a schedule.
- Here's the automation Devin created, with both triggers.

## What you can use it for

- It works for SDK docs, README quickstarts, API guides, and step-by-step tutorials.

## Outro

- Docs that stay true to your code.

## Prompts typed on screen (real run, from tutorial 36)

1. `@thequantexplorer/product-demo-apps Test the docs in ledgerkit/. For every page in ledgerkit/docs/, start a managed Devin on its own fresh machine that runs each code snippet exactly as written. When a snippet fails, decide whether the docs or the SDK is wrong and open a PR that fixes the right one. Then send me a summary.`
2. `Make this repeatable: save it as a playbook and create an automation that runs it whenever ledgerkit/docs/ changes on main, and every Monday.`

## Disclosure

Both failures were planted on purpose in the demo SDK: a docs page that still uses a renamed parameter, and a `subtotal()` that ignores quantity.

## Sources

- Managed Devins: https://docs.devin.ai/work-with-devin/advanced-capabilities
- Playbooks: https://docs.devin.ai/product-guides/creating-playbooks and https://docs.devin.ai/product-guides/using-playbooks
- Automations: https://docs.devin.ai/product-guides/automations
