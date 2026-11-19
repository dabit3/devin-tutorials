// Human-looking screen-recording director. Real Chrome (CDP 9333) on virtual display; real OS cursor via ~/vdisp/mouse.
import puppeteer from '/Users/devin/repos/devin-tutorials/tutorials/_kit/tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
import { spawn } from 'child_process';
import fs from 'fs';
const PH = JSON.parse(fs.readFileSync(new URL('./vo/phrases.json', import.meta.url)));
import { createInterface } from 'readline';
export const sleep = ms => new Promise(r => setTimeout(r, ms));
const OX = 1600, OY = 117;
const HIDE_CSS = '[data-sonner-toaster],[aria-label^="Notifications"]{display:none!important}';
export class Dir {
  async init() {
    this.b = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9333', defaultViewport: null });
    const pages = await this.b.pages();
    this.p = pages.find(x => x.url().startsWith('http')) || pages[0];
    await this.p.bringToFront();
    this.m = spawn('/Users/devin/vdisp/mouse', [], { stdio: ['pipe', 'pipe', 'inherit'] });
    this.q = []; createInterface({ input: this.m.stdout }).on('line', l => { const r = this.q.shift(); r && r(l); });
    this.marks = []; this.t0 = null;
    return this;
  }
  cmd(c) { return new Promise(r => { this.q.push(r); this.m.stdin.write(c + '\n'); }); }
  pos() { return new Promise(r => { let first; this.q.push(l => { first = l; }); this.q.push(() => r(first.split(' ').map(Number))); this.m.stdin.write('pos\n'); }); }
  now() { return this.t0 ? (Date.now() - this.t0) / 1000 : 0; }
  mark(name, extra = {}) { this.marks.push({ name, t: this.now(), ...extra }); }
  async rec(file) {
    this.file = file; this.marks = [];
    this.ff = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'avfoundation', '-capture_cursor', '1', '-framerate', '60', '-pixel_format', 'nv12', '-i', '1:none', '-c:v', 'hevc_videotoolbox', '-q:v', '62', '-tag:v', 'hvc1', file], { stdio: ['pipe', 'inherit', 'inherit'] });
    await sleep(1500); this.t0 = Date.now(); this.mark('start');
  }
  async stop() {
    this.mark('end'); this.ff.stdin.write('q'); await new Promise(r => this.ff.on('close', r));
    fs.writeFileSync(this.file.replace(/\.\w+$/, '.marks.json'), JSON.stringify(this.marks, null, 1));
  }
  async hide() { await this.p.evaluate(css => { if (!document.getElementById('__h')) { const s = document.createElement('style'); s.id = '__h'; s.textContent = css; document.head.appendChild(s); } const t = [...document.querySelectorAll('*')].find(e => e.children.length === 0 && /Introducing Devin Bots/.test(e.textContent)); let c = t; for (let i = 0; i < 6 && c; i++) { const b = [...c.querySelectorAll('button')].find(x => /Dismiss/.test(x.getAttribute('aria-label') || x.innerText || '')); if (b) { b.click(); break; } c = c.parentElement; } const KEEP = /claim|adjuster|Adjuster|Estimate|payout|Gateway|Field Adjuster|Quantex|quantex|Spend report|ADCA|Triage Agent \(Adjuster|Triage Agent \(Field|Undo Crash/i; document.querySelectorAll('a[href*="/sessions/"], a[href*="/search/"]').forEach(a => { const t = (a.getAttribute('aria-label') || '') + ' ' + a.textContent; if (KEEP.test(t)) return; const li = a.closest('li') || a; if (li.style.display !== 'none') li.style.display = 'none'; }); }, HIDE_CSS).catch(() => {}); }
  // find element by text (innermost, visible, optional x range); returns css rect
  async find(t, o = {}) {
    return this.p.evaluate(([t, o]) => {
      const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && r.x >= (o.minX || 0) && r.x < (o.maxX || 1e9) && r.y >= (o.minY || 0) && r.y < (o.maxY || 1e9); };
      const sel = o.sel || 'button,a,[role=tab],[role=button],[role=option],[role=menuitem],span,div,p,li,h1,h2,h3,h4,code,td,label,input,textarea';
      const els = [...document.querySelectorAll(sel)].filter(e => vis(e) && (o.attr ? (e.getAttribute(o.attr) || '') === t : o.exact ? (e.innerText || '').trim() === t : (e.innerText || e.getAttribute('aria-label') || '').trim().startsWith(t)));
      const e = els.filter(e => !els.some(x => x !== e && e.contains(x)))[o.nth || 0]; if (!e) return null;
      const r = e.getBoundingClientRect(); return { x: r.x + Math.min(r.width / 2, o.left ? 30 : 1e9), y: r.y + r.height / 2, w: r.width, h: r.height };
    }, [t, o]);
  }
  async to(x, y, ms) { // screen-space move with human timing
    const [cx, cy] = await this.pos();
    const d = Math.hypot(x - cx, y - cy); const dur = ms || Math.min(1100, 320 + d * 0.45 + Math.random() * 120);
    await this.cmd(`move ${x.toFixed(1)} ${y.toFixed(1)} ${dur.toFixed(0)}`);
  }
  async hover(t, o = {}) { const r = typeof t === 'object' ? t : await this.find(t, o); if (!r) throw new Error('not found ' + t); await this.to(OX + r.x + (Math.random() - 0.5) * Math.min(10, r.w / 4), OY + r.y + (Math.random() - 0.5) * Math.min(4, r.h / 4)); await sleep(o.dwell ?? 180 + Math.random() * 200); return r; }
  async click(t, o = {}) { const r = await this.hover(t, o); await this.cmd('click'); this.mark('click', { what: String(t) }); if (o.load) await this.loaded(o.load); else await sleep(o.after ?? 500); return r; }
  // wait for page to settle; the wait is marked as a cut (cutFrom=click+0.35s, cutTo=ready)
  async loaded(cond) {
    const c0 = this.now() + 0.35;
    const ok = typeof cond === 'string' ? cond : null;
    let last = '', stable = 0;
    for (let i = 0; i < 120; i++) { await sleep(500); await this.hide(); const st = await this.p.evaluate(s => { const sk = [...document.querySelectorAll('.animate-pulse,[class*=skeleton],[data-slot=skeleton]')].some(e => { const r = e.getBoundingClientRect(); return r.width > 20 && r.height > 6 && r.bottom > 0 && r.top < innerHeight; }); const t = document.body.innerText; return { ok: document.readyState === 'complete' && t.length > 300 && !sk && (!s || t.includes(s)), len: t.length }; }, ok).catch(() => ({ ok: false, len: 0 })); stable = st.ok && st.len === last ? stable + 1 : 0; last = st.len; if (stable >= 2 || (i > 40 && st.ok)) break; }
    await this.hide(); await sleep(1200);
    this.mark('cut', { from: c0, to: this.now() - 0.25 });
  }
  async goUrl(url, ready) { // click omnibox, type, enter
    await this.to(OX + 300 + Math.random() * 80, 93, 600); await this.cmd('click'); await sleep(250);
    const u = url.replace(/^https:\/\//, ''); const t1 = this.now();
    await this.cmd('type ' + u); await sleep(300);
    this.mark('cut', { from: t1 + 0.7, to: this.now() });
    await this.cmd('key 36'); await this.to(OX + 900 + Math.random() * 200, OY + 560, 450);
    this.mark('click', { what: 'url' }); await this.loaded(ready);
  }
  async scroll(dy, ms = 900, at) { if (at) await this.to(OX + at.x, OY + at.y); await this.cmd(`scroll ${dy} ${ms}`); await sleep(400); }
  async seek(t, o = {}, at = { x: 1000, y: 520 }) { // scroll with the wheel until text is comfortably on screen
    await this.to(OX + at.x, OY + at.y);
    const s0 = this.now(); for (let i = 0; i < 25; i++) { const r = await this.find(t, o); const ih = 963; if (r && r.y > 140 && r.y < ih - 160) { if (this.now() - s0 > 3.2) this.mark('cut', { from: s0 + 1.2, to: this.now() - 0.8 }); return r; } await this.cmd(`scroll ${r ? Math.round(r.y - ih * 0.45) : (at.up ? -420 : 380)} ${700 + Math.random() * 300}`); await sleep(500 + Math.random() * 300); }
    this.mark('cut', { from: s0 + 1.5, to: this.now() - 0.3 }); console.log('seek miss', t); return null; }
  async textAt(sub) { return this.p.evaluate(sub => { const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { const i = n.textContent.indexOf(sub); if (i >= 0) { const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + sub.length); const b = r.getBoundingClientRect(); if (b.width > 0) return { x: b.x + Math.min(b.width / 2, 80), y: b.y + b.height / 2, w: b.width, h: b.height }; } } return null; }, sub); }
  async openComputer() {
    const comp = await this.find('Computer', { sel: 'button,[role=tab]', exact: true, minX: 500 });
    if (comp) await this.click(comp, { after: 300 }); else { await this.click('Show tabs panel', { sel: 'button', attr: 'aria-label', after: 1000 }).catch(() => {}); await this.click('Computer', { sel: 'button,[role=tab]', exact: true, minX: 500, after: 300 }).catch(e => console.log('comp', e.message)); }
    await this.loaded(true);
  }
  async scrub(fracs, gap = 1100) {
    const tl = await this.p.evaluate(() => { const e = document.querySelector('[aria-label="Session timeline"]'); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x, y: b.y + b.height / 2, w: b.width }; });
    if (!tl) { console.log('no timeline'); return; }
    for (const f of fracs) { await this.to(OX + tl.x + tl.w * f, OY + tl.y); await sleep(100); await this.cmd('click'); this.mark('click', { what: 'tl' + f }); await sleep(gap); }
  }
  async idle(sec) { const end = Date.now() + sec * 1000; while (Date.now() < end) { const left = end - Date.now(); if (left > 1800 && Math.random() < 0.4) { const [cx, cy] = await this.pos(); await this.to(cx + (Math.random() - 0.5) * 120, cy + (Math.random() - 0.5) * 60, 700 + Math.random() * 500); } await sleep(Math.min(left, 600 + Math.random() * 600)); } }
  // keep line paced: wait until kept-time since line start >= dur
  kept(since) { const cuts = this.marks.filter(m => m.name === 'cut' && m.from >= since); return this.now() - since - cuts.reduce((a, c) => a + (c.to - c.from), 0); }
  line(id) { this.cur = { id, t: this.now() }; this.mark('L' + id); }
  off(phrase) { const cl = PH[this.cur.id]; let t = 0.3; for (const c of cl) { const i = c.text.indexOf(phrase); if (i >= 0) return t + c.dur * i / c.text.length; t += c.dur + 0.3; } throw new Error('phrase not found: ' + phrase); }
  async until(phrase, lead = 0.9) { await this.pace(Math.max(0, this.off(phrase) - lead), 0); }
  async pace(dur, pad = 0.5) { const need = dur + pad - this.kept(this.cur.t); if (need > 0) await this.idle(need); }
  async close() { this.m.stdin.end(); this.b.disconnect(); }
}
