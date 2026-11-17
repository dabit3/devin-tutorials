import { DirectPage } from './direct-page.mjs';

const p = await DirectPage.connect(9335);
const composer = '[contenteditable="true"][aria-label="Prompt"]';
async function draft(text) {
  await p.click(composer);
  await p.evaluate(selector => {
    const e = [...document.querySelectorAll(selector)].find(e => e.getBoundingClientRect().width);
    e.focus();
    const range = document.createRange();
    range.selectNodeContents(e);
    const selection = getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }, composer);
  if (text) await p.type(text);
  else await p.key('BackSpace');
  const matches = text.trim() ? `e.innerText.trim()===${JSON.stringify(text.trim())}` : `!e.querySelector('[data-slate-string]')`;
  await p.wait(`()=>[...document.querySelectorAll(${JSON.stringify(composer)})].some(e=>e.getBoundingClientRect().width&&(${matches}))`);
}
async function select(title) {
  const selector = `[data-slot="sidebar-menu-button"] [title=${JSON.stringify(title)}]`;
  await p.evaluate(selector => document.querySelector(selector).scrollIntoView({ block: 'nearest' }), selector);
  await p.click(selector);
  await p.wait(`()=>document.body.innerText.startsWith(${JSON.stringify(`Agents\n${title}`)})`);
}
async function pin(title) {
  const b = await p.evaluate(title => {
    const e = [...document.querySelectorAll('[data-slot="sidebar-menu-button"] [title]')].find(e => e.title === title).closest('[data-slot="sidebar-menu-button"]');
    e.scrollIntoView({ block: 'nearest' });
    const b = e.getBoundingClientRect();
    return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  }, title);
  await p.send('Input.dispatchMouseEvent', { type: 'mousePressed', ...b, button: 'right', clickCount: 1 });
  await p.send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...b, button: 'right', clickCount: 1 });
  await p.wait(() => [...document.querySelectorAll('[role="menuitem"]')].some(e => e.getBoundingClientRect().width && e.textContent.trim() === 'Folder'));
  await p.click('[role="menuitem"]', 'Folder');
  await p.wait(() => [...document.querySelectorAll('[role="menuitem"]')].some(e => e.getBoundingClientRect().width && e.textContent.trim() === 'Pinned'));
  await p.click('[role="menuitem"]', 'Pinned');
  await p.wait(() => ![...document.querySelectorAll('[role="menuitem"]')].some(e => e.getBoundingClientRect().width));
  console.log(`Moved to Pinned: ${title}`);
}
try {
  await p.bringToFront();
  const [operation, ...args] = process.argv.slice(2);
  if (operation === 'pin') {
    await p.key('Escape');
    await p.key('Escape');
    await p.wait(() => ![...document.querySelectorAll('[role="menuitem"]')].some(e => e.getBoundingClientRect().width));
    for (const title of args) await pin(title);
  } else if (operation === 'select') await select(args[0]);
  else if (operation === 'draft') await draft(args[0] || '');
  else if (operation === 'send' || operation === 'submit') {
    if (operation === 'send') await draft(args[0]);
    await p.click('button[aria-label="Send"]');
    await p.wait(`()=>[...document.querySelectorAll(${JSON.stringify(composer)})].some(e=>e.getBoundingClientRect().width&&!e.querySelector('[data-slate-string]'))`);
    console.log('Message submitted through the real composer');
  } else throw new Error(`Unknown operation: ${operation}`);
} finally { p.close(); }
