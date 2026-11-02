// Probe: does change_voice reconnect Eira in a new voice? Logs every data-channel event type around the switch.
import { createRequire } from 'node:module'
const req = createRequire(import.meta.url)
const { chromium } = req(process.env.PLAYWRIGHT_CORE ?? '/Users/devin/hm-tools/node_modules/playwright-core')
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal', '--ignore-gpu-blocklist', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', '--autoplay-policy=no-user-gesture-required'] })
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
page.on('console', (m) => { if (m.type() !== 'log') console.log('  console', m.type(), m.text().slice(0, 300)) })
page.on('pageerror', (e) => console.log('  pageerror', String(e).slice(0, 300)))
await page.goto('http://localhost:8081/?cine=1', { waitUntil: 'networkidle' })
await page.waitForFunction(() => globalThis.__hollowmere?.game?.ui?.state?.ready === true, null, { timeout: 120000 })
await page.getByText('Begin').click()
await page.waitForFunction(() => globalThis.__hollowmere?.companion?.view?.status === 'live', null, { timeout: 60000 })
console.log('live')
await page.waitForTimeout(6000)
await page.evaluate(() => {
  const c = globalThis.__hollowmere.companion
  globalThis.__ev = []
  const orig = c.onMessage.bind(c)
  c.onMessage = (d) => { try { const m = JSON.parse(d); globalThis.__ev.push(`${Date.now() % 100000} ${m.type}${m.type === 'error' ? ' ' + JSON.stringify(m.error).slice(0, 200) : ''}`) } catch {}; return orig(d) }
  globalThis.__ev.push('--- changeVoice(willow) ---')
  c.changeVoice('willow')
})
for (let i = 0; i < 12; i++) {
  await page.waitForTimeout(2000)
  const v = await page.evaluate(() => { const c = globalThis.__hollowmere.companion; return { status: c.view.status, voice: c.view.voice, error: c.view.error, eira: c.view.eiraLine?.slice(0, 80), dc: c.dc?.readyState, pc: c.pc?.connectionState, audioEls: document.querySelectorAll('audio[data-coach]').length } })
  console.log(i * 2 + 's', JSON.stringify(v))
}
console.log((await page.evaluate(() => globalThis.__ev)).join('\n'))
await browser.close()
