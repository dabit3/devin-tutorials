// Tutorial 80 cold open: real Hollowmere gameplay in Chrome with Eira live on GPT-Live-1; Nader's ElevenLabs lines (call/k*.wav)
// go through the virtual microphone (with a real noise floor). Adapted from hollowmere/tools/playthrough.mjs.
// Spoken playthrough recorder: real GPT-Live session, with pre-rendered spoken player lines (ElevenLabs
// eleven_multilingual_v2 WAVs) injected through a virtual microphone (getUserMedia is replaced by a Web Audio
// MediaStreamDestination). Records the page video via Playwright and the mixed audio (mic + Eira) via
// MediaRecorder; a white flash marks the audio start so the two can be aligned in ffmpeg.
// usage: PLAYWRIGHT_CORE=... node tools/playthrough.mjs ~/hm-voice out-dir
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
const req = createRequire(import.meta.url)
const { chromium } = req(process.env.PLAYWRIGHT_CORE ?? '/Users/devin/hm-tools/node_modules/playwright-core')
const [voiceDir = path.join(path.dirname(new URL(import.meta.url).pathname), 'call'), outDir = path.join(path.dirname(new URL(import.meta.url).pathname), 'live', 'raw')] = process.argv.slice(2)
fs.mkdirSync(outDir, { recursive: true })
const log = (...a) => {
  const line = `[${new Date().toISOString().slice(11, 23)}] ${a.join(' ')}`
  console.log(line)
  fs.appendFileSync(path.join(outDir, 'log.txt'), line + '\n')
}

const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--use-angle=metal', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'],
})
const ctx = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
  recordVideo: { dir: outDir, size: { width: 1920, height: 1080 } },
})
await ctx.addInitScript(() => {
  // A real mic never sends digital silence; without this low noise floor the live session closes after ~30 s idle.
  const noiseFloor = (ctx, dest) => {
    const buf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.0015
    const src = ctx.createBufferSource()
    src.buffer = buf
    src.loop = true
    src.connect(dest)
    src.start()
  }
  const AC = globalThis.AudioContext
  let actx = null
  const ensure = () => {
    if (!actx) {
      actx = new AC({ sampleRate: 48000 })
      const dest = actx.createMediaStreamDestination()
      const mix = actx.createMediaStreamDestination()
      actx.createMediaStreamSource(dest.stream).connect(mix)
      globalThis.__vmic = { ctx: actx, dest, mix, remoteHooked: false }
      noiseFloor(actx, dest)
    }
    return globalThis.__vmic
  }
  navigator.mediaDevices.getUserMedia = async () => ensure().dest.stream
  globalThis.__vmicSpeak = async (b64) => {
    const v = ensure()
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
    const buf = await v.ctx.decodeAudioData(bytes.buffer)
    const src = v.ctx.createBufferSource()
    src.buffer = buf
    src.connect(v.dest)
    src.start()
    return buf.duration
  }
  globalThis.__recStart = () => {
    const v = ensure()
    const el = document.querySelector('audio[data-coach]')
    if (el?.srcObject && !v.remoteHooked) {
      v.ctx.createMediaStreamSource(el.srcObject).connect(v.mix)
      v.remoteHooked = true
    }
    const rec = new MediaRecorder(v.mix.stream, { mimeType: 'audio/webm;codecs=opus' })
    rec.ondataavailable = (e) => {
      const r = new FileReader()
      r.onload = () => globalThis.__recChunk(r.result.split(',')[1])
      r.readAsDataURL(e.data)
    }
    rec.start(1000)
    const flash = document.createElement('div')
    flash.style.cssText = 'position:fixed;inset:0;background:#fff;z-index:99999'
    document.body.appendChild(flash)
    setTimeout(() => flash.remove(), 160)
    globalThis.__rec = rec
    return v.remoteHooked
  }
  globalThis.__recStop = () => new Promise((res) => {
    const rec = globalThis.__rec
    rec.onstop = () => res(true)
    rec.stop()
  })
})
const page = await ctx.newPage()
const audioPath = path.join(outDir, 'audio.webm')
fs.writeFileSync(audioPath, '')
await page.exposeFunction('__recChunk', (b64) => fs.appendFileSync(audioPath, Buffer.from(b64, 'base64')))
page.on('console', (m) => {
  if (m.type() === 'error') log('[console.error]', m.text().slice(0, 240))
})
page.on('pageerror', (e) => log('[pageerror]', String(e).slice(0, 300)))

await page.goto(process.env.URL ?? 'http://localhost:8081/?cine=1', { waitUntil: 'networkidle' })
await page.waitForFunction(() => globalThis.__hollowmere?.game?.ui?.state?.ready === true, null, { timeout: 120000 })
await page.waitForTimeout(1500)
await page.getByText('Begin').click()
log('begin')
await page.waitForFunction(() => globalThis.__hollowmere?.companion?.view?.status === 'live', null, { timeout: 60000 })
log('live')
await page.waitForFunction(() => Boolean(document.querySelector('audio[data-coach]')?.srcObject), null, { timeout: 30000 })
const hooked = await page.evaluate(() => globalThis.__recStart())
const T0 = Date.now()
log('recording, remote hooked =', hooked)

