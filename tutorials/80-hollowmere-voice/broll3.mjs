// B-roll 3: native-4K outro beat with the game's audio (director flight around the lit forge, then the valley).
// B-roll recorder for the intro teasers: unused shots only (valley flight, the barrow fight with the frost hit, the relit brazier).
// No GPT-Live (?nolive=1): typed commands through the game's own command path (__hollowmere.run), the director camera for the flight,
// real gameplay rendering in headless Chrome (Metal). Logs stage changes with timestamps so the cut can be picked from the log.
// usage: PLAYWRIGHT_CORE=... node broll.mjs [outDir]
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module'
const req = createRequire(import.meta.url)
const { chromium } = req(process.env.PLAYWRIGHT_CORE ?? '/Users/devin/hm-tools/node_modules/playwright-core')
const outDir = process.argv[2] ?? path.join(path.dirname(new URL(import.meta.url).pathname), 'live', 'broll')
fs.mkdirSync(outDir, { recursive: true })
const T = Date.now(); const lines = []
const log = (...a) => { const s = `[${((Date.now() - T) / 1000).toFixed(1)}] ${a.join(' ')}`; console.log(s); lines.push(s); fs.writeFileSync(path.join(outDir, 'log.txt'), lines.join('\n') + '\n') }
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true,
  args: ['--use-angle=metal', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] })
const ctx = await browser.newContext({ viewport: { width: 3840, height: 2160 }, deviceScaleFactor: 1, recordVideo: { dir: outDir, size: { width: 3840, height: 2160 } } })
await ctx.addInitScript(() => {
  const taps = new WeakMap(); const conn = AudioNode.prototype.connect
  const tap = (c) => { if (!taps.has(c)) { const d = c.createMediaStreamDestination(); taps.set(c, d); globalThis.__tap = d } ; return taps.get(c) }
  AudioNode.prototype.connect = function (...a) { const r = conn.apply(this, a); if (a[0] instanceof AudioDestinationNode) conn.call(this, tap(this.context)); return r }
  globalThis.__recStart = () => { const rec = new MediaRecorder(globalThis.__tap.stream, { mimeType: 'audio/webm;codecs=opus' })
    rec.ondataavailable = (e) => { const r = new FileReader(); r.onload = () => globalThis.__recChunk(r.result.split(',')[1]); r.readAsDataURL(e.data) }
    rec.start(1000); globalThis.__rec = rec; const f = document.createElement('div'); f.style.cssText = 'position:fixed;inset:0;background:#fff;z-index:99999'; document.body.appendChild(f); setTimeout(() => f.remove(), 160); return true }
  globalThis.__recStop = () => new Promise((res) => { globalThis.__rec.onstop = () => res(true); globalThis.__rec.stop() })
})
const page = await ctx.newPage()
const audioPath = path.join(outDir, 'audio.webm'); fs.writeFileSync(audioPath, '')
await page.exposeFunction('__recChunk', (b64) => fs.appendFileSync(audioPath, Buffer.from(b64, 'base64')))
page.on('pageerror', (e) => log('[pageerror]', String(e).slice(0, 200)))
await page.goto(process.env.URL ?? 'http://localhost:8081/?nolive=1&cine=1', { waitUntil: 'networkidle' })
await page.waitForFunction(() => globalThis.__hollowmere?.game?.ui?.state?.ready === true, null, { timeout: 120000 })
await page.waitForTimeout(1500)
await page.getByText('Begin').click(); log('begin'); await page.waitForTimeout(800); log('rec', await page.evaluate(() => globalThis.__recStart()))
const snap = () => page.evaluate(() => globalThis.__hollowmere.snapshot())
const run = async (t) => { const r = await page.evaluate((t) => JSON.stringify(globalThis.__hollowmere.run(t)?.result ?? null), t); log('run', t, '->', String(r).slice(0, 80)) }
const director = (k) => page.evaluate((k) => globalThis.__hollowmere.director(k), k)
const waitStage = async (pred, max, label) => { const t0 = Date.now(); let s = await snap()
  while (Date.now() - t0 < max && !pred(s)) { await page.waitForTimeout(400); s = await snap() }
  log(label, pred(s) ? 'ok' : 'TIMEOUT', 'stage=' + s.stage); return s }
// outro beat, native 4K: a slow move around the lit forge at the watchpost, then out over the valley toward the shrine
await page.waitForTimeout(3000)
await director([
  { pos: [-20, 3.2, 20], look: [-13, 2, 13], t: 0 }, { pos: [-12, 4.2, 23], look: [-13, 2.2, 13], t: 7 },
  { pos: [-6, 8, 26], look: [10, 2, -10], t: 6 },
])
log('outro flight'); await page.waitForTimeout(14500)
log('final', JSON.stringify(await snap()), 'fps', await page.evaluate(() => globalThis.__hollowmere.game.ui.state.fps))
await page.evaluate(() => globalThis.__recStop()); await page.waitForTimeout(1200); const video = page.video(); await ctx.close(); const vp = await video.path(); fs.renameSync(vp, path.join(outDir, 'video.webm')); await browser.close(); log('done')
