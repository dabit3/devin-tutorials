import fs from 'fs';
const st = JSON.parse(fs.readFileSync('state.json', 'utf8'));
const alert = JSON.parse(fs.readFileSync('/Users/devin/gartner/oncall/alert.json', 'utf8'));
alert.first_seen = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
const res = await fetch(st.webhook, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${fs.readFileSync('/Users/devin/gartner/.oncall_secret', 'utf8').trim()}`, 'X-Devin-Delivery-Id': `crash-${Date.now()}` }, body: JSON.stringify(alert) });
console.log('webhook', res.status);
