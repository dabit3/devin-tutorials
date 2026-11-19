import fs from 'node:fs';
import {spawn,execFileSync} from 'node:child_process';
import {getPriority} from 'node:os';
import {setTimeout as delay} from 'node:timers/promises';
import {Rig} from './rig.mjs';
import {startMemoryGuard,timelineErrors,stopOwnedRecorder,awaitEncodedCoverage} from './capture-health.mjs';
import {sectionHealth} from './section-health.mjs';
export class Capture extends Rig {
 async sequence(n,actions,options={}){
  const index=this.data.lines.length;
  await this.line(n,actions,{...options,hold:0});
  const entry=this.data.lines[index];
  entry.subjectSettledStart=entry.actionStart;
  const remaining=entry.voiceSeconds+1.5-(this.time()-entry.actionStart);
  if(remaining>0)await this.wait(remaining*1000,'line '+n+' settled sequence / VO coverage',false);
  entry.actionEnd=this.time();entry.qaMidpoint=(entry.actionStart+entry.actionEnd)/2;
  this.save();
 }
 async stop(){
  this.data.healthErrors=timelineErrors(this.data,this.stderr);
  if(this.data.healthErrors.length){this.data.status='rejected';this.data.rejection=this.data.healthErrors.join('; ');}
  await this.wait(700,'tail handle',false);
  if(this.data.status!=='rejected'){
   const targetSeconds=Math.max(...this.data.lines.map(line=>line.actionEnd),...this.data.waits.map(wait=>wait.end))+1/30;
   try{this.data.outputDrain={targetSeconds,...await awaitEncodedCoverage({readProgress:()=>this.progress,isRunning:()=>this.rec?.exitCode===null&&this.data.status!=='rejected',targetSeconds})};}
   catch(error){if(this.data.status!=='rejected'){this.data.status='rejected';this.data.rejection=error.message;}}
   this.save();
  }
  await super.stop({tail:false});
  this.data.healthErrors=timelineErrors(this.data,this.stderr);
  if(this.data.healthErrors.length){this.data.status='rejected';this.data.rejection=this.data.healthErrors.join('; ');this.save();}
 }
 async start(name){
  const sectionRSS=sectionHealth(name);
  await this.signed();
  this.base='/home/ubuntu/work/aad-human/takes/'+name;
  if(fs.existsSync(this.base+'.mp4'))throw Error('Take already exists');
  this.data={name,video:this.base+'.mp4',status:'recording',rig:{size:'3840x2160',fps:30,crf:18,encoder:'libx264',preset:'ultrafast',tune:'zerolatency',threads:1,queue:512,nice:null,cursor:'native x11grab'},captureEpoch:null,lines:[],waits:[],events:[]};
  this.log=fs.openSync(this.base+'.log','w');
  this.data.sectionRSS=sectionRSS;
  this.rec=spawn('ffmpeg',['-hide_banner','-y','-thread_queue_size','512','-f','x11grab','-framerate','30','-draw_mouse','1','-video_size','3840x2160','-i',':0.0','-an','-c:v','libx264','-preset','ultrafast','-tune','zerolatency','-crf','18','-threads','1','-pix_fmt','yuv420p','-vsync','0','-movflags','+faststart','-progress','pipe:1','-stats_period','0.2','-nostats',this.base+'.mp4'],{env:{...process.env,DISPLAY:':0'},stdio:['pipe','pipe','pipe']});
  try{execFileSync('sudo',['-n','renice','-n','-5','-p',String(this.rec.pid)],{stdio:'pipe'});}catch{this.data.rig.priorityNote='Negative niceness unavailable; inherited priority retained';}
  this.data.rig.nice=getPriority(this.rec.pid);
  this.progress='';this.stderr='';
  this.rec.stderr.on('data',b=>{fs.writeSync(this.log,b);this.stderr+=b;const m=this.stderr.match(/Duration: N\/A, start: ([\d.]+)/);if(m)this.data.captureEpoch=Number(m[1]);});
  this.rec.stdout.on('data',b=>this.progress+=b);
  this.finished=new Promise((resolve,reject)=>{this.rec.once('error',reject);this.rec.once('exit',code=>code===0?resolve():reject(Error('ffmpeg exit '+code)));});
  this.rec.stdin.on('error',error=>{this.data.status='rejected';this.data.rejection=error.message;this.save();});
  startMemoryGuard(this.rec,reason=>{this.data.status='rejected';this.data.memoryGuard=reason;this.data.rejection=reason;this.save();stopOwnedRecorder(this.rec);});
  const until=Date.now()+15000;
  while(!(this.data.captureEpoch&&/frame=[1-9]/.test(this.progress))){if(Date.now()>until)throw Error('Recorder startup timed out');await delay(100);}
  this.save();await this.wait(800,'head handle',false);
 }
}
