#!/usr/bin/env node
// OpenAI 이미지 API로 캐릭터 그림을 만들어 sprites/ 에 저장
//   node generate.js                 기본 그림 3장 (치이카와·하치와레·우사기)
//   node generate.js --poses         자세별 그림까지 (기본 그림을 참고해서 같은 모습으로)
//   node generate.js usagi --force   우사기만 다시 그리기
const fs = require('fs');
const path = require('path');

const KEY = process.env.OPENAI_API_KEY;
const BASE = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
const MODEL = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1';
const args = process.argv.slice(2);
const withPoses = args.includes('--poses');
const force = args.includes('--force');
const quality = (args.find((a) => a.startsWith('--quality=')) || '').split('=')[1] || 'medium';
const only = args.filter((a) => !a.startsWith('--'));
const OUT_DIR = path.join(__dirname, 'sprites');

// 캐릭터 이름을 넣으면 저작권 때문에 거절될 수 있어서 생김새로만 설명
const STYLE = 'Cute Japanese chibi mascot illustration in a soft hand-drawn manga style, thick warm dark-brown outline, ' +
  'flat pastel colors, tiny black oval eyes with a white highlight, pink blush on the cheeks, tiny mouth. ' +
  'Exactly one character, full body, front view, centered, feet touching the bottom of the image, ' +
  'no text, no props unless described, no ground shadow, transparent background.';
const CHARS = {
  chiikawa: 'A tiny round white hamster-like creature that is mostly head, two small round ears on top, stubby little arms and feet, shy and gentle.',
  hachiware: 'A tiny round white cat-like creature whose top of the head is blue-gray, split in the middle by a white upside-down V parting, blue-gray pointed cat ears, cheerful smile.',
  usagi: 'A tiny round pale-yellow rabbit-like creature with two long upright ears, round eyes, energetic slightly wild expression.',
};
const POSES = {
  type: 'arms stretched forward as if typing on a keyboard, focused (do not draw the keyboard)',
  read: 'holding an open green book in front of the body with both hands, reading',
  sit: 'standing still and thinking, head tilted a little',
  raise: 'raising one arm high to ask for something, mouth open',
  jump: 'jumping with both arms up in joy, eyes happily closed',
  sleep: 'dozing off, eyes closed, sleepy and relaxed',
  walk: 'walking toward the right side of the image, one foot forward',
};

async function call(endpoint, init) {
  const res = await fetch(`${BASE}/images/${endpoint}`, {
    ...init,
    headers: { Authorization: `Bearer ${KEY}`, ...(init.headers || {}) },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error?.message || `HTTP ${res.status}`);
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error('응답에 이미지가 없어요');
  return Buffer.from(b64, 'base64');
}

function generate(prompt) {
  return call('generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, prompt, size: '1024x1024', background: 'transparent', output_format: 'png', quality, n: 1 }),
  });
}

function edit(refFile, prompt) {
  const fd = new FormData();
  fd.append('model', MODEL);
  fd.append('prompt', prompt);
  fd.append('image', new Blob([fs.readFileSync(refFile)], { type: 'image/png' }), path.basename(refFile));
  fd.append('size', '1024x1024');
  fd.append('background', 'transparent');
  fd.append('quality', quality);
  return call('edits', { method: 'POST', body: fd });
}

async function make(file, label, fn) {
  if (fs.existsSync(file) && !force) return console.log(`  ⏭  ${label} — 이미 있음 (다시 그리려면 --force)`);
  process.stdout.write(`  🎨 ${label} 그리는 중… `);
  try {
    fs.writeFileSync(file, await fn());
    console.log('완료');
  } catch (e) {
    console.log(`실패: ${e.message}`);
  }
}

(async () => {
  if (!KEY) {
    console.log('OPENAI_API_KEY 가 없어요. https://platform.openai.com/api-keys 에서 키를 만든 뒤:');
    console.log('  macOS/Linux:  OPENAI_API_KEY=sk-... node generate.js');
    console.log('  Windows(PowerShell):  $env:OPENAI_API_KEY="sk-..."; node generate.js');
    process.exit(1);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const kinds = only.length ? only.filter((k) => CHARS[k]) : Object.keys(CHARS);
  if (!kinds.length) return console.log(`캐릭터 이름은 ${Object.keys(CHARS).join(', ')} 중에서 골라주세요.`);

  for (const k of kinds) {
    console.log(`\n${k}`);
    const baseFile = path.join(OUT_DIR, `${k}.png`);
    await make(baseFile, '기본', () => generate(`${STYLE}\n\nCharacter: ${CHARS[k]}`));
    if (!withPoses) continue;
    if (!fs.existsSync(baseFile)) { console.log('  기본 그림이 없어서 자세별 그림은 건너뛰어요'); continue; }
    for (const [pose, desc] of Object.entries(POSES)) {
      await make(path.join(OUT_DIR, `${k}-${pose}.png`), pose, () =>
        edit(baseFile, `The exact same character as the reference image, same art style, colors and proportions. ${desc}. ${STYLE}`));
    }
  }
  console.log('\n끝! 오피스 페이지를 새로고침하세요.');
})();
