import json
from pathlib import Path

root = Path('/home/ubuntu/work/aad-human')
path = root / 'final-accepted-inventory.json'
data = json.loads(path.read_text())
for number, stem in [(18, 'master-fix-command'), (46, 'master-fix-stats02')]:
    entry = data['lines'][number - 1]
    take_path = root / 'takes' / (stem + '.json')
    take = json.loads(take_path.read_text())
    line = take['lines'][0]
    source = entry['sources'][0]
    duration = source['voice'][1] - source['voice'][0]
    start = line['actionStart']
    source.update(stem=stem, source=[start, start + duration],
                  sidecar=str(take_path),
                  gateManifest=str(root / 'qa' / f'{stem}-line{number}-gate.json'),
                  midpoint=line['qaFrame'],
                  review='Personally opened every new phrase gate. Genuine original resumed CLI, command/stats readable, pointer inside terminal throughout. Gray title at input separator is native ANSI-rendered CLI session label, not Konsole tooltip: authentic PTY logs contain the label and its background SGR escapes. No title/tab hover, loading, browser dropdown or toast. Original chooser/history sources retained for line18 remainder.')
    take['status'] = 'accepted-gated'
    take['personalReview'] = source['review']
    take_path.write_text(json.dumps(take, indent=2) + '\n')
path.write_text(json.dumps(data, indent=2) + '\n')
table = ['# Current final source table', '', 'Updated Konsole retakes for master repair. Native CLI title badges are not tooltips.', '', '| Line | Take | Window | Voice seconds | Source seconds |', '|---|---|---|---|---|']
for entry in data['lines']:
    for source in entry['sources']:
        table.append(f"| {entry['line']} | {source['stem']} | {source['window']} | {source['voice'][0]:.6f}–{source['voice'][1]:.6f} | {source['source'][0]:.6f}–{source['source'][1]:.6f} |")
(root / 'final-source-table.md').write_text('\n'.join(table) + '\n')
print('UPDATED source mappings: line18 command and line46 stats; existing chooser/history retained.')
