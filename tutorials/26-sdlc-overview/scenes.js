(() => {
const BLUE = '#2078ff', INK = '#191919', SUB = 'rgba(25,25,25,.55)', LINE = 'rgba(25,25,25,.15)';
const STAGES = ['Understand', 'Build', 'Test', 'Review', 'Secure', 'Operate'];
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
  if (avatar) mark(ctx, k, x, yy - 43, 34, a);
  text(ctx, k, title, x, yy + (avatar ? -3 : -25), 27, a, 600);
  lines.forEach((l, i) => text(ctx, k, l, x, yy + (avatar ? 34 : 17) + i * 26, 18, a, 400, SUB));
}
function link(ctx, k, x0, y0, x1, y1, s, t = 0, horizontal = false) {
  const p = k.eInOut(k.prog(s, t, t + .9)), mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
  const P = u => {
    const v = 1 - u, a = horizontal ? [mx, y0] : [x0, my], b = horizontal ? [mx, y1] : [x1, my];
    return [v*v*v*x0 + 3*v*v*u*a[0] + 3*v*u*u*b[0] + u*u*u*x1, v*v*v*y0 + 3*v*v*u*a[1] + 3*v*u*u*b[1] + u*u*u*y1];
  };
  ctx.save(); ctx.globalAlpha = k.alpha;
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.bezierCurveTo(horizontal ? mx : x0, horizontal ? y0 : my, horizontal ? mx : x1, horizontal ? y1 : my, x1, y1);
  ctx.strokeStyle = LINE; ctx.lineWidth = 1.4; ctx.stroke();
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
  const w = 166, gap = 24, x0 = 720 - (6*w + 5*gap)/2;
  ctx.save(); ctx.globalAlpha = k.alpha; ctx.strokeStyle = LINE; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0+83, 65); ctx.lineTo(1440-x0-83, 65); ctx.stroke(); ctx.restore();
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
    nodes.forEach((n, i) => {
      const t = at(scene, n.cue || n.title, .6+i*1.05), x = [300,720,1140][i];
      if (i) link(ctx, k, x-260, 401, x-160, 401, s, t, true);
      node(ctx, k, x, 401, n.title, n.lines, enter(k,s,t), i===1 ? .6 : 0, 320, 154, n.avatar);
    });
    if (footer) pill(ctx, k, footer, 720, 594, enter(k,s,3.5));
  };
}
function overview(ctx, s, k) {
  text(ctx,k,'DEVIN ACROSS THE SOFTWARE LIFECYCLE',720,112,15,enter(k,s),500,SUB,'JetBrains Mono');
  const labels = [['Understand','Code and context'],['Build','Implement the change'],['Test','Verify the behavior'],['Review','Find and fix issues'],['Secure','Address findings'],['Operate','Turn signals into work']];
  const pos = [[300,262],[720,262],[1140,262],[1140,552],[720,552],[300,552]];
  pos.forEach(([x,y],i) => {
    const from = i < 3 ? [720,354] : [720,464]; link(ctx,k,...from,x,y+(i<3?52:-52),s,1+i*.45);
    node(ctx,k,x,y,labels[i][0],[labels[i][1]],enter(k,s,.5+i*.2),0,280,104);
  });
  card(ctx,k,720,409,168,112,enter(k,s,.2),.7); mark(ctx,k,720,390,38,enter(k,s,.2)); text(ctx,k,'Devin',720,434,23,enter(k,s,.2),600);
}
function fusion(ctx,s,k) {
  header(ctx,s,k,'HOW THE WORK GETS DONE','Fusion: one Devin, two complementary models',1);
  const t0 = at('fusion','lead',1), t1 = at('fusion','sidekick',4);
  card(ctx,k,720,311,230,92,enter(k,s,.6),.6); mark(ctx,k,655,311,38,enter(k,s,.6)); text(ctx,k,'Your task',752,311,24,enter(k,s,.6),600);
  link(ctx,k,650,357,460,417,s,t0); link(ctx,k,790,357,980,417,s,t1);
  node(ctx,k,460,489,'Frontier lead',['Plans and investigates','Checks correctness'],enter(k,s,t0),.6,370,144);
  node(ctx,k,980,489,'Efficient sidekick',['Implements the plan','Runs builds and tests'],enter(k,s,t1),0,370,144);
  pill(ctx,k,'Choose Fusion in Devin CLI or Desktop',720,620,enter(k,s,6));
}
function adaptive(ctx,s,k) {
  header(ctx,s,k,'MODEL CHOICE','Model routing and model collaboration are different',1);
  const a = enter(k,s,.6); node(ctx,k,435,402,'Fusion',['Lead + sidekick','Collaborate on the same task'],a,.6,450,185);
  node(ctx,k,1005,402,'Adaptive',['Routes each request','Selects an underlying model'],enter(k,s,at('adaptive','Adaptive',3)),0,450,185);
  pill(ctx,k,'The right level of intelligence for the work',720,594,enter(k,s,5));
}
function managed(ctx,s,k) {
  header(ctx,s,k,'PARALLEL EXECUTION','A coordinator for work that spans many modules',1);
  node(ctx,k,720,321,'Coordinator',['Scopes work and combines results'],enter(k,s,.6),.7,380,100,true);
  [350,720,1090].forEach((x,i) => {
    link(ctx,k,720,372,x,432,s,1.7+i*.3);
    node(ctx,k,x,490,'Managed Devin',[['Module A','Module B','Module C'][i],'Its own isolated VM'],enter(k,s,2.3+i*.3),0,290,154,true);
  });
  pill(ctx,k,'Migrations • Test coverage • Work across repositories',720,620,enter(k,s,4));
}
function services(ctx,s,k) {
  header(ctx,s,k,'MCP IN PRACTICE','Bring runtime evidence into the investigation',5);
  node(ctx,k,720,334,'Devin',['Investigates with connected tools'],enter(k,s,.5),.7,410,108,true);
  const data = [['Datadog',['Logs and observability']],['Sentry',['Errors and event context']],['Metabase',['Data and analytics context']]];
  data.forEach(([title,lines],i) => {
    const x=[300,720,1140][i],t=at('services',title,1.4+i*1.5); link(ctx,k,x,474,720,389,s,t);
    node(ctx,k,x,532,title,lines,enter(k,s,t),0,320,116);
  });
  text(ctx,k,'Available tools depend on the server and permissions you connect',720,640,18,enter(k,s,6),400,SUB);
}
function automation(ctx,s,k) {
  header(ctx,s,k,'WHEN WORK STARTS','Automations connect a signal to an action',5);
  const data=[['Trigger',['Event or schedule']],['Conditions',['Match only what matters']],['Action',['Start or message a session']]];
  data.forEach(([title,lines],i)=>{
    const x=[300,720,1140][i],t=.8+i*1.2; if(i) link(ctx,k,x-260,393,x-160,393,s,t,true);
    node(ctx,k,x,393,title,lines,enter(k,s,t),i===2?.7:0,320,145,i===2);
  });
  pill(ctx,k,'The event payload becomes session context',720,572,enter(k,s,4.5));
}
function triggers(ctx,s,k) {
  header(ctx,s,k,'RECURRING AND EVENT-DRIVEN WORK','Start the right task at the right time',5);
  [['CI failure','Fix the failing branch'],['Schedule','Sweep errors or update dependencies'],['Webhook','Investigate an external alert']].forEach(([title,sub],i)=>{
    const x=[300,720,1140][i],t=.5+i*1.25; node(ctx,k,x,377,title,[sub],enter(k,s,t),0,338,132);
    link(ctx,k,x,444,720,528,s,t+.7);
  });
  card(ctx,k,720,572,560,88,enter(k,s,4),.6); mark(ctx,k,500,572,36,enter(k,s,4)); text(ctx,k,'Devin picks up the work automatically',750,572,23,enter(k,s,4),600);
}
function incident(ctx,s,k) {
  header(ctx,s,k,'AN EXAMPLE OF THE FULL LOOP','Production feedback becomes the next improvement',5);
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
  node(ctx,k,310,403,'Skills',['Discoverable procedures','Versioned with your code'],enter(k,s,at('practices','Skills',.6)),.6,335,166);
  node(ctx,k,720,403,'Playbooks',['Reusable task instructions','Attached to sessions'],enter(k,s,at('practices','playbooks',2.5)),0,335,166);
  node(ctx,k,1130,403,'Personal memory',['Preferences and lessons','For your future sessions'],enter(k,s,at('practices','memory',4.5)),0,335,166);
  text(ctx,k,'Automation-started sessions do not use personal memory',720,593,18,enter(k,s,6.5),400,SUB);
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
  plan: flow('plan','SCOPE THE CHANGE','Turn codebase questions and tickets into a plan',0,[{title:'Ask Devin',lines:['Answers grounded in code'],cue:'Ask Devin'},{title:'Plan the work',lines:['Relevant files and approach'],cue:'plan'},{title:'Jira or Linear',lines:['Analyze and scope tickets'],cue:'tickets'}],'Explore first. Delegate with the right context.'),
  build: flow('build','IMPLEMENT THE CHANGE','Devin works in its own development environment',1,[{title:'Your task',lines:['A goal and acceptance criteria'],cue:'task'},{title:'Devin session',lines:['Code, shell and browser'],avatar:true,cue:'environment'},{title:'Pull request',lines:['Your repository conventions'],cue:'pull request'}],'Repo blueprints prepare tools and dependencies'),
  fusion, adaptive, managed,
  test: flow('test','VERIFY THE CHANGE','Run the checks your repository already uses',2,[{title:'Implementation',lines:['Code under test'],cue:'tests'},{title:'Test and fix',lines:['Test suites, lint and types'],avatar:true,cue:'lint'},{title:'Evidence',lines:['Report what was checked'],cue:'checked'}],'Write new tests using your team’s patterns'),
  computer: flow('computer','TEST BEHAVIOR, NOT ONLY CODE','Computer Use adds the user’s point of view',2,[{title:'Running application',lines:['Browser or desktop'],cue:'Computer Use'},{title:'Devin tests the UI',lines:['Clicks, types and observes'],avatar:true,cue:'interface'},{title:'Visual evidence',lines:['Recordings and screenshots'],cue:'recordings'}],'Exercise the flow a real user would follow'),
  review: flow('review','REVIEW AND ITERATE','A first pass, followed by a feedback loop',3,[{title:'Devin Review',lines:['Correctness and team standards'],cue:'Review'},{title:'Feedback',lines:['Bugs, comments and CI failures'],cue:'comments'},{title:'Auto-Fix',lines:['Responds when enabled'],avatar:true,cue:'Auto-Fix'}],'Push fixes back to the same pull request'),
  secure: flow('secure','SECURITY AND COMPLIANCE','Address findings from your existing scanners',4,[{title:'Your scanners',lines:['SonarQube, Fortify, Veracode'],cue:'security'},{title:'Devin investigates',lines:['Works through the finding'],avatar:true,cue:'scanners'},{title:'Fix pull requests',lines:['Reviewed changes across repos'],cue:'changes'}],'Not a replacement for your security policies'),
  ship: flow('ship','SHIP THROUGH YOUR PROCESS','Human review stays in the delivery path',3,[{title:'Devin’s pull request',lines:['Normal branch protections'],cue:'pull requests'},{title:'Your team',lines:['Reviews and decides to merge'],cue:'team'},{title:'Your delivery pipeline',lines:['Existing CI/CD and releases'],cue:'pipeline'}],'Your controls. Your infrastructure. Your decision.'),
  mcp: flow('mcp','EXTEND DEVIN’S REACH','MCP connects Devin to external tools and data',5,[{title:'Connected systems',lines:['Tools and data sources'],cue:'MCP'},{title:'MCP servers',lines:['Expose authorized tools'],cue:'servers'},{title:'Devin session',lines:['Uses tools in the task'],avatar:true,cue:'tools'}],'Install a plugin, then authorize its connection'),
  services,
  data: flow('data','UNDERSTAND THE IMPACT','Connected data can inform the next decision',5,[{title:'Connected data',lines:['Database and analytics MCPs'],cue:'data'},{title:'Data Analyst',lines:['Queries and visualizations'],avatar:true,cue:'Data Analyst'},{title:'Engineering context',lines:['Metrics, trends and anomalies'],cue:'metrics'}],'Available from Slack or the web app'),
  automation, triggers, incident, practices, uses, system
};
})();
