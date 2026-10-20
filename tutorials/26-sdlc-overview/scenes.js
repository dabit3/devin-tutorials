(() => {
const BLUE = '#2078ff', INK = '#191919', SUB = 'rgba(25,25,25,.55)', LINE = 'rgba(25,25,25,.15)';
const STAGES = ['Understand', 'Build', 'Test', 'Verify', 'Review', 'Secure', 'Operate'];
const enter = (k, s, t = 0, d = .75) => k.eOutQuint(k.prog(s, t, t + d));

function text(ctx, k, value, x, y, size = 24, a = 1, weight = 500, color = INK, family = 'Inter') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  k.font(size, weight, family); ctx.fillText(value, x, y); ctx.restore();
}
function card(ctx, k, x, y, w, h, a = 1, active = 0, r = 20) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.shadowColor = 'rgba(0,0,0,.055)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 9;
  k.rr(x - w / 2, y - h / 2, w, h, r); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.lineWidth = active ? 1.6 : 1; ctx.strokeStyle = active ? `rgba(32,120,255,${active})` : 'rgba(25,25,25,.10)'; ctx.stroke(); ctx.restore();
}
function mark(ctx, k, x, y, size = 44, a = 1) {
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.drawImage(k.AVATAR, x - size / 2, y - size / 2, size, size); ctx.restore();
}
function pill(ctx, k, value, x, y, a = 1) {
  k.font(17, 500); const w = ctx.measureText(value).width + 38;
  card(ctx, k, x, y, w, 42, a, 0, 21); text(ctx, k, value, x, y, 17, a);
}
function node(ctx, k, x, y, title, lines = [], a = 1, active = 0, w = 320, h = 144, avatar = false) {
  const yy = y + 14 * (1 - a); card(ctx, k, x, yy, w, h, a, active);
  const top = avatar ? -57 : -14, bottom = lines.length ? 40 + (lines.length - 1) * 26 + 9 : 14, c = yy - (top + bottom) / 2;
  if (avatar) mark(ctx, k, x, c - 40, 34, a);
  text(ctx, k, title, x, c, 27, a, 600);
  lines.forEach((l, i) => text(ctx, k, l, x, c + 40 + i * 26, 18, a, 400, SUB));
}
function link(ctx, k, x0, y0, x1, y1, s, t = 0, horizontal = false) {
  const p = k.eInOut(k.prog(s, t, t + .9)), mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
  const P = u => {
    const v = 1 - u, a = horizontal ? [mx, y0] : [x0, my], b = horizontal ? [mx, y1] : [x1, my];
    return [v*v*v*x0 + 3*v*v*u*a[0] + 3*v*u*u*b[0] + u*u*u*x1, v*v*v*y0 + 3*v*v*u*a[1] + 3*v*u*u*b[1] + u*u*u*y1];
  };
  ctx.save(); ctx.globalAlpha = k.alpha;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.bezierCurveTo(horizontal ? mx : x0, horizontal ? y0 : my, horizontal ? mx : x1, horizontal ? y1 : my, x1, y1);
  ctx.save(); ctx.globalAlpha *= k.prog(s, t - .25, t + .15); ctx.strokeStyle = LINE; ctx.lineWidth = 1.4; ctx.stroke(); ctx.restore();
  if (p > 0) {
    ctx.beginPath(); ctx.moveTo(x0, y0); for (let i = 1; i <= Math.ceil(48*p); i++) ctx.lineTo(...P(Math.min(p, i/48)));
    ctx.strokeStyle = 'rgba(32,120,255,.6)'; ctx.stroke();
  }
  const u = (s - t) / 3.8 % 1;
  if (s > t && u > .02 && u < .98) {
    const [x, y] = P(u); ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI*2); ctx.fillStyle = BLUE; ctx.globalAlpha *= Math.min(1, u*8, (1-u)*8); ctx.fill();
  }
  ctx.restore();
}
function rail(ctx, k, active) {
  const w = 160, gap = 18, x0 = 720 - (STAGES.length*w + (STAGES.length-1)*gap)/2;
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.strokeStyle = LINE; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0+w/2, 65); ctx.lineTo(1440-x0-w/2, 65); ctx.stroke(); ctx.restore();
  STAGES.forEach((l, i) => { const x = x0 + i*(w+gap) + w/2; card(ctx, k, x, 65, w, 44, 1, active === i ? .8 : 0, 22); text(ctx, k, l, x, 65, 16, 1, active === i ? 600 : 400, active === i ? BLUE : SUB); });
}
function header(ctx, s, k, section, title, active = -1) {
  rail(ctx, k, active); const a = enter(k, s, .05);
  text(ctx, k, section, 720, 145, 14, a, 500, SUB, 'JetBrains Mono'); text(ctx, k, title, 720, 198, 38, a, 600);
}
function at(scene, phrase, fallback) {
  const spec = window.SPEC, key = Object.keys(spec.edit).find(key => spec.edit[key].scene === scene);
  const line = spec.voLines?.[key];
  if (!line) return fallback;
  const chunk = line.chunks.find(c => c.text.toLowerCase().includes(phrase.toLowerCase()));
  return chunk ? Math.max(.4, chunk.t0) : fallback;
}
function flow(scene, section, title, active, nodes, footer) {
  return (ctx, s, k) => {
    header(ctx, s, k, section, title, active);
    let last = 0;
    nodes.forEach((n, i) => {
      const t = at(scene, n.cue || n.title, .6+i*1.05), x = [300,720,1140][i]; last = Math.max(last, t);
      if (i) link(ctx, k, x-260, 455, x-160, 455, s, t, true);
      node(ctx, k, x, 455, n.title, n.lines, enter(k,s,t), i===1 ? .6 : 0, 320, 154, n.avatar);
    });
    if (footer) {
      const f = typeof footer === 'string' ? { text: footer } : footer;
      pill(ctx, k, f.text, 720, 640, enter(k, s, f.cue ? at(scene, f.cue, 3.5) : Math.max(3.5, last + .8)));
    }
  };
}
function overview(ctx, s, k) {
  text(ctx,k,'THE SOFTWARE LIFECYCLE',720,112,15,enter(k,s),500,SUB,'JetBrains Mono');
  text(ctx,k,'Devin powers every stage',720,165,38,enter(k,s,.1),600);
  const labels = [['Understand','Code and context'],['Build','Make the change'],['Test','Run the checks'],['Verify','See it working'],['Review','Find and fix issues'],['Secure','Address findings'],['Operate','Act on signals']];
  const w = 172, gap = 14, y = 528, x0 = 720 - (7*w + 6*gap)/2 + w/2;
  const la = enter(k,s,.5,1.2);
  ctx.save(); ctx.globalAlpha = k.alpha*la; ctx.strokeStyle = LINE; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + 6*(w+gap), y); ctx.stroke(); ctx.restore();
  labels.forEach(([t,sub],i) => {
    const x = x0 + i*(w+gap), a = enter(k,s,.5+i*.16), yy = y + 14*(1-a);
    link(ctx,k,720,356,x,y-58,s,1+i*.3);
    card(ctx,k,x,yy,w,116,a,0,18);
    text(ctx,k,t,x,yy-13,24,a,600); text(ctx,k,sub,x,yy+18,15,a,400,SUB);
  });
  const da = enter(k,s,.2);
  card(ctx,k,720,300,168,112,da,.7); mark(ctx,k,720,281,38,da); text(ctx,k,'Devin',720,325,23,da,600);
  pill(ctx,k,'Your team directs the whole process',720,668,enter(k,s,at('overview','directs',6.5)));
}
function fusion(ctx,s,k) {
  header(ctx,s,k,'HOW THE WORK GETS DONE','Fusion: a frontier lead with an efficient sidekick',1);
  text(ctx,k,'One of many model options in Devin Cloud',720,240,18,enter(k,s,.3),400,SUB);
  const t0 = at('fusion','frontier',3), t1 = at('fusion','sidekick',4.5), t2 = at('fusion','delegates',7);
  card(ctx,k,720,321,230,84,enter(k,s,.6),.6); mark(ctx,k,655,321,38,enter(k,s,.6)); text(ctx,k,'Your task',752,321,24,enter(k,s,.6),600);
  link(ctx,k,650,363,460,417,s,t0); link(ctx,k,790,363,980,417,s,t1);
  node(ctx,k,460,489,'Frontier lead',['Makes the key decisions','Plans and reviews'],enter(k,s,t0),.6,370,144);
  node(ctx,k,980,489,'Efficient sidekick',['Takes delegated work','Edits, builds and tests'],enter(k,s,t1),0,370,144);
  link(ctx,k,645,489,795,489,s,t2,true);
  text(ctx,k,'DELEGATES',720,470,12,enter(k,s,t2),500,SUB,'JetBrains Mono');
  pill(ctx,k,'Frontier-level results at up to 60% lower cost in Cognition’s benchmark',720,612,enter(k,s,at('fusion','sixty',12)));
}
function managed(ctx,s,k) {
  header(ctx,s,k,'PARALLEL EXECUTION','A coordinator for work that spans many modules',1);
  node(ctx,k,720,321,'Coordinator',['Scopes work and combines results'],enter(k,s,.6),.7,380,144,true);
  [350,720,1090].forEach((x,i) => {
    link(ctx,k,720,393,x,428,s,1.7+i*.3);
    node(ctx,k,x,505,'Managed Devin',[['Module A','Module B','Module C'][i],'Its own isolated VM'],enter(k,s,2.3+i*.3),0,290,154,true);
  });
  pill(ctx,k,'Migrations • Test coverage • Work across repositories',720,620,enter(k,s,4));
}
function services(ctx,s,k) {
  header(ctx,s,k,'MCP IN PRACTICE','Bring runtime evidence into the investigation',6);
  node(ctx,k,720,334,'Devin',['Investigates with connected tools'],enter(k,s,.5),.7,410,144,true);
  const data = [['Datadog',['Logs and observability']],['Sentry',['Errors and event context']],['Metabase',['Data and analytics context']]];
  data.forEach(([title,lines],i) => {
    const x=[300,720,1140][i],t=at('services',title,1.4+i*1.5); link(ctx,k,x,474,720,406,s,t);
    node(ctx,k,x,532,title,lines,enter(k,s,t),0,320,116);
  });
  text(ctx,k,'Available tools depend on the server and permissions you connect',720,640,18,enter(k,s,6),400,SUB);
}
function automation(ctx,s,k) {
  header(ctx,s,k,'WHEN WORK STARTS','Automations connect a signal to an action',6);
  const data=[['Trigger',['Event or schedule']],['Conditions',['Match only what matters']],['Action',['Start or message a session','With the event as context']]];
  data.forEach(([title,lines],i)=>{
    const x=[300,720,1140][i],t=at('automation',['trigger','conditions','action'][i],3+i*1.2); if(i) link(ctx,k,x-260,393,x-160,393,s,t,true);
    node(ctx,k,x,393,title,lines,enter(k,s,t),i===2?.7:0,320,170,i===2);
  });
  pill(ctx,k,'Create an automation by describing it in natural language',720,578,enter(k,s,at('automation','natural',1.5)));
}
function triggers(ctx,s,k) {
  header(ctx,s,k,'RECURRING AND EVENT-DRIVEN WORK','Start the right task at the right time',6);
  [['CI failure','Fix the failing branch'],['Schedule','Sweep errors or update dependencies'],['Webhook','Investigate an external alert']].forEach(([title,sub],i)=>{
    const x=[300,720,1140][i],t=.5+i*1.25; node(ctx,k,x,377,title,[sub],enter(k,s,t),0,338,132);
    link(ctx,k,x,444,720,528,s,t+.7);
  });
  card(ctx,k,720,572,560,88,enter(k,s,4),.6); mark(ctx,k,500,572,36,enter(k,s,4)); text(ctx,k,'Devin picks up the work automatically',750,572,23,enter(k,s,4),600);
}
function incident(ctx,s,k) {
  header(ctx,s,k,'AN EXAMPLE OF THE FULL LOOP','Production feedback becomes the next improvement',6);
  const labels=[['Alert','Webhook or schedule'],['Investigate','MCP tools + code'],['Fix and verify','Tests + a pull request'],['Human review','Merge and release']];
  const pos=[[370,329],[1070,329],[1070,556],[370,556]], starts=[.5,at('incident','investigate',2.5),at('incident','test',5.5),at('incident','team',8.5)];
  pos.forEach(([x,y],i)=>{
    const [nx,ny]=pos[(i+1)%4],horizontal=y===ny;
    link(ctx,k,x+(horizontal?(nx>x?160:-160):0),y+(horizontal?0:(ny>y?55:-55)),nx+(horizontal?(nx>x?-160:160):0),ny+(horizontal?0:(ny>y?-55:55)),s,starts[i]+.7,horizontal);
  });
  pos.forEach(([x,y],i)=>node(ctx,k,x,y,labels[i][0],[labels[i][1]],enter(k,s,starts[i]),0,320,110));
  mark(ctx,k,720,428,48,enter(k,s,1)); text(ctx,k,'Your engineering process',720,477,18,enter(k,s,1),500,SUB);
}
function practices(ctx,s,k) {
  header(ctx,s,k,'HOW YOUR TEAM WORKS','Reusable procedures, not a new prompt every time');
  const ts=[at('practices','Skills',.6),at('practices','playbooks',1.2),at('practices','memory',4.5),at('practices','Automation-started',8)];
  const focus=i=>.6*k.prog(s,ts[i],ts[i]+.4)*(1-k.prog(s,ts[i+1]+(i===0?1.2:0),ts[i+1]+(i===0?1.6:.4)));
  node(ctx,k,310,470,'Skills',['Discoverable procedures','Versioned with your code'],enter(k,s,ts[0]),focus(0),335,166);
  node(ctx,k,720,470,'Playbooks',['Reusable task instructions','Attached to sessions'],enter(k,s,ts[1]),focus(1),335,166);
  node(ctx,k,1130,470,'Personal memory',['Preferences and lessons','For your future sessions'],enter(k,s,ts[2]),focus(2),335,166);
  text(ctx,k,'Automation-started sessions do not use personal memory',720,640,18,enter(k,s,ts[3]),400,SUB);
}
function uses(ctx,s,k) {
  header(ctx,s,k,'WHERE THE LIFECYCLE PAYS OFF','Delegate an outcome, not just a coding step');
  const cards=[['Ship a feature',['Understand → build → verify']],['Migrate a system',['Coordinate parallel changes']],['Raise test coverage',['Write tests → run checks']],['Reduce security backlog',['Findings → reviewed fixes']]];
  cards.forEach(([title,lines],i)=>{
    const x=i%2?1015:425,y=i<2?350:548,a=enter(k,s,.5+i*1.6);
    node(ctx,k,x,y,title,lines,a,0,490,138);
  });
}
function system(ctx,s,k) {
  header(ctx,s,k,'ONE CONNECTED SYSTEM','Context, execution, feedback and human control');
  const data=[['Understand',['DeepWiki + Ask Devin']],['Execute',['Sessions + managed Devins']],['Connect',['MCP tools + automations']],['Govern',['Tests + review + your pipeline']]];
  data.forEach(([title,lines],i)=>{
    const x=[240,560,880,1200][i],t=.6+i*1.25;
    if(i)link(ctx,k,x-185,409,x-135,409,s,t,true);
    node(ctx,k,x,409,title,lines,enter(k,s,t),0,270,150);
  });
  pill(ctx,k,'Devin does the work. Your team decides what ships.',720,596,enter(k,s,5.5));
}

