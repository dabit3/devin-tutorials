(() => {
  const BLUE = '#467bf7', INK = '#191919', MUTED = '#737780';
  const images = new Map(), action = new Map();
  const root = '../../35-conference-overview/';
  const ctx = document.getElementById('c').getContext('2d');
  const clamp = x => Math.min(1, Math.max(0, x));
  const progress = (t, a, b) => clamp((t - a) / (b - a));
  const ease = p => p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2;
  const out = p => 1 - (1 - p) ** 4;
  const mix = (a, b, p) => a.map((n, i) => n + (b[i] - n) * p);
  const wide = [84, 220, 1272, 482], hero = [556, 205, 800, 498];
  const chapters = Object.values(window.SPEC.edit);
  let start = window.SPEC.introHold;
  for (const chapter of chapters) { chapter.start = start; start += chapter.hold; }
  const ending = start, duration = ending + window.SPEC.tailHold;

  function rect(box, radius = 16) {
    ctx.beginPath();
    ctx.roundRect(...box, radius);
  }

  function text(value, x, y, size, weight = 500, color = INK) {
    ctx.font = `${weight} ${size}px "Inter"`;
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ctx.fillText(value, x, y);
  }

  function surface() {
    ctx.fillStyle = '#f6f6f7';
    ctx.fillRect(0, 0, 1440, 810);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 1440, 194);
  }

  function brand() {
    ctx.drawImage(images.get('avatar'), 1244, 32, 32, 32);
    text('Devin', 1286, 48, 25, 600);
  }

  function base(label, title, subtitle, t, index, split = false) {
    surface();
    brand();
    const p = out(progress(t, 0, 0.65));
    ctx.save();
    ctx.globalAlpha *= p;
    ctx.translate(0, 14 * (1 - p));
    text(label, 84, 48, 18, 600, BLUE);
    if (split) {
      title.split('\n').forEach((line, i) => text(line, 84, 305 + i * 66, 51, 550));
      subtitle.split('\n').forEach((line, i) => text(line, 84, 474 + i * 32, 22, 400, MUTED));
    } else {
      text(title, 84, 119, 49, 550);
      text(subtitle, 84, 171, 22, 400, MUTED);
    }
    ctx.restore();
    chapters.forEach((chapter, i) => {
      const box = [84 + i * 107, 788, 95, 3];
      rect(box, 1.5);
      ctx.fillStyle = '#dfe0e3';
      ctx.fill();
      if (i <= index) {
        rect([box[0], box[1], box[2] * (i < index ? 1 : clamp(t / chapter.hold)), 3], 1.5);
        ctx.fillStyle = BLUE;
        ctx.fill();
      }
    });
  }

  function cue(items, t, times = []) {
    const active = times.filter(time => t >= time).length;
    ctx.save();
    ctx.globalAlpha *= out(progress(t, 0.55, 1.2));
    let x = 84;
    items.forEach((label, i) => {
      ctx.font = '500 19px "Inter"';
      const w = ctx.measureText(label).width + 32;
      const box = [x, 726, w, 38];
      rect(box, 10);
      ctx.fillStyle = i === active ? '#fff' : '#eeeef0';
      ctx.fill();
      if (i === active) {
        rect(box, 10);
        ctx.strokeStyle = BLUE;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      text(label, x + 16, 745, 19, 500, i === active ? BLUE : MUTED);
      x += w + 12;
    });
    ctx.restore();
  }

  function proof(name, crop, box, t, options = {}) {
    const image = images.get(name);
    if (!image?.complete || !image.naturalWidth) throw new Error(`Shot not ready: ${name}`);
    const enter = out(progress(t, 0.15, 0.85));
    const current = options.zoom ? mix(crop, options.zoom, ease(progress(t, options.at ?? 2.2, (options.at ?? 2.2) + 1.5))) : crop;
    const [x, y, w, h] = box, [sx, sy, sw, sh] = current;
    const scale = Math.min((w - 28) / sw, (h - 28) / sh);
    const dx = x + (w - sw * scale) / 2, dy = y + (h - sh * scale) / 2;
    const card = [dx - 14, dy - 14, sw * scale + 28, sh * scale + 28];
    const unit = image.naturalWidth / 1440;
    ctx.save();
    ctx.globalAlpha *= enter * (options.alpha ?? 1);
    ctx.translate(0, 16 * (1 - enter));
    ctx.shadowColor = 'rgba(25,25,25,.08)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 8;
    rect(card);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.save();
    rect([card[0] + 1, card[1] + 1, card[2] - 2, card[3] - 2], 15);
    ctx.clip();
    ctx.drawImage(image, sx * unit, sy * unit, sw * unit, sh * unit, dx, dy, sw * scale, sh * scale);
    for (const focus of options.focus || []) {
      const p = out(progress(t, focus.at ?? 1.25, (focus.at ?? 1.25) + 0.8));
      const fade = focus.until ? 1 - progress(t, focus.until, focus.until + 0.3) : 1;
      if (!p || !fade) continue;
      const [fx, fy, fw, fh] = focus.box;
      const target = [dx + (fx - sx) * scale, dy + (fy - sy) * scale, fw * scale, fh * scale];
      ctx.save();
      ctx.globalAlpha *= fade;
      rect(target, 9);
      ctx.strokeStyle = BLUE;
      ctx.lineWidth = 2.8;
      const length = 2 * (target[2] + target[3]);
      ctx.setLineDash([length * p, length * (1 - p) + 1]);
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
    rect([card[0] + 0.5, card[1] + 0.5, card[2] - 1, card[3] - 1]);
    ctx.strokeStyle = '#dedee2';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  function swap(a, b, box, t, at, options = {}) {
    const p = ease(progress(t, at, at + 0.4));
    if (p < 1) proof(a[0], a[1], box, t, options);
    if (p > 0) proof(b[0], b[1], box, t, { ...options, alpha: p });
  }

  const scenes = {
    understand(t) {
      base('DeepWiki + Ask', 'Understand your codebase', 'Ask a question. Follow the answer into your code.', t, 0);
      swap(['wiki', [8, 24, 1415, 641]], ['wikiCode', [8, 24, 1415, 641]], wide, t, 3.3, {
        focus: [{ box: [619, 42, 793, 603], at: 4 }],
      });
      cue(['Ask a question', 'Open the cited source'], t, [3.3]);
    },
    build(t) {
      base('Agent sessions', 'Describe it. Devin builds it.', 'A task in plain English. A pull request ready to review.', t, 1);
      const name = t < 1.8 ? 'promptStart' : t < 3.1 ? 'promptMiddle' : 'prompt';
      if (t < 5) proof(name, [514, 279, 698, 195], wide, t, {
        focus: [{ box: [525, 342, 674, 93], at: 0.9 }],
      });
      else proof('pr', [304, 10, 1121, 348], wide, t - 4.5, {
        zoom: [745, 36, 690, 300], at: 1,
        focus: [{ box: [758, 235, 664, 42], at: 1.3 }],
      });
      cue(['Mention your repository', 'Describe the change', 'Review the pull request'], t, [2, 5]);
    },
    test(t) {
      base('Computer Use testing', 'Test like\na real user', 'Real clicks. Real forms.\nReal browser checks.', t, 2, true);
      const crop = [225, 250, 1100, 700], zoom = [360, 300, 810, 555];
      const amount = out(progress(t, 1.8, 2.7)) * (1 - out(progress(t, 5.5, 6.1))) + out(progress(t, 10.6, 11.2));
      const camera = crop.map((v, i) => v + (zoom[i] - v) * amount);
      proof('action', camera, hero, t, {
        focus: [
          { box: [480, 764, 85, 37], at: 2.1, until: 5.5 },
          { box: [452, 590, 530, 148], at: 10.9 },
        ],
      });
      cue(['Open the editor', 'Duplicate the card', 'Check copied fields'], t, [4, 10.5]);
      text('Original browser test footage', 84, 574, 18, 500, BLUE);
    },
    replay(t) {
      base('Test recordings', 'See what passed. And why.', 'Replay the test and inspect the checks beside it.', t, 3);
      proof('retest-viewer', [146, 175, 1133, 755], wide, t, {
        zoom: [900, 228, 365, 580], at: 3.0,
        focus: [{ box: [915, 227, 236, 22], at: 1.25 }],
      });
      cue(['Replay the test', '11 passed · 0 failed', 'Read each assertion'], t, [2.3, 4.3]);
    },
    review(t) {
      base('Devin Review', 'Find bugs before they merge', 'A finding linked to the exact lines, with a suggested fix.', t, 4);
      swap(['review', [332, 0, 1090, 699]], ['reviewDetail', [332, 0, 1090, 699]], wide, t, 2.6, {
        focus: [{ box: [1022, 386, 379, 148], at: 3.3 }],
      });
      cue(['Analyze the diff', 'Inspect a finding', 'Review the suggested fix'], t, [2.6, 4.7]);
    },
    slack(t) {
      base('Devin in Slack', 'Delegate from the conversation', 'Tag @Devin. Assign the work. Continue in the thread.', t, 5);
      swap(['slackA', [470, 72, 944, 680]], ['slackB', [470, 72, 944, 680]], wide, t, 3, {
        zoom: [870, 120, 535, 605], at: 3.8,
      });
      cue(['Tag @Devin', 'Follow the session in the thread'], t, [3]);
    },
    automate(t) {
      base('Automations', 'Put repeat work on autopilot', 'Schedule the job. Define the instructions. Let Devin run it.', t, 6);
      proof('automation', [466, 65, 808, 344], wide, t, {
        zoom: [476, 142, 788, 243], at: 2.4,
        focus: [
          { box: [482, 176, 776, 50], at: 1.1, until: 2.6 },
          { box: [482, 279, 776, 99], at: 2.8 },
        ],
      });
      cue(['Choose the trigger', 'Define the job', 'Repeat automatically'], t, [2.4, 4.9]);
    },
    skills(t) {
      base('Skills', 'Teach Devin\nyour process', 'Reusable instructions.\nApplied when relevant.', t, 7, true);
      proof('skill', [595, 20, 830, 725], hero, t, {
        zoom: [604, 247, 798, 350], at: 2.3,
        focus: [
          { box: [615, 441, 774, 90], at: 1.2, until: 3.3 },
          { box: [616, 372, 580, 29], at: 3.5 },
        ],
      });
      cue(['Write the procedure', 'Reuse it across sessions'], t, [3.4]);
    },
    connect(t) {
      base('MCP + Plugins', 'Connect the\ntools you use', 'Bring tools and live context\ninto Devin’s workflow.', t, 8, true);
      swap(['marketplace', [464, 105, 820, 240]], ['mcp', [645, 30, 780, 498]], hero, t, 3, {
        focus: [{ box: t < 3 ? [775, 274, 82, 32] : [1375, 189, 45, 31], at: t < 3 ? 1.4 : 3.1 }],
      });
      cue(['Find a plugin', 'Enable its MCP tools'], t, [3]);
    },
    parallel(t) {
      base('Managed Devins', 'One task. A team of Devins.', 'Delegate independent work and bring the results together.', t, 9);
      proof('managed', [306, 72, 853, 530], wide, t, {
        zoom: [305, 181, 850, 403], at: 2.4,
        focus: [
          { box: [315, 268, 805, 68], at: 1.15, until: 2.65 },
          { box: [315, 347, 805, 68], at: 2.7, until: 4.2 },
          { box: [315, 427, 805, 68], at: 4.25, until: 5.7 },
          { box: [315, 506, 805, 68], at: 5.75 },
        ],
      });
      cue(['Split the work', 'Four managed sessions', 'Coordinate the results'], t, [2.4, 6]);
    },
    workflow(t) {
      base('Dynamic Workflows', 'Orchestrate the whole job', 'Connected stages. Parallel agents. Results you can inspect.', t, 10);
      swap(['workflow', [10, 0, 1420, 662]], ['workflowResult', [12, 35, 1411, 620]], wide, t, 5.6, {
        focus: t < 5.6 ? [] : [{ box: [600, 138, 804, 140], at: 6.2 }],
      });
      cue(['Start the pipeline', 'Watch agents progress', 'Inspect the final result'], t, [2.7, 5.6]);
    },
    platforms(t) {
      base('Multiplatform', 'Build across\nplatforms', 'Web. Desktop.\niPhone. iPad.', t, 11, true);
      swap(['windows', [761, 148, 667, 510]], ['native', [790, 155, 634, 487]], hero, t, 3.8);
      cue(['Windows desktop', 'iPhone + iPad on macOS'], t, [3.8]);
      text('Linux · macOS · Windows', 84, 580, 20, 500, BLUE);
      text('Windows availability is limited.', 84, 618, 16, 400, MUTED);
    },
  };

  function title(t, close = false) {
    surface();
    ctx.save();
    const p = out(progress(t, 0, 0.85));
    ctx.globalAlpha *= p;
    ctx.translate(0, 22 * (1 - p));
    ctx.drawImage(images.get('avatar'), 576, 165, 94, 94);
    text('Devin', 695, 214, 84, 600);
    ctx.textAlign = 'center';
    text(close ? 'Build. Test. Review. Repeat.' : 'Your AI software engineer', 720, 352, 49, 500);
    ctx.restore();
    ctx.save();
    ctx.textAlign = 'center';
    if (close) text('app.devin.ai', 720, 492, 28, 500, BLUE);
    else ['Build', 'Test', 'Review'].forEach((word, i) => {
      const box = [324 + i * 274, 467, 244, 70];
      rect(box, 15);
      ctx.fillStyle = '#fff';
      ctx.fill();
      const active = Math.min(2, Math.floor(Math.max(0, t - 0.8) / 0.8));
      if (i === active) {
        rect(box, 15);
        ctx.strokeStyle = BLUE;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      text(word, box[0] + 122, 502, 25, 500, i === active ? BLUE : INK);
    });
    ctx.restore();
  }

  async function loadAction(seconds) {
    const frame = Math.min(288, Math.max(1, Math.floor(seconds * 24) + 1));
    if (!action.has(frame)) {
      const image = new Image();
      image.src = `${root}build/action/${String(frame).padStart(4, '0')}.jpg`;
      await image.decode();
      action.set(frame, image);
      if (action.size > 8) action.delete(action.keys().next().value);
    }
    images.set('action', action.get(frame));
  }

  window.SCENES = scenes;
  window.CONFERENCE_READY = window.film.ready.then(async () => {
    const names = ['wiki', 'wikiCode', 'promptStart', 'promptMiddle', 'prompt', 'pr', 'review', 'reviewDetail', 'slackA', 'slackB', 'automation', 'skill', 'marketplace', 'mcp', 'managed', 'workflow', 'workflowResult', 'native', 'windows', 'retest-viewer'];
    await Promise.all(names.map(async name => {
      const image = new Image();
      image.src = `${root}shots/${name}.png`;
      await image.decode();
      images.set(name, image);
    }));
    const avatar = new Image();
    avatar.src = '../brand/DEVIN_AVATAR_SQUARE_BLACK_NO_BG.png';
    await avatar.decode();
    images.set('avatar', avatar);
    window.film.frames = Math.round(duration * 60);
    window.film.timeline = () => ({ chapters, introEnd: window.SPEC.introHold * 60, uiEnd: ending * 60, frames: window.film.frames });
    window.film.renderFrame = async frame => {
      const seconds = frame / 60;
      const index = chapters.findIndex(chapter => seconds >= chapter.start && seconds < chapter.start + chapter.hold);
      if (index === 2) await loadAction(Math.max(0, seconds - chapters[2].start - 0.5));
      ctx.resetTransform();
      ctx.clearRect(0, 0, 3840, 2160);
      ctx.scale(3840 / 1440, 2160 / 810);
      ctx.textAlign = 'left';
      if (seconds < window.SPEC.introHold) title(seconds);
      else if (seconds >= ending) title(seconds - ending, true);
      else {
        const chapter = chapters[index], t = seconds - chapter.start;
        const p = ease(progress(t, 0, 0.45));
        if (p < 1) {
          if (index === 0) title(window.SPEC.introHold - 0.1);
          else {
            if (index === 3) await loadAction(11.45);
            scenes[chapters[index - 1].scene](chapters[index - 1].hold - 0.05);
          }
        }
        ctx.save();
        ctx.globalAlpha = p;
        scenes[chapter.scene](t);
        ctx.restore();
      }
    };
  });
})();
