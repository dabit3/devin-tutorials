import { recorder, beat } from './capture-common.mjs';

const r = await recorder('web');
try {
  const phase = process.env.PHASE;
  if (process.env.URL) {
    await r.p.goto(process.env.URL);
  }
  if (phase === 'connections') {
    await r.p.wait(() => document.body.innerText.includes('GitHub') && document.body.innerText.includes('Connected'));
    await r.p.evaluate(() => {
      const label = [...document.querySelectorAll('h4')].find(e => e.textContent === 'GitHub');
      label.parentElement.parentElement.dataset.aad = 'github';
    });
  }
  if (process.env.PHASE === 'architecture') {
    await r.p.wait(() => document.querySelector('main svg[id]') && !document.body.innerText.includes('Loading diagram'));
    await r.p.evaluate(() => document.querySelector('button.rounded-full')?.click());
    await r.p.evaluate(() => document.querySelector('main svg[id]').scrollIntoView({ block: 'center', behavior: 'instant' }));
  }
  if (process.env.PHASE === 'indexed') {
    await r.p.wait(() => ['adjuster-desktop', 'claims-portal', 'claims-service', 'field-adjuster-ios'].every(repo => document.querySelector(`main a[href$="/${repo}"]`)?.textContent.includes('1 branch indexed')));
    for (const repo of ['adjuster-desktop', 'claims-portal', 'claims-service', 'field-adjuster-ios']) {
      await beat(r, `S1-02-${repo}`, `main a[href$="/${repo}"]`, repo, `${repo}: one branch indexed`);
    }
    r.close();
    process.exit(0);
  }
  if (phase === 'issue') await r.p.wait(() => document.body.innerText.includes('Adjusters need to see the attached photos and documents.'));
  const shots = {
    event: ['S3-WEB', 'h1', '', 'Live cloud session'],
    connections: ['S1-01', '[data-aad="github"]', 'GitHub', 'GitHub is connected to the filming account'],
    indexed: ['S1-02', 'main', '', 'The four claims repositories are indexed'],
    architecture: ['S1-03', 'main svg[id]', '', 'The real claims-service architecture diagram'],
    issue: ['S2-01', 'h1', '', 'The customer attachment issue starts with two plain sentences'],
  };
  const shot = shots[phase];
  if (!shot) throw new Error(`Unknown phase: ${phase}`);
  await beat(r, process.env.ID || shot[0], process.env.SELECTOR || shot[1], process.env.FILTER || shot[2], process.env.CAP || shot[3]);
} finally {
  r.close();
}
