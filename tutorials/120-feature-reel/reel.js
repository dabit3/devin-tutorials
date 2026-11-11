// Frame layout for the silent feature reel, appended to each source tutorial's spec.js by tools/render.mjs.
// The UI sits on a card under a top band that holds only the feature title; no captions, badges or kit cards are drawn.
function makeReelFrame(R) {
  const S = 0.83, RAD = 30, TITLE_PX = 96, TITLE_Y = 172, BG = '#F5F5F7', INK = '29,29,31';
  const pad = n => String(n).padStart(5, '0');
  return async (f, k) => {
    const { ctx, W, H, drawUI, drawLockup, font, spaced, spacedW, rr, prog, eInOut, eOutQuint } = k;
    const i = f - R.f0, n = R.n, end = n - R.xNext;
    ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
    if (R.kind === 'card') {
      const a = R.name === 'intro' ? eOutQuint(prog(i, 12, 60)) : eOutQuint(prog(i, R.x + 6, R.x + 54));
      drawLockup(W / 2, H / 2 + 24 * (1 - a), 150, a);
    } else {
      const cw = W * S, ch = H * S, cx = (W - cw) / 2, cy = H - ch - 96;
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.10)'; ctx.shadowBlur = 90; ctx.shadowOffsetY = 28;
      rr(cx, cy, cw, ch, RAD); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
      ctx.save(); rr(cx, cy, cw, ch, RAD); ctx.clip(); ctx.translate(cx, cy); ctx.scale(S, S);
      await drawUI(f);
      ctx.restore(); ctx.globalAlpha = 1;
      ctx.save(); rr(cx, cy, cw, ch, RAD); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(0,0,0,0.08)'; ctx.stroke(); ctx.restore();
      let a = 1, dy = 0;
      if (R.titleIn) { const p = eOutQuint(prog(i, R.x + 4, R.x + 52)); a = p; dy = 22 * (1 - p); }
      if (R.titleOut) a *= 1 - eInOut(prog(i, end - 26, end - 2));
      if (a > 0) {
        font(TITLE_PX, 600); const tr = -2.6, tw = spacedW(R.title, tr);
        ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = `rgba(${INK},1)`; ctx.textBaseline = 'alphabetic';
        spaced(R.title, W / 2 - tw / 2, TITLE_Y + dy, tr); ctx.restore();
      }
    }
    // dissolve from the previous part: its tail frames are drawn over this one with falling opacity
    if (R.prev && i < R.x) {
      try {
        const b = await createImageBitmap(await (await fetch(`/120-feature-reel/build/frames/${R.prev}/${pad(R.prevN - R.x + i)}.jpg`)).blob());
        ctx.save(); ctx.globalAlpha = 1 - eInOut((i + 1) / (R.x + 1)); ctx.drawImage(b, 0, 0, W, H); ctx.restore(); b.close();
      } catch (e) { if (!R.preview) throw e; }
    }
  };
}
