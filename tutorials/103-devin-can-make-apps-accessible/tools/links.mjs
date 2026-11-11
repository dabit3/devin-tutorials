import { connect } from '../../_kit/capture/cdp.mjs';
const { b, p } = await connect();
console.log(JSON.stringify(await p.evaluate((re) => [...document.querySelectorAll('a')].filter(a => new RegExp(re, 'i').test(a.innerText + ' ' + a.href)).map(a => [a.innerText.trim().slice(0, 60), a.href]), process.argv[2] || 'session')));
b.disconnect(); process.exit(0);
