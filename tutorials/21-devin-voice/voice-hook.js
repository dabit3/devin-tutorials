// Capture-only stand-in for a microphone in Devin Voice (the VM has none): Nader's pre-generated call lines
// (call/c*.wav, ElevenLabs) are played into getUserMedia, and Devin's real WebRTC audio is recorded as it arrives.
(() => {
  if (window.__vh) return;
  const V = window.__vh = { recs: [], plays: [], lines: {}, lastVoice: 0, phase: 'idle' };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  let ctx, dest;
  const ensure = () => {
    if (!ctx) {
      ctx = new AudioContext({ sampleRate: 48000 }); dest = ctx.createMediaStreamDestination();
      // a faint noise floor: with pure digital silence the call never detects the end of a turn
      const nb = ctx.createBuffer(1, 96000, 48000), ch = nb.getChannelData(0);
      for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
      const ns = ctx.createBufferSource(); ns.buffer = nb; ns.loop = true;
      const ng = ctx.createGain(); ng.gain.value = 0.0015; ns.connect(ng).connect(dest); ns.start();
    }
    if (ctx.state !== 'running') ctx.resume();
    return dest;
  };
  const md = navigator.mediaDevices, gum = md.getUserMedia.bind(md), enumd = md.enumerateDevices.bind(md);
  md.getUserMedia = async c => (c && c.audio && !c.video) ? new MediaStream(ensure().stream.getAudioTracks().map(t => t.clone())) : gum(c);
  md.enumerateDevices = async () => {
    const r = await enumd().catch(() => []);
    return r.some(d => d.kind === 'audioinput' && d.deviceId) ? r : [...r, { deviceId: 'default', kind: 'audioinput', label: 'Microphone', groupId: 'g1', toJSON() { return this; } }];
  };
  V.load = async (name, b64) => { ensure(); V.lines[name] = await ctx.decodeAudioData(Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer); return V.lines[name].duration; };
  V.play = name => new Promise(res => {
    const s = ctx.createBufferSource(); s.buffer = V.lines[name]; s.connect(ensure()); s.onended = () => res();
    V.plays.push({ name, t: Date.now(), dur: s.buffer.duration }); s.start();
  });
  // Devin's side: record each remote audio track and keep a voice-activity timestamp for turn taking
  const watch = track => {
    const ms = new MediaStream([track]);
    const mr = new MediaRecorder(ms, { mimeType: 'audio/webm;codecs=opus' });
    const R = { start: null, chunks: [], mr }; V.recs.push(R);
    mr.ondataavailable = e => { if (e.data.size) R.chunks.push(e.data); };
    mr.onstart = () => { R.start = Date.now(); };
    mr.start(1000);
    ensure(); const an = ctx.createAnalyser(); an.fftSize = 2048; ctx.createMediaStreamSource(ms).connect(an);
    const buf = new Float32Array(an.fftSize);
    R.timer = setInterval(() => { an.getFloatTimeDomainData(buf); let s = 0; for (const v of buf) s += v * v; if (Math.sqrt(s / buf.length) > 0.006) V.lastVoice = Date.now(); }, 40);
  };
  const OPC = window.RTCPeerConnection;
  window.RTCPeerConnection = class extends OPC {
    constructor(...a) { super(...a); this.addEventListener('track', e => { if (e.track.kind === 'audio') watch(e.track); }); }
  };
  V.finish = () => Promise.all(V.recs.filter(R => R.mr.state !== 'inactive').map(R => new Promise(res => { clearInterval(R.timer); R.mr.onstop = res; R.mr.stop(); })));
  V.dump = async i => {
    const R = V.recs[i], b = new Blob(R.chunks, { type: 'audio/webm' });
    const s = await new Promise(r => { const f = new FileReader(); f.onload = () => r(f.result.split(',')[1]); f.readAsDataURL(b); });
    return { start: R.start, b64: s };
  };
  // turn taking: wait for Devin to start answering after `since`, then for `quiet` ms of silence
  V.reply = async (since, quiet = 2300, start = 25000, max = 60000) => {
    const t0 = Date.now();
    while (V.lastVoice < since && Date.now() - t0 < start) await sleep(40);
    while (Date.now() - V.lastVoice < quiet && Date.now() - t0 < max) await sleep(40);
  };
  // turns: [{ say: ['c1', 'c2'], interrupt?: { after: ms, say: [...] }, pause?: ms }]
  V.run = async (turns, greet = 12000) => {
    if (greet) { V.phase = 'greeting'; await V.reply(Date.now(), 1500, greet); }
    for (const [i, t] of turns.entries()) {
      V.phase = 'say' + i;
      for (const [k, n] of t.say.entries()) { if (k) await sleep(t.gap ?? 450); await V.play(n); }
      if (t.interrupt) {
        const since = Date.now(); V.phase = 'reply' + i;
        while (V.lastVoice < since && Date.now() - since < 25000) await sleep(40);
        await sleep(t.interrupt.after); V.phase = 'interrupt' + i;
        for (const n of t.interrupt.say) await V.play(n);
      }
      V.phase = 'reply' + i; await V.reply(Date.now());
      if (t.pause) { V.phase = 'pause' + i; await sleep(t.pause); }
    }
    V.phase = 'done';
  };
})();
