import test from 'node:test';
import assert from 'node:assert/strict';
import {Capture} from './capture.mjs';
function fixture(){
 const r=Object.create(Capture.prototype);let clock=0;
 Object.assign(r,{data:{lines:[]},vo:[{voiceSeconds:2}],window:'desktop',time:()=>clock,signed:async()=>{},save:()=>{},wait:async ms=>{clock+=ms/1000;}});
 return r;
}
test('settled sequence includes cursor motion during narration',async()=>{const r=fixture();await r.sequence(1,()=>r.wait(4000));assert.equal(r.data.lines[0].subjectSettledStart,0);assert.equal(r.data.lines[0].actionEnd,4);assert.equal(r.data.lines[0].qaMidpoint,2);});
test('empty sequence retains narration coverage',async()=>{const r=fixture();await r.sequence(1,async()=>{});assert.equal(r.data.lines[0].actionEnd,3.5);});
test('sequence rejects failed actions',async()=>{const r=fixture();await assert.rejects(r.sequence(1,async()=>{throw Error('missing subject');}),/missing subject/);assert.equal(r.data.status,'rejected');});