const view = () => page.evaluate(() => {
  const v = globalThis.__hollowmere.companion.view
  return { speaking: v.speaking, eira: v.eiraLine, tools: v.tools.slice(0, 3), status: v.status }
})
const snap = () => page.evaluate(() => globalThis.__hollowmere.snapshot())
const speak = async (id) => {
  const b64 = fs.readFileSync(path.join(voiceDir, `${id}.wav`)).toString('base64')
  const d = await page.evaluate((b) => globalThis.__vmicSpeak(b), b64)
  log(`SPEAK ${id} (${d.toFixed(1)}s)`)
  return d
}
// wait until Eira has been quiet for `quiet` ms (after at least `min` ms), capped at `max` ms
const waitQuiet = async (min, max, quiet = 1500) => {
  const t0 = Date.now()
  let lastSpeak = Date.now()
  while (Date.now() - t0 < max) {
    const v = await view()
    if (v.speaking) lastSpeak = Date.now()
    if (Date.now() - t0 > min && Date.now() - lastSpeak > quiet) break
    await page.waitForTimeout(250)
  }
  const v = await view()
  log(`  eira: "${v.eira.slice(0, 140)}" tools=${JSON.stringify(v.tools.map((t) => t.name ?? t))}`)
}
const waitFor = async (pred, max, label) => {
  const t0 = Date.now()
  while (Date.now() - t0 < max) {
    const s = await snap()
    if (pred(s)) {
      log(`  ${label}: ok (${((Date.now() - t0) / 1000).toFixed(1)}s) stage=${s.stage}`)
      return true
    }
    await page.waitForTimeout(500)
  }
  log(`  ${label}: TIMEOUT stage=${(await snap()).stage}`)
  return false
}

// v2 opening: director camera (shrine ring → valley vista → watchpost forge → settle behind the pair, ~19.5 s) while Eira greets.
const director = (keys) => page.evaluate((k) => globalThis.__hollowmere.director(k), keys)
if (process.env.SEQ !== 'test') {
  await director([
    { pos: [36, 4.8, 0], look: [24, 3, -14], t: 0 }, { pos: [30, 5, -5], look: [24, 2.8, -14], t: 6 },
    { pos: [40, 7.5, 16], look: [-8, 3, -40], t: 0 }, { pos: [34, 7, 10], look: [-8, 3, -42], t: 6 },
    { pos: [0, 5.5, 28], look: [-18, 2.5, 10], t: 0 }, { pos: [-4, 6, 30], look: [-16, 2.2, 12], t: 5 },
    { pos: [1.25, 3.6, 53.5], look: [1.25, 1.6, 43.6], t: 2.5 },
  ])
  log('director opening')
}
await waitQuiet(4000, 20000) // greeting
if (process.env.SEQ !== 'test') await page.waitForTimeout(Math.max(0, 20500 - (Date.now() - T0)))
if (process.env.SEQ === 'test') {
  await speak('t1'); await waitQuiet(5000, 25000)
  await speak('t2'); await waitQuiet(5000, 20000)
} else {
await speak('k1') // walk us to the shrine (background move_to while she talks)
// Interrupt only once her move_to has actually landed (she speaks first, calls the tool a beat later); cutting in before
// that leaves the model with one pending plan, and it walks to the shrine anyway.
{
  const t0 = Date.now()
  while (Date.now() - t0 < 8000 && !(await view()).tools.some((t) => (t.name ?? t.summary ?? '').toString().includes('move_to'))) await page.waitForTimeout(200)
  await page.waitForTimeout(Number(process.env.INT_MS ?? 900))
}
await speak('k2') // INTERRUPT mid-sentence: stop, go to the blacksmith instead
await waitQuiet(4000, 20000)
await speak('k3') // style change: old bard
await waitQuiet(4000, 20000)
await waitFor((s) => s.stage !== 'arrive' && s.stage !== 'seek_brann', 50000, 'reached Brann')
await waitQuiet(1500, 15000)
await speak('k4') // ask him about the barrow
await waitQuiet(5000, 25000)
await speak('k5') // what's in my pack?
await waitQuiet(4000, 20000)
// end beat: crane up from the forge fire over the valley toward the shrine
await director([
  { pos: [-15.2, 3.4, 19.6], look: [-12.4, 1.7, 13.8], t: 0 }, { pos: [-10, 5.5, 22], look: [-12.6, 2.2, 13.8], t: 4 }, { pos: [-4, 10, 28], look: [8, 2, -12], t: 5 },
])
log('end beat')
await page.waitForTimeout(9500)
}
await page.waitForTimeout(1500)
log('final snapshot', JSON.stringify(await snap()))
log('fps', await page.evaluate(() => globalThis.__hollowmere.game.ui.state.fps))
await page.evaluate(() => globalThis.__recStop())
await page.waitForTimeout(1500)
await page.evaluate(() => globalThis.__hollowmere.companion.disconnect())
const video = page.video()
await ctx.close()
const vp = await video.path()
fs.renameSync(vp, path.join(outDir, 'video.webm'))
await browser.close()
log('done')
