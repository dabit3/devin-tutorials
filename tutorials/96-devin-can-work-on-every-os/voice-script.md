# Voice script: Devin can work on Linux, macOS and Windows machines from one place (overview)

Narrated cut: `96-devin-can-work-on-every-os-nader.mp4` (voice `T8iHhGIWPm2GVYpQD1Am`, model from `_kit/settings.json`). The whole script is one ElevenLabs take from `_kit/tools/vo.py`, cut locally into lines; every line passed the transcript and sentence-cut checks. Numbers are spelled out for speech via `voSay`.

Story: one request (check ledgerkit, a small Python invoicing SDK in thequantexplorer/product-demo-apps) sent to three Devin sessions, one each on Ubuntu, macOS and Windows. All three ran the 8 tests (passed), exported a CSV and flagged the same unfixed subtotal bug.

## Lines

| Shot | Visual | Line |
|---|---|---|
| 0000 | Title card, then diagram: Devin fans out to Ubuntu, macOS, Windows | Devin can work on Linux, macOS and Windows machines from one place. Every session gets its own machine: Ubuntu by default, or macOS or Windows when your work needs them. |
| 0010 | Real UI: home, the configuration menu under the prompt box | You pick the machine from the menu under the prompt box. |
| 0013 | Real UI: Virtual environment → Hosted: Ubuntu, macOS, Windows; picking Windows | Under Virtual environment, the hosted options are Ubuntu, macOS and Windows. |
| 0017 | Real UI: Windows set | Here, Windows is set for the next session. |
| 0020 | Diagram: one request → three sessions (Ubuntu, macOS, Windows) | To see it in action, we gave three Devins the same request, one per OS: run the tests for ledgerkit, a small Python invoicing library, export a sample invoice to CSV, and report back without changing any code. |
| 0030 | Real UI: the request in the composer, sent | Here's that request going to the Windows machine. |
| 0032 | Real UI: the Windows session checking python, ver and powershell | Early on, Devin checks the machine itself: its Python, its Windows version and its shell. |
| 0040 | Real UI: Ubuntu reply (OS, Python, 8 passed), then its CSV | On Ubuntu 22.04 with Python 3.10, all eight tests passed and the CSV came back. |
| 0050 | Real UI: macOS reply (OS, Python, 8 passed), then its CSV | On macOS 26 on Apple silicon, with Python 3.9, the same eight tests passed. |
| 0055 | Real UI: Windows reply (OS, Python, 8 passed) | And on Windows Server 2022 with Python 3.13, all eight passed again. |
| 0056 | Real UI: Windows setup notes | Devin also noted what Windows needed: python instead of python3, and a different path to activate the virtual environment. |
| 0060 | Diagram: the three replies side by side, and the shared bug | Three machines, one answer. And all three flagged the same bug this demo app ships with: the invoice subtotal ignores quantity. |
| 0070 | Diagram: four use cases with their OS (from docs.devin.ai) | Use it to check a library on every OS before a release, to build Mac and iOS apps with Xcode and the Simulator, or to test Windows desktop apps, with the same Computer Use on every machine. |
| outro | Ending card | Pick the machine your work needs, and Devin does the work there, all from one place. |

## Real sessions (thequantexplorer)

- ubuntu: https://app.devin.ai/sessions/7ae7640659944872829cf69aa558e70d
- macos: https://app.devin.ai/sessions/9b0a4e2b46d648fe85fccfb077979994
- windows: https://app.devin.ai/sessions/c828756b9a1d44699762a428eba901e3

## Sources

- Platform support and Computer Use on Linux, macOS and Windows: https://docs.devin.ai/work-with-devin/computer-use
- macOS (Xcode, iOS Simulator): https://docs.devin.ai/onboard-devin/environment/macos-support
- Windows (native apps such as WPF and WinForms; currently available on a limited basis): https://docs.devin.ai/onboard-devin/environment/windows-support
