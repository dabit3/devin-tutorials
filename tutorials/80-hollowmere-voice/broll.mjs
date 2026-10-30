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
// 1. valley flight (new angles): along the mere toward the barrow, then over the pines to the cold shrine
await page.waitForTimeout(2500)
await director([
  { pos: [44, 9, 30], look: [-10, 2, -30], t: 0 }, { pos: [26, 8, 36], look: [-14, 2, -34], t: 7 },
  { pos: [-30, 12, -10], look: [-60, 4, -60], t: 0 }, { pos: [-36, 10, -22], look: [-62, 3, -62], t: 6 },
  { pos: [14, 4.2, -8], look: [24, 2.4, -14], t: 0 }, { pos: [20, 3.6, -6], look: [25, 2.2, -14], t: 5 },
])
log('flight'); await page.waitForTimeout(18500)
// 2. the barrow: walk, fight the wight (frost hit), loot the ember-stone
await run('walk to the barrow')
await waitStage((s) => s.stage === 'wight' || s.stage === 'loot_ember', 120000, 'at the barrow')
await page.waitForTimeout(2500)
for (let i = 0; i < 6; i++) { await run(i % 2 ? 'attack the wight' : 'cast frost at the wight'); await page.waitForTimeout(3200)
  const s = await snap(); if (s.stage !== 'wight') break }
await waitStage((s) => s.stage !== 'wight', 60000, 'wight down')
await page.waitForTimeout(2000)
await run('loot the chest'); await page.waitForTimeout(6000)
// 3. relight: back to the shrine, the ending shot (relit brazier, runes glowing)
await run('put the ember stone in the brazier')
await waitStage((s) => s.stage === 'done' || s.stage === 'ending' || s.stage === 'relit', 150000, 'relit')
await page.waitForTimeout(16000)
log('final', JSON.stringify(await snap()), 'fps', await page.evaluate(() => globalThis.__hollowmere.game.ui.state.fps))
const video = page.video(); await ctx.close(); const vp = await video.path(); fs.renameSync(vp, path.join(outDir, 'video.webm')); await browser.close(); log('done')
