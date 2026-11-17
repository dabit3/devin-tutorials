import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const story = [
  ['desktop', ['PREP-ACP']],
  ['web', [
    'S1-01', 'S1-02-adjuster-desktop', 'S1-02-claims-portal',
    'S1-02-claims-service', 'S1-02-field-adjuster-ios', 'S1-03-final',
  ]],
  ['desktop', ['S1-04', 'S1-05']],
  ['web', ['S2-01']],
  ['desktop', [
    'S2-02', 'S2-03', 'S2-04', 'S2-05', 'S2-05q',
    ...Array.from({ length: 12 }, (_, i) => `S2-clean-${String(i + 1).padStart(2, '0')}`),
    'S2-08-before', 'S2-08', 'S2-09-toolbar', 'S2-09-restored',
    'S3-01-scoped-approval',
  ]],
  ['cli', [
    'S3-CLI-ready', 'S3-CLI-plan', 'S3-CLI-handoff-command', 'S3-CLI-ubuntu',
    'S3-CLI-handoff-connected', 'S3-CLI-cloud-agent', 'S3-CLI-cloud-url-final',
  ]],
  ['desktop', ['S3-03-cloud-docs', 'S3-mixed-complete']],
  ['web', ['S3-cloud-web']],
  ['desktop', [
    'S4-01-codex', 'S4-real-edits-readable', 'S4-opencode-steering', 'S4-opencode-corrected',
    'S5-02-edit-verified', 'S5-03-update-verified', 'S5-05-stop-verified', 'S5-correction-continued',
  ]],
  ['cli', ['S5-btw-complete']],
  ['desktop', [
    'S5-portal-handoff-prompt', 'S5-portal-platform', 'S5-portal-platform-retry',
    'S5-portal-cloud-pickup', 'S5-portal-PR-result',
    'S6-marketplace', 'S6-plugin-installed', 'S6-mcps', 'S6-hooks',
    'S6-rules-agents-clean', 'S6-create-skill-prompt', 'S6-skill-file', 'S6-skill-listed',
    'S7-codemap-final',
  ]],
  ['web', ['S7-browser-upload-result']],
  ['desktop', [
    'S7-browser-session-evidence', 'S8-service-findings', 'S8-service-review-chat-proposal',
    'S8-service-commit-draft', 'S8-service-ready', 'S8-service-merged',
    'S8-portal-review', 'S8-portal-merged-steady', 'S9-model-picker',
  ]],
  ['cli', ['S9-cli-stats']],
  ['desktop', ['S9-desktop-usage-home']],
  ['web', [
    'S9-web-model-allowlist', 'S9-web-mcp-registry', 'S9-web-acp-registry',
    'S9-web-agent-hooks', 'S9-web-usage-limits',
  ]],
];

