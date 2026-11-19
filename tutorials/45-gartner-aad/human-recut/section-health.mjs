import fs from 'node:fs';

export function sectionHealth(section){
 const mem=fs.readFileSync('/proc/meminfo','utf8');
 const value=name=>{const m=mem.match(new RegExp('^'+name+':\\s+(\\d+) kB$','m'));if(!m||!Number.isFinite(Number(m[1])))throw Error('Missing or invalid '+name);return Number(m[1]);};
 const processes=[];
 for(const pid of fs.readdirSync('/proc').filter(p=>/^\d+$/.test(p))){
  try{
   const argv=fs.readFileSync('/proc/'+pid+'/cmdline','utf8').split('\0');
   const exe=fs.readFileSync('/proc/'+pid+'/comm','utf8').trim();
   const renderer=argv.join(' ').split(/\s+/).includes('--type=renderer');
   const role=exe==='devin-desktop'&&renderer?'Desktop renderer':exe==='Xtigervnc'?'Xtigervnc':exe==='chrome'?'Chrome':null;
   if(!role)continue;
   const rss=Number(fs.readFileSync('/proc/'+pid+'/status','utf8').match(/^VmRSS:\s+(\d+) kB$/m)?.[1]);
   if(!Number.isFinite(rss))throw Error('Missing RSS for '+role+' PID '+pid);
   processes.push({pid:Number(pid),role,rssKB:rss});
  }catch(error){if(error.code!=='ENOENT'&&error.code!=='ESRCH')throw error;}
 }
 const snapshot={at:new Date().toISOString(),section,memAvailableKB:value('MemAvailable'),swapFreeKB:value('SwapFree'),processes};
 snapshot.combinedKB=snapshot.memAvailableKB+snapshot.swapFreeKB;
 fs.appendFileSync('/home/ubuntu/work/aad-human/profile/section-rss.jsonl',JSON.stringify(snapshot)+'\n');
 console.log('PRESECTION_RSS',JSON.stringify(snapshot));
 for(const role of ['Desktop renderer','Xtigervnc','Chrome'])if(!processes.some(p=>p.role===role))throw Error('Missing RSS role: '+role);
 if(snapshot.combinedKB<5242880)throw Error('PRESECTION_RESTART_REQUIRED: combined reserve below 5 GiB; restart Desktop and/or Chrome, then redo section setup');
 return snapshot;
}
