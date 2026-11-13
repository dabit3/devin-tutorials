import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const dir = path.dirname(new URL(import.meta.url).pathname);
const spec = JSON.parse(fs.readFileSync(path.join(dir, 'sections.json'), 'utf8'));
const out = path.join(dir, 'build', 'titles');
fs.mkdirSync(out, { recursive: true });
const chrome = process.env.CHROME || 'google-chrome';
const shot = (name, params) => {
  const url = `file://${dir}/title.html#${new URLSearchParams(params)}`;
  execFileSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
    '--default-background-color=00000000', '--window-size=3840,2160', `--screenshot=${path.join(out, name)}`, url], { stdio: 'ignore' });
};
shot('open.png', { kind: 'card', text: spec.open });
shot('close.png', { kind: 'card', text: spec.close });
shot('tag.png', { kind: 'tag', text: spec.testTag });
spec.sections.forEach((s, i) => shot(`s${String(i + 1).padStart(2, '0')}.png`, { kind: 'pill', text: s.title }));
console.log('titles ->', out);
