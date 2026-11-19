import test from 'node:test';
import assert from 'node:assert/strict';
import {memoryReserveReason,timelineErrors,stopOwnedRecorder,awaitEncodedCoverage} from './capture-health.mjs';

test('wait for actual encoded coverage before stopping a lagging recorder',async()=>{
 let tick=0;
 const samples=['','out_time_us=500000\n','out_time_us=500000\nout_time_us=1200000\n'];
 const result=await awaitEncodedCoverage({readProgress:()=>samples[tick],isRunning:()=>true,targetSeconds:1,now:()=>tick*100,wait:async()=>{tick++;}});
 assert.deepEqual(result,{encodedSeconds:1.2,waitedMs:200});
});
test('already encoded coverage needs no additional wait',async()=>{
 assert.deepEqual(await awaitEncodedCoverage({readProgress:()=> 'out_time_us=1000000\n',isRunning:()=>true,targetSeconds:1,now:()=>0,wait:async()=>assert.fail('unexpected wait')}),{encodedSeconds:1,waitedMs:0});
});
test('empty or invalid latest progress fails closed at the deadline',async()=>{
 for(const progress of ['', 'out_time_us=2000000\nout_time_us=N/A\n']){
  let clock=0;
  await assert.rejects(awaitEncodedCoverage({readProgress:()=>progress,isRunning:()=>true,targetSeconds:1,timeoutMs:200,now:()=>clock,wait:async()=>{clock+=100;}}),/Timed out waiting for encoded timeline coverage/);
 }
});
test('premature recorder exit and invalid coverage targets fail closed',async()=>{
 await assert.rejects(awaitEncodedCoverage({readProgress:()=>'',isRunning:()=>false,targetSeconds:1}),/Recorder stopped before encoded timeline coverage/);
 for(const targetSeconds of [-1,NaN,Infinity])await assert.rejects(awaitEncodedCoverage({readProgress:()=>'',isRunning:()=>true,targetSeconds}),/Invalid encoded coverage target/);
});

test('stop only an owned recorder with a live input pipe',()=>{
  const writes=[];
  const recorder={exitCode:null,stdin:{destroyed:false,write:q=>writes.push(q)}};
  assert.equal(stopOwnedRecorder(recorder),true);
  assert.deepEqual(writes,['q']);
  assert.equal(stopOwnedRecorder(null),false);
  assert.equal(stopOwnedRecorder({...recorder,exitCode:0}),false);
  recorder.stdin.destroyed=true;
  assert.equal(stopOwnedRecorder(recorder),false);
  assert.deepEqual(writes,['q']);
});
test('healthy and exhausted combined memory',()=>{assert.equal(memoryReserveReason('MemAvailable: 4000000 kB\nSwapFree: 0 kB'),null);assert.equal(memoryReserveReason('MemAvailable: 500000 kB\nSwapFree: 8000000 kB'),null);assert.equal(memoryReserveReason('MemAvailable: 1000000 kB\nSwapFree: 1097152 kB'),null);assert.match(memoryReserveReason('MemAvailable: 1000000 kB\nSwapFree: 1097151 kB'),/reserve breached/);assert.match(memoryReserveReason('MemAvailable: 0 kB\nSwapFree: 0 kB'),/reserve breached/);});
test('missing memory reading fails closed',()=>{assert.throws(()=>memoryReserveReason(''),/MemAvailable unavailable/);assert.throws(()=>memoryReserveReason('MemAvailable: 4000000 kB'),/SwapFree unavailable/);assert.throws(()=>memoryReserveReason('MemAvailable: invalid kB\nSwapFree: 8000000 kB'),/MemAvailable unavailable/);assert.throws(()=>memoryReserveReason('MemAvailable: 4000000 kB\nSwapFree: invalid kB'),/SwapFree unavailable/);});
test('normal, empty and truncated timelines',()=>{const d={duration:15,lines:[{line:1,actionStart:1,subjectSettledStart:3,actionEnd:14,qaMidpoint:7.5}]};assert.deepEqual(timelineErrors(d),[]);assert.equal(timelineErrors({...d,lines:[]}).length,1);assert.equal(timelineErrors({...d,duration:5}).length,1);assert.equal(timelineErrors(d,'Failed to query xcb pointer').length,1);});
