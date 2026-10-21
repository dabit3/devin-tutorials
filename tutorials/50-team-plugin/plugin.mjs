// The real "Orbit Team" plugin content entered on camera in tutorial 50.
export const NAME = 'Orbit Team';
export const SKILL = {
  name: 'ship-check',
  desc: 'Use before opening a pull request in an Orbit repo.',
  body: '1. Run `npm ci`, then `npm run lint` and `npm run build`.\n2. Fix anything that fails and run the checks again.\n3. In the pull request, add a "How I tested" section that lists each command and its result.',
};
export const RULE = {
  name: 'orbit-pr-style',
  content: 'Start every pull request title with [orbit]. Keep each pull request to one change.',
};
export const MCP = `{
  "mcpServers": {
    "deepwiki": { "url": "https://mcp.deepwiki.com/mcp" }
  }
}`;
export const HOOKS = `{
  "PreToolUse": [
    {
      "matcher": "exec",
      "hooks": [{ "type": "command", "command": "grep -q 'push --force' && { echo 'orbit-team: force-push is blocked' >&2; exit 2; } || exit 0" }]
    }
  ]
}`;
