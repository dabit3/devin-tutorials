import fs from 'node:fs';
import {spawn,execFileSync} from 'node:child_process';
import {getPriority} from 'node:os';
import {setTimeout as delay} from 'node:timers/promises';
import {Rig} from './rig.mjs';
import {startMemoryGuard} from './capture-health.mjs';
const [label,fpsText='30',threadsText='2',tune='default']=process.argv.slice(2);
if(!label||!/^[\w-]+$/.test(label))throw Error('Specify unique benchmark label');
const fps=Number(fpsText),threads=Number(threadsText);
const base='/home/ubuntu/work/aad-human/profile/'+label;
if(fs.existsSync(base+'.mp4'))throw Error('Benchmark already exists');
const env={...process.env,DISPLAY:':0'};
const r=await new Rig().connect();
const processes={};
for(const pid of fs.readdirSync('/proc').filter(x=>/^\d+$/.test(x))){try{const comm=fs.readFileSync(`/proc/${pid}/comm`,'utf8').trim();const cmd=fs.readFileSync(`/proc/${pid}/cmdline`,'utf8');let role=comm;if(comm==='devin-desktop')role+=' '+(cmd.match(/--type=([^\0]+)/)?.[1]||'main')+(cmd.includes('NodeService')?' NodeService':'');if(/language_server/.test(comm))role='Windsurf language server';if(comm==='java')role+=' '+(cmd.includes('maven')?'Maven':cmd.includes('ClaimsApplication')?'claims service':'JVM');processes[pid]={comm,role};}catch{}}
const topLog=fs.openSync(base+'.top.txt','w');
const top=spawn('top',['-b','-d','1','-n','18','-w','140'],{env:{...env,HOME:'/home/ubuntu/work/aad-human/profile',XDG_CONFIG_HOME:'/home/ubuntu/work/aad-human/profile'},stdio:['ignore',topLog,topLog]});
const log=fs.openSync(base+'.ffmpeg.log','w');
const args=['-hide_banner','-y','-thread_queue_size',label.startsWith('baseline')?'8':'512','-f','x11grab','-framerate',String(fps),'-draw_mouse','1','-video_size','3840x2160','-i',':0.0','-t','15','-an','-c:v','libx264','-preset','ultrafast','-crf','18'];
if(tune!=='default')args.push('-tune',tune);
args.push('-threads',String(threads),'-pix_fmt','yuv420p','-vsync','0','-movflags','+faststart','-progress','pipe:1','-nostats',base+'.mp4');
let ff;
try{
 await r.focus('desktop');
 ff=spawn('ffmpeg',args,{env,stdio:['ignore','pipe',log]});processes[ff.pid]={comm:'ffmpeg',role:'capture and x264'};
 execFileSync('sudo',['-n','renice','-n','-5','-p',String(ff.pid)],{stdio:'pipe'});const encoderNice=getPriority(ff.pid);
 startMemoryGuard(ff,reason=>{console.error(reason);ff.kill('SIGINT');});
 let progress='';ff.stdout.on('data',b=>progress+=b);
 const finished=new Promise((resolve,reject)=>{ff.once('error',reject);ff.once('exit',c=>c===0?resolve():reject(Error('ffmpeg exit '+c)));});
 while(!/frame=[1-9]/.test(progress))await delay(100);
 await r.h.moveTo(2640,950);await delay(700);await r.wheel(4);await delay(1100);await r.wheel(-4);await r.h.moveTo(2480,1730);
 await finished;
 if(top.exitCode===null){await new Promise(resolve=>top.once('exit',resolve));}
 fs.closeSync(log);fs.closeSync(topLog);
 const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-select_streams','v','-show_entries','frame=best_effort_timestamp_time','-show_format','-of','json',base+'.mp4'],{encoding:'utf8',maxBuffer:16*1024*1024}));
 const times=probe.frames.map(f=>Number(f.best_effort_timestamp_time));const gaps=times.slice(1).map((x,i)=>({at:times[i],dt:x-times[i]}));
 const samples=[];let sample=-1;
 for(const line of fs.readFileSync(base+'.top.txt','utf8').split('\n')){if(line.startsWith('top -'))sample++;const c=line.trim().split(/\s+/);if(sample<1||!/^\d+$/.test(c[0])||c.length<12)continue;samples.push({sample,pid:Number(c[0]),cpu:Number(c[8]),comm:c.slice(11).join(' ')});}
 const totals={};for(const s of samples){const v=totals[s.pid]??={pid:s.pid,role:processes[s.pid]?.role||s.comm,values:[]};v.values.push(s.cpu);}
const cpu=Object.values(totals).map(v=>({pid:v.pid,role:v.role,meanCPU:v.values.reduce((a,b)=>a+b,0)/v.values.length,maxCPU:Math.max(...v.values),samples:v.values.length})).sort((a,b)=>b.meanCPU-a.meanCPU);
 const result={label,fps,threads,tune,encoderNice,queue:label.startsWith('baseline')?8:512,video:base+'.mp4',duration:Number(probe.format.duration),frames:times.length,minDelta:Math.min(...gaps.map(x=>x.dt)),maxDelta:Math.max(...gaps.map(x=>x.dt)),gapsOver50ms:gaps.filter(x=>x.dt>.050001),nonpositive:gaps.filter(x=>x.dt<=0).length,cpu,cpuHeaders:fs.readFileSync(base+'.top.txt','utf8').split('\n').filter(x=>x.includes('Cpu(s)')),processes};
 fs.writeFileSync(base+'.json',JSON.stringify(result,null,2)+'\n');
 execFileSync('ffmpeg',['-v','error','-y','-ss','7.5','-i',base+'.mp4','-frames:v','1',base+'.png']);
 console.log(JSON.stringify({...result,processes:undefined,cpuHeaders:undefined,cpu:cpu.slice(0,8).map(c=>({...c,role:c.role.split(' --')[0]})),gapsOver50ms:result.gapsOver50ms.length},null,2));
}finally{r.close();if(ff&&ff.exitCode===null)ff.kill('SIGINT');if(top.exitCode===null)top.kill('SIGTERM');}
