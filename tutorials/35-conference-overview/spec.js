const full=[0,0,2880,1620];
const shot=(id,title,action,source,start,duration,extra={})=>({id,title,action,source,in:start,duration,crop:full,...extra});
const section=(title,benefit,shots)=>[
  {id:shots[0].id+'-intro',kind:'feature',title,benefit,duration:3.2,next:shots[0].id},...shots,
];
export const film={
  fps:60,width:3840,height:2160,viewport:[192,198,3456,1944],minimumEditorialType:90,
  segments:[
    {id:'opening',kind:'intro',duration:3.8},
    ...section('DeepWiki','Know your codebase.',[
      shot('wiki','DeepWiki','Explore the architecture','35-deepwiki.mp4',0,10),
    ]),
    ...section('Ask','Answers, grounded in code.',[
      shot('code','Ask','Follow the source','10-code-proof.mp4',4.5,8.5,{
        highlights:[{start:2.25,end:4.25,box:[262.71875,633,226.0625,29],padding:12}],
      }),
    ]),
    ...section('Delegation','Describe it. Devin builds it.',[
      shot('request','Delegation','Describe the outcome','01-request.mp4',1.2,8,{crop:[0,0,1440,900]}),
    ]),
    ...section('Computer Use','Devin tests in a real browser.',[
      shot('test-session','Computer Use','A test you can watch','38-testing-ui-original.mp4',55,10.5),
      shot('test-interactions','Computer Use','Act. Observe. Verify.','38-testing-ui-original.mp4',117,13.5),
      shot('test-keyboard','Computer Use','Test the keyboard','38-testing-ui-original.mp4',153,14),
      shot('finding','Computer Use','A real finding','28-real-finding.mp4',1,5.5),
    ]),
    ...section('Collaboration','Steer the work.',[
      shot('steer','Collaboration','Keep control','21-steer.mp4',0,8.5),
    ]),
    ...section('Managed Devins','Bring a team.',[
      shot('agents','Managed Devins','Independent reviewers','24-agents-and-changes.mp4',1.8,4.2),
    ]),
    ...section('Cloud IDE','Step into the workspace.',[
      shot('workspace','Cloud IDE','Open the live source','36-live-workspace.mp4',1,7.5),
    ]),
    ...section('Devin Review','Review before you merge.',[
      shot('review','Devin Review','Inspect the branch','25-pr-review.mp4',1.5,8.5),
    ]),
    ...section('Recorded tests','Watch what happened.',[
      shot('replay','Recorded tests','Replay the evidence','40-testing-evidence.mp4',1,6,{highlights:[{box:[1541.9921875,286.484375,351.5234375,45],padding:14,start:3.4,end:5}]}),
    ]),
    {id:'retest-intro',kind:'feature',title:'Verify the fix.',benefit:'Test again. With the keyboard.',duration:2.8,next:'retest',phase:true},
    shot('retest','Computer Use','Retest keyboard focus','39-testing-ui-retest.mp4',123,15,{
      beats:[{start:4,title:'Tab in both directions'}],
    }),
    ...section('Skills','Your playbook. On repeat.',[
      shot('skill-invoke','Skills','Invoke your playbook','33-skill-invoke.mp4',0,7),
      shot('skill-result','Skills','Activate your playbook','37-skill-run.mp4',.8,8.5,{
        beats:[{start:5.2,title:'Checks passed'}],
      }),
    ]),
    {id:'closing',kind:'outro',duration:3.5},
  ],
};
