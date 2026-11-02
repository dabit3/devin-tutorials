// evaluate JS inside the inline-artifact OOPIF via its own CDP target
export async function ifrEval(expr) {
  const ts = await (await fetch('http://127.0.0.1:9333/json/list')).json();
  const t = ts.find(t => t.type === 'iframe' && /devinapps\.com/.test(t.url) && !/ide\./.test(t.url));
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  const res = await new Promise(r => { ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id === 1) r(d); }; ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression: expr, returnByValue: true } })); });
  ws.close(); return res.result?.result?.value;
}
if (process.argv[2]) console.log(JSON.stringify(await ifrEval(process.argv[2])));
