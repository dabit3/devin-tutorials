// Live-gameplay intro for tutorial 78: ACE RALLY's Expo web build in a headed Chrome, with Chair (GPT-Live-1) really
// connected. The VM has no microphone, so Nader's ElevenLabs lines (intro/g*.wav) are played into getUserMedia as the mic
// (and to the speakers, so the tab capture hears them). Both players are the read-only scripted drivers from the game's
// tools/driver.mjs sending real key events; nothing writes game state. Chair's replies are its real WebRTC audio.
// usage: GAME=~/repos/private-experiments/ace-rally node intro/record-intro.mjs --url http://localhost:4173/ --out /tmp/ace-intro
import { mkdirSync, writeFileSync, appendFileSync, existsSync, unlinkSync, readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const GAME = process.env.GAME || path.join(process.env.HOME, 'repos/private-experiments/ace-rally')
const { chromium } = await import(path.join(GAME, 'node_modules/playwright-core/index.mjs'))
const { makeKeyboard, playMatch, summaryOf, log, sleep } = await import(path.join(GAME, 'tools/driver.mjs'))
const D = path.dirname(fileURLToPath(import.meta.url))
const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i >= 0 ? process.argv[i + 1] : d }
const url = arg('url', 'http://localhost:4173/?capture=1'), out = arg('out', '/tmp/ace-intro')
const W = 1600, H = 900
mkdirSync(out, { recursive: true })
const webm = `${out}/intro.webm`; if (existsSync(webm)) unlinkSync(webm)
const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: false,
  args: [`--window-size=${W},${H + 130}`, '--window-position=0,0', '--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist',
    '--autoplay-policy=no-user-gesture-required', '--auto-select-desktop-capture-source=ACE RALLY', '--enable-usermedia-screen-capturing', '--disable-infobars'],
})
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, permissions: ['microphone'] })
const page = await ctx.newPage()
await page.addInitScript(() => {
  // mic stand-in: a MediaStreamDestination fed by the pre-generated lines plus a faint noise floor (turn detection needs it)
  const V = (window.__vh = { lines: {}, plays: [] })
  let actx, dest
  const ensure = () => {
    if (!actx) {
      actx = new AudioContext({ sampleRate: 48000 }); dest = actx.createMediaStreamDestination()
      const nb = actx.createBuffer(1, 96000, 48000), ch = nb.getChannelData(0)
      for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1
      const ns = actx.createBufferSource(); ns.buffer = nb; ns.loop = true
      const ng = actx.createGain(); ng.gain.value = 0.0015; ns.connect(ng).connect(dest); ns.start()
    }
    if (actx.state !== 'running') actx.resume()
    return dest
  }
  const md = navigator.mediaDevices, gum = md.getUserMedia.bind(md)
  md.getUserMedia = async (c) => (c && c.audio && !c.video) ? new MediaStream(ensure().stream.getAudioTracks().map((t) => t.clone())) : gum(c)
  V.load = async (name, b64) => { ensure(); V.lines[name] = await actx.decodeAudioData(Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)).buffer); return V.lines[name].duration }
  V.play = (name) => new Promise((res) => {
    const s = actx.createBufferSource(); s.buffer = V.lines[name]; s.connect(ensure()); s.connect(actx.destination); s.onended = () => res()
    V.plays.push({ name, t: Date.now(), dur: s.buffer.duration }); s.start()
  })
  // Chair's voice activity (for barge-ins) from the remote WebRTC track
  V.lastVoice = 0
  const OPC = window.RTCPeerConnection
  window.RTCPeerConnection = class extends OPC {
    constructor(...a) {
      super(...a)
      this.addEventListener('track', (e) => {
        if (e.track.kind !== 'audio') return
        ensure(); const an = actx.createAnalyser(); an.fftSize = 2048
        // the tab capture does not hear a WebRTC <audio> element, so route Chair through WebAudio (and mute the element)
        const src = actx.createMediaStreamSource(new MediaStream([e.track])); src.connect(an); src.connect(actx.destination)
        setTimeout(() => document.querySelectorAll('audio[data-coach]').forEach((a) => { a.muted = true }), 300)
        const buf = new Float32Array(an.fftSize)
        setInterval(() => { an.getFloatTimeDomainData(buf); let s = 0; for (const v of buf) s += v * v; if (Math.sqrt(s / buf.length) > 0.006) V.lastVoice = Date.now() }, 40)
      })
    }
  }
})
await page.exposeFunction('__chunk', (b64) => appendFileSync(webm, Buffer.from(b64, 'base64')))
await page.goto(url)
await page.waitForFunction(() => !!window.__aceRally)
const kb = makeKeyboard(await ctx.newCDPSession(page))
await page.mouse.click(W / 2, H - 40); await sleep(300)
for (const n of ['g0', 'g1', 'g1b', 'g2', 'g2b', 'g3']) {
  const d = await page.evaluate(([n, b]) => window.__vh.load(n, b), [n, readFileSync(path.join(D, `${n}.wav`)).toString('base64')])
  log('line', n, d.toFixed(2))
}
// tab capture: video + the tab's own audio (game synth, Chair's <audio> element, and the lines echoed to the speakers)
await page.evaluate(async () => {
  const gdm = (audio) => navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 60, preferCurrentTab: true }, audio, preferCurrentTab: true })
  const s = await gdm(true).catch(() => gdm(false))
  window.__capAudio = s.getAudioTracks().length
  const rec = new MediaRecorder(s, { mimeType: 'video/webm;codecs=vp9,opus', videoBitsPerSecond: 10_000_000, audioBitsPerSecond: 192_000 })
  window.__rec = rec
  // chunks are appended strictly in order (an async handler per chunk can interleave and corrupt the EBML header)
  let q = Promise.resolve()
  rec.ondataavailable = (e) => {
    if (!e.data.size) return
    q = q.then(async () => {
      const buf = new Uint8Array(await e.data.arrayBuffer()); let bin = ''
      for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000))
      await window.__chunk(btoa(bin))
    })
  }
  window.__drain = () => q
  rec.start(1000)
})
log('recording; audio tracks:', await page.evaluate(() => window.__capAudio))
const t0 = Date.now(); const marks = []
const seenTools = new Set()
setInterval(async () => {
  const chips = await page.evaluate(() => [...document.querySelectorAll('[data-testid="coach-tool"]')].map((e) => e.innerText)).catch(() => [])
  for (const c of chips) if (!seenTools.has(c)) { seenTools.add(c); mark('tool ' + c) }
  const caps = await page.evaluate(() => ['coach-caption', 'player-caption'].map((id) => document.querySelector(`[data-testid="${id}"]`)?.innerText || '')).catch(() => ['', ''])
  for (const [i, c] of caps.entries()) if (c && !seenTools.has(c)) { seenTools.add(c); mark((i ? 'you: ' : 'chair: ') + c.replace(/\s+/g, ' ').slice(0, 160)) }
}, 400)
const mark = (name) => { marks.push({ t: +((Date.now() - t0) / 1000).toFixed(2), name }); log('mark', name) }
const status = () => page.evaluate(() => document.querySelector('[data-testid="coach-status"]')?.innerText || '')
const caption = () => page.evaluate(() => document.querySelector('[data-testid="coach-caption"]')?.innerText || '')
const quiet = async (ms = 2200, max = 45000) => { const s = Date.now(); while (Date.now() - s < max) { const lv = await page.evaluate(() => window.__vh.lastVoice); if (lv && Date.now() - lv > ms) return; await sleep(80) } }
const voiced = async (ms, max = 30000) => { const s = Date.now(); let v = 0; while (v < ms && Date.now() - s < max) { await sleep(40); if (await page.evaluate(() => Date.now() - window.__vh.lastVoice < 120)) v += 40 } }
mark('title'); await sleep(800)
// pre-roll (off-cut): open Chair from the title screen and connect
if (!(await page.getByTestId('coach-connect').count())) { await page.getByTestId('coach-expand').click(); await sleep(600) }
await page.getByTestId('coach-connect').click(); mark('connect')
for (let i = 0; i < 100 && !/Live/.test(await status()); i++) await sleep(200)
mark('live ' + (await status()))
await voiced(800, 15000); await quiet(1800, 20000); mark('greeting done: ' + (await caption()).slice(0, 80))
// match 1 on grass: Kazu vs Rex, from one spoken sentence
await page.evaluate(() => window.__vh.play('g0')); mark('g0')
for (let i = 0; i < 150; i++) { const s = await summaryOf(page); if (s.screen === 'match') break; await sleep(200) }
mark('match1: ' + JSON.stringify((await summaryOf(page)).ui.court))
await quiet(2000, 25000)
// the cut opens somewhere in here: a long rally with a power-shot finish, Chair calling it live
let highlight = 0
const grade = () => page.evaluate(() => document.body.innerText.match(/POWER SHOT!|Winner!|PERFECT!/g) || []).catch(() => [])
const play = playMatch(page, kb, { minutes: 4.2, onPoint: async (st, m) => {
  const g = await grade(); mark(`point ${st.points} rally ${st.rallies.at(-1)} score ${m.score.games.join('-')} ${g.join(',')}`)
  if (st.rallies.at(-1) >= 9 && g.length) highlight = Date.now()
} })
// wait for a highlight point (long rally, winner / power shot) in match 1, then at least a beat after it
const tp = Date.now()
while (Date.now() - tp < 130000 && !(highlight && Date.now() - highlight > 2500 && Date.now() - tp > 30000)) await sleep(200)
mark('match1 highlight ' + (highlight ? 'yes' : 'timeout'))
// let the highlight's replay finish before the swap request, so the REPLAY tag is off screen while Nader speaks
for (let i = 0; i < 40; i++) { if (!(await page.evaluate(() => /REPLAY/.test(document.body.innerText)).catch(() => false))) break; await sleep(250) }
await sleep(600)
// venue + players + format swap from one sentence; start_match replaces the live match (no menu)
await voiced(0, 1); await quiet(1200, 10000)
await page.evaluate(() => window.__vh.play('g1')); mark('g1')
const swapped = async (ms) => { const s0 = Date.now(); while (Date.now() - s0 < ms) { const s = await summaryOf(page); if (s.screen === 'match' && s.ui.court === 'hard') return true; await sleep(200) } return false }
if (!(await swapped(12000))) {
  // Chair acknowledged but did not run the tools: ask again, plainly
  await voiced(0, 1); await quiet(800, 6000)
  await page.evaluate(() => window.__vh.play('g1b')); mark('g1b')
  await swapped(20000)
}
mark('match2: ' + JSON.stringify((await summaryOf(page)).ui.court))
await quiet(2000, 25000)
// after ~12 s of night-court play, barge in with g2 while Chair is talking
await sleep(12000)
await voiced(900, 25000); await page.evaluate(() => window.__vh.play('g2')); mark('g2 barge-in')
const styled = async (ms) => { const s0 = Date.now(); while (Date.now() - s0 < ms) { if (seenTools.has('TOOL · STYLE: HYPE')) return true; await sleep(200) } return false }
if (!(await styled(9000))) {
  // Chair answered in words but did not run the style tool: ask again, plainly
  await voiced(0, 1); await quiet(800, 6000)
  await page.evaluate(() => window.__vh.play('g2b')); mark('g2b')
  await styled(12000)
}
await quiet(2200, 20000)
await sleep(14000)
await voiced(0, 1); await quiet(1200, 8000)
await page.evaluate(() => window.__vh.play('g3')); mark('g3')
await quiet(2200, 20000); mark('g3 answered: ' + (await caption()).slice(0, 80))
// keep playing for the narration bed (fresh points), then stop
await play
mark('end')
await sleep(1500)
await page.evaluate(() => new Promise((res) => { window.__rec.onstop = res; window.__rec.stop() }))
await page.evaluate(() => window.__drain())
await sleep(1200)
const plays = await page.evaluate(() => window.__vh.plays)
writeFileSync(`${out}/marks.json`, JSON.stringify({ t0, marks, plays: plays.map((p) => ({ ...p, rel: +((p.t - t0) / 1000).toFixed(2) })) }, null, 2))
await browser.close()
execSync(`ffmpeg -y -loglevel error -i "${webm}" -vf scale=1600:900 -r 60 -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart "${out}/intro.mp4"`, { stdio: 'inherit' })
log('wrote', `${out}/intro.mp4`)
process.exit(0) // the caption/tool poller keeps the event loop alive otherwise
