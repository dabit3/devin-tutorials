// Cutaway recorder for the v7 cold open: the cold shrine brazier (under Brann's 'the shrine-fire went out') and a low dolly on the
// Blender barrow doorway (under his barrow answer). ?nolive=1&cine=1, director camera only; wall-clock timings logged for conforming.
// No GPT-Live (?nolive=1): typed commands through the game's own command path (__hollowmere.run), the director camera for the flight,
// real gameplay rendering in headless Chrome (Metal). Logs stage changes with timestamps so the cut can be picked from the log.
// usage: PLAYWRIGHT_CORE=... node broll.mjs [outDir]
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module'
const req = createRequire(import.meta.url)
const { chromium } = req(process.env.PLAYWRIGHT_CORE ?? '/Users/devin/hm-tools/node_modules/playwright-core')
const outDir = process.argv[2] ?? path.join(path.dirname(new URL(import.meta.url).pathname), 'live', 'cut7')
fs.mkdirSync(outDir, { recursive: true })
const T = Date.now(); const lines = []
const log = (...a) => { const s = `[${((Date.now() - T) / 1000).toFixed(1)}] ${a.join(' ')}`; console.log(s); lines.push(s); fs.writeFileSync(path.join(outDir, 'log.txt'), lines.join('\n') + '\n') }
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true,
  args: ['--use-angle=metal', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] })
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1, recordVideo: { dir: outDir, size: { width: 1920, height: 1080 } } })
const page = await ctx.newPage()
page.on('pageerror', (e) => log('[pageerror]', String(e).slice(0, 200)))
await page.goto(process.env.URL ?? 'http://localhost:8081/?nolive=1&cine=1', { waitUntil: 'networkidle' })
await page.waitForFunction(() => globalThis.__hollowmere?.game?.ui?.state?.ready === true, null, { timeout: 120000 })
await page.waitForTimeout(1500)
await page.getByText('Begin').click(); log('begin')
const snap = () => page.evaluate(() => globalThis.__hollowmere.snapshot())
const run = async (t) => { const r = await page.evaluate((t) => JSON.stringify(globalThis.__hollowmere.run(t)?.result ?? null), t); log('run', t, '->', String(r).slice(0, 80)) }
const director = (k) => page.evaluate((k) => globalThis.__hollowmere.director(k), k)
const waitStage = async (pred, max, label) => { const t0 = Date.now(); let s = await snap()
  while (Date.now() - t0 < max && !pred(s)) { await page.waitForTimeout(400); s = await snap() }
  log(label, pred(s) ? 'ok' : 'TIMEOUT', 'stage=' + s.stage); return s }
await page.waitForTimeout(2500)
log('shot brazier')
await director([{ pos: [14.5, 5.2, -5.5], look: [24, 2.4, -14], t: 0 }, { pos: [16.8, 4.3, -7.6], look: [24, 2.3, -14], t: 7 }])
await page.waitForTimeout(7200)
log('shot barrow')
await director([{ pos: [-2.0, 4.3, -36.0], look: [-8, 4.3, -47.5], t: 0 }, { pos: [-5.6, 3.7, -41.0], look: [-8, 4.0, -47.5], t: 10 }])
await page.waitForTimeout(10200)
log('end')
const video = page.video(); await ctx.close(); const vp = await video.path(); fs.renameSync(vp, path.join(outDir, 'video.webm')); await browser.close(); log('done')
