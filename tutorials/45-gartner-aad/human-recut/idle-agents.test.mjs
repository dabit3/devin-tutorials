import {test} from 'node:test';
import assert from 'node:assert/strict';
import {agentRole,terminateIdleAgents} from './idle-agents.mjs';

test('matches only real agent executable and entrypoint positions',()=>{
 assert.equal(agentRole(['opencode','acp']),'opencode');
 assert.equal(agentRole(['/a/devin','acp','--process-model=in-process']),'devin');
 assert.equal(agentRole(['/a/codex','app-server']),'codex');
 assert.equal(agentRole(['/a/node','/a/node_modules/@agentclientprotocol/codex-acp/dist/index.js']),'codex');
 assert.equal(agentRole(['node','/a/node_modules/.bin/codex-acp']),'codex');
});
test('empty and unrelated commands never match',()=>{
 for(const argv of [[],['bash','-c','node /a/codex-acp/dist/index.js'],['node','-e','const p="/a/codex-acp/dist/index.js"'],['Xtigervnc',':0'],['kwin_x11'],['sleep','infinity'],['devin','--resume','original']])assert.equal(agentRole(argv),null);
});
test('cleanup fails closed without explicit application roots',()=>{
 assert.throws(()=>terminateIdleAgents([]),/root PIDs required/);
 assert.throws(()=>terminateIdleAgents([NaN]),/root PIDs required/);
 assert.throws(()=>terminateIdleAgents([1]),/root PIDs required/);
});
