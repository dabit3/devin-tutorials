import {readFileSync} from 'node:fs';
import {performance} from 'node:perf_hooks';
import {setTimeout as delay} from 'node:timers/promises';

export async function awaitEncodedCoverage({readProgress,isRunning,targetSeconds,timeoutMs=15000,now=()=>performance.now(),wait=delay}) {
 if(!Number.isFinite(targetSeconds)||targetSeconds<0)throw Error('Invalid encoded coverage target');
 const start=now();
 for(;;){
  if(!isRunning())throw Error('Recorder stopped before encoded timeline coverage');
  const raw=[...readProgress().matchAll(/^out_time_us=([^\r\n]*)$/gm)].at(-1)?.[1];
  const seconds=/^\d+$/.test(raw??'')?Number(raw)/1000000:null;
  if(Number.isFinite(seconds)&&seconds>=targetSeconds)return {encodedSeconds:seconds,waitedMs:now()-start};
  if(now()-start>=timeoutMs)throw Error('Timed out waiting for encoded timeline coverage');
  await wait(100);
 }
}

export function stopOwnedRecorder(recorder) {
  if(!recorder||recorder.exitCode!==null||!recorder.stdin||recorder.stdin.destroyed)return false;
  recorder.stdin.write('q');
  return true;
}
export function memoryReserveReason(meminfo, reserveKB=2097152) {
 const available=Number(meminfo.match(/^MemAvailable:\s+(\d+) kB$/m)?.[1]);
 const swapFree=Number(meminfo.match(/^SwapFree:\s+(\d+) kB$/m)?.[1]);
 if(!Number.isFinite(available))throw Error('MemAvailable unavailable');
 if(!Number.isFinite(swapFree))throw Error('SwapFree unavailable');
 return available+swapFree<reserveKB?`Memory reserve breached: MemAvailable=${available}kB + SwapFree=${swapFree}kB below ${reserveKB}kB`:null;
}
export function startMemoryGuard(recorder, abort) {
 const timer=setInterval(()=>{
  if(recorder.exitCode!==null)return;
  try{const reason=memoryReserveReason(readFileSync('/proc/meminfo','utf8'));if(reason){clearInterval(timer);abort(reason);}}
  catch(error){clearInterval(timer);abort(error.message);}
 },250);
 timer.unref();recorder.once('exit',()=>clearInterval(timer));return()=>clearInterval(timer);
}
export function timelineErrors(data, stderr='') {
 const errors=[];
 if(/Failed to query xcb pointer/.test(stderr))errors.push('X11 input failed');
 if(!data.lines?.length)errors.push('No line actions recorded');
 for(const line of data.lines??[]){
  const values=['actionStart','subjectSettledStart','actionEnd','qaMidpoint'].map(k=>line[k]);
  if(values.some(v=>!Number.isFinite(v)||v<0||v>data.duration))errors.push(`Line ${line.line} has incomplete or out-of-range timestamps`);
 }
 return errors;
}
