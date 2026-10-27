// Inject into the Desktop agent window: hide pre-existing account sessions (ids in ~/w81/hide-ids.json + HIDE_IDS env),
// hide toasts, and mask the account email via the kit's MASK (set MASK_TEXT to the comma-separated text to mask).
import fs from 'fs';
if (!process.env.MASK_TEXT) throw new Error('set MASK_TEXT to the account email (and name) to mask');
const { MASK } = await import('../_kit/capture/cdp.mjs');
const allowF = process.env.ALLOW_IDS_FILE || (process.env.HOME + '/w81/allow-ids.json');
export const DESK_HIDE = `(() => {
  
  const css = () => { if (document.getElementById('__deskHide')) return; const st = document.createElement('style'); st.id = '__deskHide';
    st.textContent = '[data-sonner-toaster],[data-sonner-toast]{display:none!important}'; document.head.appendChild(st); };
  const run = window.__deskRun = () => { css(); document.querySelectorAll('li[data-session-nav-id]').forEach(li => { const id = li.dataset.sessionNavId; li.style.display = (window.__deskIds.includes(id) || (window.__deskAllow && !window.__deskAllow.includes(id) && !id.includes('/'))) ? 'none' : ''; }); };
  run(); if (window.__deskObs) window.__deskObs.disconnect(); { let q = 0; window.__deskObs = new MutationObserver(() => { if (!q) q = setTimeout(() => { q = 0; window.__deskRun(); }, 60); }); window.__deskObs.observe(document.body, { subtree: true, childList: true }); }
})();`;
export async function inject(p) {
  const ids = JSON.parse(fs.readFileSync(process.env.HIDE_IDS_FILE || (process.env.HOME + '/w81/hide-ids.json'), 'utf8')).concat((process.env.HIDE_IDS || '').split(',').filter(Boolean));
  const allow = fs.existsSync(allowF) ? JSON.parse(fs.readFileSync(allowF, 'utf8')) : null;
  await p.evaluate((i, a) => { window.__deskIds = i; window.__deskAllow = a; }, ids, allow);
  await p.evaluate(DESK_HIDE); await p.evaluate(MASK); }
