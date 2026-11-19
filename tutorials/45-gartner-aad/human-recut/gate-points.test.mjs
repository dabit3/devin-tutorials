import assert from 'node:assert/strict';
import test from 'node:test';
import{gatePoints}from'./gate-points.mjs';
test('full source preserves line and clause gates',()=>{const p=gatePoints(6,[{t0:.1,t1:2,text:'a'},{t0:3,t1:6,text:'b'}]);assert.equal(p.length,7);assert.equal(p[1].voice,3);assert.equal(p[6].voice,5.97);});
test('selected source includes its own boundaries/midpoint and only its clauses',()=>{const p=gatePoints(6,[{t0:.1,t1:2,text:'a'},{t0:3,t1:6,text:'b'}],{start:2.5,end:6});assert(p.every(p=>p.voice>=2.5&&p.voice<=6));assert(p.some(p=>p.label==='selection-start'&&p.voice===2.5));assert(p.some(p=>p.label==='selection-middle'&&p.voice===4.25));assert(!p.some(p=>p.text==='a'));});
test('no clauses and selection without clause points still retain actual source gates',()=>{assert.equal(gatePoints(6,[]).length,3);assert.deepEqual(gatePoints(6,[],{start:1,end:2}).map(p=>p.voice),[1,1.5,2]);});
test('invalid or empty ranges fail closed',()=>{for(const selection of[{start:2,end:2},{start:4,end:2},{start:-1,end:3},{start:0,end:7},{start:NaN,end:3},{}])assert.throws(()=>gatePoints(6,[],selection));assert.throws(()=>gatePoints(0,[]));assert.throws(()=>gatePoints(6,null));});
