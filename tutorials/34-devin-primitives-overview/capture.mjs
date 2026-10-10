// Proof shots for the primitives overview: Customize tabs (Rules, Memory, Skills, MCPs, Plugins) and Settings (Playbooks).
// Nothing is saved: create dialogs are cancelled. Raw shots go to $OUT; assemble.py builds shots/ with scene placeholders.
//   ZOOM=1.25 MASK_TEXT=<email>,<email name> OUT=<dir> node capture.mjs
import { Rec, sleep } from '../_kit/capture/rec.mjs';
const ORG = process.env.DEVIN_ORG_URL || 'https://app.devin.ai/org/thequantexplorer';
const r = await new Rec(process.env.OUT || 'raw').init();
const p = r.p;

async function open(path) {
  await r.goto(`${ORG}/${path}`, 5000);
  const c = await r.find({ attr: ['aria-label', 'Collapse sidebar'], sel: 'button' });
  if (c) { await p.mouse.click(c.x, c.y); await sleep(1200); }
  await p.mouse.move(1100, 760); r.cur = { x: 1100, y: 760 };
}
// union box (CSS px) of the elements matched by a page-side function, padded
async function ring(fn, pad = 10) {
  return p.evaluate(`(() => { const els = (${fn})().filter(Boolean); if (!els.length) return null;
    const rs = els.map(e => e.getBoundingClientRect()); const x0 = Math.min(...rs.map(q => q.left)) - ${pad}, y0 = Math.min(...rs.map(q => q.top)) - ${pad};
    const x1 = Math.max(...rs.map(q => q.right)) + ${pad}, y1 = Math.max(...rs.map(q => q.bottom)) + ${pad};
    return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 }; })()`);
}
const byText = (t, sel = '*') => `(() => { const m = [...document.querySelectorAll('${sel}')].filter(e => e.getBoundingClientRect().width > 0 && (e.innerText || '').trim() === ${JSON.stringify(t)}); return m.find(e => !m.some(o => o !== e && e.contains(o))); })()`;
const top = () => p.evaluate(() => document.querySelectorAll('[role=dialog], [role=dialog] *').forEach(e => { if (e.scrollTop) e.scrollTop = 0; }));
const insert = async (sel, text) => { const b = await r.box(sel); await p.mouse.click(b.x, b.y); await sleep(300); await p.send('Input.insertText', { text }); await sleep(400); };
const click = async t => { const b = await r.box(t); await p.mouse.click(b.x, b.y); await sleep(2500); };
async function shot(name, fn) { const hlBox = await ring(fn); if (!hlBox) throw new Error('no ring for ' + name); await r.shot({ name, hold: 2, hlBox }); console.log('shot', name, JSON.stringify(hlBox)); }

// Rules: always-on guidance
await open('customize?tab=rules');
await click({ text: 'Create rule', sel: 'main button' });
await insert('input[placeholder="Give your rule a name"]', 'naming-conventions');
await insert('[role=dialog] textarea', 'Name branches feature/<ticket-id>.\nUse the staging environment for previews.');
await top(); await sleep(500);
await shot('rules', `() => [${byText('Trigger')}, ${byText('Applied in every session.')}]`);

// Memory: personal, learned
await open('customize?tab=memory');
await sleep(2000);
await shot('memory', `() => [[...document.querySelectorAll('main *')].find(e => e.children.length === 0 && /^What Devin remembers about you/.test((e.innerText||'').trim())), [...document.querySelectorAll('main h1, main h2, main h3')].find(e => (e.innerText||'').trim().startsWith('Memory'))]`);

await click({ text: 'devin-automations.md', sel: 'main button,main [role=treeitem],main div' });
await shot('memory-file', `() => [[...document.querySelectorAll('main *')].find(e => e.children.length === 0 && /^What Devin remembers about you/.test((e.innerText||'').trim())), [...document.querySelectorAll('main h1, main h2, main h3')].find(e => (e.innerText||'').trim().startsWith('Memory'))]`);


// Skills: create one in Customize
await open('customize?tab=skills');
await click({ text: 'Create skill', sel: 'main button' });
await insert('input[placeholder="Give your skill a name"]', 'test-before-pr');
await insert('input[placeholder="Describe when an agent should use this skill"]', 'Run the tests before opening any PR.');
await insert('[role=dialog] textarea', '1. Install dependencies\n2. Run the test suite\n3. Fix any failures before opening the PR');
await top(); await sleep(500);
await shot('skills', `() => [document.querySelector('input[placeholder="Give your skill a name"]'), ${byText('Allow Devin to use this skill automatically', 'label,div,span,p')}]`);

// Playbooks: settings list with a macro
await open('settings/playbooks');
await shot('playbooks', `() => [[...document.querySelectorAll('tr,[role=row]')].filter(e => /!before-after/.test(e.innerText||'')).pop(), ${byText('Create playbook', 'button,a')}]`);

// MCPs: add menu
await open('customize?tab=mcps');
await click({ text: 'Add MCP', sel: 'main button' });
await shot('mcps', `() => [document.querySelector('[role=menu]')]`, 6);

// Plugins: scopes + add menu
await open('customize?tab=plugins');
await shot('plugins-scope', `() => [${byText('Personal', 'main button,main [role=tab]')}, ${byText('Organization', 'main button,main [role=tab]')}]`, 6);
await click({ text: 'Add plugin', sel: 'main button' });
await shot('plugins', `() => [document.querySelector('[role=menu]')]`, 6);
process.exit(0);
