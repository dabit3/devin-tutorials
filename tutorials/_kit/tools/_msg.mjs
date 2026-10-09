import puppeteer from 'puppeteer-core';
const b = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9333', defaultViewport: null });
const p = (await b.pages()).find(x => x.url().includes('devin.ai'));
await p.goto('https://app.devin.ai/sessions/6e40ee5d7f19443bb08cb71b93e5ef40'); await new Promise(r => setTimeout(r, 6000));
const els = await p.$$('textarea, [contenteditable=true]'); const ta = els[els.length - 1];
await ta.click(); await p.keyboard.sendCharacter('Thanks. This PR was for a recorded demo, so please close PR #3 without merging and delete its branch. No other changes needed.');
await p.keyboard.press('Enter'); await new Promise(r => setTimeout(r, 3000));
console.log((await p.$eval('main', e => e.innerText)).slice(-300));
b.disconnect(); process.exit(0);