window.SCENES = {
  overview,
  deepwiki: flow('deepwiki','UNDERSTAND THE SYSTEM','DeepWiki gives the codebase a readable map',0,[{title:'Your repository',lines:['Source code and structure'],cue:'repositories'},{title:'DeepWiki',lines:['Documentation and diagrams'],avatar:true},{title:'Shared understanding',lines:['Architecture and source links'],cue:'architecture'}],'Start with context, before making a change'),
  plan: flow('plan','SCOPE THE CHANGE','Turn tickets and codebase questions into a plan',0,[{title:'Jira or Linear',lines:['Analyze and scope the ticket'],cue:'ticket'},{title:'Ask Devin',lines:['Answers grounded in code'],cue:'Ask Devin'},{title:'Plan the work',lines:['Relevant files and approach'],cue:'plan'}],'Explore first. Delegate with the right context.'),
  build: flow('build','IMPLEMENT THE CHANGE','Devin works in its own development environment',1,[{title:'Your task',lines:['A goal and acceptance criteria'],cue:'task'},{title:'Devin session',lines:['Its own machine'],avatar:true,cue:'machine'},{title:'Pull request',lines:['Your repository conventions'],cue:'pull request'}],{text:'Linux, macOS or Windows machines',cue:'Linux'}),
  fusion, managed,
  test: flow('test','RUN THE CHECKS','Run the checks your repository already uses',2,[{title:'Implementation',lines:['Code under test'],cue:'tests'},{title:'Test and fix',lines:['Test suites, lint and types'],avatar:true,cue:'lint'},{title:'Evidence',lines:['Report what was checked'],cue:'checked'}],'Write new tests using your team’s patterns'),
  computer: flow('computer','VERIFY THE BEHAVIOR','Computer Use adds the user’s point of view',3,[{title:'Running application',lines:['Browser or desktop'],cue:'Computer Use'},{title:'Devin tests the UI',lines:['Clicks, types and observes'],avatar:true,cue:'interface'},{title:'Visual evidence',lines:['Recordings and screenshots'],cue:'recordings'}],'Exercise the flow a real user would follow'),
  review: flow('review','REVIEW AND ITERATE','A first pass, followed by a feedback loop',4,[{title:'Devin Review',lines:['Correctness and team standards'],cue:'Review'},{title:'Feedback',lines:['Bugs, comments and CI failures'],cue:'comments'},{title:'Auto-Fix',lines:['Responds when enabled'],avatar:true,cue:'Auto-Fix'}],'Push fixes back to the same pull request'),
  secure: flow('secure','SECURITY AND COMPLIANCE','Address findings from your existing scanners',5,[{title:'Your scanners',lines:['SonarQube, Fortify, Veracode'],cue:'security'},{title:'Devin investigates',lines:['Works through the finding'],avatar:true,cue:'scanners'},{title:'Fix pull requests',lines:['Reviewed changes across repos'],cue:'changes'}],'Not a replacement for your security policies'),
  ship: flow('ship','SHIP THROUGH YOUR PROCESS','Human review stays in the delivery path',4,[{title:'Devin’s pull request',lines:['Normal branch protections'],cue:'pull requests'},{title:'Your team',lines:['Reviews and decides to merge'],cue:'team'},{title:'Your delivery pipeline',lines:['Existing CI/CD and releases'],cue:'pipeline'}],'Your controls. Your infrastructure. Your decision.'),
  mcp: flow('mcp','EXTEND DEVIN’S REACH','MCP connects Devin to external tools and data',6,[{title:'Connected systems',lines:['Tools and data sources'],cue:'MCP'},{title:'MCP servers',lines:['Expose authorized tools'],cue:'servers'},{title:'Devin session',lines:['Uses tools in the task'],avatar:true,cue:'tools'}],'Install a plugin, then authorize its connection'),
  services,
  data: flow('data','UNDERSTAND THE IMPACT','Connected data can inform the next decision',6,[{title:'Connected data',lines:['Database and analytics MCPs'],cue:'data'},{title:'Data Analyst',lines:['Queries and visualizations'],avatar:true,cue:'Data Analyst'},{title:'Engineering context',lines:['Metrics, trends and anomalies'],cue:'metrics'}],{text:'Slack • Web app • Mobile app • Anywhere Devin is accessible',cue:'Slack'}),
  automation, triggers, incident, practices, uses, system
};
})();

