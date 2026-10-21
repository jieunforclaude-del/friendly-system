#!/usr/bin/env node
// Claude Code 훅에서 호출됨: stdin의 이벤트 JSON을 오피스 서버로 전달.
// 서버가 꺼져 있어도 Claude Code를 절대 막지 않도록 항상 조용히 exit 0.
const http = require('http');

const done = () => process.exit(0);
setTimeout(done, 1500);

let body = '';
process.stdin.on('data', (d) => (body += d));
process.stdin.on('end', () => {
  const req = http.request(
    {
      host: '127.0.0.1',
      port: Number(process.env.CHIIKAWA_PORT) || 3141,
      path: '/event',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      timeout: 800,
    },
    (res) => {
      res.resume();
      res.on('end', done);
    }
  );
  req.on('error', done);
  req.on('timeout', () => req.destroy());
  req.end(body);
});
