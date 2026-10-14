(() => {
  const BLUE = '#2078ff';
  const MUTED = '#777b83';
  const normal = text => text.toLowerCase().replace(/[^a-z0-9]/g, '');

  function cue(phrase, fallback) {
    const words = window.SPEC.voLines?.['overview.png']?.words;
    if (!words) return fallback;
    const query = phrase.split(' ').map(normal);
    const index = words.findIndex((_, i) => query.every((word, j) => normal(words[i + j]?.text || '') === word));
    return index < 0 ? fallback : words[index].t0;
  }

  function text(ctx, k, value, x, y, size, weight, color, opacity = 1) {
    ctx.save();
    ctx.globalAlpha = k.alpha * opacity;
    k.font(size, weight);
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(value, x, y);
    ctx.restore();
  }

  function icon(ctx, k, type, x, y, opacity) {
    ctx.save();
    ctx.globalAlpha = k.alpha * opacity;
    ctx.translate(x, y);
    ctx.strokeStyle = BLUE;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (type === 'devin') {
      ctx.drawImage(k.AVATAR, -20, -20, 40, 40);
    } else if (type === 'review') {
      k.rr(-18, -16, 36, 28, 7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-8, 12); ctx.lineTo(-8, 19); ctx.lineTo(0, 12); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -9); ctx.lineTo(0, 0); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 5, 1, 0, Math.PI * 2); ctx.stroke();
    } else if (type === 'check') {
      ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(-2, 6); ctx.lineTo(9, -7); ctx.stroke();
    } else {
      k.rr(-16, -20, 32, 40, 5); ctx.stroke();
      [-8, 0, 8].forEach(yy => {
        ctx.beginPath(); ctx.moveTo(-8, yy); ctx.lineTo(8, yy); ctx.stroke();
      });
    }
    ctx.restore();
  }

  function arrow(ctx, k, x0, x1, y, progress) {
    if (progress <= 0) return;
    ctx.save(); ctx.globalAlpha = k.alpha * progress;
    ctx.strokeStyle = '#c9cdd3'; ctx.lineWidth = 1.5;
    const end = k.lerp(x0, x1, progress);
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(end, y); ctx.stroke();
    if (progress > 0.95) {
      ctx.beginPath(); ctx.moveTo(x1 - 5, y - 4); ctx.lineTo(x1, y); ctx.lineTo(x1 - 5, y + 4); ctx.stroke();
    }
    ctx.restore();
  }

  function overview(ctx, seconds, k) {
    const appear = (at, duration = 0.6) => k.eOutQuint(k.prog(seconds, at, at + duration));
    const stages = [
      { title: 'Pull request', owner: 'Devin', icon: 'devin', at: cue('Devin opens a pull request', 2.0) },
      { title: 'Bug found', owner: 'Devin Review', icon: 'review', at: cue('Review flags a bug', 4.0) },
      { title: 'Fix pushed', owner: 'Owning session', icon: 'devin', at: cue('Devin pushes a fix', 6.0) },
      { title: 'CI passes', owner: 'Checks are green', icon: 'check', at: cue('Once CI passes', 9.0) },
      { title: 'Final diff', owner: 'You decide to merge', icon: 'diff', at: cue('you read the final diff', 10.5) }
    ];
    text(ctx, k, 'DEVIN REVIEW  /  AUTO-FIX', 720, 128, 14, 600, MUTED, appear(0));
    text(ctx, k, 'The review loop closes itself', 720, 183, 40, 600, k.INK, appear(0.15));
    const noPrompt = cue('lets the owning session', 0.6);
    text(ctx, k, 'Automatic fixes. No new human prompt.', 720, 244, 19, 400, MUTED, appear(noPrompt));

    stages.forEach((stage, i) => {
      const x = 224 + i * 248;
      const a = appear(stage.at);
      const lift = 14 * (1 - a);
      if (i > 0) arrow(ctx, k, x - 140, x - 116, 401, appear(stage.at, 0.45));
      ctx.save();
      ctx.globalAlpha = k.alpha * a;
      ctx.shadowColor = 'rgba(25,25,25,.04)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6;
      k.rr(x - 108, 320 + lift, 216, 162, 18); ctx.fillStyle = '#fff'; ctx.fill();
      ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
      ctx.lineWidth = 1; ctx.strokeStyle = '#e0e3e8'; ctx.stroke();
      const active = seconds >= stage.at && (i === stages.length - 1 || seconds < stages[i + 1].at);
      if (active) {
        ctx.strokeStyle = BLUE; ctx.lineWidth = 1.4; ctx.globalAlpha *= 0.85; ctx.stroke();
      }
      ctx.restore();
      icon(ctx, k, stage.icon, x, 360 + lift, a);
      text(ctx, k, stage.title, x, 408 + lift, 23, 600, k.INK, a);
      text(ctx, k, stage.owner, x, 447 + lift, 14, 400, MUTED, a);
    });

    const repeatAt = cue('Review runs again', 7.2);
    const loop = appear(repeatAt, 0.7);
    if (loop > 0) {
      ctx.save(); ctx.globalAlpha = k.alpha * loop;
      ctx.strokeStyle = BLUE; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(720, 494); ctx.lineTo(720, 532);
      ctx.quadraticCurveTo(720, 542, 710, 542); ctx.lineTo(482, 542);
      ctx.quadraticCurveTo(472, 542, 472, 532); ctx.lineTo(472, 494); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(467, 501); ctx.lineTo(472, 494); ctx.lineTo(477, 501); ctx.stroke();
      ctx.restore();
      text(ctx, k, 'Review runs again after every push', 596, 575, 15, 500, BLUE, loop);
    }
    text(ctx, k, 'The human decision comes last.', 720, 632, 18, 500, k.INK, appear(stages[4].at + 0.65));
  }

  window.SCENES = { overview };

  if (window.SPEC.voLines) {
    window.SPEC.cps = 96;
    const holds = { '0001.png': 1, '0009.png': 0.4, '0011.png': 0.3, '0013.png': 0.35, '0085.png': 0.35,
      '0148.png': 1, '0149.png': 1.2, '0152.png': 1.3 };
    for (const [img, hold] of Object.entries(holds)) (window.SPEC.edit[img] ??= {}).hold = hold;
  }
})();
