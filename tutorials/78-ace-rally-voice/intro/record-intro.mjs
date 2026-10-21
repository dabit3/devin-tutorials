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
const url = arg('url', 'http://localhost:4173/'), out = arg('out', '/tmp/ace-intro')
const W = 1600, H = 900
mkdirSync(out, { recursive: true })
const webm = `${out}/intro.webm`; if (existsSync(webm)) unlinkSync(webm)
const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: false,
  args: [`--window-size=${W},${H}`, '--window-position=0,0', '--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist',
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
for (const n of ['g1', 'g2', 'g3']) {
  const d = await page.evaluate(([n, b]) => window.__vh.load(n, b), [n, readFileSync(path.join(D, `${n}.wav`)).toString('base64')])
  log('line', n, d.toFixed(2))
}
// tab capture: video + the tab's own audio (game synth, Chair's <audio> element, and the lines echoed to the speakers)
await page.evaluate(async () => {
  const gdm = (audio) => navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 60, preferCurrentTab: true }, audio, preferCurrentTab: true })
  const s = await gdm(true).catch(() => gdm(false))
  window.__capAudio = s.getAudioTracks().length
  const rec = new MediaRecorder(s, { mimeType: 'video/webm;codecs=vp9,opus', videoBitsPerSecond: 14_000_000, audioBitsPerSecond: 192_000 })
  window.__rec = rec
  rec.ondataavailable = async (e) => {
    if (!e.data.size) return
    const buf = new Uint8Array(await e.data.arrayBuffer()); let bin = ''
    for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000))
    await window.__chunk(btoa(bin))
  }
  rec.start(1000)
})
log('recording; audio tracks:', await page.evaluate(() => window.__capAudio))
const t0 = Date.now(); const marks = []
const mark = (name) => { marks.push({ t: +((Date.now() - t0) / 1000).toFixed(2), name }); log('mark', name) }
const status = () => page.evaluate(() => document.querySelector('[data-testid="coach-status"]')?.innerText || '')
const caption = () => page.evaluate(() => document.querySelector('[data-testid="coach-caption"]')?.innerText || '')
const quiet = async (ms = 2200, max = 45000) => { const s = Date.now(); while (Date.now() - s < max) { const lv = await page.evaluate(() => window.__vh.lastVoice); if (lv && Date.now() - lv > ms) return; await sleep(80) } }
const voiced = async (ms, max = 30000) => { const s = Date.now(); let v = 0; while (v < ms && Date.now() - s < max) { await sleep(40); if (await page.evaluate(() => Date.now() - window.__vh.lastVoice < 120)) v += 40 } }
mark('title'); await sleep(1500)
// open Chair from the title screen and connect
if (!(await page.getByTestId('coach-connect').count())) { await page.getByTestId('coach-expand').click(); await sleep(600) }
await page.getByTestId('coach-connect').click(); mark('connect')
for (let i = 0; i < 100 && !/Live/.test(await status()); i++) await sleep(200)
mark('live ' + (await status()))
await voiced(800, 15000); await quiet(1800, 20000); mark('greeting done: ' + (await caption()).slice(0, 80))
await page.evaluate(() => window.__vh.play('g1')); mark('g1')
await sleep(400); await page.evaluate(() => window.__vh.plays.at(-1))
// wait for the tools to run: the match screen appears
for (let i = 0; i < 150; i++) { const s = await summaryOf(page); if (s.screen === 'match') break; await sleep(200) }
mark('match: ' + JSON.stringify((await summaryOf(page)).ui.court))
await quiet(2000, 25000)
// play; after ~12 s of play, barge in with g2 while Chair is talking
const play = playMatch(page, kb, { minutes: 1.4, onPoint: (st, m) => mark(`point ${st.points} rally ${st.rallies.at(-1)} score ${m.score.games.join('-')}`) })
await sleep(11000)
await voiced(900, 20000); await page.evaluate(() => window.__vh.play('g2')); mark('g2 barge-in')
await quiet(2200, 20000)
await sleep(9000)
await voiced(0, 1); await quiet(1200, 8000)
await page.evaluate(() => window.__vh.play('g3')); mark('g3')
await quiet(2200, 20000); mark('g3 answered: ' + (await caption()).slice(0, 80))
await play
mark('end')
await sleep(1500)
await page.evaluate(() => new Promise((res) => { window.__rec.onstop = res; window.__rec.stop() }))
await sleep(1200)
const plays = await page.evaluate(() => window.__vh.plays)
writeFileSync(`${out}/marks.json`, JSON.stringify({ t0, marks, plays: plays.map((p) => ({ ...p, rel: +((p.t - t0) / 1000).toFixed(2) })) }, null, 2))
await browser.close()
execSync(`ffmpeg -y -loglevel error -i "${webm}" -vf crop=1600:836:0:0 -r 60 -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart "${out}/intro.mp4"`, { stdio: 'inherit' })
log('wrote', `${out}/intro.mp4`)
