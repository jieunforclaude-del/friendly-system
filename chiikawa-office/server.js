#!/usr/bin/env node
// 치이카와 오피스 — Claude Code 훅 이벤트를 받아 브라우저로 실시간 전달하는 작은 서버
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.CHIIKAWA_PORT) || 3141;
const clients = new Set();
const sessions = new Map(); // session_id -> 마지막 이벤트 (새로고침해도 상태 복원)

function slim(e) {
  const ti = e.tool_input || {};
  const file = ti.file_path || ti.notebook_path;
  let detail = file ? path.basename(file)
    : ti.command || ti.pattern || ti.query || ti.url || ti.description || '';
  detail = String(detail).replace(/\s+/g, ' ').slice(0, 60);
  return {
    session_id: e.session_id || 'unknown',
    event: e.hook_event_name || '',
    tool: e.tool_name || '',
    detail,
    cwd: e.cwd ? path.basename(e.cwd) : '',
    message: String(e.message || '').slice(0, 120),
    ts: Date.now(),
  };
}

function broadcast(ev) {
  const line = `data: ${JSON.stringify(ev)}\n\n`;
  for (const res of clients) res.write(line);
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/event') {
    let body = '';
    req.on('data', (d) => {
      body += d;
      if (body.length > 2e6) req.destroy();
    });
    req.on('end', () => {
      try {
        const ev = slim(JSON.parse(body));
        if (ev.event === 'SessionEnd') sessions.delete(ev.session_id);
        else sessions.set(ev.session_id, ev);
        broadcast(ev);
      } catch {}
      res.writeHead(204).end();
    });
    return;
  }

  if (req.method === 'GET' && req.url === '/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    res.write(': hi\n\n');
    for (const ev of sessions.values()) res.write(`data: ${JSON.stringify({ ...ev, replay: true })}\n\n`);
    clients.add(res);
    const ping = setInterval(() => res.write(': ping\n\n'), 20000);
    req.on('close', () => {
      clearInterval(ping);
      clients.delete(res);
    });
    return;
  }

  if (req.method === 'GET' && (req.url === '/' || req.url.startsWith('/?'))) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(path.join(__dirname, 'index.html')).pipe(res);
    return;
  }

  // 직접 넣은 캐릭터 그림: sprites/chiikawa.png 등
  const m = req.method === 'GET' && req.url.match(/^\/sprites\/([a-z-]+\.png)$/);
  if (m) {
    const file = path.join(__dirname, 'sprites', m[1]);
    if (fs.existsSync(file)) {
      res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'no-cache' });
      fs.createReadStream(file).pipe(res);
      return;
    }
  }

  res.writeHead(404).end();
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`🐹 치이카와 오피스 오픈! → http://localhost:${PORT}`);
});
