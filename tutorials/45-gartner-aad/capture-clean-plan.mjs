import { recorder, beat } from './capture-common.mjs';

const r = await recorder('desktop');
const geometry = () => {
  const editor = [...document.querySelectorAll('.monaco-editor')].find(e => e.getBoundingClientRect().width > 500);
  const b = editor.getBoundingClientRect();
  const rows = [...editor.querySelectorAll('.view-line')].map(e => ({ text: e.textContent.replaceAll('\u00a0', ' '), y: e.getBoundingClientRect().y, height: e.getBoundingClientRect().height })).filter(e => e.height && e.y + e.height > b.top + 0.5 && e.y < b.bottom).sort((a, b) => a.y - b.y);
  return { top: b.top, bottom: b.bottom, x: b.x + b.width / 2, y: b.y + b.height / 2, rows };
};
async function wheel(deltaY) {
  const g = await r.p.evaluate(geometry);
  const before = JSON.stringify([g.rows[0].text, g.rows[0].y]);
  await r.p.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: g.x, y: g.y, deltaX: 0, deltaY });
  await r.p.wait(`()=>JSON.stringify((()=>{const g=(${geometry.toString()})();return [g.rows[0]?.text,g.rows[0]?.y]})()) !== ${JSON.stringify(before)}`);
  await r.p.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}
try {
  await r.p.click('.monaco-editor');
  await r.p.key('Control+Home');
  await r.p.wait(() => [...document.querySelectorAll('.view-line')].some(e => e.getBoundingClientRect().height && e.textContent.replaceAll('\u00a0', ' ').startsWith('# Issue #38:')));
  let g = await r.p.evaluate(geometry);
  const probe = g.rows.slice(4, -4).find(row => row.text.length > 15);
  await wheel(4);
  g = await r.p.evaluate(geometry);
  const moved = probe.y - g.rows.find(row => row.text === probe.text).y;
  if (moved <= 0) throw new Error('Wheel calibration did not move the editor');
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const rowHeight = Math.round(g.rows[0].height);
  const ticks = 2 * rowHeight / gcd(rowHeight, Math.round(moved));
  console.log(JSON.stringify({ moved, rowHeight, ticks }));
  for (let tick = 1; tick < ticks; tick++) await wheel(4);
  let started = false;
  let cut = 0;
  for (let block = 1; cut < Number(process.env.CUTS || 12) && block < 30; block++) {
    g = await r.p.evaluate(geometry);
    started ||= g.rows.some(row => row.text.startsWith('1. **AC1**'));
    if (!started) {
      for (let tick = 0; tick < ticks; tick++) await wheel(4);
      continue;
    }
    if (Math.abs(g.rows[0].y - g.top) > 0.6) throw new Error(`First row is clipped by ${g.rows[0].y - g.top}px`);
    cut++;
    await beat(r, `S2-clean-${String(cut).padStart(2, '0')}`, '.monaco-editor', '', 'Actual saved plan; sticky scroll and breadcrumbs disabled, overlapping readable cuts');
    console.log(JSON.stringify({ first: g.rows[0].text, last: g.rows.at(-1).text }));
    if (cut < Number(process.env.CUTS || 12)) for (let tick = 0; tick < ticks; tick++) await wheel(4);
  }
} finally { r.close(); }
