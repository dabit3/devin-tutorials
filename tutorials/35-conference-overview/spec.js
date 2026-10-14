const key=(at,box)=>({at,box});
const shot=(id,title,action,source,start,duration,crop,extra={})=>({id,title,action,source,in:start,duration,crop,...extra});
const section=(title,benefit,shots)=>[
  {id:shots[0].id+'-intro',kind:'feature',title,benefit,duration:3.2,next:shots[0].id},...shots,
];
export const film={
  fps:60,width:3840,height:2160,viewport:[192,198,3456,1944],minimumEditorialType:90,
  segments:[
    {id:'opening',kind:'intro',duration:3.2},
    ...section('DeepWiki','Know your codebase.',[
      shot('wiki','DeepWiki','Explore the architecture','35-deepwiki.mp4',0,10,[160,80,2560,1440],{
        camera:[key(0,[160,80,2560,1440]),key(2,[160,80,2560,1440]),key(3.2,[850,0,1920,1080]),key(5.6,[480,0,1920,1080])],
      }),
    ]),
    ...section('Ask','Answers, grounded in code.',[
      shot('code','Ask','Follow the source','10-code-proof.mp4',4.5,8.5,[80,380,1920,1080],{
        camera:[key(0,[80,380,1920,1080]),key(1.3,[80,380,1920,1080]),key(2.2,[80,440,1280,720]),key(4.3,[80,440,1280,720]),key(5.5,[1160,200,1600,900])],
        highlights:[{start:2.25,end:4.25,box:[262.71875,633,226.0625,29],padding:12}],
      }),
    ]),
    ...section('Delegation','Describe it. Devin builds it.',[
      shot('request','Delegation','Describe the outcome','01-request.mp4',1.2,8,[320,280,832,468]),
    ]),
    ...section('Computer Use','Test like a user.',[
      shot('hero-search','Computer Use','Search real content','hero-northstar-852411d.mp4',2,7,[0,0,2880,1620],{
        camera:[key(0,[0,0,2880,1620]),key(1.1,[0,0,2880,1620]),key(2.1,[170,520,1920,1080])],
        highlights:[{start:4.55,end:6.5,box:[256,650.0625,840,88],padding:14}],
      }),
      shot('hero-filter','Computer Use','Filter. Switch days.','hero-northstar-852411d.mp4',10,9,[200,170,2560,1440],{
        camera:[key(0,[200,170,2560,1440]),key(4.2,[200,170,2560,1440]),key(5.2,[180,500,1920,1080])],
      }),
      shot('hero-conflict','Computer Use','Catch an overlap','hero-northstar-852411d.mp4',21,8.5,[950,520,1920,1080],{
        camera:[key(0,[950,520,1920,1080]),key(4.5,[950,520,1920,1080]),key(5.7,[170,170,2560,1440])],
        highlights:[{start:5.85,end:8.2,box:[256,786.0625,2368,155],padding:14}],
      }),
      shot('hero-resolve','Computer Use','Resolve it. Export.','hero-northstar-852411d.mp4',32,15,[480,180,1920,1080],{
        camera:[key(0,[480,180,1920,1080]),key(8.8,[480,180,1920,1080]),key(10,[640,360,1600,900])],
      }),
      shot('finding','Computer Use','A real finding','28-real-finding.mp4',1,5.5,[672,660,1536,864]),
    ]),
    ...section('Collaboration','Steer the work.',[
      shot('steer','Collaboration','Keep control','21-steer.mp4',0,8.5,[624,670,1632,918]),
    ]),
    ...section('Managed Devins','Bring a team.',[
      shot('agents','Managed Devins','Independent reviewers','24-agents-and-changes.mp4',1.8,4.2,[1170,0,1696,954],{
        camera:[key(0,[1170,0,1696,954]),key(1.2,[1170,0,1696,954]),key(2.1,[1250,120,1472,828])],
      }),
    ]),
    ...section('Cloud IDE','Step into the workspace.',[
      shot('workspace','Cloud IDE','Open the live source','36-live-workspace.mp4',1,7.5,[650,60,1920,1080],{
        camera:[key(0,[650,60,1920,1080]),key(3.5,[650,60,1920,1080]),key(4.5,[0,40,1920,1080])],
      }),
    ]),
    ...section('Devin Review','Review before you merge.',[
      shot('review','Devin Review','Inspect the branch','25-pr-review.mp4',1.5,8.5,[1180,0,1696,954],{
        camera:[key(0,[1180,0,1696,954]),key(3.8,[1180,0,1696,954]),key(4.8,[1250,260,1600,900])],
      }),
    ]),
    ...section('Recorded tests','Watch what happened.',[
      shot('replay','Recorded tests','Replay the evidence','30-recording-replay.mp4',0,4,[608,220,1920,1080]),
    ]),
    {id:'retest-intro',kind:'feature',title:'Verify the fix.',benefit:'Test again. With the keyboard.',duration:2.8,next:'retest',phase:true},
    shot('retest','Computer Use','Verify the fix','retest-northstar-3dbd344.mp4',5.5,15,[640,360,1600,900],{
      camera:[key(0,[640,360,1600,900]),key(11.6,[640,360,1600,900]),key(12.8,[1240,0,1600,900])],
      beats:[{start:2,title:'Export the calendar'},{start:7,title:'Tab wraps forward'},{start:9,title:'Shift–Tab wraps back'},{start:13,title:'Escape restores focus'}],
      highlights:[
        {start:2.45,end:3,box:[1813.125,1034,208.875,80],padding:14},
        {start:7.2,end:8.3,box:[1800.15625,522,221.84375,80],padding:14},
        {start:9.25,end:10.9,box:[1813.125,1034,208.875,80],padding:14},
        {start:13.1,end:14.3,box:[2324.4375,31,299.5625,80],padding:14},
      ],
    }),
    ...section('Skills','Your playbook. On repeat.',[
      shot('skill-invoke','Skills','Invoke your playbook','33-skill-invoke.mp4',0,7,[608,666,1664,936]),
      shot('skill-result','Skills','Activate your playbook','37-skill-run.mp4',.8,8.5,[700,220,1600,900],{
        camera:[key(0,[700,220,1600,900]),key(1.7,[740,200,1056,594]),key(3.9,[740,200,1056,594]),key(5.2,[700,310,1600,900])],
        beats:[{start:5.2,title:'Checks passed'}],
      }),
    ]),
    {id:'closing',kind:'outro',duration:3.5},
  ],
};
