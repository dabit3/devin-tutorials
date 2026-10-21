// Build canonical shots/ from picks of segment captures: node tools/pick-shots.mjs seg:0000-0009 seg:0079 ...
import fs from 'fs';
const out = [], map = {};
for (const arg of process.argv.slice(2)) {
  const [seg, spec] = arg.split(':');
  const beats = JSON.parse(fs.readFileSync(`shots/${seg}/beats.json`, 'utf8'));
  const want = new Set();
  for (const part of (spec || '').split(',')) {
    if (!part) { beats.forEach(b => want.add(b.img)); continue; }
    const [a, b = a] = part.split('-').map(Number);
    for (let i = a; i <= b; i++) want.add(String(i).padStart(4, '0') + '.png');
  }
  for (const b of beats) if (want.has(b.img)) {
    const img = String(out.length).padStart(4, '0') + '.png';
    fs.copyFileSync(`shots/${seg}/${b.img}`, `shots/${img}`);
    map[img] = `${seg}/${b.img}`;
    out.push({ ...b, img, mark: b.mark ? `${seg}:${b.mark}` : undefined });
  }
}
fs.writeFileSync('shots/beats.json', JSON.stringify(out, null, 1));
fs.writeFileSync('shots/SEGMENTS.json', JSON.stringify(map, null, 1));
console.log('picked', out.length);
