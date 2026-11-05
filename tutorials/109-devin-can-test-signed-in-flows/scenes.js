// Diagram beats for overview 109 (drawn in 1440x810 UI coords). Reveals are timed to narration chunks via SPEC.voLines.
(() => {
const BLUE = '#2078ff', INK = '#191919', SUB = 'rgba(25,25,25,.55)', LINE = 'rgba(25,25,25,.15)';
const enter = (k, s, t = 0, d = .75) => k.eOutQuint(k.prog(s, t, t + d));

function text(ctx, k, value, x, y, size = 24, a = 1, weight = 500, color = INK, family = 'Inter', align = 'center') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'middle';
  k.font(size, weight, family); ctx.fillText(value, x, y); ctx.restore();
}
function card(ctx, k, x, y, w, h, a = 1, active = 0, r = 20) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.shadowColor = 'rgba(0,0,0,.055)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 9;
  k.rr(x - w / 2, y - h / 2, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.lineWidth = active ? 1.6 : 1; ctx.strokeStyle = active ? `rgba(32,120,255,${active})` : 'rgba(25,25,25,.10)'; ctx.stroke(); ctx.restore();
}
function mark(ctx, k, x, y, size = 44, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, x - size / 2, y - size / 2, size, size); ctx.restore();
}
function pill(ctx, k, value, x, y, a = 1) {
  k.font(17, 500); const w = ctx.measureText(value).width + 38;
  card(ctx, k, x, y, w, 42, a, 0, 21); text(ctx, k, value, x, y, 17, a);
}
function node(ctx, k, x, y, title, lines = [], a = 1, active = 0, w = 300, h = 144, avatar = false) {
  const yy = y + 14 * (1 - a); card(ctx, k, x, yy, w, h, a, active);
  const top = avatar ? -57 : -14, bottom = lines.length ? 40 + (lines.length - 1) * 26 + 9 : 14, c = yy - (top + bottom) / 2;
  if (avatar) mark(ctx, k, x, c - 40, 34, a);
  text(ctx, k, title, x, c, 25, a, 600);
  lines.forEach((l, i) => text(ctx, k, l, x, c + 38 + i * 26, 17, a, 400, SUB));
}
function link(ctx, k, x0, y0, x1, y1, s, t = 0) {
  const p = k.eInOut(k.prog(s, t, t + .8));
  ctx.save(); ctx.globalAlpha = k.alpha * k.prog(s, t - .25, t + .15);
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.strokeStyle = LINE; ctx.lineWidth = 1.4; ctx.stroke();
  if (p > 0) { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + (x1 - x0) * p, y0 + (y1 - y0) * p); ctx.strokeStyle = 'rgba(32,120,255,.6)'; ctx.stroke(); }
  const u = (s - t) / 3.2 % 1;
  if (s > t + .8 && u > .02 && u < .98) {
    ctx.beginPath(); ctx.arc(x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, 4, 0, Math.PI * 2); ctx.fillStyle = BLUE;
    ctx.globalAlpha *= Math.min(1, u * 8, (1 - u) * 8); ctx.fill();
  }
  ctx.restore();
}
function lock(ctx, k, x, y, a = 1, open = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.strokeStyle = BLUE; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(x, y - 9 - open * 6, 9, Math.PI, 0); ctx.lineTo(x + 9, y - 9 - open * 6 + 4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 9, y - 9); ctx.lineTo(x - 9, y - 6); ctx.stroke();
  k.rr(x - 13, y - 6, 26, 20, 5); ctx.fillStyle = 'rgba(32,120,255,.10)'; ctx.fill(); ctx.stroke(); ctx.restore();
}
function header(ctx, s, k, section, title) {
  const a = enter(k, s, .05);
  text(ctx, k, section, 720, 128, 14, a, 500, SUB, 'JetBrains Mono');
  text(ctx, k, title, 720, 180, 38, a, 600);
}
function at(scene, phrase, fallback) {
  const spec = window.SPEC, key = Object.keys(spec.edit).find(key => spec.edit[key].scene === scene);
  const chunk = spec.voLines?.[key]?.chunks.find(c => c.text.toLowerCase().includes(phrase.toLowerCase()));
  return chunk ? Math.max(.4, chunk.t0) : fallback;
}
function source(ctx, k, s, value, t) { text(ctx, k, value, 720, 760, 14, enter(k, s, t), 400, SUB, 'JetBrains Mono'); }

