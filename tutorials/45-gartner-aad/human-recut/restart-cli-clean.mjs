import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import {Rig} from './rig.mjs';
const log=process.argv[2];
if(!/^[a-z0-9-]+$/.test(log||''))throw Error('Expected a private log name');
if(fs.existsSync('/home/ubuntu/work/aad-human/profile/'+log+'.ptylog'))throw Error('Log already exists');
const matches=execFileSync('ps',['-C','devin','-o','pid=,args='],{encoding:'utf8'}).split('\n').filter(s=>s.includes('--resume invented-seed'));
if(matches.length!==1)throw Error('Expected exactly one owned original local CLI');
const pid=matches[0].trim().split(/\s+/)[0];
let wrapper=Number(pid);
for(let depth=0;depth<6;depth++){
 const stat=fs.readFileSync('/proc/'+wrapper+'/stat','utf8');
 if(stat.slice(stat.indexOf('(')+1,stat.lastIndexOf(')'))==='script')break;
 wrapper=Number(stat.slice(stat.lastIndexOf(')')+2).split(' ')[1]);
 if(depth===5)throw Error('Owned CLI has no script wrapper; shell input refused');
}
const r=await new Rig().connect();
try{
 await r.focus('konsole');await r.key('ctrl+d');
 execFileSync('python3',['-c','import os,select,sys\nfor pid in sys.argv[1:]:\n try: fd=os.pidfd_open(int(pid))\n except ProcessLookupError: continue\n assert select.select([fd],[],[],5)[0], "Owned CLI/wrapper did not exit; shell input refused"\n os.close(fd)',pid,String(wrapper)]);
 await r.h.typeText("clear && script -q -f /home/ubuntu/work/aad-human/profile/"+log+".ptylog -c 'devin --resume invented-seed'");
 await r.key('Return');await r.h.moveTo(3560,540);
}finally{r.close();}
