(() => {
  const BLUE = '#467bf7';
  const MUTED = '#737780';
  const images = new Map();
  const dir = '../../35-conference-overview/shots/';
  for (const name of ['wiki', 'prompt', 'pr', 'testA', 'testB', 'recording', 'review', 'slackA', 'slackB', 'automation', 'skill', 'mcp', 'managed', 'workflow', 'native', 'windows']) {
    const image = new Image();
    image.src = `${dir}${name}.png`;
    images.set(name, image);
  }
  window.CONFERENCE_READY = Promise.all([...images.values()].map(image => image.decode()));

  function text(ctx, k, value, x, y, size, weight = 500, color = k.INK) {
    k.font(size, weight);
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ctx.fillText(value, x, y);
  }

  function base(ctx, k, label, index, t, title, subtitle, split = false) {
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, k.VW, k.VH);
    const gradient = ctx.createRadialGradient(1110, 380, 20, 1110, 380, 760);
    gradient.addColorStop(0, '#eef3ff');
    gradient.addColorStop(1, '#fafafa');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, k.VW, k.VH);
    ctx.save();
    const a = k.eOutQuint(k.prog(t, 0.04, 0.55));
    ctx.globalAlpha *= a;
    ctx.translate(0, 12 * (1 - a));
    text(ctx, k, label, 100, 58, 18, 600, BLUE);
    ctx.drawImage(k.AVATAR, 1267, 41, 32, 32);
    text(ctx, k, 'Devin', 1306, 58, 25, 600);
    if (split) {
      title.split('\n').forEach((line, i) => text(ctx, k, line, 100, 270 + i * 68, 54, 550));
      text(ctx, k, subtitle, 100, 446, 23, 400, MUTED);
    } else {
      text(ctx, k, title, 100, 125, 51, 550);
      text(ctx, k, subtitle, 100, 179, 23, 400, MUTED);
    }
    ctx.restore();
    for (let n = 0; n < 12; n++) {
      k.rr(100 + n * 104, 775, 90, 3, 1.5);
      ctx.fillStyle = n === index ? BLUE : '#dfe3ea';
      ctx.fill();
    }
  }

  function proof(ctx, k, name, crop, box, t, a = 1) {
    const image = images.get(name);
    if (!image.complete || !image.naturalWidth) throw new Error(`Shot not ready: ${name}`);
    const [x, y, w, h] = box;
    const enter = k.eOutQuint(k.prog(t, 0.12, 0.75));
    ctx.save();
    ctx.globalAlpha *= enter * a;
    ctx.translate(0, 20 * (1 - enter));
    ctx.shadowColor = 'rgba(40,58,92,.10)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 10;
    k.rr(x, y, w, h, 18);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.save();
    k.rr(x + 1, y + 1, w - 2, h - 2, 17);
    ctx.clip();
    const [sx, sy, sw, sh] = crop;
    const scale = Math.min((w - 20) / sw, (h - 20) / sh);
    const z = 1 + 0.012 * k.prog(t, 0.75, 4.5);
    const dw = sw * scale * z;
    const dh = sh * scale * z;
    const ix = image.naturalWidth / 1440;
    const iy = image.naturalHeight / 810;
    ctx.drawImage(image, sx * ix, sy * iy, sw * ix, sh * iy, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
    ctx.restore();
    k.rr(x + 0.5, y + 0.5, w - 1, h - 1, 18);
    ctx.strokeStyle = '#dde4ef';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  const wide = [100, 233, 1240, 510];
  const right = [650, 165, 690, 570];
  function swap(ctx, k, a, b, box, t, at) {
    const p = k.eInOut(k.prog(t, at, at + 0.3));
    proof(ctx, k, a[0], a[1], box, t);
    if (p > 0) proof(ctx, k, b[0], b[1], box, t, p);
  }

  window.SCENES = {
    understand(ctx, t, k) {
      base(ctx, k, 'DeepWiki + Ask', 0, t, 'Understand your codebase', 'Ask a question. Get answers grounded in your code.');
      proof(ctx, k, 'wiki', [5, 18, 1430, 665], wide, t);
    },
    build(ctx, t, k) {
      base(ctx, k, 'Agent sessions', 1, t, 'Describe it. Devin builds it.', 'From a plain-English task to a pull request.');
      swap(ctx, k, ['prompt', [480, 277, 745, 210]], ['pr', [300, 0, 1130, 655]], wide, t, 2.6);
    },
    test(ctx, t, k) {
      base(ctx, k, 'Computer Use testing', 2, t, 'Test like\na real user', 'Clicks. Forms. Drag-and-drop.', true);
      swap(ctx, k, ['testA', [758, 146, 675, 505]], ['testB', [758, 146, 675, 505]], right, t, 2.8);
      text(ctx, k, 'Devin’s own browser', 100, 512, 20, 500, BLUE);
    },
    replay(ctx, t, k) {
      base(ctx, k, 'Test recordings', 3, t, 'See what passed. And why.', 'Watch the recording, with a summary of every check.');
      proof(ctx, k, 'recording', [364, 145, 1070, 550], wide, t);
    },
    review(ctx, t, k) {
      base(ctx, k, 'Devin Review', 4, t, 'Find bugs before they merge', 'Analyze the diff. Discuss a finding. Review the fix.');
      proof(ctx, k, 'review', [300, 0, 1130, 655], wide, t);
    },
    slack(ctx, t, k) {
      base(ctx, k, 'Devin in Slack', 5, t, 'Delegate from the conversation', 'Tag @Devin. Give it a task. Keep going in the thread.');
      swap(ctx, k, ['slackA', [465, 48, 960, 730]], ['slackB', [465, 48, 960, 730]], wide, t, 2.1);
    },
    automate(ctx, t, k) {
      base(ctx, k, 'Automations', 6, t, 'Put repeat work on autopilot', 'Start sessions on a schedule or an event.');
      proof(ctx, k, 'automation', [315, 0, 1110, 705], wide, t);
    },
    skills(ctx, t, k) {
      base(ctx, k, 'Skills', 7, t, 'Teach Devin\nyour process', 'Reusable instructions.', true);
      proof(ctx, k, 'skill', [600, 0, 825, 785], right, t);
      text(ctx, k, 'Applied when relevant', 100, 512, 20, 500, BLUE);
    },
    connect(ctx, t, k) {
      base(ctx, k, 'MCP + Plugins', 8, t, 'Connect the\ntools you use', 'Integrations. Live context.', true);
      proof(ctx, k, 'mcp', [642, 0, 785, 535], right, t);
    },
    parallel(ctx, t, k) {
      base(ctx, k, 'Managed Devins', 9, t, 'One task. A team of Devins.', 'Split the work. Run in parallel. Bring the results together.');
      proof(ctx, k, 'managed', [298, 65, 785, 595], wide, t);
    },
    workflow(ctx, t, k) {
      base(ctx, k, 'Dynamic Workflows', 10, t, 'Orchestrate the whole job', 'Connected stages. Parallel agents. Live progress.');
      proof(ctx, k, 'workflow', [10, 0, 1420, 662], wide, t);
    },
    platforms(ctx, t, k) {
      base(ctx, k, 'Multiplatform', 11, t, 'Build across\nplatforms', 'Web. Desktop. iPhone. iPad.', true);
      swap(ctx, k, ['windows', [758, 144, 677, 515]], ['native', [785, 155, 648, 488]], right, t, 2.6);
      text(ctx, k, 'Linux · macOS · Windows', 100, 510, 22, 500, BLUE);
      text(ctx, k, 'Windows availability is limited.', 100, 562, 17, 400, MUTED);
    },
  };
})();
