import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export function agentRole(argv){
 const executable=path.basename(argv[0]||'');
 if(executable==='opencode'&&argv[1]==='acp')return 'opencode';
 if(executable==='devin'&&argv[1]==='acp')return 'devin';
 if(executable==='codex'&&argv[1]==='app-server')return 'codex';
 if(['node','nodejs'].includes(executable)&&argv[1]&&!argv[1].startsWith('-')&&(/\/codex-acp\/(dist\/)?[^/]+\.js$/.test(argv[1])||path.basename(argv[1])==='codex-acp'))return 'codex';
 return null;
}

function descendantOf(pid,roots){
 const seen=new Set();
 while(pid>1&&!seen.has(pid)){
  if(roots.has(pid))return true;
  seen.add(pid);
  try{pid=Number(fs.readFileSync('/proc/'+pid+'/stat','utf8').match(/^\d+ \(.*\) \S+ (\d+)/)?.[1]);}catch{return false;}
 }
 return false;
}

export function terminateIdleAgents(roots,keep=[]){
 if(!roots.length||roots.some(p=>!Number.isInteger(p)||p<=1))throw Error('Explicit filming application root PIDs required');
 const rootSet=new Set(roots),result=[];
 for(const entry of fs.readdirSync('/proc')){
  if(!/^\d+$/.test(entry))continue;
  const pid=Number(entry);
  if(pid===process.pid)continue;
  try{
   if(fs.statSync('/proc/'+pid).uid!==process.getuid())continue;
   const argv=fs.readFileSync('/proc/'+pid+'/cmdline','utf8').split('\0').filter(Boolean);
   const role=agentRole(argv);
   if(!role||keep.includes(role)||!descendantOf(pid,rootSet))continue;
   process.kill(pid,'SIGTERM');result.push({pid,role});
  }catch(error){if(error.code!=='ENOENT'&&error.code!=='ESRCH')throw error;}
 }
 return result;
}

if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){
 const roots=(process.argv.find(a=>a.startsWith('--roots='))?.slice(8)||'').split(',').filter(Boolean).map(Number);
 const keep=(process.argv.find(a=>a.startsWith('--keep='))?.slice(7)||'').split(',').filter(Boolean);
 console.log('IDLE_AGENT_PIDS_TERMINATED',JSON.stringify(terminateIdleAgents(roots,keep)));
}