// Intro: "What happens after the code is written?" (from devin/intro-07-the-question), answered with real UI, then the overview.
(() => {
const BLUE = '#2078ff', INK = '#191919', SUB = 'rgba(25,25,25,.55)', LINE = 'rgba(25,25,25,.15)';
// Music grid of 2-upbeat.mp3: the beat drops at 2.05 s, one beat every 0.5103 s (117.6 BPM).
// introDrop: when the drop lands in the cut (the music starts introDrop - 2.05 s into the intro), so the spoken question fits before it.
const BEAT = 0.5103;
let DROP, T_ANS, T_DEVIN, T_MORPH, T_WORD;
const ANSWERS = [
  { word: 'Tested', label: 'HOW IT WAS TESTED', img: 'tested.png' },
  { word: 'Verified', label: 'COMPUTER USE', img: 'verified.png' },
  { word: 'Reviewed', label: 'DEVIN REVIEW', img: 'reviewed.png' },
  { word: 'Secured', label: 'SECURITY SCAN', img: 'secured.png' },
  { word: 'Shipped', label: 'PULL REQUEST', img: 'shipped.png' },
];
const QUESTION = 'What happens, after the code is written.'.split(' ');
const LEAD = () => window.SPEC.sceneLead || 0;
// each word of the question appears as the narrator says it (by character share of the spoken line)
function init() {
  if (DROP != null) return;
  const S = window.SPEC, e = (S.edit || {})['0005.png'] || {}, line = S.voLines?.['0005.png'];
  DROP = S.introDrop ?? 2.05;
  const beat = n => DROP + n * BEAT;
  T_ANS = ANSWERS.map((_, i) => beat(2 * i)); T_DEVIN = beat(10); T_MORPH = beat(12);
  const total = QUESTION.join(' ').length;
  let off = 0;
  T_WORD = QUESTION.map((w, i) => {
    const t = line ? (e.voDelay || 0) - LEAD() + 0.12 + (line.dur - 0.12) * off / total - 0.08 : .2 + i * .1;
    off += w.length + 1; return t;
  });
}
const STAGES = [['Understand','Code and context'],['Build','Make the change'],['Test','Run the checks'],['Verify','See it working'],['Review','Find and fix issues'],['Secure','Address findings'],['Operate','Act on signals']];
const CARD = { x: 950, y: 470, w: 640, h: 350 }, COL = { x: 566, y: 470, step: 92 };

// Screenshots are drawn synchronously, so every frame waits until they are decoded.
const V = new URLSearchParams(location.search).get('v');
const IMG = {};
const ready = Promise.all(ANSWERS.map(a => { const im = new Image(); im.src = `../../${V}/shots/${a.img}`; IMG[a.img] = im; return im.decode(); }));
if (window.film) { const render = window.film.renderFrame; window.film.renderFrame = async f => { await ready; return render(f); }; }

const enter = (k, c, t, d = .75) => k.eOutQuint(k.prog(c, t, t + d));
function text(ctx, k, value, x, y, size = 24, a = 1, weight = 500, color = INK, family = 'Inter', align = 'center', ls = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = k.alpha * a; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'middle';
  k.font(size, weight, family); ctx.letterSpacing = `${ls}px`; ctx.fillText(value, x, y); ctx.restore();
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
function link(ctx, k, x0, y0, x1, y1, s, t = 0) {
  const p = k.eInOut(k.prog(s, t, t + .9)), my = (y0 + y1) / 2;
  const P = u => { const v = 1 - u; return [v*v*v*x0 + 3*v*v*u*x0 + 3*v*u*u*x1 + u*u*u*x1, v*v*v*y0 + 3*v*v*u*my + 3*v*u*u*my + u*u*u*y1]; };
  ctx.save(); ctx.globalAlpha = k.alpha;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.bezierCurveTo(x0, my, x1, my, x1, y1);
  ctx.save(); ctx.globalAlpha *= k.prog(s, t - .25, t + .15); ctx.strokeStyle = LINE; ctx.lineWidth = 1.4; ctx.stroke(); ctx.restore();
  if (p > 0) {
    ctx.beginPath(); ctx.moveTo(x0, y0); for (let i = 1; i <= Math.ceil(48*p); i++) ctx.lineTo(...P(Math.min(p, i/48)));
    ctx.lineWidth = 1.4; ctx.strokeStyle = 'rgba(32,120,255,.6)'; ctx.stroke();
  }
  const u = (s - t) / 3.8 % 1;
  if (s > t && u > .02 && u < .98) {
    const [x, y] = P(u); ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI*2); ctx.fillStyle = BLUE; ctx.globalAlpha *= Math.min(1, u*8, (1-u)*8); ctx.fill();
  }
  ctx.restore();
}

// The question: word-by-word in the hush before the drop, then it rises to become the header.
function question(ctx, k, c) {
  const q = k.eInOut(k.prog(c, DROP - .62, DROP + .12));
  const out = k.eOut(k.prog(c, T_MORPH, T_MORPH + .45));
  if (out >= 1) return;
  const size = k.lerp(54, 30, q), weight = Math.round(k.lerp(600, 500, q)), ls = k.lerp(-1.6, -.4, q);
  const y = k.lerp(392, 165, q) - 10 * out, tone = k.lerp(1, .55, q) * (1 - out);
  ctx.save(); k.font(size, weight); ctx.letterSpacing = `${ls}px`;
  const ws = QUESTION.map(w => ctx.measureText(w).width), sp = ctx.measureText(' ').width;
  let x = 720 - (ws.reduce((a, b) => a + b, 0) + sp * (QUESTION.length - 1)) / 2;
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = INK;
  QUESTION.forEach((w, i) => {
    const p = enter(k, c, T_WORD[i], .6);
    ctx.globalAlpha = k.alpha * tone * p; ctx.fillText(w, x, y + 16 * (1 - p)); x += ws[i] + sp;
  });
  ctx.restore();
}

// Answers roll up a column, one every two beats; the newest is ink with a blue full stop, earlier ones recede.
function answers(ctx, k, c) {
  const exit = k.eInOut(k.prog(c, T_DEVIN - .34, T_DEVIN + .12));
  if (exit >= 1 || c < T_ANS[0]) return;
  let p = 0; for (let i = 1; i < T_ANS.length; i++) p += k.eInOut(k.prog(c, T_ANS[i] - .06, T_ANS[i] + .5));
  ctx.save(); k.font(80, 600); ctx.letterSpacing = '-2.6px';
  const dot = ctx.measureText('.').width;
  ANSWERS.forEach((a, i) => {
    const rel = i - p, ain = k.eOut(k.prog(c, T_ANS[i], T_ANS[i] + .45));
    if (ain <= 0) return;
    const dim = rel >= 0 ? 1 : rel >= -1 ? k.lerp(1, .18, -rel) : rel >= -2 ? k.lerp(.18, .06, -rel - 1) : Math.max(0, k.lerp(.06, 0, -rel - 2));
    const alpha = ain * dim * (1 - exit), y = COL.y + rel * COL.step + (i === 0 ? 22 * (1 - ain) : 0) - 40 * exit;
    if (alpha <= 0) return;
    ctx.globalAlpha = k.alpha * alpha; ctx.textBaseline = 'middle';
    ctx.textAlign = 'right'; ctx.fillStyle = INK; ctx.fillText(a.word, COL.x - dot, y);
    ctx.textAlign = 'left'; ctx.fillStyle = BLUE; ctx.globalAlpha *= k.clamp(1 - (-rel - .5) * 2);
    ctx.fillText('.', COL.x - dot + 2, y);
  });
  ctx.restore();
}

// A real UI glimpse per answer: each new card lands on top while the previous one recedes behind it.
function glimpses(ctx, k, c) {
  ANSWERS.forEach((a, i) => {
    const t = T_ANS[i], next = i < ANSWERS.length - 1 ? T_ANS[i + 1] : T_DEVIN - .38;
    const ain = k.eOutQuint(k.prog(c, t + .16, t + .86)), gone = k.eInOut(k.prog(c, next - .06, next + .2));
    const alpha = ain * (1 - gone); if (alpha <= 0) return;
    const s = (0.96 + .04 * ain) * (1 - .06 * gone), w = CARD.w * s, h = CARD.h * s;
    const x = CARD.x, y = CARD.y + 46 * (1 - ain) - 34 * gone;
    ctx.save(); ctx.globalAlpha = k.alpha * alpha;
    ctx.shadowColor = 'rgba(0,0,0,.08)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 14;
    k.rr(x - w / 2, y - h / 2, w, h, 16); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
    ctx.save(); k.rr(x - w / 2, y - h / 2, w, h, 16); ctx.clip(); ctx.drawImage(IMG[a.img], x - w / 2, y - h / 2, w, h); ctx.restore();
    k.rr(x - w / 2, y - h / 2, w, h, 16); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(25,25,25,.10)'; ctx.stroke();
    ctx.restore();
    text(ctx, k, a.label, x - w / 2 + 2, y - h / 2 - 22, 13, alpha, 500, SUB, 'JetBrains Mono', 'left', .6);
  });
}

// The final answer is Devin; it settles into Tutorial 26's overview: Devin card above the seven stages.
function devin(ctx, k, c) {
  const a = enter(k, c, T_DEVIN + .06, .8);
  if (a <= 0) return;
  const m = k.eInOut(k.prog(c, T_MORPH, T_MORPH + 1.05));
  const lift = 18 * (1 - a);
  card(ctx, k, 720, 300, k.lerp(196, 168, m), k.lerp(132, 112, m), k.eOut(k.prog(c, T_MORPH + .35, T_MORPH + 1.05)), .7);
  mark(ctx, k, 720, k.lerp(408, 281, m) + lift, k.lerp(68, 38, m), a);
  const size = k.lerp(64, 23, m), ty = k.lerp(486, 325, m) + lift;
  text(ctx, k, 'Devin', 720, ty, size, a, 600, INK, 'Inter', 'center', k.lerp(-1.8, 0, m));
  ctx.save(); k.font(size, 600); ctx.letterSpacing = `${k.lerp(-1.8, 0, m)}px`; const half = ctx.measureText('Devin').width / 2; ctx.restore();
  text(ctx, k, '.', 720 + half + 1, ty, size, a * (1 - k.eOut(k.prog(c, T_MORPH, T_MORPH + .4))), 600, BLUE, 'Inter', 'left');
}
function overview(ctx, k, c) {
  const M = T_MORPH;
  text(ctx, k, 'THE SOFTWARE LIFECYCLE', 720, 112, 15, enter(k, c, M + .15), 500, SUB, 'JetBrains Mono');
  const ta = enter(k, c, M + .25);
  text(ctx, k, 'Devin powers every stage', 720, 165 + 10 * (1 - ta), 38, ta, 600);
  const w = 172, gap = 14, y = 528, x0 = 720 - (7*w + 6*gap)/2 + w/2;
  STAGES.forEach(([t, sub], i) => {
    const x = x0 + i*(w+gap), a = enter(k, c, M + .4 + i * BEAT / 2), yy = y + 14*(1-a);
    if (c > M + .4) link(ctx, k, 720, 356, x, y-58, c, M + .75 + i * .17);
    card(ctx, k, x, yy, w, 116, a, 0, 18);
    text(ctx, k, t, x, yy-13, 24, a, 600); text(ctx, k, sub, x, yy+18, 15, a, 400, SUB);
  });
}

function pill(ctx, k, value, x, y, a = 1) {
  k.font(17, 500); const w = ctx.measureText(value).width + 38;
  card(ctx, k, x, y, w, 42, a, 0, 21); text(ctx, k, value, x, y, 17, a);
}
function cue(key, phrase, fallback) {
  const chunk = window.SPEC.voLines?.[key]?.chunks.find(c => c.text.toLowerCase().includes(phrase));
  return chunk ? Math.max(.4, chunk.t0) : fallback;
}

// The intro beat (0005) runs on the music grid; the overview beat (0010) keeps drawing the same settled diagram on the same clock.
const base = window.SCENES.overview;
Object.assign(window.SCENES, {
  question: (ctx, s, k) => {
    init(); const c = s - LEAD();
    question(ctx, k, c); glimpses(ctx, k, c); answers(ctx, k, c); overview(ctx, k, c); devin(ctx, k, c);
  },
  overview: (ctx, s, k) => {
    const S = window.SPEC; if (!(S.edit || {})['0005.png']) return base(ctx, s, k);
    init();
    const sc = window.film?.timeline?.()?.scenes;
    const off = sc?.['0005.png'] && sc['0010.png'] ? (sc['0010.png'].t0 - sc['0005.png'].t0) / 60 : S.edit['0005.png'].hold;
    const c = s + off - LEAD();
    overview(ctx, k, c); devin(ctx, k, c);
    pill(ctx, k, 'Your team directs the whole process', 720, 668, enter(k, s, cue('0010.png', 'directs', 6.5)));
  },
});
})();
