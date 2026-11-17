import { recorder, beat, insert } from './capture-common.mjs';

const r = await recorder('desktop');
try {
  const phase = process.env.PHASE;
  const shots = {
    event: ['S3-00', '[contenteditable="true"]', '', 'Live production interaction'],
    workspace: ['S1-04', '.explorer-viewlet', '', 'Both claims repositories are open in one workspace'],
    deepwiki: ['S1-05', '[aria-label="DeepWiki"]', '', 'DeepWiki is available in the workspace'],
    acp: ['PREP-ACP', '[role="menu"]', 'Codex', 'Devin Local, Codex and OpenCode are available'],
    agent: ['S2-02', 'button[aria-label="Choose an agent"]', '', 'Devin Local works in this multi-root workspace'],
    mode: ['S2-03', 'button[aria-label="Mode"]', '', 'Plan mode before implementation'],
    fusion: ['S2-04', 'button', 'Fusion', 'Fusion plans across the portal and service'],
    prompt: ['S2-05', '[contenteditable="true"]', '', 'Plan the issue with acceptance criteria and parallel tasks'],
    questions: ['S2-05q', '[data-aad="question"]', '', 'Devin asks for clarification before drafting the plan'],
    criteria: ['S2-06', '.monaco-editor', '', 'The saved plan has acceptance criteria'],
    tasks: ['S2-07', '.monaco-editor', '', 'A numbered task list identifies parallel work'],
    edit: ['S2-08', '.monaco-editor', '', 'Edit one acceptance criterion before implementation'],
    approval: ['S2-09', 'button', 'Yes, implement plan and accept edits', 'Review the implementation control without starting work'],
  };
  if (phase === 'prompt' && process.env.ISSUE_URL) {
    await r.p.click('[contenteditable="true"]');
    await insert(r.p, `Plan GitHub issue ${process.env.ISSUE_URL} across claims-service and claims-portal. Follow both AGENTS.md files. Save a Markdown plan with acceptance criteria and a numbered task list, and identify which tasks can run in parallel. Present the plan for approval; do not begin implementation until I approve.`);
  }
  if (phase === 'edit' && process.env.EDIT_TEXT) {
    await r.p.key('End');
    await insert(r.p, process.env.EDIT_TEXT);
    await r.p.key('Control+s');
  }
  if (phase === 'approval' && !process.env.FILTER) {
    await r.p.evaluate(() => {
      const button = [...document.querySelectorAll('button')].find(e => e.getBoundingClientRect().width && e.textContent === 'Yes, implement plan and accept edits');
      button?.scrollIntoView({ block: 'center', behavior: 'instant' });
    });
  }
  const shot = shots[phase];
  if (!shot) throw new Error(`Unknown phase: ${phase}`);
  await beat(r, process.env.ID || shot[0], process.env.SELECTOR || shot[1], process.env.FILTER || shot[2], process.env.CAP || shot[3]);
  if (phase === 'prompt' && process.env.SEND === '1') await r.p.click('button[aria-label="Send"]');
} finally {
  r.close();
}
