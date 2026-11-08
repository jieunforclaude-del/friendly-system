const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36', viewport: { width: 1280, height: 2000 }, locale: 'ko-KR' });
  const api = [];
  p.on('response', async r => { const u = r.url(); if (/json|api|Ajax|ajax|\.yb\?|list/i.test(u) && r.request().resourceType() !== 'script') api.push(u); });
  await p.goto(process.argv[2], { waitUntil: 'networkidle', timeout: 60000 }).catch(e => console.log('goto', e.message));
  await p.waitForTimeout(4000);
  for (let i = 0; i < 4; i++) { await p.mouse.wheel(0, 3000); await p.waitForTimeout(1200); }
  const txt = await p.evaluate(() => document.body.innerText);
  require('fs').writeFileSync(process.argv[3], txt);
  console.log('API:', [...new Set(api)].slice(0, 15).join('\n'));
  await b.close();
})();
