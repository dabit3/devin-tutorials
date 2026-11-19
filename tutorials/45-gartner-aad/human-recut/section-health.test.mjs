import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {sectionHealth} from './section-health.mjs';

function fixture(t,{mem='MemAvailable: 3145728 kB\nSwapFree: 2097152 kB\n',pids=['101','102','103'],badRSS=false,vanished=false}={}){
 const writes=[];
 t.mock.method(fs,'readdirSync',()=>[...pids,'not-a-pid']);
 t.mock.method(fs,'readFileSync',file=>{
  if(file==='/proc/meminfo')return mem;
  const pid=file.split('/')[2];
  if(vanished&&pid==='104')throw Object.assign(Error('gone'),{code:'ENOENT'});
  if(file.endsWith('/cmdline'))return pid==='101'?'rewritten-title --type=renderer\0':'rewritten-title\0';
  if(file.endsWith('/comm'))return {'101':'devin-desktop','102':'Xtigervnc','103':'chrome'}[pid]+'\n';
  if(file.endsWith('/status'))return badRSS?'Name: missing\n':'VmRSS: '+pid+' kB\n';
  throw Error('Unexpected file '+file);
 });
 t.mock.method(fs,'appendFileSync',(file,data)=>writes.push({file,data}));
 t.mock.method(console,'log',()=>{});
 return writes;
}

test('records all required RSS roles at the exact five GiB boundary',t=>{
 const writes=fixture(t);const s=sectionHealth('normal');
 assert.equal(s.combinedKB,5242880);
 assert.deepEqual(s.processes.map(p=>[p.role,p.rssKB]),[['Desktop renderer',101],['Xtigervnc',102],['Chrome',103]]);
 assert.equal(JSON.parse(writes[0].data).section,'normal');
});
test('requires restart below five GiB and retains the snapshot',t=>{
 const writes=fixture(t,{mem:'MemAvailable: 3145727 kB\nSwapFree: 2097152 kB\n'});
 assert.throws(()=>sectionHealth('low'),/PRESECTION_RESTART_REQUIRED/);
 assert.equal(JSON.parse(writes[0].data).combinedKB,5242879);
});
test('empty process list fails closed',t=>{fixture(t,{pids:[]});assert.throws(()=>sectionHealth('empty'),/Missing RSS role/);});
test('missing or invalid memory reading fails closed',t=>{fixture(t,{mem:'MemAvailable: invalid kB\nSwapFree: 2097152 kB\n'});assert.throws(()=>sectionHealth('invalid'),/Missing or invalid MemAvailable/);});
test('missing RSS fails closed',t=>{fixture(t,{badRSS:true});assert.throws(()=>sectionHealth('bad-rss'),/Missing RSS/);});
test('process exit during scan is ignored without losing required roles',t=>{fixture(t,{pids:['101','102','103','104'],vanished:true});assert.equal(sectionHealth('race').processes.length,3);});
