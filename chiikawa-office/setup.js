#!/usr/bin/env node
// ~/.claude/settings.json 에 치이카와 오피스 훅을 추가(또는 --remove 로 제거)
const fs = require('fs');
const os = require('os');
const path = require('path');

const MARK = 'chiikawa-office';
const file = path.join(os.homedir(), '.claude', 'settings.json');
const cmd = `node "${path.join(__dirname, 'hook.js')}" ${MARK}`;
const TOOL_EVENTS = ['PreToolUse', 'PostToolUse'];
const EVENTS = ['SessionStart', 'UserPromptSubmit', ...TOOL_EVENTS, 'Notification', 'Stop', 'SubagentStop', 'SessionEnd'];
const remove = process.argv.includes('--remove');

let settings = {};
if (fs.existsSync(file)) {
  try {
    settings = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    console.error(`settings.json 을 읽을 수 없어요 (JSON 오류): ${e.message}`);
    process.exit(1);
  }
  fs.copyFileSync(file, `${file}.bak-${MARK}`);
} else {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

settings.hooks = settings.hooks || {};
for (const ev of EVENTS) {
  // 예전에 넣은 치이카와 훅은 지우고 (중복 방지)
  const groups = (settings.hooks[ev] || [])
    .map((g) => ({ ...g, hooks: (g.hooks || []).filter((h) => !String(h.command || '').includes(MARK)) }))
    .filter((g) => g.hooks.length);
  if (!remove) {
    const group = { hooks: [{ type: 'command', command: cmd, timeout: 5 }] };
    if (TOOL_EVENTS.includes(ev)) group.matcher = '*';
    groups.push(group);
  }
  if (groups.length) settings.hooks[ev] = groups;
  else delete settings.hooks[ev];
}
if (!Object.keys(settings.hooks).length) delete settings.hooks;

fs.writeFileSync(file, JSON.stringify(settings, null, 2) + '\n');
console.log(remove ? '훅을 제거했어요.' : `훅 설치 완료! (${file})`);
console.log('이미 켜져 있는 Claude Code 세션은 재시작해야 반영돼요.');
