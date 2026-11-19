import json
from pathlib import Path

root = Path('/home/ubuntu/work/aad-human')
path = root / 'final-accepted-inventory.json'
data = json.loads(path.read_text())
for number, stem in [(33, 'master-fix-mcps33'), (46, 'master-fix-stats03')]:
    source = data['lines'][number-1]['sources'][0]
    take_path = root / 'takes' / (stem+'.json')
    take = json.loads(take_path.read_text())
    entry = take['lines'][0]
    start = entry['actionStart']
    duration = source['voice'][1]-source['voice'][0]
    source.update(stem=stem, source=[start,start+duration], sidecar=str(take_path),
        gateManifest=str(root/'qa'/f'{stem}-line{number}-gate.json'), midpoint=entry['qaFrame'],
        review='Personally opened all phrase gates: settled readable native UI, navigation before voice. Single session-stats output after Ctrl+L for46; matching3430,450 outgoing pointer for33. Native CLI session label accepted by user.')
    take['status'] = 'accepted-gated'
    take['personalReview'] = source['review']
    take_path.write_text(json.dumps(take,indent=2)+'\n')
source = data['lines'][27]['sources'][0]
if not source.get('tooltipTrimFrames'):
    source['source'] = [time+4/30 for time in source['source']]
    source['tooltipTrimFrames'] = 4
    source['review'] += ' Final-file tooltip measured47frames before trim. Trim4 native source frames, leaving43frames (1.433s); diff/help-page subject unobscured.'
path.write_text(json.dumps(data,indent=2)+'\n')
table = ['# Final source table', '', '| Line | Take | Window | Voice seconds | Source seconds |', '|---|---|---|---|---|']
for entry in data['lines']:
    for source in entry['sources']:
        table.append(f"| {entry['line']} | {source['stem']} | {source['window']} | {source['voice'][0]:.6f}–{source['voice'][1]:.6f} | {source['source'][0]:.6f}–{source['source'][1]:.6f} |")
(root/'final-source-table.md').write_text('\n'.join(table)+'\n')
print('UPDATED: line33 pointer-matched retake, line46 single output, line28 four-frame tooltip trim.')