// title card: the opening line, set as a headline
function title(ctx, s, k) {
  // the film opens 1.2 s in (make109.sh skips the kit's window entrance), so the reveal starts after that
  const a0 = enter(k, s, 1.25, 1), a1 = enter(k, s, 1.45, 1), a2 = enter(k, s, 1.7, 1);
  mark(ctx, k, 720, 262 + 10 * (1 - a0), 64, a0);
  text(ctx, k, 'Devin can log into your staging site', 720, 372 + 12 * (1 - a1), 56, a1, 650);
  text(ctx, k, 'safely and test signed-in flows', 720, 446 + 12 * (1 - a2), 56, a2, 650, BLUE);
  text(ctx, k, 'SECRETS  ·  BROWSER TESTING  ·  RECORDINGS', 720, 548, 15, enter(k, s, 2.2), 500, SUB, 'JetBrains Mono');
}
function wall(ctx, s, k) {
  header(ctx, s, k, 'THE PROBLEM', 'The pages that matter sit behind a login');
  const t1 = at('wall', 'login', 1.2), t2 = at('wall', 'profiles', 2.2);
  node(ctx, k, 330, 430, 'Staging site', ['Your app before release'], enter(k, s, .5), 0, 290, 150);
  link(ctx, k, 480, 430, 575, 430, s, t1 - .3);
  node(ctx, k, 720, 430, 'Sign-in page', ['Email and password'], enter(k, s, t1), .6, 270, 150);
  lock(ctx, k, 720, 368, enter(k, s, t1 + .2));
  link(ctx, k, 860, 430, 955, 430, s, t2 - .3);
  card(ctx, k, 1110, 430, 290, 220, enter(k, s, t2));
  text(ctx, k, 'Account pages', 1110, 352, 25, enter(k, s, t2), 600);
  ['Profile', 'Billing', 'Security'].forEach((l, i) => pill(ctx, k, l, 1110, 410 + i * 52, enter(k, s, t2 + .25 + i * .2)));
}
function save(ctx, s, k) {
  header(ctx, s, k, 'SAVE IT ONCE', 'One saved login, available to every new session');
  const t1 = at('save', 'secret', 1), t2 = at('save', 'every new session', 3);
  node(ctx, k, 300, 440, 'Test account', ['qa@larkspur.test', 'A dedicated login'], enter(k, s, .5), 0, 290, 160);
  link(ctx, k, 447, 440, 560, 440, s, t1 - .3);
  node(ctx, k, 720, 440, 'Devin Secrets', ['Encrypted at rest', 'Value redacted'], enter(k, s, t1), .7, 310, 160);
  lock(ctx, k, 720, 352, enter(k, s, t1 + .2));
  [0, 1, 2].forEach(i => {
    const y = 330 + i * 110, t = t2 + i * .25;
    link(ctx, k, 877, 440, 1000, y, s, t - .3);
    card(ctx, k, 1140, y, 270, 82, enter(k, s, t)); mark(ctx, k, 1050, y, 30, enter(k, s, t));
    text(ctx, k, 'New session', 1150, y, 21, enter(k, s, t), 600);
  });
}
function types(ctx, s, k) {
  header(ctx, s, k, 'USED, NOT PASTED', 'Devin types the secret into the sign-in form');
  const t1 = at('types', 'types', 1), t2 = at('types', 'browser', 2), t3 = at('types', 'chat', 3.5);
  node(ctx, k, 300, 420, 'Devin session', ['Needs to sign in'], enter(k, s, .5), 0, 290, 150, true);
  link(ctx, k, 447, 420, 570, 420, s, t1 - .3);
  node(ctx, k, 720, 420, 'Secret', ['DC109_LARKSPUR_PASSWORD'], enter(k, s, t1), .7, 300, 150);
  lock(ctx, k, 720, 352, enter(k, s, t1 + .2));
  link(ctx, k, 872, 420, 995, 420, s, t2 - .3);
  card(ctx, k, 1140, 420, 290, 190, enter(k, s, t2));
  text(ctx, k, 'Sign in', 1140, 356, 23, enter(k, s, t2), 600);
  [['qa@larkspur.test', 404], ['••••••••••••••••', 452]].forEach(([v, y], i) => {
    const a = enter(k, s, t2 + .3 + i * .25); card(ctx, k, 1140, y, 236, 38, a, 0, 9); text(ctx, k, v, 1036, y, 16, a, 400, INK, 'Inter', 'left');
  });
  pill(ctx, k, 'Nothing to paste into chat', 720, 620, enter(k, s, t3));
  source(ctx, k, s, 'docs.devin.ai/product-guides/secrets', t1);
}
function profile(ctx, s, k) {
  header(ctx, s, k, 'FOR SSO AND MFA', 'Or save the browser profile once');
  const steps = [['Log in once', ['In Devin’s browser'], 'log in'], ['Save the profile', ['“Save the browser profile”'], 'save'], ['Approve the update', ['Org blueprint, one time'], 'approve'], ['Every new session', ['Starts already signed in'], 'starts']];
  steps.forEach(([t, lines, cue], i) => {
    const x = 225 + i * 330, tt = at('profile', cue, .6 + i * 1.2);
    if (i) link(ctx, k, x - 330 + 140, 430, x - 140, 430, s, tt - .3);
    node(ctx, k, x, 430, t, lines, enter(k, s, tt), i === 3 ? .7 : 0, 280, 150, i === 3);
  });
  source(ctx, k, s, 'docs.devin.ai/work-with-devin/browser-auth', 1);
}
window.SCENES = { title, wall, save, types, profile };
})();