const captions = {
  'S3-CLI-ready': 'Actual Devin CLI welcome and prompt in claims-service',
  'S3-CLI-plan': 'Real service-track S1–S6 prompt references the complete saved plan and requires cloud-only implementation',
  'S3-CLI-handoff-command': 'Actual /handoff task and cloud platform chooser',
  'S3-CLI-ubuntu': 'Ubuntu is the selected cloud platform',
  'S3-CLI-handoff-connected': 'Actual Ubuntu handoff reaches Connect to session',
  'S3-CLI-cloud-agent': 'Directory-scoped local Sessions list above the actual active cloud-agent pane reporting mirror configuration and compilation',
  'S6-plugin-installed': 'Official DeepWiki installed for myself; its Enabled toggle is not proof of an active MCP connection',
  'S6-mcps': 'Desktop MCPs lists DeepWiki with Not connected status',
  'S8-service-findings': 'Actual Desktop Review summary for PR16: zero active findings and two invalidated findings',
};
const targets = {
  'S3-03-cloud-docs': { hlBox: { x: 820, y: 340, w: 780, h: 350 }, highlightTarget: 'Submitted cloud release-notes task' },
  'S4-01-codex': { hlBox: { x: 745, y: 390, w: 940, h: 300 }, highlightTarget: 'Codex proxy implementation and test plan' },
  'S3-mixed-complete': { hlBox: { x: 280, y: 423, w: 390, h: 306 }, highlightTarget: 'Five pinned Local, Cloud, Codex and OpenCode sessions' },
  'S5-05-stop-verified': { hlBox: { x: 425, y: 510, w: 300, h: 35 }, highlightTarget: 'Devin is awaiting instructions after Stop' },
  'S8-service-findings': { hlBox: { x: 958, y: 640, w: 855, h: 175 }, highlightTarget: 'All three bug counters: zero active, zero fixed, two invalidated' },
};
const beats = [];
for (const [surface, ids] of story) {
  const raw = JSON.parse(fs.readFileSync(path.join(root, 'shots', surface, 'beats.json')));
  for (const id of ids) {
    const matches = raw.filter(beat => beat.id === id);
    if (matches.length !== 1) throw new Error(`${surface}:${id}: expected one take, found ${matches.length}`);
    const beat = matches[0];
    const img = `${surface}/${beat.img}`;
    if (!fs.existsSync(path.join(root, 'shots', img))) throw new Error(`Missing ${img}`);
    beats.push({ ...beat, ...targets[id], img, cap: captions[id] || beat.cap || id });
  }
}
if (new Set(beats.map(beat => beat.id)).size !== beats.length) throw new Error('Duplicate curated beat ID');
fs.writeFileSync(path.join(root, 'shots', 'production-beats.json'), `${JSON.stringify(beats, null, 1)}\n`);
const targetLabels = {
  'S3-CLI-ready': 'CLI welcome/prompt in claims-service',
  'S3-CLI-plan': 'Read the complete plan task prompt',
  'S3-CLI-handoff-command': '/handoff task text',
  'S3-CLI-ubuntu': 'Ubuntu option',
  'S3-CLI-handoff-connected': 'Connect to session confirmation',
  'S3-CLI-cloud-agent': 'Active cloud-agent row, not the local Sessions list',
  'S8-service-findings': 'Bugs summary: no active findings; two invalidated findings',
  'S8-service-review-chat-proposal': 'Review chat proposal and cannot-run-or-push limitation',
  'S8-service-commit-draft': 'Commit Changes modal and exact proposed row-lock fix',
  'S8-service-ready': 'Ready to merge and green checks',
  'S8-service-merged': 'Merged badge on claims-service PR #16',
  'S8-portal-review': 'Critical unauthenticated-upload finding before the approved demo merge',
  'S8-portal-merged-steady': 'Merged badge on PR #40; unresolved Critical finding remains visible',
  'S9-model-picker': 'Adaptive and Fusion choices in the actual Local model picker',
  'S9-cli-stats': 'Session stats and completed-turn token counts',
  'S9-desktop-usage-home': 'Daily quota and the surrounding Desktop usage popover',
  'S9-web-model-allowlist': 'Model routing and provider allowlists',
  'S9-web-mcp-registry': 'MCP registry controls, not an active connection',
  'S9-web-acp-registry': 'ACP registry configuration entry point only',
  'S9-web-agent-hooks': 'Agent hooks dialog: empty field with example placeholder',
  'S9-web-usage-limits': 'Actual Usage limits heading, Batch limit and Message usage limit',
};
const cell = value => String(value).replaceAll('|', '\\|').replace(/\r?\n/g, ' ');
const rows = beats.map(beat => {
  const target = targetLabels[beat.id] || (beat.id.startsWith('S2-clean-') ? 'Unclipped saved plan editor cut' : beat.highlightTarget);
  return `| ${cell(beat.id)} | shots/${cell(beat.img)} | ${cell(beat.cap || beat.id)} | ${cell(target)} |`;
});
fs.writeFileSync(path.join(root, 'production-beat-list.md'), [
  '# Final curated live-product beats — story order',
  '',
  'All selected frames were opened and visually inspected during capture. This is a story-order still manifest, not a finished film. Highlights remain metadata, not baked PNG artwork. See production-final.md for limitations and rejected takes.',
  '',
  '| Beat ID | Frame path | What is on screen | Highlight target |',
  '|---|---|---|---|',
  ...rows,
  '',
].join('\n'));
console.log(`Selected ${beats.length} visually reviewed live-product beats in story order; wrote shots/production-beats.json and production-beat-list.md.`);
