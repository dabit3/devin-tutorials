import { Rec, sleep } from '../_kit/capture/rec.mjs';
import { ensureAgent, clearComposer, closeMenus } from '../_kit/capture/composer.mjs';

const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const r = await new Rec('shots').init();
const p = r.p;

await r.goto(ORG, 3000);
await closeMenus(p); await clearComposer(p); await sleep(400);
await ensureAgent(r);
await p.mouse.move(720, 600);
await r.shot({ hold: 1.0 });

await r.click({ text: 'Customize', sel: 'nav a, aside a, a' }, { pre: { cap: 'Open Customize from the sidebar' }, wait: 2000 });
await r.click({ text: 'MCPs', sel: 'main a' }, { pre: { cap: 'MCPs connect Devin to your tools and data' }, wait: 1800 });
await r.point({ text: 'Organization', sel: 'main a' }, { cap: 'Install just for you, or for your whole organization' });
await sleep(400);

await r.click({ text: 'Add MCP', sel: 'main button' }, { pre: { cap: 'Click Add MCP' }, wait: 900 });
await r.shot({ hold: 1.2 });
await r.click({ text: 'Add custom MCP', exact: false, sel: '[role=menuitem]' }, { pre: { cap: 'Bring your own server with a custom MCP' }, wait: 1500 });
await r.shot({ hold: 1.2 });
await r.click({ text: 'STDIO', sel: 'button' }, { pre: { cap: 'Connect over STDIO, SSE, or streamable HTTP' }, wait: 900 });
await r.shot({ hold: 1.4 });
await p.keyboard.press('Escape'); await sleep(500);
await r.click({ text: 'Cancel', sel: 'button' }, { wait: 1200 });

await r.click({ text: 'Add MCP', sel: 'main button' }, { pre: { cap: 'Or pick a ready-made server from the marketplace' }, wait: 900 });
await r.click({ text: 'From plugin marketplace', exact: false, sel: '[role=menuitem]' }, { wait: 2500 });
await r.shot({ hold: 1.6, cap: 'Browse hundreds of MCP servers' });
await r.click('main input', { pre: { cap: 'Search for the tool you need' }, wait: 400 });
await r.type('context7', { every: 2 });
await sleep(1200);
await r.shot({ hold: 0.8 });
await r.click({ text: 'Install', sel: 'main button' }, { pre: { cap: 'Click Install and choose a scope' }, wait: 1000 });
await r.shot({ hold: 1.4 });
await r.click({ text: 'Install for me', exact: false, sel: '[role=menuitem]' }, { wait: 1400 });
await r.shot({ hold: 1.2, cap: 'Review what the plugin can access' });
await r.click({ text: 'I understand', exact: false, sel: '[role=dialog] label, [role=dialog] button[role=checkbox], [role=dialog] input' }, { pre: { cap: 'Confirm, then install' }, wait: 600 });
await r.click({ text: 'Install for me', sel: '[role=dialog] button' }, { wait: 2500 });
await r.poll(8000, 1000, {});
r.mark('installed', { hold: 1.6, cap: 'Context7 is installed' });

await r.goto(`${ORG}/customize?tab=mcps`, 3000);
await r.shot({ hold: 2.4, cap: 'Its tools are now available in every session' });
r.done();
console.log('beats', r.beats.length);
